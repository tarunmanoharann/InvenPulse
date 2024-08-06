package com.backend.inventory.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.inventory.model.Product;
import com.backend.inventory.model.Sale;
import com.backend.inventory.model.User;
import com.backend.inventory.service.ProductService;
import com.backend.inventory.service.SaleService;
import com.backend.inventory.service.UserService;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin("*")
public class SaleController {

    @Autowired
    private SaleService saleService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Sale> getAllSales() {
        return saleService.getAllSales();
    }

    @PostMapping
    public ResponseEntity<Sale> createSale(@RequestBody Map<String, Object> saleData) {
        try {
            Long productId = ((Number) saleData.get("productId")).longValue();
            Long userId = ((Number) saleData.get("userId")).longValue();
            int quantity = (int) saleData.get("quantity");
            double totalPrice = ((Number) saleData.get("totalPrice")).doubleValue();
            Date saleDate = new SimpleDateFormat("yyyy-MM-dd").parse((String) saleData.get("saleDate"));

            Product product = productService.getProduct(productId);
            if (product == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            User user = userService.getUser(userId);
            if (user == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            Sale sale = new Sale();
            sale.setProduct(product);
            sale.setUser(user);
            sale.setQuantity(quantity);
            sale.setSaleDate(saleDate);
            sale.setTotalPrice(totalPrice);

            Sale createdSale = saleService.addSale(sale);
            return new ResponseEntity<>(createdSale, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
