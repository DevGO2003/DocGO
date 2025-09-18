package com.devgo2003.docgo.contract_service.script;

import com.devgo2003.docgo.contract_service.entity.Contract;
import com.devgo2003.docgo.contract_service.repository.ContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Profile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * Script để tạo dữ liệu test cho Contract Service
 * Chạy tự động khi khởi động ứng dụng với profile 'dev' hoặc 'test'
 */
@Component
public class TestDataGenerator implements CommandLineRunner {

    @Autowired
    private ContractRepository contractRepository;

    @Override
    public void run(String... args) throws Exception {
        // Kiểm tra xem đã có dữ liệu chưa
        if (contractRepository.count() > 0) {
            System.out.println("Database đã có dữ liệu, bỏ qua việc tạo test data.");
            return;
        }

        System.out.println("Bắt đầu tạo dữ liệu test...");
        
        List<Contract> testContracts = createTestContracts();
        
        for (Contract contract : testContracts) {
            contractRepository.save(contract);
            System.out.println("Đã tạo hợp đồng: " + contract.getContractNumber());
        }
        
        System.out.println("Hoàn thành tạo " + testContracts.size() + " hợp đồng test.");
    }

    private List<Contract> createTestContracts() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime today = LocalDateTime.now();
        
        Contract contract1 = Contract.createNew();
        contract1.setContractNumber("CTR-2024-001");
        contract1.setTitle("Hợp đồng cung cấp dịch vụ IT cho Công ty ABC");
        contract1.setStatus(Contract.ContractStatus.ACTIVE);
        contract1.setPartiesJson("[{\"role\":\"CLIENT\",\"name\":\"Công ty ABC\",\"address\":\"123 Đường ABC, Quận 1, TP.HCM\"},{\"role\":\"PROVIDER\",\"name\":\"Công ty IT Solutions\",\"address\":\"456 Đường XYZ, Quận 3, TP.HCM\"}]");
        contract1.setStartDate(today.minusDays(30));
        contract1.setEndDate(today.plusDays(335));
        contract1.setSystemId("SYS-IT-001");
        contract1.setSummary("Hợp đồng cung cấp dịch vụ IT bao gồm phát triển phần mềm, bảo trì hệ thống và hỗ trợ kỹ thuật");
        contract1.setContractType("Dịch vụ IT");
        contract1.setRiskLevel("LOW");
        contract1.setKeyTerms("Thanh toán theo tiến độ, bảo hành 12 tháng, SLA 99.9%");
        contract1.setFavorableClauses("Điều khoản bảo hành, cam kết chất lượng, hỗ trợ 24/7");
        contract1.setUnfavorableClauses("Phạt chậm tiến độ, giới hạn trách nhiệm");
        contract1.setPaymentCurrency("VND");
        contract1.setAiProcessed(true);
        contract1.setProcessingStatus(Contract.ProcessingStatus.COMPLETED);
        contract1.setContractObject("Dịch vụ phát triển phần mềm và bảo trì hệ thống");
        contract1.setEffectiveDate("01/01/2024");
        contract1.setContractTerm("12 tháng");
        contract1.setTotalValue("500000000");
        contract1.setPaymentSchedule("Thanh toán 30% khi ký hợp đồng, 40% khi hoàn thành 50% công việc, 30% khi nghiệm thu");
        contract1.setCurrency("VND");
        contract1.setPaymentMethod("Chuyển khoản ngân hàng");
        contract1.setReminders("Nhắc nhở thanh toán trước 7 ngày, nhắc nhở gia hạn trước 30 ngày");
        contract1.setTerminationConditions("Chấm dứt khi vi phạm nghiêm trọng, không thanh toán đúng hạn, chất lượng không đạt yêu cầu");
        contract1.setRiskAssessment("Rủi ro thấp do đối tác uy tín, có kinh nghiệm trong lĩnh vực IT");
        contract1.setComplianceStatus("COMPLIANT");
        contract1.setLegalReviewRequired(false);
        contract1.setTags("IT, Software Development, Maintenance");
        contract1.setCreatedBy("system");
        contract1.setUpdatedBy("system");
        contract1.setCreatedAt(now.minusDays(30));
        contract1.setUpdatedAt(now.minusDays(30));

        Contract contract2 = Contract.createNew();
        contract2.setContractNumber("CTR-2024-002");
        contract2.setTitle("Hợp đồng thuê văn phòng tại Tòa nhà Landmark");
        contract2.setStatus(Contract.ContractStatus.PENDING_APPROVAL);
        contract2.setPartiesJson("[{\"role\":\"TENANT\",\"name\":\"Công ty Startup XYZ\",\"address\":\"789 Đường Startup, Quận 2, TP.HCM\"},{\"role\":\"LANDLORD\",\"name\":\"Công ty BDS Landmark\",\"address\":\"Tòa nhà Landmark, Quận 1, TP.HCM\"}]");
        contract2.setStartDate(today.plusDays(15));
        contract2.setEndDate(today.plusDays(380));
        contract2.setSystemId("SYS-RE-002");
        contract2.setSummary("Hợp đồng thuê văn phòng 200m2 tại tầng 15 Tòa nhà Landmark với đầy đủ tiện ích");
        contract2.setContractType("Thuê văn phòng");
        contract2.setRiskLevel("MEDIUM");
        contract2.setKeyTerms("Thuê 12 tháng, gia hạn tự động, đặt cọc 3 tháng tiền thuê");
        contract2.setFavorableClauses("Điều khoản gia hạn tự động, bảo trì cơ sở hạ tầng, an ninh 24/7");
        contract2.setUnfavorableClauses("Phạt chấm dứt sớm, giới hạn sửa đổi nội thất");
        contract2.setPaymentCurrency("VND");
        contract2.setAiProcessed(false);
        contract2.setProcessingStatus(Contract.ProcessingStatus.PENDING);
        contract2.setContractObject("Văn phòng 200m2 tại Tòa nhà Landmark");
        contract2.setEffectiveDate("15/01/2024");
        contract2.setContractTerm("12 tháng");
        contract2.setTotalValue("120000000");
        contract2.setPaymentSchedule("Thanh toán hàng tháng vào ngày 15, đặt cọc 3 tháng tiền thuê");
        contract2.setCurrency("VND");
        contract2.setPaymentMethod("Chuyển khoản ngân hàng");
        contract2.setReminders("Nhắc nhở thanh toán trước 5 ngày, nhắc nhở gia hạn trước 60 ngày");
        contract2.setTerminationConditions("Chấm dứt khi vi phạm quy định tòa nhà, không thanh toán đúng hạn");
        contract2.setRiskAssessment("Rủi ro trung bình do thị trường bất động sản biến động");
        contract2.setComplianceStatus("PENDING_REVIEW");
        contract2.setLegalReviewRequired(true);
        contract2.setTags("Real Estate, Office Rental, Landmark");
        contract2.setCreatedBy("system");
        contract2.setUpdatedBy("system");
        contract2.setCreatedAt(now.minusDays(15));
        contract2.setUpdatedAt(now.minusDays(15));

        Contract contract3 = Contract.createNew();
        contract3.setContractNumber("CTR-2024-003");
        contract3.setTitle("Hợp đồng cung cấp nguyên vật liệu xây dựng");
        contract3.setStatus(Contract.ContractStatus.DRAFT);
        contract3.setPartiesJson("[{\"role\":\"BUYER\",\"name\":\"Công ty Xây dựng DEF\",\"address\":\"321 Đường Construction, Quận 7, TP.HCM\"},{\"role\":\"SUPPLIER\",\"name\":\"Công ty Vật liệu GHI\",\"address\":\"654 Đường Materials, Quận 8, TP.HCM\"}]");
        contract3.setStartDate(today.plusDays(30));
        contract3.setEndDate(today.plusDays(425));
        contract3.setSystemId("SYS-CON-003");
        contract3.setSummary("Hợp đồng cung cấp xi măng, thép, gạch và các vật liệu xây dựng khác cho dự án chung cư cao cấp");
        contract3.setContractType("Cung cấp vật liệu");
        contract3.setRiskLevel("HIGH");
        contract3.setKeyTerms("Cung cấp theo tiến độ dự án, bảo hành chất lượng, giao hàng tận công trường");
        contract3.setFavorableClauses("Điều khoản bảo hành dài hạn, cam kết chất lượng, giao hàng đúng hạn");
        contract3.setUnfavorableClauses("Phạt chậm giao hàng, giới hạn bồi thường, điều kiện thanh toán khắt khe");
        contract3.setPaymentCurrency("VND");
        contract3.setAiProcessed(false);
        contract3.setProcessingStatus(Contract.ProcessingStatus.PENDING);
        contract3.setContractObject("Xi măng, thép, gạch và vật liệu xây dựng");
        contract3.setEffectiveDate("01/02/2024");
        contract3.setContractTerm("12 tháng");
        contract3.setTotalValue("2500000000");
        contract3.setPaymentSchedule("Thanh toán 20% khi ký hợp đồng, 60% theo tiến độ giao hàng, 20% khi hoàn thành");
        contract3.setCurrency("VND");
        contract3.setPaymentMethod("Thư tín dụng và chuyển khoản");
        contract3.setReminders("Nhắc nhở giao hàng trước 7 ngày, nhắc nhở thanh toán trước 3 ngày");
        contract3.setTerminationConditions("Chấm dứt khi chất lượng không đạt, chậm giao hàng nghiêm trọng");
        contract3.setRiskAssessment("Rủi ro cao do giá vật liệu biến động, phụ thuộc vào thị trường quốc tế");
        contract3.setComplianceStatus("UNDER_REVIEW");
        contract3.setLegalReviewRequired(true);
        contract3.setTags("Construction, Materials, Supply Chain");
        contract3.setCreatedBy("system");
        contract3.setUpdatedBy("system");
        contract3.setCreatedAt(now.minusDays(7));
        contract3.setUpdatedAt(now.minusDays(7));

        Contract contract4 = Contract.createNew();
        contract4.setContractNumber("CTR-2024-004");
        contract4.setTitle("Hợp đồng dịch vụ vận chuyển hàng hóa");
        contract4.setStatus(Contract.ContractStatus.ACTIVE);
        contract4.setPartiesJson("[{\"role\":\"SHIPPER\",\"name\":\"Công ty Logistics JKL\",\"address\":\"987 Đường Logistics, Quận 9, TP.HCM\"},{\"role\":\"CUSTOMER\",\"name\":\"Công ty Thương mại MNO\",\"address\":\"147 Đường Trade, Quận 10, TP.HCM\"}]");
        contract4.setStartDate(today.minusDays(60));
        contract4.setEndDate(today.plusDays(305));
        contract4.setSystemId("SYS-LOG-004");
        contract4.setSummary("Hợp đồng cung cấp dịch vụ vận chuyển hàng hóa từ TP.HCM đến các tỉnh miền Tây và miền Đông");
        contract4.setContractType("Dịch vụ vận chuyển");
        contract4.setRiskLevel("MEDIUM");
        contract4.setKeyTerms("Vận chuyển 24/7, bảo hiểm hàng hóa, tracking real-time");
        contract4.setFavorableClauses("Điều khoản bảo hiểm toàn bộ, cam kết thời gian giao hàng, hỗ trợ 24/7");
        contract4.setUnfavorableClauses("Giới hạn trách nhiệm bồi thường, điều kiện đóng gói hàng hóa");
        contract4.setPaymentCurrency("VND");
        contract4.setAiProcessed(true);
        contract4.setProcessingStatus(Contract.ProcessingStatus.COMPLETED);
        contract4.setContractObject("Dịch vụ vận chuyển hàng hóa đường bộ");
        contract4.setEffectiveDate("01/11/2023");
        contract4.setContractTerm("12 tháng");
        contract4.setTotalValue("800000000");
        contract4.setPaymentSchedule("Thanh toán hàng tháng vào ngày 30, quyết toán cuối tháng");
        contract4.setCurrency("VND");
        contract4.setPaymentMethod("Chuyển khoản ngân hàng");
        contract4.setReminders("Nhắc nhở thanh toán trước 3 ngày, báo cáo định kỳ hàng tháng");
        contract4.setTerminationConditions("Chấm dứt khi vi phạm an toàn giao thông, không thanh toán đúng hạn");
        contract4.setRiskAssessment("Rủi ro trung bình do phụ thuộc vào giao thông và thời tiết");
        contract4.setComplianceStatus("COMPLIANT");
        contract4.setLegalReviewRequired(false);
        contract4.setTags("Logistics, Transportation, Delivery");
        contract4.setCreatedBy("system");
        contract4.setUpdatedBy("system");
        contract4.setCreatedAt(now.minusDays(60));
        contract4.setUpdatedAt(now.minusDays(60));

        Contract contract5 = Contract.createNew();
        contract5.setContractNumber("CTR-2024-005");
        contract5.setTitle("Hợp đồng bảo hiểm nhân thọ cho nhân viên");
        contract5.setStatus(Contract.ContractStatus.PENDING);
        contract5.setPartiesJson("[{\"role\":\"INSURER\",\"name\":\"Công ty Bảo hiểm PQR\",\"address\":\"258 Đường Insurance, Quận 1, TP.HCM\"},{\"role\":\"EMPLOYER\",\"name\":\"Công ty Công nghệ STU\",\"address\":\"369 Đường Tech, Quận 3, TP.HCM\"}]");
        contract5.setStartDate(today.plusDays(45));
        contract5.setEndDate(today.plusDays(440));
        contract5.setSystemId("SYS-INS-005");
        contract5.setSummary("Hợp đồng bảo hiểm nhân thọ nhóm cho 150 nhân viên công ty công nghệ với các gói bảo hiểm đa dạng");
        contract5.setContractType("Bảo hiểm nhân thọ");
        contract5.setRiskLevel("LOW");
        contract5.setKeyTerms("Bảo hiểm nhóm, quyền lợi tử vong, bảo hiểm bệnh hiểm nghèo, bảo hiểm tai nạn");
        contract5.setFavorableClauses("Điều khoản bảo hiểm rộng rãi, quyền lợi bổ sung, dịch vụ chăm sóc khách hàng");
        contract5.setUnfavorableClauses("Giới hạn tuổi tham gia, điều kiện sức khỏe, thời gian chờ");
        contract5.setPaymentCurrency("VND");
        contract5.setAiProcessed(false);
        contract5.setProcessingStatus(Contract.ProcessingStatus.PENDING);
        contract5.setContractObject("Bảo hiểm nhân thọ nhóm cho nhân viên");
        contract5.setEffectiveDate("15/02/2024");
        contract5.setContractTerm("12 tháng");
        contract5.setTotalValue("450000000");
        contract5.setPaymentSchedule("Thanh toán hàng quý, phí bảo hiểm được trừ vào lương nhân viên");
        contract5.setCurrency("VND");
        contract5.setPaymentMethod("Trừ lương và chuyển khoản");
        contract5.setReminders("Nhắc nhở gia hạn trước 60 ngày, báo cáo định kỳ hàng quý");
        contract5.setTerminationConditions("Chấm dứt khi công ty đóng cửa, nhân viên nghỉ việc");
        contract5.setRiskAssessment("Rủi ro thấp do đối tác bảo hiểm uy tín, danh mục khách hàng ổn định");
        contract5.setComplianceStatus("PENDING_REVIEW");
        contract5.setLegalReviewRequired(true);
        contract5.setTags("Insurance, Life Insurance, Employee Benefits");
        contract5.setCreatedBy("system");
        contract5.setUpdatedBy("system");
        contract5.setCreatedAt(now.minusDays(3));
        contract5.setUpdatedAt(now.minusDays(3));

        return Arrays.asList(contract1, contract2, contract3, contract4, contract5);
    }
}
