package com.prabath_motors.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = MinAgeValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface MinAge {
    String message() default "Minimum age not met";
    int value(); // age in years
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
