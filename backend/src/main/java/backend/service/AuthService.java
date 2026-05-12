package backend.service;

import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;
import java.util.Set;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import backend.dto.AuthRequest;
import backend.dto.AuthResponse;
import backend.dto.RegisterRequest;
import backend.entity.Role;
import backend.entity.RoleName;
import backend.entity.User;
import backend.repository.RoleRepository;
import backend.repository.UserRepository;
import backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

  private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final JwtUtil jwtUtil;

  public AuthResponse register(RegisterRequest request) {
    logger.info("AuthService.register started for email: {}", request.getEmail());
    logger.info("Fetching role {} from RoleRepository", RoleName.ROLE_USER);

    Role role = roleRepository.findByName(RoleName.ROLE_USER)
        .orElseGet(() -> {
          logger.warn("Role {} not found. Creating default role.", RoleName.ROLE_USER);
          return roleRepository.save(Role.builder().name(RoleName.ROLE_USER).build());
        });

    User user = new User();
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPassword(hashPassword(request.getPassword()));
    user.setRoles(Set.of(role));
    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
    throw new RuntimeException("User already exists");
}

    logger.info("Saving user in UserRepository for email: {}", user.getEmail());
    userRepository.save(user);

    String token = jwtUtil.generateToken(user.getEmail());
    logger.info("AuthService.register completed for email: {}", user.getEmail());
    return new AuthResponse(token);
  }

  public AuthResponse login(AuthRequest request) {
    logger.info("AuthService.login started for email: {}", request.getEmail());
    logger.info("Checking user by email in UserRepository");

    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new RuntimeException("User not found"));

    if (!verifyPassword(request.getPassword(), user.getPassword())) {
      throw new RuntimeException("Invalid credentials");
    }

    String token = jwtUtil.generateToken(user.getEmail());
    logger.info("AuthService.login completed for email: {}", user.getEmail());
    return new AuthResponse(token);
  }

  private String hashPassword(String rawPassword) {
    byte[] salt = new byte[16];
    new SecureRandom().nextBytes(salt);
    byte[] hash = pbkdf2(rawPassword.toCharArray(), salt);
    return Base64.getEncoder().encodeToString(salt) + ":" + Base64.getEncoder().encodeToString(hash);
  }

  private boolean verifyPassword(String rawPassword, String storedPassword) {
    String[] parts = storedPassword.split(":");
    if (parts.length != 2) {
      return false;
    }

    byte[] salt = Base64.getDecoder().decode(parts[0].getBytes(StandardCharsets.UTF_8));
    byte[] expectedHash = Base64.getDecoder().decode(parts[1].getBytes(StandardCharsets.UTF_8));
    byte[] actualHash = pbkdf2(rawPassword.toCharArray(), salt);

    return java.security.MessageDigest.isEqual(expectedHash, actualHash);
  }

  private byte[] pbkdf2(char[] password, byte[] salt) {
    try {
      PBEKeySpec spec = new PBEKeySpec(password, salt, 65536, 256);
      SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
      return factory.generateSecret(spec).getEncoded();
    } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
      throw new IllegalStateException("Password hashing failed", e);
    }
  }
}