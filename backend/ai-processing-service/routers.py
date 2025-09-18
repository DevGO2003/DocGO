
from fastapi import APIRouter, File, UploadFile, Header, HTTPException, Body, Request, Query
from docx import Document
import PyPDF2
import os
from config import get_gemini_api_key
import google.generativeai as genai
import json
import uuid
from datetime import datetime, timezone
from schemas.response import RestResponse
from schemas.contract_summary import ContractSummary, ContractSummaryResponse
from bs4 import BeautifulSoup
from pptx import Presentation
from openpyxl import load_workbook
from striprtf.striprtf import rtf_to_text
import csv
from services.ai_processing_service import AIProcessingService
# from services.notification_service import NotificationService
from services.batch_service import BatchService
from services.event_service import EventService
# from schemas.notification_schemas import (
#     NotificationRequest, NotificationHistoryRequest, NotificationTemplate,
#     EmailNotificationRequest, SMSNotificationRequest, PushNotificationRequest,
#     WebSocketNotificationRequest
# )
from schemas.batch_schemas import (
    BatchJobRequest, BatchJobStatusRequest, BatchJobListRequest,
    BatchJobCancelRequest, BatchJobRetryRequest, BatchProcessingRequest
)
from schemas.event_schemas import (
    EventHandlerRequest, EventSubscriptionRequest, EventPublishRequest,
    EventHistoryRequest
)

router = APIRouter(prefix="/api/v1/ai-processing-service")

RESULTS_DIR = os.path.join(os.path.dirname(__file__), 'results')
os.makedirs(RESULTS_DIR, exist_ok=True)


def read_docx(file_path: str) -> str:
    doc = Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs if para.text])

def read_pdf(file_path: str) -> str:
    text = ""
    with open(file_path, "rb") as f:
        pdf_reader = PyPDF2.PdfReader(f)
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
    return text


def ask_gemini(api_key: str, content: str, question: str) -> str:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')
    # Luôn ép AI trả lời bằng tiếng Việt
    vietnamese_instruction = (
        "YÊU CẦU NGHIÊM NGẶT: Luôn trả lời HOÀN TOÀN bằng TIẾNG VIỆT, không dùng ngôn ngữ khác.\n"
    )
    prompt = f"{vietnamese_instruction}Nội dung tài liệu:\n{content}\n\nYêu cầu/Xử lý: {question}"
    response = model.generate_content(prompt)
    return response.text


# API 1: EXTRACT (doc, pdf)
@router.post("/extract", summary="Trích xuất toàn bộ nội dung file (doc/pdf)", tags=["AI Processing Service"])
async def extract_api(
    request: Request,
    file: UploadFile = File(..., description="File hợp đồng (docx, pdf)"),
    gemini_api_key: str = Header(None, description="Gemini API Key (tùy chọn)")
):
    """
    ## 🔹 Đầu vào
    
    📁 file (bắt buộc, multipart/form-data)
    Loại: UploadFile (DOCX hoặc PDF)
    Mô tả: Tệp hợp đồng cần trích xuất toàn bộ nội dung văn bản
    
    🔑 gemini_api_key (tùy chọn, header)
    Loại: string
    Mô tả: API key để gọi Gemini AI. Nếu không cung cấp, sẽ sử dụng key từ biến môi trường
    
    ## 🔹 Đầu ra
    
    📄 data
    Loại: string
    Mô tả: Chuỗi văn bản chứa toàn bộ nội dung được trích xuất từ file (không qua AI xử lý)
    
    📊 apiVersion
    Loại: string
    Mô tả: Phiên bản API (v1)
    
    🔢 statusCode
    Loại: integer
    Mô tả: Mã trạng thái HTTP (200: thành công, 400: lỗi đầu vào, 204: không có nội dung, 500: lỗi server)
    
    📋 shortMessage
    Loại: string
    Mô tả: Thông báo ngắn gọn về kết quả
    
    📖 description
    Loại: string
    Mô tả: Mô tả chi tiết về kết quả xử lý
    
    🕒 timestamp
    Loại: string (ISO-8601)
    Mô tả: Thời gian xử lý yêu cầu
    
    🆔 requestId
    Loại: string (UUID)
    Mô tả: Định danh duy nhất của yêu cầu
    
    🛣️ path
    Loại: string
    Mô tả: Đường dẫn API được gọi
    """
    # Extract API logic
    temp_path = os.path.join(RESULTS_DIR, file.filename)
    with open(temp_path, "wb") as f:
        f.write(await file.read())
    if file.filename.endswith(".docx"):
        content = read_docx(temp_path)
    elif file.filename.endswith(".pdf"):
        content = read_pdf(temp_path)
    else:
        os.remove(temp_path)
        raise HTTPException(status_code=400, detail="Chỉ hỗ trợ file docx hoặc pdf.")
    
    os.remove(temp_path)
    if not content.strip():
        raise HTTPException(status_code=204, detail="Không có nội dung văn bản để gửi cho AI.")
    
    # Trích xuất toàn bộ nội dung file (không cần AI)
    extracted_content = content.strip()
    
    if not extracted_content:
        return RestResponse(
            statusCode=204,
            shortMessage="No Content",
            description="File không chứa nội dung văn bản.",
            data=None,
            path=request.url.path,
            timestamp=datetime.now(),
            requestId=str(uuid.uuid4())
        )
    
    return RestResponse(
        statusCode=200,
        shortMessage="Success",
        description="Trích xuất toàn bộ nội dung file thành công.",
        data=extracted_content,
        path=request.url.path,
        timestamp=datetime.now(),
        requestId=str(uuid.uuid4())
    )





# API 4: CLASSIFY (nhận diện loại tài liệu: hợp đồng, đề cương, giáo trình, sách giáo khoa, ...)
@router.post("/classify", summary="Phân loại loại tài liệu (file đa định dạng hoặc text)", tags=["AI Processing Service"])
async def classify_api(
    request: Request,
    file: UploadFile = File(None, description="File cần phân loại (txt, md, html, json, csv, xlsx, pptx, rtf, docx, pdf)"),
    text: str = Body(None, description="Nội dung văn bản dạng chuỗi"),
    gemini_api_key: str = Header(None, description="Gemini API Key (tùy chọn)")
):
    """
    ## 🔹 Đầu vào
    
    📁 file (tùy chọn, multipart/form-data)
    Loại: UploadFile (txt, md, html, json, csv, xlsx, pptx, rtf, docx, pdf)
    Mô tả: Tệp cần phân loại. Cung cấp file HOẶC text
    
    📝 text (tùy chọn, application/json)
    Loại: string
    Mô tả: Nội dung văn bản dạng chuỗi cần phân loại. Cung cấp file HOẶC text
    
    🔑 gemini_api_key (tùy chọn, header)
    Loại: string
    Mô tả: API key để gọi Gemini AI. Nếu không cung cấp, sẽ sử dụng key từ biến môi trường
    
    ## 🔹 Đầu ra
    
    📄 data
    Loại: object
    Mô tả: JSON kết quả phân loại gồm: documentType, isContract, confidence, reasons, contractSubtype (nếu có)
    
    📊 apiVersion
    Loại: string
    Mô tả: Phiên bản API (v1)
    
    🔢 statusCode
    Loại: integer
    Mô tả: Mã trạng thái HTTP (200: thành công, 400: lỗi đầu vào, 204: không có nội dung, 500: lỗi server)
    
    📋 shortMessage
    Loại: string
    Mô tả: Thông báo ngắn gọn về kết quả
    
    📖 description
    Loại: string
    Mô tả: Mô tả chi tiết về kết quả xử lý
    
    🕒 timestamp
    Loại: string (ISO-8601)
    Mô tả: Thời gian xử lý yêu cầu
    
    🆔 requestId
    Loại: string (UUID)
    Mô tả: Định danh duy nhất của yêu cầu
    
    🛣️ path
    Loại: string
    Mô tả: Đường dẫn API được gọi
    """
    # Chuẩn hóa nội dung đầu vào như summarize
    content = None
    if file:
        temp_path = os.path.join(RESULTS_DIR, file.filename)
        with open(temp_path, "wb") as f:
            f.write(await file.read())

        filename_lower = file.filename.lower()
        try:
            if filename_lower.endswith(".txt") or filename_lower.endswith(".md"):
                with open(temp_path, "r", encoding="utf-8", errors="ignore") as tf:
                    content = tf.read()
            elif filename_lower.endswith(".html") or filename_lower.endswith(".htm"):
                with open(temp_path, "r", encoding="utf-8", errors="ignore") as hf:
                    html = hf.read()
                    content = BeautifulSoup(html, "html.parser").get_text(separator="\n")
            elif filename_lower.endswith(".json"):
                with open(temp_path, "r", encoding="utf-8", errors="ignore") as jf:
                    try:
                        obj = json.load(jf)
                        content = json.dumps(obj, ensure_ascii=False, indent=2)
                    except Exception:
                        jf.seek(0)
                        content = jf.read()
            elif filename_lower.endswith(".csv"):
                lines = []
                with open(temp_path, "r", encoding="utf-8", errors="ignore") as cf:
                    reader = csv.reader(cf)
                    for row in reader:
                        lines.append(", ".join([str(col) for col in row]))
                content = "\n".join(lines)
            elif filename_lower.endswith(".xlsx"):
                wb = load_workbook(temp_path, data_only=True)
                texts = []
                for ws in wb.worksheets:
                    for row in ws.iter_rows(values_only=True):
                        row_vals = [str(cell) for cell in row if cell is not None]
                        if row_vals:
                            texts.append(" \t ".join(row_vals))
                content = "\n".join(texts)
            elif filename_lower.endswith(".pptx"):
                prs = Presentation(temp_path)
                texts = []
                for slide in prs.slides:
                    for shape in slide.shapes:
                        if hasattr(shape, "has_text_frame") and shape.has_text_frame:
                            for paragraph in shape.text_frame.paragraphs:
                                texts.append("".join([run.text for run in paragraph.runs]))
                content = "\n".join([t for t in texts if t and t.strip()])
            elif filename_lower.endswith(".rtf"):
                with open(temp_path, "r", encoding="utf-8", errors="ignore") as rf:
                    content = rtf_to_text(rf.read())
            elif filename_lower.endswith(".docx"):
                content = read_docx(temp_path)
            elif filename_lower.endswith(".pdf"):
                content = read_pdf(temp_path)
            else:
                raise HTTPException(status_code=400, detail="Định dạng file không được hỗ trợ cho classify.")
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
    elif text:
        content = text
    else:
        raise HTTPException(status_code=400, detail="Cần cung cấp file hoặc text để phân loại.")

    if not content or not content.strip():
        raise HTTPException(status_code=204, detail="Không có nội dung để gửi cho AI.")

    api_key = gemini_api_key or get_gemini_api_key()

    try:
        categories = [
            "contract", "syllabus", "curriculum", "textbook", "lecture_notes", "assignment",
            "research_paper", "invoice", "receipt", "policy", "manual", "letter", "report", "other"
        ]
        prompt = (
            "Luôn trả lời HOÀN TOÀN bằng TIẾNG VIỆT.\n"
            "Hãy phân loại loại tài liệu dưới đây. Chỉ trả về JSON hợp lệ với cấu trúc:\n"
            "{\n"
            "  \"documentType\": string, // một trong: contract, syllabus, curriculum, textbook, lecture_notes, assignment, research_paper, invoice, receipt, policy, manual, letter, report, other\n"
            "  \"isContract\": boolean,\n"
            "  \"contractSubtype\": string|null, // ví dụ: Service Agreement, NDA, Sales Contract ... nếu là hợp đồng\n"
            "  \"confidence\": number, // 0..1\n"
            "  \"reasons\": [string] // 2-5 gợi ý lý do\n"
            "}\n\n"
            "Yêu cầu: Không giải thích thêm, không kèm markdown, chỉ JSON.\n"
            "Danh mục hợp lệ: " + ", ".join(categories) + "\n\n"
            "Nội dung tài liệu:\n" + content[:8000]
        )

        answer = ask_gemini(api_key, content, prompt)

        cleaned = answer.strip()
        if cleaned.startswith('```json'):
            cleaned = cleaned[7:]
        if cleaned.startswith('```'):
            cleaned = cleaned[3:]
        if cleaned.endswith('```'):
            cleaned = cleaned[:-3]

        data_out = None
        try:
            parsed = json.loads(cleaned)
            # Hậu kiểm tối thiểu
            if isinstance(parsed, dict):
                doc_type = parsed.get("documentType", "other")
                is_contract = parsed.get("isContract", False)
                confidence = parsed.get("confidence", 0.0)
                reasons = parsed.get("reasons", [])
                subtype = parsed.get("contractSubtype")
                data_out = {
                    "documentType": doc_type,
                    "isContract": bool(is_contract),
                    "confidence": float(confidence),
                    "reasons": reasons if isinstance(reasons, list) else [],
                    "contractSubtype": subtype if (is_contract and isinstance(subtype, str)) else None
                }
            else:
                data_out = parsed
        except Exception:
            # Nếu không parse được JSON, trả về text gốc để debug
            data_out = {"documentType": "other", "isContract": False, "confidence": 0.0, "reasons": [answer]}

        return RestResponse(
            statusCode=200,
            shortMessage="Success",
            description="Phân loại tài liệu thành công.",
            data=data_out,
            path=request.url.path,
            timestamp=datetime.now(),
            requestId=str(uuid.uuid4())
        )

    except Exception as e:
        return RestResponse(
            statusCode=500,
            shortMessage="Internal Server Error",
            description=f"Lỗi xảy ra khi gọi AI classify: {e}",
            data=None,
            path=request.url.path,
            timestamp=datetime.now(),
            requestId=str(uuid.uuid4())
        )


# API 3: SUMMARIZE (đa định dạng văn bản hoặc chuỗi)
@router.post("/summarize", summary="Tóm tắt hợp đồng (nhiều định dạng văn bản hoặc chuỗi)", tags=["AI Processing Service"])
async def summarize_api(
    request: Request,
    file: UploadFile = File(None, description="File văn bản cần tóm tắt (txt, md, html, json, csv, xlsx, pptx, rtf, docx, pdf)"),
    text: str = Body(None, description="Nội dung văn bản dạng chuỗi"),
    gemini_api_key: str = Header(None, description="Gemini API Key (tùy chọn)")
):
    """
    ## 🔹 Đầu vào
    
    📁 file (tùy chọn, multipart/form-data)
    Loại: UploadFile (txt, md, html, json, csv, xlsx, pptx, rtf, docx, pdf)
    Mô tả: Tệp văn bản cần tóm tắt. Chỉ cần cung cấp file HOẶC text, không cần cả hai
    
    📝 text (tùy chọn, application/json)
    Loại: string
    Mô tả: Nội dung văn bản dạng chuỗi cần tóm tắt. Chỉ cần cung cấp file HOẶC text, không cần cả hai
    
    🔑 gemini_api_key (tùy chọn, header)
    Loại: string
    Mô tả: API key để gọi Gemini AI. Nếu không cung cấp, sẽ sử dụng key từ biến môi trường
    
    ## 🔹 Đầu ra
    
    📄 data
    Loại: object hoặc string
    Mô tả: Nếu AI trả về JSON hợp lệ, data sẽ là object chứa các trường tóm tắt hợp đồng (title, parties, object, effective_date, ...). Nếu không parse được JSON, data sẽ là chuỗi text
    
    📊 apiVersion
    Loại: string
    Mô tả: Phiên bản API (v1)
    
    🔢 statusCode
    Loại: integer
    Mô tả: Mã trạng thái HTTP (200: thành công, 400: lỗi đầu vào, 204: không có nội dung, 500: lỗi server)
    
    📋 shortMessage
    Loại: string
    Mô tả: Thông báo ngắn gọn về kết quả
    
    📖 description
    Loại: string
    Mô tả: Mô tả chi tiết về kết quả xử lý
    
    🕒 timestamp
    Loại: string (ISO-8601)
    Mô tả: Thời gian xử lý yêu cầu
    
    🆔 requestId
    Loại: string (UUID)
    Mô tả: Định danh duy nhất của yêu cầu
    
    🛣️ path
    Loại: string
    Mô tả: Đường dẫn API được gọi
    """
    # Summarize API logic
    content = None
    if file:
        temp_path = os.path.join(RESULTS_DIR, file.filename)
        with open(temp_path, "wb") as f:
            f.write(await file.read())

        filename_lower = file.filename.lower()
        try:
            if filename_lower.endswith(".txt") or filename_lower.endswith(".md"):
                with open(temp_path, "r", encoding="utf-8", errors="ignore") as tf:
                    content = tf.read()
            elif filename_lower.endswith(".html") or filename_lower.endswith(".htm"):
                with open(temp_path, "r", encoding="utf-8", errors="ignore") as hf:
                    html = hf.read()
                    content = BeautifulSoup(html, "html.parser").get_text(separator="\n")
            elif filename_lower.endswith(".json"):
                with open(temp_path, "r", encoding="utf-8", errors="ignore") as jf:
                    try:
                        obj = json.load(jf)
                        content = json.dumps(obj, ensure_ascii=False, indent=2)
                    except Exception:
                        jf.seek(0)
                        content = jf.read()
            elif filename_lower.endswith(".csv"):
                lines = []
                with open(temp_path, "r", encoding="utf-8", errors="ignore") as cf:
                    reader = csv.reader(cf)
                    for row in reader:
                        lines.append(", ".join([str(col) for col in row]))
                content = "\n".join(lines)
            elif filename_lower.endswith(".xlsx"):
                wb = load_workbook(temp_path, data_only=True)
                texts = []
                for ws in wb.worksheets:
                    for row in ws.iter_rows(values_only=True):
                        row_vals = [str(cell) for cell in row if cell is not None]
                        if row_vals:
                            texts.append(" \t ".join(row_vals))
                content = "\n".join(texts)
            elif filename_lower.endswith(".pptx"):
                prs = Presentation(temp_path)
                texts = []
                for slide in prs.slides:
                    for shape in slide.shapes:
                        if hasattr(shape, "has_text_frame") and shape.has_text_frame:
                            for paragraph in shape.text_frame.paragraphs:
                                texts.append("".join([run.text for run in paragraph.runs]))
                content = "\n".join([t for t in texts if t and t.strip()])
            elif filename_lower.endswith(".rtf"):
                with open(temp_path, "r", encoding="utf-8", errors="ignore") as rf:
                    content = rtf_to_text(rf.read())
            elif filename_lower.endswith(".docx"):
                content = read_docx(temp_path)
            elif filename_lower.endswith(".pdf"):
                content = read_pdf(temp_path)
            else:
                raise HTTPException(status_code=400, detail="Định dạng file không được hỗ trợ cho summarize.")
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
    elif text:
        content = text
    else:
        raise HTTPException(status_code=400, detail="Cần cung cấp file hợp lệ (txt, md, html, json, csv, xlsx, pptx, rtf, docx, pdf) hoặc nội dung chuỗi.")
    
    if not content or not content.strip():
        raise HTTPException(status_code=204, detail="Không có nội dung để gửi cho AI.")
    api_key = gemini_api_key or get_gemini_api_key()
    try:
        prompt = (
            "Luôn trả lời HOÀN TOÀN bằng TIẾNG VIỆT.\n"
            "Hãy phân tích và tóm tắt hợp đồng dưới đây thành một JSON với cấu trúc như sau:\n"
            "QUAN TRỌNG: Nếu không tìm thấy thông tin cụ thể, hãy trả về null thay vì \"Chưa xác định\"\n"
            "Đảm bảo mỗi điều khoản trong keyClauses, favorableClauses, unfavorableClauses là một object riêng biệt\n"
            "riskFactors và mitigationMeasures phải là danh sách chi tiết từng yếu tố\n\n"
            '{\n'
            '  "contractNumber": "string",\n'
            '  "status": null,\n'
            '  "contractType": "string",\n'
            '  "title": "string",\n'
            '  "tags": ["string"],\n'
            '  "parties": [\n'
            '    {"role": "vai trò thực tế từ hợp đồng", "name": "string", "representative": "string", "taxCode": "string", "contact": "string", "address": "string", "businessLicense": null}\n'
            '  ],\n'
            '  "object": "string",\n'
            '  "effectiveDate": "string (ISO 8601)",\n'
            '  "term": "string",\n'
            '  "paymentDetails": {"totalValue": "string", "schedule": "string", "currency": "string", "paymentMethod": "string"},\n'
            '  "keyClauses": [\n'
            '    {"name": "string", "description": "string", "source": "string"}, ...\n'
            '  ],\n'
            '  "favorableClauses": [\n'
            '    {"clauseName": "string", "description": "string", "benefitTo": "string"}, ...\n'
            '  ],\n'
            '  "unfavorableClauses": [\n'
            '    {"clauseName": "string", "description": "string", "riskTo": "string"}, ...\n'
            '  ],\n'
            '  "reminders": [\n'
            '    {"type": "string", "date": "string (ISO 8601)", "content": "string"}, ...\n'
            '  ],\n'
            '  "terminationConditions": "string",\n'
            '  "riskAssessment": {\n'
            '    "riskLevel": "LOW|MEDIUM|HIGH",\n'
            '      "riskFactors": ["string"],\n'
            '      "mitigationMeasures": ["string"]\n'
            '  },\n'
            '  "complianceStatus": {\n'
            '    "status": "COMPLIANT|NON_COMPLIANT|REVIEW_REQUIRED",\n'
            '      "issues": ["string"],\n'
            '      "recommendations": ["string"]\n'
            '  }\n'
            '}'
            "\nYêu cầu:\n"
            "1. Chỉ trả về đúng JSON hợp lệ, không giải thích thêm\n"
            "2. Nếu không thể tóm tắt được thông tin hợp lệ, hãy trả về 'KHÔNG_THỂ_TÓM_TẮT'\n"
            "3. Lưu ý: reminders chỉ có ngày nhắc nhở là ngày cụ thể (ISO 8601), nếu không có ngày cụ thể thì để date=null\n"
            "4. Điền thông tin dựa trên nội dung hợp đồng, nếu không có thông tin thì để null hoặc mảng rỗng\n"
            "5. Sử dụng camelCase cho tất cả các key\n"
            "6. totalValue phải là số (number), không phải chuỗi\n"
            "7. effectiveDate và reminders.date phải theo định dạng ISO 8601 (yyyy-MM-ddTHH:mm:ssZ)\n"
            "8. Thứ tự các trường trong parties: role trước, name sau\n"
            "9. Tạo ID và contractNumber ngẫu nhiên\n\n"
            "Dưới đây là nội dung hợp đồng:"
        )
        
        # Use shared AI service instead of creating new Gemini configuration
        ai_service = AIProcessingService()
        answer = ai_service.generate_contract_summary(content, file.filename if file else "text_input")
        
        # Handle AI service response
        if answer is None:
            # AI service failed to generate summary
            return RestResponse(
                statusCode=422,
                shortMessage="Unprocessable Entity",
                description="AI không thể tóm tắt thông tin từ tài liệu này. Có thể do định dạng không hỗ trợ hoặc nội dung không phù hợp.",
                data=None,
                path=request.url.path,
                timestamp=datetime.now(),
                requestId=str(uuid.uuid4())
            )
        
        # Convert dict result back to string for compatibility
        if isinstance(answer, dict):
            answer = json.dumps(answer, ensure_ascii=False, indent=2)
        
        # Kiểm tra xem AI có trả về thông báo lỗi không
        error_indicators = [
            "tôi xin lỗi",
            "tôi không thể",
            "không thể tóm tắt",
            "không thể xử lý",
            "không có đủ thông tin",
            "cần thêm thông tin",
            "không thể phân tích",
            "không thể đọc",
            "lỗi",
            "error",
            "không_thể_tóm_tắt",
            "không có thông tin",
            "không phải là hợp đồng",
            "không phải hợp đồng",
            "không thể tìm thấy",
            "không có dữ liệu"
        ]
        
        answer_lower = answer.lower()
        is_error_response = any(indicator in answer_lower for indicator in error_indicators)
        
        if is_error_response:
            return RestResponse(
                statusCode=422,
                shortMessage="Unprocessable Entity",
                description="AI không thể tóm tắt thông tin từ tài liệu này. Có thể do định dạng không hỗ trợ hoặc nội dung không phù hợp.",
                data=None,
                path=request.url.path,
                timestamp=datetime.now(),
                requestId=str(uuid.uuid4())
            )
        
        # Loại bỏ các ký tự đặc biệt, markdown, ...
        cleaned = answer.strip()
        if cleaned.startswith('```json'):
            cleaned = cleaned[7:]
        if cleaned.startswith('```'):
            cleaned = cleaned[3:]
        if cleaned.endswith('```'):
            cleaned = cleaned[:-3]
        # Giữ nguyên ký tự escape để không làm hỏng JSON; chỉ bỏ fence markdown
        
        data_out = answer  # Mặc định trả về text gốc
        
        try:
            summary_json = json.loads(cleaned)
            # Nếu có contract_summary thì chỉ lấy các trường con ra ngoài data
            if isinstance(summary_json, dict) and 'contract_summary' in summary_json:
                data_out = summary_json['contract_summary']
                # Xử lý reminders: nếu không có ngày hợp lệ thì để null
                if 'reminders' in data_out and isinstance(data_out['reminders'], list):
                    # Đầu tiên set date = None nếu không hợp lệ
                    for r in data_out['reminders']:
                        date_val = r.get('date')
                        if not date_val or not isinstance(date_val, str) or not date_val.strip():
                            r['date'] = None
                    # Sau đó loại bỏ reminders có date == None
                    # Giữ lại reminders ngay cả khi date=None để client có thể xử lý tiếp
            else:
                data_out = summary_json
        except Exception as parse_error:
            # Nếu không parse được JSON, vẫn trả về text gốc
            data_out = answer
            print(f"Warning: Không thể parse JSON từ AI response: {parse_error}")
            
    except Exception as e:
        # Xử lý lỗi từ Gemini AI
        error_message = f"Lỗi AI/Summarize: {str(e)}"
        print(f"Error in summarize_api: {error_message}")
        
        return RestResponse(
            statusCode=500,
            shortMessage="Internal Server Error",
            description="Lỗi xảy ra khi gọi AI service. Vui lòng thử lại sau.",
            data={"error": error_message, "raw_content": content[:200] + "..." if len(content) > 200 else content},
            path=request.url.path,
            timestamp=datetime.now(),
            requestId=str(uuid.uuid4())
        )
    
    return RestResponse(
        statusCode=200,
        shortMessage="Success",
        description="Tóm tắt hợp đồng thành công.",
        data=data_out,
        path=request.url.path,
        timestamp=datetime.now(),
        requestId=str(uuid.uuid4())
    )


# API Test: Kiểm tra GEMINI_API_KEY
@router.get("/test/get-geminiapikey", summary="Kiểm tra GEMINI_API_KEY mà hệ thống đọc được", tags=["Test"])
async def test_gemini_api_key_api(request: Request):
    """
    ## 🔹 Đầu vào
    
    Không có tham số đầu vào
    
    ## 🔹 Đầu ra
    
    📄 data
    Loại: object
    Mô tả: Thông tin về GEMINI_API_KEY và trạng thái hệ thống
    
    📊 apiVersion
    Loại: string
    Mô tả: Phiên bản API (v1)
    
    🔢 statusCode
    Loại: integer
    Mô tả: Mã trạng thái HTTP (200: thành công, 500: lỗi server)
    
    📋 shortMessage
    Loại: string
    Mô tả: Thông báo ngắn gọn về kết quả
    
    📖 description
    Loại: string
    Mô tả: Mô tả chi tiết về kết quả kiểm tra
    
    🕒 timestamp
    Loại: string (ISO-8601)
    Mô tả: Thời gian xử lý yêu cầu
    
    🆔 requestId
    Loại: string (UUID)
    Mô tả: Định danh duy nhất của yêu cầu
    
    🛣️ path
    Loại: string
    Mô tả: Đường dẫn API được gọi
    """
    try:
        # Lấy GEMINI_API_KEY từ biến môi trường
        api_key = os.getenv("GEMINI_API_KEY")
        
        # Kiểm tra các biến môi trường khác
        kafka_servers = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
        kafka_file_topic = os.getenv("KAFKA_FILE_UPLOADED_TOPIC", "file.uploaded")
        kafka_text_topic = os.getenv("KAFKA_TEXT_EXTRACTED_TOPIC", "ai.text.extracted")
        kafka_doc_topic = os.getenv("KAFKA_DOCUMENT_CLASSIFIED_TOPIC", "ai.document.classified")
        kafka_contract_topic = os.getenv("KAFKA_CONTRACT_SUMMARY_TOPIC", "contract.summary.updated")
        
        # Tạo response data
        test_data = {
            "geminiApiKey": {
                "exists": api_key is not None,
                "length": len(api_key) if api_key else 0,
                "masked": f"{api_key[:8]}...{api_key[-4:]}" if api_key and len(api_key) > 12 else "N/A" if not api_key else api_key,
                "status": "CONFIGURED" if api_key else "NOT_CONFIGURED"
            },
            "environment": {
                "kafkaBootstrapServers": kafka_servers,
                "kafkaFileUploadedTopic": kafka_file_topic,
                "kafkaTextExtractedTopic": kafka_text_topic,
                "kafkaDocumentClassifiedTopic": kafka_doc_topic,
                "kafkaContractSummaryTopic": kafka_contract_topic,
                "host": os.getenv("HOST", "0.0.0.0"),
                "port": os.getenv("PORT", "8017"),
                "debug": os.getenv("DEBUG", "false")
            },
            "systemInfo": {
                "pythonPath": os.getcwd(),
                "envFiles": {
                    "dotenvLoaded": True,
                    "envLocalExists": os.path.exists(".env.local"),
                    "envExampleExists": os.path.exists("env/.env.example")
                }
            }
        }
        
        return RestResponse(
            apiVersion="v1",
            statusCode=200,
            shortMessage="Success",
            description="Kiểm tra GEMINI_API_KEY thành công",
            data=test_data,
            timestamp=datetime.now(timezone.utc).isoformat(),
            requestId=str(uuid.uuid4()),
            path=str(request.url)
        )
        
    except Exception as e:
        return RestResponse(
            apiVersion="v1",
            statusCode=500,
            shortMessage="Internal Server Error",
            description=f"Lỗi khi kiểm tra GEMINI_API_KEY: {str(e)}",
            data=None,
            timestamp=datetime.now(timezone.utc).isoformat(),
            requestId=str(uuid.uuid4()),
            path=str(request.url)
        )

@router.post("/process-url", summary="Xử lý file từ URL với AI", tags=["AI Processing Service"])
async def process_file_from_url(
    request: Request,
    file_url: str = Query(..., description="URL của file cần xử lý"),
    filename: str = Query(..., description="Tên file"),
    content_type: str = Query("application/pdf", description="Loại file"),
    file_id: str = Query(None, description="ID của file (tùy chọn)")
):
    """
    ## 🔹 Đầu vào
    
    🌐 file_url (bắt buộc, query)
    Loại: string
    Mô tả: URL của file cần xử lý (PDF, DOCX, TXT, etc.)
    
    📄 filename (bắt buộc, query)
    Loại: string
    Mô tả: Tên file để xử lý
    
    📋 content_type (tùy chọn, query)
    Loại: string
    Mô tả: Loại file (mặc định: application/pdf)
    
    🆔 file_id (tùy chọn, query)
    Loại: string
    Mô tả: ID của file (tùy chọn, nếu không có sẽ tự tạo)
    
    ## 🔹 Đầu ra
    
    📄 data
    Loại: object
    Mô tả: Kết quả xử lý file bao gồm extracted_text, classification, summary
    
    📊 apiVersion
    Loại: string
    Mô tả: Phiên bản API (v1)
    
    🔢 statusCode
    Loại: integer
    Mô tả: Mã trạng thái HTTP (200: thành công, 400: lỗi đầu vào, 500: lỗi server)
    
    📋 shortMessage
    Loại: string
    Mô tả: Thông báo ngắn gọn về kết quả
    
    📖 description
    Loại: string
    Mô tả: Mô tả chi tiết về kết quả xử lý
    
    🕒 timestamp
    Loại: string (ISO-8601)
    Mô tả: Thời gian xử lý yêu cầu
    
    🆔 requestId
    Loại: string (UUID)
    Mô tả: Định danh duy nhất của yêu cầu
    
    🛣️ path
    Loại: string
    Mô tả: Đường dẫn API được gọi
    """
    try:
        # Download file from URL
        async with aiohttp.ClientSession() as session:
            async with session.get(file_url) as response:
                if response.status != 200:
                    raise HTTPException(status_code=400, detail=f"Không thể tải file từ URL: HTTP {response.status}")
                
                file_content = await response.read()
                logging.info(f"[AI_URL_PROCESS] Downloaded {len(file_content)} bytes from {file_url}")
        
        # Extract text from content
        extracted_text = ""
        if content_type == "application/pdf":
            extracted_text = f"[PDF_CONTENT_PLACEHOLDER] Content from {filename} (PDF text extraction not implemented yet)"
        elif content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            extracted_text = f"[DOCX_CONTENT_PLACEHOLDER] Content from {filename} (DOCX text extraction not implemented yet)"
        elif content_type.startswith("text/"):
            extracted_text = file_content.decode('utf-8', errors='ignore')
        else:
            extracted_text = file_content.decode('utf-8', errors='ignore')
        
        # Use shared AI service
        ai_service = AIProcessingService()
        
        # Classify document
        classification_result = ai_service.classify_document(extracted_text, filename)
        
        # Generate summary if it's a contract
        summary_result = None
        if classification_result.get("classification") == "CONTRACT":
            summary_result = ai_service.generate_contract_summary(extracted_text, filename)
        
        # Prepare result
        result = {
            "file_id": file_id or str(uuid.uuid4()),
            "filename": filename,
            "content_type": content_type,
            "file_url": file_url,
            "file_size": len(file_content),
            "extracted_text": extracted_text[:500] + "..." if len(extracted_text) > 500 else extracted_text,
            "classification": classification_result,
            "summary": summary_result,
            "processing_time": datetime.now(timezone.utc).isoformat()
        }
        
        return RestResponse(
            apiVersion="v1",
            statusCode=200,
            shortMessage="Success",
            description=f"Đã xử lý file '{filename}' từ URL thành công",
            data=result,
            timestamp=datetime.now(timezone.utc).isoformat(),
            requestId=str(uuid.uuid4()),
            path=str(request.url)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"[AI_URL_PROCESS_ERROR] Error processing file from URL: {e}", exc_info=True)
        return RestResponse(
            apiVersion="v1",
            statusCode=500,
            shortMessage="Internal Server Error",
            description=f"Lỗi khi xử lý file từ URL: {str(e)}",
            data=None,
            timestamp=datetime.now(timezone.utc).isoformat(),
            requestId=str(uuid.uuid4()),
            path=str(request.url)
        )

# ==================== NOTIFICATION APIs ====================
# TEMPORARILY DISABLED - Missing twilio dependency

# Initialize services (will be initialized in main.py)
# notification_service = NotificationService()
batch_service = BatchService()
event_service = EventService()

# @router.post("/notifications/send", summary="Gửi notification", tags=["Notification Service"])
# async def send_notification_api(
#     request: Request,
#     notification_request: NotificationRequest
# ):
#     """
#     🔹 Đầu vào
#     
#     📧 notification_request (bắt buộc, body)
#     Loại: NotificationRequest
#     Mô tả: Thông tin notification cần gửi (email, SMS, push, websocket)
#     
#     🔹 Đầu ra
#     
#     📝 data
#     Loại: NotificationResponse
#     Mô tả: Kết quả gửi notification với trạng thái và thông tin chi tiết
#     """
#     try:
#         await notification_service.initialize()
#         result = await notification_service.send_notification(notification_request)
#         
#         return RestResponse(
#             statusCode=200,
#             shortMessage="Success",
#             description="Gửi notification thành công",
#             data=result.model_dump(),
#             path=request.url.path,
#             timestamp=datetime.now(timezone.utc),
#             requestId=str(uuid.uuid4())
#         )
#         
#     except Exception as e:
#         return RestResponse(
#             statusCode=500,
#             shortMessage="Internal Server Error",
#             description=f"Lỗi khi gửi notification: {str(e)}",
#             data=None,
#             path=request.url.path,
#             timestamp=datetime.now(timezone.utc),
#             requestId=str(uuid.uuid4())
#         )

# @router.get("/notifications/history", summary="Lịch sử notification", tags=["Notification Service"])
# async def get_notification_history_api(
#     request: Request,
#     page: int = Query(1, ge=1, description="Số trang"),
#     limit: int = Query(10, ge=1, le=100, description="Số lượng mỗi trang"),
#     notification_type: str = Query(None, description="Loại notification"),
#     status: str = Query(None, description="Trạng thái notification"),
#     start_date: str = Query(None, description="Ngày bắt đầu (ISO format)"),
#     end_date: str = Query(None, description="Ngày kết thúc (ISO format)")
# ):
#     """
#     🔹 Đầu vào
#     
#     📄 page (tùy chọn, query)
#     Loại: integer
#     Mô tả: Số trang (mặc định: 1)
#     
#     📄 limit (tùy chọn, query)
#     Loại: integer
#     Mô tả: Số lượng mỗi trang (mặc định: 10, tối đa: 100)
#     
#     🔹 Đầu ra
#     
#     📝 data
#     Loại: NotificationHistoryResponse
#     Mô tả: Danh sách notification với phân trang
#     """
#     try:
#         await notification_service.initialize()
#         
#         # Parse dates if provided
#         start_dt = None
#         end_dt = None
#         if start_date:
#             start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
#         if end_date:
#             end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
#         
#         result = await notification_service.get_notification_history(
#             page=page,
#             limit=limit,
#             notification_type=notification_type,
#             status=status,
#             start_date=start_dt,
#             end_date=end_dt
#         )
#         
#         return RestResponse(
#             statusCode=200,
#             shortMessage="Success",
#             description="Lấy lịch sử notification thành công",
#             data=result,
#             path=request.url.path,
#             timestamp=datetime.now(timezone.utc),
#             requestId=str(uuid.uuid4())
#         )
#         
#     except Exception as e:
#         return RestResponse(
#             statusCode=500,
#             shortMessage="Internal Server Error",
#             description=f"Lỗi khi lấy lịch sử notification: {str(e)}",
#             data=None,
#             path=request.url.path,
#             timestamp=datetime.now(timezone.utc),
#             requestId=str(uuid.uuid4())
#         )

# @router.post("/notifications/templates", summary="Tạo notification template", tags=["Notification Service"])
# async def create_notification_template_api(
#     request: Request,
#     template: NotificationTemplate
# ):
#     """
#     🔹 Đầu vào
#     
#     📧 template (bắt buộc, body)
#     Loại: NotificationTemplate
#     Mô tả: Thông tin template notification cần tạo
#     
#     🔹 Đầu ra
#     
#     📝 data
#     Loại: NotificationTemplate
#     Mô tả: Template đã được tạo với ID và timestamp
#     """
#     try:
#         await notification_service.initialize()
#         result = await notification_service.create_notification_template(template)
#         
#         return RestResponse(
#             statusCode=201,
#             shortMessage="Created",
#             description="Tạo notification template thành công",
#             data=result.model_dump(),
#             path=request.url.path,
#             timestamp=datetime.now(timezone.utc),
#             requestId=str(uuid.uuid4())
#         )
#         
#     except Exception as e:
#         return RestResponse(
#             statusCode=500,
#             shortMessage="Internal Server Error",
#             description=f"Lỗi khi tạo notification template: {str(e)}",
#             data=None,
#             path=request.url.path,
#             timestamp=datetime.now(timezone.utc),
#             requestId=str(uuid.uuid4())
#         )

# ==================== BATCH PROCESSING APIs ====================

@router.post("/batch/process", summary="Xử lý hàng loạt", tags=["Batch Processing Service"])
async def process_batch_api(
    request: Request,
    batch_request: BatchProcessingRequest
):
    """
    🔹 Đầu vào
    
    📦 batch_request (bắt buộc, body)
    Loại: BatchProcessingRequest
    Mô tả: Thông tin batch processing cần thực hiện
    
    🔹 Đầu ra
    
    📝 data
    Loại: BatchProcessingResponse
    Mô tả: Kết quả tạo batch job với ID và thông tin xử lý
    """
    try:
        await batch_service.initialize()
        
        # Tạo batch job
        job_request = BatchJobRequest(
            type="ai_processing",
            name=f"Batch processing {len(batch_request.files)} files",
            description=f"Xử lý {batch_request.processing_type} cho {len(batch_request.files)} files",
            data={
                "files": batch_request.files,
                "processing_type": batch_request.processing_type,
                "options": batch_request.options or {},
                "callback_url": batch_request.callback_url
            }
        )
        
        job = await batch_service.create_batch_job(job_request)
        
        # Bắt đầu xử lý job
        asyncio.create_task(batch_service.process_batch_job(job.id))
        
        result = BatchProcessingResponse(
            job_id=job.id,
            total_files=len(batch_request.files),
            estimated_time=len(batch_request.files) * 30,  # 30 seconds per file
            status_url=f"/api/v1/ai-processing-service/batch/status/{job.id}"
        )
        
        return RestResponse(
            statusCode=201,
            shortMessage="Created",
            description="Tạo batch job thành công",
            data=result.model_dump(),
            path=request.url.path,
            timestamp=datetime.now(timezone.utc),
            requestId=str(uuid.uuid4())
        )
        
    except Exception as e:
        return RestResponse(
            statusCode=500,
            shortMessage="Internal Server Error",
            description=f"Lỗi khi tạo batch job: {str(e)}",
            data=None,
            path=request.url.path,
            timestamp=datetime.now(timezone.utc),
            requestId=str(uuid.uuid4())
        )

@router.get("/batch/status/{job_id}", summary="Trạng thái batch job", tags=["Batch Processing Service"])
async def get_batch_job_status_api(
    request: Request,
    job_id: str
):
    """
    🔹 Đầu vào
    
    🆔 job_id (bắt buộc, path)
    Loại: string
    Mô tả: ID của batch job cần kiểm tra
    
    🔹 Đầu ra
    
    📝 data
    Loại: BatchJobResponse
    Mô tả: Trạng thái chi tiết của batch job
    """
    try:
        await batch_service.initialize()
        result = await batch_service.get_batch_job_status(job_id)
        
        return RestResponse(
            statusCode=200,
            shortMessage="Success",
            description="Lấy trạng thái batch job thành công",
            data=result.model_dump(),
            path=request.url.path,
            timestamp=datetime.now(timezone.utc),
            requestId=str(uuid.uuid4())
        )
        
    except ValueError as e:
        return RestResponse(
            statusCode=404,
            shortMessage="Not Found",
            description=str(e),
            data=None,
            path=request.url.path,
            timestamp=datetime.now(timezone.utc),
            requestId=str(uuid.uuid4())
        )
    except Exception as e:
        return RestResponse(
            statusCode=500,
            shortMessage="Internal Server Error",
            description=f"Lỗi khi lấy trạng thái batch job: {str(e)}",
            data=None,
            path=request.url.path,
            timestamp=datetime.now(timezone.utc),
            requestId=str(uuid.uuid4())
        )

@router.get("/batch/jobs", summary="Danh sách batch jobs", tags=["Batch Processing Service"])
async def get_batch_jobs_api(
    request: Request,
    page: int = Query(1, ge=1, description="Số trang"),
    limit: int = Query(10, ge=1, le=100, description="Số lượng mỗi trang"),
    job_type: str = Query(None, description="Loại job"),
    status: str = Query(None, description="Trạng thái job"),
    priority: str = Query(None, description="Độ ưu tiên job")
):
    """
    🔹 Đầu vào
    
    📄 page (tùy chọn, query)
    Loại: integer
    Mô tả: Số trang (mặc định: 1)
    
    📄 limit (tùy chọn, query)
    Loại: integer
    Mô tả: Số lượng mỗi trang (mặc định: 10, tối đa: 100)
    
    🔹 Đầu ra
    
    📝 data
    Loại: BatchJobListResponse
    Mô tả: Danh sách batch jobs với phân trang
    """
    try:
        await batch_service.initialize()
        result = await batch_service.get_batch_jobs(
            page=page,
            limit=limit,
            job_type=job_type,
            status=status,
            priority=priority
        )
        
        return RestResponse(
            statusCode=200,
            shortMessage="Success",
            description="Lấy danh sách batch jobs thành công",
            data=result,
            path=request.url.path,
            timestamp=datetime.now(timezone.utc),
            requestId=str(uuid.uuid4())
        )
        
    except Exception as e:
        return RestResponse(
            statusCode=500,
            shortMessage="Internal Server Error",
            description=f"Lỗi khi lấy danh sách batch jobs: {str(e)}",
            data=None,
            path=request.url.path,
            timestamp=datetime.now(timezone.utc),
            requestId=str(uuid.uuid4())
        )

# ==================== EVENT HANDLING APIs ====================

@router.post("/events/handle", summary="Xử lý events", tags=["Event Service"])
async def handle_event_api(
    request: Request,
    event_request: EventHandlerRequest
):
    """
    🔹 Đầu vào
    
    📧 event_request (bắt buộc, body)
    Loại: EventHandlerRequest
    Mô tả: Event cần xử lý
    
    🔹 Đầu ra
    
    📝 data
    Loại: EventHandlerResponse
    Mô tả: Kết quả xử lý event
    """
    try:
        await event_service.initialize()
        
        # Handle event based on type
        if event_request.event.eventType == "file.uploaded":
            result = await event_service.handle_file_uploaded_event(event_request)
        elif event_request.event.eventType == "ai.processing.completed":
            result = await event_service.handle_ai_processing_completed_event(event_request)
        elif event_request.event.eventType == "notification.sent":
            result = await event_service.handle_notification_sent_event(event_request)
        else:
            result = EventHandlerResponse(
                success=False,
                message=f"Unsupported event type: {event_request.event.eventType}",
                processed_at=datetime.now(timezone.utc),
                retry_count=event_request.retry_count
            )
        
        return RestResponse(
            statusCode=200,
            shortMessage="Success",
            description="Xử lý event thành công",
            data=result.model_dump(),
            path=request.url.path,
            timestamp=datetime.now(timezone.utc),
            requestId=str(uuid.uuid4())
        )
        
    except Exception as e:
        return RestResponse(
            statusCode=500,
            shortMessage="Internal Server Error",
            description=f"Lỗi khi xử lý event: {str(e)}",
            data=None,
            path=request.url.path,
            timestamp=datetime.now(timezone.utc),
            requestId=str(uuid.uuid4())
        )

@router.post("/events/publish", summary="Publish event", tags=["Event Service"])
async def publish_event_api(
    request: Request,
    event_request: EventPublishRequest
):
    """
    🔹 Đầu vào
    
    📧 event_request (bắt buộc, body)
    Loại: EventPublishRequest
    Mô tả: Event cần publish
    
    🔹 Đầu ra
    
    📝 data
    Loại: EventPublishResponse
    Mô tả: Kết quả publish event
    """
    try:
        await event_service.initialize()
        result = await event_service.publish_event(event_request)
        
        return RestResponse(
            statusCode=200,
            shortMessage="Success",
            description="Publish event thành công",
            data=result.model_dump(),
            path=request.url.path,
            timestamp=datetime.now(timezone.utc),
            requestId=str(uuid.uuid4())
        )
        
    except Exception as e:
        return RestResponse(
            statusCode=500,
            shortMessage="Internal Server Error",
            description=f"Lỗi khi publish event: {str(e)}",
            data=None,
            path=request.url.path,
            timestamp=datetime.now(timezone.utc),
            requestId=str(uuid.uuid4())
        )

@router.get("/events/history", summary="Lịch sử events", tags=["Event Service"])
async def get_event_history_api(
    request: Request,
    page: int = Query(1, ge=1, description="Số trang"),
    limit: int = Query(10, ge=1, le=100, description="Số lượng mỗi trang"),
    event_type: str = Query(None, description="Loại event"),
    source: str = Query(None, description="Nguồn event"),
    status: str = Query(None, description="Trạng thái event")
):
    """
    🔹 Đầu vào
    
    📄 page (tùy chọn, query)
    Loại: integer
    Mô tả: Số trang (mặc định: 1)
    
    📄 limit (tùy chọn, query)
    Loại: integer
    Mô tả: Số lượng mỗi trang (mặc định: 10, tối đa: 100)
    
    🔹 Đầu ra
    
    📝 data
    Loại: EventHistoryResponse
    Mô tả: Danh sách events với phân trang
    """
    try:
        await event_service.initialize()
        result = await event_service.get_event_history(
            page=page,
            limit=limit,
            event_type=event_type,
            source=source,
            status=status
        )
        
        return RestResponse(
            statusCode=200,
            shortMessage="Success",
            description="Lấy lịch sử events thành công",
            data=result.model_dump(),
            path=request.url.path,
            timestamp=datetime.now(timezone.utc),
            requestId=str(uuid.uuid4())
        )
        
    except Exception as e:
        return RestResponse(
            statusCode=500,
            shortMessage="Internal Server Error",
            description=f"Lỗi khi lấy lịch sử events: {str(e)}",
            data=None,
            path=request.url.path,
            timestamp=datetime.now(timezone.utc),
            requestId=str(uuid.uuid4())
        )

