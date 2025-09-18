package com.devgo2003.docgo.contract_service.service.impl;

import com.devgo2003.docgo.contract_service.dto.ContractDetailDto;
import com.devgo2003.docgo.contract_service.dto.ContractPartyDto;
import com.devgo2003.docgo.contract_service.dto.ContractValidationResult;
import com.devgo2003.docgo.contract_service.service.IContractValidationService;
import com.devgo2003.docgo.contract_service.entity.Contract;
import com.devgo2003.docgo.contract_service.common.exception.InvalidInputException;
import com.devgo2003.docgo.contract_service.common.exception.ConflictException;
import com.devgo2003.docgo.contract_service.repository.ContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class ContractValidationServiceImpl implements IContractValidationService {
    
    private static final Logger logger = LoggerFactory.getLogger(ContractValidationServiceImpl.class);
    
    private final ContractRepository contractRepository;
    
    // Regex patterns
    private static final Pattern CONTRACT_NUMBER_PATTERN = Pattern.compile("^[A-Z]{2,4}-\\d{4}-\\d{6}$");
    private static final Pattern CURRENCY_PATTERN = Pattern.compile("^[A-Z]{3}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    
    @Autowired
    public ContractValidationServiceImpl(ContractRepository contractRepository) {
        this.contractRepository = contractRepository;
    }
    
    /**
     * Validate contract data before creation
     */
    public void validateContractCreation(ContractDetailDto contractDto) {
        logger.info("Validating contract creation for contract number: {}", contractDto.getContractNumber());
        
        // Basic field validation
        validateRequiredFields(contractDto);
        validateContractNumber(contractDto.getContractNumber());
        validateDates(contractDto.getStartDate(), contractDto.getEndDate());
        validateContractValue(contractDto.getTotalValue(), contractDto.getCurrency());
        
        // Business rule validation
        validateBusinessRules(contractDto);
        
        // Check for duplicates
        validateNoDuplicateContractNumber(contractDto.getContractNumber());
        
        logger.info("Contract validation passed for contract number: {}", contractDto.getContractNumber());
    }
    
    /**
     * Validate contract data before update
     */
    public void validateContractUpdate(String contractId, ContractDetailDto contractDto) {
        logger.info("Validating contract update for ID: {}", contractId);
        
        // Basic field validation
        validateRequiredFields(contractDto);
        validateContractNumber(contractDto.getContractNumber());
        validateDates(contractDto.getStartDate(), contractDto.getEndDate());
        validateContractValue(contractDto.getTotalValue(), contractDto.getCurrency());
        
        // Business rule validation
        validateBusinessRules(contractDto);
        
        // Check for duplicates (excluding current contract)
        validateNoDuplicateContractNumberForUpdate(contractId, contractDto.getContractNumber());
        
        logger.info("Contract update validation passed for ID: {}", contractId);
    }
    
    /**
     * Validate required fields
     */
    private void validateRequiredFields(ContractDetailDto contractDto) {
        if (!StringUtils.hasText(contractDto.getTitle())) {
            throw new InvalidInputException("Contract title is required");
        }
        
        if (!StringUtils.hasText(contractDto.getContractNumber())) {
            throw new InvalidInputException("Contract number is required");
        }
        
        if (!StringUtils.hasText(contractDto.getStatus())) {
            throw new InvalidInputException("Contract status is required");
        }
        
        if (contractDto.getStartDate() == null) {
            throw new InvalidInputException("Contract start date is required");
        }
    }
    
    /**
     * Validate contract number format
     */
    private void validateContractNumber(String contractNumber) {
        if (!CONTRACT_NUMBER_PATTERN.matcher(contractNumber).matches()) {
            throw new InvalidInputException(
                "Invalid contract number format. Expected format: XX-YYYY-ZZZZZZ (e.g., HD-2024-000001)"
            );
        }
    }
    
    /**
     * Validate dates
     */
    private void validateDates(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) {
            throw new InvalidInputException("Start date cannot be null");
        }
        
        if (endDate != null && endDate.isBefore(startDate)) {
            throw new InvalidInputException("End date cannot be before start date");
        }
        
        if (startDate.isBefore(LocalDate.now())) {
            throw new InvalidInputException("Start date cannot be in the past");
        }
    }

    /**
     * Validate dates (overload for LocalDateTime)
     */
    private void validateDates(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null) {
            throw new InvalidInputException("Start date cannot be null");
        }
        
        LocalDate start = startDate.toLocalDate();
        LocalDate end = endDate != null ? endDate.toLocalDate() : null;
        validateDates(start, end);
    }
    
    /**
     * Validate contract value and currency
     */
    private void validateContractValue(String totalValue, String currency) {
        if (StringUtils.hasText(totalValue)) {
            // Just validate that it's not empty and has reasonable length
            if (totalValue.trim().length() > 500) {
                throw new InvalidInputException("Contract value description is too long");
            }
            // Allow any format as it can be descriptive like "100.000VND (Chưa bao gồm phí)"
        }
        
        if (StringUtils.hasText(currency) && !CURRENCY_PATTERN.matcher(currency).matches()) {
            throw new InvalidInputException("Invalid currency format. Use 3-letter currency code (e.g., USD, VND)");
        }
    }
    
    /**
     * Validate business rules
     */
    private void validateBusinessRules(ContractDetailDto contractDto) {
        // Validate contract type
        if (StringUtils.hasText(contractDto.getContractType())) {
            validateContractType(contractDto.getContractType());
        }
        
        // Validate risk level
        if (StringUtils.hasText(contractDto.getRiskLevel())) {
            validateRiskLevel(contractDto.getRiskLevel());
        }
        
        // Validate parties
        if (contractDto.getParties() != null && !contractDto.getParties().isEmpty()) {
            validateParties(contractDto.getParties());
        }
        
        // Validate review deadline
        if (contractDto.getLegalReviewRequired() != null && contractDto.getLegalReviewRequired()) {
            if (contractDto.getReviewDeadline() == null) {
                throw new InvalidInputException("Review deadline is required when legal review is required");
            }
            if (contractDto.getReviewDeadline().toLocalDate().isBefore(LocalDate.now())) {
                throw new InvalidInputException("Review deadline cannot be in the past");
            }
        }
    }
    
    /**
     * Validate contract type
     */
    private void validateContractType(String contractType) {
        List<String> validTypes = List.of(
            "SERVICE", "PURCHASE", "SALES", "PARTNERSHIP", "EMPLOYMENT", 
            "LICENSING", "FRANCHISE", "JOINT_VENTURE", "OTHER"
        );
        
        if (!validTypes.contains(contractType.toUpperCase())) {
            throw new InvalidInputException("Invalid contract type. Valid types: " + String.join(", ", validTypes));
        }
    }
    
    /**
     * Validate risk level
     */
    private void validateRiskLevel(String riskLevel) {
        List<String> validLevels = List.of("LOW", "MEDIUM", "HIGH", "CRITICAL");
        
        if (!validLevels.contains(riskLevel.toUpperCase())) {
            throw new InvalidInputException("Invalid risk level. Valid levels: " + String.join(", ", validLevels));
        }
    }
    
    /**
     * Validate parties
     */
    private void validateParties(List<ContractPartyDto> parties) {
        if (parties.size() < 2) {
            throw new InvalidInputException("Contract must have at least 2 parties");
        }
        
        for (ContractPartyDto party : parties) {
            if (!StringUtils.hasText(party.getPartyName())) {
                throw new InvalidInputException("Party name is required");
            }
            
            if (StringUtils.hasText(party.getContact()) && !EMAIL_PATTERN.matcher(party.getContact()).matches()) {
                throw new InvalidInputException("Invalid email format for party: " + party.getPartyName());
            }
        }
    }
    
    /**
     * Check for duplicate contract number
     */
    private void validateNoDuplicateContractNumber(String contractNumber) {
        if (contractRepository.existsByContractNumber(contractNumber)) {
            throw new ConflictException("Contract number already exists: " + contractNumber);
        }
    }
    
    /**
     * Check for duplicate contract number when updating (excluding current contract)
     */
    private void validateNoDuplicateContractNumberForUpdate(String contractId, String contractNumber) {
        if (contractRepository.existsByContractNumberAndIdNot(contractNumber, contractId)) {
            throw new ConflictException("Contract number already exists: " + contractNumber);
        }
    }
    
    /**
     * Validate contract status transition
     */
    public void validateStatusTransition(String currentStatus, String newStatus) {
        logger.info("Validating status transition from {} to {}", currentStatus, newStatus);
        
        // Define valid status transitions
        if ("DRAFT".equals(currentStatus)) {
            if (!List.of("PENDING", "DRAFT").contains(newStatus)) {
                throw new InvalidInputException("Draft contracts can only transition to PENDING or remain DRAFT");
            }
        } else if ("PENDING".equals(currentStatus)) {
            if (!List.of("PENDING_APPROVAL", "PENDING").contains(newStatus)) {
                throw new InvalidInputException("Pending contracts can only transition to PENDING_APPROVAL or remain PENDING");
            }
        } else if ("PENDING_APPROVAL".equals(currentStatus)) {
            if (!List.of("ACTIVE", "PENDING_APPROVAL").contains(newStatus)) {
                throw new InvalidInputException("Pending approval contracts can only transition to ACTIVE or remain PENDING_APPROVAL");
            }
        } else if ("ACTIVE".equals(currentStatus)) {
            if (!List.of("EXPIRED", "ARCHIVED", "ACTIVE").contains(newStatus)) {
                throw new InvalidInputException("Active contracts can only transition to EXPIRED, ARCHIVED or remain ACTIVE");
            }
        }
        
        logger.info("Status transition validation passed: {} -> {}", currentStatus, newStatus);
    }
    
    /**
     * Validate contract for deletion
     */
    public void validateContractDeletion(Contract contract) {
        if ("ACTIVE".equals(contract.getStatus().name())) {
            throw new InvalidInputException("Cannot delete active contracts. Please archive them first.");
        }
        
        if (contract.getEndDate() != null && contract.getEndDate().toLocalDate().isAfter(LocalDate.now())) {
            throw new InvalidInputException("Cannot delete contracts that are still in effect");
        }
    }

    @Override
    public ContractValidationResult validateForCreation(Contract contract) {
        try {
            // Convert Contract to ContractDetailDto for validation
            ContractDetailDto dto = new ContractDetailDto();
            dto.setContractNumber(contract.getContractNumber());
            dto.setTitle(contract.getTitle());
            dto.setStatus(contract.getStatus() != null ? contract.getStatus().name() : null);
            dto.setStartDate(contract.getStartDate());
            dto.setEndDate(contract.getEndDate());
            dto.setTotalValue(contract.getTotalValue());
            dto.setCurrency(contract.getCurrency());
            
            validateContractCreation(dto);
            return ContractValidationResult.success();
        } catch (InvalidInputException | ConflictException e) {
            return ContractValidationResult.failure(List.of(e.getMessage()));
        }
    }

    @Override
    public ContractValidationResult validateForUpdate(Contract contract) {
        try {
            // Convert Contract to ContractDetailDto for validation
            ContractDetailDto dto = new ContractDetailDto();
            dto.setContractNumber(contract.getContractNumber());
            dto.setTitle(contract.getTitle());
            dto.setStatus(contract.getStatus() != null ? contract.getStatus().name() : null);
            dto.setStartDate(contract.getStartDate());
            dto.setEndDate(contract.getEndDate());
            dto.setTotalValue(contract.getTotalValue());
            dto.setCurrency(contract.getCurrency());
            
            validateContractUpdate(contract.getId(), dto);
            return ContractValidationResult.success();
        } catch (InvalidInputException | ConflictException e) {
            return ContractValidationResult.failure(List.of(e.getMessage()));
        }
    }

    @Override
    public ContractValidationResult validateBusinessRules(Contract contract) {
        try {
            // Convert Contract to ContractDetailDto for validation
            ContractDetailDto dto = new ContractDetailDto();
            dto.setContractNumber(contract.getContractNumber());
            dto.setTitle(contract.getTitle());
            dto.setStatus(contract.getStatus() != null ? contract.getStatus().name() : null);
            dto.setStartDate(contract.getStartDate());
            dto.setEndDate(contract.getEndDate());
            dto.setTotalValue(contract.getTotalValue());
            dto.setCurrency(contract.getCurrency());
            
            validateBusinessRules(dto);
            return ContractValidationResult.success();
        } catch (InvalidInputException e) {
            return ContractValidationResult.failure(List.of(e.getMessage()));
        }
    }

    @Override
    public boolean isValidContractNumber(String contractNumber) {
        try {
            validateContractNumber(contractNumber);
            return true;
        } catch (InvalidInputException e) {
            return false;
        }
    }
}
