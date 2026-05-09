package com.example.agrolink.service;

import java.math.BigDecimal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.agrolink.dto.OrderDTO;
import com.example.agrolink.entity.Crop;
import com.example.agrolink.entity.Order;
import com.example.agrolink.entity.OrderStatus;
import com.example.agrolink.entity.User;
import com.example.agrolink.mapper.OrderMapper;
import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.OrderRepository;
import com.example.agrolink.repository.UserRepository;

@Service
@Transactional
public class OrderService {

    private static final Logger logger =
            LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final CropRepository cropRepository;
    private final UserRepository userRepository;

    public OrderService(
            OrderRepository orderRepository,
            CropRepository cropRepository,
            UserRepository userRepository) {

        this.orderRepository = orderRepository;
        this.cropRepository = cropRepository;
        this.userRepository = userRepository;
    }

    // ================== PLACE ORDER ==================

    public OrderDTO placeOrder(
            String buyerEmail,
            Long cropId,
            int quantity) {

        validateQuantity(quantity);

        User buyer = getUserByEmail(
                buyerEmail
        );

        Crop crop = getCropOrThrow(
                cropId
        );

        validateCropAvailability(crop);

        validateOwnership(
                crop,
                buyer
        );

        validateStock(
                crop,
                quantity
        );

        BigDecimal totalPrice =
                calculateTotal(
                        crop,
                        quantity
                );

        updateStock(
                crop,
                quantity
        );

        Order order =
                buildOrder(
                        buyer,
                        crop,
                        quantity,
                        totalPrice
                );

        Order savedOrder =
                orderRepository.save(order);

        logger.info(
                "Order created: id={}, buyer={}, crop={}",
                savedOrder.getId(),
                buyer.getEmail(),
                cropId
        );

        return OrderMapper.toDTO(
                savedOrder
        );
    }

    // ================== USER ORDERS ==================

    @Transactional(readOnly = true)
    public Page<OrderDTO> getUserOrders(
            String email,
            Pageable pageable) {

        User buyer =
                getUserByEmail(email);

        return orderRepository
                .findByBuyerOrderByCreatedAtDesc(
                        buyer,
                        pageable
                )
                .map(OrderMapper::toDTO);
    }

    // ================== GET ORDER ==================

    @Transactional(readOnly = true)
    public OrderDTO getOrderById(
            Long id) {

        return OrderMapper.toDTO(
                getOrderOrThrow(id)
        );
    }

    // ================== MARK PAID ==================

    public void markAsPaid(
            Long orderId) {

        Order order =
                getOrderOrThrow(orderId);

        if (order.getStatus()
                == OrderStatus.CONFIRMED) {

            logger.warn(
                    "Order {} already confirmed",
                    orderId
            );

            return;
        }

        order.markAsConfirmed();

        orderRepository.save(order);

        logger.info(
                "Order {} marked as PAID",
                orderId
        );
    }

    // ================== HELPERS ==================

    private User getUserByEmail(
            String email) {

        return userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );
    }

    private Crop getCropOrThrow(
            Long cropId) {

        return cropRepository
                .findById(cropId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Crop not found"
                        )
                );
    }

    private Order getOrderOrThrow(
            Long orderId) {

        return orderRepository
                .findById(orderId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Order not found"
                        )
                );
    }

    private void validateQuantity(
            int quantity) {

        if (quantity <= 0) {

            throw new IllegalArgumentException(
                    "Invalid quantity"
            );
        }
    }

    private void validateCropAvailability(
            Crop crop) {

        if (!crop.isActive()) {

            throw new IllegalArgumentException(
                    "Crop is not available"
            );
        }
    }

    private void validateOwnership(
            Crop crop,
            User buyer) {

        if (crop.getFarmer() != null
                && crop.getFarmer()
                .getId()
                .equals(buyer.getId())) {

            throw new IllegalArgumentException(
                    "You cannot order your own crop"
            );
        }
    }

    private void validateStock(
            Crop crop,
            int quantity) {

        if (quantity >
                crop.getQuantity()) {

            throw new IllegalArgumentException(
                    "Not enough stock available"
            );
        }
    }

    private BigDecimal calculateTotal(
            Crop crop,
            int quantity) {

        return crop.getPrice()
                .multiply(
                        BigDecimal.valueOf(
                                quantity
                        )
                );
    }

    private void updateStock(
            Crop crop,
            int quantity) {

        crop.reduceStock(quantity);

        cropRepository.save(crop);
    }

    private Order buildOrder(
            User buyer,
            Crop crop,
            int quantity,
            BigDecimal totalPrice) {

        Order order =
                new Order();

        order.setBuyer(buyer);
        order.setCrop(crop);
        order.setQuantity(quantity);
        order.setTotalPrice(totalPrice);
        order.setStatus(
                OrderStatus.PENDING
        );

        return order;
    }
}