package com.devgo2003.docgo.contract_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "contract_summaries")
@Getter
@Setter
public class ContractSummary extends BaseEntity {

    @Id
    private String id;

    @Field("contract_id")
    private String contractId;

    @Field("summary_text")
    private String summaryText;

    @Field("key_points")
    private String keyPoints;

    @Field("risk_assessment")
    private String riskAssessment;

    @Field("recommendations")
    private String recommendations;
    @Override
    public boolean isNew() {
        return this.id == null;
    }
}
