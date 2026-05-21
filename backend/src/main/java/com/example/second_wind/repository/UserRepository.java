package com.example.second_wind.repository;

import com.example.second_wind.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Crucial lookup function for when we hook up authentication tokens or session contexts later
    Optional<User> findByEmail(String email);
}