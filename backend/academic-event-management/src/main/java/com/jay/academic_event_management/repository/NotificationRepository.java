package com.jay.academic_event_management.repository;

import com.jay.academic_event_management.entity.Notification;
import com.jay.academic_event_management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByNotificationDateDesc(User user);

    List<Notification> findByUserAndStatusOrderByNotificationDateDesc(
            User user,
            String status
    );

    long countByUserAndStatus(
            User user,
            String status
    );

    List<Notification> findByTypeOrderByNotificationDateDesc(String type);

    List<Notification> findByUserAndTypeOrderByNotificationDateDesc(
            User user,
            String type
    );

    @Modifying
    @Query("UPDATE Notification n SET n.status = 'READ' WHERE n.user = :user AND n.status = 'UNREAD'")
    void markAllAsReadByUser(User user);

    long countByStatus(String status);
}
