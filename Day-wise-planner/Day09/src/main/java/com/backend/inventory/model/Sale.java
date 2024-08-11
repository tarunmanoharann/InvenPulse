package com.backend.inventory.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.util.Date;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long saleId;
    
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;
    private Date saleDate;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    private double totalPrice;

    
}
