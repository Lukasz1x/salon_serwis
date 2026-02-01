package com.pz.salon_serwis.controller;

import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getUsersStatistics(@AuthenticationPrincipal UserDetails userDetails){
        String email = userDetails.getUsername();
        Optional<User> user = userService.findByEmail(email);
        List<User> users = null;
        if(user.isPresent()){
            if(user.get().getRole().name().equals("ADMIN")){
                users = userService.getUsers();
            }else{
                users = List.of(user.get());
            }
        }
        if(users != null){
            return ResponseEntity.ok(users);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/changeRole={roleName}&userId={userId}")
    public ResponseEntity<?> changeUserRole(@PathVariable String roleName, @PathVariable int userId){
        User user = userService.changeRole(userId, roleName);
        if(user != null){
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/vestLocation={locationId}&userId={userId}")
    public ResponseEntity<?> vestLocation(@PathVariable int locationId, @PathVariable int userId){
        User user = userService.vestLocation(userId, locationId);
        if(user != null){
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id){
        Optional<User> user = userService.findById(id);
        if(user.isPresent()){
            if(user.get().isActive()){
                userService.deleteById(id);
                return ResponseEntity.ok().build();
            }
        }
        return ResponseEntity.notFound().build();
    }
}
