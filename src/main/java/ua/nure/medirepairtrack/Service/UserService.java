package ua.nure.medirepairtrack.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ua.nure.medirepairtrack.DTO.UserDTO.*;
import ua.nure.medirepairtrack.Entity.User.*;
import ua.nure.medirepairtrack.Exception.*;
import ua.nure.medirepairtrack.Repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserResponseDTO register(RegisterUserDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Користувач з такою поштою вже існує");
        }

        User user = User.builder()
                .email(dto.getEmail())
                .password(dto.getPassword())
                .role(Role.CLIENT)
                .firstName(dto.getFirstName())
                .middleName(dto.getMiddleName())
                .lastName(dto.getLastName())
                .phone(dto.getPhone())
                .createdAt(LocalDateTime.now())
                .updatedAt(null)
                .build();

        userRepository.save(user);

        return mapToResponse(user);
    }

    public UserResponseDTO createUser(CreateUserDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Користувач з такою поштою вже існує");
        }

        User user = User.builder()
                .email(dto.getEmail())
                .password(dto.getPassword())
                .role(dto.getRole())
                .firstName(dto.getFirstName())
                .middleName(dto.getMiddleName())
                .lastName(dto.getLastName())
                .phone(dto.getPhone())
                .createdAt(LocalDateTime.now())
                .updatedAt(null)
                .build();

        userRepository.save(user);

        return mapToResponse(user);
    }

    public UserResponseDTO updateUserData(Integer id, UpdateUserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Користувач не знайдений"));

        user.setFirstName(dto.getFirstName());
        user.setMiddleName(dto.getMiddleName());
        user.setLastName(dto.getLastName());
        user.setPhone(dto.getPhone());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        return mapToResponse(user);
    }

    public UserResponseDTO updateRole(Integer id, Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Користувач не знайдений"));

        user.setRole(role);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        return mapToResponse(user);
    }

    // Для фронтенду, метод exists(email) потрібен для “лайв” перевірки email при реєстрації, оновленні профілю або в адмінці.
    public boolean exists(String email) {
        return userRepository.existsByEmail(email);
    }

    public UserResponseDTO getById(Integer id) {
        return userRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new NotFoundException("Користувач не знайдений"));
    }

    public UserResponseDTO getByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::mapToResponse)
                .orElseThrow(() -> new NotFoundException("Користувача з цим email не існує"));
    }

    public List<UserResponseDTO> getAll() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<UserResponseDTO> getByRole(Role role) {
        return userRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == role)
                .map(this::mapToResponse)
                .toList();
    }

    public void delete(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new NotFoundException("Користувач не знайдений");
        }
        userRepository.deleteById(id);
    }

    private UserResponseDTO mapToResponse(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .middleName(user.getMiddleName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .build();
    }
}
