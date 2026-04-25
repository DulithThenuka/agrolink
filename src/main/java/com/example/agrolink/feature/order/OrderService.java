package com.example.agrolink.feature.order;

import com.example.agrolink.dto.OrderDTO;
import java.util.List;
public interface OrderService {

    void placeOrder(String buyerEmail, Long cropId, Integer quantity);

    List<OrderDTO> getUserOrders(String email);
}  

