package com.devgo2003.docgo.contract_service.service;

import com.devgo2003.docgo.contract_service.model.ContractProcessingResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

// @Service
@Slf4j
public class ContractProcessingConsumer {

    // @KafkaListener(topics = "${app.kafka.topic.callback:contract-processing-results}", 
    //                groupId = "${app.kafka.consumer.group-id:contract-service-group}")
    public void consumeContractProcessingResult(ContractProcessingResult result) {
        try {
            log.info("Nhận được kết quả xử lý hợp đồng: {}", result.getRequestId());
            
            // TODO: Xử lý kết quả xử lý hợp đồng
            // FileUploadService đã được loại bỏ, cần implement logic xử lý mới
            log.info("Kết quả xử lý hợp đồng: requestId={}, success={}", 
                    result.getRequestId(), result.getSuccess());
            
        } catch (Exception e) {
            log.error("Lỗi khi xử lý kết quả xử lý hợp đồng: {}", e.getMessage(), e);
        }
    }
}
