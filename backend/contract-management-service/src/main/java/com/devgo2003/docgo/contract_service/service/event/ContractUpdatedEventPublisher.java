package com.devgo2003.docgo.contract_service.service.event;

import com.devgo2003.docgo.contract_service.entity.Contract;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class ContractUpdatedEventPublisher {
    private static final Logger logger = LoggerFactory.getLogger(ContractUpdatedEventPublisher.class);

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.kafka.topic.contract-updated:contract.updated}")
    private String contractUpdatedTopic;

    @Autowired
    public ContractUpdatedEventPublisher(KafkaTemplate<String, Object> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publishContractUpdatedEvent(Contract contract, String action) {
        try {
            Map<String, Object> eventPayload = new HashMap<>();
            eventPayload.put("eventVersion", "v1");
            eventPayload.put("eventType", "contract.updated");
            eventPayload.put("eventId", UUID.randomUUID().toString());
            eventPayload.put("timestamp", LocalDateTime.now().atOffset(ZoneOffset.UTC).toString());
            eventPayload.put("source", "contract-management-service");
            eventPayload.put("correlationId", UUID.randomUUID().toString());

            Map<String, Object> actor = new HashMap<>();
            actor.put("userId", contract.getCreatedBy() != null ? contract.getCreatedBy() : "system");
            actor.put("userRole", "service");
            eventPayload.put("actor", actor);

            Map<String, Object> contractData = new HashMap<>();
            contractData.put("contractId", contract.getId());
            contractData.put("contractNumber", contract.getContractNumber());
            contractData.put("title", contract.getTitle());
            contractData.put("status", contract.getStatus() != null ? contract.getStatus().name() : null);
            contractData.put("contractType", contract.getContractType());
            contractData.put("systemId", contract.getSystemId());
            contractData.put("action", action);
            contractData.put("aiProcessed", contract.getAiProcessed());
            contractData.put("processingStatus", contract.getProcessingStatus() != null ? contract.getProcessingStatus().name() : null);

            eventPayload.put("data", contractData);

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("serviceVersion", "1.0.0");
            eventPayload.put("metadata", metadata);

            kafkaTemplate.send(contractUpdatedTopic, contract.getId(), eventPayload);
            logger.info("✅ Published contract.updated event for contract ID: {} with action: {}", contract.getId(), action);

        } catch (Exception e) {
            logger.error("❌ Failed to publish contract.updated event for contract ID: {}: {}", contract.getId(), e.getMessage(), e);
        }
    }
}
