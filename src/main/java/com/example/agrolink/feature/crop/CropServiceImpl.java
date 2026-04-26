@Service
@Transactional
public class CropServiceImpl implements CropService {

    private final CropRepository cropRepository;
    private final UserRepository userRepository;

    public CropServiceImpl(CropRepository cropRepository,
                           UserRepository userRepository) {
        this.cropRepository = cropRepository;
        this.userRepository = userRepository;
    }

    // ================== CREATE ==================

    @Override
    public CropDTO addCrop(CropRequestDTO dto, String email) {

        User farmer = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Crop crop = CropMapper.toEntity(dto);
        crop.setFarmer(farmer);

        return CropMapper.toDTO(cropRepository.save(crop));
    }

    // ================== DELETE ==================

    @Override
    public void deleteCrop(Long id, String email) {

        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found"));

        // 🔐 ownership check
        if (!crop.getFarmer().getEmail().equalsIgnoreCase(email)) {
            throw new IllegalArgumentException("Unauthorized action");
        }

        crop.setActive(false);
        cropRepository.save(crop);
    }
}