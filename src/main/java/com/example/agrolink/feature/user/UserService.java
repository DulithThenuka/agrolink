package com.example.agrolink.feature.user;

public interface UserService {

    UserDTO register(UserRegisterDTO dto);

    User findByEmail(String email);
}
