package com.devgo2003.docgo.document_service.service;

import com.devgo2003.docgo.document_service.entity.Contract;
import com.devgo2003.docgo.document_service.dto.ContractValidationResult;

public interface IContractValidationService {
    
    /**
     * Validate hợp đồng trước khi tạo
     * @param contract Hợp đồng cần validate
     * @return Kết quả validation
     */
    ContractValidationResult validateForCreation(Contract contract);
    
    /**
     * Validate hợp đồng trước khi cập nhật
     * @param contract Hợp đồng cần validate
     * @return Kết quả validation
     */
    ContractValidationResult validateForUpdate(Contract contract);
    
    /**
     * Validate business rules của hợp đồng
     * @param contract Hợp đồng cần validate
     * @return Kết quả validation
     */
    ContractValidationResult validateBusinessRules(Contract contract);
    
    /**
     * Kiểm tra tính hợp lệ của contract number
     * @param contractNumber Số hợp đồng cần kiểm tra
     * @return true nếu hợp lệ
     */
    boolean isValidContractNumber(String contractNumber);
}
