package com.devgo2003.docgo.contract_service.service.impl;

import com.devgo2003.docgo.contract_service.entity.Contract;
import com.devgo2003.docgo.contract_service.entity.ContractAttachment;
import com.devgo2003.docgo.contract_service.entity.ContractClause;
import com.devgo2003.docgo.contract_service.entity.ContractRiskAssessment;
import com.devgo2003.docgo.contract_service.entity.ContractComplianceStatus;
import com.devgo2003.docgo.contract_service.entity.ContractReminder;
import com.devgo2003.docgo.contract_service.entity.ContractEvent;
import com.devgo2003.docgo.contract_service.entity.ContractSummary;
import com.devgo2003.docgo.contract_service.entity.ContractParty;
import com.devgo2003.docgo.contract_service.entity.ContractClause;
import com.devgo2003.docgo.contract_service.entity.ContractRiskAssessment;
import com.devgo2003.docgo.contract_service.entity.ContractComplianceStatus;
import com.devgo2003.docgo.contract_service.entity.ContractReminder;
import com.devgo2003.docgo.contract_service.repository.ContractRepository;
import com.devgo2003.docgo.contract_service.repository.ContractClauseRepository;
import com.devgo2003.docgo.contract_service.repository.ContractAttachmentRepository;
import com.devgo2003.docgo.contract_service.repository.ContractEventRepository;
import com.devgo2003.docgo.contract_service.repository.ContractSummaryRepository;
import com.devgo2003.docgo.contract_service.repository.ContractPartyRepository;
import com.devgo2003.docgo.contract_service.repository.ContractPaymentDetailRepository;
import com.devgo2003.docgo.contract_service.repository.ContractRiskAssessmentRepository;
import com.devgo2003.docgo.contract_service.repository.ContractComplianceStatusRepository;
import com.devgo2003.docgo.contract_service.repository.ContractKeyTermRepository;
import com.devgo2003.docgo.contract_service.repository.ContractFavorableClauseRepository;
import com.devgo2003.docgo.contract_service.repository.ContractUnfavorableClauseRepository;
import com.devgo2003.docgo.contract_service.repository.ContractTerminationConditionRepository;
import com.devgo2003.docgo.contract_service.repository.ContractReminderRepository;
import com.devgo2003.docgo.contract_service.dto.ContractWithSummaryDto;
import com.devgo2003.docgo.contract_service.dto.ContractValidationResult;
import com.devgo2003.docgo.contract_service.dto.ContractSummaryDto;
import com.devgo2003.docgo.contract_service.dto.ContractDetailDto;
import com.devgo2003.docgo.contract_service.dto.ContractPartyDto;
import com.devgo2003.docgo.contract_service.dto.ContractResponseDto;
import com.devgo2003.docgo.contract_service.dto.ContractDetailResponseDto;
import com.devgo2003.docgo.contract_service.service.event.ContractEventPublisher;
import com.devgo2003.docgo.contract_service.service.event.ContractEventPayload;
import com.devgo2003.docgo.contract_service.service.event.ContractUpdatedEventPublisher;
import com.devgo2003.docgo.contract_service.service.IContractService;
import com.devgo2003.docgo.contract_service.service.IContractStatusEventPublisher;
import com.devgo2003.docgo.contract_service.service.IContractValidationService;
import com.devgo2003.docgo.contract_service.common.exception.ConflictException;
import com.devgo2003.docgo.contract_service.common.exception.InvalidInputException;
import com.devgo2003.docgo.contract_service.common.exception.NoContentException;
import com.devgo2003.docgo.contract_service.common.exception.ResourceNotFoundException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;
import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.devgo2003.docgo.contract_service.dto.ContractPartyResponseDto;
import com.devgo2003.docgo.contract_service.dto.ContractPaymentDetailsDto;
import com.devgo2003.docgo.contract_service.dto.ContractKeyClauseDto;
import com.devgo2003.docgo.contract_service.dto.ContractFavorableClauseDto;
import com.devgo2003.docgo.contract_service.dto.ContractUnfavorableClauseDto;
import com.devgo2003.docgo.contract_service.dto.ContractReminderDto;
import com.devgo2003.docgo.contract_service.dto.ContractRiskAssessmentResponseDto;
import com.devgo2003.docgo.contract_service.dto.ContractComplianceStatusResponseDto;

@Service
public class ContractServiceImpl implements IContractService {
    private static final Logger logger = LoggerFactory.getLogger(ContractServiceImpl.class);
    
    private final ContractRepository contractRepository;
    private final ContractAttachmentRepository attachmentRepository;
    private final ContractEventRepository eventRepository;
    private final ContractSummaryRepository summaryRepository;
    private final ContractPartyRepository partyRepository;
    private final ContractPaymentDetailRepository paymentDetailRepository;
    private final ContractRiskAssessmentRepository riskAssessmentRepository;
    private final ContractComplianceStatusRepository complianceStatusRepository;
    private final ContractKeyTermRepository keyTermRepository;
    private final ContractFavorableClauseRepository favorableClauseRepository;
    private final ContractUnfavorableClauseRepository unfavorableClauseRepository;
    private final ContractTerminationConditionRepository terminationConditionRepository;
    private final ContractClauseRepository contractClauseRepository;
    private final ContractReminderRepository contractReminderRepository;
    private final ContractRiskAssessmentRepository contractRiskAssessmentRepository;
    private final ContractComplianceStatusRepository contractComplianceStatusRepository;
    private final ContractEventPublisher eventPublisher;
    private final IContractStatusEventPublisher contractStatusEventPublisher;
    private final ContractUpdatedEventPublisher contractUpdatedEventPublisher;
    private final ObjectMapper objectMapper;
    private final IContractValidationService validationService;
    private final MongoTemplate mongoTemplate;

    private static final Set<String> VALID_SORT_BY_PROPERTIES = new HashSet<>(Arrays.asList(
            "id", "contractNumber", "title", "status", "partiesJson", "startDate", "endDate", "systemId",
            "createdAt", "createdBy", "deletedAt", "deletedBy", "isDeleted", "version"
    ));

    @Autowired
    public ContractServiceImpl(ContractRepository contractRepository,
                           ContractAttachmentRepository attachmentRepository,
                           ContractEventRepository eventRepository,
                           ContractSummaryRepository summaryRepository,
                           ContractPartyRepository partyRepository,
                           ContractPaymentDetailRepository paymentDetailRepository,
                           ContractRiskAssessmentRepository riskAssessmentRepository,
                           ContractComplianceStatusRepository complianceStatusRepository,
                           ContractKeyTermRepository keyTermRepository,
                           ContractFavorableClauseRepository favorableClauseRepository,
                           ContractUnfavorableClauseRepository unfavorableClauseRepository,
                           ContractTerminationConditionRepository terminationConditionRepository,
                           ContractClauseRepository contractClauseRepository,
                           ContractReminderRepository contractReminderRepository,
                           ContractRiskAssessmentRepository contractRiskAssessmentRepository,
                           ContractComplianceStatusRepository contractComplianceStatusRepository,
                           ContractEventPublisher eventPublisher,
                           IContractStatusEventPublisher contractStatusEventPublisher,
                           ContractUpdatedEventPublisher contractUpdatedEventPublisher,
                           ObjectMapper objectMapper,
                           IContractValidationService validationService,
                           MongoTemplate mongoTemplate) {
        this.contractRepository = contractRepository;
        this.attachmentRepository = attachmentRepository;
        this.eventRepository = eventRepository;
        this.summaryRepository = summaryRepository;
        this.partyRepository = partyRepository;
        this.paymentDetailRepository = paymentDetailRepository;
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.complianceStatusRepository = complianceStatusRepository;
        this.keyTermRepository = keyTermRepository;
        this.favorableClauseRepository = favorableClauseRepository;
        this.unfavorableClauseRepository = unfavorableClauseRepository;
        this.terminationConditionRepository = terminationConditionRepository;
        this.contractClauseRepository = contractClauseRepository;
        this.contractReminderRepository = contractReminderRepository;
        this.contractRiskAssessmentRepository = contractRiskAssessmentRepository;
        this.contractComplianceStatusRepository = contractComplianceStatusRepository;
        this.eventPublisher = eventPublisher;
        this.contractStatusEventPublisher = contractStatusEventPublisher;
        this.contractUpdatedEventPublisher = contractUpdatedEventPublisher;
        this.objectMapper = objectMapper;
        this.validationService = validationService;
        this.mongoTemplate = mongoTemplate;
    }

    /**
     * Hàm tiện ích để lấy contract hoặc ném ResourceNotFoundException
     */
    private Contract getContractOrThrow(String id) {
        return contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hợp đồng với ID: " + id));
    }

    @Override
    @Transactional
    public Contract createContract(Contract contract) {
        logger.info("Creating new contract with number: {}", contract.getContractNumber());
        
        // Validate contract data
        ContractValidationResult validationResult = validationService.validateForCreation(contract);
        if (!validationResult.isValid()) {
            logger.error("Contract validation failed: {}", validationResult.getErrors());
            throw new InvalidInputException("Validation failed: " + String.join(", ", validationResult.getErrors()));
        }
        
        if (!validationResult.getWarnings().isEmpty()) {
            logger.warn("Contract validation warnings: {}", validationResult.getWarnings());
        }
        
        // Set default values
        contract.setId(null); // Ensure new contract
        contract.setCreatedAt(LocalDateTime.now());
        contract.setUpdatedAt(LocalDateTime.now());
        contract.setVersion(1L);
        
        // Save contract
        Contract savedContract = contractRepository.save(contract);
        logger.info("Successfully created contract with ID: {}", savedContract.getId());
        
        // Create event
        ContractEvent event = new ContractEvent();
        event.setContractId(savedContract.getId());
        event.setEventType("CREATE");
        event.setEventData("{\"message\": \"Tạo hợp đồng mới\"}");
        event.setUserId("system");
        eventRepository.save(event);
        
        // Publish events
        try {
            eventPublisher.publishEvent(new ContractEventPayload(savedContract, "created"));
            contractStatusEventPublisher.publishStatusChangeEvent(savedContract, "DRAFT", "DRAFT");
        } catch (Exception e) {
            logger.error("Failed to publish contract created event: {}", e.getMessage());
        }
        
        return savedContract;
    }

    public Optional<Contract> getContract(String id) {
        return contractRepository.findById(id);
    }

    public Page<ContractWithSummaryDto> getAllContracts(int pageNumber, int pageSize, List<String> sortBy, List<String> sortDirection, boolean includeDeleted) {
        List<Sort.Order> orders = new ArrayList<>();
        if (sortBy != null && !sortBy.isEmpty()) {
            for (int i = 0; i < sortBy.size(); i++) {
                String property = sortBy.get(i);
                if (!VALID_SORT_BY_PROPERTIES.contains(property)) {
                    throw new InvalidInputException("Thuộc tính sắp xếp không hợp lệ: " + property);
                }
                Sort.Direction direction = (sortDirection != null && i < sortDirection.size())
                        ? Sort.Direction.fromString(sortDirection.get(i))
                        : Sort.Direction.ASC;
                orders.add(new Sort.Order(direction, property));
            }
        }

        Sort sort = Sort.by(orders);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<Contract> contractsPage;
        if (includeDeleted) {
            contractsPage = contractRepository.findAll(pageable);
        } else {
            contractsPage = contractRepository.findByIsDeletedFalse(pageable);
        }

        // Chuyển đổi thành ContractWithSummaryDto
        List<ContractWithSummaryDto> contractsWithSummary = contractsPage.getContent().stream()
                .map(this::convertToContractWithSummaryDto)
                .collect(Collectors.toList());

        return new org.springframework.data.domain.PageImpl<>(
                contractsWithSummary,
                contractsPage.getPageable(),
                contractsPage.getTotalElements()
        );
    }

    public List<Contract> getActiveContracts() {
        return contractRepository.findByIsDeletedFalse();
    }

    public List<Contract> getContractsByStatus(String status) {
        try {
            Contract.ContractStatus contractStatus = Contract.ContractStatus.valueOf(status.toUpperCase());
            return contractRepository.findByStatusAndIsDeletedFalse(contractStatus);
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Trạng thái hợp đồng không hợp lệ: " + status);
        }
    }

    @Override
    @Transactional
    public Contract updateContract(String id, Contract updatedContract) {
        Contract existingContract = getContractOrThrow(id);

        if (existingContract.getIsDeleted()) {
            throw new ConflictException("Không thể cập nhật hợp đồng đã bị xóa");
        }

        // Validate status transition
        if (!existingContract.getStatus().equals(updatedContract.getStatus())) {
            // Note: Status transition validation would need to be implemented
            logger.info("Status transition from {} to {}", existingContract.getStatus(), updatedContract.getStatus());
        }

        // Validate updated contract data
        validationService.validateForUpdate(updatedContract);

        existingContract.setTitle(updatedContract.getTitle());
        existingContract.setStatus(updatedContract.getStatus());
        existingContract.setPartiesJson(updatedContract.getPartiesJson());
        existingContract.setStartDate(updatedContract.getStartDate());
        existingContract.setEndDate(updatedContract.getEndDate());
        existingContract.setSystemId(updatedContract.getSystemId());

        Contract savedContract = contractRepository.save(existingContract);

        ContractEvent event = new ContractEvent();
        event.setContractId(savedContract.getId());
        event.setEventType("UPDATE");
        event.setEventData("{\"message\": \"Cập nhật hợp đồng\"}");
        event.setUserId("system");
        eventRepository.save(event);

        eventPublisher.publishEvent(new ContractEventPayload(savedContract, "updated"));
        return savedContract;
    }

    @Override
    @Transactional
    public void softDeleteContract(String id) {
        Contract contract = getContractOrThrow(id);

        if (contract.getIsDeleted()) {
            throw new ConflictException("Hợp đồng đã bị xóa trước đó");
        }

        // Validate contract for deletion
        // Note: Contract deletion validation would need to be implemented
        logger.info("Validating contract deletion for contract ID: {}", contract.getId());

        contract.markAsDeleted("system");
        contract.setStatus(Contract.ContractStatus.EXPIRED);
        contractRepository.save(contract);

        ContractEvent event = new ContractEvent();
        event.setContractId(contract.getId());
        event.setEventType("SOFT_DELETE");
        event.setEventData("{\"message\": \"Xóa mềm hợp đồng\"}");
        event.setUserId("system");
        eventRepository.save(event);

        eventPublisher.publishEvent(new ContractEventPayload(contract, "soft_deleted"));
    }

    @Override
    @Transactional
    public void restoreContract(String id) {
        Contract contract = getContractOrThrow(id);

        if (!contract.getIsDeleted()) {
            throw new ConflictException("Hợp đồng chưa bị xóa");
        }

        contract.restore();
        contract.setStatus(Contract.ContractStatus.DRAFT);
        contractRepository.save(contract);

        ContractEvent event = new ContractEvent();
        event.setContractId(contract.getId());
        event.setEventType("RESTORE");
        event.setEventData("{\"message\": \"Khôi phục hợp đồng\"}");
        event.setUserId("system");
        eventRepository.save(event);

        eventPublisher.publishEvent(new ContractEventPayload(contract, "restored"));
    }

    @Transactional
    public ContractAttachment addAttachment(String contractId, ContractAttachment attachment) {
        Contract contract = getContractOrThrow(contractId);

        if (contract.getIsDeleted()) {
            throw new ConflictException("Không thể thêm file đính kèm cho hợp đồng đã bị xóa");
        }

        attachment.setContractId(contractId);
        ContractAttachment savedAttachment = attachmentRepository.save(attachment);

        ContractEvent event = new ContractEvent();
        event.setContractId(contractId);
        event.setEventType("ATTACHMENT_ADD");
        event.setEventData("{\"file_name\": \"" + savedAttachment.getFileName() + "\"}");
        event.setUserId("system");
        eventRepository.save(event);

        return savedAttachment;
    }

    @Override
    public List<ContractAttachment> getAttachments(String contractId) {
        getContractOrThrow(contractId);
        List<ContractAttachment> attachments = attachmentRepository.findByContractId(contractId);
        if (attachments.isEmpty()) {
            throw new NoContentException("Không tìm thấy file đính kèm nào cho hợp đồng này.");
        }
        return attachments;
    }

    @Override
    public List<ContractEvent> getContractEvents(String contractId) {
        return eventRepository.findByContractIdOrderByTimestampDesc(contractId);
    }

    /**
     * Lấy tất cả contracts cơ bản (không có summary) - giữ lại để tương thích
     */
    public Page<Contract> getAllContractsBasic(int pageNumber, int pageSize, List<String> sortBy, List<String> sortDirection, boolean includeDeleted) {
        List<Sort.Order> orders = new ArrayList<>();
        if (sortBy != null && !sortBy.isEmpty()) {
            for (int i = 0; i < sortBy.size(); i++) {
                String property = sortBy.get(i);
                if (!VALID_SORT_BY_PROPERTIES.contains(property)) {
                    throw new InvalidInputException("Thuộc tính sắp xếp không hợp lệ: " + property);
                }
                Sort.Direction direction = (sortDirection != null && i < sortDirection.size())
                        ? Sort.Direction.fromString(sortDirection.get(i))
                        : Sort.Direction.ASC;
                orders.add(new Sort.Order(direction, property));
            }
        }

        Sort sort = Sort.by(orders);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        if (includeDeleted) {
            return contractRepository.findAll(pageable);
        } else {
            return contractRepository.findByIsDeletedFalse(pageable);
        }
    }

    /**
     * Lấy tất cả contracts với summary information (API chính)
     */
    @Override
    public Page<ContractWithSummaryDto> getAllContractsWithSummary(int pageNumber, int pageSize, List<String> sortBy, List<String> sortDirection, boolean includeDeleted) {
        Page<Contract> contractsPage = getAllContractsBasic(pageNumber, pageSize, sortBy, sortDirection, includeDeleted);
        
        List<ContractWithSummaryDto> contractsWithSummary = contractsPage.getContent().stream()
                .map(this::convertToContractWithSummaryDto)
                .collect(Collectors.toList());
        
        return new org.springframework.data.domain.PageImpl<>(
                contractsWithSummary,
                contractsPage.getPageable(),
                contractsPage.getTotalElements()
        );
    }

    /**
     * Lấy contract với summary theo ID
     */
    @Override
    public ContractWithSummaryDto getContractWithSummary(String id) {
        Contract contract = getContractOrThrow(id);
        return convertToContractWithSummaryDto(contract);
    }

    /**
     * Chuyển đổi Contract entity thành ContractWithSummaryDto
     */
    private ContractWithSummaryDto convertToContractWithSummaryDto(Contract contract) {
        Optional<ContractSummary> summaryOpt = summaryRepository.findByContractId(contract.getId());
        List<ContractSummaryDto> summaryDtos = new ArrayList<>();
        if (summaryOpt.isPresent()) {
            summaryDtos.add(convertToContractSummaryDto(summaryOpt.get()));
        }

        return ContractWithSummaryDto.builder()
                .id(contract.getId())
                .contractNumber(contract.getContractNumber())
                .title(contract.getTitle())
                .status(contract.getStatus().name())
                .partiesJson(contract.getPartiesJson())
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .systemId(contract.getSystemId())
                .summary(contract.getSummary())
                .contractType(contract.getContractType())
                .riskLevel(contract.getRiskLevel())
                .keyTerms(contract.getKeyTerms())
                .aiProcessed(contract.getAiProcessed())
                .processingStatus(contract.getProcessingStatus() != null ? contract.getProcessingStatus().name() : null)
                .createdAt(contract.getCreatedAt())
                .createdBy(contract.getCreatedBy())
                .deletedAt(contract.getDeletedAt())
                .deletedBy(contract.getDeletedBy())
                .isDeleted(contract.getIsDeleted())
                .version(contract.getVersion())
                .summaries(summaryDtos)
                .build();
    }

    /**
     * Chuyển đổi ContractSummary entity thành ContractSummaryDto
     */
    private ContractSummaryDto convertToContractSummaryDto(ContractSummary summary) {
        List<String> keyPoints = new ArrayList<>();
        List<String> riskAssessment = new ArrayList<>();
        
        try {
            if (summary.getKeyPoints() != null) {
                keyPoints = objectMapper.readValue(summary.getKeyPoints(), new TypeReference<List<String>>() {});
            }
            if (summary.getRiskAssessment() != null) {
                riskAssessment = objectMapper.readValue(summary.getRiskAssessment(), new TypeReference<List<String>>() {});
            }
        } catch (Exception e) {
            // Log error but continue with empty lists
        }

        return ContractSummaryDto.builder()
                .id(summary.getId())
                .contractId(summary.getContractId())
                .summary(summary.getSummaryText())
                .keyPoints(keyPoints)
                .categories(riskAssessment)
                .createdAt(summary.getCreatedAt())
                .updatedAt(summary.getUpdatedAt())
                .build();
    }

    /**
     * Lấy tất cả contracts với thông tin chi tiết đầy đủ
     */
    @Override
    public Page<ContractDetailDto> getAllContractsWithDetails(int pageNumber, int pageSize, List<String> sortBy, List<String> sortDirection, boolean includeDeleted) {
        Page<Contract> contractsPage = getAllContractsBasic(pageNumber, pageSize, sortBy, sortDirection, includeDeleted);
        
        List<ContractDetailDto> contractsWithDetails = contractsPage.getContent().stream()
                .map(this::convertToContractDetailDto)
                .collect(Collectors.toList());
        
        return new org.springframework.data.domain.PageImpl<>(
                contractsWithDetails,
                contractsPage.getPageable(),
                contractsPage.getTotalElements()
        );
    }

    /**
     * Lấy contract với thông tin chi tiết đầy đủ theo ID
     */
    @Override
    public ContractDetailDto getContractWithDetails(String id) {
        Contract contract = getContractOrThrow(id);
        return convertToContractDetailDto(contract);
    }

    /**
     * Chuyển đổi Contract entity thành ContractDetailDto
     */
    private ContractDetailDto convertToContractDetailDto(Contract contract) {
        // Lấy summaries
        Optional<ContractSummary> summaryOpt = summaryRepository.findByContractId(contract.getId());
        List<ContractSummaryDto> summaryDtos = new ArrayList<>();
        if (summaryOpt.isPresent()) {
            summaryDtos.add(convertToContractSummaryDto(summaryOpt.get()));
        }

        // Lấy parties
        List<ContractParty> parties = partyRepository.findByContractId(contract.getId());
        List<ContractPartyDto> partyDtos = parties.stream()
                .map(this::convertToContractPartyDto)
                .collect(Collectors.toList());

        return ContractDetailDto.builder()
                .id(contract.getId())
                .contractNumber(contract.getContractNumber())
                .title(contract.getTitle())
                .status(contract.getStatus().name())
                .partiesJson(contract.getPartiesJson())
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .systemId(contract.getSystemId())
                .summary(contract.getSummary())
                .contractType(contract.getContractType())
                .riskLevel(contract.getRiskLevel())
                .keyTerms(contract.getKeyTerms())
                .aiProcessed(contract.getAiProcessed())
                .processingStatus(contract.getProcessingStatus() != null ? contract.getProcessingStatus().name() : null)
                .createdAt(contract.getCreatedAt())
                .createdBy(contract.getCreatedBy())
                .deletedAt(contract.getDeletedAt())
                .deletedBy(contract.getDeletedBy())
                .isDeleted(contract.getIsDeleted())
                .version(contract.getVersion())
                // New fields from updated schema
                .contractObject(contract.getContractObject())
                .effectiveDate(contract.getEffectiveDate())
                .contractTerm(contract.getContractTerm())
                .totalValue(contract.getTotalValue())
                .paymentSchedule(contract.getPaymentSchedule())
                .currency(contract.getCurrency())
                .terminationConditions(contract.getTerminationConditions())
                .riskAssessment(contract.getRiskAssessment())
                .complianceStatus(contract.getComplianceStatus())
                .legalReviewRequired(contract.getLegalReviewRequired())
                .reviewDeadline(contract.getReviewDeadline())
                // Related data
                .summaries(summaryDtos)
                .parties(partyDtos)
                .build();
    }

    /**
     * Chuyển đổi ContractParty entity thành ContractPartyDto
     */
    private ContractPartyDto convertToContractPartyDto(ContractParty party) {
        return ContractPartyDto.builder()
                .id(party.getId())
                .contractId(party.getContractId())
                .partyName(party.getPartyName())
                .partyRole(party.getPartyType())
                .representative(party.getContactPerson())
                .taxCode(party.getTaxCode())
                .contact(party.getPhone())
                .address(party.getAddress())
                .createdAt(party.getCreatedAt())
                .updatedAt(party.getUpdatedAt())
                .build();
    }

    /**
     * Lấy contract với response format mới nhất quán
     */
    public ContractResponseDto getContractWithNewFormat(String id) {
        Contract contract = getContractOrThrow(id);
        List<ContractParty> parties = partyRepository.findByContractId(contract.getId());
        
        return mapContractToResponseDto(contract, parties);
    }

    /**
     * Lấy tất cả contracts với response format mới nhất quán
     */
    public Page<ContractResponseDto> getAllContractsWithNewFormat(int pageNumber, int pageSize, List<String> sortBy, List<String> sortDirection, boolean includeDeleted) {
        Page<Contract> contractsPage = getAllContractsBasic(pageNumber, pageSize, sortBy, sortDirection, includeDeleted);
        
        List<ContractResponseDto> contractsWithNewFormat = contractsPage.getContent().stream()
                .map(contract -> {
                    List<ContractParty> parties = partyRepository.findByContractId(contract.getId());
                    return mapContractToResponseDto(contract, parties);
                })
                .collect(Collectors.toList());
        
        return new org.springframework.data.domain.PageImpl<>(
                contractsWithNewFormat,
                contractsPage.getPageable(),
                contractsPage.getTotalElements()
        );
    }

    /**
     * Map Contract entity sang ContractResponseDto theo cấu trúc mới
     */
    private ContractResponseDto mapContractToResponseDto(Contract contract, List<ContractParty> parties) {
        // Parse tags từ string sang List
        List<String> tags = new ArrayList<>();
        if (contract.getTags() != null && !contract.getTags().trim().isEmpty()) {
            tags = Arrays.asList(contract.getTags().split("\\s*,\\s*"));
        }

        // Map parties
        List<ContractPartyResponseDto> partyDtos = parties.stream()
                .map(party -> ContractPartyResponseDto.builder()
                        .role(party.getPartyType())
                        .name(party.getPartyName())
                        .representative(party.getContactPerson())
                        .taxCode(party.getTaxCode())
                        .contact(party.getPhone())
                        .address(party.getAddress())
                        .businessLicense(null) // Không có field này trong ContractParty
                        .build())
                .collect(Collectors.toList());

        // Map payment details
        ContractPaymentDetailsDto paymentDetails = ContractPaymentDetailsDto.builder()
                .totalValue(contract.getTotalValue())
                .schedule(contract.getPaymentSchedule())
                .currency(contract.getCurrency())
                .paymentMethod(contract.getPaymentMethod())
                .build();

        // Map key clauses - parse from JSON if available, otherwise from string
        List<ContractKeyClauseDto> keyClauses = new ArrayList<>();
        if (contract.getKeyTerms() != null && !contract.getKeyTerms().trim().isEmpty()) {
            try {
                // Try to parse as JSON first
                ObjectMapper mapper = new ObjectMapper();
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> keyClausesList = mapper.readValue(contract.getKeyTerms(), 
                    new TypeReference<List<Map<String, Object>>>() {});
                
                for (Map<String, Object> clause : keyClausesList) {
                    keyClauses.add(ContractKeyClauseDto.builder()
                            .name((String) clause.get("name"))
                            .description((String) clause.get("description"))
                            .source((String) clause.get("source"))
                            .build());
                }
            } catch (Exception e) {
                // Fallback to string format
            keyClauses.add(ContractKeyClauseDto.builder()
                    .name("Key Terms")
                    .description(contract.getKeyTerms())
                    .source("Contract")
                    .build());
            }
        }

        // Map favorable clauses - parse from JSON if available, otherwise from string
        List<ContractFavorableClauseDto> favorableClauses = new ArrayList<>();
        if (contract.getFavorableClauses() != null && !contract.getFavorableClauses().trim().isEmpty()) {
            try {
                // Try to parse as JSON first
                ObjectMapper mapper = new ObjectMapper();
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> favorableClausesList = mapper.readValue(contract.getFavorableClauses(), 
                    new TypeReference<List<Map<String, Object>>>() {});
                
                for (Map<String, Object> clause : favorableClausesList) {
                    favorableClauses.add(ContractFavorableClauseDto.builder()
                            .clauseName((String) clause.get("clauseName"))
                            .description((String) clause.get("description"))
                            .benefitTo((String) clause.get("benefitTo"))
                            .build());
                }
            } catch (Exception e) {
                // Fallback to string format
            favorableClauses.add(ContractFavorableClauseDto.builder()
                    .clauseName("Favorable Clauses")
                    .description(contract.getFavorableClauses())
                    .benefitTo("Client")
                    .build());
            }
        }

        // Map unfavorable clauses - parse from JSON if available, otherwise from string
        List<ContractUnfavorableClauseDto> unfavorableClauses = new ArrayList<>();
        if (contract.getUnfavorableClauses() != null && !contract.getUnfavorableClauses().trim().isEmpty()) {
            try {
                // Try to parse as JSON first
                ObjectMapper mapper = new ObjectMapper();
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> unfavorableClausesList = mapper.readValue(contract.getUnfavorableClauses(), 
                    new TypeReference<List<Map<String, Object>>>() {});
                
                for (Map<String, Object> clause : unfavorableClausesList) {
                    unfavorableClauses.add(ContractUnfavorableClauseDto.builder()
                            .clauseName((String) clause.get("clauseName"))
                            .description((String) clause.get("description"))
                            .riskTo((String) clause.get("riskTo"))
                            .build());
                }
            } catch (Exception e) {
                // Fallback to string format
            unfavorableClauses.add(ContractUnfavorableClauseDto.builder()
                    .clauseName("Unfavorable Clauses")
                    .description(contract.getUnfavorableClauses())
                    .riskTo("Client")
                    .build());
            }
        }

        // Map reminders
        List<ContractReminderDto> reminders = new ArrayList<>();
        if (contract.getReminders() != null && !contract.getReminders().trim().isEmpty()) {
            reminders.add(ContractReminderDto.builder()
                    .type("General")
                    .date(contract.getEffectiveDate())
                    .content(contract.getReminders())
                    .build());
        }

        // Map risk assessment - parse from JSON if available, otherwise from string
        ContractRiskAssessmentResponseDto riskAssessment = ContractRiskAssessmentResponseDto.builder()
                .riskLevel(contract.getRiskLevel())
                .riskFactors(new ArrayList<>())
                .mitigationMeasures(new ArrayList<>())
                .build();

        if (contract.getRiskAssessment() != null && !contract.getRiskAssessment().trim().isEmpty()) {
            try {
                // Try to parse as JSON first
                ObjectMapper mapper = new ObjectMapper();
                @SuppressWarnings("unchecked")
                Map<String, Object> riskMap = mapper.readValue(contract.getRiskAssessment(), 
                    new TypeReference<Map<String, Object>>() {});
                
                riskAssessment.setRiskLevel((String) riskMap.get("riskLevel"));
                
                Object riskFactorsObj = riskMap.get("riskFactors");
                if (riskFactorsObj instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<String> riskFactors = (List<String>) riskFactorsObj;
                    riskAssessment.setRiskFactors(riskFactors);
                }
                
                Object mitigationMeasuresObj = riskMap.get("mitigationMeasures");
                if (mitigationMeasuresObj instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<String> mitigationMeasures = (List<String>) mitigationMeasuresObj;
                    riskAssessment.setMitigationMeasures(mitigationMeasures);
                }
            } catch (Exception e) {
                // Fallback to string format
                riskAssessment.setRiskFactors(Arrays.asList(contract.getRiskAssessment().split("\\s*,\\s*")));
            }
        }

        // Map compliance status - parse from JSON if available, otherwise from string
        ContractComplianceStatusResponseDto complianceStatus = ContractComplianceStatusResponseDto.builder()
                .status(contract.getComplianceStatus())
                .issues(new ArrayList<>())
                .recommendations(new ArrayList<>())
                .build();
        
        // Try to parse compliance status from JSON if available
        if (contract.getComplianceStatus() != null && !contract.getComplianceStatus().trim().isEmpty()) {
            try {
                // Try to parse as JSON first
                ObjectMapper mapper = new ObjectMapper();
                @SuppressWarnings("unchecked")
                Map<String, Object> complianceMap = mapper.readValue(contract.getComplianceStatus(), 
                    new TypeReference<Map<String, Object>>() {});
                
                complianceStatus.setStatus((String) complianceMap.get("status"));
                
                Object issuesObj = complianceMap.get("issues");
                if (issuesObj instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<String> issues = (List<String>) issuesObj;
                    complianceStatus.setIssues(issues);
                }
                
                Object recommendationsObj = complianceMap.get("recommendations");
                if (recommendationsObj instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<String> recommendations = (List<String>) recommendationsObj;
                    complianceStatus.setRecommendations(recommendations);
                }
            } catch (Exception e) {
                // Keep as string status only
                complianceStatus.setStatus(contract.getComplianceStatus());
            }
        }

        return ContractResponseDto.builder()
                .id(contract.getId())
                .contractNumber(contract.getContractNumber())
                .status(contract.getStatus() != null ? contract.getStatus().name() : null)
                .contractType(contract.getContractType())
                .title(contract.getTitle())
                .tags(tags)
                .parties(partyDtos)
                .object(contract.getContractObject())
                .effectiveDate(contract.getEffectiveDate())
                .term(contract.getContractTerm())
                .paymentDetails(paymentDetails)
                .keyClauses(keyClauses)
                .favorableClauses(favorableClauses)
                .unfavorableClauses(unfavorableClauses)
                .reminders(reminders)
                .terminationConditions(contract.getTerminationConditions())
                .riskAssessment(riskAssessment)
                .complianceStatus(complianceStatus)
                .build();
    }

    /**
     * Lấy contract với format mới theo cấu trúc response mới
     */
    @Override
    public ContractDetailResponseDto getContractWithDetailFormat(String id) {
        Contract contract = getContractOrThrow(id);
        List<ContractParty> parties = partyRepository.findByContractId(contract.getId());
        
        return ContractDetailResponseDto.fromContract(contract, parties);
    }

    /**
     * Lấy tất cả contracts với format mới theo cấu trúc response mới
     */
    @Override
    public Page<ContractDetailResponseDto> getAllContractsWithDetailFormat(int pageNumber, int pageSize, List<String> sortBy, List<String> sortDirection, boolean includeDeleted) {
        Page<Contract> contractsPage = getAllContractsBasic(pageNumber, pageSize, sortBy, sortDirection, includeDeleted);
        
        List<ContractDetailResponseDto> contractsWithDetailFormat = contractsPage.getContent().stream()
                .map(contract -> {
                    List<ContractParty> parties = partyRepository.findByContractId(contract.getId());
                    return ContractDetailResponseDto.fromContract(contract, parties);
                })
                .collect(Collectors.toList());
        
        return new org.springframework.data.domain.PageImpl<>(
                contractsWithDetailFormat,
                contractsPage.getPageable(),
                contractsPage.getTotalElements()
        );
    }

    @Override
    public boolean existsByContractNumber(String contractNumber) {
        return contractRepository.existsByContractNumber(contractNumber);
    }

    @Override
    public boolean existsBySystemId(String systemId) {
        return contractRepository.findBySystemId(systemId).isPresent();
    }
    
    // AI Processing methods implementation
    @Override
    public void createOrUpdateContractSummary(String contractId, String fileId, String filename, String summary, 
                                              Integer summaryLength, List<String> keyPoints, String extractionMethod, 
                                              java.math.BigDecimal confidence, String classification, 
                                              java.math.BigDecimal classificationConfidence, List<String> categories) {
        try {
            ContractSummary contractSummary = new ContractSummary();
            contractSummary.setContractId(contractId);
            contractSummary.setSummaryText(summary);
            contractSummary.setKeyPoints(keyPoints != null ? String.join(",", keyPoints) : "");
            contractSummary.setRiskAssessment(categories != null ? String.join(",", categories) : "");
            contractSummary.setRecommendations("AI Processed");
            
            summaryRepository.save(contractSummary);
            logger.info("✅ Saved contract summary for contract ID: {} and file: {}", contractId, filename);
        } catch (Exception e) {
            logger.error("❌ Error saving contract summary: {}", e.getMessage(), e);
        }
    }
    
    @Override
    public void createOrUpdateContractFile(String contractId, String fileId, String filename, String fileType, 
                                         String fileKey, String bucket, String summary, Integer summaryLength, 
                                         List<String> keyPoints, String extractionMethod, java.math.BigDecimal confidence, 
                                         String classification, java.math.BigDecimal classificationConfidence, List<String> categories) {
        // Note: This would require a ContractFile entity and repository
        // For now, we'll store this information in the contract's systemId field
        Contract contract = getContractOrThrow(contractId);
        contract.setSystemId(fileId);
        
        // Có thể lưu thêm thông tin file vào các trường khác nếu cần
        if (contract.getSummary() == null || contract.getSummary().isEmpty()) {
            contract.setSummary(summary);
        }
        
        contractRepository.save(contract);
        logger.info("✅ Saved contract file info for contract ID: {} and file: {}", contractId, filename);
    }
    
    @Override
    public void createOrUpdateContractParty(String contractId, String partyName, String partyRole, 
                                           String representative, String taxCode, String contact) {
        try {
            ContractParty party = new ContractParty();
            party.setContractId(contractId);
            party.setPartyName(partyName);
            party.setPartyType(partyRole);
            party.setContactPerson(representative);
            party.setTaxCode(taxCode);
            party.setPhone(contact);
            
            partyRepository.save(party);
            logger.info("✅ Saved contract party for contract ID: {} - name: {}, role: {}", contractId, partyName, partyRole);
        } catch (Exception e) {
            logger.error("❌ Error saving contract party: {}", e.getMessage(), e);
        }
    }
    
    @Override
    public void createOrUpdateContractClause(String contractId, String clauseName, String description, 
                                            String source, String clauseType) {
        try {
            ContractClause clause = new ContractClause();
            clause.setContractId(contractId);
            clause.setClauseName(clauseName);
            clause.setDescription(description);
            clause.setSource(source);
            
            try {
                clause.setClauseType(ContractClause.ClauseType.valueOf(clauseType.toUpperCase()));
            } catch (IllegalArgumentException e) {
                logger.error("❌ Invalid clause type: {}", clauseType);
                return; // Or throw an exception
            }

            contractClauseRepository.save(clause);
            logger.info("✅ Saved contract clause for contract ID: {} - name: {}, type: {}", contractId, clauseName, clauseType);
        } catch (Exception e) {
            logger.error("❌ Error saving contract clause: {}", e.getMessage(), e);
        }
    }
    
    @Override
    public void createOrUpdateContractPayment(String contractId, String totalValue, String schedule, String currency) {
        try {
            Contract contract = getContractOrThrow(contractId);

            if (totalValue != null) {
                contract.setTotalValue(totalValue);
            }
            if (schedule != null) {
                contract.setPaymentSchedule(schedule);
            }
            if (currency != null) {
                contract.setCurrency(currency);
            }

            contractRepository.save(contract);
            logger.info("✅ Saved contract payment for contract ID: {} - value: {}, schedule: {}, currency: {}", 
                       contractId, totalValue, schedule, currency);
        } catch (Exception e) {
            logger.error("❌ Error saving contract payment: {}", e.getMessage(), e);
        }
    }
    
    @Override
    public void updateContractDetails(String contractId, String object, String effectiveDate, String term, String terminationConditions) {
        try {
            Contract contract = getContractOrThrow(contractId);

            if (object != null) {
                contract.setContractObject(object);
            }
            if (effectiveDate != null) {
                contract.setEffectiveDate(effectiveDate);
            }
            if (term != null) {
                contract.setContractTerm(term);
            }
            if (terminationConditions != null) {
                contract.setTerminationConditions(terminationConditions);
            }

            contractRepository.save(contract);
            logger.info("✅ Updated contract details for contract ID: {}", contractId);
        } catch (Exception e) {
            logger.error("❌ Error updating contract details: {}", e.getMessage(), e);
        }
    }

    @Override
    public void createOrUpdateContractReminder(String contractId, String type, String date, String content) {
        try {
            ContractReminder reminder = new ContractReminder();
            reminder.setContractId(contractId);
            reminder.setReminderType(type);
            reminder.setReminderDate(date);
            reminder.setContent(content);

            contractReminderRepository.save(reminder);
            logger.info("✅ Saved contract reminder for contract ID: {} - type: {}, date: {}", contractId, type, date);
        } catch (Exception e) {
            logger.error("❌ Error saving contract reminder: {}", e.getMessage(), e);
        }
    }

    @Override
    public void createOrUpdateContractRiskAssessment(String contractId, String riskLevel, List<String> riskFactors, List<String> mitigationMeasures) {
        try {
            ContractRiskAssessment riskAssessment = new ContractRiskAssessment();
            riskAssessment.setContractId(contractId);
            riskAssessment.setRiskLevel(riskLevel);
            riskAssessment.setRiskFactors(riskFactors);
            riskAssessment.setMitigationMeasures(mitigationMeasures);

            contractRiskAssessmentRepository.save(riskAssessment);
            logger.info("✅ Saved contract risk assessment for contract ID: {} - level: {}", contractId, riskLevel);
        } catch (Exception e) {
            logger.error("❌ Error saving contract risk assessment: {}", e.getMessage(), e);
        }
    }

    @Override
    public void createOrUpdateContractComplianceStatus(String contractId, String status, List<String> issues, List<String> recommendations) {
        try {
            ContractComplianceStatus complianceStatus = new ContractComplianceStatus();
            complianceStatus.setContractId(contractId);
            complianceStatus.setStatus(status);
            complianceStatus.setIssues(issues);
            complianceStatus.setRecommendations(recommendations);

            contractComplianceStatusRepository.save(complianceStatus);
            logger.info("✅ Saved contract compliance status for contract ID: {} - status: {}", contractId, status);
        } catch (Exception e) {
            logger.error("❌ Error saving contract compliance status: {}", e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void createOrUpdateContractFromSummary(java.util.Map<String, Object> summaryData) {
        try {
            logger.info("Processing contract summary data: {}", summaryData);
            
            String fileId = (String) summaryData.get("fileId");
            if (fileId == null) {
                logger.error("File ID is missing from the summary data. Cannot process.");
                return;
            }

            Contract contract = contractRepository.findBySystemId(fileId).orElse(new Contract());
            boolean isNewContract = contract.getId() == null;

            // Set basic contract information
            contract.setSystemId(fileId);
            contract.setTitle((String) summaryData.get("title"));
            contract.setContractNumber((String) summaryData.get("contractNumber"));
            // Summary field is no longer used - removed
            contract.setContractType((String) summaryData.get("contractType"));
            contract.setContractObject((String) summaryData.get("object"));
            contract.setEffectiveDate((String) summaryData.get("effectiveDate"));
            contract.setContractTerm((String) summaryData.get("term"));
            contract.setTerminationConditions((String) summaryData.get("terminationConditions"));
            
            // Map tags
            Object tagsObj = summaryData.get("tags");
            if (tagsObj instanceof List) {
                @SuppressWarnings("unchecked")
                List<String> tags = (List<String>) tagsObj;
                contract.setTags(String.join(", ", tags));
            }
            
            // Map parties information - store as JSON and create individual party records
            Object partiesObj = summaryData.get("parties");
            if (partiesObj instanceof List) {
                try {
                    String partiesJson = objectMapper.writeValueAsString(partiesObj);
                    contract.setPartiesJson(partiesJson);
                    
                    // Parties will be saved after contract is persisted
                } catch (Exception e) {
                    logger.warn("Failed to serialize parties data: {}", e.getMessage());
                }
            }
            
            // Handle keyClauses - store as JSON
            Object keyClausesObj = summaryData.get("keyClauses");
            if (keyClausesObj instanceof List) {
                try {
                    String keyClausesJson = objectMapper.writeValueAsString(keyClausesObj);
                    contract.setKeyTerms(keyClausesJson);
                } catch (Exception e) {
                    logger.warn("Failed to serialize keyClauses data: {}", e.getMessage());
                }
            }
            
            // Handle favorableClauses - store as JSON
            Object favorableClausesObj = summaryData.get("favorableClauses");
            if (favorableClausesObj instanceof List) {
                try {
                    String favorableClausesJson = objectMapper.writeValueAsString(favorableClausesObj);
                    contract.setFavorableClauses(favorableClausesJson);
                } catch (Exception e) {
                    logger.warn("Failed to serialize favorableClauses data: {}", e.getMessage());
                }
            }
            
            // Handle unfavorableClauses - store as JSON
            Object unfavorableClausesObj = summaryData.get("unfavorableClauses");
            if (unfavorableClausesObj instanceof List) {
                try {
                    String unfavorableClausesJson = objectMapper.writeValueAsString(unfavorableClausesObj);
                    contract.setUnfavorableClauses(unfavorableClausesJson);
                } catch (Exception e) {
                    logger.warn("Failed to serialize unfavorableClauses data: {}", e.getMessage());
                }
            }
            
            // Handle riskAssessment - store as JSON
            Object riskObj = summaryData.get("riskAssessment");
            if (riskObj instanceof java.util.Map) {
                try {
                    String riskAssessmentJson = objectMapper.writeValueAsString(riskObj);
                    contract.setRiskAssessment(riskAssessmentJson);
                    
                    // Also set riskLevel for backward compatibility
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> riskMap = (java.util.Map<String, Object>) riskObj;
                contract.setRiskLevel((String) riskMap.get("riskLevel"));
                } catch (Exception e) {
                    logger.warn("Failed to serialize riskAssessment data: {}", e.getMessage());
                }
            }
            
            // Handle complianceStatus - store as JSON
            Object complianceObj = summaryData.get("complianceStatus");
            if (complianceObj instanceof java.util.Map) {
                try {
                    String complianceStatusJson = objectMapper.writeValueAsString(complianceObj);
                    contract.setComplianceStatus(complianceStatusJson);
                    
                    // Also set status for backward compatibility
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> complianceMap = (java.util.Map<String, Object>) complianceObj;
                String status = (String) complianceMap.get("status");
                
                // Set legal review required based on compliance status
                if ("REVIEW_REQUIRED".equals(status) || "NON_COMPLIANT".equals(status)) {
                    contract.setLegalReviewRequired(true);
                    }
                } catch (Exception e) {
                    logger.warn("Failed to serialize complianceStatus data: {}", e.getMessage());
                }
            }
            
            // Handle paymentDetails
            Object paymentObj = summaryData.get("paymentDetails");
            if (paymentObj instanceof java.util.Map) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> paymentMap = (java.util.Map<String, Object>) paymentObj;
                Object totalValueObj = paymentMap.get("totalValue");
                if (totalValueObj != null) {
                    contract.setTotalValue(totalValueObj.toString());
                }
                contract.setPaymentSchedule((String) paymentMap.get("schedule"));
                contract.setCurrency((String) paymentMap.get("currency"));
                contract.setPaymentMethod((String) paymentMap.get("paymentMethod"));
            }
            
            // Handle reminders
            Object remindersObj = summaryData.get("reminders");
            if (remindersObj instanceof List) {
                @SuppressWarnings("unchecked")
                List<Object> reminders = (List<Object>) remindersObj;
                StringBuilder remindersBuilder = new StringBuilder();
                for (Object reminder : reminders) {
                    if (reminder instanceof java.util.Map) {
                        @SuppressWarnings("unchecked")
                        java.util.Map<String, Object> reminderMap = (java.util.Map<String, Object>) reminder;
                        String type = (String) reminderMap.get("type");
                        String date = (String) reminderMap.get("date");
                        String content = (String) reminderMap.get("content");
                        if (content != null) {
                            remindersBuilder.append(type != null ? type + ": " : "").append(content).append("; ");
                        }
                    }
                }
                contract.setReminders(remindersBuilder.toString());
            }

            contract.setAiProcessed(true);
            contract.setProcessingStatus(Contract.ProcessingStatus.COMPLETED);

            if (isNewContract) {
                // Ensure identifier present for versioned insert
                contract.setId(java.util.UUID.randomUUID().toString());
                contract.setCreatedAt(LocalDateTime.now());
                contract.setCreatedBy("ai-processing-service");
                contract.setStatus(Contract.ContractStatus.DRAFT);
                // Provide minimal required fields
                if (contract.getStartDate() == null) {
                    contract.setStartDate(java.time.LocalDateTime.now());
                }
                // Let Mongo initialize version
                contract.setVersion(null);
            }

            contract.setUpdatedAt(LocalDateTime.now());

            Contract savedContract = isNewContract
                ? mongoTemplate.insert(contract, "contracts")
                : contractRepository.save(contract);
            logger.info("Successfully saved contract with ID: {}", savedContract.getId());

            // Now save parties after contract is persisted
            if (partiesObj instanceof List) {
                try {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> partiesList = (List<Map<String, Object>>) partiesObj;
                    
                    // Clear existing parties for this contract
                    partyRepository.deleteByContractId(savedContract.getId());
                    
                    // Create party records based on actual parties from contract content
                    for (Map<String, Object> partyData : partiesList) {
                        if (partyData instanceof Map) {
                            ContractParty party = new ContractParty();
                            party.setContractId(savedContract.getId());
                            party.setPartyType((String) partyData.get("role"));
                            party.setPartyName((String) partyData.get("name"));
                            party.setContactPerson((String) partyData.get("representative"));
                            party.setTaxCode((String) partyData.get("taxCode"));
                            party.setPhone((String) partyData.get("contact"));
                            party.setAddress((String) partyData.get("address"));
                            
                            partyRepository.save(party);
                            logger.info("Saved party: {} - {}", party.getPartyType(), party.getPartyName());
                        }
                    }
                } catch (Exception e) {
                    logger.error("Failed to save parties: {}", e.getMessage(), e);
                }
            }

            // Create contract event
            ContractEvent event = new ContractEvent();
            event.setContractId(savedContract.getId());
            event.setEventType(isNewContract ? "CREATE_FROM_AI" : "UPDATE_FROM_AI");
            event.setEventData("{\"message\": \"Contract " + (isNewContract ? "created" : "updated") + " from AI processing\"}");
            event.setUserId("ai-processing-service");
            eventRepository.save(event);

            // Publish contract updated event
            try {
                eventPublisher.publishEvent(new ContractEventPayload(savedContract, isNewContract ? "created" : "updated"));
                contractStatusEventPublisher.publishStatusChangeEvent(savedContract, 
                    savedContract.getStatus().name(), savedContract.getStatus().name());
                contractUpdatedEventPublisher.publishContractUpdatedEvent(savedContract, isNewContract ? "created" : "updated");
                logger.info("Successfully published contract events for contract ID: {}", savedContract.getId());
            } catch (Exception e) {
                logger.error("Failed to publish contract events: {}", e.getMessage());
            }

        } catch (Exception e) {
            logger.error("Error processing contract summary: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process contract summary", e);
        }
    }
}