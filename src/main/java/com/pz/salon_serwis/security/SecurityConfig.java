package com.pz.salon_serwis.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthFilter jwtAuthFilter,
            AuthenticationProvider authProvider
    ) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "api/location/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/vehicles/**").hasRole("SALES_REP")
                        .requestMatchers(HttpMethod.PUT, "/api/vehicles/**").hasRole("SALES_REP")
                        .requestMatchers(HttpMethod.DELETE, "/api/vehicles/**").hasRole("SALES_REP")
                        .requestMatchers(HttpMethod.POST, "/api/salonAppointments/arrange").hasRole("CLIENT")
                        .requestMatchers(HttpMethod.PUT, "/api/salonAppointments/**").hasRole("SALES_REP")
                        .requestMatchers("/api/salonReport/**").hasRole("SALES_REP")
                        .requestMatchers(HttpMethod.POST, "/api/serviceAppointments/arrange").hasRole("CLIENT")
                        .requestMatchers(HttpMethod.PUT, "/api/serviceAppointments/**").hasRole("MECHANIC")
                        .requestMatchers("/api/serviceReport/**").hasRole("MECHANIC")
                        .requestMatchers(HttpMethod.POST, "/api/salesOrder/**").hasRole("SALES_REP")
                        .requestMatchers("/api/repairOrder/**").hasRole("MECHANIC")
                        .requestMatchers(HttpMethod.POST, "/api/invoice/generateSale").hasRole("SALES_REP")
                        .requestMatchers(HttpMethod.POST, "/api/invoice/generateRepair").hasRole("MECHANIC")
                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder
    ){
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
