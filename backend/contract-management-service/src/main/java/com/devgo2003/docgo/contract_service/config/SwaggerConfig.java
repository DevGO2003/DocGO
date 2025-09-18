package com.devgo2003.docgo.contract_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI contractManagementServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Contract Management Service API")
                        .description("API quản lý hợp đồng - Dịch vụ quản lý hợp đồng của DocGO")
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
                                .url("http://localhost:8002/api/v1/contract-management-service")
                                .description("API Base URL")
                ));
    }
}
