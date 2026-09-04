// Initial Mock Data for CITY Hospital Management System
export const INITIAL_HOSPITAL_STATS = {
  totalBeds: 150,
  generalWardBeds: 80,
  generalWardOccupied: 58,
  acRoomsTotal: 40,
  acRoomsOccupied: 29,
  nonAcRoomsTotal: 20,
  nonAcRoomsOccupied: 14,
  icuBedsTotal: 10,
  icuBedsOccupied: 7,
  activeDoctorsCount: 24,
  nursesCount: 45,
  menialStaffCount: 30,
  dailyOpdPatients: 340,
  emergencyUnitsActive: 4,
};

export const SPECIALIST_DOCTORS = [
  {
    id: "DOC-101",
    name: "Dr. Arvind Swamy",
    specialty: "Cardiologist",
    qualification: "MD, DM (Cardiology), FACC",
    experience: "18 Years",
    cabin: "Cabin 104 - Cardiac Wing, 1st Floor",
    timings: "09:00 AM - 02:00 PM (Mon-Sat)",
    availability: "Available Today",
    rating: 4.9,
    reviews: 142,
    fee: "₹800",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    bio: "Pioneer in interventional cardiology, TAVI procedures, and complex coronary angioplasty with over 5,000 successful surgeries.",
  },
  {
    id: "DOC-102",
    name: "Dr. Meera Nambiar",
    specialty: "Neurologist",
    qualification: "MBBS, DM (Neurology), Fellowship (Stroke)",
    experience: "15 Years",
    cabin: "Cabin 202 - Neuro Care, 2nd Floor",
    timings: "10:00 AM - 04:00 PM (Mon-Fri)",
    availability: "Available Today",
    rating: 4.8,
    reviews: 118,
    fee: "₹900",
    image: "https://images.unsplash.com/photo-1594824813566-88855779080d?auto=format&fit=crop&w=400&q=80",
    bio: "Expert in neuro-critical care, acute stroke management, epilepsy treatment, and movement disorders.",
  },
  {
    id: "DOC-103",
    name: "Dr. Rajeshwar Sharma",
    specialty: "Orthopaedic",
    qualification: "MS (Ortho), M.Ch (Robotic Joint Surgery)",
    experience: "20 Years",
    cabin: "Cabin 108 - Ortho Dept, 1st Floor",
    timings: "11:00 AM - 05:00 PM (Mon-Sat)",
    availability: "In Surgery (Available after 2 PM)",
    rating: 5.0,
    reviews: 210,
    fee: "₹850",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    bio: "Specializes in robotic total knee & hip replacement, sports injury rehab, and complex spinal fractures.",
  },
  {
    id: "DOC-104",
    name: "Dr. Ananya Roy",
    specialty: "Dermatologist",
    qualification: "MD (Dermatology, Venereology & Leprosy)",
    experience: "11 Years",
    cabin: "Cabin 305 - Skin & Laser Unit, 3rd Floor",
    timings: "02:00 PM - 07:00 PM (Tue-Sun)",
    availability: "Available Today",
    rating: 4.9,
    reviews: 95,
    fee: "₹700",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    bio: "Clinical dermatologist & laser specialist treating acne, psoriasis, pediatric skin disorders, and cosmetic dermatology.",
  },
  {
    id: "DOC-105",
    name: "Dr. Vikram Sethi",
    specialty: "Dentist",
    qualification: "MDS (Maxillofacial Surgery & Implantology)",
    experience: "14 Years",
    cabin: "Cabin 112 - Dental Care, 1st Floor",
    timings: "09:30 AM - 01:30 PM, 04:30 PM - 08:00 PM",
    availability: "Available Today",
    rating: 4.8,
    reviews: 130,
    fee: "₹600",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
    bio: "Expert in dental implants, full mouth rehabilitation, painless root canal therapy, and jaw reconstruction.",
  },
  {
    id: "DOC-106",
    name: "Dr. Sunita Deshmukh",
    specialty: "Physiotherapist",
    qualification: "BPT, MPT (Musculoskeletal & Sports Rehabilitation)",
    experience: "12 Years",
    cabin: "Cabin G04 - Rehab Block, Ground Floor",
    timings: "08:00 AM - 02:00 PM (Mon-Sat)",
    availability: "Available Today",
    rating: 4.9,
    reviews: 88,
    fee: "₹500",
    image: "https://images.unsplash.com/photo-1594824813566-88855779080d?auto=format&fit=crop&w=400&q=80",
    bio: "Dedicated physical rehabilitation specialist for stroke recovery, post-surgical mobilization, and spinal alignment.",
  },
  {
    id: "DOC-107",
    name: "Dr. Rohan Kapur",
    specialty: "Pediatrician",
    qualification: "MD (Pediatrics), Fellowship in Neonatology",
    experience: "16 Years",
    cabin: "Cabin 210 - Child Care Wing, 2nd Floor",
    timings: "10:00 AM - 05:00 PM (Daily)",
    availability: "Available Today",
    rating: 4.95,
    reviews: 175,
    fee: "₹750",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    bio: "Child specialist focused on newborn intensive care (NICU), childhood vaccination, developmental pediatric monitoring.",
  },
  {
    id: "DOC-108",
    name: "Dr. Kavita Menon",
    specialty: "Gynecologist",
    qualification: "MS (Obs & Gynae), Fellowship in Laparoscopy",
    experience: "17 Years",
    cabin: "Cabin 205 - Maternity Block, 2nd Floor",
    timings: "09:00 AM - 03:00 PM (Mon-Sat)",
    availability: "Available Today",
    rating: 5.0,
    reviews: 240,
    fee: "₹850",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    bio: "High-risk pregnancy management, painless normal deliveries, advanced gynecological laparoscopy & infertility solutions.",
  },
  {
    id: "DOC-109",
    name: "Dr. Sanjay Gupta",
    specialty: "Pathologist",
    qualification: "MD (Pathology), DCP",
    experience: "19 Years",
    cabin: "Central Pathology Diagnostic Lab - Basement 1",
    timings: "08:00 AM - 08:00 PM (Rotational)",
    availability: "Lab Duty Active",
    rating: 4.85,
    reviews: 70,
    fee: "₹400",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    bio: "Head of Pathology overseeing 1,000+ daily blood tests, automated hematology, histopathology, and digital report delivery.",
  },
  {
    id: "DOC-110",
    name: "Dr. Priya Varma",
    specialty: "Radiologist",
    qualification: "MD (Radiodiagnosis), DNB",
    experience: "13 Years",
    cabin: "Radiology Imaging Center - Basement 1",
    timings: "09:00 AM - 06:00 PM (Daily)",
    availability: "Imaging Duty Active",
    rating: 4.9,
    reviews: 64,
    fee: "₹500",
    image: "https://images.unsplash.com/photo-1594824813566-88855779080d?auto=format&fit=crop&w=400&q=80",
    bio: "Expert in 3.0T MRI interpretation, multi-slice CT angiography, PET-CT oncology reporting, and ultrasound guided biopsies.",
  }
];

export const HOSPITABLE_NURSES = [
  {
    id: "NUR-01",
    name: "Sister Mary Fernandez",
    role: "Head Nurse - ICU Unit",
    experience: "14 Years",
    ward: "Intensive Care Unit (ICU)",
    shift: "Day Shift",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80",
    motto: "Compassion in every heartbeat. Patient safety is my holy duty.",
    rating: "5.0/5"
  },
  {
    id: "NUR-02",
    name: "Nurse Sunita Rao",
    role: "Senior Staff Nurse - General Ward",
    experience: "9 Years",
    ward: "General Ward & AC Rooms",
    shift: "Night Shift",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80",
    motto: "Attending to every patient need with a warm smile and gentle care.",
    rating: "4.9/5"
  },
  {
    id: "NUR-03",
    name: "Nurse Priya Nair",
    role: "Pediatric & Maternity Nurse",
    experience: "8 Years",
    ward: "Maternity & NICU",
    shift: "Day Shift",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80",
    motto: "Comforting mothers and little ones with utmost tenderness.",
    rating: "5.0/5"
  },
  {
    id: "NUR-04",
    name: "Nurse David Chen",
    role: "Emergency & OT Nurse",
    experience: "10 Years",
    ward: "Operation Theater & Trauma",
    shift: "Day Shift",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    motto: "Rapid response and clinical precision under pressure.",
    rating: "4.9/5"
  }
];

export const PHARMACY_MEDICINES = [
  { id: "MED-01", name: "Paracetamol 650mg (Dolo)", category: "Analgesic & Antipyretic", stock: 1200, price: 30, discountPrice: 22, prescriptionReq: false },
  { id: "MED-02", name: "Amoxicillin 500mg", category: "Antibiotic", stock: 650, price: 110, discountPrice: 85, prescriptionReq: true },
  { id: "MED-03", name: "Pantoprazole 40mg (Pan-40)", category: "Antacid", stock: 890, price: 90, discountPrice: 68, prescriptionReq: false },
  { id: "MED-04", name: "Atorvastatin 10mg (Lipitor)", category: "Cardiovascular", stock: 430, price: 180, discountPrice: 140, prescriptionReq: true },
  { id: "MED-05", name: "Metformin 500mg (Glycomet)", category: "Anti-Diabetic", stock: 750, price: 65, discountPrice: 48, prescriptionReq: true },
  { id: "MED-06", name: "Cetirizine 10mg", category: "Antihistamine", stock: 1500, price: 40, discountPrice: 28, prescriptionReq: false },
  { id: "MED-07", name: "Multivitamin & Mineral Syrups", category: "Wellness & Supplements", stock: 320, price: 240, discountPrice: 190, prescriptionReq: false },
  { id: "MED-08", name: "Ibuprofen 400mg", category: "Pain Relief", stock: 950, price: 50, discountPrice: 35, prescriptionReq: false },
];

export const MEDICAL_MACHINES = [
  {
    id: "MAC-01",
    name: "3.0 Tesla High-Field MRI Scanner",
    dept: "Radiology",
    status: "Operational",
    dailyCapacity: "24 Scans",
    lastMaintenance: "2026-07-15",
    description: "Deep tissue neurological and musculoskeletal imaging with whisper-quiet technology and ultra-fast scanning.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "MAC-02",
    name: "128-Slice Multi-Detector CT Scan",
    dept: "Radiology",
    status: "Operational",
    dailyCapacity: "40 Scans",
    lastMaintenance: "2026-07-20",
    description: "Sub-millimeter spatial resolution for cardiac angiography, lung screening, and acute trauma imaging within 5 seconds.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "MAC-03",
    name: "Inbuilt Blood-Bank & Component Separator",
    dept: "Pathology & Blood Bank",
    status: "Operational",
    dailyCapacity: "100 Units Storage",
    lastMaintenance: "2026-07-25",
    description: "24/7 Blood component separation (PRBC, Platelets, FFP) with automated cross-matching and ultra-low temperature cryogenic freezers.",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "MAC-04",
    name: "Digital PET-CT Whole Body Scanner",
    dept: "Nuclear Medicine",
    status: "Operational",
    dailyCapacity: "15 Scans",
    lastMaintenance: "2026-07-18",
    description: "Ultra-sensitive oncological lesion detection, metabolic cardiac mapping, and brain tracer imaging.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "MAC-05",
    name: "Modern Modular Laminar Flow OTs",
    dept: "Surgery",
    status: "Operational (6 Operating Suites)",
    dailyCapacity: "18 Surgeries",
    lastMaintenance: "2026-07-28",
    description: "HEPA-filtered sterile air, 4K endoscopic surgical towers, C-Arm fluoroscopy, and integrated robotic surgical arms.",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=500&q=80"
  }
];

export const INITIAL_REVIEWS = [
  {
    id: "REV-1",
    patientName: "Ramesh Sharma",
    patientAge: 52,
    treatment: "Cardiac Stenting & Angioplasty",
    rating: 5,
    date: "2026-07-20",
    comment: "Dr. Arvind Swamy and the ICU nurses at CITY Hospital saved my life! The 3.0T MRI and lab blood reports were generated within 2 hours. Extremely affordable and transparent billing.",
    verified: true
  },
  {
    id: "REV-2",
    patientName: "Pooja Verma",
    patientAge: 34,
    treatment: "Normal Delivery & Maternity Care",
    rating: 5,
    date: "2026-07-18",
    comment: "The AC Deluxe Private room was cleaner than a 5-star hotel! Sister Mary & Nurse Priya treated my newborn with unmatched affection. Best hospital in town!",
    verified: true
  },
  {
    id: "REV-3",
    patientName: "Harish Chandra",
    patientAge: 64,
    treatment: "Robotic Knee Replacement",
    rating: 5,
    date: "2026-07-12",
    comment: "Dr. Rajeshwar Sharma is a magician. I was walking on day 2 post-surgery! The physiotherapy team helped me regain full mobility. 100% recommended.",
    verified: true
  },
  {
    id: "REV-4",
    patientName: "Deepika Patel",
    patientAge: 28,
    treatment: "Dermatology & Skin Treatment",
    rating: 5,
    date: "2026-07-05",
    comment: "Very polite staff at reception, zero waiting time in OPD with pre-booked appointments. Pharmacy discounts saved me nearly 25% on medicines.",
    verified: true
  }
];

export const INITIAL_SAMPLE_PATIENTS = [
  { id: "PAT-1001", name: "Aarav Kumar", age: 45, gender: "Male", room: "General Ward - Bed 14", doctorAssigned: "Dr. Arvind Swamy", condition: "Post-Angioplasty Monitoring", status: "Admitted" },
  { id: "PAT-1002", name: "Suman Lata", age: 62, gender: "Female", room: "AC Private - Room 204", doctorAssigned: "Dr. Rajeshwar Sharma", condition: "Total Knee Replacement", status: "Admitted" },
  { id: "PAT-1003", name: "Vikram Malhotra", age: 38, gender: "Male", room: "ICU - Bed 03", doctorAssigned: "Dr. Meera Nambiar", condition: "Acute Ischemic Stroke", status: "Critical Care" },
  { id: "PAT-1004", name: "Neha Saxena", age: 29, gender: "Female", room: "Non-AC Room - 302", doctorAssigned: "Dr. Kavita Menon", condition: "Maternity Recovery", status: "Admitted" },
  { id: "PAT-1005", name: "Rohit Bansal", age: 50, gender: "Male", room: "OPD Walk-in", doctorAssigned: "Dr. Ananya Roy", condition: "Severe Eczema Consultation", status: "OPD Patient" }
];

export const INITIAL_STAFF_MEMBERS = [
  { id: "STF-201", name: "Suresh Gupta", role: "Receptionist", dept: "Front Desk & Admissions", salary: 32000, status: "Present" },
  { id: "STF-202", name: "Sister Mary Fernandez", role: "Nurse", dept: "ICU Unit", salary: 48000, status: "Present" },
  { id: "STF-203", name: "Nurse Sunita Rao", role: "Nurse", dept: "General Ward", salary: 42000, status: "Present" },
  { id: "NUR-03", name: "Nurse Priya Nair", role: "Nurse", dept: "Maternity & NICU", salary: 44000, status: "Present" },
  { id: "NUR-04", name: "Nurse David Chen", role: "Nurse", dept: "Operation Theater & Trauma", salary: 46000, status: "Present" },
  { id: "STF-204", name: "Ramesh Pawar", role: "Menial Staff (Janitor)", dept: "Sanitation & Hygiene", salary: 18000, status: "Present" },
  { id: "STF-205", name: "Mohan Lal", role: "Menial Staff (Orderly)", dept: "Patient Transport", salary: 20000, status: "Present" },
  { id: "STF-206", name: "Dr. Arvind Swamy", role: "Doctor", dept: "Cardiology", salary: 250000, status: "Present" },
  { id: "STF-207", name: "Dr. Meera Nambiar", role: "Doctor", dept: "Neurology", salary: 240000, status: "Present" },
  { id: "STF-208", name: "Dr. Sanjay Gupta", role: "Pathologist", dept: "Diagnostics", salary: 190000, status: "Present" }
];

export const INITIAL_EXPENSES = [
  { id: "EXP-501", category: "Staff Salary", description: "Monthly payroll for Doctors, Nurses, Reception & Support Staff", amount: 1850000, date: "2026-07-01", status: "Approved" },
  { id: "EXP-502", category: "Machinery & Equipment", description: "Annual AMC for 3.0T MRI & CT Scanner calibration", amount: 450000, date: "2026-07-10", status: "Approved" },
  { id: "EXP-503", category: "Lab & Blood Bank Supplies", description: "Reagent kits, centrifuge vials, and blood bags stock refill", amount: 220000, date: "2026-07-14", status: "Approved" },
  { id: "EXP-504", category: "Staff Uniforms & PPE", description: "New scrubs, lab coats, and sterile gowns for OT & ICU team", amount: 85000, date: "2026-07-18", status: "Approved" },
  { id: "EXP-505", category: "Hospital Repair & Infrastructure", description: "HVAC chiller servicing & generator fuel replenishment", amount: 140000, date: "2026-07-22", status: "Approved" }
];

export const INITIAL_REPORTS = [
  {
    id: "REP-901",
    patientId: "PAT-1001",
    patientName: "Aarav Kumar",
    testType: "Complete Blood Count (CBC) & Lipid Profile",
    department: "Pathology Lab",
    uploadedBy: "Dr. Sanjay Gupta (Pathologist)",
    uploadDate: "2026-07-28 10:30 AM",
    findings: "Hemoglobin: 14.2 g/dL (Normal). Total Cholesterol: 185 mg/dL. Triglycerides: 140 mg/dL. Normal platelet count.",
    status: "Normal / Clear",
    downloadUrl: "#"
  },
  {
    id: "REP-902",
    patientId: "PAT-1003",
    patientName: "Vikram Malhotra",
    testType: "Brain MRI (3.0 Tesla Scan)",
    department: "Radiology",
    uploadedBy: "Dr. Priya Varma (Radiologist)",
    uploadDate: "2026-07-27 04:15 PM",
    findings: "Mild ischemic focus detected in left middle cerebral artery territory. No hemorrhage or mass effect observed.",
    status: "Requires Attention",
    downloadUrl: "#"
  },
  {
    id: "REP-903",
    patientId: "PAT-1002",
    patientName: "Suman Lata",
    testType: "Post-Op Knee X-Ray & Bone Density",
    department: "Radiology",
    uploadedBy: "Dr. Priya Varma (Radiologist)",
    uploadDate: "2026-07-26 11:00 AM",
    findings: "Joint alignment excellent post robotic knee implant. Satisfactory bone-prosthesis integration.",
    status: "Normal / Clear",
    downloadUrl: "#"
  }
];

export const INITIAL_PRESCRIPTIONS = [
  {
    id: "RX-801",
    patientId: "PAT-1001",
    patientName: "Aarav Kumar",
    doctorName: "Dr. Arvind Swamy",
    date: "2026-07-28",
    diagnosis: "Coronary Artery Disease - Post Angioplasty Care",
    medicines: [
      { name: "Atorvastatin 10mg", dosage: "1 Tablet daily after dinner", duration: "30 Days" },
      { name: "Pantoprazole 40mg", dosage: "1 Tablet empty stomach in morning", duration: "15 Days" }
    ],
    advice: "Low sodium diet, daily 30 min morning walk, avoid heavy lifting for 3 weeks."
  }
];

export const INITIAL_COMPLAINTS = [
  { id: "CMP-01", submittedBy: "Aarav Kumar (Patient)", role: "Patient", category: "Food & Diet", subject: "Warm water availability at night", detail: "Need hot drinking water dispenser in General Ward Block B during night hours.", date: "2026-07-26", status: "Resolved" },
  { id: "CMP-02", submittedBy: "Nurse Sunita Rao", role: "Nurse", category: "Equipment", subject: "Extra BP Monitors in Room 200 series", detail: "Request 2 additional digital sphygmomanometers for Room 201-210.", date: "2026-07-27", status: "In Progress" }
];

export const INITIAL_LEAVE_FORMS = [
  { id: "LV-101", applicantName: "Dr. Rajeshwar Sharma", role: "Doctor", dept: "Orthopaedic", leaveDates: "2026-08-05 to 2026-08-07", reason: "Attending International Orthopaedic Conference", status: "Approved" },
  { id: "LV-102", applicantName: "Sister Mary Fernandez", role: "Nurse", dept: "ICU Unit", leaveDates: "2026-08-10 to 2026-08-12", reason: "Family Function", status: "Pending Approval" }
];

export const INITIAL_VISITING_DOCTORS = [
  { id: "VD-01", name: "Dr. Farhan Akhtar", specialty: "Oncology Specialist", hospital: "Tata Cancer Center", visitingSchedule: "Every Tuesday & Friday (04:00 PM - 07:00 PM)", contact: "+91 98765 43210" },
  { id: "VD-02", name: "Dr. Shalini Rai", specialty: "Pediatric Cardiologist", hospital: "AIIMS New Delhi", visitingSchedule: "1st & 3rd Sunday of Month (10:00 AM - 02:00 PM)", contact: "+91 98112 33445" }
];

export const INITIAL_ROOMS_DETAIL = Array.from({ length: 150 }, (_, i) => {
  const roomNum = i + 1;
  let type = "General Ward";
  let rate = 1500;
  if (roomNum <= 80) {
    type = "General Ward";
    rate = 1200;
  } else if (roomNum <= 100) {
    type = "Non-AC Private Room";
    rate = 2800;
  } else if (roomNum <= 140) {
    type = "AC Deluxe Private Room";
    rate = 4500;
  } else {
    type = "ICU / Cardiac Care Unit";
    rate = 8500;
  }

  const isOccupied = (roomNum * 7) % 3 !== 0; // deterministic sample occupancy
  return {
    roomNumber: `Room-${roomNum}`,
    type,
    ratePerNight: rate,
    status: isOccupied ? "Occupied" : "Available",
    patientName: isOccupied ? `Patient #${1000 + (roomNum % 25)}` : "-",
    nurseAssigned: isOccupied ? (roomNum % 2 === 0 ? "Sister Mary" : "Nurse Sunita") : "-"
  };
});

// Specialty Clinical Repositories Data
export const SPECIALTY_ICD11_CODES = [
  { code: "1A00", category: "Infectious Diseases", title: "Cholera", description: "Vibrio cholerae acute intestinal infection" },
  { code: "BA00", category: "Cardiovascular System", title: "Essential Hypertension", description: "Primary high blood pressure without secondary cause" },
  { code: "BA81", category: "Cardiovascular System", title: "Angina Pectoris", description: "Substernal chest pain brought on by exertion or stress" },
  { code: "CA40", category: "Respiratory System", title: "Pneumonia", description: "Acute infection of pulmonary parenchyma" },
  { code: "CA23", category: "Respiratory System", title: "Bronchial Asthma", description: "Chronic inflammatory airway disorder with reversible obstruction" },
  { code: "DA01", category: "Gastrointestinal System", title: "Gastro-oesophageal Reflux Disease (GERD)", description: "Mucosal damage produced by abnormal reflux of stomach acid" },
  { code: "FA00", category: "Musculoskeletal System", title: "Osteoarthritis of Knee", description: "Degenerative joint disease affecting articular cartilage" },
  { code: "5A11", category: "Endocrine System", title: "Type 2 Diabetes Mellitus", description: "Non-insulin-dependent metabolic disorder with hyperglycemia" },
  { code: "EM00", category: "Dermatology", title: "Atopic Eczema", description: "Pruritic chronic inflammatory skin eruption" },
  { code: "6A70", category: "Mental Health / Psychiatry", title: "Single Episode Major Depressive Disorder", description: "Persistent depressed mood, anhedonia, fatigue" }
];

export const HOMEOPATHIC_REPERTORY_RUBRICS = [
  { rubric: "MIND - Anxiety - accompanied by restlessness", chapter: "Mind", remedies: ["Arsenicum Album", "Aconitum Napellus", "Rhus Toxicodendron"], keynotes: "Sudden fear, anguish, unquenchable thirst for cold water" },
  { rubric: "HEAD - Pain - Throbbing - right side - worse motion", chapter: "Head", remedies: ["Belladonna", "Sanguinaria", "Gelsemium"], keynotes: "Fullness, congested face, dilated pupils, sensitivity to light" },
  { rubric: "STOMACH - Pain - Burning - better warm drinks", chapter: "Stomach", remedies: ["Arsenicum Album", "Nux Vomica", "Lycopodium"], keynotes: "Acid reflux, relief from warm applications, irritability" },
  { rubric: "EXTREMITIES - Joint pain - stiffness - worse first motion, better continued motion", chapter: "Extremities", remedies: ["Rhus Toxicodendron", "Bryonia", "Calcarea Fluorica"], keynotes: "Rusty gate joint syndrome, relief from warmth and stretching" },
  { rubric: "SKIN - Eruptions - Intense itching - worse night in bed", chapter: "Skin", remedies: ["Sulphur", "Psorinum", "Graphites"], keynotes: "Burning sensation after scratching, dry scaly patches" },
  { rubric: "RESPIRATION - Asthmatic dyspnea - worse 2-3 AM", chapter: "Respiration", remedies: ["Kali Carbonicum", "Arsenicum Album", "Antimonium Tart"], keynotes: "Must lean forward sitting up to breathe, rattling mucus" }
];

export const DSM5_PSYCHIATRIC_CRITERIA = [
  { diagnosticCode: "296.32", condition: "Major Depressive Disorder, Moderate", coreCriteria: ["Depressed mood most of day", "Anhedonia", "Significant weight loss/gain", "Insomnia or Hypersomnia", "Psychomotor agitation/retardation", "Fatigue", "Feelings of worthlessness"] },
  { diagnosticCode: "300.02", condition: "Generalized Anxiety Disorder (GAD)", coreCriteria: ["Excessive worry > 6 months", "Difficulty controlling worry", "Restlessness", "Easily fatigued", "Difficulty concentrating", "Muscle tension", "Sleep disturbance"] },
  { diagnosticCode: "300.01", condition: "Panic Disorder", coreCriteria: ["Recurrent unexpected panic attacks", "Palpitations/racing heart", "Sweating & trembling", "Shortness of breath", "Fear of losing control or dying"] },
  { diagnosticCode: "309.81", condition: "Post-Traumatic Stress Disorder (PTSD)", coreCriteria: ["Exposure to traumatic event", "Intrusive memories/flashbacks", "Avoidance of trauma cues", "Hyperarousal & exaggerated startle response"] }
];

export const AYURVEDA_DOSHA_ASSESSMENT = [
  { dosha: "Vata", attributes: "Light, Dry, Cold, Mobile, Rough", imbalances: "Anxiety, insomnia, constipation, joint pain, dry skin", pacifyingDiet: "Warm, cooked, grounding foods, sesame oil, ghee, sweet fruits" },
  { dosha: "Pitta", attributes: "Hot, Sharp, Light, Oily, Spreading", imbalances: "Acid reflux, skin rashes, inflammation, anger, fever", pacifyingDiet: "Cooling foods, coconut oil, sweet & bitter vegetables, mint" },
  { dosha: "Kapha", attributes: "Heavy, Slow, Cool, Oily, Smooth", imbalances: "Lethargy, weight gain, congestion, slow digestion", pacifyingDiet: "Pungent, astringent, warm light foods, ginger, honey, green tea" }
];

// Initial Case Records
export const INITIAL_CASE_RECORDS = [
  {
    id: "CASE-1001",
    patientId: "PAT-1001",
    patientName: "Aarav Kumar",
    patientType: "Admitted",
    doctorAssigned: "Dr. Arvind Swamy",
    doctorSpecialty: "Cardiology",
    visitDate: "2026-07-28",
    extendedDemographics: {
      occupation: "Senior Software Engineer (Sedentary Desk Job)",
      familyHistory: "Father had Coronary Artery Disease at age 54; Mother has Type 2 Diabetes.",
      lifestyleFactors: "Smoking: 5 cigarettes/day for 10 years (trying to quit). High stress, low physical activity.",
      emergencyContact: "Sunita Kumar (Wife) - +91 98765 11223",
      consentSigned: true,
      hipaaGdprCompliant: true,
      encryptionStatus: "AES-256 Encrypted & Vaulted",
    },
    chiefComplaints: [
      {
        location: "Substernal Left Chest Wall",
        sensation: "Squeezing pressure radiating to left inner arm and jaw",
        duration: "Intermittent for 3 weeks, severe episode 45 mins",
        severity: 8,
        onset: "Abrupt during evening staircase climb",
        aggravatingFactors: "Exertion, cold exposure, heavy meals",
        amelioratingFactors: "Sublingual Nitroglycerin, rest in sitting position"
      }
    ],
    systemicReview: {
      cardiovascular: "Substernal heaviness, mild exertional dyspnea, no peripheral edema",
      respiratory: "Clear bilateral breath sounds, no wheezing",
      gastrointestinal: "Occasional postprandial heartburn",
      neurological: "Alert, oriented x3, no cranial nerve deficit",
      musculoskeletal: "Normal muscle tone, mild upper back stiffness",
      skin: "Diaphoretic during acute episodes, skin warm",
      endocrine: "Fasting blood sugar mildly elevated (112 mg/dL)",
      psychiatric: "Moderate health-related anxiety score (GAD-7: 8)"
    },
    multimodalNotes: {
      voiceTranscript: "Patient complains of chest tightness radiating to the left arm after walking up two flights of stairs. Describes it as an elephant sitting on his chest. relieved by rest.",
      stylusDrawingData: "",
      attachments: ["ECG_Tracing_Baseline.pdf", "Lipid_Profile_Report.png"]
    },
    bodyMapPins: [
      { part: "chest", x: 48, y: 32, view: "front", painLevel: 8, note: "Substernal chest pressure radiates to arm", type: "pain" },
      { part: "arm_left", x: 68, y: 40, view: "front", painLevel: 6, note: "Inner arm numbness during exertion", type: "pain" }
    ],
    aiDifferentialDiagnoses: [
      {
        condition: "Acute Coronary Syndrome / Angina Pectoris",
        confidence: 94,
        icdCode: "BA81",
        indicators: ["Substernal pressure", "Radiation to left arm", "Exertional onset"],
        recommendedTests: ["12-Lead ECG", "Troponin I / T Labs", "Coronary Angiography"]
      },
      {
        condition: "Gastro-oesophageal Reflux Disease (GERD)",
        confidence: 32,
        icdCode: "DA01",
        indicators: ["Postprandial heartburn", "Retrosternal sensation"],
        recommendedTests: ["Upper GI Endoscopy", "Esophageal pH Monitoring"]
      }
    ],
    drugAllergyAlerts: [
      { allergy: "Penicillin", severity: "High (Anaphylaxis)", interactionWarning: "Avoid Amoxicillin and Ampicillin derivatives" }
    ],
    specialtyRepoReferences: [
      { repoType: "ICD-11", codeOrRubric: "BA81", description: "Angina Pectoris" },
      { repoType: "Homeopathy", codeOrRubric: "Cactus Grandiflorus", description: "Constriction as of an iron band around chest" },
      { repoType: "Ayurveda", codeOrRubric: "Hridroga (Vata-Pitta)", description: "Coronary circulatory imbalance treated with Arjuna & Guggulu" }
    ],
    ePrescription: [
      { medicine: "Atorvastatin 10mg (Lipitor)", dosage: "1 Tablet", frequency: "Once Daily", duration: "30 Days", route: "Oral", instructions: "Take at bedtime after food" },
      { medicine: "Aspirin 75mg (Ecosprin)", dosage: "1 Tablet", frequency: "Once Daily", duration: "30 Days", route: "Oral", instructions: "Take after lunch" },
      { medicine: "Pantoprazole 40mg (Pan-40)", dosage: "1 Tablet", frequency: "Once Daily", duration: "15 Days", route: "Oral", instructions: "Take empty stomach in morning" }
    ],
    digitalSignature: "Dr. Arvind Swamy (MD, DM Cardiology) - Certified Sign-off",
    carePlan: {
      dietAdvice: "Low sodium (<2g/day), DASH diet rich in leafy greens, nuts, and omega-3 fatty acids. Strictly eliminate fried trans-fats.",
      lifestyleAdvice: "Daily light 30-minute flat terrain walk. Stress reduction via 15 mins Pranayama breathwork. Zero smoking.",
      physicalTherapy: "Phase-1 Cardiac Rehabilitation under supervised physiotherapist.",
      followUpInstructions: "Repeat Serum Creatinine & Lipid Panel in 4 weeks. OPD Visit on Aug 25."
    },
    symptomProgressScore: 75,
    followUpNotes: "Patient reports 75% reduction in chest pressure episodes after initiating statin & antiplatelet therapy. Vitals stable."
  },
  {
    id: "CASE-1005",
    patientId: "PAT-1005",
    patientName: "Rohit Bansal",
    patientType: "OPD Patient",
    doctorAssigned: "Dr. Ananya Roy",
    doctorSpecialty: "Dermatology",
    visitDate: "2026-07-29",
    extendedDemographics: {
      occupation: "Chemical Industry Plant Supervisor",
      familyHistory: "Mother has chronic eczema; Brother has asthma.",
      lifestyleFactors: "Frequent exposure to industrial solvents and harsh detergent soaps.",
      emergencyContact: "Reena Bansal - +91 99887 76655",
      consentSigned: true,
      hipaaGdprCompliant: true,
      encryptionStatus: "AES-256 Encrypted",
    },
    chiefComplaints: [
      {
        location: "Bilateral Flexoral Forearms and Back of Knees",
        sensation: "Intense burning itch with erythematous scaly plaques and excoriations",
        duration: "2 Months, worsening past 2 weeks",
        severity: 7,
        onset: "Gradual after new factory cleaning solvent deployment",
        aggravatingFactors: "Hot water baths, synthetic wool clothing, night time warmth",
        amelioratingFactors: "Cold compress, emollient moisturizer creams"
      }
    ],
    systemicReview: {
      cardiovascular: "Normal",
      respiratory: "Normal",
      gastrointestinal: "Normal",
      neurological: "Normal",
      musculoskeletal: "Normal",
      skin: "Dry scaly erythematous patches with lichenification over bilateral antecubital fossae",
      endocrine: "Normal",
      psychiatric: "Sleep disturbance due to nighttime pruritus"
    },
    multimodalNotes: {
      voiceTranscript: "Outpatient visit for severe skin itching on forearms. Worse at night under blanket. Dry peeling skin.",
      stylusDrawingData: "",
      attachments: ["Forearm_Lesion_Photo.jpg"]
    },
    bodyMapPins: [
      { part: "arm_left", x: 72, y: 44, view: "front", painLevel: 7, note: "Scaly itchy eczema patch antecubital fossa", type: "lesion" },
      { part: "arm_right", x: 28, y: 44, view: "front", painLevel: 7, note: "Red erythematous plaque", type: "lesion" }
    ],
    aiDifferentialDiagnoses: [
      {
        condition: "Occupational Contact Dermatitis / Atopic Eczema",
        confidence: 91,
        icdCode: "EM00",
        indicators: ["Flexoral flexure scaly plaques", "Pruritus worse at night", "Chemical exposure history"],
        recommendedTests: ["Patch Test Panel", "Serum IgE Levels"]
      }
    ],
    drugAllergyAlerts: [
      { allergy: "Sulfa drugs", severity: "Moderate", interactionWarning: "Avoid Sulfamethoxazole" }
    ],
    specialtyRepoReferences: [
      { repoType: "ICD-11", codeOrRubric: "EM00", description: "Atopic Eczema" },
      { repoType: "Homeopathy", codeOrRubric: "Graphites / Sulphur", description: "Dry scaly skin, burning worse hot bath" },
      { repoType: "Ayurveda", codeOrRubric: "Vicharchika (Pitta-Kapha)", description: "Skin eruption managed with Neem, Manjistha & Coconut oil" }
    ],
    ePrescription: [
      { medicine: "Cetirizine 10mg", dosage: "1 Tablet", frequency: "Once Daily", duration: "10 Days", route: "Oral", instructions: "Take at bedtime for itching" },
      { medicine: "Hydrocortisone 1% Topical Cream", dosage: "Thin Application", frequency: "Twice Daily", duration: "7 Days", route: "Topical", instructions: "Apply sparingly over affected skin" }
    ],
    digitalSignature: "Dr. Ananya Roy (MD Dermatology) - Certified Sign-off",
    carePlan: {
      dietAdvice: "Avoid excessively spicy, fermented, or artificial preservative-laden foods. Stay hydrated.",
      lifestyleAdvice: "Use nitril gloves during industrial chemical handling. Bathe with mild fragrance-free cleanser.",
      physicalTherapy: "N/A",
      followUpInstructions: "Return for OPD review in 10 days or immediately if secondary bacterial crusting occurs."
    },
    symptomProgressScore: 60,
    followUpNotes: "Baseline OPD intake complete. Emollient & topical steroid regimen prescribed."
  }
];

