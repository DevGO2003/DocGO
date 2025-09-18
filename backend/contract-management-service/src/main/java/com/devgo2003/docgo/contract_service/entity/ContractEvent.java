package com.devgo2003.docgo.contract_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "contract_events")
@Getter
@Setter
public class ContractEvent extends BaseEntity {

    @Id
    private String id;

    @Indexed
    @Field("contract_id")
    private String contractId;

    @Field("event_type")
    private String eventType;

    @Field("event_data")
    private String eventData;

    @Field("user_id")
    private String userId;

    @Field("user_name")
    private String userName;

    @Field("ip_address")
    private String ipAddress;

    @Field("user_agent")
    private String userAgent;

    @Field("timestamp")
    private LocalDateTime timestamp;

    @Field("metadata")
    private String metadata;
    @Override
    public boolean isNew() {
        return this.id == null;
    }
}
