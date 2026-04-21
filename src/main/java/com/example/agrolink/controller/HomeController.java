package com.example.agrolink.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "redirect:/crops";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }
}