package com.prabath_motors.backend.service.stockService;

import com.prabath_motors.backend.dao.Stock.Stock_In;
import com.prabath_motors.backend.repository.Stock_InRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Stock_InServiceImpl implements Stock_InService {
    private final Stock_InRepository stockInRepository;

    @Autowired
    public Stock_InServiceImpl(Stock_InRepository stockInRepository) {this.stockInRepository = stockInRepository;}

    @Override
    public List<Stock_In> getAllStocks_In(){
        List<Stock_In> stocks = stockInRepository.findAll();
        if (stocks.isEmpty()) {
            throw new RuntimeException("No stocks found");
        }
        return stocks;
    }

    @Override
    public Stock_In getStockById(Integer stockInID){
        return stockInRepository.getReferenceById(stockInID);
    }

    @Override
    public Stock_In SaveStockIn(Stock_In stock){
        return stockInRepository.save(stock);
    }

    @Override
    public Stock_In UpdateStockInDetails(Integer id, Stock_In stock){
        Optional<Stock_In> existingStock = stockInRepository.findById(id);

        if(existingStock.isPresent()){
            Stock_In existingStockIn = existingStock.get();

            //Update only the necessary fields
            existingStockIn.setItemID(stock.getItemID());
            existingStockIn.setCtgryID(stock.getCtgryID());
            existingStockIn.setSupplierID(stock.getSupplierID());
            existingStockIn.setQtyAdded(stock.getQtyAdded());
            existingStockIn.setUnitPrice(stock.getUnitPrice());
            existingStockIn.setSellPrice(stock.getSellPrice());
            existingStockIn.setDateAdded(stock.getDateAdded());

            return stockInRepository.save(existingStockIn);
        }else {
            throw new RuntimeException("Stock not found with ID : " + id);
        }
    }

    @Override
    public void DeleteStockById(Integer id){
        stockInRepository.deleteById(id);
    }
}