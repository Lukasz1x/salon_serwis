package com.pz.salon_serwis.service.impl;

import com.pz.salon_serwis.dto.UserRequest;
import com.pz.salon_serwis.model.Location;
import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.model.UserRole;
import com.pz.salon_serwis.repository.LocationRepository;
import com.pz.salon_serwis.repository.UserRepository;
import com.pz.salon_serwis.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, LocationRepository locationRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.locationRepository = locationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void register(UserRequest request) {
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new IllegalArgumentException("Error! User exists.");
        }
        User user = new User(
                request.getLastName(),
                request.getFirstName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                UserRole.CLIENT,
                null,
                LocalDateTime.now(),
                true,
                request.getPhone()
        );
        userRepository.save(user);
    }

    @Override
    public Optional<User> findById(int id) {
        return  userRepository.findById(id);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public void deleteById(int id) {
        Optional<User> user = userRepository.findById(id);
        if(user.isPresent()){
            user.get().setActive(false);
            userRepository.save(user.get());
        }
    }

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public User changeRole(int userId, String roleName) {
        Optional<User> user = userRepository.findById(userId);
        if(user.isPresent()){
            if(user.get().isActive()){
                user.get().setRole(UserRole.valueOf(roleName));
                return userRepository.save(user.get());
            }
        }
        return null;
    }

    @Override
    public User vestLocation(int userId, int locationId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Location> location = locationRepository.findById(locationId);
        if(user.isPresent() && location.isPresent()){
            if(user.get().isActive()){
                user.get().setLocation(location.get());
                return userRepository.save(user.get());
            }
        }
        return null;
    }
}
