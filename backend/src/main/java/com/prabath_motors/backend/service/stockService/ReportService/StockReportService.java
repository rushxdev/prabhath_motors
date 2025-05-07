package com.prabath_motors.backend.service.stockService.ReportService;

import com.prabath_motors.backend.dto.StocksDto.SalesSummaryResponse;
import java.time.LocalDate;

public interface StockReportService {
    SalesSummaryResponse generateSalesSummaryReport(LocalDate startDate, LocalDate endDate);
    Object generateSupplierPurchaseReport(LocalDate startDate, LocalDate endDate);
    Object generateInventoryReport(boolean showLowStockOnly);
    Object generateItemPurchaseHistoryReport(Integer itemId, LocalDate startDate, LocalDate endDate);
}
