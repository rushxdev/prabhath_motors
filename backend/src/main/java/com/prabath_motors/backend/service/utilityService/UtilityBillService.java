package com.prabath_motors.backend.service.utilityService;

import com.prabath_motors.backend.dao.UtilityBill;

import java.util.List;


public interface UtilityBillService {
    public List<UtilityBill> getAllUtilityBills();
    public UtilityBill GetUtilityBillByID(Integer uBillID);
    public UtilityBill SaveUtilityBill(UtilityBill utilityBill);
    public UtilityBill UpdateUtilityBill(UtilityBill utilityBill);
    public String DeleteUtilityBill(UtilityBill utilityBill);
}
