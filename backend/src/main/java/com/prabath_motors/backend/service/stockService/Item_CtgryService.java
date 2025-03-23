package com.prabath_motors.backend.service.stockService;

import com.prabath_motors.backend.dao.Stock.Item_Ctgry;

import java.util.List;

public interface Item_CtgryService {
    public List<Item_Ctgry> getAllItemCtgrys();
    public Item_Ctgry getItemCtgryByID(Integer itemCtgryID);
    public Item_Ctgry SaveItemCtgry(Item_Ctgry itemCtgry);
    public Item_Ctgry UpdateItemCtgryDetails(Integer id, Item_Ctgry itemCtgry);
    public void DeleteItemCtgryById(Integer id);
}
