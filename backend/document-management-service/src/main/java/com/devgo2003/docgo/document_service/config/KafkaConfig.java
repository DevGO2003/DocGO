package com.devgo2003.docgo.document_service.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;

/**
 * Kafka Configuration - chỉ enable khi cần thiết
 * Hiện tại tắt để service có thể khởi động mà không cần Kafka
 */
@Configuration
@EnableKafka
@ConditionalOnProperty(name = "spring.kafka.enabled", havingValue = "true", matchIfMissing = false)
public class KafkaConfig {
    // Kafka configuration sẽ chỉ được load khi spring.kafka.enabled=true
}
