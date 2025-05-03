package com.prabath_motors.backend.dao.Stock;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int itemID;
    private int itemCtgryID;
    private int supplierId;
    private String itemName;
    private int itemBarcode;
    private int recorderLevel;
    private int qtyAvailable;
    private String itemBrand;
    private double sellPrice;
    private double unitPrice;
    private String stockLevel;
    private int rackNo;
    private LocalDate updatedDate;

    // Getters
    public int getItemID() {
        return itemID;
    }

    public int getItemCtgryID() {
        return itemCtgryID;
    }

    public int getSupplierId() {
        return supplierId;
    }

    public String getItemName() {
        return itemName;
    }

    public int getItemBarcode() {
        return itemBarcode;
    }

    public int getRecorderLevel() {
        return recorderLevel;
    }

    public int getQtyAvailable() {
        return qtyAvailable;
    }

    public String getItemBrand() {
        return itemBrand;
    }

    public double getSellPrice() {
        return sellPrice;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public String getStockLevel() {
        return stockLevel;
    }

    public int getRackNo() {
        return rackNo;
    }

    public LocalDate getUpdatedDate() {
        return updatedDate;
    }

    // Setters
    public void setItemID(int itemID) {
        this.itemID = itemID;
    }

    public void setItemCtgryID(int itemCtgryID) {
        this.itemCtgryID = itemCtgryID;
    }

    public void setSupplierId(int supplierId) {
        this.supplierId = supplierId;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public void setItemBarcode(int itemBarcode) {
        this.itemBarcode = itemBarcode;
    }

    public void setRecorderLevel(int recorderLevel) {
        this.recorderLevel = recorderLevel;
    }

    public void setQtyAvailable(int qtyAvailable) {
        this.qtyAvailable = qtyAvailable;
    }

    public void setItemBrand(String itemBrand) {
        this.itemBrand = itemBrand;
    }

    public void setSellPrice(double sellPrice) {
        this.sellPrice = sellPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public void setStockLevel(String stockLevel) {
        this.stockLevel = stockLevel;
    }

    public void setRackNo(int rackNo) {
        this.rackNo = rackNo;
    }

    public void setUpdatedDate(LocalDate updatedDate) {
        this.updatedDate = updatedDate;
    }
}
