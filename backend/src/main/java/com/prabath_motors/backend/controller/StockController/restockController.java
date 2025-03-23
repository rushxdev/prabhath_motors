package com.prabath_motors.backend.controller.StockController;

import com.prabath_motors.backend.dao.Stock.Restock;
import com.prabath_motors.backend.service.stockService.RestockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restock")
public class restockController {
    private final RestockService restockService;

    @Autowired
    public restockController(RestockService restockService) {
        this.restockService = restockService;
    }

    @GetMapping("get")
    public ResponseEntity<List<Restock>> getAllRestocks(){
        try{
            List<Restock> restocks = restockService.getAllRestocks();
            return ResponseEntity.ok(restocks);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Restock> getRestockById(@PathVariable Integer id){
        try{
            Restock restock = restockService.getRestockByID(id);
            if (restock == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(restock);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/save")
    public ResponseEntity<Restock> saveRestock(@RequestBody Restock restock){
        try{
            Restock savedRestock = restockService.SaveRestock(restock);
            return ResponseEntity.ok(savedRestock);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Restock> updateRestockDetails(@PathVariable Integer id, @RequestBody Restock restock){
        try{
            Restock updatedRestock = restockService.UpdateRestockDetails(id, restock);
            return ResponseEntity.ok(updatedRestock);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteRestockById(@PathVariable Integer id){
        try{
            restockService.DeleteRestockById(id);
            return new ResponseEntity<>("Restock with id : "+ id + "deleted successfully", org.springframework.http.HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
