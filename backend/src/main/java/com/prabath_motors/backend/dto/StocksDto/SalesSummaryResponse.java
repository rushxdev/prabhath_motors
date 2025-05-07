package com.prabath_motors.backend.dto.StocksDto;

import lombok.Data;
import java.util.List;

@Data
public class SalesSummaryResponse {
    private List<SalesItemDetail> salesDetails;
    private int itemsSold;
    private double totalSales;
    private double totalExpenses;

    @Data
    public static class SalesItemDetail {
        private String itemName;
        private int soldQty;
        private double purchasePrice;
        private double soldPrice;
        private double revenue;
        private double expense;
    }
}
