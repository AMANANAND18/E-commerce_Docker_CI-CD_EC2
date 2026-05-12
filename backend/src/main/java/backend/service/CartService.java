package backend.service;

import java.util.ArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import backend.entity.Cart;
import backend.entity.CartItem;
import backend.entity.Product;
import backend.repository.CartRepository;
import backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

  private final CartRepository cartRepository;
  private final ProductRepository productRepository;

  private String getCurrentUser() {
    return (String) SecurityContextHolder.getContext()
        .getAuthentication().getPrincipal();
  }

  public Cart getCart() {

    String email = getCurrentUser();

    return cartRepository.findByUserEmail(email)
        .orElseGet(() -> {
          Cart cart = new Cart();
          cart.setUserEmail(email);
          return cartRepository.save(cart);
        });
  }

  public Cart addToCart(Long productId, int quantity) {

    Cart cart = getCart();

    Product product = productRepository.findById(productId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

    if (cart.getItems() == null) {
      cart.setItems(new ArrayList<>());
    }

    CartItem item = new CartItem();
    item.setProduct(product);
    item.setQuantity(quantity);
    item.setCart(cart);

    cart.getItems().add(item);

    return cartRepository.save(cart);
  }

  
}