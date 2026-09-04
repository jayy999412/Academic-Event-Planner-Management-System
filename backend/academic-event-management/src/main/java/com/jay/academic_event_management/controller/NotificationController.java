package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.dto.NotificationRequest;
import com.jay.academic_event_management.entity.Notification;
import com.jay.academic_event_management.entity.User;
import com.jay.academic_event_management.service.NotificationService;
import com.jay.academic_event_management.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Notification createNotification(
            @RequestBody Notification notification) {

        return notificationService.saveNotification(notification);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    @GetMapping("/{id}")
    public Notification getNotificationById(@PathVariable Long id) {
        return notificationService.getNotificationById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Notification> getUserNotifications(
            @PathVariable Long userId) {

        User user = userService.getUserById(userId);

        return notificationService.getUserNotifications(user);
    }

    @GetMapping("/user/{userId}/unread")
    public List<Notification> getUnreadNotifications(
            @PathVariable Long userId) {

        User user = userService.getUserById(userId);

        return notificationService.getUnreadNotifications(user);
    }

    @GetMapping("/user/{userId}/count")
    public long countUnreadNotifications(
            @PathVariable Long userId) {

        User user = userService.getUserById(userId);

        return notificationService.countUnreadNotifications(user);
    }

    @GetMapping("/type/{type}")
    public List<Notification> getNotificationsByType(
            @PathVariable String type) {

        return notificationService.getNotificationsByType(type);
    }

    @GetMapping("/user/{userId}/type/{type}")
    public List<Notification> getUserNotificationsByType(
            @PathVariable Long userId,
            @PathVariable String type) {

        User user = userService.getUserById(userId);

        return notificationService.getUserNotificationsByType(user, type);
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }

    @PutMapping("/user/{userId}/read-all")
    public String markAllAsRead(@PathVariable Long userId) {

        User user = userService.getUserById(userId);

        notificationService.markAllAsRead(user);

        return "All notifications marked as read";
    }

    @PostMapping("/send-to-all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Notification> sendNotificationToAll(
            @RequestBody NotificationRequest request) {

        String type = request.getType() != null
                ? request.getType()
                : "GENERAL";

        return notificationService.sendNotificationToAllUsers(
                request.getTitle(),
                request.getMessage(),
                type
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
    }
}