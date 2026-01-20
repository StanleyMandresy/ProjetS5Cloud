package com.example.route.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import com.example.route.service.CustomUserDetailsService;
import com.example.route.service.JwtService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(CustomUserDetailsService userDetailsService, JwtService jwtService, CorsConfigurationSource corsConfigurationSource) {
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    /* =========================
       CHAIN 1 : WEB / JSP
       ========================= */
    @Bean
    @Order(1)
    public SecurityFilterChain webSecurity(
            HttpSecurity http,
            HandlerMappingIntrospector introspector
    ) throws Exception {

        MvcRequestMatcher.Builder mvc = new MvcRequestMatcher.Builder(introspector);

        http
            .securityMatcher(
                new org.springframework.security.web.util.matcher.OrRequestMatcher(
                    mvc.pattern("/auth/**"),
                    mvc.pattern("/"),
                    mvc.pattern("/home"),
                    mvc.pattern("/css/**"),
                    mvc.pattern("/js/**"),
                    mvc.pattern("/images/**"),
                    // Swagger UI
                    mvc.pattern("/swagger-ui/**"),
                    mvc.pattern("/v3/api-docs/**"),
                    mvc.pattern("/swagger-ui.html")
                )
            )
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )
            .formLogin(form -> form
                .loginPage("/auth/login")
                .loginProcessingUrl("/auth/login")
                .defaultSuccessUrl("/auth/home", true)
                .failureUrl("/auth/login?error")
            )
            .logout(logout -> logout
                .logoutUrl("/auth/logout")
                .logoutSuccessUrl("/auth/login?logout")
            );

        return http.build();
    }

    /* =========================
       CHAIN 2 : API / JWT
       ========================= */
    @Bean
    @Order(2)
    public SecurityFilterChain apiSecurity(HttpSecurity http) throws Exception {

        http
            .securityMatcher(new AntPathRequestMatcher("/api/**"))
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(new AntPathRequestMatcher("/api/auth/**")).permitAll()
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(
                new JwtAuthenticationFilter(jwtService, userDetailsService),
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
    
    /* =========================
       CHAIN 3 : Swagger/OpenAPI (Public)
       ========================= */
    @Bean
    @Order(3)
    public SecurityFilterChain swaggerSecurity(HttpSecurity http) throws Exception {
        http
            .securityMatcher(
                new org.springframework.security.web.util.matcher.OrRequestMatcher(
                    new AntPathRequestMatcher("/v3/api-docs/**"),
                    new AntPathRequestMatcher("/swagger-ui/**"),
                    new AntPathRequestMatcher("/swagger-ui.html")
                )
            )
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );

        return http.build();
    }

    /* =========================
       AUTH PROVIDER
       ========================= */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
