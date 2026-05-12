package backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cart {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String userEmail;

  @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL)
  @JsonManagedReference
  private List<CartItem> items = new ArrayList<>();
}