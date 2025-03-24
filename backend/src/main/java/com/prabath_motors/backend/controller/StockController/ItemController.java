package com.prabath_motors.backend.controller.StockController;

import com.prabath_motors.backend.dao.Stock.Item;
import com.prabath_motors.backend.service.stockService.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/item")
public class ItemController {
    private final ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService){
        this.itemService = itemService;
    }

    @GetMapping("/get")
    public ResponseEntity<List<Item>> getAllItems() {
        try {
            List<Item> items = itemService.getAllItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Integer id) {
        try {
            Item item = itemService.getItemByID(id);
            if (item == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/save")
    public ResponseEntity<Item> saveItem(@RequestBody Item item){
        try {
            Item savedItem = itemService.SaveItem(item);
            return ResponseEntity.ok(savedItem);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable Integer id, @RequestBody Item item) {
        try{
            Item updatedItem = itemService.UpdateItem(id, item);
            return ResponseEntity.ok(updatedItem);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Integer id) {
        try {
            itemService.DeleteItemById(id);
            return new ResponseEntity<>("Item with id : "+ id + "deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
