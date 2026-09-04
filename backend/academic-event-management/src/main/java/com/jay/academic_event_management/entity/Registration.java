package com.jay.academic_event_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "registrations", indexes = {
        @Index(name = "idx_reg_user_id", columnList = "user_id"),
        @Index(name = "idx_reg_event_id", columnList = "event_id"),
        @Index(name = "idx_reg_status", columnList = "status")
})
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime registrationDate;

    // Pending / Approved / Rejected / Cancelled
    @Column(nullable = false)
    private String status;

    // Pending / Paid
    @Column(nullable = false)
    private String paymentStatus;

    // Not Marked / Present / Absent
    @Column(nullable = false)
    private String attendanceStatus;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password"})
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Event event;

    @Transient
    private boolean certificateEligible;

    public boolean isCertificateEligible() {

        return "Approved".equalsIgnoreCase(status)
                && "Present".equalsIgnoreCase(attendanceStatus);

    }

    @PrePersist
    public void prePersist() {

        registrationDate = LocalDateTime.now();

        if (status == null)
            status = "Pending";

        if (paymentStatus == null)
            paymentStatus = "Pending";

        if (attendanceStatus == null)
            attendanceStatus = "Not Marked";
    }
}
