package com.devgo2003.docgo.document_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "contract_key_terms")
@Getter
@Setter
public class ContractKeyTerm extends BaseEntity {

    @Id
    private String id;

    @Field("contract_id")
    private String contractId;

    @Field("term_name")
    private String termName;

    @Field("term_description")
    private String termDescription;

    @Field("term_source")
    private String termSource;

    @Field("importance_level")
    private String importanceLevel;
    @Override
    public boolean isNew() {
        return this.id == null;
    }
}
