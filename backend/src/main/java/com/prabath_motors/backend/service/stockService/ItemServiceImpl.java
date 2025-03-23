package com.prabath_motors.backend.service.stockService;

import com.prabath_motors.backend.dao.Stock.Item;
import com.prabath_motors.backend.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemServiceImpl implements ItemService {
    private final ItemRepository itemRepository;

    @Autowired
    public ItemServiceImpl(ItemRepository itemRepository) {this.itemRepository = itemRepository;}

    @Override
    public List<Item> getAllItems() {
        List<Item> items = itemRepository.findAll();
        if (items.isEmpty()) {
            throw new RuntimeException("No items found");
        }
        return items;
    }

    @Override
    public Item getItemByID(Integer itemID) {
        return itemRepository.getReferenceById(itemID);
    }

    @Override
    public Item SaveItem(Item item) {
        return itemRepository.save(item);
    }

    @Override
    public Item UpdateItem(Integer id, Item item) {
        Optional<Item> optionalItem = itemRepository.findById(id);

        if (optionalItem.isPresent()) {
            Item existingItem = optionalItem.get();

            // Update only the necessary fields
            existingItem.setSupplierId(item.getSupplierId());
            existingItem.setItemName(item.getItemName());
            existingItem.setItemBarcode(item.getItemBarcode());
            existingItem.setRecorderLevel(item.getRecorderLevel());
            existingItem.setQtyAvailable(item.getQtyAvailable());
            existingItem.setItemBrand(item.getItemBrand());
            existingItem.setUnitPrice(item.getUnitPrice());
            existingItem.setUnitPrice(item.getUnitPrice());
            existingItem.setStockLevel(item.getStockLevel());
            existingItem.setRackNo(item.getRackNo());
            existingItem.setUpdatedDate(item.getUpdatedDate());


            // Save the updated entity
            return itemRepository.save(existingItem);
        } else {
            throw new RuntimeException("Item not found with ID: " + id);
        }
    }

    @Override
    public void DeleteItemById(Integer id) {
        itemRepository.deleteById(id);
    }
}
