package com.prabath_motors.backend.controller;

import com.prabath_motors.backend.dao.MonthlyUtilityBill;
import com.prabath_motors.backend.service.mothlyUtilityBillService.MonthlyUtilityBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/monthlyutilitybill")
public class MonthlyUtilityBillController {
    private final MonthlyUtilityBillService monthlyUtilityBillService;

    @Autowired
    public MonthlyUtilityBillController(MonthlyUtilityBillService monthlyUtilityBillService) {
        this.monthlyUtilityBillService = monthlyUtilityBillService;
    }

    // GET: Retrieve all Monthly Utility Bills
    @GetMapping("/get")
    public ResponseEntity<List<MonthlyUtilityBill>> getAllMonthlyUtilityBills() {
            List<MonthlyUtilityBill> bills = monthlyUtilityBillService.getAllMonthlyUtilityBills();
            return ResponseEntity.ok(bills);
    }


    // GET: Retrieve a Monthly Utility Bill by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<MonthlyUtilityBill> getMonthlyUtilityBillById(@PathVariable Integer id) {
        MonthlyUtilityBill bill = monthlyUtilityBillService.GetMUBillByID(id);
        return ResponseEntity.ok(bill);
    }

    // POST: Save a new Monthly Utility Bill
    @PostMapping("/save")
    public ResponseEntity<MonthlyUtilityBill> saveMonthlyUtilityBill(@RequestBody MonthlyUtilityBill bill) {
        // Log the incoming data
        System.out.println("Received MonthlyUtilityBill: " + bill);

        MonthlyUtilityBill savedBill = monthlyUtilityBillService.SaveMUBill(bill);
        return ResponseEntity.ok(savedBill);
    }


    // PUT: Update an existing Monthly Utility Bill
    @PutMapping("/update")
    public ResponseEntity<MonthlyUtilityBill> updateMonthlyUtilityBill(@RequestBody MonthlyUtilityBill bill) {
        MonthlyUtilityBill updatedBill = monthlyUtilityBillService.UpdateMUBill(bill);
        return ResponseEntity.ok(updatedBill);
    }

    // DELETE: Delete a Monthly Utility Bill
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMonthlyUtilityBill(@PathVariable Integer id) {
        MonthlyUtilityBill bill = monthlyUtilityBillService.GetMUBillByID(id);
        String response = monthlyUtilityBillService.DeleteMUBill(bill);
        return ResponseEntity.ok(response);
    }
}

