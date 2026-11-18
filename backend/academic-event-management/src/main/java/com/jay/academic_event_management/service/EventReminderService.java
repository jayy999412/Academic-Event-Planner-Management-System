package com.jay.academic_event_management.service;

import com.jay.academic_event_management.entity.Event;
import com.jay.academic_event_management.entity.Registration;
import com.jay.academic_event_management.repository.EventRepository;
import com.jay.academic_event_management.repository.RegistrationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EventReminderService {

    private static final Logger log = LoggerFactory.getLogger(EventReminderService.class);

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final EmailService emailService;

    public EventReminderService(EventRepository eventRepository,
                                 RegistrationRepository registrationRepository,
                                 EmailService emailService) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.emailService = emailService;
    }

    @Scheduled(cron = "0 0 18 * * *")
    public void sendEventReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);

        List<Event> upcomingEvents = eventRepository.findByEventDate(tomorrow);

        for (Event event : upcomingEvents) {
            List<Registration> registrations = registrationRepository
                    .findByEventId(event.getId());

            for (Registration reg : registrations) {
                if ("Approved".equalsIgnoreCase(reg.getStatus())) {
                    emailService.sendEventReminder(reg.getUser(), event);
                }
            }
            log.info("Sent reminders for event: {}", event.getEventTitle());
        }
    }
}
