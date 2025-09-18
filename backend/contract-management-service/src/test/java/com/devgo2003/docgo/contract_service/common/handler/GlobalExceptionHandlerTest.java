package com.devgo2003.docgo.contract_service.common.handler;

import com.devgo2003.docgo.contract_service.common.exception.NoContentException;
import com.devgo2003.docgo.contract_service.common.response.RestResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class GlobalExceptionHandlerTest {

    @Mock
    private HttpServletRequest request;

    private GlobalExceptionHandler handler;

    @BeforeEach
    void setUp() {
        handler = new GlobalExceptionHandler();
        when(request.getRequestURI()).thenReturn("/api/v1/contract-management-service/contracts");
    }

    @Test
    void testHandleNoContentException_Returns200WithStatusCode204() {
        // Given
        NoContentException exception = new NoContentException("Không có hợp đồng nào.");

        // When
        ResponseEntity<RestResponse<Void>> response = handler.handleNoContentException(exception, request);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        
        RestResponse<Void> body = response.getBody();
        assertEquals("v1", body.getApiVersion());
        assertEquals(204, body.getStatusCode());
        assertEquals("No Content", body.getShortMessage());
        assertEquals("Không có hợp đồng nào.", body.getDescription());
        assertNull(body.getData());
        assertNotNull(body.getTimestamp());
        assertNotNull(body.getRequestId());
        assertEquals("/api/v1/contract-management-service/contracts", body.getPath());
    }
}
