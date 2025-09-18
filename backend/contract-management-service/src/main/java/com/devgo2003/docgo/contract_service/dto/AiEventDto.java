package com.devgo2003.docgo.contract_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AiEventDto {
    private String eventVersion;
    private String eventType;
    private String eventId;
    private String timestamp;
    private String source;
    private String correlationId;
    private ActorDto actor;
    private EventDataDto data;
    private MetadataDto metadata;

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ActorDto {
        private String userId;
        private String userRole;
        private String ip;
    }

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class EventDataDto {
        private FileInformationDto fileInformation;
        private AiProcessingResultDto aiProcessingResult;
        private ContractSummaryDto contractSummary;
    }

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class FileInformationDto {
        private String fileId;
        private String filename;
        private String fileType;
        private String fileKey;
        private String bucket;
        private String contentType;
        private Long fileSize;
        private String uploadedAt;
    }

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class AiProcessingResultDto {
        private String extractionMethod;
        private Double confidence;
        private Long processingTime;
        private String modelVersion;
        private String processedAt;
    }

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ContractSummaryDto {
        private String title;
        private List<String> tag;
        private List<ContractPartyDto> parties;
        private String object;
        private String effectiveDate;
        private String term;
        private PaymentDetailsDto paymentDetails;
        private List<ClauseDto> keyClauses;
        private List<FavorableClauseDto> favorableClauses;
        private List<UnfavorableClauseDto> unfavorableClauses;
        private List<ReminderDto> reminders;
        private String terminationConditions;
        private RiskAssessmentDto riskAssessment;
        private ComplianceStatusDto complianceStatus;
    }

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ContractPartyDto {
        private String name;
        private String role;
        private String representative;
        private String taxCode;
        private String contact;
        private String address;
        private String businessLicense;
    }

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PaymentDetailsDto {
        private String totalValue;
        private String schedule;
        private String currency;
        private String paymentMethod;
    }

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ClauseDto {
        private String name;
        private String description;
        private String source;
    }

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class FavorableClauseDto {
        private String clauseName;
        private String description;
        private String benefitTo;
    }

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class UnfavorableClauseDto {
        private String clauseName;
        private String description;
        private String riskTo;
    }

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ReminderDto {
        private String type;
        private String date;
        private String content;
    }

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class RiskAssessmentDto {
        private String riskLevel;
        private List<String> riskFactors;
        private List<String> mitigationMeasures;
    }

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ComplianceStatusDto {
        private String status;
        private List<String> issues;
        private List<String> recommendations;
    }

    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class MetadataDto {
        private String serviceVersion;
        private String region;
    }
}
