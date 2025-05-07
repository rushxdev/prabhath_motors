package com.prabath_motors.backend.controller.StockController.ReportControllers;

import com.prabath_motors.backend.dto.StocksDto.DateRangeRequest;
import com.prabath_motors.backend.dto.StocksDto.SalesSummaryResponse;
import com.prabath_motors.backend.service.stockService.ReportService.StockReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    private final StockReportService stockReportService;

    @Autowired
    public ReportController(StockReportService stockReportService) {
        this.stockReportService = stockReportService;
    }

    @PostMapping("/sales summery")
    public ResponseEntity<SalesSummaryResponse> getSalesSummaryReport(@RequestBody DateRangeRequest request) {
        SalesSummaryResponse response = stockReportService.generateSalesSummaryReport(
                request.getStartDate(), request.getEndDate());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/supplier_purchase")
    public ResponseEntity<?> getSupplierPurchaseReport(@RequestBody DateRangeRequest request) {
        return ResponseEntity.ok(stockReportService.generateSupplierPurchaseReport(
                request.getStartDate(), request.getEndDate()));
    }

    @PostMapping("/inventory")
    public ResponseEntity<?> getInventoryReport(@RequestBody Map<String, Object> request) {
        boolean showLowStockOnly = request.containsKey("showLowStockOnly") ? (boolean) request.get("showLowStockOnly") : false;
        String sortBy = request.containsKey("sortBy") ? (String) request.get("sortBy") : "stockLevel";
        // We don't need to pass showChart to the backend since it's just for UI rendering
        
        return ResponseEntity.ok(stockReportService.generateInventoryReport(showLowStockOnly, sortBy));
    }

    @PostMapping("/item_purchase_history")
    public ResponseEntity<?> getItemPurchaseHistory(@RequestBody Map<String, Object> request) {
        Integer itemId = (Integer) request.get("itemId");
        LocalDate startDate = LocalDate.parse((String) request.get("startDate"));
        LocalDate endDate = LocalDate.parse((String) request.get("endDate"));
        
        return ResponseEntity.ok(stockReportService.generateItemPurchaseHistoryReport(
                itemId, startDate, endDate));
    }
}