package com.prabath_motors.backend.service.stockService;

import com.prabath_motors.backend.dao.Stock.Stock_Out;
import com.prabath_motors.backend.repository.Stock_OutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Stock_OutServiceImpl implements Stock_OutService {
    private final Stock_OutRepository stockOutRepository;

    @Autowired
    public Stock_OutServiceImpl(Stock_OutRepository stockOutRepository) {this.stockOutRepository = stockOutRepository;}

    @Override
    public List<Stock_Out> getAllStocks_Out() {
        List<Stock_Out> stockOuts = stockOutRepository.findAll();
        if (stockOuts.isEmpty()) {
            throw new RuntimeException("No stocks found");
        }
        return stockOuts;
    }

    @Override
    public Stock_Out getStockById(Integer stockOutID) { return stockOutRepository.getReferenceById(stockOutID);}

    @Override
    public Stock_Out SaveStockOut(Stock_Out stock) { return stockOutRepository.save(stock);}

    @Override
    public Stock_Out UpdateStockOutDetails(Integer id, Stock_Out stock) {
        Optional<Stock_Out> stockDetails = stockOutRepository.findById(id);

        if (stockDetails.isPresent()) {
            Stock_Out existingStockOut = stockDetails.get();

            //Update only necessary fields
            existingStockOut.setItemID(stock.getItemID());
            existingStockOut.setServiceID(stock.getServiceID());
            existingStockOut.setQty(stock.getQty());
            existingStockOut.setUnitPrice(stock.getUnitPrice());
            existingStockOut.setTotalCost(stock.getTotalCost());
            existingStockOut.setDateUsed(stock.getDateUsed());

            return stockOutRepository.save(existingStockOut);
        }else {
            throw new RuntimeException("Stock not found with ID : " + id);
        }
    }

    @Override
    public void DeleteStockById(Integer id) { stockOutRepository.deleteById(id);}
}
