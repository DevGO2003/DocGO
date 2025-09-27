package com.devgo2003.docgo.user_service.security;


import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

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

