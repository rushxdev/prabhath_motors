package com.prabath_motors.backend.service.stockService.ReportService;

import com.prabath_motors.backend.dao.Stock.Item;
import com.prabath_motors.backend.dao.Stock.Stock_In;
import com.prabath_motors.backend.dao.Stock.Stock_Out;
import com.prabath_motors.backend.dao.Stock.Supplier;
import com.prabath_motors.backend.dao.Stock.Item_Ctgry;
import com.prabath_motors.backend.dto.StocksDto.SalesSummaryResponse;
import com.prabath_motors.backend.repository.ItemRepository;
import com.prabath_motors.backend.repository.Stock_InRepository;
import com.prabath_motors.backend.repository.Stock_OutRepository;
import com.prabath_motors.backend.repository.SupplierRepository;
import com.prabath_motors.backend.repository.Item_CtgryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StockReportServiceImpl implements StockReportService {

    private final Stock_OutRepository stockOutRepository;
    private final Stock_InRepository stockInRepository;
    private final ItemRepository itemRepository;
    private final SupplierRepository supplierRepository;
    private final Item_CtgryRepository item_CtgryRepository;

    @Autowired
    public StockReportServiceImpl(
            Stock_OutRepository stockOutRepository,
            Stock_InRepository stockInRepository,
            ItemRepository itemRepository,
            SupplierRepository supplierRepository,
            Item_CtgryRepository item_CtgryRepository) {
        this.stockOutRepository = stockOutRepository;
        this.stockInRepository = stockInRepository;
        this.itemRepository = itemRepository;
        this.supplierRepository = supplierRepository;
        this.item_CtgryRepository = item_CtgryRepository;
    }

    @Override
    public SalesSummaryResponse generateSalesSummaryReport(LocalDate startDate, LocalDate endDate) {
        // Change from findByDateBetween to findByDateUsedBetween
        List<Stock_Out> stockOuts = stockOutRepository.findByDateUsedBetween(startDate, endDate);

        SalesSummaryResponse response = new SalesSummaryResponse();
        List<SalesSummaryResponse.SalesItemDetail> salesDetails = new ArrayList<>();

        // Group by item ID
        Map<Integer, List<Stock_Out>> groupedStockOuts = stockOuts.stream()
                .collect(Collectors.groupingBy(Stock_Out::getItemID));

        double totalRevenue = 0;
        double totalExpense = 0;
        int totalItemsSold = 0;

        for (Map.Entry<Integer, List<Stock_Out>> entry : groupedStockOuts.entrySet()) {
            Integer itemId = entry.getKey();
            List<Stock_Out> itemStockOuts = entry.getValue();

            // Get the item details
            Optional<Item> optionalItem = itemRepository.findById(itemId);
            if (optionalItem.isEmpty()) continue;
            Item item = optionalItem.get();

            // Get the stock in details for purchase price
            List<Stock_In> stockIns = stockInRepository.findByItemID(itemId);

            // Calculate total quantity sold for this item - using the correct getter method
            int soldQty = itemStockOuts.stream().mapToInt(Stock_Out::getQtyUsed).sum();

            // Use the item's sell price from the item table
            double soldPrice = item.getSellPrice();

            // Calculate purchase price (average of stock in prices)
            double purchasePrice = stockIns.isEmpty() ? 0 :
                    stockIns.stream().mapToDouble(Stock_In::getUnitPrice).average().orElse(0);

            double revenue = soldQty * soldPrice;
            double expense = soldQty * purchasePrice;

            // Create sales detail entry
            SalesSummaryResponse.SalesItemDetail detail = new SalesSummaryResponse.SalesItemDetail();
            detail.setItemName(item.getItemName());
            detail.setSoldQty(soldQty);
            detail.setPurchasePrice(purchasePrice);
            detail.setSoldPrice(soldPrice);
            detail.setRevenue(revenue);
            detail.setExpense(expense);

            salesDetails.add(detail);

            // Update totals
            totalItemsSold += soldQty;
            totalRevenue += revenue;
            totalExpense += expense;
        }

        response.setSalesDetails(salesDetails);
        response.setItemsSold(totalItemsSold);
        response.setTotalSales(totalRevenue);
        response.setTotalExpenses(totalExpense);

        return response;
    }

    @Override
    public Object generateSupplierPurchaseReport(LocalDate startDate, LocalDate endDate) {
        // Implementation for supplier purchase report
        Map<String, Object> response = new HashMap<>();
        // Placeholder implementation
        response.put("totalPurchases", 0);
        response.put("suppliersCount", 0);
        return response;
    }

    @Override
    public Object generateInventoryReport(boolean showLowStockOnly) {
        // Implementation for inventory report
        Map<String, Object> response = new HashMap<>();

        List<Item> items;
        if (showLowStockOnly) {
            items = itemRepository.findByStockLevelIn(List.of("Low", "Critical"));
        } else {
            items = itemRepository.findAll();
        }

        response.put("totalItems", items.size());
        response.put("lowStockItems", items.stream()
                .filter(i -> "Low".equals(i.getStockLevel()) || "Critical".equals(i.getStockLevel()))
                .count());

        return response;
    }

    @Override
    public Object generateItemPurchaseHistoryReport(Integer itemId, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> response = new HashMap<>();
        
        // Get item details
        Optional<Item> itemOpt = itemRepository.findById(itemId);
        if (itemOpt.isEmpty()) {
            throw new RuntimeException("Item not found with ID: " + itemId);
        }
        
        Item item = itemOpt.get();
        
        // Get category details
        Optional<Item_Ctgry> categoryOpt = item_CtgryRepository.findById(item.getItemCtgryID());
        String categoryName = categoryOpt.isPresent() ? categoryOpt.get().getItemCtgryName() : "Unknown";
        
        // Build item details
        Map<String, Object> itemDetails = new HashMap<>();
        itemDetails.put("itemName", item.getItemName());
        itemDetails.put("itemBarcode", item.getItemBarcode());
        itemDetails.put("categoryName", categoryName);
        itemDetails.put("qtyAvailable", item.getQtyAvailable());
        itemDetails.put("stockLevel", item.getStockLevel());
        
        response.put("itemDetails", itemDetails);
        
        // Get purchase history for the item within date range
        List<Stock_In> stockIns = stockInRepository.findByItemIDAndDateAddedBetween(itemId, startDate, endDate);
        
        // Format purchase history with supplier names
        List<Map<String, Object>> purchaseHistory = new ArrayList<>();
        int totalQuantity = 0;
        double totalCost = 0;
        
        for (Stock_In stockIn : stockIns) {
            Map<String, Object> entry = new HashMap<>();
            
            // Get supplier name
            Optional<Supplier> supplierOpt = supplierRepository.findById(stockIn.getSupplierID());
            String supplierName = supplierOpt.isPresent() ? supplierOpt.get().getSupplierName() : "Unknown";
            
            entry.put("dateAdded", stockIn.getDateAdded().toString());
            entry.put("qtyAdded", stockIn.getQtyAdded());
            entry.put("unitPrice", stockIn.getUnitPrice());
            entry.put("sellPrice", stockIn.getSellPrice());
            entry.put("supplierName", supplierName);
            
            purchaseHistory.add(entry);
            
            totalQuantity += stockIn.getQtyAdded();
            totalCost += stockIn.getQtyAdded() * stockIn.getUnitPrice();
        }
        
        response.put("purchaseHistory", purchaseHistory);
        response.put("totalPurchases", purchaseHistory.size());
        response.put("totalQuantity", totalQuantity);
        response.put("averageUnitPrice", totalQuantity > 0 ? totalCost / totalQuantity : 0);
        
        return response;
    }
}