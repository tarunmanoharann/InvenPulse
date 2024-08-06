package com.backend.inventory.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.inventory.service.PurchaseOrderService;
import com.backend.inventory.model.PurchaseOrder;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin("*")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @GetMapping
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderService.getAllPurchaseOrders();
    }

    @PostMapping
    public PurchaseOrder addPurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) {
        return purchaseOrderService.addPurchaseOrder(purchaseOrder);
    }
}