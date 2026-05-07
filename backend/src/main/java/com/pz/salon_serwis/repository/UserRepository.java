package com.pz.salon_serwis.repository;

import com.pz.salon_serwis.model.User;
import com.pz.salon_serwis.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT u FROM User u WHERE u.email = ?1")
    Optional<User> findByEmail(String email);
    @Query("SELECT u FROM User u WHERE u.location.id = ?1 AND u.role = ?2 AND u.isActive = true")
    List<User> findAllByLocationIdAndRole(int locationId, UserRole role);
    void deleteById(int id);
}
