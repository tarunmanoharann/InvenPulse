package com.backend.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.inventory.model.Product;
import com.backend.inventory.repository.ProductRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> addProducts(List<Product> products) {
        return productRepository.saveAll(products);
    }

    public List<Product> getProducts() {
        
        return productRepository.findAll();
    }


    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Product updateProduct(Long id, Product product) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Product not found with id " + id);
        }
        product.setProductId(id);
        return productRepository.save(product);
    }

    

    public Product getProduct(Long id) {
        
        if(productRepository.existsById(id))
        {
            return productRepository.findById(id).orElse(null);
           
        }

        return null;
    }

  
    
    



}
