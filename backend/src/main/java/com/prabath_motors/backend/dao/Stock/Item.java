package com.prabath_motors.backend.dao.Stock;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int itemID;

    @NotNull(message = "Category ID is required")
    @Min(value = 1, message = "Category ID must be positive")
    private int itemCtgryID;

    @NotNull(message = "Supplier ID is required")
    @Min(value = 1, message = "Supplier ID must be positive")
    private int supplierId;

    @NotBlank(message = "Item name is required")
    @Size(min = 2, max = 100, message = "Item name must be between 2 and 100 characters")
    private String itemName;

    @Min(value = 0, message = "Barcode must be positive")
    private int itemBarcode;

    @Min(value = 1, message = "Recorder level must be at least 1")
    private int recorderLevel;

    @Min(value = 0, message = "Available quantity cannot be negative")
    private int qtyAvailable;

    @Size(max = 50, message = "Brand name must be less than 50 characters")
    private String itemBrand;

    @DecimalMin(value = "0.01", message = "Sell price must be greater than 0")
    private double sellPrice;
    private double unitPrice;

    private String stockLevel;

    @Min(value = 1, message = "Rack number must be positive")
    private int rackNo;

    private LocalDate updatedDate;
}

