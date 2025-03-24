package com.prabath_motors.backend.service.mothlyUtilityBillService;

import com.prabath_motors.backend.dao.MonthlyUtilityBill;

import java.util.List;

public interface MonthlyUtilityBillService {
    public MonthlyUtilityBill GetMUBillByID(Integer Invoice_No);
    public List<MonthlyUtilityBill> getAllMonthlyUtilityBills();
    public MonthlyUtilityBill SaveMUBill(MonthlyUtilityBill mutilityBill);
    public MonthlyUtilityBill UpdateMUBill(MonthlyUtilityBill mutilityBill);
    public String DeleteMUBill(MonthlyUtilityBill mutilityBill);
}
