package com.invenpulse.controller;

import com.invenpulse.model.Category;
import com.invenpulse.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @GetMapping("/root")
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public List<Category> getRootCategories() {
        return categoryRepository.findByParentIsNull();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return ResponseEntity.ok(category);
    }

    @GetMapping("/{id}/subcategories")
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public List<Category> getSubcategories(@PathVariable Long id) {
        return categoryRepository.findByParentId(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Category> createCategory(@Valid @RequestBody Category category) {
        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new RuntimeException("Category name already exists");
        }
        
        // Validate parent category if provided
        if (category.getParent() != null && category.getParent().getId() != null) {
            categoryRepository.findById(category.getParent().getId())
                .orElseThrow(() -> new RuntimeException("Parent category not found"));
        }
        
        Category savedCategory = categoryRepository.save(category);
        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @Valid @RequestBody Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        
        // Check if name is being changed and if it already exists
        if (!category.getName().equalsIgnoreCase(categoryDetails.getName()) && 
            categoryRepository.existsByNameIgnoreCase(categoryDetails.getName())) {
            throw new RuntimeException("Category name already exists");
        }
        
        // Validate parent category if provided
        if (categoryDetails.getParent() != null && categoryDetails.getParent().getId() != null) {
            // Prevent circular reference
            if (categoryDetails.getParent().getId().equals(id)) {
                throw new RuntimeException("Category cannot be its own parent");
            }
            
            categoryRepository.findById(categoryDetails.getParent().getId())
                .orElseThrow(() -> new RuntimeException("Parent category not found"));
        }
        
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        category.setParent(categoryDetails.getParent());
        category.setStatus(categoryDetails.getStatus());
        
        Category updatedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> deleteCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        
        // Check if category has subcategories
        List<Category> subcategories = categoryRepository.findByParentId(id);
        if (!subcategories.isEmpty()) {
            throw new RuntimeException("Cannot delete category with subcategories");
        }
        
        categoryRepository.delete(category);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}