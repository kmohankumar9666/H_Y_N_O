package com.hyno;

import com.hyno.entity.Admin;
import com.hyno.entity.Patient;
import com.hyno.entity.Doctor;
import com.hyno.entity.Hospital;
import com.hyno.entity.Appointment;
import com.hyno.entity.ChatRoom;
import com.hyno.entity.ChatMessage;
import com.hyno.entity.Medicine;
import com.hyno.entity.Order;
import com.hyno.entity.OrderItem;
import com.hyno.repository.AdminRepository;
import com.hyno.repository.PatientRepository;
import com.hyno.repository.DoctorRepository;
import com.hyno.repository.HospitalRepository;
import com.hyno.repository.AppointmentRepository;
import com.hyno.repository.ChatRoomRepository;
import com.hyno.repository.ChatMessageRepository;
import com.hyno.repository.MedicineRepository;
import com.hyno.repository.OrderRepository;
import com.hyno.entity.Prescription;
import com.hyno.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create sample patients
        if (patientRepository.findByEmail("patient@example.com").isEmpty()) {
            Patient patient = new Patient();
            patient.setId("1");
            patient.setName("John Doe");
            patient.setEmail("patient@example.com");
            patient.setPhone("1234567890");
            patient.setPassword("password123");
            patient.setAge(30);
            patient.setGender("Male");
            patient.setBloodGroup("O+");
            patient.setDateOfBirth(LocalDate.parse("1994-01-15"));
            patient.setAddress("123 Main St, City, State");
            patient.setEmergencyContact("Jane Doe - 0987654321");
            patient.setAllergies(List.of("Penicillin", "Peanuts"));
            patient.setMedicalHistory(List.of("Hypertension", "Diabetes"));
            patient.setCurrentMedications(List.of("Metformin 500mg", "Lisinopril 10mg"));
            patient.setNotes("Patient has been compliant with medication regimen");
            patientRepository.save(patient);
        }

        if (patientRepository.findByEmail("patient2@example.com").isEmpty()) {
            Patient patient2 = new Patient();
            patient2.setId("patient-2");
            patient2.setName("Alice Johnson");
            patient2.setEmail("patient2@example.com");
            patient2.setPhone("2345678901");
            patient2.setPassword("password123");
            patientRepository.save(patient2);
        }

        if (patientRepository.findByEmail("patient3@example.com").isEmpty()) {
            Patient patient3 = new Patient();
            patient3.setId("patient-3");
            patient3.setName("Robert Brown");
            patient3.setEmail("patient3@example.com");
            patient3.setPhone("3456789012");
            patient3.setPassword("password123");
            patientRepository.save(patient3);
        }

        if (patientRepository.findByEmail("patient4@example.com").isEmpty()) {
            Patient patient4 = new Patient();
            patient4.setId("patient-4");
            patient4.setName("Emma Wilson");
            patient4.setEmail("patient4@example.com");
            patient4.setPhone("4567890123");
            patient4.setPassword("password123");
            patientRepository.save(patient4);
        }

        if (patientRepository.findByEmail("patient5@example.com").isEmpty()) {
            Patient patient5 = new Patient();
            patient5.setId("patient-5");
            patient5.setName("Michael Davis");
            patient5.setEmail("patient5@example.com");
            patient5.setPhone("5678901234");
            patient5.setPassword("password123");
            patientRepository.save(patient5);
        }

        // Create sample hospitals
        if (hospitalRepository.findByEmail("hospital@example.com") == null) {
            Hospital hospital = new Hospital();
            hospital.setId("hospital-1");
            hospital.setName("City General Hospital");
            hospital.setEmail("hospital@example.com");
            hospital.setPhone("1122334455");
            hospital.setPassword("password123");
            hospital.setAddress("123 Main St, City, State");
            hospital.setCity("New York");
            hospital.setState("NY");
            hospital.setPincode("10001");
            hospital.setRegistrationNumber("HOSP001");
            hospital.setTotalDoctors(5);
            hospital.setStatus("approved");
            hospital.setFacilities(List.of("Emergency Care", "Surgery", "Radiology", "Laboratory", "Pharmacy", "ICU"));
            hospitalRepository.save(hospital);
        }

        if (hospitalRepository.findByEmail("hospital2@example.com") == null) {
            Hospital hospital2 = new Hospital();
            hospital2.setId("hospital-2");
            hospital2.setName("Metro Health Center");
            hospital2.setEmail("hospital2@example.com");
            hospital2.setPhone("6677889900");
            hospital2.setPassword("password123");
            hospital2.setAddress("456 Health Ave, Metro City, State");
            hospital2.setCity("Los Angeles");
            hospital2.setState("CA");
            hospital2.setPincode("90210");
            hospital2.setRegistrationNumber("HOSP002");
            hospital2.setTotalDoctors(3);
            hospital2.setStatus("approved");
            hospital2.setFacilities(List.of("Primary Care", "Cardiology", "Dental", "Pharmacy", "X-Ray"));
            hospitalRepository.save(hospital2);
        }

        if (hospitalRepository.findByEmail("hospital3@example.com") == null) {
            Hospital hospital3 = new Hospital();
            hospital3.setId("hospital-3");
            hospital3.setName("Regional Medical Center");
            hospital3.setEmail("hospital3@example.com");
            hospital3.setPhone("3344556677");
            hospital3.setPassword("password123");
            hospital3.setAddress("789 Care Blvd, Regional Area, State");
            hospital3.setCity("Chicago");
            hospital3.setState("IL");
            hospital3.setPincode("60601");
            hospital3.setRegistrationNumber("HOSP003");
            hospital3.setTotalDoctors(8);
            hospital3.setStatus("approved");
            hospital3.setFacilities(List.of("Emergency Care", "Surgery", "Oncology", "Pediatrics", "Maternity", "ICU", "Laboratory"));
            hospitalRepository.save(hospital3);
        }

        // Create sample doctors
        if (doctorRepository.findByEmail("doctor@example.com").isEmpty()) {
            Doctor doctor = new Doctor();
            doctor.setId("1");
            doctor.setName("Dr. Jane Smith");
            doctor.setEmail("doctor@example.com");
            doctor.setPhone("0987654321");
            doctor.setPassword("password123");
            doctor.setSpecialization("General Medicine");
            doctor.setQualification("MBBS, MD");
            doctor.setExperience(5);
            doctor.setRating(BigDecimal.valueOf(4.8));
            doctor.setAvailable(true);
            doctor.setConsultationFee(BigDecimal.valueOf(500.0));
            doctor.setStatus("approved");
            doctor.setHospital(hospitalRepository.findById("hospital-1").orElse(null));
            doctor.setAvatarUrl("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face");
            doctorRepository.save(doctor);
        }

        if (doctorRepository.findByEmail("doctor2@example.com").isEmpty()) {
            Doctor doctor2 = new Doctor();
            doctor2.setId("doctor-2");
            doctor2.setName("Dr. Michael Johnson");
            doctor2.setEmail("doctor2@example.com");
            doctor2.setPhone("1231231234");
            doctor2.setPassword("password123");
            doctor2.setSpecialization("Cardiology");
            doctor2.setQualification("MBBS, MD, DM Cardiology");
            doctor2.setExperience(8);
            doctor2.setRating(BigDecimal.valueOf(4.9));
            doctor2.setAvailable(true);
            doctor2.setConsultationFee(BigDecimal.valueOf(800.0));
            doctor2.setStatus("approved");
            doctor2.setHospital(hospitalRepository.findById("hospital-2").orElse(null));
            doctor2.setAvatarUrl("https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face");
            doctorRepository.save(doctor2);
        }

        if (doctorRepository.findByEmail("doctor3@example.com").isEmpty()) {
            Doctor doctor3 = new Doctor();
            doctor3.setId("doctor-3");
            doctor3.setName("Dr. Sarah Wilson");
            doctor3.setEmail("doctor3@example.com");
            doctor3.setPhone("4564564567");
            doctor3.setPassword("password123");
            doctor3.setSpecialization("Pediatrics");
            doctor3.setQualification("MBBS, MD Pediatrics");
            doctor3.setExperience(6);
            doctor3.setRating(BigDecimal.valueOf(4.7));
            doctor3.setAvailable(true);
            doctor3.setConsultationFee(BigDecimal.valueOf(600.0));
            doctor3.setStatus("approved");
            doctor3.setHospital(hospitalRepository.findById("hospital-3").orElse(null));
            doctor3.setAvatarUrl("https://images.unsplash.com/photo-1594824804732-ca8db723f8fa?w=150&h=150&fit=crop&crop=face");
            doctorRepository.save(doctor3);
        }

        if (doctorRepository.findByEmail("doctor4@example.com").isEmpty()) {
            Doctor doctor4 = new Doctor();
            doctor4.setId("doctor-4");
            doctor4.setName("Dr. David Chen");
            doctor4.setEmail("doctor4@example.com");
            doctor4.setPhone("7897897890");
            doctor4.setPassword("password123");
            doctor4.setSpecialization("Orthopedics");
            doctor4.setQualification("MBBS, MS Orthopedics");
            doctor4.setExperience(10);
            doctor4.setRating(BigDecimal.valueOf(4.6));
            doctor4.setAvailable(true);
            doctor4.setConsultationFee(BigDecimal.valueOf(700.0));
            doctor4.setStatus("approved");
            doctor4.setHospital(hospitalRepository.findById("hospital-1").orElse(null));
            doctor4.setAvatarUrl("https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&crop=face");
            doctorRepository.save(doctor4);
        }

        if (doctorRepository.findByEmail("doctor5@example.com").isEmpty()) {
            Doctor doctor5 = new Doctor();
            doctor5.setId("doctor-5");
            doctor5.setName("Dr. Emily Davis");
            doctor5.setEmail("doctor5@example.com");
            doctor5.setPhone("3213213210");
            doctor5.setPassword("password123");
            doctor5.setSpecialization("Dermatology");
            doctor5.setQualification("MBBS, MD Dermatology");
            doctor5.setExperience(7);
            doctor5.setRating(BigDecimal.valueOf(4.8));
            doctor5.setAvailable(true);
            doctor5.setConsultationFee(BigDecimal.valueOf(650.0));
            doctor5.setStatus("approved");
            doctor5.setHospital(hospitalRepository.findById("hospital-2").orElse(null));
            doctor5.setAvatarUrl("https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face");
            doctorRepository.save(doctor5);
        }

        // Remove any admin from patients table (legacy cleanup)
        Optional<Patient> existingAdminPatient = patientRepository.findByEmail("admin@example.com");
        if (existingAdminPatient.isPresent()) {
            patientRepository.delete(existingAdminPatient.get());
        }

        // Create sample admin in proper admins table
        if (adminRepository.findByEmail("admin@example.com").isEmpty()) {
            Admin admin = new Admin();
            admin.setId("admin-1");
            admin.setName("Admin User");
            admin.setEmail("admin@example.com");
            admin.setPhone("5555555555");
            admin.setPassword("password123");
            admin.setRole(Admin.AdminRole.SUPER_ADMIN);
            adminRepository.save(admin);
        }

        // Create sample appointments and chat rooms
        if (appointmentRepository.findByPatient_Id("1").isEmpty()) {
            // Get existing patient and doctor
            Optional<Patient> patient = patientRepository.findById("1");
            Optional<Doctor> doctor = doctorRepository.findById("1");

            if (patient.isPresent() && doctor.isPresent()) {
                // Create appointment
                Appointment appointment = new Appointment();
                appointment.setId("appointment-1");
                appointment.setPatient(patient.get());
                appointment.setDoctor(doctor.get());
                appointment.setPatientName(patient.get().getName());
                appointment.setDoctorName(doctor.get().getName());
                appointment.setAppointmentDate(LocalDate.now().plusDays(1));
                appointment.setAppointmentTime(LocalTime.of(10, 0));
                appointment.setType(Appointment.AppointmentType.CHAT);
                appointment.setStatus(Appointment.AppointmentStatus.UPCOMING);
                appointment.setNotes("Initial consultation");
                appointment.setCreatedAt(LocalDateTime.now());
                appointmentRepository.save(appointment);

                // Create chat room for this appointment
                ChatRoom chatRoom = new ChatRoom();
                chatRoom.setAppointment(appointment);
                chatRoom.setPatient(patient.get());
                chatRoom.setDoctor(doctor.get());
                chatRoom.setPatientName(patient.get().getName());
                chatRoom.setDoctorName(doctor.get().getName());
                chatRoom.setCreatedAt(LocalDateTime.now());
                chatRoom.setStatus(ChatRoom.ChatRoomStatus.ACTIVE);
                chatRoomRepository.save(chatRoom);

                // Add sample messages
                ChatMessage message1 = new ChatMessage();
                message1.setChatRoom(chatRoom);
                message1.setSenderId(doctor.get().getId());
                message1.setSenderName(doctor.get().getName());
                message1.setSenderRole(ChatMessage.SenderRole.DOCTOR);
                message1.setSenderType(ChatMessage.SenderType.DOCTOR);
                message1.setContent("Hello John, how are you feeling today?");
                message1.setCreatedAt(LocalDateTime.now().minusMinutes(30));
                message1.setStatus(ChatMessage.MessageStatus.SENT);
                chatMessageRepository.save(message1);

                ChatMessage message2 = new ChatMessage();
                message2.setChatRoom(chatRoom);
                message2.setSenderId(patient.get().getId());
                message2.setSenderName(patient.get().getName());
                message2.setSenderRole(ChatMessage.SenderRole.PATIENT);
                message2.setSenderType(ChatMessage.SenderType.PATIENT);
                message2.setContent("Hi Dr. Smith, I'm feeling much better now. Thank you for asking.");
                message2.setCreatedAt(LocalDateTime.now().minusMinutes(25));
                message2.setStatus(ChatMessage.MessageStatus.SENT);
                chatMessageRepository.save(message2);

                ChatMessage message3 = new ChatMessage();
                message3.setChatRoom(chatRoom);
                message3.setSenderId(doctor.get().getId());
                message3.setSenderName(doctor.get().getName());
                message3.setSenderRole(ChatMessage.SenderRole.DOCTOR);
                message3.setSenderType(ChatMessage.SenderType.DOCTOR);
                message3.setContent("That's great to hear! Please continue taking the prescribed medication.");
                message3.setCreatedAt(LocalDateTime.now().minusMinutes(20));
                message3.setStatus(ChatMessage.MessageStatus.SENT);
                chatMessageRepository.save(message3);

                // Update chat room with last message info
                chatRoom.setLastMessage("That's great to hear! Please continue taking the prescribed medication.");
                chatRoom.setLastMessageTime(message3.getCreatedAt());
                chatRoomRepository.save(chatRoom);
            }
        }

        // Create sample prescriptions
        if (prescriptionRepository.count() == 0) {
            Optional<Patient> patient1 = patientRepository.findById("1");
            Optional<Doctor> doctor1 = doctorRepository.findById("1");
            Optional<Patient> patient2 = patientRepository.findById("patient-2");
            Optional<Doctor> doctor2 = doctorRepository.findById("doctor-2");

            if (patient1.isPresent() && doctor1.isPresent()) {
                Prescription prescription1 = new Prescription();
                prescription1.setId("prescription-1");
                prescription1.setPatientId(patient1.get().getId());
                prescription1.setPatientName(patient1.get().getName());
                prescription1.setDoctorId(doctor1.get().getId());
                prescription1.setDoctorName(doctor1.get().getName());
                prescription1.setFilePath("/uploads/prescriptions/sample-prescription-1.pdf");
                prescription1.setMedicines("Paracetamol 500mg - 2 tablets daily, Ibuprofen 200mg - as needed for pain");
                prescription1.setNotes("Follow up in 2 weeks. Monitor blood pressure.");
                prescription1.setStatus(Prescription.PrescriptionStatus.PENDING);
                prescription1.setCreatedAt(LocalDateTime.now().minusDays(3));
                prescriptionRepository.save(prescription1);
            }

            if (patient2.isPresent() && doctor2.isPresent()) {
                Prescription prescription2 = new Prescription();
                prescription2.setId("prescription-2");
                prescription2.setPatientId(patient2.get().getId());
                prescription2.setPatientName(patient2.get().getName());
                prescription2.setDoctorId(doctor2.get().getId());
                prescription2.setDoctorName(doctor2.get().getName());
                prescription2.setFilePath("/uploads/prescriptions/sample-prescription-2.jpg");
                prescription2.setMedicines("Amoxicillin 500mg - 1 capsule 3 times daily for 7 days");
                prescription2.setNotes("Complete full course of antibiotics. Return if symptoms persist.");
                prescription2.setStatus(Prescription.PrescriptionStatus.APPROVED);
                prescription2.setCreatedAt(LocalDateTime.now().minusDays(1));
                prescriptionRepository.save(prescription2);
            }

            // Third prescription - denied
            if (patient1.isPresent() && doctor1.isPresent()) {
                Prescription prescription3 = new Prescription();
                prescription3.setId("prescription-3");
                prescription3.setPatientId(patient1.get().getId());
                prescription3.setPatientName(patient1.get().getName());
                prescription3.setDoctorId(doctor1.get().getId());
                prescription3.setDoctorName(doctor1.get().getName());
                prescription3.setFilePath("/uploads/prescriptions/sample-prescription-3.png");
                prescription3.setMedicines("Vitamin D3 1000 IU - 1 tablet daily");
                prescription3.setNotes("For vitamin deficiency. No known allergies.");
                prescription3.setStatus(Prescription.PrescriptionStatus.DENIED);
                prescription3.setCreatedAt(LocalDateTime.now());
                prescriptionRepository.save(prescription3);
            }
        }

        // Create another appointment and chat room
        if (appointmentRepository.findByPatient_Id("1").size() < 2) {
            Optional<Patient> patient = patientRepository.findById("1");
            Optional<Doctor> doctor = doctorRepository.findById("doctor-2");

            if (patient.isPresent() && doctor.isPresent()) {
                // Create appointment
                Appointment appointment = new Appointment();
                appointment.setId("appointment-2");
                appointment.setPatient(patient.get());
                appointment.setDoctor(doctor.get());
                appointment.setPatientName(patient.get().getName());
                appointment.setDoctorName(doctor.get().getName());
                appointment.setAppointmentDate(LocalDate.now().plusDays(3));
                appointment.setAppointmentTime(LocalTime.of(14, 0));
                appointment.setType(Appointment.AppointmentType.HOSPITAL);
                appointment.setStatus(Appointment.AppointmentStatus.UPCOMING);
                appointment.setNotes("Follow-up appointment");
                appointment.setCreatedAt(LocalDateTime.now());
                appointmentRepository.save(appointment);

                // Create chat room for this appointment
                ChatRoom chatRoom = new ChatRoom();
                chatRoom.setAppointment(appointment);
                chatRoom.setPatient(patient.get());
                chatRoom.setDoctor(doctor.get());
                chatRoom.setPatientName(patient.get().getName());
                chatRoom.setDoctorName(doctor.get().getName());
                chatRoom.setCreatedAt(LocalDateTime.now());
                chatRoom.setStatus(ChatRoom.ChatRoomStatus.ACTIVE);
                chatRoomRepository.save(chatRoom);

                // Add sample messages
                ChatMessage message1 = new ChatMessage();
                message1.setChatRoom(chatRoom);
                message1.setSenderId(doctor.get().getId());
                message1.setSenderName(doctor.get().getName());
                message1.setSenderRole(ChatMessage.SenderRole.DOCTOR);
                message1.setSenderType(ChatMessage.SenderType.DOCTOR);
                message1.setContent("Your test results are ready. Please come for the follow-up.");
                message1.setCreatedAt(LocalDateTime.now().minusHours(2));
                message1.setStatus(ChatMessage.MessageStatus.SENT);
                chatMessageRepository.save(message1);

                // Update chat room with last message info
                chatRoom.setLastMessage("Your test results are ready. Please come for the follow-up.");
                chatRoom.setLastMessageTime(message1.getCreatedAt());
                chatRoomRepository.save(chatRoom);
            }
        }

        // Create sample medicines
        if (medicineRepository.count() == 0) {
            // Create sample medicines
            Medicine medicine1 = new Medicine();
            medicine1.setId("medicine-1");
            medicine1.setName("Paracetamol");
            medicine1.setGenericName("Acetaminophen");
            medicine1.setDescription("Pain reliever and fever reducer");
            medicine1.setManufacturer("Generic Pharma");
            medicine1.setDosageForm("Tablet");
            medicine1.setStrength("500mg");
            medicine1.setIndications("Pain relief, fever reduction");
            medicine1.setContraindications("Liver disease, alcohol consumption");
            medicine1.setSideEffects("Nausea, rash, liver damage (rare)");
            medicine1.setPrecautions("Do not exceed recommended dose");
            medicine1.setInteractions("Warfarin, alcohol");
            medicine1.setCategory("Analgesic");
            medicine1.setPrice(BigDecimal.valueOf(25.50));
            medicine1.setStockQuantity(100);
            medicine1.setPrescriptionRequired("NO");
            medicine1.setStatus("ACTIVE");
            medicineRepository.save(medicine1);

            Medicine medicine2 = new Medicine();
            medicine2.setId("medicine-2");
            medicine2.setName("Amoxicillin");
            medicine2.setGenericName("Amoxicillin");
            medicine2.setDescription("Antibiotic for bacterial infections");
            medicine2.setManufacturer("Antibiotic Corp");
            medicine2.setDosageForm("Capsule");
            medicine2.setStrength("500mg");
            medicine2.setIndications("Ear infections, urinary tract infections");
            medicine2.setContraindications("Penicillin allergy");
            medicine2.setSideEffects("Diarrhea, nausea, rash");
            medicine2.setPrecautions("Complete full course of treatment");
            medicine2.setInteractions("Oral contraceptives");
            medicine2.setCategory("Antibiotic");
            medicine2.setPrice(BigDecimal.valueOf(45.00));
            medicine2.setStockQuantity(75);
            medicine2.setPrescriptionRequired("YES");
            medicine2.setStatus("ACTIVE");
            medicineRepository.save(medicine2);

            Medicine medicine3 = new Medicine();
            medicine3.setId("medicine-3");
            medicine3.setName("Ibuprofen");
            medicine3.setGenericName("Ibuprofen");
            medicine3.setDescription("Non-steroidal anti-inflammatory drug");
            medicine3.setManufacturer("Pain Relief Ltd");
            medicine3.setDosageForm("Tablet");
            medicine3.setStrength("200mg");
            medicine3.setIndications("Pain, inflammation, fever");
            medicine3.setContraindications("Stomach ulcers, heart disease");
            medicine3.setSideEffects("Stomach upset, heartburn");
            medicine3.setPrecautions("Take with food");
            medicine3.setInteractions("Aspirin, blood thinners");
            medicine3.setCategory("NSAID");
            medicine3.setPrice(BigDecimal.valueOf(18.75));
            medicine3.setStockQuantity(120);
            medicine3.setPrescriptionRequired("NO");
            medicine3.setStatus("ACTIVE");
            medicineRepository.save(medicine3);

            Medicine medicine4 = new Medicine();
            medicine4.setId("medicine-4");
            medicine4.setName("Omeprazole");
            medicine4.setGenericName("Omeprazole");
            medicine4.setDescription("Proton pump inhibitor for acid reflux");
            medicine4.setManufacturer("Digestive Health Inc");
            medicine4.setDosageForm("Capsule");
            medicine4.setStrength("20mg");
            medicine4.setIndications("GERD, ulcers");
            medicine4.setContraindications("Severe liver disease");
            medicine4.setSideEffects("Headache, diarrhea");
            medicine4.setPrecautions("Long-term use may affect bone health");
            medicine4.setInteractions("Clopidogrel, digoxin");
            medicine4.setCategory("PPI");
            medicine4.setPrice(BigDecimal.valueOf(32.00));
            medicine4.setStockQuantity(60);
            medicine4.setPrescriptionRequired("YES");
            medicine4.setStatus("ACTIVE");
            medicineRepository.save(medicine4);

            Medicine medicine5 = new Medicine();
            medicine5.setId("medicine-5");
            medicine5.setName("Vitamin D3");
            medicine5.setGenericName("Cholecalciferol");
            medicine5.setDescription("Vitamin supplement for bone health");
            medicine5.setManufacturer("NutriHealth");
            medicine5.setDosageForm("Tablet");
            medicine5.setStrength("1000 IU");
            medicine5.setIndications("Vitamin D deficiency, bone health");
            medicine5.setContraindications("Hypercalcemia");
            medicine5.setSideEffects("Nausea, constipation (rare)");
            medicine5.setPrecautions("Monitor calcium levels");
            medicine5.setInteractions("Calcium supplements");
            medicine5.setCategory("Vitamin");
            medicine5.setPrice(BigDecimal.valueOf(15.25));
            medicine5.setStockQuantity(200);
            medicine5.setPrescriptionRequired("NO");
            medicine5.setStatus("ACTIVE");
            medicineRepository.save(medicine5);

            // Create sample orders for all patients
            if (orderRepository.count() == 0) {
                // List of all sample patient IDs
                List<String> patientIds = List.of("1", "patient-2", "patient-3", "patient-4", "patient-5");
                List<Order.OrderStatus> statuses = List.of(
                    Order.OrderStatus.pending,
                    Order.OrderStatus.confirmed,
                    Order.OrderStatus.shipped,
                    Order.OrderStatus.delivered
                );

                int orderCounter = 1;

                for (String patientId : patientIds) {
                    Optional<Patient> patientOpt = patientRepository.findById(patientId);
                    if (patientOpt.isPresent()) {
                        Patient patient = patientOpt.get();

                        // Create 1-2 orders per patient with different combinations
                        int numOrders = (patientId.equals("1")) ? 2 : 1; // Patient 1 gets 2 orders, others get 1

                        for (int i = 0; i < numOrders; i++) {
                            Order order = new Order();
                            order.setId("order-" + orderCounter);
                            order.setPatientId(patientId);
                            order.setPatientName(patient.getName());

                            List<OrderItem> items = new ArrayList<>();

                            if (i == 0) {
                                // First order: Multiple items
                                OrderItem item1 = new OrderItem("medicine-1", "Paracetamol", 2, BigDecimal.valueOf(25.50));
                                item1.setOrder(order);
                                items.add(item1);

                                OrderItem item2 = new OrderItem("medicine-3", "Ibuprofen", 1, BigDecimal.valueOf(18.75));
                                item2.setOrder(order);
                                items.add(item2);

                                order.setTotalAmount(BigDecimal.valueOf(69.75)); // 2*25.50 + 18.75
                            } else {
                                // Second order: Single item
                                OrderItem item = new OrderItem("medicine-2", "Amoxicillin", 1, BigDecimal.valueOf(45.00));
                                item.setOrder(order);
                                items.add(item);

                                order.setTotalAmount(BigDecimal.valueOf(45.00));
                            }

                            order.setOrderItems(items);
                            order.setPaymentMethod(i == 0 ? "Online" : "Cash");

                            // Create delivery address JSON
                            String deliveryAddress = String.format(
                                "{\"name\":\"%s\",\"phone\":\"%s\",\"email\":\"%s\",\"street\":\"123 Main St\",\"city\":\"City\",\"state\":\"State\",\"pincode\":\"12345\"}",
                                patient.getName(),
                                patient.getPhone() != null ? patient.getPhone() : "1234567890",
                                patient.getEmail()
                            );
                            order.setDeliveryAddress(deliveryAddress);

                            // Assign different statuses to different patients
                            int statusIndex = (orderCounter - 1) % statuses.size();
                            order.setStatus(statuses.get(statusIndex));

                            orderRepository.save(order);
                            orderCounter++;
                        }
                    }
                }
            }
        }
    }
}
