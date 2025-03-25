package com.prabath_motors.backend.service.stockService;

import com.prabath_motors.backend.dao.Stock.Item_Ctgry;
import com.prabath_motors.backend.repository.Item_CtgryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Item_CtgryServiceImpl implements Item_CtgryService {
    private final Item_CtgryRepository item_CtgryRepository;

    @Autowired
    public Item_CtgryServiceImpl(Item_CtgryRepository item_CtgryRepository) {
        this.item_CtgryRepository = item_CtgryRepository;
    }

    @Override
    public List<Item_Ctgry> getAllItemCtgrys() {
        List<Item_Ctgry> categories = item_CtgryRepository.findAll();
        if (categories.isEmpty()) {
            throw new RuntimeException("No categories found");
        }
        return categories;
    }

    @Override
    public Item_Ctgry getItemCtgryByID(Integer itemCtgryID){
        return item_CtgryRepository.getReferenceById(itemCtgryID);
    }

    @Override
    public Item_Ctgry SaveItemCtgry(Item_Ctgry itemCtgry){
        return item_CtgryRepository.save(itemCtgry);
    }

    @Override
    public Item_Ctgry UpdateItemCtgryDetails(Integer id, Item_Ctgry itemCtgry){
        return item_CtgryRepository.save(itemCtgry);
    }

    @Override
    public void DeleteItemCtgryById(Integer id) {
        item_CtgryRepository.deleteById(id);
    }
}
