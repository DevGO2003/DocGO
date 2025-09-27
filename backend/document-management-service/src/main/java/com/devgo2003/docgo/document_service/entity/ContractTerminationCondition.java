package com.devgo2003.docgo.document_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "contract_termination_conditions")
@Getter
@Setter
public class ContractTerminationCondition extends BaseEntity {

    @Id
    private String id;

    @Field("contract_id")
    private String contractId;

    @Field("condition_type")
    private String conditionType;

    @Field("condition_description")
    private String conditionDescription;

    @Field("trigger_events")
    private String triggerEvents;

    @Field("notice_period")
    private String noticePeriod;
    
    @Override
    public boolean isNew() {
        return this.id == null;
    }
}
