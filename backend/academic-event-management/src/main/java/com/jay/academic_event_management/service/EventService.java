package com.jay.academic_event_management.service;

import com.jay.academic_event_management.entity.Event;
import com.jay.academic_event_management.entity.User;
import com.jay.academic_event_management.repository.*;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final RegistrationRepository registrationRepository;
    private final CertificateRepository certificateRepository;
    private final AttendanceRepository attendanceRepository;
    private final PaymentRepository paymentRepository;
    private final FeedbackRepository feedbackRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizResultRepository quizResultRepository;
    private final EventGalleryRepository eventGalleryRepository;

    public EventService(EventRepository eventRepository,
                        UserRepository userRepository,
                        NotificationService notificationService,
                        RegistrationRepository registrationRepository,
                        CertificateRepository certificateRepository,
                        AttendanceRepository attendanceRepository,
                        PaymentRepository paymentRepository,
                        FeedbackRepository feedbackRepository,
                        QuizRepository quizRepository,
                        QuestionRepository questionRepository,
                        QuizResultRepository quizResultRepository,
                        EventGalleryRepository eventGalleryRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.registrationRepository = registrationRepository;
        this.certificateRepository = certificateRepository;
        this.attendanceRepository = attendanceRepository;
        this.paymentRepository = paymentRepository;
        this.feedbackRepository = feedbackRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.quizResultRepository = quizResultRepository;
        this.eventGalleryRepository = eventGalleryRepository;
    }

    // Save Event
    public Event saveEvent(Event event) {
        updateEventStatus(event);
        Event saved = eventRepository.save(event);

        // Notify all students about the new event (targeted query instead of loading ALL users)
        List<User> students = userRepository.findAllStudents();
        for (User user : students) {
            notificationService.createNotificationWithType(
                    user,
                    "New Event Published",
                    "A new event '" + saved.getEventTitle()
                            + "' has been published. Register now!",
                    "GENERAL"
            );
        }

        // Notify the admin who created the event
        User currentUser = getCurrentUser();
        if (currentUser != null) {
            notificationService.createNotificationWithType(
                    currentUser,
                    "Event Created",
                    "You have successfully created event '"
                            + saved.getEventTitle() + "'.",
                    "GENERAL"
            );
        }

        return saved;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            return userRepository.findByEmail(auth.getName()).orElse(null);
        }
        return null;
    }

    private void updateEventStatus(Event event) {
        if ("Cancelled".equalsIgnoreCase(event.getStatus())) {
            return;
        }
        LocalDate today = LocalDate.now();
        LocalDate eventDate = event.getEventDate();
        String newStatus;
        if (eventDate.isAfter(today)) {
            newStatus = "Upcoming";
        } else if (eventDate.isEqual(today)) {
            newStatus = "Ongoing";
        } else {
            newStatus = "Completed";
        }
        if (!newStatus.equalsIgnoreCase(event.getStatus())) {
            event.setStatus(newStatus);
            eventRepository.save(event);
        }
    }

    private void updateEventStatuses(List<Event> events) {
        List<Event> changed = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (Event event : events) {
            if ("Cancelled".equalsIgnoreCase(event.getStatus())) {
                continue;
            }
            LocalDate eventDate = event.getEventDate();
            String newStatus;
            if (eventDate.isAfter(today)) {
                newStatus = "Upcoming";
            } else if (eventDate.isEqual(today)) {
                newStatus = "Ongoing";
            } else {
                newStatus = "Completed";
            }
            if (!newStatus.equalsIgnoreCase(event.getStatus())) {
                event.setStatus(newStatus);
                changed.add(event);
            }
        }
        if (!changed.isEmpty()) {
            eventRepository.saveAll(changed);
        }
    }

    // Update Event
    public Event updateEvent(Long id, Event updatedEvent) {

        Event event = eventRepository.findById(id).orElse(null);

        if (event != null) {

            event.setEventTitle(updatedEvent.getEventTitle());
            event.setDescription(updatedEvent.getDescription());
            event.setEventDate(updatedEvent.getEventDate());
            event.setEventTime(updatedEvent.getEventTime());
            event.setRegistrationDeadline(updatedEvent.getRegistrationDeadline());
            event.setMaxParticipants(updatedEvent.getMaxParticipants());
            event.setStatus(updatedEvent.getStatus());
            event.setPaymentRequired(updatedEvent.getPaymentRequired());
            event.setRegistrationFee(updatedEvent.getRegistrationFee());
            event.setBannerImage(updatedEvent.getBannerImage());
            event.setQuizRequired(updatedEvent.getQuizRequired());
            event.setOrganizer(updatedEvent.getOrganizer());
            event.setFacultyCoordinatorName(updatedEvent.getFacultyCoordinatorName());
            event.setFacultyCoordinatorEmail(updatedEvent.getFacultyCoordinatorEmail());
            event.setVenue(updatedEvent.getVenue());
            event.setCategory(updatedEvent.getCategory());

            updateEventStatus(event);
            return eventRepository.save(event);
        }

        return null;
    }

    // Get All Events
    public List<Event> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        updateEventStatuses(events);
        return events;
    }

    // Get Event By ID
    public Event getEventById(Long id) {
        Event event = eventRepository.findById(id).orElse(null);
        if (event != null) {
            updateEventStatus(event);
        }
        return event;
    }

    // Delete Event
    @Transactional
    public void deleteEvent(Long id) {
        // Delete child records first (order matters)
        quizResultRepository.deleteAllByQuizEventId(id);
        questionRepository.deleteAllByQuizEventId(id);
        quizRepository.deleteAllByEventId(id);
        eventGalleryRepository.deleteAllByEventId(id);
        feedbackRepository.deleteAllByRegistrationEventId(id);
        certificateRepository.deleteAllByRegistrationEventId(id);
        attendanceRepository.deleteAllByRegistrationEventId(id);
        paymentRepository.deleteAllByRegistrationEventId(id);
        registrationRepository.deleteAllByEventId(id);
        eventRepository.deleteById(id);
    }

    // Search Event
    public List<Event> searchEvents(String keyword) {
        List<Event> events = eventRepository.findByEventTitleContainingIgnoreCase(keyword);
        updateEventStatuses(events);
        return events;
    }

    // Pagination
    public Page<Event> getEventsByPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Event> eventPage = eventRepository.findAll(pageable);
        updateEventStatuses(eventPage.getContent());
        return eventPage;
    }

    // Sorting
    public List<Event> getEventsSorted(String field) {
        List<Event> events = eventRepository.findAll(Sort.by(Sort.Direction.ASC, field));
        updateEventStatuses(events);
        return events;
    }

    // Get Completed Events
    public List<Event> getCompletedEvents() {
        List<Event> events = eventRepository.findAll();
        updateEventStatuses(events);
        return events.stream()
                .filter(e -> "Completed".equalsIgnoreCase(e.getStatus()))
                .sorted((a, b) -> b.getEventDate().compareTo(a.getEventDate()))
                .toList();
    }
}