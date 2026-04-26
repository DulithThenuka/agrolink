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

    @Override
    public OrderDTO placeOrder(String email, Long cropId, Integer quantity) {

        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Invalid quantity");
        }

        User buyer = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found"));

        // ❌ prevent self-order
        if (crop.getFarmer().getId().equals(buyer.getId())) {
            throw new IllegalArgumentException("You cannot order your own crop");
        }

        // ❌ stock check
        if (crop.getQuantity() < quantity) {
            throw new IllegalArgumentException("Not enough stock");
        }

        // 💰 calculate price
        BigDecimal total = crop.getPrice().multiply(BigDecimal.valueOf(quantity));

        // 📦 create order
        Order order = new Order();
        order.setBuyer(buyer);
        order.setCrop(crop);
        order.setQuantity(quantity);
        order.setTotalPrice(total);
        order.setStatus(OrderStatus.PENDING);

        // 📉 update stock
        crop.setQuantity(crop.getQuantity() - quantity);

        orderRepository.save(order);

        return new OrderDTO(
                order.getId(),
                crop.getName(),
                quantity,
                total,
                order.getStatus().name(),
                order.getCreatedAt()
        );
    }
}