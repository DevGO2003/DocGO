package com.devgo2003.docgo.document_service.listener;

import com.devgo2003.docgo.document_service.dto.AiEventDto;
import com.devgo2003.docgo.document_service.service.IAiEventProcessingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

// @Component
public class AiEventKafkaListener {
    private static final Logger logger = LoggerFactory.getLogger(AiEventKafkaListener.class);
    
    private final IAiEventProcessingService aiEventProcessingService;
    private final ObjectMapper objectMapper;

    @Autowired
    public AiEventKafkaListener(IAiEventProcessingService aiEventProcessingService, ObjectMapper objectMapper) {
        this.aiEventProcessingService = aiEventProcessingService;
        this.objectMapper = objectMapper;
    }

    // @KafkaListener(
    //     topics = "${app.kafka.topic.ai-events:ai-events}",
    //     groupId = "${app.kafka.group-id:contract-service-group}",
    //     containerFactory = "kafkaListenerContainerFactory"
    // )
    public void handleAiEvent(String eventJson) {
        try {
            logger.info("Received AI event: {}", eventJson);
            
            AiEventDto event = objectMapper.readValue(eventJson, AiEventDto.class);
            
            // Chỉ xử lý SummaryCreated events
            if ("SummaryCreated".equals(event.getEventType())) {
                logger.info("Processing SummaryCreated event for file: {}", 
                    event.getData().getFileInformation().getFilename());
                
                aiEventProcessingService.processSummaryCreatedEvent(event);
                
                logger.info("Successfully processed SummaryCreated event");
            } else {
                logger.debug("Ignoring non-SummaryCreated event: {}", event.getEventType());
            }
            
        } catch (Exception e) {
            logger.error("Error processing AI event: {}", e.getMessage(), e);
            // Không throw exception để tránh crash consumer
            // Có thể implement retry logic hoặc dead letter queue sau này
        }
    }
}
