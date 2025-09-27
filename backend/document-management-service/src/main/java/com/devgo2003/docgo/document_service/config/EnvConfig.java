package com.devgo2003.docgo.document_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

@Configuration
@PropertySources({
    @PropertySource(value = "classpath:application.properties"),
    @PropertySource(value = "file:env/.env", ignoreResourceNotFound = true)
})
public class EnvConfig {

    @PostConstruct
    public void loadEnvFiles() {
        // Load .env file
        loadEnvFile("env/.env");
    }

    private void loadEnvFile(String filePath) {
        File envFile = new File(filePath);
        if (envFile.exists()) {
            Properties props = new Properties();
            try (FileInputStream fis = new FileInputStream(envFile)) {
                props.load(fis);
                // Set system properties for Spring to pick up
                props.forEach((key, value) -> {
                    if (!System.getProperties().containsKey(key)) {
                        System.setProperty(key.toString(), value.toString());
                    }
                });
                System.out.println("✅ Loaded environment variables from " + filePath);
            } catch (IOException e) {
                System.err.println("❌ Failed to load environment variables from " + filePath + ": " + e.getMessage());
            }
        }
    }
}
