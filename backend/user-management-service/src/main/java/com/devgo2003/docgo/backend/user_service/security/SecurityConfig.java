package com.devgo2003.docgo.backend.user_service.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetailsService;
import com.devgo2003.docgo.backend.user_service.repository.UserRepository;
import com.devgo2003.docgo.backend.user_service.security.JwtUtil;
import com.devgo2003.docgo.backend.user_service.security.TokenBlacklist;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final TokenBlacklist tokenBlacklistService;
    private final UserRepository userRepository;

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    public SecurityConfig(UserRepository userRepository, JwtUtil jwtUtil, TokenBlacklist tokenBlacklistService) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Bean
    @Primary
    public UserDetailsService userDetailsService() {
        return new CustomUserDetailsService(userRepository);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        JwtAuthenticationFilter jwtFilter = new JwtAuthenticationFilter(jwtUtil, tokenBlacklistService, userRepository);
        
        // Build the list of permitted paths
        final String[] permittedPaths;
        if (googleClientId != null && !googleClientId.trim().isEmpty()) {
            permittedPaths = new String[]{
                "/",
                "/docs",
                "/swagger-ui.html",
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/api/v1/user-management-service/auth/login",
                "/api/v1/user-management-service/auth/register",
                "/api/v1/user-management-service/auth/refresh",
                "/api/v1/user-management-service/auth/logout",
                "/api/v1/user-management-service/auth/health",
                "/api/v1/user-management-service/auth/oauth2/test",
                "/api/v1/user-management-service/oauth2/**",
                "/oauth2/**",
                "/login/oauth2/**",
                // Permit duplicated paths that include the extra /v1/ segment used by AuthController
                "/api/v1/user-management-service/v1/auth/login",
                "/api/v1/user-management-service/v1/auth/register",
                "/api/v1/user-management-service/v1/auth/refresh",
                "/api/v1/user-management-service/v1/auth/logout",
                "/api/v1/user-management-service/v1/auth/health",
                "/api/v1/user-management-service/v1/auth/oauth2/test"
            };
        } else {
            permittedPaths = new String[]{
                "/",
                "/docs",
                "/swagger-ui.html",
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/api/v1/user-management-service/v1/health",
                "/api/v1/user-management-service/auth/login",
                "/api/v1/user-management-service/auth/register",
                "/api/v1/user-management-service/auth/refresh",
                "/api/v1/user-management-service/auth/logout",
                "/api/v1/user-management-service/auth/health",
                "/api/v1/user-management-service/auth/oauth2/test",
                "/api/v1/user-management-service/oauth2/**",
                // Permit duplicated paths that include the extra /v1/ segment used by AuthController
                "/api/v1/user-management-service/v1/auth/login",
                "/api/v1/user-management-service/v1/auth/register",
                "/api/v1/user-management-service/v1/auth/refresh",
                "/api/v1/user-management-service/v1/auth/logout",
                "/api/v1/user-management-service/v1/auth/health",
                "/api/v1/user-management-service/v1/auth/oauth2/test"
            };
        }
        
        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(permittedPaths).permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        // Enable OAuth2 configuration if Google client is configured
        if (googleClientId != null && !googleClientId.trim().isEmpty()) {
            OAuth2LoginSuccessHandler successHandler = new OAuth2LoginSuccessHandler(userRepository, jwtUtil);
            http.oauth2Login(oauth2 -> oauth2
                .successHandler(successHandler)
                .failureHandler((request, response, exception) -> {
                    response.sendRedirect("http://localhost:3000/auth/login?error=oauth_failed");
                })
            );
        }

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow specific origins for production, wildcard for development
        String corsOrigin = System.getenv().getOrDefault("CORS_ORIGIN", "*");
        if ("*".equals(corsOrigin)) {
            configuration.addAllowedOriginPattern("*");
        } else {
            configuration.addAllowedOrigin(corsOrigin);
        }
        
        // Allow common HTTP methods
        configuration.addAllowedMethod("GET");
        configuration.addAllowedMethod("POST");
        configuration.addAllowedMethod("PUT");
        configuration.addAllowedMethod("DELETE");
        configuration.addAllowedMethod("OPTIONS");
        configuration.addAllowedMethod("PATCH");
        
        // Allow all headers
        configuration.addAllowedHeader("*");
        
        // Allow credentials for OAuth2
        configuration.setAllowCredentials(true);
        
        // Cache preflight response for 1 hour
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
