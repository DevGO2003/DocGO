package com.devgo2003.docgo.auth_service.security;

import com.devgo2003.docgo.auth_service.entity.UserMongo;
import com.devgo2003.docgo.auth_service.entity.UserStatus;
import com.devgo2003.docgo.auth_service.repository.UserMongoRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.util.Map;
import java.util.UUID;

public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2LoginSuccessHandler.class);
    
    private final UserMongoRepository userRepository;
    private final JwtUtil jwtUtil;

    public OAuth2LoginSuccessHandler(UserMongoRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String requestId = UUID.randomUUID().toString();
        logger.info("[{}] OAuth2 authentication success started", requestId);
        
        try {
            // Validate authentication object
            if (authentication == null || authentication.getPrincipal() == null) {
                logger.error("[{}] Authentication or principal is null", requestId);
                redirectToError(response, "authentication_null", requestId);
                return;
            }

            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = oAuth2User.getAttributes();
            
            if (attributes == null || attributes.isEmpty()) {
                logger.error("[{}] OAuth2 user attributes are null or empty", requestId);
                redirectToError(response, "attributes_empty", requestId);
                return;
            }

            // Extract identifiers with OIDC compatibility (prefer 'sub')
            String subject = extractStringAttribute(attributes, "sub", requestId);
            String email = extractStringAttribute(attributes, "email", requestId);
            String name = extractStringAttribute(attributes, "name", requestId);
            String googleId = extractStringAttribute(attributes, "id", requestId);

            // Determine username: prefer email, then subject/id, then name
            String username = null;
            if (email != null && !email.trim().isEmpty()) {
                username = email;
            } else if (subject != null && !subject.trim().isEmpty()) {
                username = subject;
            } else if (googleId != null && !googleId.trim().isEmpty()) {
                username = googleId;
            } else if (name != null && !name.trim().isEmpty()) {
                username = name;
            }

            if (username == null || username.trim().isEmpty()) {
                logger.error("[{}] Username cannot be determined from OAuth2 attributes", requestId);
                redirectToError(response, "username_required", requestId);
                return;
            }

            logger.info("[{}] OAuth2 User Info - Email: {}, Name: {}, Sub: {}, Id: {}, Username: {}", 
                       requestId, email, name, subject, googleId, username);
            logger.debug("[{}] OAuth2 All attributes: {}", requestId, attributes);

            // Find or create user with error handling
            UserMongo user = findOrCreateUser(username, email, requestId);
            if (user == null) {
                logger.error("[{}] Failed to find or create user: {}", requestId, username);
                redirectToError(response, "user_creation_failed", requestId);
                return;
            }

            // Generate JWT tokens with error handling
            String accessToken = generateAccessToken(user, requestId);
            String refreshToken = generateRefreshToken(user, requestId);

            if (accessToken == null || refreshToken == null) {
                logger.error("[{}] Failed to generate tokens for user: {}", requestId, username);
                redirectToError(response, "token_generation_failed", requestId);
                return;
            }

            logger.info("[{}] Successfully generated tokens for user: {}", requestId, username);
            logger.debug("[{}] Access token preview: {}...", requestId, accessToken.substring(0, Math.min(20, accessToken.length())));

            // Redirect to frontend with tokens
            String frontendUrl = buildRedirectUrl(accessToken, refreshToken, username, requestId);
            logger.info("[{}] Redirecting to frontend: {}", requestId, frontendUrl);
            
            response.sendRedirect(frontendUrl);
            
        } catch (Exception e) {
            logger.error("[{}] OAuth2 success handler error: {}", requestId, e.getMessage(), e);
            redirectToError(response, "oauth_error", requestId);
        }
    }

    private String extractStringAttribute(Map<String, Object> attributes, String key, String requestId) {
        try {
            Object value = attributes.get(key);
            if (value == null) {
                logger.warn("[{}] Attribute '{}' is null", requestId, key);
                return "";
            }
            return value.toString();
        } catch (Exception e) {
            logger.warn("[{}] Error extracting attribute '{}': {}", requestId, key, e.getMessage());
            return "";
        }
    }

    private String determineUsername(String email, String name, String requestId) {
        if (email != null && !email.trim().isEmpty()) {
            logger.debug("[{}] Using email as username: {}", requestId, email);
            return email;
        } else if (name != null && !name.trim().isEmpty()) {
            logger.debug("[{}] Using name as username: {}", requestId, name);
            return name;
        } else {
            logger.warn("[{}] Both email and name are empty, cannot determine username", requestId);
            return null;
        }
    }

    private UserMongo findOrCreateUser(String username, String email, String requestId) {
        try {
            return userRepository.findByUsername(username)
                    .orElseGet(() -> {
                        logger.info("[{}] Creating new OAuth2 user: {}", requestId, username);
                        try {
                            UserMongo newUser = UserMongo.builder()
                                    .username(username)
                                    .email(email)
                                    .password("") // OAuth2 users don't need password
                                    .status(UserStatus.ACTIVE)
                                    .build();
                            UserMongo savedUser = userRepository.save(newUser);
                            logger.info("[{}] Successfully created new OAuth2 user: {}", requestId, username);
                            return savedUser;
                        } catch (Exception e) {
                            logger.error("[{}] Failed to create new OAuth2 user: {}", requestId, e.getMessage(), e);
                            return null;
                        }
                    });
        } catch (Exception e) {
            logger.error("[{}] Error finding/creating user: {}", requestId, e.getMessage(), e);
            return null;
        }
    }

    private String generateAccessToken(UserMongo user, String requestId) {
        try {
            return jwtUtil.generateAccessToken(user.getUsername(), Map.of(
                    "userId", user.getId(),
                    "role", "USER"
            ));
        } catch (Exception e) {
            logger.error("[{}] Error generating access token: {}", requestId, e.getMessage(), e);
            return null;
        }
    }

    private String generateRefreshToken(UserMongo user, String requestId) {
        try {
            return jwtUtil.generateRefreshToken(user.getUsername());
        } catch (Exception e) {
            logger.error("[{}] Error generating refresh token: {}", requestId, e.getMessage(), e);
            return null;
        }
    }

    private String buildRedirectUrl(String accessToken, String refreshToken, String username, String requestId) {
        try {
            String frontendUrl = System.getenv().getOrDefault("FRONTEND_URL", "http://localhost:3000");
            return frontendUrl + "/auth/oauth2/callback" +
                    "?token=" + java.net.URLEncoder.encode(accessToken, StandardCharsets.UTF_8) +
                    "&refreshToken=" + java.net.URLEncoder.encode(refreshToken, StandardCharsets.UTF_8) +
                    "&success=true" +
                    "&username=" + java.net.URLEncoder.encode(username, StandardCharsets.UTF_8) +
                    "&requestId=" + requestId;
        } catch (Exception e) {
            logger.error("[{}] Error building redirect URL: {}", requestId, e.getMessage(), e);
            return System.getenv().getOrDefault("FRONTEND_URL", "http://localhost:3000") + "/auth/login?error=url_build_failed";
        }
    }

    private void redirectToError(HttpServletResponse response, String errorCode, String requestId) {
        try {
            String frontendUrl = System.getenv().getOrDefault("FRONTEND_URL", "http://localhost:3000") + 
                    "/auth/login?error=" + errorCode + "&requestId=" + requestId;
            logger.info("[{}] Redirecting to error page: {}", requestId, frontendUrl);
            response.sendRedirect(frontendUrl);
        } catch (Exception e) {
            logger.error("[{}] Failed to redirect to error page: {}", requestId, e.getMessage(), e);
        }
    }
}


