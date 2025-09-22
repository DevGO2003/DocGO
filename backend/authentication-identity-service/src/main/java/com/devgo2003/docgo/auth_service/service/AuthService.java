package com.devgo2003.docgo.auth_service.service;

import com.devgo2003.docgo.auth_service.entity.UserMongo;
import com.devgo2003.docgo.auth_service.model.AuthResponse;
import com.devgo2003.docgo.auth_service.repository.UserMongoRepository;
import com.devgo2003.docgo.auth_service.security.JwtUtil;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import io.jsonwebtoken.Claims;

@Service
public class AuthService {
    private final UserMongoRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final long accessTokenTtlSeconds;

    public AuthService(UserMongoRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.accessTokenTtlSeconds = jwtUtil.getAccessTokenTtlSeconds();
    }

    public AuthResponse register(String username, String email, String password) {
        // Check if username or email already exists
        if (userRepository.findByUsername(username).isPresent()) {
            return new AuthResponse(false, "Username already exists", null, null, null);
        }
        
        if (userRepository.findByEmail(email).isPresent()) {
            return new AuthResponse(false, "Email already exists", null, null, null);
        }

        UserMongo user = UserMongo.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .roleIds(Set.of("employee")) // Default role
                .status(com.devgo2003.docgo.auth_service.entity.UserStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        UserMongo savedUser = userRepository.save(user);
        
        AuthResponse.UserInfo userInfo = createUserInfo(savedUser);
        
        String accessToken = jwtUtil.generateAccessToken(savedUser.getUsername(), Map.of(
            "userId", savedUser.getId(),
            "roles", savedUser.getRoleIds(),
            "tokenVersion", "1"
        ));
        String refreshToken = jwtUtil.generateRefreshToken(savedUser.getUsername());
        return new AuthResponse(true, "User registered successfully", accessToken, refreshToken, userInfo, accessTokenTtlSeconds, "Bearer");
    }

    public AuthResponse login(String username, String password) {
        return userRepository.findByUsername(username)
                .map(user -> {
                    if (passwordEncoder.matches(password, user.getPassword())) {
                        // Update last login
                        user.setLastLogin(LocalDateTime.now());
                        user.setLoginAttempts(0);
                        userRepository.save(user);
                        
                        AuthResponse.UserInfo userInfo = createUserInfo(user);
                        String accessToken = jwtUtil.generateAccessToken(user.getUsername(), Map.of(
                            "userId", user.getId(),
                            "roles", user.getRoleIds(),
                            "tokenVersion", "1"
                        ));
                        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());
                        return new AuthResponse(true, "Login successful", accessToken, refreshToken, userInfo, accessTokenTtlSeconds, "Bearer");
                    } else {
                        // Increment failed login attempts
                        user.setLoginAttempts(user.getLoginAttempts() != null ? user.getLoginAttempts() + 1 : 1);
                        userRepository.save(user);
                        return new AuthResponse(false, "Invalid password", null, null, null);
                    }
                })
                .orElse(new AuthResponse(false, "User not found", null, null, null));
    }

    public AuthResponse refreshToken(String refreshToken) {
        try {
            Claims claims = jwtUtil.parseClaims(refreshToken);
            String username = claims.getSubject();
            
            return userRepository.findByUsername(username)
                    .map(user -> {
                        AuthResponse.UserInfo userInfo = createUserInfo(user);
                        String newAccessToken = jwtUtil.generateAccessToken(user.getUsername(), Map.of(
                            "userId", user.getId(),
                            "roles", user.getRoleIds(),
                            "tokenVersion", "1"
                        ));
                        return new AuthResponse(true, "Token refreshed successfully", newAccessToken, refreshToken, userInfo, accessTokenTtlSeconds, "Bearer");
                    })
                    .orElse(new AuthResponse(false, "User not found", null, null, null));
        } catch (Exception e) {
            return new AuthResponse(false, "Invalid refresh token", null, null, null);
        }
    }

    public boolean logout(String token) {
        try {
            // Validate token before logout
            jwtUtil.parseClaims(token);
            
            // TODO: Add token to blacklist when blacklist service is available
            // jwtUtil.addToBlacklist(token);
            
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean validateToken(String token) {
        try {
            jwtUtil.parseClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Optional<UserMongo> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<UserMongo> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    private AuthResponse.UserInfo createUserInfo(UserMongo user) {
        return new AuthResponse.UserInfo(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRoleIds(),
            user.getStatus()
        );
    }
}