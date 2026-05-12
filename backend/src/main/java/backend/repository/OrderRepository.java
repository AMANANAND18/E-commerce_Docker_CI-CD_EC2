package backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
  List<Order> findByUserEmail(String email);
  Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
}