package com.devgo2003.docgo.auth_service.security;

import java.time.Instant;

public interface TokenBlacklist {
    void blacklist(String token, Instant expiry);
    boolean isBlacklisted(String token);
}


