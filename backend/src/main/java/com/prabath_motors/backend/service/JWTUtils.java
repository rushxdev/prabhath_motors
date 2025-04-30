package com.prabath_motors.backend.service;

import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;

@Component
public class JWTUtils {
    private SecretKey Key;
    private static final long EXPIRATION_TIME = 86400000; // 1 day

    private JWTUtils(){
        String secretKeyString = "secretKey";
        byte[] keBytes = Base64
    }
}
