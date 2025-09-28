package com.devgo2003.docgo.document_service.service;

import com.devgo2003.docgo.document_service.entity.Contract;
import com.devgo2003.docgo.document_service.dto.ContractStatusChangeEvent;

public interface IContractStatusEventPublisher {
    
    /**
     * Publish sự kiện thay đổi trạng thái hợp đồng
     * @param contract Hợp đồng có trạng thái thay đổi
     * @param oldStatus Trạng thái cũ
     * @param newStatus Trạng thái mới
     */
    void publishStatusChangeEvent(Contract contract, String oldStatus, String newStatus);
    
    /**
     * Publish sự kiện thay đổi trạng thái hợp đồng với thông tin chi tiết
     * @param event Sự kiện thay đổi trạng thái
     */
    void publishStatusChangeEvent(ContractStatusChangeEvent event);
    
    /**
     * Publish sự kiện hợp đồng sắp hết hạn
     * @param contract Hợp đồng sắp hết hạn
     * @param daysUntilExpiry Số ngày còn lại
     */
    void publishExpiryWarningEvent(Contract contract, int daysUntilExpiry);
    
    /**
     * Publish sự kiện hợp đồng đã hết hạn
     * @param contract Hợp đồng đã hết hạn
     */
    void publishExpiredEvent(Contract contract);
}
