package com.prabath_motors.backend.service.stockService;

import com.prabath_motors.backend.dao.Stock.Stock_In;

import java.util.List;

public interface Stock_InService {
    public List<Stock_In> getAllStocks_In();
    public Stock_In getStockById(Integer stockInID);
    public Stock_In SaveStockIn(Stock_In stock);
    public Stock_In UpdateStockInDetails(Integer id, Stock_In stock);
    public void DeleteStockById(Integer id);
}
