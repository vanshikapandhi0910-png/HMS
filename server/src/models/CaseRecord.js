import mongoose from 'mongoose';

const caseRecordSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    patientType: { type: String, enum: ['OPD Patient', 'Admitted', 'Critical Care'], default: 'OPD Patient' },
    doctorAssigned: { type: String, default: '' },
    doctorSpecialty: { type: String, default: 'General Medicine' },
    visitDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    
    // Module 1: Demographics & Consent
    extendedDemographics: {
      occupation: { type: String, default: '' },
      familyHistory: { type: String, default: '' },
      lifestyleFactors: { type: String, default: '' },
      emergencyContact: { type: String, default: '' },
      consentSigned: { type: Boolean, default: true },
      hipaaGdprCompliant: { type: Boolean, default: true },
      encryptionStatus: { type: String, default: 'AES-256 Encrypted' },
    },

    // Module 2: Clinical History & Symptom Capture
    chiefComplaints: [
      {
        location: { type: String, default: '' },
        sensation: { type: String, default: '' },
        duration: { type: String, default: '' },
        severity: { type: Number, default: 5 },
        onset: { type: String, default: '' },
        aggravatingFactors: { type: String, default: '' },
        amelioratingFactors: { type: String, default: '' },
      }
    ],
    systemicReview: {
      cardiovascular: { type: String, default: 'Normal' },
      respiratory: { type: String, default: 'Normal' },
      gastrointestinal: { type: String, default: 'Normal' },
      neurological: { type: String, default: 'Normal' },
      musculoskeletal: { type: String, default: 'Normal' },
      skin: { type: String, default: 'Normal' },
      endocrine: { type: String, default: 'Normal' },
      psychiatric: { type: String, default: 'Normal' },
    },
    multimodalNotes: {
      voiceTranscript: { type: String, default: '' },
      stylusDrawingData: { type: String, default: '' },
      attachments: [{ type: String }],
    },

    // Module 3: Body Map
    bodyMapPins: [
      {
        part: { type: String, required: true },
        x: { type: Number, default: 50 },
        y: { type: Number, default: 50 },
        view: { type: String, enum: ['front', 'back'], default: 'front' },
        painLevel: { type: Number, default: 5 },
        note: { type: String, default: '' },
        type: { type: String, enum: ['pain', 'scar', 'lesion', 'surgery'], default: 'pain' },
      }
    ],

    // Module 4: Clinical Decision Support & AI
    aiDifferentialDiagnoses: [
      {
        condition: { type: String },
        confidence: { type: Number },
        icdCode: { type: String },
        indicators: [String],
        recommendedTests: [String],
      }
    ],
    drugAllergyAlerts: [
      {
        allergy: { type: String },
        severity: { type: String },
        interactionWarning: { type: String },
      }
    ],
    specialtyRepoReferences: [
      {
        repoType: { type: String }, // 'ICD-11', 'Homeopathy', 'DSM-5', 'Ayurveda'
        codeOrRubric: { type: String },
        description: { type: String },
      }
    ],

    // Module 5: Prescription & Care Plan
    ePrescription: [
      {
        medicine: { type: String },
        dosage: { type: String },
        frequency: { type: String },
        duration: { type: String },
        route: { type: String, default: 'Oral' },
        instructions: { type: String },
      }
    ],
    digitalSignature: { type: String, default: '' },
    carePlan: {
      dietAdvice: { type: String, default: '' },
      lifestyleAdvice: { type: String, default: '' },
      physicalTherapy: { type: String, default: '' },
      followUpInstructions: { type: String, default: '' },
    },

    // Module 6: Longitudinal tracking
    symptomProgressScore: { type: Number, default: 50 }, // 0% resolved to 100% resolved
    followUpNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('CaseRecord', caseRecordSchema);
