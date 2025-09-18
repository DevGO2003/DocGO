package com.devgo2003.docgo.contract_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "contract_parties")
@Getter
@Setter
public class ContractParty extends BaseEntity {

    @Id
    private String id;

    @Field("contract_id")
    private String contractId;

    @Field("party_name")
    private String partyName;

    @Field("party_type")
    private String partyType;

    @Field("contact_person")
    private String contactPerson;

    @Field("email")
    private String email;

    @Field("phone")
    private String phone;

    @Field("address")
    private String address;

    @Field("tax_code")
    private String taxCode;
    @Override
    public boolean isNew() {
        return this.id == null;
    }
}
