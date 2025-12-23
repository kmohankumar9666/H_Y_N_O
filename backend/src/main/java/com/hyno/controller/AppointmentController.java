package com.hyno.controller;

import com.hyno.entity.Appointment;
import com.hyno.service.AppointmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

// DTO for appointment creation
class AppointmentCreateDTO {
    private String patientId;
    private String patientName;
    private String doctorId;
    private String doctorName;
    private String hospitalId;
    private Appointment.AppointmentType type;
    private LocalDate appointmentDate;
    private java.time.LocalTime appointmentTime;
    private Appointment.AppointmentStatus status;
    private String reason;

    // Getters and setters
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getHospitalId() { return hospitalId; }
    public void setHospitalId(String hospitalId) { this.hospitalId = hospitalId; }

    public Appointment.AppointmentType getType() { return type; }
    public void setType(Appointment.AppointmentType type) { this.type = type; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public java.time.LocalTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(java.time.LocalTime appointmentTime) { this.appointmentTime = appointmentTime; }

    public Appointment.AppointmentStatus getStatus() { return status; }
    public void setStatus(Appointment.AppointmentStatus status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}

@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class AppointmentController {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentController.class);

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private com.hyno.service.ChatService chatService;

    @GetMapping
    public List<Appointment> getAllAppointments() {
        logger.info("Fetching all appointments");
        try {
            List<Appointment> appointments = appointmentService.getAllAppointments();
            logger.info("Retrieved {} appointments", appointments.size());
            return appointments;
        } catch (Exception e) {
            logger.error("Error fetching all appointments", e);
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable String id) {
        logger.info("Fetching appointment by ID: {}", id);
        try {
            Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
            if (appointment.isPresent()) {
                logger.info("Appointment found: {}", id);
            } else {
                logger.warn("Appointment not found: {}", id);
            }
            return appointment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error fetching appointment by ID: {}", id, e);
            throw e;
        }
    }

    @GetMapping("/patient/{patientId}")
    public List<Appointment> getAppointmentsByPatient(@PathVariable String patientId) {
        logger.info("Fetching appointments for patient: {}", patientId);
        try {
            List<Appointment> appointments = appointmentService.getAppointmentsByPatient(patientId);
            logger.info("Retrieved {} appointments for patient: {}", appointments.size(), patientId);
            return appointments;
        } catch (Exception e) {
            logger.error("Error fetching appointments for patient: {}", patientId, e);
            throw e;
        }
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getAppointmentsByDoctor(@PathVariable String doctorId) {
        logger.info("Fetching appointments for doctor: {}", doctorId);
        try {
            List<Appointment> appointments = appointmentService.getAppointmentsByDoctor(doctorId);
            logger.info("Retrieved {} appointments for doctor: {}", appointments.size(), doctorId);
            return appointments;
        } catch (Exception e) {
            logger.error("Error fetching appointments for doctor: {}", doctorId, e);
            throw e;
        }
    }

    @GetMapping("/hospital/{hospitalId}")
    public List<Appointment> getAppointmentsByHospital(@PathVariable String hospitalId) {
        logger.info("Fetching appointments for hospital: {}", hospitalId);
        try {
            List<Appointment> appointments = appointmentService.getAppointmentsByHospital(hospitalId);
            logger.info("Retrieved {} appointments for hospital: {}", appointments.size(), hospitalId);
            return appointments;
        } catch (Exception e) {
            logger.error("Error fetching appointments for hospital: {}", hospitalId, e);
            throw e;
        }
    }

    @GetMapping("/status/{status}")
    public List<Appointment> getAppointmentsByStatus(@PathVariable Appointment.AppointmentStatus status) {
        logger.info("Fetching appointments by status: {}", status);
        try {
            List<Appointment> appointments = appointmentService.getAppointmentsByStatus(status);
            logger.info("Retrieved {} appointments with status: {}", appointments.size(), status);
            return appointments;
        } catch (Exception e) {
            logger.error("Error fetching appointments by status: {}", status, e);
            throw e;
        }
    }

    @GetMapping("/date/{date}")
    public List<Appointment> getAppointmentsByDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        logger.info("Fetching appointments by date: {}", date);
        try {
            List<Appointment> appointments = appointmentService.getAppointmentsByDate(date);
            logger.info("Retrieved {} appointments for date: {}", appointments.size(), date);
            return appointments;
        } catch (Exception e) {
            logger.error("Error fetching appointments by date: {}", date, e);
            throw e;
        }
    }

    @GetMapping("/upcoming")
    public List<Appointment> getUpcomingAppointments(@RequestParam String userId, @RequestParam String userType) {
        logger.info("Fetching upcoming appointments for {}: {}", userType, userId);
        try {
            List<Appointment> appointments;
            if ("patient".equals(userType)) {
                appointments = appointmentService.getUpcomingAppointmentsByPatient(userId);
            } else if ("doctor".equals(userType)) {
                appointments = appointmentService.getUpcomingAppointmentsByDoctor(userId);
            } else {
                logger.warn("Invalid userType: {}", userType);
                return List.of();
            }
            logger.info("Retrieved {} upcoming appointments for {}: {}", appointments.size(), userType, userId);
            return appointments;
        } catch (Exception e) {
            logger.error("Error fetching upcoming appointments for {}: {}", userType, userId, e);
            throw e;
        }
    }

    @PostMapping
    public Appointment createAppointment(@RequestBody Map<String, Object> request) {
        logger.info("Creating new appointment");
        try {
            // Convert request map to Appointment entity
            Appointment appointment = new Appointment();

            // Set basic fields
            appointment.setPatientName((String) request.get("patientName"));
            appointment.setDoctorName((String) request.get("doctorName"));
            appointment.setType(Appointment.AppointmentType.valueOf(((String) request.get("type")).toUpperCase()));
            appointment.setAppointmentDate(LocalDate.parse((String) request.get("appointmentDate")));
            appointment.setAppointmentTime(java.time.LocalTime.parse((String) request.get("appointmentTime")));
            appointment.setStatus(Appointment.AppointmentStatus.valueOf(((String) request.get("status")).toUpperCase()));
            appointment.setReason((String) request.get("reason"));

            // Set IDs for validation from nested objects
            if (request.get("patient") != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> patientMap = (Map<String, Object>) request.get("patient");
                if (patientMap.get("id") != null) {
                    com.hyno.entity.Patient patient = new com.hyno.entity.Patient();
                    patient.setId((String) patientMap.get("id"));
                    appointment.setPatient(patient);
                }
            }

            if (request.get("doctor") != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> doctorMap = (Map<String, Object>) request.get("doctor");
                if (doctorMap.get("id") != null) {
                    com.hyno.entity.Doctor doctor = new com.hyno.entity.Doctor();
                    doctor.setId((String) doctorMap.get("id"));
                    appointment.setDoctor(doctor);
                }
            }

            if (request.get("hospital") != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> hospitalMap = (Map<String, Object>) request.get("hospital");
                if (hospitalMap != null && hospitalMap.get("id") != null) {
                    com.hyno.entity.Hospital hospital = new com.hyno.entity.Hospital();
                    hospital.setId((String) hospitalMap.get("id"));
                    appointment.setHospital(hospital);
                }
            }

            // Handle schedule slot reservation
            if (request.get("scheduleSlot") != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> slotMap = (Map<String, Object>) request.get("scheduleSlot");
                if (slotMap.get("id") != null) {
                    com.hyno.entity.ScheduleSlot slot = new com.hyno.entity.ScheduleSlot();
                    slot.setId(Long.valueOf(slotMap.get("id").toString()));
                    appointment.setScheduleSlot(slot);
                }
            }

            Appointment createdAppointment = appointmentService.createAppointment(appointment);
            logger.info("Appointment created successfully with ID: {}", createdAppointment.getId());
            return createdAppointment;
        } catch (IllegalArgumentException e) {
            logger.error("Validation error creating appointment: {}", e.getMessage());
            throw new IllegalArgumentException(e.getMessage());
        } catch (Exception e) {
            logger.error("Error creating appointment", e);
            throw e;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable String id, @RequestBody Map<String, Object> updateRequest) {
        logger.info("Updating appointment with ID: {}", id);
        try {
            // Get existing appointment
            Optional<Appointment> optionalAppointment = appointmentService.getAppointmentById(id);
            if (optionalAppointment.isEmpty()) {
                logger.warn("Appointment not found for update: {}", id);
                return ResponseEntity.notFound().build();
            }

            Appointment appointment = optionalAppointment.get();

            // Update only the fields that are provided
            if (updateRequest.get("status") != null) {
                String statusStr = (String) updateRequest.get("status");
                appointment.setStatus(Appointment.AppointmentStatus.valueOf(statusStr.toUpperCase()));
            }
            if (updateRequest.get("notes") != null) {
                appointment.setNotes((String) updateRequest.get("notes"));
            }
            if (updateRequest.get("prescription") != null) {
                appointment.setPrescription((String) updateRequest.get("prescription"));
            }
            if (updateRequest.get("reason") != null) {
                appointment.setReason((String) updateRequest.get("reason"));
            }

            Appointment updatedAppointment = appointmentService.updateAppointment(id, appointment);
            logger.info("Appointment updated successfully: {}", id);
            return ResponseEntity.ok(updatedAppointment);
        } catch (Exception e) {
            logger.error("Error updating appointment: {}", id, e);
            throw e;
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable String id) {
        logger.info("Cancelling appointment with ID: {}", id);
        try {
            Appointment cancelledAppointment = appointmentService.cancelAppointment(id);
            if (cancelledAppointment != null) {
                logger.info("Appointment cancelled successfully: {}", id);
                return ResponseEntity.ok(cancelledAppointment);
            } else {
                logger.warn("Appointment not found for cancellation: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error cancelling appointment: {}", id, e);
            throw e;
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Appointment> completeAppointment(@PathVariable String id) {
        logger.info("Completing appointment with ID: {}", id);
        try {
            Appointment completedAppointment = appointmentService.completeAppointment(id);
            if (completedAppointment != null) {
                logger.info("Appointment completed successfully: {}", id);
                return ResponseEntity.ok(completedAppointment);
            } else {
                logger.warn("Appointment not found for completion: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error completing appointment: {}", id, e);
            throw e;
        }
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<Appointment> confirmAppointment(@PathVariable String id) {
        logger.info("Confirming appointment with ID: {}", id);
        try {
            Appointment confirmedAppointment = appointmentService.confirmAppointment(id);
            if (confirmedAppointment != null) {
                logger.info("Appointment confirmed successfully: {}", id);
                return ResponseEntity.ok(confirmedAppointment);
            } else {
                logger.warn("Appointment not found for confirmation: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error confirming appointment: {}", id, e);
            throw e;
        }
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<Appointment> rescheduleAppointment(@PathVariable String id, @RequestBody Map<String, Object> rescheduleRequest) {
        logger.info("Rescheduling appointment with ID: {}", id);
        try {
            String dateStr = (String) rescheduleRequest.get("appointmentDate");
            String timeStr = (String) rescheduleRequest.get("appointmentTime");

            if (dateStr == null || timeStr == null) {
                logger.error("Missing date or time for rescheduling appointment: {}", id);
                return ResponseEntity.badRequest().build();
            }

            LocalDate newDate = LocalDate.parse(dateStr);
            java.time.LocalTime newTime = java.time.LocalTime.parse(timeStr);

            Appointment rescheduledAppointment = appointmentService.rescheduleAppointment(id, newDate, newTime);
            if (rescheduledAppointment != null) {
                logger.info("Appointment rescheduled successfully: {}", id);
                return ResponseEntity.ok(rescheduledAppointment);
            } else {
                logger.warn("Appointment not found for rescheduling: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error rescheduling appointment: {}", id, e);
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable String id) {
        logger.info("Deleting appointment: {}", id);
        try {
            appointmentService.deleteAppointment(id);
            logger.info("Appointment deleted successfully: {}", id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting appointment: {}", id, e);
            throw e;
        }
    }

    // Chat-related endpoints
    @PostMapping("/{id}/chat-room")
    public ResponseEntity<?> createChatRoom(@PathVariable String id) {
        logger.info("Creating chat room for appointment: {}", id);
        try {
            Object chatRoom = chatService.createChatRoomForAppointment(id);
            logger.info("Chat room created for appointment: {}", id);
            return ResponseEntity.ok(chatRoom);
        } catch (Exception e) {
            logger.error("Error creating chat room for appointment: {}", id, e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
