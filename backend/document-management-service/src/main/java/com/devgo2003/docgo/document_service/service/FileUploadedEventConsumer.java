package com.devgo2003.docgo.document_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

// @Service
@Slf4j
@RequiredArgsConstructor
public class FileUploadedEventConsumer {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final IContractService contractService;

    /**
     * Consume FileUploaded events từ File Storage Service
     */
    // @KafkaListener(
    //     topics = "${app.kafka.topic.file-uploaded:file.uploaded}",
    //     groupId = "${spring.kafka.consumer.group-id:contract-service-group}",
    //     containerFactory = "kafkaListenerContainerFactory"
    // )
    public void consumeFileUploadedEvent(String eventJson) {
        String correlationId = "unknown";
        String fileId = "unknown";
        String filename = "unknown";
        
        try {
            log.info("📨 [FILE_UPLOADED_RECEIVE] Nhận FileUploaded event từ Kafka - event_length: {} chars", 
                     eventJson.length());
            
            JsonNode root = objectMapper.readTree(eventJson);
            String eventType = getText(root, "eventType");
            correlationId = getText(root, "correlationId");
            fileId = getText(root, "eventId");
            
            log.info("🔍 [FILE_UPLOADED_ANALYSIS] Phân tích FileUploaded event - eventType: {}, eventId: {}, correlationId: {}", 
                     eventType, fileId, correlationId);
            
            if (!"FileUploaded".equals(eventType)) {
                log.info("⏭️ [FILE_UPLOADED_SKIP] Event type không phù hợp: {} - chỉ xử lý FileUploaded, bỏ qua", eventType);
                return;
            }
            
            log.info("✅ [FILE_UPLOADED_MATCH] Event type phù hợp: FileUploaded - bắt đầu xử lý");
            
            JsonNode data = root.path("data");
            filename = getText(data, "filename");
            String contentType = getText(data, "contentType");
            String bucket = getText(data, "bucket");
            String key = getText(data, "key");
            String url = getText(data, "url");
            String folder = getText(data, "folder");
            
            if (fileId == null || filename == null) {
                log.warn("⚠️ [FILE_UPLOADED_MISSING_FIELDS] Thiếu các trường bắt buộc - fileId: {}, filename: {}", 
                         fileId, filename);
                return;
            }
            
            log.info("📁 [FILE_UPLOADED_FILE_INFO] Thông tin file từ FileUploaded event - fileId: {}, filename: {}, contentType: {}, bucket: {}, key: {}, folder: {}", 
                     fileId, filename, contentType, bucket, key, folder);
            
            // Xử lý file uploaded event
            processFileUploadedEvent(correlationId, fileId, filename, contentType, bucket, key, url, folder, root);
            
            log.info("✅ [FILE_UPLOADED_PROCESSING_SUCCESS] Đã xử lý FileUploaded event thành công - fileId: {}, filename: {}, correlationId: {}", 
                     fileId, filename, correlationId);
            
        } catch (Exception e) {
            log.error("❌ [FILE_UPLOADED_PROCESSING_ERROR] Lỗi xử lý FileUploaded event - eventType: {}, fileId: {}, filename: {}, correlationId: {}, error: {}", 
                      "FileUploaded", fileId, filename, correlationId, e.getMessage(), e);
        }
    }
    
    /**
     * Xử lý FileUploaded event
     */
    private void processFileUploadedEvent(String correlationId, String fileId, String filename, 
                                        String contentType, String bucket, String key, String url, 
                                        String folder, JsonNode eventRoot) {
        try {
            log.info("🔄 [FILE_UPLOADED_PROCESSING_START] Bắt đầu xử lý FileUploaded event - fileId: {}, filename: {}", 
                     fileId, filename);
            
            // Tạo file metadata record
            createFileMetadataRecord(fileId, filename, contentType, bucket, key, url, folder, correlationId);
            
            // Publish FileReceived event để thông báo cho các service khác
            publishFileReceivedEvent(correlationId, fileId, filename, contentType, bucket, key, url, folder);
            
            log.info("✅ [FILE_UPLOADED_PROCESSING_COMPLETE] Hoàn thành xử lý FileUploaded event - fileId: {}, filename: {}", 
                     fileId, filename);
            
        } catch (Exception e) {
            log.error("❌ [FILE_UPLOADED_PROCESSING_ERROR] Lỗi xử lý FileUploaded event: {} - fileId: {}, correlationId: {}", 
                      e.getMessage(), fileId, correlationId, e);
        }
    }
    
    /**
     * Tạo file metadata record
     */
    private void createFileMetadataRecord(String fileId, String filename, String contentType, 
                                        String bucket, String key, String url, String folder, String correlationId) {
        try {
            log.info("💾 [FILE_METADATA_CREATE] Bắt đầu tạo file metadata record - fileId: {}, filename: {}", 
                     fileId, filename);
            
            // TODO: Implement database record creation
            // contractService.createOrUpdateContractFile(...)
            
            log.info("✅ [FILE_METADATA_CREATE_SUCCESS] Đã tạo file metadata record thành công - fileId: {}, filename: {}", 
                     fileId, filename);
            
        } catch (Exception e) {
            log.error("❌ [FILE_METADATA_CREATE_ERROR] Lỗi tạo file metadata record: {} - fileId: {}, correlationId: {}", 
                      e.getMessage(), fileId, correlationId, e);
        }
    }
    
    /**
     * Publish FileReceived event
     */
    private void publishFileReceivedEvent(String correlationId, String fileId, String filename, 
                                        String contentType, String bucket, String key, String url, String folder) {
        try {
            log.info("📢 [FILE_RECEIVED_PUBLISH_START] Bắt đầu publish FileReceived event - fileId: {}, filename: {}, correlationId: {}", 
                     fileId, filename, correlationId);
            
            Map<String, Object> fileReceivedEvent = new HashMap<>();
            fileReceivedEvent.put("eventVersion", "v1");
            fileReceivedEvent.put("eventType", "FileReceived");
            fileReceivedEvent.put("eventId", UUID.randomUUID().toString());
            fileReceivedEvent.put("timestamp", OffsetDateTime.now().toString());
            fileReceivedEvent.put("source", "document-management-service");
            fileReceivedEvent.put("correlationId", correlationId);
            
            Map<String, Object> actor = new HashMap<>();
            actor.put("userId", "system");
            actor.put("userRole", "service");
            actor.put("ip", "internal");
            fileReceivedEvent.put("actor", actor);
            
            Map<String, Object> eventData = new HashMap<>();
            eventData.put("fileId", fileId);
            eventData.put("filename", filename);
            eventData.put("contentType", contentType);
            eventData.put("bucket", bucket);
            eventData.put("key", key);
            eventData.put("url", url);
            eventData.put("folder", folder);
            eventData.put("receivedAt", OffsetDateTime.now().toString());
            eventData.put("status", "RECEIVED");
            fileReceivedEvent.put("data", eventData);
            
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("serviceVersion", "1.0.0");
            metadata.put("processingTime", OffsetDateTime.now().toString());
            fileReceivedEvent.put("metadata", metadata);
            
            log.info("📋 [FILE_RECEIVED_PAYLOAD] FileReceived event payload đã sẵn sàng - eventId: {}, eventType: {}, source: {}", 
                     fileReceivedEvent.get("eventId"), fileReceivedEvent.get("eventType"), fileReceivedEvent.get("source"));
            
            // TODO: Publish to Kafka topic hoặc internal event system
            // kafkaTemplate.send(fileEventsTopic, fileId, objectMapper.writeValueAsString(fileReceivedEvent));
            
            log.info("✅ [FILE_RECEIVED_PUBLISH_SUCCESS] Đã publish FileReceived event thành công cho file: {} với fileId: {}", 
                     filename, fileId);
            
        } catch (Exception e) {
            log.error("❌ [FILE_RECEIVED_PUBLISH_FAILED] Không thể publish FileReceived event: {} - fileId: {}, filename: {}, correlationId: {}", 
                      e.getMessage(), fileId, filename, correlationId, e);
        }
    }
    
    private String getText(JsonNode node, String field) {
        if (node == null) return null;
        JsonNode n = node.path(field);
        return n.isMissingNode() || n.isNull() ? null : n.asText();
    }
}
