package com.devgo2003.docgo.contract_service.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.devgo2003.docgo.contract_service.entity.Contract;
import com.devgo2003.docgo.contract_service.service.IContractService;
import com.devgo2003.docgo.contract_service.service.impl.ContractKafkaServiceImpl;

import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContractKafkaServiceTest {

    @Mock
    private KafkaTemplate<String, String> kafkaTemplate;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private IContractService contractService;

    @InjectMocks
    private ContractKafkaServiceImpl contractKafkaService;

    private ObjectMapper testObjectMapper;

    @BeforeEach
    void setUp() {
        testObjectMapper = new ObjectMapper();
    }

    @Test
    void testProcessSummaryCreated_WithNullEvent() throws Exception {
        // Test với event null
        contractKafkaService.processSummaryCreated(null);
        
        // Không nên gọi contractService.createContract
        verify(contractService, never()).createContract(any(Contract.class));
    }

    @Test
    void testProcessSummaryCreated_WithNullData() throws Exception {
        // Tạo event với data null
        Map<String, Object> event = new HashMap<>();
        event.put("data", null);
        event.put("actor", new HashMap<>());
        
        contractKafkaService.processSummaryCreated(event);
        
        // Không nên gọi contractService.createContract
        verify(contractService, never()).createContract(any(Contract.class));
    }

    @Test
    void testProcessSummaryCreated_WithNullActor() throws Exception {
        // Tạo event với actor null
        Map<String, Object> event = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        event.put("data", data);
        event.put("actor", null);
        
        contractKafkaService.processSummaryCreated(event);
        
        // Không nên gọi contractService.createContract
        verify(contractService, never()).createContract(any(Contract.class));
    }

    @Test
    void testProcessSummaryCreated_WithNullFileInformation() throws Exception {
        // Tạo event với file_information null
        Map<String, Object> event = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        Map<String, Object> actor = new HashMap<>();
        
        data.put("file_information", null);
        data.put("contract_summary", new HashMap<>());
        event.put("data", data);
        event.put("actor", actor);
        
        contractKafkaService.processSummaryCreated(event);
        
        // Không nên gọi contractService.createContract
        verify(contractService, never()).createContract(any(Contract.class));
    }

    @Test
    void testProcessSummaryCreated_WithNullContractSummary() throws Exception {
        // Tạo event với contract_summary null
        Map<String, Object> event = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        Map<String, Object> actor = new HashMap<>();
        Map<String, Object> fileInfo = new HashMap<>();
        
        fileInfo.put("fileId", "test-file-id");
        fileInfo.put("filename", "test-file.pdf");
        fileInfo.put("summary", "test summary");
        
        data.put("file_information", fileInfo);
        data.put("contract_summary", null);
        event.put("data", data);
        event.put("actor", actor);
        
        contractKafkaService.processSummaryCreated(event);
        
        // Không nên gọi contractService.createContract
        verify(contractService, never()).createContract(any(Contract.class));
    }

    @Test
    void testProcessSummaryCreated_WithNullRequiredFields() throws Exception {
        // Tạo event với các trường bắt buộc null
        Map<String, Object> event = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        Map<String, Object> actor = new HashMap<>();
        Map<String, Object> fileInfo = new HashMap<>();
        Map<String, Object> contractSummary = new HashMap<>();
        
        // fileInfo thiếu các trường bắt buộc
        fileInfo.put("fileId", null);
        fileInfo.put("filename", null);
        fileInfo.put("summary", null);
        
        data.put("file_information", fileInfo);
        data.put("contract_summary", contractSummary);
        event.put("data", data);
        event.put("actor", actor);
        
        contractKafkaService.processSummaryCreated(event);
        
        // Không nên gọi contractService.createContract
        verify(contractService, never()).createContract(any(Contract.class));
    }

    @Test
    void testProcessSummaryCreated_WithValidData() throws Exception {
        // Tạo event với dữ liệu hợp lệ
        Map<String, Object> event = new HashMap<>();
        Map<String, Object> data = new HashMap<>();
        Map<String, Object> actor = new HashMap<>();
        Map<String, Object> fileInfo = new HashMap<>();
        Map<String, Object> contractSummary = new HashMap<>();
        
        // Thiết lập dữ liệu hợp lệ
        fileInfo.put("fileId", "test-file-id");
        fileInfo.put("filename", "test-file.pdf");
        fileInfo.put("summary", "test summary");
        
        contractSummary.put("title", "Test Contract");
        
        data.put("file_information", fileInfo);
        data.put("contract_summary", contractSummary);
        event.put("data", data);
        event.put("actor", actor);
        
        // Mock contractService để trả về contract hợp lệ
        Contract mockContract = Contract.createNew();
        mockContract.setId("1");
        when(contractService.createContract(any(Contract.class))).thenReturn(mockContract);
        
        contractKafkaService.processSummaryCreated(event);
        
        // Nên gọi contractService.createContract
        verify(contractService, times(1)).createContract(any(Contract.class));
    }
}
