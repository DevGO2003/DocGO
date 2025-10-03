package com.devgo2003.docgo.backend.user_service.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import com.devgo2003.docgo.backend.user_service.repository.UserRepository;

import java.io.IOException;
import java.util.Collections;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final TokenBlacklist blacklistService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, TokenBlacklist blacklistService, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.blacklistService = blacklistService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        log.info("[JWT Filter] Processing request: {} {}", request.getMethod(), request.getRequestURI());
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            log.debug("[JWT Filter] Found Bearer token, length: {}", token.length());
            
            if (blacklistService.isBlacklisted(token)) {
                log.debug("[JWT Filter] Token is blacklisted, skipping authentication");
                filterChain.doFilter(request, response);
                return;
            }
            
            try {
                log.debug("[JWT Filter] Parsing JWT token...");
                Claims claims = jwtUtil.parseClaims(token);
                String username = claims.getSubject();
                Integer tokenVersion = claims.get("tokenVersion", Integer.class);
                
                log.debug("[JWT Filter] Parsed claims - username: {}, tokenVersion: {}", username, tokenVersion);
                
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    log.debug("[JWT Filter] Setting authentication for user: {}", username);
                    
                    // Skip token version check for now (UserMongo doesn't have tokenVersion field)
                    // TODO: Add tokenVersion field to UserMongo if needed
                    UserDetails userDetails = User.withUsername(username)
                            .password("")
                            .authorities(Collections.emptyList())
                            .build();
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    
                    log.debug("[JWT Filter] Authentication set successfully for user: {}", username);
                } else {
                    log.debug("[JWT Filter] Username is null or authentication already exists");
                }
            } catch (Exception e) {
                log.error("[JWT Filter] Error parsing JWT token: {}", e.getMessage());
                log.debug("[JWT Filter] Token parsing failed", e);
            }
        } else {
            log.debug("[JWT Filter] No Bearer token found in Authorization header");
        }
        
        filterChain.doFilter(request, response);
    }
}


