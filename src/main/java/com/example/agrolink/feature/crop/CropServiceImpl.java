@Service
public class CropServiceImpl implements CropService {

    private final CropRepository cropRepository;
    private final UserRepository userRepository;

    public CropServiceImpl(CropRepository cropRepository,
                           UserRepository userRepository) {
        this.cropRepository = cropRepository;
        this.userRepository = userRepository;
    }

    @Override
    public CropDTO addCrop(CropRequestDTO dto, String email) {

        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Crop crop = new Crop();
        crop.setName(dto.getName());
        crop.setCategory(dto.getCategory());
        crop.setLocation(dto.getLocation());
        crop.setPrice(dto.getPrice());
        crop.setQuantity(dto.getQuantity());
        crop.setFarmer(farmer);

        cropRepository.save(crop);

        return new CropDTO(
                crop.getId(),
                crop.getName(),
                crop.getCategory(),
                crop.getLocation(),
                crop.getPrice(),
                crop.getQuantity(),
                crop.getImageUrl(),
                farmer.getName()
        );
    }

    @Override
    public void deleteCrop(Long id) {
        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        crop.setActive(false);
        cropRepository.save(crop);
    }
}