package com.devgo2003.docgo.auth_service.security;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService implements TokenBlacklist {

    private final Map<String, Instant> tokenToExpiry = new ConcurrentHashMap<>();

    @Override
    public void blacklist(String token, Instant expiry) {
        tokenToExpiry.put(token, expiry);
    }

    @Override
    public boolean isBlacklisted(String token) {
        Instant expiry = tokenToExpiry.get(token);
        if (expiry == null) {
            return false;
        }
        if (Instant.now().isAfter(expiry)) {
            tokenToExpiry.remove(token);
            return false;
        }
        return true;
    }
}


