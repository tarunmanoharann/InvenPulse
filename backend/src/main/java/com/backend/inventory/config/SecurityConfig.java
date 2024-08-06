package com.backend.inventory.config;


import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.HEAD;
import static org.springframework.http.HttpMethod.OPTIONS;
import static org.springframework.http.HttpMethod.PATCH;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final UserDetailsService userDetailsService;
        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final LogoutHandler logoutHandler;

        private static final String[] PublicEndPoints = {
                        "/api/auth/**",
                        "/api/web/sites",
                        "/swagger-ui/**",
                        "/swagger-ui.html/**",
                        "/api/admin/default",
                        "/v3/api-docs/**"
        };

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
                return httpSecurity
                                .csrf(AbstractHttpConfigurer::disable)
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .authorizeHttpRequests(
                                                authorize -> authorize.requestMatchers(PublicEndPoints).permitAll()
                                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                                .userDetailsService(userDetailsService)
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                                .logout(logout -> logout.logoutUrl("/api/auth/logout")
                                                .addLogoutHandler(logoutHandler)
                                                .logoutSuccessHandler((request, response,
                                                                authentication) -> SecurityContextHolder
                                                                                .clearContext()))
                                .build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration corsConfiguration = new CorsConfiguration();
                // Note : Replace with server url/ip in production
                corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
                corsConfiguration.setAllowedHeaders(Arrays.asList(AUTHORIZATION, CONTENT_TYPE));
                corsConfiguration.setAllowedMethods(Arrays.asList(GET.name(), POST.name(), PUT.name(), PATCH.name(),
                                DELETE.name(), HEAD.name(), OPTIONS.name()));
                corsConfiguration.setAllowCredentials(true);
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", corsConfiguration);
                return source;
        }
}