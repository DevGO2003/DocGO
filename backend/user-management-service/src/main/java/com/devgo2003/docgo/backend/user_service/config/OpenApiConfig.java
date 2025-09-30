package com.devgo2003.docgo.backend.user_service.config;

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
public class OpenApiConfig {

    @Bean
    public OpenAPI userManagementServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("User Management Service")
                        .description("Dịch vụ quản lý người dùng, phân quyền và xác thực của DocGO")
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
                                .url("http://localhost:8001")
                                .description("Local Development Server"),
                        new Server()
                                .url("http://localhost:8001/api/v1/user-management-service")
                                .description("API Base URL")
                ));
    }
}



