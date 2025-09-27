package com.devgo2003.docgo.document_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

// @Service
@Slf4j
@RequiredArgsConstructor
public class FileProcessingStatusConsumer {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final IContractService contractService;

    /**
     * Consume file processing status events từ AI Processing Service
     */
    // @KafkaListener(
    //         topics = "${app.kafka.topic.file-processing-status:file-processing-status}",
    //         groupId = "${spring.kafka.consumer.group-id:contract-service-group}",
    //         containerFactory = "kafkaListenerContainerFactory"
    // )
    public void consumeFileProcessingStatus(String eventJson) {
        String correlationId = "unknown";
        String eventType = "unknown";
        String fileId = "unknown";
        
        try {
            log.info("📨 [FILE_PROCESSING_STATUS_RECEIVE] Nhận file processing status event từ Kafka - event_length: {} chars", 
                     eventJson.length());
            
            JsonNode root = objectMapper.readTree(eventJson);
            eventType = getText(root, "eventType");
            correlationId = getText(root, "correlationId");
            fileId = getText(root, "eventId");
            
            log.info("🔍 [FILE_PROCESSING_STATUS_ANALYSIS] Phân tích file processing status event - eventType: {}, eventId: {}, correlationId: {}", 
                     eventType, fileId, correlationId);
            
            // Xử lý các loại file processing status events khác nhau
            switch (eventType) {
                case "FileProcessingStarted":
                    handleFileProcessingStartedEvent(root, correlationId);
                    break;
                case "FileProcessingCompleted":
                    handleFileProcessingCompletedEvent(root, correlationId);
                    break;
                case "FileProcessingFailed":
                    handleFileProcessingFailedEvent(root, correlationId);
                    break;
                case "FileProcessingCancelled":
                    handleFileProcessingCancelledEvent(root, correlationId);
                    break;
                default:
                    log.info("⏭️ [FILE_PROCESSING_STATUS_SKIP] Event type không được hỗ trợ: {} - bỏ qua", eventType);
                    break;
            }
            
            log.info("✅ [FILE_PROCESSING_STATUS_PROCESSING_SUCCESS] Đã xử lý file processing status event thành công - eventType: {}, eventId: {}, correlationId: {}", 
                     eventType, fileId, correlationId);
            
        } catch (Exception e) {
            log.error("❌ [FILE_PROCESSING_STATUS_PROCESSING_ERROR] Lỗi xử lý file processing status event - eventType: {}, eventId: {}, correlationId: {}, error: {}", 
                      eventType, fileId, correlationId, e.getMessage(), e);
        }
    }
    
    /**
     * Xử lý FileProcessingStarted event
     */
    private void handleFileProcessingStartedEvent(JsonNode eventRoot, String correlationId) {
        try {
            log.info("🔄 [FILE_PROCESSING_STARTED_HANDLE] Bắt đầu xử lý FileProcessingStarted event - correlationId: {}", correlationId);
            
            JsonNode data = eventRoot.path("data");
            String fileId = getText(data, "fileId");
            String filename = getText(data, "filename");
            String processingType = getText(data, "processingType");
            String startedAt = getText(data, "startedAt");
            
            log.info("📋 [FILE_PROCESSING_STARTED_INFO] Thông tin file bắt đầu xử lý - fileId: {}, filename: {}, processingType: {}, startedAt: {}", 
                     fileId, filename, processingType, startedAt);
            
            // TODO: Implement logic xử lý file processing started
            // Có thể cập nhật trạng thái contract, gửi notification, etc.
            
            log.info("✅ [FILE_PROCESSING_STARTED_HANDLE_SUCCESS] Đã xử lý FileProcessingStarted event thành công - fileId: {}, correlationId: {}", 
                     fileId, correlationId);
            
        } catch (Exception e) {
            log.error("❌ [FILE_PROCESSING_STARTED_HANDLE_ERROR] Lỗi xử lý FileProcessingStarted event: {} - correlationId: {}", 
                      e.getMessage(), correlationId, e);
        }
    }
    
    /**
     * Xử lý FileProcessingCompleted event
     */
    private void handleFileProcessingCompletedEvent(JsonNode eventRoot, String correlationId) {
        try {
            log.info("🔄 [FILE_PROCESSING_COMPLETED_HANDLE] Bắt đầu xử lý FileProcessingCompleted event - correlationId: {}", correlationId);
            
            JsonNode data = eventRoot.path("data");
            String fileId = getText(data, "fileId");
            String filename = getText(data, "filename");
            String processingType = getText(data, "processingType");
            String completedAt = getText(data, "completedAt");
            String resultSummary = getText(data, "resultSummary");
            
            log.info("📋 [FILE_PROCESSING_COMPLETED_INFO] Thông tin file hoàn thành xử lý - fileId: {}, filename: {}, processingType: {}, completedAt: {}, resultSummary: {}", 
                     fileId, filename, processingType, completedAt, resultSummary);
            
            // TODO: Implement logic xử lý file processing completed
            // Có thể cập nhật trạng thái contract, trigger next steps, etc.
            
            log.info("✅ [FILE_PROCESSING_COMPLETED_HANDLE_SUCCESS] Đã xử lý FileProcessingCompleted event thành công - fileId: {}, correlationId: {}", 
                     fileId, correlationId);
            
        } catch (Exception e) {
            log.error("❌ [FILE_PROCESSING_COMPLETED_HANDLE_ERROR] Lỗi xử lý FileProcessingCompleted event: {} - correlationId: {}", 
                      e.getMessage(), correlationId, e);
        }
    }
    
    /**
     * Xử lý FileProcessingFailed event
     */
    private void handleFileProcessingFailedEvent(JsonNode eventRoot, String correlationId) {
        try {
            log.info("🔄 [FILE_PROCESSING_FAILED_HANDLE] Bắt đầu xử lý FileProcessingFailed event - correlationId: {}", correlationId);
            
            JsonNode data = eventRoot.path("data");
            String fileId = getText(data, "fileId");
            String filename = getText(data, "filename");
            String processingType = getText(data, "processingType");
            String failedAt = getText(data, "failedAt");
            String errorMessage = getText(data, "errorMessage");
            String errorCode = getText(data, "errorCode");
            
            log.info("📋 [FILE_PROCESSING_FAILED_INFO] Thông tin file xử lý thất bại - fileId: {}, filename: {}, processingType: {}, failedAt: {}, errorMessage: {}, errorCode: {}", 
                     fileId, filename, processingType, failedAt, errorMessage, errorCode);
            
            // TODO: Implement logic xử lý file processing failed
            // Có thể cập nhật trạng thái contract, gửi notification, trigger retry, etc.
            
            log.info("✅ [FILE_PROCESSING_FAILED_HANDLE_SUCCESS] Đã xử lý FileProcessingFailed event thành công - fileId: {}, correlationId: {}", 
                     fileId, correlationId);
            
        } catch (Exception e) {
            log.error("❌ [FILE_PROCESSING_FAILED_HANDLE_ERROR] Lỗi xử lý FileProcessingFailed event: {} - correlationId: {}", 
                      e.getMessage(), correlationId, e);
        }
    }
    
    /**
     * Xử lý FileProcessingCancelled event
     */
    private void handleFileProcessingCancelledEvent(JsonNode eventRoot, String correlationId) {
        try {
            log.info("🔄 [FILE_PROCESSING_CANCELLED_HANDLE] Bắt đầu xử lý FileProcessingCancelled event - correlationId: {}", correlationId);
            
            JsonNode data = eventRoot.path("data");
            String fileId = getText(data, "fileId");
            String filename = getText(data, "filename");
            String processingType = getText(data, "processingType");
            String cancelledAt = getText(data, "cancelledAt");
            String cancellationReason = getText(data, "cancellationReason");
            
            log.info("📋 [FILE_PROCESSING_CANCELLED_INFO] Thông tin file xử lý bị hủy - fileId: {}, filename: {}, processingType: {}, cancelledAt: {}, cancellationReason: {}", 
                     fileId, filename, processingType, cancelledAt, cancellationReason);
            
            // TODO: Implement logic xử lý file processing cancelled
            // Có thể cập nhật trạng thái contract, gửi notification, etc.
            
            log.info("✅ [FILE_PROCESSING_CANCELLED_HANDLE_SUCCESS] Đã xử lý FileProcessingCancelled event thành công - fileId: {}, correlationId: {}", 
                     fileId, correlationId);
            
        } catch (Exception e) {
            log.error("❌ [FILE_PROCESSING_CANCELLED_HANDLE_ERROR] Lỗi xử lý FileProcessingCancelled event: {} - correlationId: {}", 
                      e.getMessage(), correlationId, e);
        }
    }
    
    private String getText(JsonNode node, String field) {
        if (node == null) return null;
        JsonNode n = node.path(field);
        return n.isMissingNode() || n.isNull() ? null : n.asText();
    }
}
