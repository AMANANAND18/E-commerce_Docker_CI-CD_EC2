package backend.controller;

import backend.entity.Order;
import backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OrderController {

  private final OrderService orderService;

  @PostMapping("/place")
  public Order placeOrder() {
    return orderService.placeOrder();
  }

  @GetMapping
  public List<Order> myOrders() {
    return orderService.getMyOrders();
  }
}