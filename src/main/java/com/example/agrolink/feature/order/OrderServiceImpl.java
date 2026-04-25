package com.example.agrolink.feature.order;

@Service
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

    @Override
    public void placeOrder(String email, Long cropId, Integer quantity) {

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        if (crop.getQuantity() < quantity) {
            throw new IllegalArgumentException("Not enough stock");
        }

        Order order = new Order();
        order.setBuyer(buyer);
        order.setCrop(crop);
        order.setQuantity(quantity);
        order.setTotalPrice(crop.getPrice().multiply(BigDecimal.valueOf(quantity)));

        crop.setQuantity(crop.getQuantity() - quantity);

        orderRepository.save(order);
    }
}
