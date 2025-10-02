package com.devgo2003.docgo.document_service.controller;

import com.devgo2003.docgo.document_service.common.response.PaginatedResponse;
import com.devgo2003.docgo.document_service.common.response.RequestInfo;
import com.devgo2003.docgo.document_service.common.response.ResultInfo;
import com.devgo2003.docgo.document_service.common.response.RestResponse;
import com.devgo2003.docgo.document_service.entity.Contract;
import com.devgo2003.docgo.document_service.entity.ContractAttachment;
import com.devgo2003.docgo.document_service.entity.ContractEvent;
import com.devgo2003.docgo.document_service.enums.ContractStatus;
import com.devgo2003.docgo.document_service.enums.ContractType;
import com.devgo2003.docgo.document_service.dto.ContractWithSummaryDto;
import com.devgo2003.docgo.document_service.dto.ContractDetailDto;
import com.devgo2003.docgo.document_service.dto.ContractResponseDto;
import com.devgo2003.docgo.document_service.dto.ContractCreateRequest;
import com.devgo2003.docgo.document_service.dto.BulkDeleteRequest;
import com.devgo2003.docgo.document_service.dto.BulkDeleteResponse;
import com.devgo2003.docgo.document_service.service.IContractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/document-management-service/v1/contracts")
@Tag(name = "📋 APIs Contract Management", description = "APIs để quản lý hợp đồng trong hệ thống DocGO")
public class ContractController {

    private final IContractService contractService;
    private final HttpServletRequest request;

    public ContractController(IContractService contractService, HttpServletRequest request) {
        this.contractService = contractService;
        this.request = request;
    }

    @Operation(
        summary = "Lấy danh sách hợp đồng",
        description = """
        ## 📖 Mô tả
        Lấy danh sách hợp đồng với phân trang, tìm kiếm và sắp xếp. Trả về theo chuẩn RestResponse.

        ## 🔹 Đầu vào

        📄 pageNumber (tùy chọn, query)
        Loại: integer
        Mô tả: Số trang (mặc định: 0)

        📄 pageSize (tùy chọn, query)
        Loại: integer
        Mô tả: Kích thước trang (mặc định: 10)

        📄 sortBy (tùy chọn, query)
        Loại: string
        Mô tả: Trường sắp xếp (ví dụ: createdAt, updatedAt, title)

        📄 sortDirection (tùy chọn, query)
        Loại: string
        Mô tả: Hướng sắp xếp: ASC hoặc DESC (mặc định: DESC)

        📄 searchTerm (tùy chọn, query)
        Loại: string
        Mô tả: Từ khóa tìm kiếm theo tiêu đề/số hợp đồng

        📄 includeDeleted (tùy chọn, query)
        Loại: boolean
        Mô tả: Bao gồm hợp đồng đã xóa mềm (mặc định: false)

        📄 view (tùy chọn, query)
        Loại: string
        Mô tả: Loại view để trả về dữ liệu (ví dụ: summary, detail, full)

        ## 🔹 Đầu ra

        📝 data
        Loại: PaginatedResponse<ContractResponseDto>
        Mô tả: Danh sách hợp đồng theo trang với thông tin phân trang chi tiết

        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1)

        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái xử lý (200: OK, 204: No Content)

        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả

        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý

        🕒 timestamp
        Loại: string (ISO-8601)
        Mô tả: Thời gian xử lý yêu cầu

        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu

        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi
        """
    )
    @GetMapping
    public ResponseEntity<RestResponse<PaginatedResponse<ContractResponseDto>>> getAllContracts(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDirection,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "false") boolean includeDeleted,
            @RequestParam(required = false) String view) {
        
        // Convert single sortBy to List for service compatibility
        List<String> sortByList = sortBy != null ? List.of(sortBy) : null;
        List<String> sortDirectionList = sortDirection != null ? List.of(sortDirection) : null;
        
        org.springframework.data.domain.Page<ContractResponseDto> contractsPage = 
                contractService.getAllContractsWithNewFormat(pageNumber, pageSize, sortByList, sortDirectionList, searchTerm, includeDeleted);
        
        PaginatedResponse<ContractResponseDto> paginatedResponse = PaginatedResponse.<ContractResponseDto>builder()
                .request(RequestInfo.builder()
                        .page(contractsPage.getNumber())
                        .size(contractsPage.getSize())
                        .searchTerm(searchTerm)
                        .sortBy(sortByList)
                        .sortDirection(sortDirectionList)
                        .build())
                .result(ResultInfo.builder()
                        .page(contractsPage.getNumber())
                        .size(contractsPage.getSize())
                        .totalElements(contractsPage.getTotalElements())
                        .totalPages(contractsPage.getTotalPages())
                        .first(contractsPage.isFirst())
                        .last(contractsPage.isLast())
                        .numberOfElements(contractsPage.getNumberOfElements())
                        .empty(contractsPage.isEmpty())
                        .sort(new ArrayList<>())
                        .build())
                .content(contractsPage.getContent())
                .build();
        
        RestResponse<PaginatedResponse<ContractResponseDto>> response = RestResponse.<PaginatedResponse<ContractResponseDto>>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Danh sách hợp đồng với cấu trúc response mới đã được lấy thành công.")
                .data(paginatedResponse)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
        summary = "Lấy hợp đồng theo ID",
        description = """
        ## 📖 Mô tả
        Lấy thông tin chi tiết hợp đồng theo ID. Trả về theo chuẩn RestResponse.

        ## 🔹 Đầu vào

        🆔 id (bắt buộc, path)
        Loại: string
        Mô tả: ID của hợp đồng cần lấy thông tin

        ## 🔹 Đầu ra

        📝 data
        Loại: ContractResponseDto
        Mô tả: Thông tin chi tiết của hợp đồng

        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1)

        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái xử lý (200: OK, 404: Not Found)

        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả

        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý

        🕒 timestamp
        Loại: string (ISO-8601)
        Mô tả: Thời gian xử lý yêu cầu

        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu

        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi
        """
    )
    @GetMapping("/{id}")
    public ResponseEntity<RestResponse<ContractResponseDto>> getContract(
            @PathVariable String id,
            @RequestParam(required = false) String view) {
        ContractResponseDto contract = contractService.getContractWithNewFormat(id);
        RestResponse<ContractResponseDto> response = RestResponse.<ContractResponseDto>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Thông tin hợp đồng với cấu trúc response mới đã được lấy thành công.")
                .data(contract)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
        summary = "Tạo hợp đồng mới", 
        description = """
        ## 📖 Mô tả
        Tạo hợp đồng mới với thông tin được cung cấp. Trả về theo chuẩn RestResponse.

        ## 🔹 Đầu vào

        📄 body (bắt buộc, application/json)
        Loại: ContractCreateRequest
        Mô tả: Thông tin hợp đồng cần tạo mới
        Ví dụ:
        {
          "contractNumber": "HD-2024-001",
          "title": "Hợp đồng cung cấp dịch vụ",
          "status": "DRAFT",
          "contractType": "SERVICE_AGREEMENT",
          "partiesJson": "[{\"name\": \"Công ty A\", \"role\": \"Client\"}]",
          "startDate": "2024-01-01T00:00:00",
          "endDate": "2024-12-31T23:59:59",
          "systemId": "SYS-001"
        }

        ## 🔹 Đầu ra

        📝 data
        Loại: Contract
        Mô tả: Hợp đồng vừa được tạo thành công

        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1)

        🔢 statusCode
        Loại: integer
        Mô tả: Mã trạng thái xử lý (201: Created)

        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả

        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý

        🕒 timestamp
        Loại: string (ISO-8601)
        Mô tả: Thời gian xử lý yêu cầu

        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu

        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi
        """,
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            required = true,
            content = @Content(
                schema = @Schema(implementation = ContractCreateRequest.class),
                examples = @ExampleObject(
                    value = "{\n  \"contractNumber\": \"HD-2024-001\",\n  \"title\": \"Hợp đồng cung cấp dịch vụ\",\n  \"status\": \"DRAFT\",\n  \"contractType\": \"SERVICE_AGREEMENT\",\n  \"partiesJson\": \"[{\\\"name\\\": \\\"Công ty A\\\", \\\"role\\\": \\\"Client\\\"}]\",\n  \"startDate\": \"2024-01-01T00:00:00\",\n  \"endDate\": \"2024-12-31T23:59:59\",\n  \"systemId\": \"SYS-001\"\n}"
                )
            )
        )
    )
    @PostMapping
    public ResponseEntity<RestResponse<Contract>> createContract(@Valid @RequestBody ContractCreateRequest request) {
        if (request.getContractNumber() == null) {
            throw new com.devgo2003.docgo.document_service.common.exception.InvalidInputException("Không được gửi id khi tạo hợp đồng mới.");
        }
        
        // Convert DTO to Entity
        Contract contract = new Contract();
        contract.setContractNumber(request.getContractNumber());
        contract.setTitle(request.getTitle());
        contract.setStatus(ContractStatus.valueOf(request.getStatus()));
        contract.setPartiesJson(request.getPartiesJson());
        contract.setStartDate(request.getStartDate());
        contract.setEndDate(request.getEndDate());
        contract.setSystemId(request.getSystemId());
        contract.setSummary(request.getSummary());
        // ContractType validation is now handled by @Pattern annotation in DTO
        contract.setContractType(ContractType.fromValue(request.getContractType()));
        contract.setRiskLevel(request.getRiskLevel());
        contract.setKeyTerms(request.getKeyTerms());
        contract.setFavorableClauses(request.getFavorableClauses());
        contract.setUnfavorableClauses(request.getUnfavorableClauses());
        contract.setPaymentCurrency(request.getPaymentCurrency());
        contract.setContractObject(request.getContractObject());
        contract.setEffectiveDate(request.getEffectiveDate());
        contract.setContractTerm(request.getContractTerm());
        contract.setTotalValue(request.getTotalValue());
        contract.setPaymentSchedule(request.getPaymentSchedule());
        contract.setCurrency(request.getCurrency());
        contract.setPaymentMethod(request.getPaymentMethod());
        contract.setReminders(request.getReminders());
        contract.setTerminationConditions(request.getTerminationConditions());
        contract.setRiskAssessment(request.getRiskAssessment());
        contract.setComplianceStatus(request.getComplianceStatus());
        contract.setLegalReviewRequired(request.getLegalReviewRequired());
        contract.setReviewDeadline(request.getReviewDeadline());
        contract.setTags(request.getTags());
        
        Contract created = contractService.createContract(contract);
        RestResponse<Contract> response = RestResponse.<Contract>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.CREATED.value())
                .shortMessage("Success")
                .description("Hợp đồng đã được tạo thành công.")
                .data(created)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(this.request.getRequestURI())
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(
        summary = "Cập nhật hợp đồng", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: Long
        Mô tả: ID của hợp đồng cần cập nhật.
        
        📄 contract (bắt buộc, body)
        Loại: Contract
        Mô tả: Thông tin mới cần cập nhật cho hợp đồng.
        
        🔹 Đầu ra
        
        📝 data
        Loại: Contract
        Mô tả: Thông tin hợp đồng đã được cập nhật.
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1).
        
        🔢 statusCode
        Loại: integer
        Mô tả: ma trạng thái HTTP (200: OK).
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả.
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý.
        
        🕒 timestamp
        Loại: ZonedDateTime
        Mô tả: Thời gian xử lý yêu cầu.
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu.
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi.
        """
    )
    @PutMapping("/{id}")
    public ResponseEntity<RestResponse<Contract>> updateContract(@PathVariable String id, @RequestBody Contract contract) {
        Contract updatedContract = contractService.updateContract(id, contract);
        RestResponse<Contract> response = RestResponse.<Contract>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Hợp đồng đã được cập nhật thành công.")
                .data(updatedContract)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
        summary = "Xóa mềm hợp đồng", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: Long
        Mô tả: ID của hợp đồng cần xóa mềm.
        
        🔹 Đầu ra
        
        📝 data
        Loại: null
        Mô tả: Không có dữ liệu trả về.
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1).
        
        🔢 statusCode
        Loại: integer
        Mô tả: ma trạng thái HTTP (200: OK).
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả.
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý.
        
        🕒 timestamp
        Loại: ZonedDateTime
        Mô tả: Thời gian xử lý yêu cầu.
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu.
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi.
        """
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<RestResponse<Void>> softDeleteContract(@PathVariable String id) {
        contractService.softDeleteContract(id);
        RestResponse<Void> response = RestResponse.<Void>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Hợp đồng đã được xóa mềm thành công.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
        summary = "Khôi phục hợp đồng", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: Long
        Mô tả: ID của hợp đồng cần khôi phục.
        
        🔹 Đầu ra
        
        📝 data
        Loại: null
        Mô tả: Không có dữ liệu trả về.
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1).
        
        🔢 statusCode
        Loại: integer
        Mô tả: ma trạng thái HTTP (200: OK).
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả.
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý.
        
        🕒 timestamp
        Loại: ZonedDateTime
        Mô tả: Thời gian xử lý yêu cầu.
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu.
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi.
        """
    )
    @PutMapping("/{id}/restore")
    public ResponseEntity<RestResponse<Void>> restoreContract(@PathVariable String id) {
        contractService.restoreContract(id);
        RestResponse<Void> response = RestResponse.<Void>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Hợp đồng đã được khôi phục thành công.")
                .data(null)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
        summary = "Xóa mềm hàng loạt hợp đồng", 
        description = """
        🔹 Đầu vào
        
        📦 bulkDeleteRequest (bắt buộc, body)
        Loại: BulkDeleteRequest
        Mô tả: Danh sách ID của các hợp đồng cần xóa mềm (tối đa 100 hợp đồng).
        
        🔹 Đầu ra
        
        📝 data
        Loại: BulkDeleteResponse
        Mô tả: Kết quả xóa hàng loạt với thống kê thành công/thất bại.
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1).
        
        🔢 statusCode
        Loại: integer
        Mô tả: ma trạng thái HTTP (200: OK).
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả.
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý.
        
        🕒 timestamp
        Loại: ZonedDateTime
        Mô tả: Thời gian xử lý yêu cầu.
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu.
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi.
        """
    )
    @DeleteMapping("/bulk")
    public ResponseEntity<RestResponse<BulkDeleteResponse>> bulkSoftDeleteContracts(@Valid @RequestBody BulkDeleteRequest bulkDeleteRequest) {
        BulkDeleteResponse result = contractService.bulkSoftDeleteContracts(bulkDeleteRequest.getIds());
        RestResponse<BulkDeleteResponse> response = RestResponse.<BulkDeleteResponse>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description(String.format("Xóa hàng loạt hoàn tất: %d thành công, %d thất bại", result.getSuccessCount(), result.getFailedCount()))
                .data(result)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
        summary = "Lấy lịch sử sự kiện của hợp đồng", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: Long
        Mô tả: ID của hợp đồng cần lấy lịch sử sự kiện.
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<ContractEvent>
        Mô tả: Danh sách các sự kiện của hợp đồng.
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1).
        
        🔢 statusCode
        Loại: integer
        Mô tả: ma trạng thái HTTP (200: OK).
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả.
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý.
        
        🕒 timestamp
        Loại: ZonedDateTime
        Mô tả: Thời gian xử lý yêu cầu.
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu.
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi.
        """
    )
    @GetMapping("/{id}/events")
    public ResponseEntity<RestResponse<List<ContractEvent>>> getContractEvents(@PathVariable String id) {
        List<ContractEvent> events = contractService.getContractEvents(id);
        RestResponse<List<ContractEvent>> response = RestResponse.<List<ContractEvent>>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Lịch sử sự kiện hợp đồng đã được lấy thành công.")
                .data(events)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
        summary = "Lấy file đính kèm của hợp đồng", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: Long
        Mô tả: ID của hợp đồng cần lấy file đính kèm.
        
        🔹 Đầu ra
        
        📝 data
        Loại: List<ContractAttachment>
        Mô tả: Danh sách các file đính kèm của hợp đồng.
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1).
        
        🔢 statusCode
        Loại: integer
        Mô tả: ma trạng thái HTTP (200: OK).
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả.
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý.
        
        🕒 timestamp
        Loại: ZonedDateTime
        Mô tả: Thời gian xử lý yêu cầu.
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu.
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi.
        """
    )
    @GetMapping("/{id}/attachments")
    public ResponseEntity<RestResponse<List<ContractAttachment>>> getAttachments(@PathVariable String id) {
        List<ContractAttachment> attachments = contractService.getAttachments(id);
        RestResponse<List<ContractAttachment>> response = RestResponse.<List<ContractAttachment>>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("File đính kèm hợp đồng đã được lấy thành công.")
                .data(attachments)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
        summary = "Lấy tất cả hợp đồng với thông tin tóm tắt AI", 
        description = """
        🔹 Đầu vào
        
        📄 pageNumber (tùy chọn, query)
        Loại: Integer
        Mô tả: Số trang (mặc định: 0).
        
        📄 pageSize (tùy chọn, query)
        Loại: Integer
        Mô tả: Kích thước trang (mặc định: 10).
        
        📄 sortBy (tùy chọn, query)
        Loại: List<String>
        Mô tả: Danh sách các trường để sắp xếp.
        
        📄 sortDirection (tùy chọn, query)
        Loại: List<String>
        Mô tả: Hướng sắp xếp (ASC/DESC).
        
        📄 includeDeleted (tùy chọn, query)
        Loại: Boolean
        Mô tả: Có bao gồm hợp đồng đã xóa không (mặc định: false).
        
        🔹 Đầu ra
        
        📝 data
        Loại: PaginatedResponse<ContractWithSummaryDto>
        Mô tả: Danh sách hợp đồng với thông tin tóm tắt AI, bao gồm:
        - Thông tin hợp đồng cơ bản
        - Danh sách summaries từ AI processing
        - Thông tin classification, confidence, key points
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1).
        
        🔢 statusCode
        Loại: integer
        Mô tả: ma trạng thái HTTP (200: OK).
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả.
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý.
        
        🕒 timestamp
        Loại: ZonedDateTime
        Mô tả: Thời gian xử lý yêu cầu.
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu.
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi.
        """
    )
    @GetMapping("/with-summary")
    public ResponseEntity<RestResponse<PaginatedResponse<ContractWithSummaryDto>>> getAllContractsWithSummary(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) List<String> sortBy,
            @RequestParam(required = false) List<String> sortDirection,
            @RequestParam(defaultValue = "false") boolean includeDeleted) {
        
        org.springframework.data.domain.Page<ContractWithSummaryDto> contractsPage = 
                contractService.getAllContractsWithSummary(pageNumber, pageSize, sortBy, sortDirection, null, includeDeleted);
        
        PaginatedResponse<ContractWithSummaryDto> paginatedResponse = PaginatedResponse.<ContractWithSummaryDto>builder()
                .request(RequestInfo.builder()
                        .page(contractsPage.getNumber())
                        .size(contractsPage.getSize())
                        .searchTerm(null)
                        .sortBy(sortBy)
                        .sortDirection(sortDirection)
                        .build())
                .result(ResultInfo.builder()
                        .page(contractsPage.getNumber())
                        .size(contractsPage.getSize())
                        .totalElements(contractsPage.getTotalElements())
                        .totalPages(contractsPage.getTotalPages())
                        .first(contractsPage.isFirst())
                        .last(contractsPage.isLast())
                        .numberOfElements(contractsPage.getNumberOfElements())
                        .empty(contractsPage.isEmpty())
                        .sort(new ArrayList<>())
                        .build())
                .content(contractsPage.getContent())
                .build();
        
        RestResponse<PaginatedResponse<ContractWithSummaryDto>> response = RestResponse.<PaginatedResponse<ContractWithSummaryDto>>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Danh sách hợp đồng với thông tin tóm tắt AI đã được lấy thành công.")
                .data(paginatedResponse)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
        summary = "Lấy hợp đồng theo ID với thông tin tóm tắt AI", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: Long
        Mô tả: ID của hợp đồng cần lấy.
        
        🔹 Đầu ra
        
        📝 data
        Loại: ContractWithSummaryDto
        Mô tả: Thông tin hợp đồng với thông tin tóm tắt AI chi tiết.
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1).
        
        🔢 statusCode
        Loại: integer
        Mô tả: ma trạng thái HTTP (200: OK).
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả.
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý.
        
        🕒 timestamp
        Loại: ZonedDateTime
        Mô tả: Thời gian xử lý yêu cầu.
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu.
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi.
        """
    )
    @GetMapping("/{id}/with-summary")
    public ResponseEntity<RestResponse<ContractWithSummaryDto>> getContractWithSummary(@PathVariable String id) {
        ContractWithSummaryDto contractWithSummary = contractService.getContractWithSummary(id);
        RestResponse<ContractWithSummaryDto> response = RestResponse.<ContractWithSummaryDto>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Thông tin hợp đồng với tóm tắt AI đã được lấy thành công.")
                .data(contractWithSummary)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
        summary = "Lấy tất cả hợp đồng với thông tin chi tiết đầy đủ", 
        description = """
        🔹 Đầu vào
        
        📄 pageNumber (tùy chọn, query)
        Loại: Integer
        Mô tả: Số trang (mặc định: 0).
        
        📄 pageSize (tùy chọn, query)
        Loại: Integer
        Mô tả: Kích thước trang (mặc định: 10).
        
        📄 sortBy (tùy chọn, query)
        Loại: List<String>
        Mô tả: Danh sách các trường để sắp xếp.
        
        📄 sortDirection (tùy chọn, query)
        Loại: List<String>
        Mô tả: Hướng sắp xếp (ASC/DESC).
        
        📄 includeDeleted (tùy chọn, query)
        Loại: Boolean
        Mô tả: Có bao gồm hợp đồng đã xóa không (mặc định: false).
        
        🔹 Đầu ra
        
        📝 data
        Loại: PaginatedResponse<ContractDetailDto>
        Mô tả: Danh sách hợp đồng với thông tin chi tiết đầy đủ, bao gồm:
        - Thông tin hợp đồng cơ bản
        - Thông tin mới từ schema cập nhật (contract_object, effective_date, contract_term, total_value, payment_schedule, currency, termination_conditions, risk_assessment, compliance_status, legal_review_required, review_deadline)
        - Danh sách summaries từ AI processing
        - Danh sách parties (các bên tham gia)
        - Danh sách clauses (các điều khoản)
        - Danh sách payments (thanh toán)
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1).
        
        🔢 statusCode
        Loại: integer
        Mô tả: ma trạng thái HTTP (200: OK).
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả.
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý.
        
        🕒 timestamp
        Loại: ZonedDateTime
        Mô tả: Thời gian xử lý yêu cầu.
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu.
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi.
        """
    )
    @GetMapping("/with-details")
    public ResponseEntity<RestResponse<PaginatedResponse<ContractDetailDto>>> getAllContractsWithDetails(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) List<String> sortBy,
            @RequestParam(required = false) List<String> sortDirection,
            @RequestParam(defaultValue = "false") boolean includeDeleted) {
        
        org.springframework.data.domain.Page<ContractDetailDto> contractsPage = 
                contractService.getAllContractsWithDetails(pageNumber, pageSize, sortBy, sortDirection, null, includeDeleted);
        
        PaginatedResponse<ContractDetailDto> paginatedResponse = PaginatedResponse.<ContractDetailDto>builder()
                .request(RequestInfo.builder()
                        .page(contractsPage.getNumber())
                        .size(contractsPage.getSize())
                        .searchTerm(null)
                        .sortBy(sortBy)
                        .sortDirection(sortDirection)
                        .build())
                .result(ResultInfo.builder()
                        .page(contractsPage.getNumber())
                        .size(contractsPage.getSize())
                        .totalElements(contractsPage.getTotalElements())
                        .totalPages(contractsPage.getTotalPages())
                        .first(contractsPage.isFirst())
                        .last(contractsPage.isLast())
                        .numberOfElements(contractsPage.getNumberOfElements())
                        .empty(contractsPage.isEmpty())
                        .sort(new ArrayList<>())
                        .build())
                .content(contractsPage.getContent())
                .build();
        
        RestResponse<PaginatedResponse<ContractDetailDto>> response = RestResponse.<PaginatedResponse<ContractDetailDto>>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Danh sách hợp đồng với thông tin chi tiết đầy đủ đã được lấy thành công.")
                .data(paginatedResponse)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(
        summary = "Lấy hợp đồng theo ID với thông tin chi tiết đầy đủ", 
        description = """
        🔹 Đầu vào
        
        🆔 id (bắt buộc, path)
        Loại: Long
        Mô tả: ID của hợp đồng cần lấy.
        
        🔹 Đầu ra
        
        📝 data
        Loại: ContractDetailDto
        Mô tả: Thông tin hợp đồng với thông tin chi tiết đầy đủ, bao gồm:
        - Thông tin hợp đồng cơ bản
        - Thông tin mới từ schema cập nhật (contract_object, effective_date, contract_term, total_value, payment_schedule, currency, termination_conditions, risk_assessment, compliance_status, legal_review_required, review_deadline)
        - Danh sách summaries từ AI processing
        - Danh sách parties (các bên tham gia)
        - Danh sách clauses (các điều khoản)
        - Danh sách payments (thanh toán)
        
        📊 apiVersion
        Loại: string
        Mô tả: Phiên bản API (v1).
        
        🔢 statusCode
        Loại: integer
        Mô tả: ma trạng thái HTTP (200: OK).
        
        📋 shortMessage
        Loại: string
        Mô tả: Thông báo ngắn gọn về kết quả.
        
        📖 description
        Loại: string
        Mô tả: Mô tả chi tiết về kết quả xử lý.
        
        🕒 timestamp
        Loại: ZonedDateTime
        Mô tả: Thời gian xử lý yêu cầu.
        
        🆔 requestId
        Loại: string (UUID)
        Mô tả: Định danh duy nhất của yêu cầu.
        
        🛣️ path
        Loại: string
        Mô tả: Đường dẫn API được gọi.
        """
    )
    @GetMapping("/{id}/with-details")
    public ResponseEntity<RestResponse<ContractDetailDto>> getContractWithDetails(@PathVariable String id) {
        ContractDetailDto contractWithDetails = contractService.getContractWithDetails(id);
        RestResponse<ContractDetailDto> response = RestResponse.<ContractDetailDto>builder()
                .apiVersion("v1")
                .statusCode(HttpStatus.OK.value())
                .shortMessage("Success")
                .description("Thông tin hợp đồng với chi tiết đầy đủ đã được lấy thành công.")
                .data(contractWithDetails)
                .timestamp(ZonedDateTime.now())
                .requestId(UUID.randomUUID().toString())
                .path(request.getRequestURI())
                .build();
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}


