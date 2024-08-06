package com.backend.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.inventory.repository.SaleRepository;
import com.backend.inventory.model.Sale;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;
    

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public Sale addSale(Sale sale) {

        return saleRepository.save(sale);
    }

}