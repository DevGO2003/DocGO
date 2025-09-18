package com.devgo2003.docgo.contract_service.service.impl;

import com.devgo2003.docgo.contract_service.dto.AiEventDto;
import com.devgo2003.docgo.contract_service.service.IAiEventProcessingService;
import com.devgo2003.docgo.contract_service.entity.Contract;
import com.devgo2003.docgo.contract_service.entity.ContractParty;
import com.devgo2003.docgo.contract_service.entity.ContractSummary;
import com.devgo2003.docgo.contract_service.repository.ContractRepository;
import com.devgo2003.docgo.contract_service.repository.ContractPartyRepository;
import com.devgo2003.docgo.contract_service.repository.ContractSummaryRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AiEventProcessingServiceImpl implements IAiEventProcessingService {
    private static final Logger logger = LoggerFactory.getLogger(AiEventProcessingServiceImpl.class);
    
    private final ContractRepository contractRepository;
    private final ContractPartyRepository partyRepository;
    private final ContractSummaryRepository summaryRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public AiEventProcessingServiceImpl(ContractRepository contractRepository,
                                   ContractPartyRepository partyRepository,
                                   ContractSummaryRepository summaryRepository,
                                   ObjectMapper objectMapper) {
        this.contractRepository = contractRepository;
        this.partyRepository = partyRepository;
        this.summaryRepository = summaryRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public void processSummaryCreatedEvent(AiEventDto event) {
        try {
            logger.info("Processing SummaryCreated event for file: {}", 
                event.getData().getFileInformation().getFilename());

            // Tạo hoặc cập nhật contract từ AI event
            Contract contract = createOrUpdateContractFromAiEvent(event);
            
            // Tạo contract parties
            createContractParties(contract.getId(), event.getData().getContractSummary().getParties());
            
            // Tạo contract summary
            createContractSummary(contract.getId(), event);
            
            logger.info("Successfully processed SummaryCreated event for contract ID: {}", contract.getId());
            
        } catch (Exception e) {
            logger.error("Error processing SummaryCreated event: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process AI event", e);
        }
    }

    private Contract createOrUpdateContractFromAiEvent(AiEventDto event) throws JsonProcessingException {
        AiEventDto.ContractSummaryDto summary = event.getData().getContractSummary();
        AiEventDto.FileInformationDto fileInfo = event.getData().getFileInformation();
        
        // Tìm contract theo fileId hoặc tạo mới
        Contract contract = contractRepository.findBySystemId(fileInfo.getFileId())
                .orElse(Contract.createNew());
        
        // Cập nhật thông tin cơ bản
        if (contract.getId() == null) {
            contract.setContractNumber("CONTRACT-" + System.currentTimeMillis());
            contract.setStatus(Contract.ContractStatus.DRAFT);
        }
        
        contract.setTitle(summary.getTitle());
        contract.setTags(objectMapper.writeValueAsString(summary.getTag()));
        contract.setContractType(extractContractType(summary.getTag()));
        contract.setContractObject(summary.getObject());
        contract.setEffectiveDate(summary.getEffectiveDate());
        contract.setContractTerm(summary.getTerm());
        contract.setTerminationConditions(summary.getTerminationConditions());
        
        // Payment details
        if (summary.getPaymentDetails() != null) {
            contract.setTotalValue(summary.getPaymentDetails().getTotalValue());
            contract.setPaymentSchedule(summary.getPaymentDetails().getSchedule());
            contract.setCurrency(summary.getPaymentDetails().getCurrency());
            contract.setPaymentMethod(summary.getPaymentDetails().getPaymentMethod());
        }
        
        // Risk assessment
        if (summary.getRiskAssessment() != null) {
            contract.setRiskLevel(summary.getRiskAssessment().getRiskLevel());
            contract.setRiskAssessment(objectMapper.writeValueAsString(summary.getRiskAssessment()));
        }
        
        // Compliance status
        if (summary.getComplianceStatus() != null) {
            contract.setComplianceStatus(summary.getComplianceStatus().getStatus());
        }
        
        // File information
        contract.setSystemId(fileInfo.getFileId());
        contract.setAiProcessed(true);
        contract.setProcessingStatus(Contract.ProcessingStatus.COMPLETED);
        
        // Reminders
        if (summary.getReminders() != null) {
            contract.setReminders(objectMapper.writeValueAsString(summary.getReminders()));
        }
        
        // Key terms (combine all clauses)
        contract.setKeyTerms(combineClauses(summary));
        
        return contractRepository.save(contract);
    }

    private void createContractParties(String contractId, List<AiEventDto.ContractPartyDto> parties) {
        // Xóa parties cũ nếu có
        partyRepository.deleteByContractId(contractId);
        
        // Tạo parties mới
        for (int i = 0; i < parties.size(); i++) {
            AiEventDto.ContractPartyDto partyDto = parties.get(i);
            ContractParty party = new ContractParty();
            party.setContractId(contractId);
            party.setPartyName(partyDto.getName());
            party.setPartyType(partyDto.getRole());
            party.setContactPerson(partyDto.getRepresentative());
            party.setTaxCode(partyDto.getTaxCode());
            party.setPhone(partyDto.getContact());
            party.setAddress(partyDto.getAddress());
            
            partyRepository.save(party);
        }
    }

    private void createContractSummary(String contractId, AiEventDto event) throws JsonProcessingException {
        AiEventDto.ContractSummaryDto summary = event.getData().getContractSummary();
        AiEventDto.FileInformationDto fileInfo = event.getData().getFileInformation();
        AiEventDto.AiProcessingResultDto aiResult = event.getData().getAiProcessingResult();
        
        ContractSummary contractSummary = new ContractSummary();
        contractSummary.setContractId(contractId);
        contractSummary.setSummaryText(objectMapper.writeValueAsString(summary));
        contractSummary.setKeyPoints(objectMapper.writeValueAsString(summary.getTag()));
        contractSummary.setRiskAssessment(objectMapper.writeValueAsString(summary.getTag()));
        contractSummary.setRecommendations(objectMapper.writeValueAsString(summary.getTag()));
        
        summaryRepository.save(contractSummary);
    }

    private String extractContractType(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return "GENERAL";
        }
        
        // Logic để extract contract type từ tags
        for (String tag : tags) {
            if (tag.contains("service")) return "SERVICE_AGREEMENT";
            if (tag.contains("purchase")) return "PURCHASE_AGREEMENT";
            if (tag.contains("employment")) return "EMPLOYMENT_CONTRACT";
            if (tag.contains("lease")) return "LEASE_AGREEMENT";
            if (tag.contains("nda")) return "NDA";
        }
        
        return "GENERAL";
    }

    private String combineClauses(AiEventDto.ContractSummaryDto summary) throws JsonProcessingException {
        StringBuilder combined = new StringBuilder();
        
        // Key clauses
        if (summary.getKeyClauses() != null) {
            combined.append("KEY CLAUSES: ");
            combined.append(objectMapper.writeValueAsString(summary.getKeyClauses()));
            combined.append("; ");
        }
        
        // Favorable clauses
        if (summary.getFavorableClauses() != null) {
            combined.append("FAVORABLE CLAUSES: ");
            combined.append(objectMapper.writeValueAsString(summary.getFavorableClauses()));
            combined.append("; ");
        }
        
        // Unfavorable clauses
        if (summary.getUnfavorableClauses() != null) {
            combined.append("UNFAVORABLE CLAUSES: ");
            combined.append(objectMapper.writeValueAsString(summary.getUnfavorableClauses()));
        }
        
        return combined.toString();
    }
}
