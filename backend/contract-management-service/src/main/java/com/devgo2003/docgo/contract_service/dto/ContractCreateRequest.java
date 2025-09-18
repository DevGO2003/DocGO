package com.devgo2003.docgo.contract_service.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDateTime;

@Data
public class ContractCreateRequest {
    
    @NotBlank(message = "Số hợp đồng không được để trống")
    @Size(min = 3, max = 50, message = "Số hợp đồng phải từ 3-50 ký tự")
    @Pattern(regexp = "^[A-Z0-9-]+$", message = "Số hợp đồng chỉ được chứa chữ hoa, số và dấu gạch ngang")
    private String contractNumber;

    @NotBlank(message = "Tiêu đề hợp đồng không được để trống")
    @Size(min = 5, max = 200, message = "Tiêu đề hợp đồng phải từ 5-200 ký tự")
    private String title;

    @NotBlank(message = "Trạng thái hợp đồng không được để trống")
    @Pattern(regexp = "^(DRAFT|PENDING|PENDING_APPROVAL|ACTIVE|EXPIRED|ARCHIVED)$", message = "Trạng thái hợp đồng không hợp lệ")
    private String status;

    @Size(max = 10000, message = "Thông tin các bên không được vượt quá 10000 ký tự")
    private String partiesJson;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @Size(max = 100, message = "System ID không được vượt quá 100 ký tự")
    private String systemId;

    @Size(max = 5000, message = "Tóm tắt không được vượt quá 5000 ký tự")
    private String summary;

    @Size(max = 100, message = "Loại hợp đồng không được vượt quá 100 ký tự")
    private String contractType;

    @Pattern(regexp = "^(LOW|MEDIUM|HIGH|CRITICAL)$", message = "Mức độ rủi ro phải là LOW, MEDIUM, HIGH hoặc CRITICAL")
    private String riskLevel;

    @Size(max = 2000, message = "Điều khoản chính không được vượt quá 2000 ký tự")
    private String keyTerms;
    
    @Size(max = 2000, message = "Điều khoản có lợi không được vượt quá 2000 ký tự")
    private String favorableClauses;
    
    @Size(max = 2000, message = "Điều khoản bất lợi không được vượt quá 2000 ký tự")
    private String unfavorableClauses;
    
    @Pattern(regexp = "^[A-Z]{3}$", message = "Mã tiền tệ phải là 3 ký tự chữ hoa")
    private String paymentCurrency;

    @Size(max = 500, message = "Đối tượng hợp đồng không được vượt quá 500 ký tự")
    private String contractObject;

    @Size(max = 100, message = "Ngày hiệu lực không được vượt quá 100 ký tự")
    private String effectiveDate;

    @Size(max = 100, message = "Thời hạn hợp đồng không được vượt quá 100 ký tự")
    private String contractTerm;

    @Pattern(regexp = "^[0-9]+(\\.[0-9]{1,2})?$", message = "Tổng giá trị phải là số dương với tối đa 2 chữ số thập phân")
    private String totalValue;

    @Size(max = 500, message = "Lịch thanh toán không được vượt quá 500 ký tự")
    private String paymentSchedule;

    @Pattern(regexp = "^[A-Z]{3}$", message = "Mã tiền tệ phải là 3 ký tự chữ hoa")
    private String currency;

    @Size(max = 100, message = "Phương thức thanh toán không được vượt quá 100 ký tự")
    private String paymentMethod;

    @Size(max = 1000, message = "Nhắc nhở không được vượt quá 1000 ký tự")
    private String reminders;

    @Size(max = 1000, message = "Điều kiện chấm dứt không được vượt quá 1000 ký tự")
    private String terminationConditions;

    @Size(max = 2000, message = "Đánh giá rủi ro không được vượt quá 2000 ký tự")
    private String riskAssessment;

    @Pattern(regexp = "^(COMPLIANT|NON_COMPLIANT|PENDING_REVIEW|UNDER_REVIEW)$", message = "Trạng thái tuân thủ không hợp lệ")
    private String complianceStatus;

    private Boolean legalReviewRequired = false;

    private LocalDateTime reviewDeadline;
}
