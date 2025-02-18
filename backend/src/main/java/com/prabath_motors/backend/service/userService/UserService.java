package com.prabath_motors.backend.service.userService;

import com.prabath_motors.backend.dao.User;

public interface UserService {
    public User GetUserByID(Integer userID);
    public User SaveUser(User user);
    public User UpdateUser(User user);
    public void DeleteUser(User user);
}
