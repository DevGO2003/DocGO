package com.devgo2003.docgo.contract_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "contract_payment_details")
@Getter
@Setter
public class ContractPaymentDetail extends BaseEntity {

    @Id
    private String id;

    @Field("contract_id")
    private String contractId;

    @Field("payment_type")
    private String paymentType;

    @Field("amount")
    private String amount;

    @Field("currency")
    private String currency;

    @Field("due_date")
    private String dueDate;

    @Field("payment_status")
    private String paymentStatus;
    @Override
    public boolean isNew() {
        return this.id == null;
    }
}
