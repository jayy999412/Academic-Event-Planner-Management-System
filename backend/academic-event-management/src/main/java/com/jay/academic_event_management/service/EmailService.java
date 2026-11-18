package com.jay.academic_event_management.service;

import com.jay.academic_event_management.entity.Event;
import com.jay.academic_event_management.entity.Payment;
import com.jay.academic_event_management.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendRegistrationConfirmation(User user, Event event) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Registration Confirmed - " + event.getEventTitle());
            message.setText(
                "Hello " + user.getFullName() + ",\n\n" +
                "Your registration for the event '" + event.getEventTitle() + "' has been received.\n\n" +
                "Event Date: " + event.getEventDate() + "\n" +
                "Venue: " + event.getVenue().getVenueName() + "\n" +
                "Status: Pending Approval\n\n" +
                "You will receive another email once your registration is approved.\n\n" +
                "Best Regards,\nAcademic Event Management System"
            );
            mailSender.send(message);
            log.info("Registration confirmation email sent to {}", user.getEmail());
        } catch (Exception e) {
            log.warn("Failed to send registration confirmation email to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    @Async
    public void sendRegistrationApproved(User user, Event event) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Registration Approved - " + event.getEventTitle());
            message.setText(
                "Hello " + user.getFullName() + ",\n\n" +
                "Your registration for the event '" + event.getEventTitle() + "' has been approved.\n\n" +
                "Event Date: " + event.getEventDate() + "\n" +
                "Venue: " + event.getVenue().getVenueName() + "\n\n" +
                "Please complete the payment to confirm your spot.\n\n" +
                "Best Regards,\nAcademic Event Management System"
            );
            mailSender.send(message);
            log.info("Registration approved email sent to {}", user.getEmail());
        } catch (Exception e) {
            log.warn("Failed to send registration approved email to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    @Async
    public void sendRegistrationRejected(User user, Event event) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Registration Rejected - " + event.getEventTitle());
            message.setText(
                "Hello " + user.getFullName() + ",\n\n" +
                "We regret to inform you that your registration for the event '" + event.getEventTitle() + "' has been rejected.\n\n" +
                "If you believe this is an error, please contact the event coordinator.\n\n" +
                "Best Regards,\nAcademic Event Management System"
            );
            mailSender.send(message);
            log.info("Registration rejected email sent to {}", user.getEmail());
        } catch (Exception e) {
            log.warn("Failed to send registration rejected email to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    @Async
    public void sendPaymentConfirmation(User user, Payment payment, Event event) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Payment Confirmed - " + event.getEventTitle());
            message.setText(
                "Hello " + user.getFullName() + ",\n\n" +
                "Your payment for the event '" + event.getEventTitle() + "' has been received successfully.\n\n" +
                "Amount: Rs. " + payment.getAmount() + "\n" +
                "Transaction ID: " + payment.getTransactionId() + "\n" +
                "Receipt Number: " + payment.getReceiptNumber() + "\n\n" +
                "You can download your receipt from the My Registrations page.\n\n" +
                "Best Regards,\nAcademic Event Management System"
            );
            mailSender.send(message);
            log.info("Payment confirmation email sent to {}", user.getEmail());
        } catch (Exception e) {
            log.warn("Failed to send payment confirmation email to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    @Async
    public void sendCertificateNotification(User user, String certificateNumber, Event event) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Certificate Generated - " + event.getEventTitle());
            message.setText(
                "Hello " + user.getFullName() + ",\n\n" +
                "Your certificate for the event '" + event.getEventTitle() + "' has been generated.\n\n" +
                "Certificate Number: " + certificateNumber + "\n\n" +
                "You can download your certificate from the My Certificates page.\n\n" +
                "Best Regards,\nAcademic Event Management System"
            );
            mailSender.send(message);
            log.info("Certificate notification email sent to {}", user.getEmail());
        } catch (Exception e) {
            log.warn("Failed to send certificate email to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    @Async
    public void sendEventReminder(User user, Event event) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Event Reminder - " + event.getEventTitle());
            message.setText(
                "Hello " + user.getFullName() + ",\n\n" +
                "This is a reminder that the event '" + event.getEventTitle() + "' is scheduled for tomorrow.\n\n" +
                "Event Date: " + event.getEventDate() + "\n" +
                "Event Time: " + event.getEventTime() + "\n" +
                "Venue: " + event.getVenue().getVenueName() + "\n\n" +
                "We look forward to seeing you there!\n\n" +
                "Best Regards,\nAcademic Event Management System"
            );
            mailSender.send(message);
            log.info("Event reminder email sent to {}", user.getEmail());
        } catch (Exception e) {
            log.warn("Failed to send event reminder email to {}: {}", user.getEmail(), e.getMessage());
        }
    }
}
