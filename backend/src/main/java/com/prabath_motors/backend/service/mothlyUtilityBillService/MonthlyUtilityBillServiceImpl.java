package com.prabath_motors.backend.service.mothlyUtilityBillService;

import com.prabath_motors.backend.dao.MonthlyUtilityBill;
import com.prabath_motors.backend.repository.MonthlyUtilityBillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MonthlyUtilityBillServiceImpl implements MonthlyUtilityBillService {
    private final MonthlyUtilityBillRepository monthlyUtilityBillRepository;

    @Autowired
    public MonthlyUtilityBillServiceImpl(MonthlyUtilityBillRepository monthlyUtilityBillRepository) {
        this.monthlyUtilityBillRepository = monthlyUtilityBillRepository;
    }

    @Override
    public List<MonthlyUtilityBill> getAllMonthlyUtilityBills() {
        return monthlyUtilityBillRepository.findAll();
    }

    @Override
    public MonthlyUtilityBill GetMUBillByID(Integer invoiceNo) {
        // Use proper exception handling for when the entity is not found
        return monthlyUtilityBillRepository.findById(invoiceNo)
                .orElseThrow(() -> new RuntimeException("Monthly Utility Bill not found with Invoice_No: " + invoiceNo));
    }

    @Override
    public MonthlyUtilityBill SaveMUBill(MonthlyUtilityBill mutilityBill) {
        // Ensure null checks or validation can be added here if needed
        return monthlyUtilityBillRepository.save(mutilityBill);
    }

    @Override
    public MonthlyUtilityBill UpdateMUBill(MonthlyUtilityBill mutilityBill) {
        // Check if the entity exists before updating
        if (!monthlyUtilityBillRepository.existsById(mutilityBill.getId())) {
            throw new RuntimeException("Cannot update. Monthly Utility Bill not found with id: " + mutilityBill.getId());
        }
        return monthlyUtilityBillRepository.save(mutilityBill);
    }

    @Override
    public String DeleteMUBill(MonthlyUtilityBill mutilityBill) {
        // Fetch the entity to ensure it exists before deletion
        MonthlyUtilityBill existingMUBill = monthlyUtilityBillRepository.findById(mutilityBill.getId())
                .orElseThrow(() -> new RuntimeException("Monthly Utility Bill not found with id: " + mutilityBill.getId()));

        // Perform the deletion
        monthlyUtilityBillRepository.delete(existingMUBill);

        // Return a message confirming the deletion
        return "Monthly Utility Bill with ID " + existingMUBill.getId() + " and Invoice_No '" + existingMUBill.getInvoiceNo() + "' has been deleted successfully.";
    }
}