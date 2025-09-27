package com.devgo2003.docgo.document_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;

@Configuration
@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "spring.kafka.enabled", havingValue = "true", matchIfMissing = false)
@EnableKafka
public class KafkaEnableConfig {
}


