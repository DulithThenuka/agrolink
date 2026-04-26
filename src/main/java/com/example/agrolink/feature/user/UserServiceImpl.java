@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ================== REGISTER ==================

    @Override
    public UserDTO register(UserRegisterDTO dto) {

        if (userRepository.existsByEmailIgnoreCase(dto.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = UserRegisterMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return UserMapper.toDTO(userRepository.save(user));
    }

    // ================== INTERNAL ==================

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}