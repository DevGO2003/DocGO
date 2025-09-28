package com.devgo2003.docgo.document_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Document(collection = "contract_compliance_statuses")
@Getter
@Setter
public class ContractComplianceStatus extends BaseEntity {

    @Id
    @MongoId
    private String id;

    @Field("contract_id")
    @NotBlank(message = "Contract ID không được để trống")
    private String contractId;

    @Field("status")
    private String status;

    @Field("issues")
    private List<String> issues;

    @Field("recommendations")
    private List<String> recommendations;

    @Override
    public boolean isNew() {
        return this.id == null;
    }
}
