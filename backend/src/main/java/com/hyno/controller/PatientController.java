package com.hyno.controller;

import com.hyno.entity.Patient;
import com.hyno.service.PatientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/patients")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002","http://localhost:5173"})
public class PatientController {

    private static final Logger logger = LoggerFactory.getLogger(PatientController.class);

    @Autowired
    private PatientService patientService;

    // Get all patients with pagination and search
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search) {

        logger.info("Getting all patients - page: {}, size: {}, sortBy: {}, sortDir: {}, search: {}",
                   page, size, sortBy, sortDir, search);

        try {
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            Page<Patient> patients = patientService.getAllPatients(pageable, search);

            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            logger.error("Error getting all patients", e);
            return ResponseEntity.badRequest().body("Error retrieving patients: " + e.getMessage());
        }
    }

    // Get patient by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PATIENT') and #id == authentication.principal.id) or hasRole('DOCTOR')")
    public ResponseEntity<?> getPatientById(@PathVariable String id) {
        logger.info("Getting patient by ID: {}", id);

        try {
            Optional<Patient> patient = patientService.getPatientById(id);
            if (patient.isPresent()) {
                return ResponseEntity.ok(patient.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error getting patient by ID: {}", id, e);
            return ResponseEntity.badRequest().body("Error retrieving patient: " + e.getMessage());
        }
    }

    // Create new patient
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createPatient(@RequestBody Patient patient) {
        logger.info("Creating new patient: {}", patient.getEmail());

        try {
            Patient savedPatient = patientService.createPatient(patient);
            return ResponseEntity.ok(savedPatient);
        } catch (Exception e) {
            logger.error("Error creating patient: {}", patient.getEmail(), e);
            return ResponseEntity.badRequest().body("Error creating patient: " + e.getMessage());
        }
    }

    // Update patient
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('PATIENT') and #id == authentication.principal.id)")
    public ResponseEntity<?> updatePatient(@PathVariable String id, @RequestBody Patient patientDetails) {
        logger.info("Updating patient: {}", id);

        try {
            Patient updatedPatient = patientService.updatePatient(id, patientDetails);
            if (updatedPatient != null) {
                return ResponseEntity.ok(updatedPatient);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error updating patient: {}", id, e);
            return ResponseEntity.badRequest().body("Error updating patient: " + e.getMessage());
        }
    }

    // Delete patient
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePatient(@PathVariable String id) {
        logger.info("Deleting patient: {}", id);

        try {
            patientService.deletePatient(id);
            return ResponseEntity.ok("Patient deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting patient: {}", id, e);
            return ResponseEntity.badRequest().body("Error deleting patient: " + e.getMessage());
        }
    }

    // Search patients
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<?> searchPatients(@RequestParam String query) {
        logger.info("Searching patients with query: {}", query);

        try {
            List<Patient> patients = patientService.searchPatients(query);
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            logger.error("Error searching patients with query: {}", query, e);
            return ResponseEntity.badRequest().body("Error searching patients: " + e.getMessage());
        }
    }
}
