package ua.nure.medirepairtrack.Controller.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ua.nure.medirepairtrack.DTO.user.UserDTO.CreateUserDTO;
import ua.nure.medirepairtrack.DTO.user.UserDTO.RegisterUserDTO;
import ua.nure.medirepairtrack.DTO.user.UserDTO.UpdateUserDTO;
import ua.nure.medirepairtrack.DTO.user.UserDTO.UserResponseDTO;
import ua.nure.medirepairtrack.Entity.user.User.Role;
import ua.nure.medirepairtrack.Service.user.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public UserResponseDTO register(@Valid @RequestBody RegisterUserDTO dto) {
        return userService.register(dto);
    }

    @PostMapping
    public UserResponseDTO createUser(@Valid @RequestBody CreateUserDTO dto) {
        return userService.createUser(dto);
    }

    @PutMapping("/{id}")
    public UserResponseDTO updateUser(@Valid @PathVariable Integer id, @RequestBody UpdateUserDTO dto) {
        return userService.updateUserData(id, dto);
    }

    @PatchMapping("/{id}/role")
    public UserResponseDTO updateRole(@PathVariable Integer id, @RequestParam Role role) {
        return userService.updateRole(id, role);
    }

    @GetMapping("/exists")
    public boolean exists(@RequestParam String email) {
        return userService.exists(email);
    }

    @GetMapping("/{id}")
    public UserResponseDTO getById(@PathVariable Integer id) {
        return userService.getById(id);
    }

    @GetMapping("/email/{email}")
    public UserResponseDTO getByEmail(@PathVariable String email) {
        return userService.getByEmail(email);
    }

    @GetMapping
    public List<UserResponseDTO> getAll() {
        return userService.getAll();
    }

    @GetMapping("/role/{role}")
    public List<UserResponseDTO> getByRole(@PathVariable Role role) {
        return userService.getByRole(role);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        userService.delete(id);
    }
}
