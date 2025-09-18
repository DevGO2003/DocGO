package com.devgo2003.docgo.auth_service.security;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MemoryTokenBlacklistService implements TokenBlacklist {

    private final ConcurrentHashMap<String, Instant> blacklistedTokens = new ConcurrentHashMap<>();

    @Override
    public void blacklist(String token, Instant expiry) {
        blacklistedTokens.put(token, expiry);
    }

    @Override
    public boolean isBlacklisted(String token) {
        Instant expiry = blacklistedTokens.get(token);
        if (expiry == null) {
            return false;
        }
        
        // Remove expired tokens
        if (expiry.isBefore(Instant.now())) {
            blacklistedTokens.remove(token);
            return false;
        }
        
        return true;
    }
}

