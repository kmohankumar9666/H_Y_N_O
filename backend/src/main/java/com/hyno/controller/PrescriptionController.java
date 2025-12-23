package com.hyno.controller;

import com.hyno.entity.Prescription;
import com.hyno.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173"})
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    private static final String UPLOAD_DIR = "uploads/prescriptions/";

    @GetMapping
    public ResponseEntity<List<Prescription>> getAllPrescriptions() {
        List<Prescription> prescriptions = prescriptionService.getAllPrescriptions();
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable String id) {
        Optional<Prescription> prescription = prescriptionService.getPrescriptionById(id);
        return prescription.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByPatientId(@PathVariable String patientId) {
        List<Prescription> prescriptions = prescriptionService.getPrescriptionsByPatientId(patientId);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByDoctorId(@PathVariable String doctorId) {
        List<Prescription> prescriptions = prescriptionService.getPrescriptionsByDoctorId(doctorId);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByStatus(@PathVariable String status) {
        List<Prescription> prescriptions = prescriptionService.getPrescriptionsByStatus(status);
        return ResponseEntity.ok(prescriptions);
    }

    @PostMapping
    public ResponseEntity<Prescription> createPrescription(@RequestBody Prescription prescription) {
        Prescription createdPrescription = prescriptionService.createPrescription(prescription);
        return ResponseEntity.ok(createdPrescription);
    }

    @PostMapping("/upload")
    public ResponseEntity<Prescription> uploadPrescription(
            @RequestParam("patientId") String patientId,
            @RequestParam("patientName") String patientName,
            @RequestParam("doctorId") String doctorId,
            @RequestParam("doctorName") String doctorName,
            @RequestParam("medicines") List<String> medicines,
            @RequestParam("notes") String notes,
            @RequestParam("file") MultipartFile file) {

        try {
            // Create uploads directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            // Create prescription entity
            Prescription prescription = new Prescription();
            prescription.setId(UUID.randomUUID().toString());
            prescription.setPatientId(patientId);
            prescription.setPatientName(patientName);
            prescription.setDoctorId(doctorId);
            prescription.setDoctorName(doctorName);
            prescription.setMedicines(String.join(", ", medicines));
            prescription.setNotes(notes);
            prescription.setFilePath("/uploads/prescriptions/" + fileName);
            prescription.setStatus(Prescription.PrescriptionStatus.PENDING);

            Prescription savedPrescription = prescriptionService.createPrescription(prescription);
            return ResponseEntity.ok(savedPrescription);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Prescription> updatePrescriptionStatus(@PathVariable String id, @RequestBody String status) {
        Prescription updatedPrescription = prescriptionService.updatePrescriptionStatus(id, status);
        if (updatedPrescription != null) {
            return ResponseEntity.ok(updatedPrescription);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable String id) {
        boolean deleted = prescriptionService.deletePrescription(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
