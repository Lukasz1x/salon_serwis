package com.pz.salon_serwis.service;

import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public LocationUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User " + email + " doesn't exist."));
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        return org.springframework.security.core.userdetails.User.builder()
                .username(email)
                .password(user.getHashedPassword())
                .authorities(authorities)
                .disabled(!user.isActive())
                .build();
    }
}
