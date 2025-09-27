package com.devgo2003.docgo.document_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Document(collection = "contract_clauses")
@Getter
@Setter
public class ContractClause extends BaseEntity {

    @Id
    @MongoId
    private String id;

    @Field("contract_id")
    @NotBlank(message = "Contract ID không được để trống")
    private String contractId;

    @Field("clause_name")
    @NotBlank(message = "Tên điều khoản không được để trống")
    private String clauseName;

    @Field("description")
    private String description;

    @Field("source") // Can be used for 'source', 'benefitTo', or 'riskTo'
    private String source;

    @Field("clause_type")
    @NotNull(message = "Loại điều khoản không được để trống")
    private ClauseType clauseType;

    public enum ClauseType {
        KEY, FAVORABLE, UNFAVORABLE
    }

    @Override
    public boolean isNew() {
        return this.id == null;
    }
}

