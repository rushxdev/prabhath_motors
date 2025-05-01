package com.prabath_motors.backend.service;

import com.prabath_motors.backend.dao.User;
import com.prabath_motors.backend.dto.ReqRes;
import com.prabath_motors.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UsersManagementService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private  JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ReqRes register(ReqRes registrationRequest){
        ReqRes resp = new ReqRes();
        try{
            User user = new User();
            user.setEmail(registrationRequest.getUserEmail());
            user.setPassword(passwordEncoder.encode(registrationRequest.getUserPassword()));
            user.setRole(registrationRequest.getUserRole());
            user.setName(registrationRequest.getUserName());
            user.setPhone(registrationRequest.getUserPhone());

            User userResult = userRepository.save(user);

            if(userResult.getId()>0){
                resp.setUser((userResult));
                resp.setMessage("User registered successfully");
                resp.setStatusCode(200);
            }
        }
        catch (Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }


    public ReqRes login(ReqRes loginRequest){
        ReqRes response = new ReqRes();
        try{
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUserEmail(),
                            loginRequest.getUserPassword()));
            var user = userRepository.findByEmail(loginRequest.getUserEmail()).orElseThrow();
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs"); // 1 day
            response.setMessage("Login successful");

        }
        catch (Exception e){
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }
        return response;
    }


    public ReqRes refreshToken(ReqRes RefreshTokenRequest){
        ReqRes response = new ReqRes();
        try{
            String email = jwtUtils.extractUsername(RefreshTokenRequest.getToken());
            User user = userRepository.findByEmail(email).orElseThrow();
            if (jwtUtils.isTokenValid(RefreshTokenRequest.getToken(), user)) {
                var jwt = jwtUtils.generateToken(user);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(RefreshTokenRequest.getToken());
                response.setExpirationTime("24Hrs"); // 1 day
                response.setMessage("Token refreshed successfully");
            }
            response.setStatusCode(200);
            return response;
        }
        catch (Exception e){
            response.setStatusCode(500);
            response.setError(e.getMessage());
            return response;
        }
    }


    public ReqRes getAllUsers(){
        ReqRes reqRes = new ReqRes();
        try {
            List<User> result = userRepository.findAll();
            if(!result.isEmpty()){
                reqRes.setUsers(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Users fetched successfully");
            }
            else{
                reqRes.setStatusCode(404);
                reqRes.setMessage("No users found");
            }
            return reqRes;
        }
        catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setError("Error occurred"+e.getMessage());
            return reqRes;
        }
    }


    public ReqRes getUserById(Integer userID){
        ReqRes reqRes = new ReqRes();
        try{
            User userById = userRepository.findById(userID).orElseThrow(() -> new RuntimeException("User not found"));
            reqRes.setUser(userById);
            reqRes.setStatusCode(200);
            reqRes.setMessage("User with id"+userID+" fetched successfully");
        }
        catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setError("Error occurred"+e.getMessage());
        }
        return reqRes;
    }


    public ReqRes deleteUser(Integer userID){
        ReqRes reqRes = new ReqRes();
        try{
            Optional<User> userById = userRepository.findById(userID);
            if(userById.isPresent()){
                userRepository.delete(userById.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("User with id"+userID+" deleted successfully");
            }
            else{
                reqRes.setStatusCode(404);
                reqRes.setMessage("User with id"+userID+" not found for deletion");
            }
        }
        catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setError("Error occurred while deleting user"+e.getMessage());
        }
        return reqRes;
    }

    public ReqRes updateUser(Integer userID, ReqRes updatedUser) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<User> userOptional = userRepository.findById(userID);
            if (userOptional.isPresent()) {
                User exisitinguser = userOptional.get();
                exisitinguser.setName(updatedUser.getUserName());
                exisitinguser.setEmail(updatedUser.getUserEmail());
                exisitinguser.setPhone(updatedUser.getUserPhone());
                exisitinguser.setRole(updatedUser.getUserRole());

                if (updatedUser.getUserPassword() != null && !updatedUser.getUserPassword().isEmpty()) {
                    exisitinguser.setPassword(passwordEncoder.encode(updatedUser.getUserPassword()));
                }
                User savedUser = userRepository.save(exisitinguser);
                reqRes.setUser(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User with id" + userID + " updated successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User with id" + userID + " not found for update");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setError("Error occurred while updating user" + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes getMyInfo(String email) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);
            if(userOptional.isPresent()){
                reqRes.setUser(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("User with email" + email + " fetched successfully");
            }
            else{
                reqRes.setStatusCode(404);
                reqRes.setMessage("User with email" + email + " not found");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setError("Error occurred" + e.getMessage());
        }
        return reqRes;
    }

}
