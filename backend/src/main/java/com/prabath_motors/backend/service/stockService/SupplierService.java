package com.prabath_motors.backend.service.stockService;

import com.prabath_motors.backend.dao.Stock.Supplier;

import java.util.List;

public interface SupplierService {
    public List<Supplier> getAllSuppliers();
    public Supplier getSupplierById(Integer supplierID);
    public Supplier SaveSupplier(Supplier supplier);
    public Supplier UpdateSupplierDetails(Integer id, Supplier supplier);
    public void DeleteSupplierById(Integer id);
}