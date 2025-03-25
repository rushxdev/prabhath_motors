package com.prabath_motors.backend.controller.StockController;

import com.prabath_motors.backend.dao.Stock.Stock_In;
import com.prabath_motors.backend.service.stockService.Stock_InService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stock_in")
public class Stock_InController {
    private final Stock_InService stockInService;

    @Autowired
    public Stock_InController(Stock_InService stockInService) {
        this.stockInService = stockInService;
    }

    @GetMapping("/get")
    public ResponseEntity<List<Stock_In>> getAllStocks_In() {
        try{
            List<Stock_In> stocks = stockInService.getAllStocks_In();
            return ResponseEntity.ok(stocks);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Stock_In> getStockById(@PathVariable Integer id) {
        try {
            Stock_In stock = stockInService.getStockById(id);
            if (stock == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(stock);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/save")
    public ResponseEntity<Stock_In> saveStockIn(@RequestBody Stock_In stock) {
        try {
            Stock_In savedStock = stockInService.SaveStockIn(stock);
            return ResponseEntity.ok(savedStock);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Stock_In> updateStockInDetails(@PathVariable Integer id, @RequestBody Stock_In stock) {
        try {
            Stock_In updatedStock = stockInService.UpdateStockInDetails(id, stock);
            return ResponseEntity.ok(updatedStock);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteStockById(@PathVariable Integer id) {
        try {
            stockInService.DeleteStockById(id);
            return new ResponseEntity<>("Stock with id : "+ id + "deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
