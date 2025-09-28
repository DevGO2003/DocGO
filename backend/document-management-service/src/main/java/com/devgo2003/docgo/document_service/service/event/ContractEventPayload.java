package com.devgo2003.docgo.document_service.service.event;

import com.devgo2003.docgo.document_service.entity.Contract;

public class ContractEventPayload {
    private final Contract contract;
    private final String eventType;

    public ContractEventPayload(Contract contract, String eventType) {
        this.contract = contract;
        this.eventType = eventType;
    }

    public Contract getContract() {
        return contract;
    }

    public String getEventType() {
        return eventType;
    }
}
