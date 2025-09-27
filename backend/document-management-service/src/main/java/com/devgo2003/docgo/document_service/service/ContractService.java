package com.devgo2003.docgo.document_service.service;

import com.devgo2003.docgo.document_service.entity.Contract;
import com.devgo2003.docgo.document_service.enums.ContractStatus;
import com.devgo2003.docgo.document_service.entity.ContractAttachment;
import com.devgo2003.docgo.document_service.entity.ContractEvent;
import com.devgo2003.docgo.document_service.repository.ContractRepository;
import com.devgo2003.docgo.document_service.repository.ContractAttachmentRepository;
import com.devgo2003.docgo.document_service.repository.ContractEventRepository;
import com.devgo2003.docgo.document_service.service.event.ContractEventPublisher;
import com.devgo2003.docgo.document_service.service.event.ContractEventPayload;
import com.devgo2003.docgo.document_service.common.exception.ConflictException;
import com.devgo2003.docgo.document_service.common.exception.InvalidInputException;
import com.devgo2003.docgo.document_service.common.exception.NoContentException;
import com.devgo2003.docgo.document_service.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;
import java.util.Arrays;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
public class ContractService {
    private final ContractRepository contractRepository;
    private final ContractAttachmentRepository attachmentRepository;
    private final ContractEventRepository eventRepository;
    private final ContractEventPublisher eventPublisher;

    private static final Set<String> VALID_SORT_BY_PROPERTIES = new HashSet<>(Arrays.asList(
            "id", "contractNumber", "title", "status", "partiesJson", "startDate", "endDate", "systemId",
            "createdAt", "createdBy", "deletedAt", "deletedBy", "isDeleted", "version"
    ));

    public ContractService(ContractRepository contractRepository,
                           ContractAttachmentRepository attachmentRepository,
                           ContractEventRepository eventRepository,
                           ContractEventPublisher eventPublisher) {
        this.contractRepository = contractRepository;
        this.attachmentRepository = attachmentRepository;
        this.eventRepository = eventRepository;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Hàm tiện ích để lấy contract hoặc ném ResourceNotFoundException
     */
    private Contract getContractOrThrow(String id) {
        return contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hợp đồng với ID: " + id));
    }

    @Transactional
    public Contract createContract(Contract contract) {
        contract.setContractNumber("CONTRACT-" + System.currentTimeMillis());
        contract.setStatus(ContractStatus.DRAFT);

        Contract savedContract = contractRepository.save(contract);

        ContractEvent event = new ContractEvent();
        event.setContractId(savedContract.getId());
        event.setEventType("CREATE");
        event.setEventData("{\"message\": \"Tạo hợp đồng mới\"}");
        event.setUserName("system");
        event.setTimestamp(LocalDateTime.now());

        eventRepository.save(event);
        eventPublisher.publishEvent(new ContractEventPayload(savedContract, "created"));
        return savedContract;
    }

    public Optional<Contract> getContract(String id) {
        return contractRepository.findById(id);
    }

    public Page<Contract> getAllContracts(int pageNumber, int pageSize, List<String> sortBy, List<String> sortDirection, boolean includeDeleted) {
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

    public List<Contract> getActiveContracts() {
        return contractRepository.findByIsDeletedFalse();
    }

    public List<Contract> getContractsByStatus(String status) {
        try {
            ContractStatus contractStatus = ContractStatus.valueOf(status.toUpperCase());
            return contractRepository.findByStatusAndIsDeletedFalse(contractStatus);
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Trạng thái hợp đồng không hợp lệ: " + status);
        }
    }

    @Transactional
    public Contract updateContract(String id, Contract updatedContract) {
        Contract existingContract = getContractOrThrow(id);

        if (existingContract.getIsDeleted()) {
            throw new ConflictException("Không thể cập nhật hợp đồng đã bị xóa");
        }

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
        event.setUserName("system");
        event.setTimestamp(LocalDateTime.now());
        eventRepository.save(event);

        eventPublisher.publishEvent(new ContractEventPayload(savedContract, "updated"));
        return savedContract;
    }

    @Transactional
    public void softDeleteContract(String id) {
        Contract contract = getContractOrThrow(id);

        if (contract.getIsDeleted()) {
            throw new ConflictException("Hợp đồng đã bị xóa trước đó");
        }

        contract.markAsDeleted("system");
        contract.setStatus(ContractStatus.EXPIRED);
        contractRepository.save(contract);

        ContractEvent event = new ContractEvent();
        event.setContractId(contract.getId());
        event.setEventType("SOFT_DELETE");
        event.setEventData("{\"message\": \"Xóa mềm hợp đồng\"}");
        event.setUserName("system");
        event.setTimestamp(LocalDateTime.now());
        eventRepository.save(event);

        eventPublisher.publishEvent(new ContractEventPayload(contract, "soft_deleted"));
    }

    @Transactional
    public void restoreContract(String id) {
        Contract contract = getContractOrThrow(id);

        if (!contract.getIsDeleted()) {
            throw new ConflictException("Hợp đồng chưa bị xóa");
        }

        contract.restore();
        contract.setStatus(ContractStatus.DRAFT);
        contractRepository.save(contract);

        ContractEvent event = new ContractEvent();
        event.setContractId(contract.getId());
        event.setEventType("RESTORE");
        event.setEventData("{\"message\": \"Khôi phục hợp đồng\"}");
        event.setUserName("system");
        event.setTimestamp(LocalDateTime.now());
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
        event.setEventData("{\"file_id\": \"" + savedAttachment.getId() + "\", \"file_name\": \"" + savedAttachment.getFileName() + "\"}");
        event.setUserName("system");
        event.setTimestamp(LocalDateTime.now());
        eventRepository.save(event);

        return savedAttachment;
    }

    public List<ContractAttachment> getAttachments(String contractId) {
        getContractOrThrow(contractId);
        List<ContractAttachment> attachments = attachmentRepository.findByContractId(contractId);
        if (attachments.isEmpty()) {
            throw new NoContentException("Không tìm thấy file đính kèm nào cho hợp đồng này.");
        }
        return attachments;
    }

    public List<ContractEvent> getContractEvents(String contractId) {
        return eventRepository.findByContractIdOrderByTimestampDesc(contractId);
    }
}
