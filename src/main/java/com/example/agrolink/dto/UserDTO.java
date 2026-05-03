package com.example.agrolink.dto;

import com.example.agrolink.entity.Role;

public final class UserDTO {

    private final Long id;
    private final String name;
    private final String email;

    private final Role role;
    private final String roleLabel;

    private final String location;

    private final boolean enabled;

    public UserDTO(Long id,
                   String name,
                   String email,
                   Role role,
                   String location,
                   boolean enabled) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.roleLabel = role != null ? role.getLabel() : null;
        this.location = location;
        this.enabled = enabled;
    }

    public UserDTO(Object id2, String name2, String email2, Object role2, String location2) {
        this.id = id2 instanceof Long ? (Long) id2 : null;
        this.name = name2;
        this.email = email2;
        this.role = role2 instanceof Role ? (Role) role2 : null;
        this.roleLabel = this.role != null ? this.role.getLabel() : null;
        this.location = location2;
        this.enabled = false;
    }

    public Long getId() { return id; }

    public String getName() { return name; }

    public String getEmail() { return email; }

    public Role getRole() { return role; }

    public String getRoleLabel() { return roleLabel; }

    public String getLocation() { return location; }

    public boolean isEnabled() { return enabled; }
}