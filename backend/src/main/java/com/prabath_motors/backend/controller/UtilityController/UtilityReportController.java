package com.prabath_motors.backend.controller.UtilityController;

import com.prabath_motors.backend.dao.MonthlyUtilityBill;
import com.prabath_motors.backend.dao.UtilityBill;
import com.prabath_motors.backend.dto.UtilityDto.ReportRequestDTO;
import com.prabath_motors.backend.service.utilityService.MonthlyUtilityBillService;
import com.prabath_motors.backend.service.utilityService.UtilityBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/utility/reports")
@CrossOrigin(origins = "*")
public class UtilityReportController {
    
    @Autowired
    private UtilityBillService utilityBillService;
    
    @Autowired
    private MonthlyUtilityBillService monthlyUtilityBillService;
    
    @PostMapping("/monthly_utility_analysis")
    public ResponseEntity<Map<String, Object>> generateMonthlyAnalysisReport(
            @RequestBody ReportRequestDTO request) {
        
        // Parse dates from request
        LocalDate startDate = LocalDate.parse(request.getStartDate().split("T")[0]);
        LocalDate endDate = LocalDate.parse(request.getEndDate().split("T")[0]);
        String utilityType = request.getUtilityType();
        
        // Get all monthly bills
        List<MonthlyUtilityBill> allMonthlyBills = monthlyUtilityBillService.getAllMonthlyUtilityBills();
        
        // Get all utility bills for reference
        List<UtilityBill> allUtilityBills = utilityBillService.getAllUtilityBills();
        
        // Filter bills by date range
        List<MonthlyUtilityBill> filteredBills = allMonthlyBills.stream()
            .filter(bill -> {
                // Convert bill's month and year to a date for comparison
                YearMonth billYearMonth = YearMonth.of(bill.getBillingYear(), Month.valueOf(bill.getBillingMonth().toUpperCase()));
                LocalDate billDate = billYearMonth.atDay(1);
                return !billDate.isBefore(startDate) && !billDate.isAfter(endDate);
            })
            .collect(Collectors.toList());
            
        // If utility type is specified (not "all"), filter by type
        if (!utilityType.equals("all")) {
            filteredBills = filteredBills.stream()
                .filter(bill -> {
                    // Find the corresponding utility bill to get its type
                    Optional<UtilityBill> utilityBill = allUtilityBills.stream()
                        .filter(ub -> ub.getBilling_Acc_No() == bill.getBillingAccNo())
                        .findFirst();
                    return utilityBill.isPresent() && utilityBill.get().getType().equals(utilityType);
                })
                .collect(Collectors.toList());
        }
        
        // Calculate aggregated metrics
        int totalBills = filteredBills.size();
        int totalUnits = filteredBills.stream().mapToInt(MonthlyUtilityBill::getUnits).sum();
        float totalCost = filteredBills.stream().map(MonthlyUtilityBill::getTotalPayment).reduce(0f, Float::sum);
        
        // Calculate averages
        float avgMonthlyCost = totalBills > 0 ? totalCost / totalBills : 0;
        float avgMonthlyUnits = totalBills > 0 ? (float) totalUnits / totalBills : 0;
        
        // Group by month and year for monthly breakdown
        Map<String, List<MonthlyUtilityBill>> billsByMonth = filteredBills.stream()
            .collect(Collectors.groupingBy(bill -> bill.getBillingMonth() + " " + bill.getBillingYear()));
            
        // Prepare monthly breakdown data
        List<Map<String, Object>> monthlyData = new ArrayList<>();
        for (Map.Entry<String, List<MonthlyUtilityBill>> entry : billsByMonth.entrySet()) {
            String monthYear = entry.getKey();
            List<MonthlyUtilityBill> monthBills = entry.getValue();
            
            // For each month, separate by utility type if needed
            Map<String, List<MonthlyUtilityBill>> billsByType = new HashMap<>();
            
            if (utilityType.equals("all")) {
                // Group by utility type
                for (MonthlyUtilityBill bill : monthBills) {
                    Optional<UtilityBill> ub = allUtilityBills.stream()
                        .filter(utilityBill -> utilityBill.getBilling_Acc_No() == bill.getBillingAccNo())
                        .findFirst();
                    String type = ub.isPresent() ? ub.get().getType() : "Unknown";
                    
                    if (!billsByType.containsKey(type)) {
                        billsByType.put(type, new ArrayList<>());
                    }
                    billsByType.get(type).add(bill);
                }
                
                // Add data for each type
                for (Map.Entry<String, List<MonthlyUtilityBill>> typeEntry : billsByType.entrySet()) {
                    String type = typeEntry.getKey();
                    List<MonthlyUtilityBill> typeBills = typeEntry.getValue();
                    
                    int typeUnits = typeBills.stream().mapToInt(MonthlyUtilityBill::getUnits).sum();
                    float typeCost = typeBills.stream().map(MonthlyUtilityBill::getTotalPayment).reduce(0f, Float::sum);
                    
                    // Get the unit price for calculation
                    float unitPrice = 0f;
                    for (MonthlyUtilityBill bill : typeBills) {
                        Optional<UtilityBill> ub = allUtilityBills.stream()
                            .filter(utilityBill -> utilityBill.getBilling_Acc_No() == bill.getBillingAccNo())
                            .findFirst();
                        if (ub.isPresent()) {
                            unitPrice = ub.get().getUnit_Price();
                            break;
                        }
                    }
                    
                    // Calculate the theoretical cost based on units and unit price
                    float calculatedCost = typeUnits * unitPrice;
                    
                    String[] parts = monthYear.split(" ");
                    Map<String, Object> monthData = new HashMap<>();
                    monthData.put("month", parts[0]);
                    monthData.put("year", Integer.parseInt(parts[1]));
                    monthData.put("utilityType", type);
                    monthData.put("units", typeUnits);
                    monthData.put("cost", typeCost);
                    monthData.put("calculatedCost", calculatedCost);
                    
                    monthlyData.add(monthData);
                }
            } else {
                // Just aggregate all bills for the selected type
                int monthUnits = monthBills.stream().mapToInt(MonthlyUtilityBill::getUnits).sum();
                float monthCost = monthBills.stream().map(MonthlyUtilityBill::getTotalPayment).reduce(0f, Float::sum);
                
                String[] parts = monthYear.split(" ");
                Map<String, Object> monthData = new HashMap<>();
                monthData.put("month", parts[0]);
                monthData.put("year", Integer.parseInt(parts[1]));
                monthData.put("utilityType", utilityType);
                monthData.put("units", monthUnits);
                monthData.put("cost", monthCost);
                
                monthlyData.add(monthData);
            }
        }
        
        // Sort monthly data by year and month
        monthlyData.sort((a, b) -> {
            int yearA = (int) a.get("year");
            int yearB = (int) b.get("year");
            if (yearA != yearB) {
                return Integer.compare(yearA, yearB);
            }
            
            String monthA = (String) a.get("month");
            String monthB = (String) b.get("month");
            List<String> months = Arrays.asList("January", "February", "March", "April", "May", "June", 
                                              "July", "August", "September", "October", "November", "December");
            return Integer.compare(months.indexOf(monthA), months.indexOf(monthB));
        });
        
        // Generate recommendations based on consumption patterns
        List<String> recommendations = generateRecommendations(filteredBills, totalUnits, avgMonthlyUnits, totalCost);
        
        // Generate analysis text
        String analysis = generateAnalysis(filteredBills, totalUnits, totalCost, avgMonthlyUnits, avgMonthlyCost);
        
        // Build the response
        Map<String, Object> response = new HashMap<>();
        response.put("totalBills", totalBills);
        response.put("totalUnits", totalUnits);
        response.put("totalCost", totalCost);
        response.put("avgMonthlyCost", avgMonthlyCost);
        response.put("avgMonthlyUnits", avgMonthlyUnits);
        response.put("monthlyData", monthlyData);
        response.put("analysis", analysis);
        response.put("recommendations", recommendations);
        
        return ResponseEntity.ok(response);
    }
    
    private String generateAnalysis(List<MonthlyUtilityBill> bills, int totalUnits, float totalCost, 
                                   float avgMonthlyUnits, float avgMonthlyCost) {
        if (bills.isEmpty()) {
            return "No data available for the selected period.";
        }
        
        StringBuilder analysis = new StringBuilder();
        analysis.append("During the selected period, a total of ").append(totalUnits)
               .append(" units were consumed at a cost of Rs. ").append(String.format("%.2f", totalCost))
               .append(". The average monthly consumption was ").append(String.format("%.2f", avgMonthlyUnits))
               .append(" units with an average cost of Rs. ").append(String.format("%.2f", avgMonthlyCost)).append(".");
        
        // Find highest and lowest consumption months
        MonthlyUtilityBill highestBill = bills.stream().max(Comparator.comparing(MonthlyUtilityBill::getUnits)).orElse(null);
        MonthlyUtilityBill lowestBill = bills.stream().min(Comparator.comparing(MonthlyUtilityBill::getUnits)).orElse(null);
        
        if (highestBill != null) {
            analysis.append(" The highest consumption was in ").append(highestBill.getBillingMonth())
                   .append(" ").append(highestBill.getBillingYear())
                   .append(" with ").append(highestBill.getUnits()).append(" units.");
        }
        
        if (lowestBill != null) {
            analysis.append(" The lowest consumption was in ").append(lowestBill.getBillingMonth())
                   .append(" ").append(lowestBill.getBillingYear())
                   .append(" with ").append(lowestBill.getUnits()).append(" units.");
        }
        
        return analysis.toString();
    }
    
    private List<String> generateRecommendations(List<MonthlyUtilityBill> bills, int totalUnits, 
                                               float avgMonthlyUnits, float totalCost) {
        List<String> recommendations = new ArrayList<>();
        
        if (bills.isEmpty()) {
            recommendations.add("No data available to generate recommendations.");
            return recommendations;
        }
        
        // Check for high consumption months
        List<MonthlyUtilityBill> highConsumptionBills = bills.stream()
            .filter(bill -> bill.getUnits() > avgMonthlyUnits * 1.2) // 20% above average
            .collect(Collectors.toList());
        
        if (!highConsumptionBills.isEmpty()) {
            recommendations.add("Consider investigating usage patterns in high consumption months: " + 
                               highConsumptionBills.stream()
                                   .map(bill -> bill.getBillingMonth() + " " + bill.getBillingYear())
                                   .collect(Collectors.joining(", ")));
        }
        
        // Add general recommendations
        recommendations.add("Regular maintenance of utility systems can prevent wastage and unexpected high bills.");
        recommendations.add("Consider implementing energy/water saving measures to reduce consumption and costs.");
        recommendations.add("Monitor monthly usage patterns to quickly identify unusual consumption.");
        
        return recommendations;
    }

    @PostMapping("/utility_cost_comparison")
    public ResponseEntity<Map<String, Object>> generateUtilityCostComparisonReport(
            @RequestBody ReportRequestDTO request) {
        
        // Parse dates from request
        LocalDate startDate = LocalDate.parse(request.getStartDate().split("T")[0]);
        LocalDate endDate = LocalDate.parse(request.getEndDate().split("T")[0]);
        
        // Get all monthly bills
        List<MonthlyUtilityBill> allMonthlyBills = monthlyUtilityBillService.getAllMonthlyUtilityBills();
        
        // Get all utility bills for reference
        List<UtilityBill> allUtilityBills = utilityBillService.getAllUtilityBills();
        
        // Filter bills by date range
        List<MonthlyUtilityBill> filteredBills = allMonthlyBills.stream()
            .filter(bill -> {
                YearMonth billYearMonth = YearMonth.of(bill.getBillingYear(), Month.valueOf(bill.getBillingMonth().toUpperCase()));
                LocalDate billDate = billYearMonth.atDay(1);
                return !billDate.isBefore(startDate) && !billDate.isAfter(endDate);
            })
            .collect(Collectors.toList());
            
        // Group bills by type for comparison
        Map<String, List<MonthlyUtilityBill>> billsByType = new HashMap<>();
        for (MonthlyUtilityBill bill : filteredBills) {
            Optional<UtilityBill> ub = allUtilityBills.stream()
                .filter(utilityBill -> utilityBill.getBilling_Acc_No() == bill.getBillingAccNo())
                .findFirst();
                
            if (ub.isPresent()) {
                String type = ub.get().getType();
                if (!billsByType.containsKey(type)) {
                    billsByType.put(type, new ArrayList<>());
                }
                billsByType.get(type).add(bill);
            }
        }
        
        // Calculate metrics for each type
        Map<String, Object> typeComparison = new HashMap<>();
        for (Map.Entry<String, List<MonthlyUtilityBill>> entry : billsByType.entrySet()) {
            String type = entry.getKey();
            List<MonthlyUtilityBill> typeBills = entry.getValue();
            
            int totalUnits = typeBills.stream().mapToInt(MonthlyUtilityBill::getUnits).sum();
            float totalCost = typeBills.stream().map(MonthlyUtilityBill::getTotalPayment).reduce(0f, Float::sum);
            float avgCost = typeBills.size() > 0 ? totalCost / typeBills.size() : 0;
            
            Map<String, Object> typeData = new HashMap<>();
            typeData.put("totalUnits", totalUnits);
            typeData.put("totalCost", totalCost);
            typeData.put("billCount", typeBills.size());
            typeData.put("avgCost", avgCost);
            
            typeComparison.put(type, typeData);
        }
        
        // Build the response
        Map<String, Object> response = new HashMap<>();
        response.put("period", startDate.format(DateTimeFormatter.ISO_DATE) + " to " + endDate.format(DateTimeFormatter.ISO_DATE));
        response.put("typeComparison", typeComparison);
        response.put("totalBills", filteredBills.size());
        response.put("totalCost", filteredBills.stream().map(MonthlyUtilityBill::getTotalPayment).reduce(0f, Float::sum));
        
        return ResponseEntity.ok(response);
    }
}