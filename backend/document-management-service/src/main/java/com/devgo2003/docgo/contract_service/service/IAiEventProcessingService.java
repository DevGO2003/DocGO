package com.devgo2003.docgo.document_management_service.service;

import com.devgo2003.docgo.contract_service.dto.AiEventDto;

public interface IAiEventProcessingService {
    
    /**
     * Xử lý sự kiện SummaryCreated từ AI service
     * @param event Sự kiện AI cần xử lý
     */
    void processSummaryCreatedEvent(AiEventDto event);
}
