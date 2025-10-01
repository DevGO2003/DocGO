package com.devgo2003.docgo.document_service.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "🏥 APIs Gốc", description = "Health check và root endpoints")
public class RootController {

    @GetMapping("/")
    @Operation(
        summary = "Redirect to docs",
        description = """
        ## 📖 Mô tả
        Chuyển hướng đến trang Swagger UI của service.

        ## 🔹 Đầu vào
        (Không có tham số)

        ## 🔹 Đầu ra
        🔄 Redirect 302 → /docs
        """
    )
    public ResponseEntity<Void> redirectToDocs() {
        return ResponseEntity.status(302)
                .header("Location", "/docs")
                .build();
    }
}


