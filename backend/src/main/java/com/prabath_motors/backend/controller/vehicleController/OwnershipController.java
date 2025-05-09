package com.prabath_motors.backend.controller.vehicleController;

import com.prabath_motors.backend.dao.OwnershipHistory;
import com.prabath_motors.backend.service.vehicleService.OwnershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vehicle")
@CrossOrigin(origins = "http://localhost:5173")
public class OwnershipController {

    @Autowired
    private OwnershipService ownershipService;

    @PostMapping("/transfer-ownership")
    public ResponseEntity<String> transferOwnership(@RequestBody Map<String, Object> request) {
        Long vehicleId = Long.valueOf(request.get("vehicleId").toString());
        String newOwnerName = request.get("newOwnerName").toString();
        String newOwnerContact = request.get("newOwnerContact").toString();

        ownershipService.transferOwnership(vehicleId, newOwnerName, newOwnerContact);
        return ResponseEntity.ok("Ownership transferred successfully");
    }

    @GetMapping("/ownership-history/{vehicleId}")
    public ResponseEntity<List<OwnershipHistory>> getOwnershipHistory(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(ownershipService.getOwnershipHistory(vehicleId));
    }

    @DeleteMapping("/ownership-history/{vehicleId}/clear")
    public ResponseEntity<String> clearOwnershipHistory(@PathVariable Long vehicleId) {
        ownershipService.clearOwnershipHistory(vehicleId);
        return ResponseEntity.ok("Ownership history cleared");
    }
} 