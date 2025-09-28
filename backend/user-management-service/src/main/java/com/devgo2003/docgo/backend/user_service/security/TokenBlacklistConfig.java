package com.devgo2003.docgo.backend.user_service.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class TokenBlacklistConfig {

    @Value("${auth.blacklist.provider:memory}")
    private String blacklistProvider;

    @Autowired(required = false)
    private RedisTokenBlacklistService redisService;

    @Bean
    @Primary
    public TokenBlacklist tokenBlacklist() {
        // Try Redis first if configured and available
        if ("redis".equals(blacklistProvider) && redisService != null) {
            try {
                return redisService;
            } catch (Exception e) {
                // Fallback to memory if Redis fails
                System.out.println("Redis TokenBlacklist not available, falling back to memory: " + e.getMessage());
            }
        }
        
        // Default to memory implementation
        return new MemoryTokenBlacklistService();
    }
}
