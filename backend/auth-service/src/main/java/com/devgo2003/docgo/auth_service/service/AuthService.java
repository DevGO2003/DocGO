package com.devgo2003.docgo.auth_service.service;

import com.devgo2003.docgo.auth_service.entity.User;
import com.devgo2003.docgo.auth_service.entity.Role;
import com.devgo2003.docgo.auth_service.model.AuthResponse;
import com.devgo2003.docgo.auth_service.repository.UserRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(String username, String email, String password) {
        // Check if username or email already exists
        if (userRepository.findByUsername(username).isPresent()) {
            return new AuthResponse(false, "Username already exists", null, null);
        }
        
        if (userRepository.findByEmail(email).isPresent()) {
            return new AuthResponse(false, "Email already exists", null, null);
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .role(Role.USER)
                .createdAt(LocalDateTime.now())
                .build();
        
        User savedUser = userRepository.save(user);
        
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
            savedUser.getUserId(),
            savedUser.getUsername(),
            savedUser.getEmail(),
            savedUser.getRole().name()
        );
        
        return new AuthResponse(true, "User registered successfully", null, userInfo);
    }

    public AuthResponse login(String username, String password) {
        return userRepository.findByUsername(username)
                .map(user -> {
                    if (passwordEncoder.matches(password, user.getPasswordHash())) {
                        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                            user.getUserId(),
                            user.getUsername(),
                            user.getEmail(),
                            user.getRole().name()
                        );
                        return new AuthResponse(true, "Login successful", null, userInfo);
                    } else {
                        return new AuthResponse(false, "Invalid password", null, null);
                    }
                })
                .orElse(new AuthResponse(false, "User not found", null, null));
    }
}
