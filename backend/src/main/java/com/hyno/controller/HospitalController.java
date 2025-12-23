package com.hyno.controller;

import com.hyno.entity.ScheduleSlot;
import com.hyno.service.DoctorService;
import com.hyno.service.HospitalService;
import com.hyno.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/hospitals")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<com.hyno.entity.Hospital>> getAllHospitals() {
        try {
            List<com.hyno.entity.Hospital> hospitals = hospitalService.getAllHospitals();
            return ResponseEntity.ok(hospitals);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{hospitalId}/doctors")
    public ResponseEntity<List<com.hyno.entity.Doctor>> getDoctorsByHospital(@PathVariable String hospitalId) {
        try {
            List<com.hyno.entity.Doctor> doctors = doctorService.getDoctorsByHospital(hospitalId);
            return ResponseEntity.ok(doctors);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{hospitalId}/patients")
    public ResponseEntity<List<com.hyno.entity.Patient>> getPatientsByHospital(@PathVariable String hospitalId) {
        try {
            List<com.hyno.entity.Patient> patients = hospitalService.getHospitalPatients(hospitalId);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{hospitalId}/reports/overview")
    public ResponseEntity<Map<String, Object>> getHospitalOverviewReport(
            @PathVariable String hospitalId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            Map<String, Object> report = hospitalService.generateHospitalOverviewReport(hospitalId, startDate, endDate);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Hospital Schedule
    @GetMapping("/{hospitalId}/schedule-slots")
    public ResponseEntity<Map<String, Object>> getHospitalSchedule(@PathVariable String hospitalId) {
        try {
            Map<String, Object> scheduleData = new HashMap<>();
            scheduleData.put("hospitalId", hospitalId);

            // Get available slots from today onwards
            LocalDate today = LocalDate.now();
            List<ScheduleSlot> availableSlots = scheduleService.getAvailableSlotsByHospitalAndDate(hospitalId, today);

            // Convert to the expected format
            List<Map<String, Object>> slotsData = availableSlots.stream()
                .map(slot -> Map.<String, Object>of(
                    "id", slot.getId().toString(),
                    "date", slot.getSlotDate().toString(),
                    "startTime", slot.getStartTime().toString(),
                    "endTime", slot.getEndTime().toString(),
                    "isAvailable", slot.isAvailable(),
                    "maxAppointments", slot.getMaxAppointments(),
                    "appointmentType", slot.getSchedule().getAppointmentType().toString().toLowerCase(),
                    "notes", slot.getNotes(),
                    "availableSpots", slot.getAvailableSpots()
                ))
                .collect(Collectors.toList());

            scheduleData.put("availableSlots", slotsData);

            // Get weekly schedule pattern (mock for now, could be derived from schedules)
            scheduleData.put("weeklySchedule", Map.of(
                "monday", List.of("08:00-18:00"),
                "tuesday", List.of("08:00-18:00"),
                "wednesday", List.of("08:00-18:00"),
                "thursday", List.of("08:00-18:00"),
                "friday", List.of("08:00-18:00"),
                "saturday", List.of("09:00-14:00"),
                "sunday", List.of("10:00-16:00")
            ));

            return ResponseEntity.ok(scheduleData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
