package com.prabath_motors.backend.controller.StockController;

import com.prabath_motors.backend.dao.Stock.Item_Ctgry;
import com.prabath_motors.backend.service.stockService.Item_CtgryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/itemCtgry")
public class Item_ctgryController {
    private final Item_CtgryService item_ctgryService;

    @Autowired
    public Item_ctgryController(Item_CtgryService item_ctgryService) {
        this.item_ctgryService = item_ctgryService;
    }

    @GetMapping("/get")
    public ResponseEntity<List<Item_Ctgry>> getCategorys(){
        try{
            List<Item_Ctgry> itemCtgrys = item_ctgryService.getAllItemCtgrys();
            return ResponseEntity.ok(itemCtgrys);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Item_Ctgry> savecategory(@PathVariable Integer id){
        try {
            Item_Ctgry ctgry = item_ctgryService.getItemCtgryByID(id);
            if (ctgry == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(ctgry);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/save")
    public ResponseEntity<Item_Ctgry> saveCategory(@RequestBody Item_Ctgry ctgry){
        try {
            Item_Ctgry savedCtgry = item_ctgryService.SaveItemCtgry(ctgry);
            return ResponseEntity.ok(savedCtgry);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Item_Ctgry> updateCategory(@PathVariable Integer id, @RequestBody Item_Ctgry ctgry){
        try {
            Item_Ctgry updatedCtgry = item_ctgryService.UpdateItemCtgryDetails(id, ctgry);
            return ResponseEntity.ok(updatedCtgry);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Integer id){
        try {
            item_ctgryService.DeleteItemCtgryById(id);
            return new ResponseEntity<>("Category with id : "+ id + "deleted successfully", org.springframework.http.HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
