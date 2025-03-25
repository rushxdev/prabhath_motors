package com.prabath_motors.backend.service.utilityService;

import com.prabath_motors.backend.dao.UtilityBill;
import com.prabath_motors.backend.repository.UtilityBillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UtilityBillServiceImpl implements UtilityBillService {
    private final UtilityBillRepository utilityBillRepository;

    @Autowired
    public UtilityBillServiceImpl(UtilityBillRepository utilityBillRepository) {
        this.utilityBillRepository = utilityBillRepository;
    }

    @Override
    public List<UtilityBill> getAllUtilityBills() {
        List<UtilityBill> utilityBills = utilityBillRepository.findAll();
        if (utilityBills == null || utilityBills.isEmpty()) {
            throw new RuntimeException("No utility bills found");
        }
        return utilityBills;
    }

    @Override
    public UtilityBill GetUtilityBillByID(Integer id) {
        return utilityBillRepository.getReferenceById(id);
    }

    @Override
    public UtilityBill SaveUtilityBill(UtilityBill utilityBill) {
        return utilityBillRepository.save(utilityBill);
    }

    @Override
    public UtilityBill UpdateUtilityBill(UtilityBill utilityBill) {
        // Fetch the existing entity
        UtilityBill existingUtilityBill = utilityBillRepository.findById(utilityBill.getId())
                .orElseThrow(() -> new RuntimeException("UtilityBill not found with id: " + utilityBill.getId()));

        // Update fields as needed
        existingUtilityBill.setAddress(utilityBill.getAddress());
        existingUtilityBill.setBilling_Acc_No(utilityBill.getBilling_Acc_No());
        existingUtilityBill.setMeter_No(utilityBill.getMeter_No());
        existingUtilityBill.setType(utilityBill.getType());
        existingUtilityBill.setUnit_Price(utilityBill.getUnit_Price());

        // Save and return the updated entity
        return utilityBillRepository.save(existingUtilityBill);
    }

    @Override
    public String DeleteUtilityBill(UtilityBill utilityBill) {
        // Fetch the entity to display its details after deletion
        UtilityBill existingUtilityBill = utilityBillRepository.findById(utilityBill.getId())
                .orElseThrow(() -> new RuntimeException("UtilityBill not found with id: " + utilityBill.getId()));

        // Perform the deletion
        utilityBillRepository.delete(existingUtilityBill);

        // Return a message with deleted entity details
        return "UtilityBill with ID " + existingUtilityBill.getId() + " and address '" + existingUtilityBill.getAddress() + "' has been deleted successfully.";
    }
}
