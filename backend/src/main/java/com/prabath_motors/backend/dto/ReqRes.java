package com.prabath_motors.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.prabath_motors.backend.dao.User;
import  lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqRes {
    private int statusCode;
    private String message;
    private String error;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String userName;
    private String userPassword;
    private String userEmail;
    private String userPhone;
    private String userRole;
    private User user;
    private List<User> users;

}

