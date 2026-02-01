package com.pz.salon_serwis.service;

import com.pz.salon_serwis.dto.UserRequest;
import com.pz.salon_serwis.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    void register(UserRequest request);
    Optional<User> findById(int id);
    Optional<User> findByEmail(String email);
    void deleteById(int id);
    List<User> getUsers();
    User changeRole(int userId, String roleName);
    User vestLocation(int userId, int locationId);
}
