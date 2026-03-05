package com.linksnap.config;

import com.linksnap.entity.User;
import com.linksnap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("demo@linksnap.com")) {
            userRepository.save(User.builder()
                .email("demo@linksnap.com")
                .password(passwordEncoder.encode("demo1234"))
                .firstName("Demo")
                .lastName("User")
                .build());
            System.out.println("✅ Demo user created: demo@linksnap.com / demo1234");
        }
    }
}