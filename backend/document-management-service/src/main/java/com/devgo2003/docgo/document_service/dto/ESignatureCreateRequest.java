package com.devgo2003.docgo.document_service.dto;

import com.devgo2003.docgo.document_service.entity.ESignature;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ESignatureCreateRequest {
    
    @NotBlank(message = "Contract ID không được để trống")
    private String contractId;
    
    @NotBlank(message = "Signer ID không được để trống")
    private String signerId;
    
    @NotBlank(message = "Tên người ký không được để trống")
    private String signerName;
    
    @NotBlank(message = "Email người ký không được để trống")
    private String signerEmail;

    @NotBlank(message = "Vai trò người ký không được để trống")
    private String signerRole;
    
    @NotNull(message = "Loại chữ ký không được để trống")
    private ESignature.SignatureType signatureType;
    
    @NotBlank(message = "Dữ liệu chữ ký không được để trống")
    private String signatureData;
    
    private String signatureImage;
    
    private String certificateData;
    
    private String certificateIssuer;
    
    private LocalDateTime signedAt;
    
    private String ipAddress;
    
    private String userAgent;
    
    private String additionalData;
}
