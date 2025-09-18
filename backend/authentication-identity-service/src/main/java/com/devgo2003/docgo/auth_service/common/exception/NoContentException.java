package com.devgo2003.docgo.auth_service.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NO_CONTENT)
public class NoContentException extends RuntimeException {
    public NoContentException(String message) {
        super(message);
    }
}