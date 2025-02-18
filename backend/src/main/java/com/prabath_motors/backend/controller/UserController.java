package com.prabath_motors.backend.controller;

import com.prabath_motors.backend.dao.User;
import com.prabath_motors.backend.service.userService.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<User> getUserByID(@PathVariable Integer id) {
        User user = userService.GetUserByID(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/save")
    public ResponseEntity<User> saveUser(@RequestBody User user) {
        User savedUser = userService.SaveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/update")
    public User updateUser(@RequestBody User user) {
        return userService.UpdateUser(user);
    }

    @DeleteMapping("/delete")
    public void deleteUser(@RequestBody User user) {
        userService.DeleteUser(user);
    }
}
