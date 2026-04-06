package com.linksnap.service;
import com.linksnap.dto.*;
import com.linksnap.entity.User;
import com.linksnap.repository.UserRepository;
import com.linksnap.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) throw new RuntimeException("Email already in use");
        User user = userRepo.save(User.builder()
                .firstName(req.getFirstName()).lastName(req.getLastName())
                .email(req.getEmail()).password(encoder.encode(req.getPassword())).build());
        return new AuthResponse(jwtUtil.generateToken(user.getEmail()), user.getEmail(), user.getFirstName(), user.getLastName());
    }

    public AuthResponse login(AuthRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userRepo.findByEmail(req.getEmail()).orElseThrow();
        return new AuthResponse(jwtUtil.generateToken(user.getEmail()), user.getEmail(), user.getFirstName(), user.getLastName());
    }
}
