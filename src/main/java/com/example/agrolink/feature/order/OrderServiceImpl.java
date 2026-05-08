package com.example.agrolink.feature.order;

import com.example.agrolink.dto.OrderDTO;

import com.example.agrolink.entity.Crop;
import com.example.agrolink.entity.Order;
import com.example.agrolink.entity.OrderStatus;
import com.example.agrolink.entity.User;

import com.example.agrolink.exception.ResourceNotFoundException;

import com.example.agrolink.mapper.OrderMapper;

import com.example.agrolink.repository.CropRepository;
import com.example.agrolink.repository.OrderRepository;
import com.example.agrolink.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CropRepository cropRepository;
    private final UserRepository userRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            CropRepository cropRepository,
                            UserRepository userRepository) {

        this.orderRepository = orderRepository;
        this.cropRepository = cropRepository;
        this.userRepository = userRepository;
    }

    // ================== PLACE ORDER ==================

    @Override
    public OrderDTO placeOrder(
            String buyerEmail,
            Long cropId,
            int quantity) {

        if (quantity <= 0) {
            throw new IllegalArgumentException(
                    "Invalid quantity"
            );
        }

        User buyer = userRepository
                .findByEmailIgnoreCase(buyerEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Crop not found"
                        ));

        // Prevent self-order

        if (crop.getFarmer() != null &&
                crop.getFarmer().getId()
                        .equals(buyer.getId())) {

            throw new IllegalArgumentException(
                    "You cannot order your own crop"
            );
        }

        // Stock validation

        if (!crop.hasEnoughStock(quantity)) {

            throw new IllegalArgumentException(
                    "Not enough stock"
            );
        }

        // Calculate total

        BigDecimal total =
                crop.getPrice()
                        .multiply(BigDecimal.valueOf(quantity));

        // Reduce stock

        crop.reduceStock(quantity);

        cropRepository.save(crop);

        // Create order

        Order order = new Order();

        order.setBuyer(buyer);
        order.setCrop(crop);
        order.setQuantity(quantity);
        order.setTotalPrice(total);
        order.setStatus(OrderStatus.PENDING);

        Order savedOrder =
                orderRepository.save(order);

        return OrderMapper.toDTO(savedOrder);
    }

    // ================== BUYER ORDERS ==================

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> getUserOrders(
            String buyerEmail,
            Pageable pageable) {

        User buyer = userRepository
                .findByEmailIgnoreCase(buyerEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        return orderRepository
                .findByBuyerOrderByCreatedAtDesc(
                        buyer,
                        pageable
                )
                .map(OrderMapper::toDTO);
    }

    // ================== FARMER ORDERS ==================

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> getFarmerOrders(
            String farmerEmail,
            Pageable pageable) {

        User farmer = userRepository
                .findByEmailIgnoreCase(farmerEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        return orderRepository
                .findFarmerOrders(farmer, pageable)
                .map(OrderMapper::toDTO);
    }

    // ================== READ ==================

    @Override
    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) {

        return OrderMapper.toDTO(
                getOrderOrThrow(id)
        );
    }

    // ================== STATUS ==================

    @Override
    public void updateOrderStatus(
            Long orderId,
            OrderStatus status,
            String userEmail) {

        Order order = getOrderOrThrow(orderId);

        validateFarmerOwnership(order, userEmail);

        order.getStatus()
                .validateTransition(status);

        order.setStatus(status);

        orderRepository.save(order);
    }

    @Override
    public void cancelOrder(
            Long orderId,
            String userEmail) {

        Order order = getOrderOrThrow(orderId);

        validateBuyerOwnership(order, userEmail);

        order.cancel();

        orderRepository.save(order);
    }

    // ================== PAYMENT ==================

    @Override
    public void markAsPaid(Long orderId) {

        Order order = getOrderOrThrow(orderId);

        order.markAsConfirmed();

        orderRepository.save(order);
    }

    // ================== HELPERS ==================

    private Order getOrderOrThrow(Long id) {

        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"
                        ));
    }

    private void validateBuyerOwnership(
            Order order,
            String email) {

        if (order.getBuyer() == null ||
                order.getBuyer().getEmail() == null ||
                !order.getBuyer()
                        .getEmail()
                        .equalsIgnoreCase(email)) {

            throw new IllegalArgumentException(
                    "Unauthorized action"
            );
        }
    }

    private void validateFarmerOwnership(
            Order order,
            String email) {

        if (order.getCrop() == null ||
                order.getCrop().getFarmer() == null ||
                order.getCrop().getFarmer().getEmail() == null ||
                !order.getCrop()
                        .getFarmer()
                        .getEmail()
                        .equalsIgnoreCase(email)) {

            throw new IllegalArgumentException(
                    "Unauthorized action"
            );
        }
    }
}