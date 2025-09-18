package com.devgo2003.docgo.contract_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

// @Service
@Slf4j
@RequiredArgsConstructor
public class AIEventsConsumer {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Value("${app.kafka.topic.contract-events:contract.events}")
    private String contractEventsTopic;

    // @KafkaListener(
    //         topics = "${app.kafka.topic.contract-summary:contract.summary.updated}",
    //         groupId = "${spring.kafka.consumer.group-id:contract-service-group}",
    //         containerFactory = "kafkaListenerContainerFactory"
    // )
    public void consumeAIEvents(ConsumerRecord<String, String> record) {
        String eventType = "unknown";
        String fileId = "unknown";
        String filename = "unknown";
        String correlationId = "unknown";
        
        try {
            log.info("AIEventsConsumer received record: topic={}, key={}, partition={}, offset={}",
                    record.topic(), record.key(), record.partition(), record.offset());
            final String value = record.value();
            if (value == null || value.isBlank()) {
                return;
            }

            JsonNode root = objectMapper.readTree(value);
            eventType = getText(root, "eventType");
            if (!"SummaryCreated".equals(eventType)) {
                return; // only interested in summary-created for now
            }

            JsonNode data = root.path("data");
            fileId = getText(data, "fileId");
            filename = getText(data, "filename");
            correlationId = getText(root, "correlationId");

            if (fileId == null || filename == null) {
                log.warn("⚠️ [AI_EVENT_MISSING_FIELDS] Thiếu các trường bắt buộc - fileId: {}, filename: {}", fileId, filename);
                return;
            }
            
            log.info("📁 [AI_EVENT_FILE_INFO] Thông tin file từ AI event - fileId: {}, filename: {}", fileId, filename);

            log.info("📢 [CONTRACT_UPDATED_PREP] Chuẩn bị publish ContractUpdated event...");
            Map<String, Object> contractUpdated = new HashMap<>();
            contractUpdated.put("eventVersion", "v1");
            contractUpdated.put("eventType", "ContractUpdated");
            contractUpdated.put("eventId", UUID.randomUUID().toString().replace("-", ""));
            contractUpdated.put("timestamp", OffsetDateTime.now().toString());
            contractUpdated.put("source", "contract-management-service");
            contractUpdated.put("correlationId", correlationId);
            contractUpdated.put("actor", root.path("actor"));

            Map<String, Object> payload = new HashMap<>();
            payload.put("fileId", fileId);
            payload.put("filename", filename);
            payload.put("summary", data.path("summary").asText(null));
            payload.put("keyPoints", data.path("keyPoints"));
            payload.put("status", "UPDATED");
            contractUpdated.put("data", payload);

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("serviceVersion", "1.0.0");
            contractUpdated.put("metadata", metadata);

            log.info("📋 [CONTRACT_UPDATED_PAYLOAD] ContractUpdated payload đã sẵn sàng - eventId: {}, eventType: {}, source: {}, correlationId: {}", 
                     contractUpdated.get("eventId"), contractUpdated.get("eventType"), contractUpdated.get("source"), correlationId);

            String json = objectMapper.writeValueAsString(contractUpdated);
            log.info("📤 [KAFKA_SEND] Gửi ContractUpdated event lên Kafka topic: {} với key: {}", contractEventsTopic, fileId);
            
            kafkaTemplate.send(contractEventsTopic, fileId, json);
            log.info("✅ [CONTRACT_UPDATED_PUBLISH_SUCCESS] Đã publish ContractUpdated event thành công - fileId: {}, filename: {}, correlationId: {}", 
                     fileId, filename, correlationId);
            
        } catch (Exception e) {
            log.error("❌ [AI_EVENT_PROCESSING_ERROR] Lỗi xử lý AI event - eventType: {}, fileId: {}, filename: {}, correlationId: {}, error: {}", 
                      eventType, fileId, filename, correlationId, e.getMessage(), e);
        }
    }

    private String getText(JsonNode node, String field) {
        if (node == null) return null;
        JsonNode n = node.path(field);
        return n.isMissingNode() || n.isNull() ? null : n.asText();
    }
}


