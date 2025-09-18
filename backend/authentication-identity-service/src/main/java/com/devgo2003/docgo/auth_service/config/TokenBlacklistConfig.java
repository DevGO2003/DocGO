package com.devgo2003.docgo.auth_service.config;

import com.devgo2003.docgo.auth_service.security.TokenBlacklist;
import com.devgo2003.docgo.auth_service.security.RedisTokenBlacklistService;
import com.devgo2003.docgo.auth_service.security.MemoryTokenBlacklistService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TokenBlacklistConfig {

    @Value("${auth.blacklist.provider:memory}")
    private String blacklistProvider;

    @Bean
    @ConditionalOnProperty(name = "auth.blacklist.provider", havingValue = "redis")
    public TokenBlacklist redisTokenBlacklist(RedisTokenBlacklistService redisService) {
        return redisService;
    }

    @Bean
    @ConditionalOnProperty(name = "auth.blacklist.provider", havingValue = "memory", matchIfMissing = true)
    public TokenBlacklist memoryTokenBlacklist() {
        return new MemoryTokenBlacklistService();
    }
}

