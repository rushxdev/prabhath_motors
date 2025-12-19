package com.prabath_motors.backend.service.stockService;

import com.prabath_motors.backend.dao.Stock.Stock_Out;

import java.util.List;

public interface Stock_OutService {
    public List<Stock_Out> getAllStocks_Out();
    public Stock_Out getStockById(Integer stockOutID);
    public Stock_Out SaveStockOut(Stock_Out stock);
    public Stock_Out UpdateStockOutDetails(Integer id, Stock_Out stock);
    public void DeleteStockById(Integer id);
}