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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/prescriptions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173"})
public class PharmacyController {

    @Autowired
    private PrescriptionService prescriptionService;

    private static final String UPLOAD_DIR = "uploads/prescriptions/";

    // DTO for simplified prescription view
    public static class PrescriptionDTO {
        private String id;
        private String patientName;
        private String doctorName;
        private String date;
        private String status;
        private String filePath;

        public PrescriptionDTO(String id, String patientName, String doctorName, String date, String status, String filePath) {
            this.id = id;
            this.patientName = patientName;
            this.doctorName = doctorName;
            this.date = date;
            this.status = status;
            this.filePath = filePath;
        }

        // Getters
        public String getId() { return id; }
        public String getPatientName() { return patientName; }
        public String getDoctorName() { return doctorName; }
        public String getDate() { return date; }
        public String getStatus() { return status; }
        public String getFilePath() { return filePath; }
    }

    @PostMapping("/upload")
    public ResponseEntity<PrescriptionDTO> uploadPrescription(
            @RequestParam("file") MultipartFile file,
            @RequestParam("patientId") String patientId,
            @RequestParam("patientName") String patientName,
            @RequestParam("doctorId") String doctorId,
            @RequestParam("doctorName") String doctorName,
            @RequestParam("medicines") String medicines,
            @RequestParam("notes") String notes) {
        try {
            // Ensure upload directory exists
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".png";
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);

            // Save file
            Files.copy(file.getInputStream(), filePath);

            // Create prescription entity
            Prescription prescription = new Prescription();
            prescription.setId(UUID.randomUUID().toString());
            prescription.setPatientId(patientId);
            prescription.setPatientName(patientName);
            prescription.setDoctorId(doctorId);
            prescription.setDoctorName(doctorName);
            prescription.setFilePath("/uploads/prescriptions/" + filename);
            prescription.setMedicines(medicines);
            prescription.setNotes(notes);
            prescription.setStatus(Prescription.PrescriptionStatus.PENDING);

            Prescription savedPrescription = prescriptionService.save(prescription);

            PrescriptionDTO dto = new PrescriptionDTO(
                savedPrescription.getId(),
                savedPrescription.getPatientName(),
                savedPrescription.getDoctorName(),
                savedPrescription.getCreatedAt().toString(),
                savedPrescription.getStatus().name(),
                savedPrescription.getFilePath()
            );

            return ResponseEntity.ok(dto);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<PrescriptionDTO>> getAllPrescriptions() {
        List<Prescription> prescriptions = prescriptionService.findAll();
        List<PrescriptionDTO> dtos = prescriptions.stream()
            .map(prescription -> new PrescriptionDTO(
                prescription.getId(),
                prescription.getPatientName(),
                prescription.getDoctorName(),
                prescription.getCreatedAt().toString(),
                prescription.getStatus().name(),
                prescription.getFilePath()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionDTO> getPrescriptionById(@PathVariable String id) {
        Optional<Prescription> optionalPrescription = prescriptionService.findById(id);
        if (optionalPrescription.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Prescription prescription = optionalPrescription.get();
        PrescriptionDTO dto = new PrescriptionDTO(
            prescription.getId(),
            prescription.getPatientName(),
            prescription.getDoctorName(),
            prescription.getCreatedAt().toString(),
            prescription.getStatus().name(),
            prescription.getFilePath()
        );
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<PrescriptionDTO> acceptPrescription(@PathVariable String id) {
        try {
            Prescription updatedPrescription = prescriptionService.updateStatus(id, Prescription.PrescriptionStatus.APPROVED);
            PrescriptionDTO dto = new PrescriptionDTO(
                updatedPrescription.getId(),
                updatedPrescription.getPatientName(),
                updatedPrescription.getDoctorName(),
                updatedPrescription.getCreatedAt().toString(),
                updatedPrescription.getStatus().name(),
                updatedPrescription.getFilePath()
            );
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/deny")
    public ResponseEntity<PrescriptionDTO> denyPrescription(@PathVariable String id) {
        try {
            Prescription updatedPrescription = prescriptionService.updateStatus(id, Prescription.PrescriptionStatus.DENIED);
            PrescriptionDTO dto = new PrescriptionDTO(
                updatedPrescription.getId(),
                updatedPrescription.getPatientName(),
                updatedPrescription.getDoctorName(),
                updatedPrescription.getCreatedAt().toString(),
                updatedPrescription.getStatus().name(),
                updatedPrescription.getFilePath()
            );
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
