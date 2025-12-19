package com.prabath_motors.backend.controller.StockController;

import com.prabath_motors.backend.dao.Stock.Stock_Out;
import com.prabath_motors.backend.service.stockService.Stock_OutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stock_out")
public class Stock_OutController {
    private final Stock_OutService stockOutService;

    @Autowired
    public Stock_OutController(Stock_OutService stockOutService) {this.stockOutService = stockOutService;}

    @GetMapping("/get")
    public ResponseEntity<List<Stock_Out>> getAllStocks_Out() {
        try {
            List<Stock_Out> stocks = stockOutService.getAllStocks_Out();
            return ResponseEntity.ok(stocks);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Stock_Out> getStockById(@PathVariable Integer id) {
        try{
            Stock_Out stock = stockOutService.getStockById(id);
            if (stock == null) {
                throw new RuntimeException("Stock with id : " + id + " not found");
            }
            return ResponseEntity.ok(stock);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/save")
    public ResponseEntity<Stock_Out> saveStockOut(@RequestBody Stock_Out stock){
        try {
            Stock_Out stockOut = stockOutService.SaveStockOut(stock);
            return ResponseEntity.ok(stockOut);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Stock_Out> updateStockOutDetails(@PathVariable Integer  id, @RequestBody Stock_Out stock) {
        try{
            Stock_Out stockOut = stockOutService.UpdateStockOutDetails(id, stock);
            return ResponseEntity.ok(stockOut);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteStockById(@PathVariable Integer id) {
        try {
            stockOutService.DeleteStockById(id);
            return new ResponseEntity<>("Stock with id : "+ id + "deleted successfully", org.springframework.http.HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}