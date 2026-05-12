package backend.service;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.razorpay.RazorpayClient;

import backend.entity.Cart;
import backend.entity.CartItem;
import backend.entity.Order;
import backend.entity.OrderItem;
import backend.repository.CartRepository;
import backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

  private final CartRepository cartRepository;
  private final OrderRepository orderRepository;

  private String getUser() {
    return (String) SecurityContextHolder.getContext()
        .getAuthentication().getPrincipal();
  }

  public Order createOrder() {

    String email = getUser();

    Cart cart = cartRepository.findByUserEmail(email)
        .orElseThrow();

    List<OrderItem> orderItems = new ArrayList<>();
    double total = 0;

    for (CartItem item : cart.getItems()) {

        OrderItem oi = new OrderItem();
        oi.setProductName(item.getProduct().getName());
        oi.setQuantity(item.getQuantity());
        oi.setPrice(item.getProduct().getPrice());

        total += item.getQuantity() * item.getProduct().getPrice();
        orderItems.add(oi);
    }

    Order order = new Order();
    order.setUserEmail(email);
    order.setItems(orderItems);
    order.setTotal(total);

    // ✅ IMPORTANT
    order.setPaymentStatus("CREATED");

    return orderRepository.save(order);
}

  public void markOrderAsPaid(String razorpayOrderId, String paymentId) {

    Order order = orderRepository
        .findByRazorpayOrderId(razorpayOrderId)
        .orElseThrow(() -> new RuntimeException("Order not found"));

    order.setRazorpayPaymentId(paymentId);
    order.setPaymentStatus("PAID");

    orderRepository.save(order);

    // ✅ NOW clear cart
    Cart cart = cartRepository.findByUserEmail(order.getUserEmail())
        .orElseThrow();

    cart.getItems().clear();
    cartRepository.save(cart);
}

  public Order placeOrder() {
    return createOrder();
  }

  public List<Order> getMyOrders() {
    String email = getUser();
    return orderRepository.findByUserEmail(email);
  }

  public Order createOrderWithPayment(RazorpayClient client) throws Exception {

    Order order = createOrder();

    JSONObject options = new JSONObject();
    options.put("amount", (int)(order.getTotal() * 100));
    options.put("currency", "INR");

    com.razorpay.Order razorpayOrder = client.orders.create(options);

    order.setRazorpayOrderId(razorpayOrder.get("id"));
    orderRepository.save(order);

    return order;
}

  public void saveOrder(Order order) {
    orderRepository.save(order);
  }

  public void clearCart() {
    String email = getUser();
    Cart cart = cartRepository.findByUserEmail(email)
        .orElseThrow(() -> new RuntimeException("Cart not found"));
    
    cart.getItems().clear();
    cartRepository.save(cart);
  }
}