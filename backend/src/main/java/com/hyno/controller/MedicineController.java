package com.hyno.controller;

import com.hyno.entity.Medicine;
import com.hyno.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/medicines")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173"})
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        List<Medicine> medicines = medicineService.getAllMedicines();
        return ResponseEntity.ok(medicines);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable String id) {
        Optional<Medicine> medicine = medicineService.getMedicineById(id);
        return medicine.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Medicine>> getMedicinesByStatus(@PathVariable String status) {
        List<Medicine> medicines = medicineService.getMedicinesByStatus(status);
        return ResponseEntity.ok(medicines);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Medicine>> getMedicinesByCategory(@PathVariable String category) {
        List<Medicine> medicines = medicineService.getMedicinesByCategory(category);
        return ResponseEntity.ok(medicines);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Medicine>> searchMedicines(@RequestParam String query) {
        List<Medicine> medicines = medicineService.searchMedicines(query);
        return ResponseEntity.ok(medicines);
    }

    @GetMapping("/available")
    public ResponseEntity<List<Medicine>> getAvailableMedicines() {
        List<Medicine> medicines = medicineService.getAvailableMedicines();
        return ResponseEntity.ok(medicines);
    }

    @PostMapping
    public ResponseEntity<Medicine> createMedicine(@RequestBody Medicine medicine) {
        Medicine createdMedicine = medicineService.createMedicine(medicine);
        return ResponseEntity.ok(createdMedicine);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(@PathVariable String id, @RequestBody Medicine medicineDetails) {
        Medicine updatedMedicine = medicineService.updateMedicine(id, medicineDetails);
        if (updatedMedicine != null) {
            return ResponseEntity.ok(updatedMedicine);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable String id) {
        boolean deleted = medicineService.deleteMedicine(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<Medicine> updateStock(@PathVariable String id, @RequestParam Integer quantity) {
        Medicine updatedMedicine = medicineService.updateStock(id, quantity);
        if (updatedMedicine != null) {
            return ResponseEntity.ok(updatedMedicine);
        }
        return ResponseEntity.notFound().build();
    }
}
