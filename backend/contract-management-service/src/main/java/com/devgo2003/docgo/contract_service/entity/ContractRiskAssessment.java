package com.devgo2003.docgo.contract_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Document(collection = "contract_risk_assessments")
@Getter
@Setter
public class ContractRiskAssessment extends BaseEntity {

    @Id
    @MongoId
    private String id;

    @Field("contract_id")
    @NotBlank(message = "Contract ID không được để trống")
    private String contractId;

    @Field("risk_level")
    private String riskLevel;

    @Field("risk_factors")
    private List<String> riskFactors;

    @Field("mitigation_measures")
    private List<String> mitigationMeasures;

    @Override
    public boolean isNew() {
        return this.id == null;
    }
}
