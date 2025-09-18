package com.devgo2003.docgo.contract_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Persistable;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotNull;

@Document(collection = "contracts")
@Getter
@Setter
public class Contract extends BaseEntity implements Persistable<String> {

    @Id
    @MongoId
    private String id;

    @Field("contract_number")
    @NotBlank(message = "Số hợp đồng không được để trống")
    @Size(min = 3, max = 50, message = "Số hợp đồng phải từ 3-50 ký tự")
    @Pattern(regexp = "^[A-Z0-9-]+$", message = "Số hợp đồng chỉ được chứa chữ hoa, số và dấu gạch ngang")
    private String contractNumber;

    @NotBlank(message = "Tiêu đề hợp đồng không được để trống")
    @Size(min = 5, max = 200, message = "Tiêu đề hợp đồng phải từ 5-200 ký tự")
    private String title;

    @NotNull(message = "Trạng thái hợp đồng không được để trống")
    private ContractStatus status;

    @Field("parties_json")
    @Size(max = 10000, message = "Thông tin các bên không được vượt quá 10000 ký tự")
    private String partiesJson;

    @Field("start_date")
    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime startDate;

    @Field("end_date")
    private LocalDateTime endDate;

    @Field("system_id")
    @Size(max = 100, message = "System ID không được vượt quá 100 ký tự")
    private String systemId;

    // Thông tin tóm tắt hợp đồng
    @Size(max = 5000, message = "Tóm tắt không được vượt quá 5000 ký tự")
    private String summary;

    @Field("contract_type")
    @Size(max = 100, message = "Loại hợp đồng không được vượt quá 100 ký tự")
    private String contractType;

    @Field("risk_level")
    @Pattern(regexp = "^(LOW|MEDIUM|HIGH|CRITICAL)$", message = "Mức độ rủi ro phải là LOW, MEDIUM, HIGH hoặc CRITICAL")
    private String riskLevel;

    @Field("key_terms")
    @Size(max = 2000, message = "Điều khoản chính không được vượt quá 2000 ký tự")
    private String keyTerms;
    
    @Field("favorable_clauses")
    @Size(max = 2000, message = "Điều khoản có lợi không được vượt quá 2000 ký tự")
    private String favorableClauses;
    
    @Field("unfavorable_clauses")
    @Size(max = 2000, message = "Điều khoản bất lợi không được vượt quá 2000 ký tự")
    private String unfavorableClauses;
    
    @Field("payment_currency")
    @Pattern(regexp = "^[A-Z]{3}$", message = "Mã tiền tệ phải là 3 ký tự chữ hoa")
    private String paymentCurrency;

    @Field("ai_processed")
    private Boolean aiProcessed = false;

    @Field("processing_status")
    private ProcessingStatus processingStatus = ProcessingStatus.PENDING;

    // New fields from updated schema
    @Field("contract_object")
    @Size(max = 500, message = "Đối tượng hợp đồng không được vượt quá 500 ký tự")
    private String contractObject;

    @Field("effective_date")
    @Size(max = 100, message = "Ngày hiệu lực không được vượt quá 100 ký tự")
    private String effectiveDate;

    @Field("contract_term")
    @Size(max = 100, message = "Thời hạn hợp đồng không được vượt quá 100 ký tự")
    private String contractTerm;

    @Field("total_value")
    @Pattern(regexp = "^[0-9]+(\\.[0-9]{1,2})?$", message = "Tổng giá trị phải là số dương với tối đa 2 chữ số thập phân")
    private String totalValue;

    @Field("payment_schedule")
    @Size(max = 500, message = "Lịch thanh toán không được vượt quá 500 ký tự")
    private String paymentSchedule;

    @Pattern(regexp = "^[A-Z]{3}$", message = "Mã tiền tệ phải là 3 ký tự chữ hoa")
    private String currency;

    @Field("payment_method")
    @Size(max = 100, message = "Phương thức thanh toán không được vượt quá 100 ký tự")
    private String paymentMethod;

    @Size(max = 1000, message = "Nhắc nhở không được vượt quá 1000 ký tự")
    private String reminders;

    @Field("termination_conditions")
    @Size(max = 1000, message = "Điều kiện chấm dứt không được vượt quá 1000 ký tự")
    private String terminationConditions;

    @Field("risk_assessment")
    @Size(max = 2000, message = "Đánh giá rủi ro không được vượt quá 2000 ký tự")
    private String riskAssessment;

    @Field("compliance_status")
    @Pattern(regexp = "^(COMPLIANT|NON_COMPLIANT|PENDING_REVIEW|UNDER_REVIEW)$", message = "Trạng thái tuân thủ không hợp lệ")
    private String complianceStatus;

    @Field("legal_review_required")
    private Boolean legalReviewRequired = false;

    @Field("review_deadline")
    private LocalDateTime reviewDeadline;
    
    private String tags;

    public enum ContractStatus {
        DRAFT, PENDING, PENDING_APPROVAL, APPROVED, ACTIVE, COMPLETED, EXPIRED, TERMINATED, ARCHIVED, CANCELLED, SUSPENDED
    }

    public enum ProcessingStatus {
        PENDING, PROCESSING, COMPLETED, FAILED
    }
    
    @Override
    public String getId() {
        return this.id;
    }

    @Override
    public boolean isNew() {
        return this.getId() == null;
    }
    
    /**
     * Khởi tạo contract mới với các giá trị mặc định
     * Sử dụng method này thay vì constructor để đảm bảo tính nhất quán
     */
    public static Contract createNew() {
        Contract contract = new Contract();
        contract.id = null;
        contract.initializeNewEntity();
        contract.setAiProcessed(false);
        contract.setProcessingStatus(ProcessingStatus.PENDING);
        return contract;
    }
}
