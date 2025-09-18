package com.devgo2003.docgo.contract_service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Document(collection = "contract_reminders")
@Getter
@Setter
public class ContractReminder extends BaseEntity {

    @Id
    @MongoId
    private String id;

    @Field("contract_id")
    @NotBlank(message = "Contract ID không được để trống")
    private String contractId;

    @Field("reminder_type")
    @NotBlank(message = "Loại nhắc nhở không được để trống")
    private String reminderType;

    @Field("reminder_date")
    @NotBlank(message = "Ngày nhắc nhở không được để trống")
    private String reminderDate; // Storing as String to match event data

    @Field("content")
    @NotBlank(message = "Nội dung không được để trống")
    private String content;

    @Override
    public boolean isNew() {
        return this.id == null;
    }
}

