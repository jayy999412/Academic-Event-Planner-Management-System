package com.jay.academic_event_management.service;

import com.jay.academic_event_management.entity.Attendance;
import com.jay.academic_event_management.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    // Save Attendance
    public Attendance saveAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    // Get All Attendance Records
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    // Get Attendance By ID
    public Attendance getAttendanceById(Long id) {
        return attendanceRepository.findById(id).orElse(null);
    }

    // Delete Attendance
    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }
}