package backend.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String userEmail;

  private double total;

  @OneToMany(cascade = CascadeType.ALL)
  private List<OrderItem> items;

  // ✅ ADD THESE FIELDS

  private String razorpayOrderId;

  private String razorpayPaymentId;

  private String paymentStatus; // CREATED / PAID / FAILED

  private LocalDateTime createdAt = LocalDateTime.now();
}