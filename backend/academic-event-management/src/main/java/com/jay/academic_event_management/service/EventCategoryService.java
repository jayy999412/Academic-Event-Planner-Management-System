package com.jay.academic_event_management.service;

import com.jay.academic_event_management.entity.EventCategory;
import com.jay.academic_event_management.repository.EventCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventCategoryService {

    private final EventCategoryRepository repository;

    public EventCategoryService(EventCategoryRepository repository) {
        this.repository = repository;
    }

    public EventCategory saveCategory(EventCategory category) {
        return repository.save(category);
    }

    public List<EventCategory> getAllCategories() {
        return repository.findAll();
    }

    public EventCategory getCategory(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteCategory(Long id) {
        repository.deleteById(id);
    }
}