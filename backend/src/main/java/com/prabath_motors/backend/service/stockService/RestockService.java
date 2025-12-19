package com.prabath_motors.backend.service.stockService;

import com.prabath_motors.backend.dao.Stock.Restock;

import java.util.List;

public interface RestockService {
    public List<Restock> getAllRestocks();
    public Restock getRestockByID(Integer restockID);
    public Restock SaveRestock(Restock restock);
    public Restock UpdateRestockDetails(Integer id, Restock restock);
    public void DeleteRestockById(Integer id);
}