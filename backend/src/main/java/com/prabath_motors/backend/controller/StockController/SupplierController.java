package com.prabath_motors.backend.controller.StockController;

import com.prabath_motors.backend.dao.Stock.Supplier;
import com.prabath_motors.backend.service.stockService.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/supplier")
public class SupplierController {
    private final SupplierService supplierService;

    @Autowired
    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping("/get")
    public ResponseEntity<List<Supplier>> getSuppliers(){
        try{
            List<Supplier> suppliers = supplierService.getAllSuppliers();
            return ResponseEntity.ok(suppliers);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Integer id){
        try{
            Supplier supplier = supplierService.getSupplierById(id);
            if (supplier == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(supplier);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/save")
    public ResponseEntity<Supplier> saveSupplier(@RequestBody Supplier supplier){
        try{
            Supplier savedSupplier = supplierService.SaveSupplier(supplier);
            return ResponseEntity.ok(savedSupplier);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Supplier> updateSupplierDetails(@PathVariable Integer id, @RequestBody Supplier supplier){
        try{
            Supplier updatedSupplier = supplierService.UpdateSupplierDetails(id, supplier);
            return ResponseEntity.ok(updatedSupplier);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteSupplierById(@PathVariable Integer id){
        try{
            supplierService.DeleteSupplierById(id);
            return new ResponseEntity<>("Supplier with id : "+ id + "deleted successfully", org.springframework.http.HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}