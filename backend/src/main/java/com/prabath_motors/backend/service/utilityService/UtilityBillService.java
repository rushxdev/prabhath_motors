package com.prabath_motors.backend.service.utilityService;

import com.prabath_motors.backend.dao.UtilityBill;


public interface UtilityBillService {
    public UtilityBill GetUtilityBillByID(Integer uBillID);
    public UtilityBill SaveUtilityBill(UtilityBill utilityBill);
    public UtilityBill UpdateUtilityBill(UtilityBill utilityBill);
    public String DeleteUtilityBill(UtilityBill utilityBill);
}
