package com.prabath_motors.backend.controller;

import com.prabath_motors.backend.dao.UtilityBill;
import com.prabath_motors.backend.service.utilityBillService.UtilityBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
@RequestMapping("/utilitybill")
public class UtilityBillController {
    private final UtilityBillService utilityBillService;

    @Autowired
    public UtilityBillController(UtilityBillService utilityBillService) {
        this.utilityBillService = utilityBillService;
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<UtilityBill> getUtilityBillByID(@PathVariable Integer id) {
        UtilityBill utilityBill = utilityBillService.GetUtilityBillByID(id);
        return ResponseEntity.ok(utilityBill);
    }

    @PostMapping("/save")
    public ResponseEntity<UtilityBill> saveUtilityBill(@RequestBody UtilityBill utilityBill) {
        UtilityBill savedUtilityBill = utilityBillService.SaveUtilityBill(utilityBill);
        return ResponseEntity.ok(savedUtilityBill);
    }

    @PutMapping("/update")
    public ResponseEntity<UtilityBill> updateUtilityBill(@RequestBody UtilityBill utilityBill) {
        UtilityBill updatedUtilityBill = utilityBillService.UpdateUtilityBill(utilityBill);
        return ResponseEntity.ok(updatedUtilityBill);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUtilityBill(@RequestBody UtilityBill utilityBill) {
        String deleteMessage = utilityBillService.DeleteUtilityBill(utilityBill);
        return ResponseEntity.ok(deleteMessage); // Return the deletion message as the response body
    }
}
