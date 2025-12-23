package com.hyno.controller;

import com.hyno.entity.Doctor;
import com.hyno.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/doctors")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable String id) {
        Optional<Doctor> doctor = doctorService.getDoctorById(id);
        return doctor.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Doctor> getDoctorByEmail(@PathVariable String email) {
        Doctor doctor = doctorService.getDoctorByEmail(email);
        return doctor != null ? ResponseEntity.ok(doctor) : ResponseEntity.notFound().build();
    }

    @GetMapping("/status/{status}")
    public List<Doctor> getDoctorsByStatus(@PathVariable String status) {
        return doctorService.getDoctorsByStatus(status);
    }

    @GetMapping("/hospital/{hospitalId}")
    public List<Doctor> getDoctorsByHospital(@PathVariable String hospitalId) {
        return doctorService.getDoctorsByHospital(hospitalId);
    }

    @GetMapping("/specialization/{specialization}")
    public List<Doctor> getDoctorsBySpecialization(@PathVariable String specialization) {
        return doctorService.getDoctorsBySpecialization(specialization);
    }

    @PostMapping
    public Doctor createDoctor(@RequestBody Doctor doctor) {
        return doctorService.createDoctor(doctor);
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<Doctor> updateDoctor(
            @PathVariable String id,
            @RequestPart("doctor") Doctor doctorDetails,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar) {
        
        // Handle file upload if present
        if (avatar != null && !avatar.isEmpty()) {
            try {
                // Create uploads directory if it doesn't exist
                Path uploadDir = Paths.get("uploads/doctors");
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }
                
                // Generate unique filename
                String originalFilename = avatar.getOriginalFilename();
                String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
                String filename = UUID.randomUUID().toString() + fileExtension;
                Path filePath = uploadDir.resolve(filename);
                
                // Save file
                Files.copy(avatar.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                // Set avatar URL (assuming local serving; adjust for production)
                doctorDetails.setAvatarUrl("/uploads/doctors/" + filename);
                
            } catch (IOException e) {
                // Log error but continue without avatar update
                System.err.println("Error uploading avatar: " + e.getMessage());
            }
        }
        
        Doctor updatedDoctor = doctorService.updateDoctor(id, doctorDetails);
        return updatedDoctor != null ? ResponseEntity.ok(updatedDoctor) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Doctor> approveDoctor(@PathVariable String id) {
        Doctor approvedDoctor = doctorService.approveDoctor(id);
        return approvedDoctor != null ? ResponseEntity.ok(approvedDoctor) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<Doctor> suspendDoctor(@PathVariable String id) {
        Doctor suspendedDoctor = doctorService.suspendDoctor(id);
        return suspendedDoctor != null ? ResponseEntity.ok(suspendedDoctor) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable String id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok().build();
    }
}
