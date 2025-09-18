package com.devgo2003.docgo.contract_service.config;

import com.devgo2003.docgo.contract_service.service.event.ContractEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.ApplicationEventPublisher;

@Configuration
public class AppConfig {
    @Bean
    public ContractEventPublisher contractEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        return new ContractEventPublisher(applicationEventPublisher);
    }
}