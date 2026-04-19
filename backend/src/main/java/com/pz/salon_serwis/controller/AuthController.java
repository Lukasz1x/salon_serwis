package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.dto.LoginRequest;
import com.pz.salon_serwis.dto.LoginResponse;
import com.pz.salon_serwis.dto.UserRequest;
import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.security.JwtUtil;
import com.pz.salon_serwis.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest){
        Optional<User> user = userService.findByEmail(loginRequest.getEmail());
        if(user.isPresent()){
            if(user.get().isActive()){
                Authentication auth;
                try {
                    auth = authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
                    );
                } catch (BadCredentialsException e){
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                }
                UserDetails userDetails = (UserDetails) auth.getPrincipal();
                String token = jwtUtil.generateToken(userDetails);
                LoginResponse responseBody = new LoginResponse(token);
                return ResponseEntity.ok(responseBody);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRequest request) {
        try {
            userService.register(request);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body("Registered successfully");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity
                    .badRequest()
                    .body(ex.getMessage());
        }
    }
}
