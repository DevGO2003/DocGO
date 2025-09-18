package com.devgo2003.docgo.contract_service.model;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class ContractProcessingRequest {
    
    private String requestId;
    
    private Long fileId;
    
    private String filePath;
    
    private String originalFilename;
    
    private String contentType;
    
    private Long fileSize;
    
    private LocalDateTime requestTime;
    
    private String serviceType; // "ai-processing" hoặc "ocr-extraction"
    
    private String callbackTopic; // Topic để nhận kết quả xử lý
}
