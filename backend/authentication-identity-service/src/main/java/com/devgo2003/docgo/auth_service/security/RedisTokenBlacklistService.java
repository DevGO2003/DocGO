package com.devgo2003.docgo.auth_service.security;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
@ConditionalOnProperty(name = "auth.blacklist.provider", havingValue = "redis")
public class RedisTokenBlacklistService implements TokenBlacklist {

    private final StringRedisTemplate redisTemplate;

    public RedisTokenBlacklistService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void blacklist(String token, Instant expiry) {
        long ttlSeconds = Math.max(1, expiry.getEpochSecond() - Instant.now().getEpochSecond());
        redisTemplate.opsForValue().set(key(token), "1", Duration.ofSeconds(ttlSeconds));
    }

    @Override
    public boolean isBlacklisted(String token) {
        String val = redisTemplate.opsForValue().get(key(token));
        return val != null;
    }

    private String key(String token) {
        return "auth:blacklist:" + token;
    }
}


