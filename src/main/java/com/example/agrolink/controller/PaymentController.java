package com.example.agrolink.controller;

import com.example.agrolink.entity.Order;
import com.example.agrolink.service.OrderService;
import com.example.agrolink.service.PaymentService;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;

    public PaymentController(PaymentService paymentService,
                             OrderService orderService) {
        this.paymentService = paymentService;
        this.orderService = orderService;
    }

    // 🔥 Create Stripe session
    @GetMapping("/checkout/{orderId}")
    public String checkout(@PathVariable Long orderId) {

        Order order = orderService.getOrderById(orderId);

        String url = paymentService.createCheckoutSession(order);

        return "redirect:" + url; // 🔥 redirect to Stripe
    }

    // ✅ Success
    @GetMapping("/success")
    public String success(@RequestParam Long orderId) {

        orderService.markAsPaid(orderId);

        return "payment-success";
    }

    // ❌ Cancel
    @GetMapping("/cancel")
    public String cancel() {
        return "payment-cancel";
    }
}