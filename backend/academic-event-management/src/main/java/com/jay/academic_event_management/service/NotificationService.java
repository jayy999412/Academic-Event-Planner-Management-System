package com.jay.academic_event_management.service;

import com.jay.academic_event_management.entity.Notification;
import com.jay.academic_event_management.entity.User;
import com.jay.academic_event_management.repository.NotificationRepository;
import com.jay.academic_event_management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public Notification createNotification(User user,
                                           String title,
                                           String message) {

        Notification notification = new Notification();

        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType("GENERAL");
        notification.setStatus("UNREAD");
        notification.setNotificationDate(LocalDateTime.now());

        return notificationRepository.save(notification);
    }

    public Notification createNotificationWithType(User user,
                                                   String title,
                                                   String message,
                                                   String type) {

        Notification notification = new Notification();

        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setStatus("UNREAD");
        notification.setNotificationDate(LocalDateTime.now());

        return notificationRepository.save(notification);
    }

    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id).orElse(null);
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByNotificationDateDesc(user);
    }

    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUserAndStatusOrderByNotificationDateDesc(user, "UNREAD");
    }

    public long countUnreadNotifications(User user) {
        return notificationRepository.countByUserAndStatus(user, "UNREAD");
    }

    public Notification markAsRead(Long id) {

        Notification notification =
                notificationRepository.findById(id).orElse(null);

        if (notification != null) {

            notification.setStatus("READ");

            return notificationRepository.save(notification);

        }

        return null;
    }

    @Transactional
    public void markAllAsRead(User user) {
        notificationRepository.markAllAsReadByUser(user);
    }

    public List<Notification> getNotificationsByType(String type) {
        return notificationRepository.findByTypeOrderByNotificationDateDesc(type);
    }

    public List<Notification> getUserNotificationsByType(User user, String type) {
        return notificationRepository.findByUserAndTypeOrderByNotificationDateDesc(user, type);
    }

    public List<Notification> sendNotificationToAllUsers(String title, String message, String type) {

        List<User> allUsers = userRepository.findAll();

        for (User user : allUsers) {

            createNotificationWithType(user, title, message, type);

        }

        return notificationRepository.findAll();
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
