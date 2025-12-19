package com.prabath_motors.backend.service.stockService;

import com.prabath_motors.backend.dao.Stock.Supplier;
import com.prabath_motors.backend.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierServiceImpl implements SupplierService {
    private final SupplierRepository supplierRepository;

    @Autowired
    public SupplierServiceImpl(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Override
    public List<Supplier> getAllSuppliers() {
        List<Supplier> suppliers = supplierRepository.findAll();
        if (suppliers.isEmpty()) {
            throw new RuntimeException("No suppliers found");
        }
        return suppliers;
    }

    @Override
    public Supplier getSupplierById(Integer supplierID) {
        return supplierRepository.getReferenceById(supplierID);
    }

    @Override
    public Supplier SaveSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    @Override
    public Supplier UpdateSupplierDetails(Integer id, Supplier supplier) {
        Optional<Supplier> existingSupplier = supplierRepository.findById(id);

        if (existingSupplier.isPresent()) {
            Supplier existingSupplierDetails = existingSupplier.get();

            //Update only the necessary fields
            existingSupplierDetails.setSupplierName(supplier.getSupplierName());
            existingSupplierDetails.setContactPerson(supplier.getContactPerson());
            existingSupplierDetails.setPhoneNumber(supplier.getPhoneNumber());

            //save
            return supplierRepository.save(existingSupplierDetails);
        } else {
            throw new RuntimeException("Supplier not found with ID: " + id);
        }
    }

    @Override
    public void DeleteSupplierById(Integer id) {
        supplierRepository.deleteById(id);
    }
}