package com.devgo2003.docgo.document_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI documentManagementServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Document Management Service API")
                        .description("API quản lý tài liệu - Dịch vụ quản lý tài liệu và hợp đồng của DocGO")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("DevGO2003")
                                .email("dev@devgo2003.com")
                                .url("https://github.com/DevGO2003"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8002")
                                .description("Local Development Server"),
                        new Server()
                                .url("http://localhost:8002/api/v1/document-management-service")
                                .description("API Base URL")
                ))
                .tags(List.of(
                        new Tag().name("📄 APIs Quản lý Tài liệu").description("APIs quản lý tài liệu và tệp tin"),
                        new Tag().name("📋 APIs Quản lý Hợp đồng").description("APIs quản lý hợp đồng"),
                        new Tag().name("💬 APIs Quản lý Bình luận").description("APIs quản lý bình luận"),
                        new Tag().name("✍️ APIs Quản lý chữ ký điện tử").description("APIs quản lý chữ ký điện tử"),
                        new Tag().name("✅ APIs Quản lý Phê duyệt").description("APIs quản lý phê duyệt"),
                        new Tag().name("🏥 APIs Gốc").description("Health check và root endpoints")
                ));
    }
}
