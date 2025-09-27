package com.devgo2003.docgo.document_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Map;

// @Service
@Slf4j
@RequiredArgsConstructor
public class ContractEventConsumer {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final IContractService contractService;

    /**
     * Consume contract events từ các service khác
     */
    // @KafkaListener(
    //         topics = "${app.kafka.topic.contract-events:contract.events}",
    //         groupId = "${spring.kafka.consumer.group-id:contract-service-group}",
    //         containerFactory = "kafkaListenerContainerFactory"
    // )
    public void consumeContractEvent(String eventJson) {
        String correlationId = "unknown";
        String eventType = "unknown";
        String contractId = "unknown";
        
        try {
            log.info("📨 [CONTRACT_EVENT_RECEIVE] Nhận contract event từ Kafka - event_length: {} chars", 
                     eventJson.length());
            
            JsonNode root = objectMapper.readTree(eventJson);
            eventType = getText(root, "eventType");
            correlationId = getText(root, "correlationId");
            contractId = getText(root, "eventId");
            
            log.info("🔍 [CONTRACT_EVENT_ANALYSIS] Phân tích contract event - eventType: {}, eventId: {}, correlationId: {}", 
                     eventType, contractId, correlationId);
            
            // Xử lý các loại contract events khác nhau
            switch (eventType) {
                case "ContractCreated":
                    handleContractCreatedEvent(root, correlationId);
                    break;
                case "ContractUpdated":
                    handleContractUpdatedEvent(root, correlationId);
                    break;
                case "ContractDeleted":
                    handleContractDeletedEvent(root, correlationId);
                    break;
                case "ContractRestored":
                    handleContractRestoredEvent(root, correlationId);
                    break;
                case "ContractStatusChanged":
                    handleContractStatusChangedEvent(root, correlationId);
                    break;
                default:
                    log.info("⏭️ [CONTRACT_EVENT_SKIP] Event type không được hỗ trợ: {} - bỏ qua", eventType);
                    break;
            }
            
            log.info("✅ [CONTRACT_EVENT_PROCESSING_SUCCESS] Đã xử lý contract event thành công - eventType: {}, eventId: {}, correlationId: {}", 
                     eventType, contractId, correlationId);
            
        } catch (Exception e) {
            log.error("❌ [CONTRACT_EVENT_PROCESSING_ERROR] Lỗi xử lý contract event - eventType: {}, eventId: {}, correlationId: {}, error: {}", 
                      eventType, contractId, correlationId, e.getMessage(), e);
        }
    }
    
    /**
     * Xử lý ContractCreated event
     */
    private void handleContractCreatedEvent(JsonNode eventRoot, String correlationId) {
        try {
            log.info("🔄 [CONTRACT_CREATED_HANDLE] Bắt đầu xử lý ContractCreated event - correlationId: {}", correlationId);
            
            JsonNode data = eventRoot.path("data");
            String contractId = getText(data, "contractId");
            String contractNumber = getText(data, "contractNumber");
            String title = getText(data, "title");
            
            log.info("📋 [CONTRACT_CREATED_INFO] Thông tin contract được tạo - contractId: {}, contractNumber: {}, title: {}", 
                     contractId, contractNumber, title);
            
            // TODO: Implement logic xử lý contract created
            // Có thể cập nhật cache, gửi notification, etc.
            
            log.info("✅ [CONTRACT_CREATED_HANDLE_SUCCESS] Đã xử lý ContractCreated event thành công - contractId: {}, correlationId: {}", 
                     contractId, correlationId);
            
        } catch (Exception e) {
            log.error("❌ [CONTRACT_CREATED_HANDLE_ERROR] Lỗi xử lý ContractCreated event: {} - correlationId: {}", 
                      e.getMessage(), correlationId, e);
        }
    }
    
    /**
     * Xử lý ContractUpdated event
     */
    private void handleContractUpdatedEvent(JsonNode eventRoot, String correlationId) {
        try {
            log.info("🔄 [CONTRACT_UPDATED_HANDLE] Bắt đầu xử lý ContractUpdated event - correlationId: {}", correlationId);
            
            JsonNode data = eventRoot.path("data");
            String contractId = getText(data, "contractId");
            String contractNumber = getText(data, "contractNumber");
            String title = getText(data, "title");
            String status = getText(data, "status");
            
            log.info("📋 [CONTRACT_UPDATED_INFO] Thông tin contract được cập nhật - contractId: {}, contractNumber: {}, title: {}, status: {}", 
                     contractId, contractNumber, title, status);
            
            // TODO: Implement logic xử lý contract updated
            // Có thể cập nhật cache, gửi notification, etc.
            
            log.info("✅ [CONTRACT_UPDATED_HANDLE_SUCCESS] Đã xử lý ContractUpdated event thành công - contractId: {}, correlationId: {}", 
                     contractId, correlationId);
            
        } catch (Exception e) {
            log.error("❌ [CONTRACT_UPDATED_HANDLE_ERROR] Lỗi xử lý ContractUpdated event: {} - correlationId: {}", 
                      e.getMessage(), correlationId, e);
        }
    }
    
    /**
     * Xử lý ContractDeleted event
     */
    private void handleContractDeletedEvent(JsonNode eventRoot, String correlationId) {
        try {
            log.info("🔄 [CONTRACT_DELETED_HANDLE] Bắt đầu xử lý ContractDeleted event - correlationId: {}", correlationId);
            
            JsonNode data = eventRoot.path("data");
            String contractId = getText(data, "contractId");
            String contractNumber = getText(data, "contractNumber");
            String title = getText(data, "title");
            
            log.info("📋 [CONTRACT_DELETED_INFO] Thông tin contract bị xóa - contractId: {}, contractNumber: {}, title: {}", 
                     contractId, contractNumber, title);
            
            // TODO: Implement logic xử lý contract deleted
            // Có thể cập nhật cache, gửi notification, etc.
            
            log.info("✅ [CONTRACT_DELETED_HANDLE_SUCCESS] Đã xử lý ContractDeleted event thành công - contractId: {}, correlationId: {}", 
                     contractId, correlationId);
            
        } catch (Exception e) {
            log.error("❌ [CONTRACT_DELETED_HANDLE_ERROR] Lỗi xử lý ContractDeleted event: {} - correlationId: {}", 
                      e.getMessage(), correlationId, e);
        }
    }
    
    /**
     * Xử lý ContractRestored event
     */
    private void handleContractRestoredEvent(JsonNode eventRoot, String correlationId) {
        try {
            log.info("🔄 [CONTRACT_RESTORED_HANDLE] Bắt đầu xử lý ContractRestored event - correlationId: {}", correlationId);
            
            JsonNode data = eventRoot.path("data");
            String contractId = getText(data, "contractId");
            String contractNumber = getText(data, "contractNumber");
            String title = getText(data, "title");
            
            log.info("📋 [CONTRACT_RESTORED_INFO] Thông tin contract được khôi phục - contractId: {}, contractNumber: {}, title: {}", 
                     contractId, contractNumber, title);
            
            // TODO: Implement logic xử lý contract restored
            // Có thể cập nhật cache, gửi notification, etc.
            
            log.info("✅ [CONTRACT_RESTORED_HANDLE_SUCCESS] Đã xử lý ContractRestored event thành công - contractId: {}, correlationId: {}", 
                     contractId, correlationId);
            
        } catch (Exception e) {
            log.error("❌ [CONTRACT_RESTORED_HANDLE_ERROR] Lỗi xử lý ContractRestored event: {} - correlationId: {}", 
                      e.getMessage(), correlationId, e);
        }
    }
    
    /**
     * Xử lý ContractStatusChanged event
     */
    private void handleContractStatusChangedEvent(JsonNode eventRoot, String correlationId) {
        try {
            log.info("🔄 [CONTRACT_STATUS_CHANGED_HANDLE] Bắt đầu xử lý ContractStatusChanged event - correlationId: {}", correlationId);
            
            JsonNode data = eventRoot.path("data");
            String contractId = getText(data, "contractId");
            String contractNumber = getText(data, "contractNumber");
            String title = getText(data, "title");
            String oldStatus = getText(data, "oldStatus");
            String newStatus = getText(data, "newStatus");
            String statusChangeReason = getText(data, "statusChangeReason");
            
            log.info("📋 [CONTRACT_STATUS_CHANGED_INFO] Thông tin thay đổi status - contractId: {}, contractNumber: {}, title: {}, oldStatus: {}, newStatus: {}, reason: {}", 
                     contractId, contractNumber, title, oldStatus, newStatus, statusChangeReason);
            
            // TODO: Implement logic xử lý contract status changed
            // Có thể cập nhật cache, gửi notification, trigger workflows, etc.
            
            log.info("✅ [CONTRACT_STATUS_CHANGED_HANDLE_SUCCESS] Đã xử lý ContractStatusChanged event thành công - contractId: {}, correlationId: {}", 
                     contractId, correlationId);
            
        } catch (Exception e) {
            log.error("❌ [CONTRACT_STATUS_CHANGED_HANDLE_ERROR] Lỗi xử lý ContractStatusChanged event: {} - correlationId: {}", 
                      e.getMessage(), correlationId, e);
        }
    }
    
    private String getText(JsonNode node, String field) {
        if (node == null) return null;
        JsonNode n = node.path(field);
        return n.isMissingNode() || n.isNull() ? null : n.asText();
    }
}
