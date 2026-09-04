package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.entity.EventCategory;
import com.jay.academic_event_management.service.EventCategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class EventCategoryController {

    private final EventCategoryService service;

    public EventCategoryController(EventCategoryService service) {
        this.service = service;
    }

    @PostMapping
    public EventCategory addCategory(@RequestBody EventCategory category) {
        return service.saveCategory(category);
    }

    @GetMapping
    public List<EventCategory> getAllCategories() {
        return service.getAllCategories();
    }

    @GetMapping("/{id}")
    public EventCategory getCategory(@PathVariable Long id) {
        return service.getCategory(id);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        service.deleteCategory(id);
    }
}