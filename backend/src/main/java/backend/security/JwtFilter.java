package backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component; // IMPORTANT
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component // 🔥 THIS IS THE MAIN FIX
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

  private final JwtUtil jwtUtil;

  @Override
  protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain)
      throws ServletException, IOException {

    String authHeader = request.getHeader("Authorization");

    try {
      if (authHeader != null && authHeader.startsWith("Bearer ")) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(email, null, null);

        SecurityContextHolder.getContext().setAuthentication(auth);
      }
    } catch (Exception e) {
      // ignore invalid token
    }

    filterChain.doFilter(request, response);
  }
}