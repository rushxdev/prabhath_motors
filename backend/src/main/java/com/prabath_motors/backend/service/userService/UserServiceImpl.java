package com.prabath_motors.backend.service.userService;

import com.prabath_motors.backend.dao.User;
import com.prabath_motors.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{
    private UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User GetUserByID(Integer userID) {
        return userRepository.getReferenceById(userID);
    }

    @Override
    public User SaveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User UpdateUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public void DeleteUser(User user) {
        userRepository.delete(user);
    }
}
