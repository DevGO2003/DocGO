package com.devgo2003.docgo.contract_service.validation;

import com.devgo2003.docgo.contract_service.dto.ContractCreateRequest;
import com.devgo2003.docgo.contract_service.dto.ContractValidationResult;
import com.devgo2003.docgo.contract_service.entity.Contract;
import com.devgo2003.docgo.contract_service.service.IContractValidationService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class ContractValidationTest {

    @Autowired
    private IContractValidationService validationService;

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testContractCreateRequestValidation_Success() {
        // Given
        ContractCreateRequest request = new ContractCreateRequest();
        request.setContractNumber("TEST-001");
        request.setTitle("Test Contract Valid");
        request.setStatus("DRAFT");
        request.setStartDate(LocalDateTime.now().plusDays(1));

        // When
        Set<ConstraintViolation<ContractCreateRequest>> violations = validator.validate(request);

        // Then
        assertTrue(violations.isEmpty(), "Should have no validation violations");
    }

    @Test
    void testContractCreateRequestValidation_InvalidContractNumber() {
        // Given
        ContractCreateRequest request = new ContractCreateRequest();
        request.setContractNumber("test-001"); // Lowercase not allowed
        request.setTitle("Test Contract");
        request.setStatus("DRAFT");
        request.setStartDate(LocalDateTime.now().plusDays(1));

        // When
        Set<ConstraintViolation<ContractCreateRequest>> violations = validator.validate(request);

        // Then
        assertFalse(violations.isEmpty(), "Should have validation violations");
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("contractNumber")), 
                "Should have contractNumber validation error");
    }

    @Test
    void testContractCreateRequestValidation_InvalidStatus() {
        // Given
        ContractCreateRequest request = new ContractCreateRequest();
        request.setContractNumber("TEST-001");
        request.setTitle("Test Contract");
        request.setStatus("INVALID_STATUS"); // Invalid status
        request.setStartDate(LocalDateTime.now().plusDays(1));

        // When
        Set<ConstraintViolation<ContractCreateRequest>> violations = validator.validate(request);

        // Then
        assertFalse(violations.isEmpty(), "Should have validation violations");
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("status")), 
                "Should have status validation error");
    }

    @Test
    void testContractCreateRequestValidation_InvalidCurrency() {
        // Given
        ContractCreateRequest request = new ContractCreateRequest();
        request.setContractNumber("TEST-001");
        request.setTitle("Test Contract");
        request.setStatus("DRAFT");
        request.setStartDate(LocalDateTime.now().plusDays(1));
        request.setCurrency("USD"); // Valid
        request.setPaymentCurrency("INVALID"); // Invalid

        // When
        Set<ConstraintViolation<ContractCreateRequest>> violations = validator.validate(request);

        // Then
        assertFalse(violations.isEmpty(), "Should have validation violations");
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("paymentCurrency")), 
                "Should have paymentCurrency validation error");
    }

    @Test
    void testContractBusinessValidation_Success() {
        // Given
        Contract contract = Contract.createNew();
        contract.setContractNumber("TEST-001");
        contract.setTitle("Test Contract");
        contract.setStatus(Contract.ContractStatus.DRAFT);
        contract.setStartDate(LocalDateTime.now().plusDays(1));

        // When
        ContractValidationResult result = validationService.validateForCreation(contract);

        // Then
        assertTrue(result.isValid(), "Contract should be valid");
        assertTrue(result.getErrors().isEmpty(), "Should have no errors");
    }

    @Test
    void testContractBusinessValidation_InvalidDates() {
        // Given
        Contract contract = Contract.createNew();
        contract.setContractNumber("TEST-001");
        contract.setTitle("Test Contract");
        contract.setStatus(Contract.ContractStatus.DRAFT);
        contract.setStartDate(LocalDateTime.now().plusDays(10));
        contract.setEndDate(LocalDateTime.now().plusDays(5)); // End before start

        // When
        ContractValidationResult result = validationService.validateForCreation(contract);

        // Then
        assertFalse(result.isValid(), "Contract should be invalid");
        assertFalse(result.getErrors().isEmpty(), "Should have errors");
        assertTrue(result.getErrors().stream()
                .anyMatch(error -> error.contains("Ngày bắt đầu không thể sau ngày kết thúc")), 
                "Should have date validation error");
    }

    @Test
    void testContractBusinessValidation_PastStartDate() {
        // Given
        Contract contract = Contract.createNew();
        contract.setContractNumber("TEST-001");
        contract.setTitle("Test Contract");
        contract.setStatus(Contract.ContractStatus.DRAFT);
        contract.setStartDate(LocalDateTime.now().minusDays(1)); // Past date

        // When
        ContractValidationResult result = validationService.validateForCreation(contract);

        // Then
        assertTrue(result.isValid(), "Contract should be valid (only warning)");
        assertFalse(result.getWarnings().isEmpty(), "Should have warnings");
        assertTrue(result.getWarnings().stream()
                .anyMatch(warning -> warning.contains("Ngày bắt đầu hợp đồng trong quá khứ")), 
                "Should have past date warning");
    }

    @Test
    void testContractBusinessValidation_HighValueLowRisk() {
        // Given
        Contract contract = Contract.createNew();
        contract.setContractNumber("TEST-001");
        contract.setTitle("Test Contract");
        contract.setStatus(Contract.ContractStatus.DRAFT);
        contract.setStartDate(LocalDateTime.now().plusDays(1));
        contract.setTotalValue("2000000"); // High value
        contract.setRiskLevel("LOW"); // Low risk

        // When
        ContractValidationResult result = validationService.validateForCreation(contract);

        // Then
        assertTrue(result.isValid(), "Contract should be valid (only warning)");
        assertFalse(result.getWarnings().isEmpty(), "Should have warnings");
        assertTrue(result.getWarnings().stream()
                .anyMatch(warning -> warning.contains("Hợp đồng có giá trị cao nên xem xét mức độ rủi ro")), 
                "Should have risk level warning");
    }
}
