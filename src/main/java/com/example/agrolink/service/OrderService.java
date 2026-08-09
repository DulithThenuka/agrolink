package com.example.agrolink.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.agrolink.dto.OrderDTO;
import com.example.agrolink.entity.Crop;
import com.example.agrolink.entity.EscrowStatus;
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
            Long id,
            String email) {

        Order order = getOrderOrThrow(id);
        if (order.getBuyer() == null || !order.getBuyer().getEmail().equalsIgnoreCase(email)) {
            throw new IllegalArgumentException("Unauthorized access to order");
        }
        return OrderMapper.toDTO(order);
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

    // ================== LOGISTICS & LIFECYCLE WORKFLOW ==================

    public OrderDTO farmerAcceptOrder(Long orderId, String farmerEmail) {
        Order order = getOrderOrThrow(orderId);
        if (order.getCrop() == null || order.getCrop().getFarmer() == null ||
                !order.getCrop().getFarmer().getEmail().equalsIgnoreCase(farmerEmail)) {
            throw new IllegalArgumentException("Unauthorized: Only the crop farmer can accept this order");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("Order is not in PENDING state");
        }

        order.setStatus(OrderStatus.TRANSPORT_REQUESTED);
        order.setTrackingNotes("Farmer accepted order. Transport requested.");
        Order updated = orderRepository.save(order);
        logger.info("Order {} accepted by farmer {}, transport requested", orderId, farmerEmail);
        return OrderMapper.toDTO(updated);
    }

    @Transactional(readOnly = true)
    public Page<OrderDTO> getAvailableDeliveries(Pageable pageable) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(OrderStatus.TRANSPORT_REQUESTED, pageable)
                .map(OrderMapper::toDTO);
    }

    public OrderDTO driverAcceptDelivery(Long orderId, String driverEmail) {
        Order order = getOrderOrThrow(orderId);
        User driver = getUserByEmail(driverEmail);

        if (order.getStatus() != OrderStatus.TRANSPORT_REQUESTED) {
            throw new IllegalStateException("Order is not available for transport assignment");
        }

        order.setDriver(driver);
        order.setStatus(OrderStatus.DRIVER_ASSIGNED);
        order.setTrackingNotes("Driver assigned: " + driver.getName() + ". Preparing for pickup.");
        Order updated = orderRepository.save(order);
        logger.info("Order {} assigned to logistics driver {}", orderId, driverEmail);
        return OrderMapper.toDTO(updated);
    }

    public OrderDTO updateDeliveryStatus(Long orderId, String driverEmail, OrderStatus nextStatus, String trackingNotes, Double lat, Double lng) {
        Order order = getOrderOrThrow(orderId);

        if (order.getDriver() == null || !order.getDriver().getEmail().equalsIgnoreCase(driverEmail)) {
            throw new IllegalArgumentException("Unauthorized: Only the assigned driver can update delivery status");
        }

        order.getStatus().validateTransition(nextStatus);
        order.setStatus(nextStatus);

        if (trackingNotes != null && !trackingNotes.isBlank()) {
            order.setTrackingNotes(trackingNotes);
        } else {
            switch (nextStatus) {
                case COLLECTED -> order.setTrackingNotes("Crop collected from farmer. En route.");
                case IN_TRANSIT -> order.setTrackingNotes("Live tracking active: In transit to delivery point.");
                case DELIVERED -> order.setTrackingNotes("Crop delivered to buyer location. Awaiting buyer confirmation.");
                default -> {}
            }
        }

        if (lat != null) order.setCurrentLat(lat);
        if (lng != null) order.setCurrentLng(lng);

        Order updated = orderRepository.save(order);
        logger.info("Order {} status updated to {} by driver {}", orderId, nextStatus, driverEmail);
        return OrderMapper.toDTO(updated);
    }

    public OrderDTO buyerConfirmDelivery(Long orderId, String buyerEmail) {
        Order order = getOrderOrThrow(orderId);
        if (order.getBuyer() == null || !order.getBuyer().getEmail().equalsIgnoreCase(buyerEmail)) {
            throw new IllegalArgumentException("Unauthorized: Only the buyer can confirm order delivery");
        }

        if (order.getStatus() != OrderStatus.DELIVERED && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new IllegalStateException("Order must be DELIVERED before confirming");
        }

        order.setStatus(OrderStatus.PAID);
        order.setEscrowStatus(EscrowStatus.RELEASED_TO_FARMER);
        order.setTrackingNotes("Buyer confirmed delivery. Escrow funds released: Farmer paid!");
        Order updated = orderRepository.save(order);
        logger.info("Order {} confirmed by buyer. Escrow released to farmer.", orderId);
        return OrderMapper.toDTO(updated);
    }

    public OrderDTO raiseDispute(Long orderId, String buyerEmail, String reason) {
        Order order = getOrderOrThrow(orderId);
        if (order.getBuyer() == null || !order.getBuyer().getEmail().equalsIgnoreCase(buyerEmail)) {
            throw new IllegalArgumentException("Unauthorized: Only the buyer can raise an escrow dispute");
        }

        if (order.getEscrowStatus() == EscrowStatus.RELEASED_TO_FARMER || order.getEscrowStatus() == EscrowStatus.REFUNDED_TO_BUYER) {
            throw new IllegalStateException("Cannot dispute order after escrow is already settled");
        }

        order.setEscrowStatus(EscrowStatus.DISPUTED);
        order.setDisputeReason(reason != null && !reason.isBlank() ? reason : "Buyer reported delivery or cargo issue.");
        order.setDisputeRaisedAt(LocalDateTime.now());
        order.setTrackingNotes("⚠️ Escrow Disputed! Locked under Admin Investigation. Reason: " + order.getDisputeReason());
        Order updated = orderRepository.save(order);
        logger.warn("Order {} escrow disputed by buyer {}. Reason: {}", orderId, buyerEmail, reason);
        return OrderMapper.toDTO(updated);
    }

    public OrderDTO resolveDisputeByAdmin(Long orderId, String decision, String resolutionNotes) {
        Order order = getOrderOrThrow(orderId);

        if (order.getEscrowStatus() != EscrowStatus.DISPUTED) {
            throw new IllegalStateException("Order is not currently under dispute");
        }

        String notes = (resolutionNotes != null && !resolutionNotes.isBlank()) ? resolutionNotes : "Admin investigation completed.";

        if ("REFUND".equalsIgnoreCase(decision)) {
            order.setEscrowStatus(EscrowStatus.REFUNDED_TO_BUYER);
            order.setStatus(OrderStatus.CANCELLED);
            order.setDisputeResolution("Admin Investigation: Refunded to Buyer. " + notes);
            order.setTrackingNotes("🛡️ Admin Resolution: Dispute settled with 100% Buyer Refund.");
        } else {
            order.setEscrowStatus(EscrowStatus.RELEASED_TO_FARMER);
            order.setStatus(OrderStatus.PAID);
            order.setDisputeResolution("Admin Investigation: Escrow Released to Farmer. " + notes);
            order.setTrackingNotes("🛡️ Admin Resolution: Dispute settled with Payment Released to Farmer.");
        }

        Order updated = orderRepository.save(order);
        logger.info("Order {} dispute resolved by Admin. Decision: {}", orderId, decision);
        return OrderMapper.toDTO(updated);
    }

    @Transactional(readOnly = true)
    public Page<OrderDTO> getDisputedOrders(Pageable pageable) {
        return orderRepository.findByEscrowStatusOrderByCreatedAtDesc(EscrowStatus.DISPUTED, pageable)
                .map(OrderMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Page<OrderDTO> getFarmerOrders(String farmerEmail, Pageable pageable) {
        User farmer = getUserByEmail(farmerEmail);
        return orderRepository.findFarmerOrders(farmer, pageable).map(OrderMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Page<OrderDTO> getDriverOrders(String driverEmail, Pageable pageable) {
        User driver = getUserByEmail(driverEmail);
        return orderRepository.findByDriverOrderByCreatedAtDesc(driver, pageable).map(OrderMapper::toDTO);
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

        String pickup = (crop.getFarmer() != null && crop.getFarmer().getLocation() != null && !crop.getFarmer().getLocation().isBlank())
                ? crop.getFarmer().getLocation()
                : (crop.getLocation() != null && !crop.getLocation().isBlank() ? crop.getLocation() : "Homagama");

        String delivery = (buyer.getLocation() != null && !buyer.getLocation().isBlank())
                ? buyer.getLocation()
                : "Colombo";

        order.setPickupLocation(pickup);
        order.setDeliveryLocation(delivery);
        order.setDistanceKm(31);
        order.setLogisticsFee(new BigDecimal("4800.00"));
        order.setEscrowStatus(com.example.agrolink.entity.EscrowStatus.HELD_IN_ESCROW);
        order.setTrackingNotes("Order placed by buyer. Payment held in AgroLink Escrow.");

        return order;
    }
}