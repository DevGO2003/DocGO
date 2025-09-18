package com.devgo2003.docgo.contract_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "contract_favorable_clauses")
@Getter
@Setter
public class ContractFavorableClause extends BaseEntity {

    @Id
    private String id;

    @Field("contract_id")
    private String contractId;

    @Field("clause_name")
    private String clauseName;

    @Field("clause_description")
    private String clauseDescription;

    @Field("clause_source")
    private String clauseSource;

    @Field("benefit_level")
    private String benefitLevel;

    @Field("impact_assessment")
    private String impactAssessment;
    
    @Override
    public boolean isNew() {
        return this.id == null;
    }
}
