package com.prabath_motors.backend.service.stockService;

import com.prabath_motors.backend.dao.Stock.Item;

import java.util.List;

public interface ItemService {
    public List<Item> getAllItems();
    public Item getItemByID(Integer itemID);
    public Item SaveItem(Item item);
    public Item UpdateItem(Integer id, Item item);
    public void DeleteItemById(Integer id);
}
