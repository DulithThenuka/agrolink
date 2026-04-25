@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final CropRepository cropRepository;
    private final OrderRepository orderRepository;

    public AdminServiceImpl(UserRepository userRepository,
                            CropRepository cropRepository,
                            OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.cropRepository = cropRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public AdminDashboardDTO getDashboardData() {

        return new AdminDashboardDTO(
                userRepository.count(),
                cropRepository.count(),
                orderRepository.count(),
                orderRepository.findTop5ByOrderByCreatedAtDesc()
                        .stream()
                        .map(order -> new OrderSummaryDTO(
                                order.getId(),
                                order.getCrop().getName(),
                                order.getQuantity(),
                                order.getBuyer().getEmail(),
                                order.getStatus().name(),
                                order.getCreatedAt()
                        ))
                        .toList()
        );
    }
}