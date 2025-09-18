package com.devgo2003.docgo.auth_service.config;

import com.devgo2003.docgo.auth_service.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

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
}

