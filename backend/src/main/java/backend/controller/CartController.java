package backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.entity.Cart;
import backend.service.CartService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CartController {

  private final CartService cartService;

  @GetMapping
  public Cart getCart() {
    return cartService.getCart();
  }

  @PostMapping("/add")
  public Cart addToCart(@RequestParam Long productId,
      @RequestParam int quantity) {
    return cartService.addToCart(productId, quantity);
  }
}