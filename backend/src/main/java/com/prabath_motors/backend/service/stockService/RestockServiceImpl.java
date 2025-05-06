package com.prabath_motors.backend.service.stockService;

import com.prabath_motors.backend.dao.Stock.Restock;
import com.prabath_motors.backend.repository.RestockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RestockServiceImpl implements RestockService {
    private final RestockRepository restockRepository;

    @Autowired
    public RestockServiceImpl(RestockRepository restockRepository) {
        this.restockRepository = restockRepository;
    }

    @Override
    public List<Restock> getAllRestocks() {
        List<Restock> stocks = restockRepository.findAll();
        if (stocks.isEmpty()) {
            throw new RuntimeException("No stocks found");
        }
        return stocks;
    }

    @Override
    public Restock getRestockByID(Integer restockID) {
        return restockRepository.getReferenceById(restockID);
    }

    @Override
    public Restock SaveRestock(Restock restock){
        return restockRepository.save(restock);
    }

    @Override
    public Restock UpdateRestockDetails(Integer id, Restock restock) {
        Optional<Restock> optionalRestock = restockRepository.findById(id);

        if(optionalRestock.isPresent()){
            Restock existingRestock = optionalRestock.get();

            existingRestock.setItemID(restock.getItemID());
            existingRestock.setSupplierID(restock.getSupplierID());
            existingRestock.setRestockStatus(restock.getRestockStatus());
            existingRestock.setRestockedQty(restock.getRestockedQty());
            existingRestock.setDate(restock.getDate());

            return restockRepository.save(existingRestock);
        }
        else {
            throw new RuntimeException("Restock not found with ID : " + id);
        }
    }

    @Override
    public void DeleteRestockById(Integer id) {
        restockRepository.deleteById(id);
    }
}