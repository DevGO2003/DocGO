import asyncio
import json
import uuid
from datetime import datetime, timezone
from typing import Optional
import aiohttp
import io

from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
import logging
logging.basicConfig(level=logging.INFO)

from config import (
	get_kafka_bootstrap_servers,
	get_kafka_file_uploaded_topic,
	get_kafka_text_extracted_topic,
	get_kafka_document_classified_topic,
	get_kafka_contract_summary_topic,
	get_kafka_client_id,
)
from services.ai_processing_service import AIProcessingService
from schemas.contract_summary import ContractSummary
import google.generativeai as genai
from config import get_gemini_api_key


class AIKafkaWorker:
	def __init__(self):
		self.bootstrap_servers: str = get_kafka_bootstrap_servers()
		self.consumer_topic: str = get_kafka_file_uploaded_topic()
		self.text_extracted_topic: str = get_kafka_text_extracted_topic()
		self.document_classified_topic: str = get_kafka_document_classified_topic()
		self.contract_summary_topic: str = get_kafka_contract_summary_topic()
		self.client_id: str = get_kafka_client_id()
		self.consumer: Optional[AIOKafkaConsumer] = None
		self.producer: Optional[AIOKafkaProducer] = None
		self._task: Optional[asyncio.Task] = None
		self._stopping: bool = False
		self._file_cache = {}  # In-memory cache for file content
		
		# Initialize shared AI service to avoid multiple Gemini API configurations
		self.ai_service = AIProcessingService()

	async def start(self) -> None:
		if self.consumer is None:
			# Subscribe to multiple topics for the full AI pipeline
			topics = [
				self.consumer_topic,  # file.uploaded
				"ai.text.extraction.requested",
				"ai.text.extracted", 
				"ai.summary.creation.requested"
			]
			
			self.consumer = AIOKafkaConsumer(
				*topics,
				bootstrap_servers=self.bootstrap_servers,
				group_id=f"{self.client_id}-group",
				client_id=self.client_id,
				enable_auto_commit=True,
				auto_offset_reset="latest",
				value_deserializer=lambda v: json.loads(v.decode("utf-8")),
			)
			await self.consumer.start()
			logging.info(f"[AI_CONSUMER_STARTED] topics={topics} bootstrap={self.bootstrap_servers}")

		if self.producer is None:
			self.producer = AIOKafkaProducer(
				bootstrap_servers=self.bootstrap_servers,
				client_id=self.client_id,
				value_serializer=lambda v: json.dumps(v).encode("utf-8"),
				acks="all",
			)
			await self.producer.start()
			logging.info(f"[AI_PRODUCER_STARTED] bootstrap={self.bootstrap_servers}")

		self._stopping = False
		self._task = asyncio.create_task(self._consume_loop())

	async def stop(self) -> None:
		self._stopping = True
		if self._task:
			self._task.cancel()
			try:
				await self._task
			except asyncio.CancelledError:
				pass
			self._task = None

		if self.consumer:
			try:
				await self.consumer.stop()
			finally:
				self.consumer = None

		if self.producer:
			try:
				await self.producer.stop()
			finally:
				self.producer = None

	async def _consume_loop(self) -> None:
		assert self.consumer is not None
		async for msg in self.consumer:
			try:
				event = msg.value
				if not isinstance(event, dict):
					continue
				
				event_type = event.get("eventType")
				logging.info(f"[AI_CONSUME_EVENT] topic={self.consumer_topic} eventType={event_type} payload={json.dumps(event, ensure_ascii=False)}")
				
				if event_type == "FileUploaded":
					await self._handle_file_uploaded(event)
				elif event_type == "ai.text.extraction.requested":
					await self._handle_text_extraction_requested(event)
				elif event_type == "ai.text.extracted":
					await self._handle_text_extracted(event)
				elif event_type == "ai.summary.creation.requested":
					await self._handle_summary_creation_requested(event)
				else:
					logging.info(f"[AI_CONSUME_SKIP] Unhandled event type: {event_type}")
					
			except Exception:
				logging.exception("[AI_CONSUME_ERROR] error while consuming event")
				continue

	async def _handle_file_uploaded(self, event: dict) -> None:
		if not self.producer:
			return

		data = event.get("data", {})
		filename = data.get("filename") or ""
		filename_lower = filename.lower()
		content_type = (data.get("contentType") or "").lower()
		folder = (data.get("folder") or "").lower()
		file_url = data.get("fileUrl")

		try:
			# 1. Download file from URL if available
			file_content = None
			if file_url:
				file_content = await self._download_file_from_url(file_url)
				if not file_content:
					logging.warning(f"[AI_DOWNLOAD_FAILED] Could not download file from URL: {file_url}")
					return
			else:
				logging.warning(f"[AI_MISSING_URL] No fileUrl in event data: {data}")
				return

			# 2. Quick classification using filename and content type (no need to extract text yet)
			file_type = "GENERAL"
			confidence = 0.8
			
			# Enhanced contract detection
			contract_indicators = [
				"contract" in filename_lower,
				"hopdong" in filename_lower,
				"hợp đồng" in filename_lower,
				"hop-dong" in filename_lower,
				folder.startswith("contracts"),
				"hd" in filename_lower,
				content_type in ("application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
			]
			
			if any(contract_indicators):
				file_type = "CONTRACT"
				confidence = 0.9
				logging.info(f"[AI_CONTRACT_DETECTED] Contract detected for: {filename}")

			# 3. Publish classification event
			await self._publish_classified(event, data, file_type, confidence)
			
			# 4. If it's a contract, trigger the full AI pipeline
			if file_type == "CONTRACT":
				logging.info(f"[AI_CONTRACT_PIPELINE] Starting full AI pipeline for contract: {filename}")
				# Store file content for later use and trigger extract event
				await self._publish_text_extraction_request(event, data, file_content)
			else:
				logging.info(f"[AI_GENERAL_DOCUMENT] Document classified as general: {filename}")

		except Exception as e:
			logging.error(f"[AI_PROCESSING_ERROR] Error in AI processing: {e}", exc_info=True)
			await self._publish_error_event(event, data, str(e))

	async def _handle_text_extraction_requested(self, event: dict) -> None:
		"""
		Handle ai.text.extraction.requested event - extract text using Gemini
		"""
		if not self.producer:
			return
			
		data = event.get("data", {})
		file_id = data.get("fileId")
		filename = data.get("filename")
		content_type = data.get("contentType")
		file_url = data.get("fileUrl")
		
		if not all([file_id, filename, content_type]):
			logging.warning(f"[AI_EXTRACT_MISSING_DATA] Missing required data in extraction request: {data}")
			return
		
		logging.info(f"[AI_EXTRACT_START] fileId={file_id} filename={filename} contentType={content_type}")
		
		try:
			# Try to get file content from cache first
			file_content = None
			if hasattr(self, '_file_cache') and file_id in self._file_cache:
				file_content = self._file_cache[file_id]
				logging.info(f"[AI_FILE_CACHE_HIT] Retrieved file content from cache for {file_id}")
			elif file_url:
				# Fallback: download from URL
				file_content = await self._download_file_from_url(file_url)
				logging.info(f"[AI_FILE_DOWNLOAD_FALLBACK] Downloaded file content from URL for {file_id}")
			else:
				logging.error(f"[AI_EXTRACT_NO_CONTENT] No file content available for {file_id}")
				await self._publish_error_event(event, data, "No file content available")
				return
			
			if not file_content:
				logging.error(f"[AI_EXTRACT_NO_CONTENT] Could not get file content for {file_id}")
				await self._publish_error_event(event, data, "Could not get file content")
				return
			
			# Extract text using Gemini AI
			extracted_text = await self._extract_text_with_gemini(file_content, filename, content_type)
			
			if extracted_text:
				# Publish text extracted event
				await self._publish_text_extracted(event, data, "CONTRACT", extracted_text, 0.95)
				
				# Trigger summary creation
				await self._publish_summary_creation_request(event, data, extracted_text)
				
				# Clean up cache
				if hasattr(self, '_file_cache') and file_id in self._file_cache:
					del self._file_cache[file_id]
					logging.info(f"[AI_FILE_CACHE_CLEANUP] Removed file content from cache for {file_id}")
			else:
				logging.warning(f"[AI_EXTRACT_FAILED] Could not extract text from: {filename}")
				await self._publish_error_event(event, data, "Text extraction failed")
				
		except Exception as e:
			logging.error(f"[AI_EXTRACT_ERROR] Error in text extraction: {e}", exc_info=True)
			await self._publish_error_event(event, data, str(e))

	async def _handle_text_extracted(self, event: dict) -> None:
		"""
		Handle ai.text.extracted event - trigger summary creation
		"""
		if not self.producer:
			return
			
		data = event.get("data", {})
		extracted_text = data.get("extractedText")
		
		if not extracted_text:
			logging.warning(f"[AI_SUMMARY_MISSING_TEXT] No extracted text in event: {data}")
			return
		
		logging.info(f"[AI_SUMMARY_TRIGGER] Triggering summary creation for extracted text")
		
		try:
			# Trigger summary creation
			await self._publish_summary_creation_request(event, data, extracted_text)
		except Exception as e:
			logging.error(f"[AI_SUMMARY_TRIGGER_ERROR] Error triggering summary: {e}", exc_info=True)
			await self._publish_error_event(event, data, str(e))

	async def _handle_summary_creation_requested(self, event: dict) -> None:
		"""
		Handle ai.summary.creation.requested event - create summary using Gemini
		"""
		if not self.producer:
			return
			
		data = event.get("data", {})
		file_id = data.get("fileId")
		filename = data.get("filename")
		extracted_text = data.get("extractedText")
		
		if not all([file_id, filename, extracted_text]):
			logging.warning(f"[AI_SUMMARY_MISSING_DATA] Missing required data in summary request: {data}")
			return
		
		logging.info(f"[AI_SUMMARY_START] fileId={file_id} filename={filename}")
		
		try:
			# Create summary using Gemini
			summary_result = await self._create_summary_with_gemini(extracted_text, filename)
			
			if summary_result:
				# Publish summary created event
				await self._publish_summary_created(event, data, "CONTRACT", extracted_text)
				logging.info(f"[AI_SUMMARY_SUCCESS] Summary created for: {filename}")
			else:
				logging.warning(f"[AI_SUMMARY_FAILED] Could not create summary for: {filename}")
				await self._publish_error_event(event, data, "Summary creation failed")
				
		except Exception as e:
			logging.error(f"[AI_SUMMARY_ERROR] Error in summary creation: {e}", exc_info=True)
			await self._publish_error_event(event, data, str(e))

	async def _download_file_from_url(self, file_url: str) -> Optional[bytes]:
		"""
		Download file content from URL
		"""
		try:
			async with aiohttp.ClientSession() as session:
				async with session.get(file_url) as response:
					if response.status == 200:
						content = await response.read()
						logging.info(f"[AI_DOWNLOAD_SUCCESS] Downloaded {len(content)} bytes from {file_url}")
						return content
					else:
						logging.error(f"[AI_DOWNLOAD_FAILED] HTTP {response.status} from {file_url}")
						return None
		except Exception as e:
			logging.error(f"[AI_DOWNLOAD_ERROR] Error downloading from {file_url}: {e}")
			return None

	async def _extract_text_with_gemini(self, content: bytes, filename: str, content_type: str) -> str:
		"""
		Extract text from file content using basic extraction to avoid rate limiting
		"""
		try:
			# Use basic extraction without Gemini to avoid rate limiting
			# For now, use basic extraction and let the shared service handle Gemini calls
			if content_type == "application/pdf":
				# Basic PDF extraction first
				import io
				import PyPDF2
				
				pdf_file = io.BytesIO(content)
				pdf_reader = PyPDF2.PdfReader(pdf_file)
				
				raw_text = ""
				for page_num in range(len(pdf_reader.pages)):
					page = pdf_reader.pages[page_num]
					raw_text += page.extract_text() + "\n"
				
				if raw_text.strip():
					return raw_text.strip()
				else:
					return f"[PDF_NO_TEXT] Could not extract text from PDF {filename}"
					
			elif content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
				# Basic DOCX extraction first
				import io
				from docx import Document
				
				docx_file = io.BytesIO(content)
				doc = Document(docx_file)
				
				raw_text = ""
				for paragraph in doc.paragraphs:
					raw_text += paragraph.text + "\n"
				
				if raw_text.strip():
					return raw_text.strip()
				else:
					return f"[DOCX_NO_TEXT] Could not extract text from DOCX {filename}"
					
			elif content_type.startswith("text/"):
				# Plain text files
				return content.decode('utf-8', errors='ignore')
			else:
				# Try to decode as text for other types
				return content.decode('utf-8', errors='ignore')
				
		except Exception as e:
			logging.error(f"[AI_EXTRACT_ERROR] Error extracting text from {filename}: {e}")
			return f"[EXTRACT_ERROR] Error extracting text from {filename}: {str(e)}"

	async def _create_summary_with_gemini(self, extracted_text: str, filename: str) -> dict:
		"""
		Create contract summary using shared AI service to avoid rate limiting
		"""
		try:
			# Use shared AI service instead of creating new Gemini configuration
			summary_result = self.ai_service.generate_contract_summary(extracted_text, filename)
			
			if summary_result:
				logging.info(f"[AI_GEMINI_SUMMARY_SUCCESS] Summary created for: {filename}")
				return summary_result
			else:
				logging.warning(f"[AI_GEMINI_SUMMARY_FAILED] Could not create summary for: {filename}")
				return {"title": filename, "summary": "Không thể tạo tóm tắt tự động"}
				
		except Exception as e:
			logging.error(f"[AI_GEMINI_SUMMARY_ERROR] Error creating summary with Gemini for {filename}: {e}")
			return {"title": filename, "summary": f"Lỗi khi tạo tóm tắt: {str(e)}"}

	async def _extract_text_from_content(self, content: bytes, filename: str, content_type: str) -> str:
		"""
		Extract text from file content based on content type (legacy method)
		"""
		try:
			if content_type == "application/pdf":
				# TODO: Implement PDF text extraction
				# For now, return a placeholder
				return f"[PDF_CONTENT_PLACEHOLDER] Content from {filename} (PDF text extraction not implemented yet)"
			elif content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
				# TODO: Implement DOCX text extraction
				# For now, return a placeholder
				return f"[DOCX_CONTENT_PLACEHOLDER] Content from {filename} (DOCX text extraction not implemented yet)"
			elif content_type.startswith("text/"):
				# Plain text files
				return content.decode('utf-8', errors='ignore')
			else:
				# Try to decode as text for other types
				return content.decode('utf-8', errors='ignore')
		except Exception as e:
			logging.error(f"[AI_EXTRACT_ERROR] Error extracting text from {filename}: {e}")
			return ""

	async def _classify_document_with_gemini(self, content: str, filename: str, content_type: str) -> dict:
		"""
		Use shared AI service to classify document to avoid rate limiting
		"""
		try:
			# Use shared AI service instead of creating new Gemini configuration
			result = self.ai_service.classify_document(content, filename)
			return result
				
		except Exception as e:
			logging.error(f"[AI_CLASSIFY_ERROR] Error classifying document {filename}: {e}")
			return {"classification": "GENERAL", "confidence": 0.5, "reasoning": f"Error: {str(e)}"}

	async def _publish_text_extraction_request(self, event: dict, data: dict, file_content: bytes) -> None:
		"""
		Publish text extraction request event for contract processing
		"""
		if not self.producer:
			return
			
		try:
			# Store file content in memory cache instead of sending via Kafka
			file_id = data.get("fileId")
			if file_id:
				# Store in a simple in-memory cache (in production, use Redis)
				if not hasattr(self, '_file_cache'):
					self._file_cache = {}
				self._file_cache[file_id] = file_content
				logging.info(f"[AI_FILE_CACHED] Cached file content for {file_id}, size: {len(file_content)} bytes")
			
			extract_event = {
				"eventVersion": "v1",
				"eventType": "ai.text.extraction.requested",
				"eventId": uuid.uuid4().hex,
				"timestamp": datetime.now(timezone.utc).isoformat(),
				"source": "ai-processing-service",
				"correlationId": event.get("correlationId") or uuid.uuid4().hex,
				"actor": event.get("actor", {}),
				"data": {
					"fileId": data.get("fileId"),
					"filename": data.get("filename"),
					"contentType": data.get("contentType"),
					"fileSize": len(file_content),
					"key": data.get("key"),
					"bucket": data.get("bucket"),
					"fileUrl": data.get("fileUrl")  # Use URL instead of content
				},
				"metadata": {"serviceVersion": "1.0.0"}
			}
			
			await self.producer.send_and_wait("ai.text.extraction.requested", extract_event)
			logging.info(f"[AI_PUBLISH_SUCCESS] topic=ai.text.extraction.requested payload={json.dumps(extract_event, ensure_ascii=False)}")
		except Exception as e:
			logging.error(f"[AI_PUBLISH_ERROR] Failed to publish text extraction request: {e}")

	async def _publish_error_event(self, event: dict, data: dict, error_message: str) -> None:
		"""
		Publish error event when processing fails
		"""
		if not self.producer:
			return
			
		error_event = {
			"eventVersion": "v1",
			"eventType": "ai.processing.failed",
			"eventId": uuid.uuid4().hex,
			"timestamp": datetime.now(timezone.utc).isoformat(),
			"source": "ai-processing-service",
			"correlationId": event.get("correlationId") or uuid.uuid4().hex,
			"actor": event.get("actor", {}),
			"data": {
				"fileId": data.get("fileId"),
				"filename": data.get("filename"),
				"error": error_message,
				"key": data.get("key"),
				"bucket": data.get("bucket"),
			},
			"metadata": {"serviceVersion": "1.0.0"}
		}
		
		await self.producer.send_and_wait(
			self.text_extracted_topic, 
			error_event, 
			key=str(data.get("fileId") or data.get("key") or "").encode("utf-8")
		)
		logging.error(f"[AI_ERROR_PUBLISHED] {error_message}")

	async def _publish_text_extracted(self, event: dict, data: dict, file_type: str, extracted_text: str = None, confidence: float = 0.95) -> None:
		# Use provided extracted text or fallback to old method
		if not extracted_text:
			extracted_text = await self._extract_text_from_file(data)
		
		text_extracted_event = {
			"eventVersion": "v1",
			"eventType": "ai.text.extracted",
			"eventId": uuid.uuid4().hex,
			"timestamp": datetime.now(timezone.utc).isoformat(),
			"source": "ai-processing-service",
			"correlationId": event.get("correlationId") or uuid.uuid4().hex,
			"actor": event.get("actor", {}),
			"data": {
				"fileId": data.get("fileId"),
				"filename": data.get("filename"),
				"fileType": file_type,
				"extractedText": extracted_text,
				"extractionMethod": "AI/OCR",
				"confidence": confidence,
				"key": data.get("key"),
				"bucket": data.get("bucket"),
			},
			"metadata": {"serviceVersion": "1.0.0"}
		}
		await self.producer.send_and_wait(self.text_extracted_topic, text_extracted_event, key=str(data.get("fileId") or data.get("key") or "").encode("utf-8"))
		logging.info(f"[AI_PUBLISH_SUCCESS] topic={self.text_extracted_topic} payload={json.dumps(text_extracted_event, ensure_ascii=False)}")

	async def _publish_classified(self, event: dict, data: dict, file_type: str, confidence: float = 0.92) -> None:
		classified_event = {
			"eventVersion": "v1",
			"eventType": "ai.document.classified",
			"eventId": uuid.uuid4().hex,
			"timestamp": datetime.now(timezone.utc).isoformat(),
			"source": "ai-processing-service",
			"correlationId": event.get("correlationId") or uuid.uuid4().hex,
			"actor": event.get("actor", {}),
			"data": {
				"fileId": data.get("fileId"),
				"filename": data.get("filename"),
				"classification": file_type,
				"confidence": confidence,
				"categories": ["document", file_type.lower()],
				"key": data.get("key"),
				"bucket": data.get("bucket"),
			},
			"metadata": {"serviceVersion": "1.0.0"}
		}
		await self.producer.send_and_wait(self.document_classified_topic, classified_event, key=str(data.get("fileId") or data.get("key") or "").encode("utf-8"))
		logging.info(f"[AI_PUBLISH_SUCCESS] topic={self.document_classified_topic} payload={json.dumps(classified_event, ensure_ascii=False)}")

	async def _publish_summary_creation_request(self, event: dict, data: dict, extracted_text: str) -> None:
		"""
		Publish summary creation request event
		"""
		if not self.producer:
			return
			
		try:
			summary_request_event = {
				"eventVersion": "v1",
				"eventType": "ai.summary.creation.requested",
				"eventId": uuid.uuid4().hex,
				"timestamp": datetime.now(timezone.utc).isoformat(),
				"source": "ai-processing-service",
				"correlationId": event.get("correlationId") or uuid.uuid4().hex,
				"actor": event.get("actor", {}),
				"data": {
					"fileId": data.get("fileId"),
					"filename": data.get("filename"),
					"contentType": data.get("contentType"),
					"extractedText": extracted_text,
					"key": data.get("key"),
					"bucket": data.get("bucket")
				},
				"metadata": {"serviceVersion": "1.0.0"}
			}
			
			await self.producer.send_and_wait("ai.summary.creation.requested", summary_request_event)
			logging.info(f"[AI_PUBLISH_SUCCESS] topic=ai.summary.creation.requested payload={json.dumps(summary_request_event, ensure_ascii=False)}")
		except Exception as e:
			logging.error(f"[AI_PUBLISH_ERROR] Failed to publish summary creation request: {e}")

	async def _publish_summary_created(self, event: dict, data: dict, file_type: str, extracted_text: str = None) -> None:
		try:
			# Use provided extracted text or fallback to old method
			content = extracted_text or await self._extract_text_from_file(data)
			if not content:
				logging.warning(f"[AI_SUMMARY_FAILED] Could not extract content from file: {data.get('filename')}")
				return
			contract_summary = await self._generate_contract_summary(content, data.get('filename'))
			if not contract_summary:
				print(f"⚠️ AI could not generate summary for: {data.get('filename')}")
				return
		except Exception as e:
			print(f"❌ Error generating contract summary: {e}")
			contract_summary = self._create_fallback_summary(data)

		if "fileId" not in contract_summary:
			contract_summary["fileId"] = data.get("fileId") or data.get("key") or str(uuid.uuid4())

		event_payload = {
			"eventVersion": "v1",
			"eventType": "contract.summary.updated",
			"eventId": str(uuid.uuid4()),
			"timestamp": datetime.now(timezone.utc).isoformat(),
			"source": "ai-processing-service",
			"correlationId": event.get("correlationId") or str(uuid.uuid4()),
			"actor": event.get("actor", {}),
			"data": contract_summary,
			"metadata": {
				"serviceVersion": "1.0.0",
				"region": "ap-southeast-1"
			}
		}
		await self.producer.send_and_wait(
			self.contract_summary_topic,
			event_payload,
			key=str(data.get("fileId") or data.get("key") or "").encode("utf-8")
		)
		logging.info(f"[AI_PUBLISH_SUCCESS] topic={self.contract_summary_topic} payload={json.dumps(event_payload, ensure_ascii=False)}")

	async def _extract_file_content(self, data: dict) -> str:
		# Simulation placeholder
		return f"Simulated content for {data.get('filename')}"

	def _create_fallback_summary(self, data: dict) -> dict:
		return {
			"fileId": data.get("fileId") or data.get("key") or str(uuid.uuid4()),
			"contractNumber": f"CTR-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}",
			"title": f"Hợp đồng từ tệp: {data.get('filename', 'Không xác định')}",
			"contractType": "UNKNOWN",
			"summaryText": f"Tóm tắt tự động cho {data.get('filename', 'Không xác định')}",
			"keyPoints": ["Cần rà soát thủ công"],
			"object": "Không xác định rõ đối tượng hợp đồng",
			"effectiveDate": None,
			"term": "Không xác định",
			"paymentDetails": {
				"totalValue": 0,
				"schedule": "Không xác định",
				"currency": "VND",
				"paymentMethod": "Không xác định"
			},
			"riskAssessment": {
				"riskLevel": "MEDIUM",
				"riskFactors": ["Cần rà soát thủ công"],
				"mitigationMeasures": ["Khuyến nghị rà soát hợp đồng thủ công"]
			},
			"complianceStatus": {
				"status": "PENDING_REVIEW",
				"issues": ["Xử lý tự động chưa đầy đủ"],
				"recommendations": ["Cần rà soát thủ công"]
			},
			"terminationConditions": "Không xác định",
			"tags": ["tu-dong", "can-ra-soat"]
		}

	async def _extract_text_from_file(self, data: dict) -> str:
		"""Đọc nội dung thật từ file PDF/DOCX."""
		try:
			# Tạm thời dùng nội dung mẫu cho test, sau này sẽ đọc từ S3/Filebase
			# TODO: Implement real file reading from S3/Filebase
			filename = data.get("filename", "")
			if "contract" in filename.lower() or "hopdong" in filename.lower():
				return """
HỢP ĐỒNG DỊCH VỤ TƯ VẤN MARKETING

Số hợp đồng: SC-2024-001
Ngày ký: 15/01/2024

BÊN A (Bên cung cấp dịch vụ): Công ty TNHH ABC Marketing
Địa chỉ: 123 Đường XYZ, Quận 1, TP.HCM
Mã số thuế: 0123456789
Người đại diện: Nguyễn Văn A
Chức vụ: Giám đốc

BÊN B (Bên sử dụng dịch vụ): Công ty CP Thương mại XYZ
Địa chỉ: 456 Đường UVW, Quận 3, TP.HCM
Mã số thuế: 9876543210
Người đại diện: Trần Thị B
Chức vụ: Giám đốc

ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG
Bên A cam kết cung cấp dịch vụ tư vấn và triển khai các chiến dịch marketing cho sản phẩm mới của Bên B.

ĐIỀU 2: THỜI HẠN HỢP ĐỒNG
Hợp đồng có hiệu lực từ ngày 15/01/2024 đến ngày 15/01/2025 (12 tháng).

ĐIỀU 3: GIÁ TRỊ HỢP ĐỒNG
Tổng giá trị: 50,000,000 VND (Năm mươi triệu đồng)
Thanh toán: 30% khi ký hợp đồng, 40% sau 6 tháng, 30% khi nghiệm thu

ĐIỀU 4: NGHĨA VỤ CÁC BÊN
- Bên A: Cung cấp dịch vụ tư vấn marketing chuyên nghiệp
- Bên B: Cung cấp thông tin cần thiết và thanh toán đúng hạn

ĐIỀU 5: BẢO MẬT THÔNG TIN
Các bên cam kết bảo mật thông tin liên quan đến hợp đồng và hoạt động kinh doanh của đối tác.

ĐIỀU 6: CHẤM DỨT HỢP ĐỒNG
Hợp đồng có thể chấm dứt trước thời hạn nếu một trong hai bên vi phạm nghiêm trọng các điều khoản.

ĐIỀU 7: QUYỀN SỞ HỮU TRÍ TUỆ
Quyền sở hữu trí tuệ đối với các sản phẩm và dịch vụ được tạo ra trong quá trình thực hiện hợp đồng thuộc về Bên A.

Hợp đồng được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.

BÊN A                                    BÊN B
Nguyễn Văn A                            Trần Thị B
(Ký tên, đóng dấu)                      (Ký tên, đóng dấu)
				"""
			else:
				return f"Nội dung file {filename} (đã đọc thành công)"
		except Exception as e:
			logging.error(f"[AI_EXTRACT_ERROR] {e}")
			return f"Lỗi đọc file {data.get('filename', 'unknown')}: {e}"

	def _get_contract_summary_prompt(self, content: str, filename: str) -> str:
		"""Tạo prompt chuẩn cho việc tóm tắt hợp đồng - dùng chung cho API và Event"""
		return self.ai_service.get_contract_summary_prompt(content, filename)

	async def _generate_contract_summary(self, content: str, filename: str) -> Optional[dict]:
		"""Gọi Gemini để tạo JSON tóm tắt hợp đồng; fallback nếu lỗi."""
		return self.ai_service.generate_contract_summary(content, filename)


worker = AIKafkaWorker()

async def _run_worker_forever() -> None:
	try:
		await worker.start()
		# keep the process alive
		while True:
			await asyncio.sleep(3600)
	except asyncio.CancelledError:
		pass
	finally:
		await worker.stop()

if __name__ == "__main__":
	asyncio.run(_run_worker_forever())