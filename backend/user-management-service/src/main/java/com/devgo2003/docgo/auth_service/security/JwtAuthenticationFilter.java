package com.devgo2003.docgo.auth_service.security;

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
import com.devgo2003.docgo.auth_service.repository.UserMongoRepository;

import java.io.IOException;
import java.util.Collections;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final TokenBlacklist blacklistService;
    private final UserMongoRepository userRepository;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, TokenBlacklist blacklistService, UserMongoRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.blacklistService = blacklistService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (blacklistService.isBlacklisted(token)) {
                filterChain.doFilter(request, response);
                return;
            }
            try {
                Claims claims = jwtUtil.parseClaims(token);
                String username = claims.getSubject();
                Integer tokenVersion = claims.get("tokenVersion", Integer.class);
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
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
                }
            } catch (Exception ignored) {
            }
        }
        filterChain.doFilter(request, response);
    }
}


