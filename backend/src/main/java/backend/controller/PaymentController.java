package backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import backend.service.OrderService;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;

    @Value("${razorpay.key}")
    private String key;

    @Value("${razorpay.secret}")
    private String secret;

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder() throws Exception {

        RazorpayClient client = new RazorpayClient(key, secret);
        backend.entity.Order order = orderService.createOrderWithPayment(client);

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("id", order.getRazorpayOrderId());
        responseBody.put("amount", (int) (order.getTotal() * 100));
        responseBody.put("currency", "INR");
        responseBody.put("key", key);

        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {

    try {
        String orderId = data.get("razorpay_order_id");
        String paymentId = data.get("razorpay_payment_id");
        String signature = data.get("razorpay_signature");

        String payload = orderId + "|" + paymentId;

        boolean isValid = Utils.verifySignature(payload, signature, secret);

        if (!isValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid payment signature");
        }

        orderService.markOrderAsPaid(orderId, paymentId);

        return ResponseEntity.ok("Payment verified & order saved");

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Verification failed");
    }
}

    @PostMapping("/demo-payment")
    public ResponseEntity<?> demoPayment() {
        try {
            // Create order
            backend.entity.Order order = orderService.createOrder();

            // Simulate successful payment with mock details
            String mockOrderId = "order_demo_" + System.currentTimeMillis();
            String mockPaymentId = "pay_demo_" + System.currentTimeMillis();

            // Update the order with mock payment details and save
            order.setRazorpayOrderId(mockOrderId);
            order.setRazorpayPaymentId(mockPaymentId);
            order.setPaymentStatus("PAID");
            
            // Save updated order with payment details
            orderService.saveOrder(order);
            
            // Clear cart
            orderService.clearCart();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Demo payment successful! Order marked as paid.");
            response.put("orderId", mockOrderId);
            response.put("paymentId", mockPaymentId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Demo payment failed: " + e.getMessage());
        }
    }
}