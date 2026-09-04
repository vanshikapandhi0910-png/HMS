import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';

import User from './models/User.js';
import Staff from './models/Staff.js';
import Patient from './models/Patient.js';
import Expense from './models/Expense.js';
import Complaint from './models/Complaint.js';
import Report from './models/Report.js';
import Room from './models/Room.js';
import Review from './models/Review.js';
import Notice from './models/Notice.js';
import Appointment from './models/Appointment.js';
import Bill from './models/Bill.js';
import Prescription from './models/Prescription.js';
import Leave from './models/Leave.js';
import Catalog from './models/Catalog.js';
import Statistic from './models/Statistic.js';
import RoomRequest from './models/RoomRequest.js';
import Requisition from './models/Requisition.js';
import DoctorSchedule from './models/DoctorSchedule.js';

import {
  INITIAL_HOSPITAL_STATS,
  SPECIALIST_DOCTORS,
  HOSPITABLE_NURSES,
  PHARMACY_MEDICINES,
  MEDICAL_MACHINES,
  INITIAL_REVIEWS,
  INITIAL_SAMPLE_PATIENTS,
  INITIAL_STAFF_MEMBERS,
  INITIAL_EXPENSES,
  INITIAL_REPORTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_COMPLAINTS,
  INITIAL_LEAVE_FORMS,
  INITIAL_VISITING_DOCTORS,
  INITIAL_ROOMS_DETAIL,
} from '../../src/data/hospitalData.js';

const DEMO_USERS = [
  // Admin & Staff
  { userId: 'ADM-001', name: 'Dr. Rajesh Gupta (Chief Admin)', role: 'Admin', password: 'admin123' },
  { userId: 'STF-201', name: 'Suresh Gupta (Lead Receptionist)', role: 'Receptionist', password: 'rec123' },

  // Nurses (HOSPITABLE_NURSES)
  { userId: 'NUR-01', name: 'Sister Mary Fernandez (Head ICU Nurse)', role: 'Nurse', password: 'nurse123' },
  { userId: 'NUR-02', name: 'Nurse Sunita Rao (Senior Staff Nurse)', role: 'Nurse', password: 'nurse123' },
  { userId: 'NUR-03', name: 'Nurse Priya Nair (Pediatric & NICU Nurse)', role: 'Nurse', password: 'nurse123' },
  { userId: 'NUR-04', name: 'Nurse David Chen (Emergency & OT Nurse)', role: 'Nurse', password: 'nurse123' },

  // Specialist Doctors (SPECIALIST_DOCTORS)
  { userId: 'DOC-101', name: 'Dr. Arvind Swamy (Cardiologist)', role: 'Doctor', password: 'doc123' },
  { userId: 'DOC-102', name: 'Dr. Meera Nambiar (Neurologist)', role: 'Doctor', password: 'doc123' },
  { userId: 'DOC-103', name: 'Dr. Rajeshwar Sharma (Orthopaedic)', role: 'Doctor', password: 'doc123' },
  { userId: 'DOC-104', name: 'Dr. Ananya Roy (Dermatologist)', role: 'Doctor', password: 'doc123' },
  { userId: 'DOC-105', name: 'Dr. Vikram Sethi (Dentist)', role: 'Doctor', password: 'doc123' },
  { userId: 'DOC-106', name: 'Dr. Sunita Deshmukh (Physiotherapist)', role: 'Doctor', password: 'doc123' },
  { userId: 'DOC-107', name: 'Dr. Rohan Kapur (Pediatrician)', role: 'Doctor', password: 'doc123' },
  { userId: 'DOC-108', name: 'Dr. Kavita Menon (Gynecologist)', role: 'Doctor', password: 'doc123' },
  { userId: 'DOC-109', name: 'Dr. Sanjay Gupta (Pathologist)', role: 'Doctor', password: 'doc123' },
  { userId: 'DOC-110', name: 'Dr. Priya Varma (Radiologist)', role: 'Doctor', password: 'doc123' },

  // Patients (INITIAL_SAMPLE_PATIENTS)
  { userId: 'PAT-1001', name: 'Aarav Kumar (Patient #1001)', role: 'Patient', password: 'pat123' },
  { userId: 'PAT-1002', name: 'Suman Lata (Patient #1002)', role: 'Patient', password: 'pat123' },
  { userId: 'PAT-1003', name: 'Vikram Malhotra (Patient #1003)', role: 'Patient', password: 'pat123' },
  { userId: 'PAT-1004', name: 'Neha Saxena (Patient #1004)', role: 'Patient', password: 'pat123' },
  { userId: 'PAT-1005', name: 'Rohit Bansal (Patient #1005)', role: 'Patient', password: 'pat123' },
];

const DEMO_BILLS = [
  { id: 'INV-9901', patientId: 'PAT-1001', description: 'General Ward Stay (3 Nights)', amount: 3600, status: 'Paid' },
  { id: 'INV-9902', patientId: 'PAT-1001', description: 'Blood CBC & Lipid Pathology Lab Test', amount: 850, status: 'Paid' },
  { id: 'INV-9903', patientId: 'PAT-1001', description: 'Pharmacy Medicines & Consumables', amount: 1420, status: 'Pending Payment' },
];

const DEMO_APPOINTMENTS = [
  {
    id: 'APT-701',
    patientId: 'PAT-1001',
    doctorName: 'Dr. Arvind Swamy',
    specialty: 'Cardiologist',
    date: '2026-08-02',
    time: '10:30 AM',
    cabin: 'Cabin 104',
    reason: 'Routine Cardiac Follow-Up',
    status: 'Confirmed',
  },
];

const DEMO_NOTICES = [
  'Urgent: Mandatory HVAC sanitation completed in Ward 3.',
  'Notice: Blood bank component freezer annual audit at 4 PM today.',
];

const DEMO_ROOM_REQUESTS = [
  {
    id: 'RCR-101',
    patientId: 'PAT-1001',
    patientName: 'Aarav Kumar',
    fromRoom: 'General Ward - Bed 14',
    toRoom: 'Private AC Deluxe Room (₹4,500/night)',
    reason: 'Prefer private space for recovery with family',
    date: '2026-07-28',
    status: 'Pending',
  },
];

const DEMO_REQUISITIONS = [
  {
    id: 'REQ-301',
    submittedById: 'NUR-01',
    submittedBy: 'Sister Mary Fernandez',
    role: 'Nurse',
    dept: 'ICU Unit',
    itemName: 'Infusion Syringe Pumps',
    quantity: 5,
    reason: 'ICU bed occupancy increased due to monsoon infections',
    date: '2026-07-29',
    status: 'Pending',
  },
  {
    id: 'REQ-302',
    submittedById: 'DOC-101',
    submittedBy: 'Dr. Arvind Swamy',
    role: 'Doctor',
    dept: 'Cardiology',
    itemName: 'Portable Echo Sonography Machine',
    quantity: 1,
    reason: 'Bedside emergency cardiac scanning required in CCU',
    date: '2026-07-30',
    status: 'Approved',
  },
];

async function wipe() {
  const models = [
    User, Staff, Patient, Expense, Complaint, Report, Room, Review,
    Notice, Appointment, Bill, Prescription, Leave, Catalog, Statistic,
    RoomRequest, Requisition, DoctorSchedule,
  ];
  for (const model of models) {
    await model.deleteMany({});
  }
  console.log('Cleared all collections.');
}

async function seed() {
  await connectDB();
  await wipe();

  // Users with hashed demo passwords
  for (const u of DEMO_USERS) {
    await User.create({ ...u, passwordHash: await bcrypt.hash(u.password, 10) });
  }
  console.log(`Seeded ${DEMO_USERS.length} users.`);

  await Staff.insertMany(INITIAL_STAFF_MEMBERS);
  await Patient.insertMany(INITIAL_SAMPLE_PATIENTS);
  await Expense.insertMany(INITIAL_EXPENSES);
  await Complaint.insertMany(INITIAL_COMPLAINTS);
  await Report.insertMany(INITIAL_REPORTS);
  await Room.insertMany(INITIAL_ROOMS_DETAIL);
  await Review.insertMany(INITIAL_REVIEWS);
  await Prescription.insertMany(INITIAL_PRESCRIPTIONS);
  await Leave.insertMany(INITIAL_LEAVE_FORMS);
  await Bill.insertMany(DEMO_BILLS);
  await Appointment.insertMany(DEMO_APPOINTMENTS);
  for (const text of DEMO_NOTICES) {
    await Notice.create({ text, postedBy: 'Admin', date: new Date().toISOString().split('T')[0] });
  }

  await Statistic.create({ key: 'hospital', data: INITIAL_HOSPITAL_STATS });

  await RoomRequest.insertMany(DEMO_ROOM_REQUESTS);
  await Requisition.insertMany(DEMO_REQUISITIONS);
  await DoctorSchedule.insertMany(
    SPECIALIST_DOCTORS.map((d) => ({
      userId: d.id,
      doctorName: d.name,
      specialty: d.specialty,
      timings: d.timings,
      cabin: d.cabin,
      status: d.availability,
    }))
  );

  const catalogs = [
    { kind: 'doctors', items: SPECIALIST_DOCTORS },
    { kind: 'nurses', items: HOSPITABLE_NURSES },
    { kind: 'medicines', items: PHARMACY_MEDICINES },
    { kind: 'machines', items: MEDICAL_MACHINES },
    { kind: 'visitingDoctors', items: INITIAL_VISITING_DOCTORS },
  ];
  for (const { kind, items } of catalogs) {
    await Catalog.insertMany(items.map((data) => ({ kind, data })));
  }

  const counts = {};
  for (const model of [User, Staff, Patient, Expense, Complaint, Report, Room, Review, Prescription, Leave, Bill, Appointment, Notice, Catalog, Statistic, RoomRequest, Requisition, DoctorSchedule]) {
    counts[model.modelName] = await model.countDocuments();
  }
  console.log('Seed complete:', counts);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
