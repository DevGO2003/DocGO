package com.devgo2003.docgo.auth_service.config;

import com.devgo2003.docgo.auth_service.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.InitializingBean;

@Configuration
public class JwtConfig implements InitializingBean {

    @Value("${security.jwt.base64-secret}")
    private String base64Secret;

    @Value("${security.jwt.access-ttl-seconds:900}")
    private long accessTokenTtlSeconds;

    @Value("${security.jwt.refresh-ttl-seconds:3600}")
    private long refreshTokenTtlSeconds;

    @Bean
    public JwtUtil jwtUtil() {
        return new JwtUtil(base64Secret, accessTokenTtlSeconds, refreshTokenTtlSeconds);
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        // Validation: Refresh token TTL must be greater than access token TTL
        if (refreshTokenTtlSeconds <= accessTokenTtlSeconds) {
            throw new IllegalStateException(
                String.format("Refresh token TTL (%d seconds) must be greater than access token TTL (%d seconds). " +
                             "Please check your JWT configuration in application.properties or environment variables.",
                             refreshTokenTtlSeconds, accessTokenTtlSeconds)
            );
        }
        
        // Additional validation: Access token should not be too long (security best practice)
        if (accessTokenTtlSeconds > 3600) { // 1 hour
            throw new IllegalStateException(
                String.format("Access token TTL (%d seconds) is too long for security reasons. " +
                             "Recommended maximum is 3600 seconds (1 hour).",
                             accessTokenTtlSeconds)
            );
        }
        
        // Additional validation: Refresh token should not be too short (user experience)
        if (refreshTokenTtlSeconds < 3600) { // 1 hour
            throw new IllegalStateException(
                String.format("Refresh token TTL (%d seconds) is too short for good user experience. " +
                             "Recommended minimum is 3600 seconds (1 hour).",
                             refreshTokenTtlSeconds)
            );
        }
    }
}

