package com.prabath_motors.backend.dao.Stock;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Item_id;
    private String Item_name;
    private int Item_barcode;
    private String Item_group;
    private String Item_type;
    private String Item_brand;
    private double Item_cost;
    private double Item_sellPrice;
    private int Supplier_Id;
    private int Rack_no;
}
