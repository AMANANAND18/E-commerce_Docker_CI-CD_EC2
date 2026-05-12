package backend.controller;

import backend.dto.*;
import backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/auth", ""})
@RequiredArgsConstructor
@CrossOrigin("*")
public class Authcontroller {

    private static final Logger logger = LoggerFactory.getLogger(Authcontroller.class);
    private final AuthService authService;

    @GetMapping("/")
    public String home() {
        logger.info("Home endpoint reached.");
        return "Backend is running smoothly.";
    }

    @GetMapping("/register")
    public String registerInfo() {
        return "Use POST /register with JSON body {name, email, password}.";
    }

    @GetMapping("/login")
    public String loginInfo() {
        return "Use POST /login with JSON body {email, password}.";
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        logger.info("Register endpoint hit for email: {}", request.getEmail());
        return authService.register(request);

    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        logger.info("Login endpoint hit for email: {}", request.getEmail());
        return authService.login(request);
    }
}