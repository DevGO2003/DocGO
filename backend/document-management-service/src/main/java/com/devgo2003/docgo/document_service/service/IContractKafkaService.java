package com.devgo2003.docgo.document_service.service;

import com.devgo2003.docgo.document_service.entity.Contract;
import com.devgo2003.docgo.document_service.dto.AiEventDto;

import java.util.Map;

public interface IContractKafkaService {
    
    /**
     * Gửi sự kiện tạo hợp đồng
     * @param contract Hợp đồng đã tạo
     */
    void sendContractCreatedEvent(Contract contract);
    
    /**
     * Gửi sự kiện cập nhật hợp đồng
     * @param contract Hợp đồng đã cập nhật
     */
    void sendContractUpdatedEvent(Contract contract);
    
    /**
     * Gửi sự kiện xóa hợp đồng
     * @param contractId ID hợp đồng đã xóa
     */
    void sendContractDeletedEvent(String contractId);
    
    /**
     * Gửi sự kiện khôi phục hợp đồng
     * @param contractId ID hợp đồng đã khôi phục
     */
    void sendContractRestoredEvent(String contractId);
    
    /**
     * Gửi sự kiện thay đổi trạng thái hợp đồng
     * @param eventDto Thông tin sự kiện
     */
    void sendContractStatusChangedEvent(AiEventDto eventDto);
    
    /**
     * Xử lý SummaryCreated event và tạo/cập nhật hợp đồng
     * @param event Event data từ Kafka
     */
    void processSummaryCreated(Map<String, Object> event);
    
    /**
     * Gửi sự kiện xử lý AI hoàn thành
     * @param contractId ID hợp đồng
     * @param processingStatus Trạng thái xử lý
     */
    void sendAiProcessingCompletedEvent(String contractId, String processingStatus);
}
