package com.devgo2003.docgo.contract_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Void> redirectToDocs() {
        return ResponseEntity.status(302)
                .header("Location", "/docs")
                .build();
    }
}


