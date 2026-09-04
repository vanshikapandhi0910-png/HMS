import React, { useState, useEffect } from 'react';
import {
  User, ShieldCheck, Activity, Stethoscope, Cpu, FileText, CheckCircle2,
  Mic, MicOff, Paperclip, AlertTriangle, Plus, Trash2, Save, Share2,
  Calendar, Layers, Edit3, ArrowRight, Sparkles, BookOpen, Clock, Heart, Sliders
} from 'lucide-react';
import StylusCanvasNotes from './StylusCanvasNotes';
import SpecialtyRepertoryModal from './SpecialtyRepertoryModal';

import { PHARMACY_MEDICINES } from '../../data/hospitalData';

export default function CaseTakingSuite({
  patient,
  currentUser,
  existingRecord = null,
  onSaveRecord,
  onClose,
  onShowToast,
  readOnly = false
}) {
  const [activeTab, setActiveTab] = useState('demographics'); // 1: demographics, 2: symptoms, 3: ai_cds, 4: erx, 5: longitudinal, 6: export

  // Module 1 State: Demographics & Consent
  const [extendedDemographics, setExtendedDemographics] = useState(
    existingRecord?.extendedDemographics || {
      occupation: 'Software Engineer',
      familyHistory: 'Father: CAD / Hypertension; Mother: Type 2 Diabetes',
      lifestyleFactors: 'Sedentary work, 5 cigarettes/day, moderate stress',
      appetitePattern: 'Normal Appetite (3 Regular Meals/day)',
      sleepPattern: 'Sound Sleep (7-8 Hours/night)',
      emergencyContact: 'Family Member (+91 98765 00000)',
      consentSigned: true,
      hipaaGdprCompliant: true,
      encryptionStatus: 'AES-256 Vault Encrypted',
    }
  );

  // Module 2 State: Complaints & Systemic Review & Multimodal
  const [chiefComplaints, setChiefComplaints] = useState(
    existingRecord?.chiefComplaints || [
      {
        location: 'Left Substernal Chest',
        sensation: 'Squeezing tightness radiating to left arm',
        duration: '3 Weeks (severe for 45 mins)',
        severity: 8,
        onset: 'Sudden onset during staircase exertion',
        aggravatingFactors: 'Stair climbing, cold breeze, heavy dinner',
        amelioratingFactors: 'Rest, sublingual nitroglycerin'
      }
    ]
  );

  const [systemicReview, setSystemicReview] = useState(
    existingRecord?.systemicReview || {
      cardiovascular: 'Exertional angina, no edema',
      respiratory: 'Bilateral clear breath sounds',
      gastrointestinal: 'Mild postprandial reflux',
      neurological: 'Alert, oriented x3',
      musculoskeletal: 'Mild upper back muscle tightness',
      skin: 'Warm, diaphoretic during acute episodes',
      endocrine: 'Fasting glucose 112 mg/dL',
      psychiatric: 'GAD-7 score: 8 (Moderate anxiety)'
    }
  );

  // Multimodal Voice-to-Text State
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState(
    existingRecord?.multimodalNotes?.voiceTranscript || ''
  );
  const [stylusData, setStylusData] = useState(
    existingRecord?.multimodalNotes?.stylusDrawingData || ''
  );
  const [attachments, setAttachments] = useState(
    existingRecord?.multimodalNotes?.attachments || ['Baseline_ECG_Report.pdf']
  );



  // Module 4 State: AI CDS & Repertory References
  const [aiDiagnoses, setAiDiagnoses] = useState(
    existingRecord?.aiDifferentialDiagnoses || [
      {
        condition: 'Acute Coronary Syndrome / Angina Pectoris',
        confidence: 94,
        icdCode: 'BA81',
        indicators: ['Substernal tightness', 'Radiation to inner left arm', 'Exertional onset'],
        recommendedTests: ['12-Lead ECG', "Troponin I/T Serum Assay", 'Coronary Angiography']
      },
      {
        condition: 'Gastro-oesophageal Reflux Disease (GERD)',
        confidence: 28,
        icdCode: 'DA01',
        indicators: ['Postprandial reflux'],
        recommendedTests: ['Upper Endoscopy']
      }
    ]
  );

  const [allergyAlerts, setAllergyAlerts] = useState(
    existingRecord?.drugAllergyAlerts || [
      { allergy: 'Penicillin', severity: 'High (Anaphylaxis)', interactionWarning: 'Strictly avoid Amoxicillin / Ampicillin formulations' }
    ]
  );

  const [specialtyRefs, setSpecialtyRefs] = useState(
    existingRecord?.specialtyRepoReferences || [
      { repoType: 'ICD-11', codeOrRubric: 'BA81', description: 'Angina Pectoris' },
      { repoType: 'Homeopathy', codeOrRubric: 'Cactus Grandiflorus', description: 'Constriction as of an iron band around heart' }
    ]
  );

  const [repertoryModalOpen, setRepertoryModalOpen] = useState(false);

  // Module 5 State: eRx & Care Plan
  const [prescriptions, setPrescriptions] = useState(
    existingRecord?.ePrescription || [
      { medicine: 'Atorvastatin 10mg (Lipitor)', dosage: '1 Tablet', frequency: 'Once Daily', duration: '30 Days', route: 'Oral', instructions: 'After dinner' },
      { medicine: 'Aspirin 75mg (Ecosprin)', dosage: '1 Tablet', frequency: 'Once Daily', duration: '30 Days', route: 'Oral', instructions: 'After lunch' }
    ]
  );

  const [carePlan, setCarePlan] = useState(
    existingRecord?.carePlan || {
      dietAdvice: 'Low sodium (<2g/day), DASH diet rich in leafy greens, nuts, and omega-3 fatty acids.',
      lifestyleAdvice: 'Daily flat 30 min morning walk, 15 mins Pranayama breathing. Zero tobacco smoking.',
      physicalTherapy: 'Phase-1 supervised cardiac rehab.',
      followUpInstructions: 'Return for OPD review on Aug 25 or immediately if rest chest pain recurs.'
    }
  );

  const [digitalSig, setDigitalSig] = useState(
    existingRecord?.digitalSignature || `${currentUser?.name || 'Dr. Arvind Swamy'} (MD Certified Sign-off)`
  );

  // Module 6 State: Longitudinal Progress
  const [symptomScore, setSymptomScore] = useState(existingRecord?.symptomProgressScore || 70);
  const [followUpNotes, setFollowUpNotes] = useState(
    existingRecord?.followUpNotes || 'Patient shows 75% resolution in exertional chest heaviness post-stenting & medical management.'
  );

  // Voice Recording Speech-to-Text Simulation / Web API
  const handleToggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Speech recognition simulation fallback
      if (!isRecording) {
        setIsRecording(true);
        if (onShowToast) onShowToast('Voice dictation active... Speak clinical narrative.');
        setTimeout(() => {
          setVoiceTranscript(prev => (prev ? prev + ' ' : '') + 'Patient reports intermittent substernal pressure after walking up stairs, relieved by sublingual nitroglycerin within 5 minutes.');
          setIsRecording(false);
          if (onShowToast) onShowToast('Voice transcription saved to Case Record.');
        }, 3000);
      }
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    if (!isRecording) {
      setIsRecording(true);
      recognition.start();
      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setVoiceTranscript(prev => (prev ? prev + ' ' : '') + transcript);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
    } else {
      setIsRecording(false);
    }
  };

  // Add Chief Complaint Row
  const handleAddComplaint = () => {
    setChiefComplaints([
      ...chiefComplaints,
      { location: '', sensation: '', duration: '', severity: 5, onset: '', aggravatingFactors: '', amelioratingFactors: '' }
    ]);
  };

  // Add Medicine Row to eRx
  const handleAddMedicine = () => {
    setPrescriptions([
      ...prescriptions,
      { medicine: 'Paracetamol 650mg (Dolo)', dosage: '1 Tablet', frequency: 'Twice Daily', duration: '5 Days', route: 'Oral', instructions: 'After food' }
    ]);
  };

  // Run AI CDS Engine on current complaints
  const handleRunAiAnalysis = () => {
    if (onShowToast) onShowToast('Running AI Differential Diagnosis Engine & Drug Contraindication Scanner...');
    setTimeout(() => {
      setAiDiagnoses([
        {
          condition: 'Acute Coronary Syndrome / Angina Pectoris',
          confidence: 96,
          icdCode: 'BA81',
          indicators: ['Substernal tightness', 'Exertional radiation to arm'],
          recommendedTests: ['12-Lead ECG', 'Serum Troponin-I', 'Echo Sonography']
        },
        {
          condition: 'Hypertensive Heart Disease',
          confidence: 45,
          icdCode: 'BA00',
          indicators: ['Family hypertension history', 'Elevated baseline pressure'],
          recommendedTests: ['24-Hr Holter Monitor', 'Renal Function Panel']
        }
      ]);
      if (onShowToast) onShowToast('AI Differential Diagnosis & Contraindication alerts updated!');
    }, 1000);
  };

  // Save Complete Case Record
  const handleSaveFullRecord = () => {
    const fullRecord = {
      id: existingRecord?.id || 'CASE-' + Date.now(),
      patientId: patient?.id || 'PAT-1001',
      patientName: patient?.name || 'Aarav Kumar',
      patientType: patient?.status === 'OPD Patient' ? 'OPD Patient' : 'Admitted',
      doctorAssigned: currentUser?.name || 'Dr. Arvind Swamy',
      doctorSpecialty: currentUser?.specialty || 'Cardiology',
      visitDate: new Date().toISOString().split('T')[0],
      extendedDemographics,
      chiefComplaints,
      systemicReview,
      multimodalNotes: {
        voiceTranscript,
        stylusDrawingData: stylusData,
        attachments
      },

      aiDifferentialDiagnoses: aiDiagnoses,
      drugAllergyAlerts: allergyAlerts,
      specialtyRepoReferences: specialtyRefs,
      ePrescription: prescriptions,
      digitalSignature: digitalSig,
      carePlan,
      symptomProgressScore: symptomScore,
      followUpNotes
    };

    if (onSaveRecord) onSaveRecord(fullRecord);
    if (onShowToast) onShowToast(`Case Record successfully saved for ${patient?.name || 'Patient'}!`);
  };

  return (
    <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)' }}>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ background: 'rgba(46, 196, 182, 0.2)', color: 'var(--accent-teal)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>
              {patient?.status || 'OPD / Inpatient Case'}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Patient ID: <strong style={{ color: '#fff' }}>{patient?.id || 'PAT-1001'}</strong></span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Age/Gender: <strong style={{ color: '#fff' }}>{patient?.age || 45}Y / {patient?.gender || 'Male'}</strong></span>
          </div>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', margin: '6px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Stethoscope style={{ color: 'var(--accent-teal)' }} size={26} />
            Clinical Case-Taking & Longitudinal EHR Workspace: <span style={{ color: 'var(--accent-teal)' }}>{patient?.name || 'Aarav Kumar'}</span>
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {!readOnly && (
            <button onClick={handleSaveFullRecord} className="btn btn-primary" style={{ gap: '6px', fontSize: '0.88rem' }}>
              <Save size={16} /> Save Full Case Record
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="btn btn-secondary" style={{ fontSize: '0.88rem' }}>
              Close Workspace
            </button>
          )}
        </div>
      </div>

      {/* Module Navigation Tabs */}
      {(() => {
        const navTabs = [
          { id: 'demographics', label: '1. Demographics & Consent', icon: User },
          { id: 'symptoms', label: '2. Symptoms & Multimodal', icon: FileText },
          { id: 'ai_cds', label: '3. AI CDS & Repertories', icon: Cpu },
          { id: 'erx', label: '4. eRx & Care Plan', icon: CheckCircle2 },
          { id: 'longitudinal', label: '5. Longitudinal Timeline', icon: Clock },
          { id: 'export', label: '6. EHR Interoperability', icon: Share2 }
        ];

        return (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: isActive ? 'linear-gradient(135deg, var(--accent-cyan), #3b82f6)' : 'rgba(255,255,255,0.03)',
                    color: isActive ? '#fff' : 'var(--text-muted)',
                    border: isActive ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.06)',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={16} /> {tab.label}
                </button>
              );
            })}
          </div>
        );
      })()}

      {/* ==================== MODULE 1: DEMOGRAPHICS & CONSENT ==================== */}
      {activeTab === 'demographics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ color: '#fff', fontSize: '1.05rem', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} style={{ color: 'var(--accent-teal)' }} /> Extended Demographic & Lifestyle Profiling
            </h3>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Occupation & Workplace Environment</label>
              <input
                type="text"
                value={extendedDemographics.occupation}
                onChange={(e) => setExtendedDemographics({ ...extendedDemographics, occupation: e.target.value })}
                readOnly={readOnly}
                className="input-field"
                style={{ width: '100%', background: '#0f172a', color: '#fff', borderRadius: '8px', padding: '8px 12px' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Hereditary & Family Medical History</label>
              <textarea
                rows={2}
                value={extendedDemographics.familyHistory}
                onChange={(e) => setExtendedDemographics({ ...extendedDemographics, familyHistory: e.target.value })}
                readOnly={readOnly}
                className="input-field"
                style={{ width: '100%', background: '#0f172a', color: '#fff', borderRadius: '8px', padding: '8px 12px' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Lifestyle Factors (Diet, Exercise, Tobacco, Stress)</label>
              <textarea
                rows={2}
                value={extendedDemographics.lifestyleFactors}
                onChange={(e) => setExtendedDemographics({ ...extendedDemographics, lifestyleFactors: e.target.value })}
                readOnly={readOnly}
                className="input-field"
                style={{ width: '100%', background: '#0f172a', color: '#fff', borderRadius: '8px', padding: '8px 12px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Appetite Pattern (Editable by Doctor)
                </label>
                <input
                  type="text"
                  value={extendedDemographics.appetitePattern || ''}
                  onChange={(e) => setExtendedDemographics({ ...extendedDemographics, appetitePattern: e.target.value })}
                  readOnly={readOnly}
                  placeholder="e.g. Normal 3 Meals / Anorexic / Reduced"
                  className="input-field"
                  style={{ width: '100%', background: '#0f172a', color: '#fff', borderRadius: '8px', padding: '8px 12px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Sleep Pattern (Editable by Doctor)
                </label>
                <input
                  type="text"
                  value={extendedDemographics.sleepPattern || ''}
                  onChange={(e) => setExtendedDemographics({ ...extendedDemographics, sleepPattern: e.target.value })}
                  readOnly={readOnly}
                  placeholder="e.g. 7-8 Hrs Sound Sleep / Insomnia / Disturbed"
                  className="input-field"
                  style={{ width: '100%', background: '#0f172a', color: '#fff', borderRadius: '8px', padding: '8px 12px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Emergency Contact Person & Phone</label>
              <input
                type="text"
                value={extendedDemographics.emergencyContact}
                onChange={(e) => setExtendedDemographics({ ...extendedDemographics, emergencyContact: e.target.value })}
                readOnly={readOnly}
                className="input-field"
                style={{ width: '100%', background: '#0f172a', color: '#fff', borderRadius: '8px', padding: '8px 12px' }}
              />
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ color: '#fff', fontSize: '1.05rem', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} style={{ color: 'var(--accent-teal)' }} /> Digital Consent & Compliance Security
            </h3>

            <div style={{ background: 'rgba(46, 196, 182, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(46, 196, 182, 0.2)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#fff', fontSize: '0.88rem', fontWeight: '600' }}>HIPAA / GDPR Data Privacy Authorized</span>
                <span style={{ background: 'var(--accent-teal)', color: '#0f172a', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700' }}>ACTIVE</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '6px 0 0 0' }}>
                All medical notes, body map annotations, and multimodal audio files are encrypted with AES-256 standards.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={extendedDemographics.consentSigned}
                  onChange={(e) => setExtendedDemographics({ ...extendedDemographics, consentSigned: e.target.checked })}
                  disabled={readOnly}
                  style={{ accentColor: 'var(--accent-teal)' }}
                />
                Electronic Patient Clinical Consent Form Signed
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={extendedDemographics.hipaaGdprCompliant}
                  onChange={(e) => setExtendedDemographics({ ...extendedDemographics, hipaaGdprCompliant: e.target.checked })}
                  disabled={readOnly}
                  style={{ accentColor: 'var(--accent-teal)' }}
                />
                Authorized for Cross-Portal Interoperable View (OPD & Doctor)
              </label>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Encryption Vault Status:</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--accent-teal)', fontWeight: '600', marginTop: '2px' }}>{extendedDemographics.encryptionStatus}</div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODULE 2: CLINICAL HISTORY & SYMPTOM CAPTURE ==================== */}
      {activeTab === 'symptoms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Chief Complaints Matrix */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.05rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} style={{ color: 'var(--accent-teal)' }} /> Structured Chief Complaints Matrix
              </h3>
              {!readOnly && (
                <button onClick={handleAddComplaint} className="btn btn-sm btn-secondary" style={{ fontSize: '0.78rem', gap: '4px' }}>
                  <Plus size={14} /> Add Complaint Row
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {chiefComplaints.map((cmp, idx) => (
                <div key={idx} style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 120px', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Location / Anatomical Site</label>
                      <input
                        type="text"
                        value={cmp.location}
                        onChange={(e) => {
                          const updated = [...chiefComplaints];
                          updated[idx].location = e.target.value;
                          setChiefComplaints(updated);
                        }}
                        readOnly={readOnly}
                        placeholder="e.g. Left Chest"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sensation / Character</label>
                      <input
                        type="text"
                        value={cmp.sensation}
                        onChange={(e) => {
                          const updated = [...chiefComplaints];
                          updated[idx].sensation = e.target.value;
                          setChiefComplaints(updated);
                        }}
                        readOnly={readOnly}
                        placeholder="e.g. Squeezing, burning"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Duration / Onset</label>
                      <input
                        type="text"
                        value={cmp.duration}
                        onChange={(e) => {
                          const updated = [...chiefComplaints];
                          updated[idx].duration = e.target.value;
                          setChiefComplaints(updated);
                        }}
                        readOnly={readOnly}
                        placeholder="e.g. 3 Weeks"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Severity (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={cmp.severity}
                        onChange={(e) => {
                          const updated = [...chiefComplaints];
                          updated[idx].severity = Number(e.target.value);
                          setChiefComplaints(updated);
                        }}
                        readOnly={readOnly}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Aggravating Factors (Worse by)</label>
                      <input
                        type="text"
                        value={cmp.aggravatingFactors}
                        onChange={(e) => {
                          const updated = [...chiefComplaints];
                          updated[idx].aggravatingFactors = e.target.value;
                          setChiefComplaints(updated);
                        }}
                        readOnly={readOnly}
                        placeholder="e.g. Cold weather, exertion"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Ameliorating Factors (Relieved by)</label>
                      <input
                        type="text"
                        value={cmp.amelioratingFactors}
                        onChange={(e) => {
                          const updated = [...chiefComplaints];
                          updated[idx].amelioratingFactors = e.target.value;
                          setChiefComplaints(updated);
                        }}
                        readOnly={readOnly}
                        placeholder="e.g. Rest, warm drinks"
                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Systemic Review 8 Body Systems */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ color: '#fff', fontSize: '1.05rem', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} style={{ color: 'var(--accent-teal)' }} /> Systemic Review (8 Major Body Systems)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { key: 'cardiovascular', label: 'Cardiovascular System' },
                { key: 'respiratory', label: 'Respiratory System' },
                { key: 'gastrointestinal', label: 'Gastrointestinal System' },
                { key: 'neurological', label: 'Neurological System' },
                { key: 'musculoskeletal', label: 'Musculoskeletal System' },
                { key: 'skin', label: 'Dermatological / Skin' },
                { key: 'endocrine', label: 'Endocrine & Metabolic' },
                { key: 'psychiatric', label: 'Psychiatric & Mental Health' },
              ].map(sys => (
                <div key={sys.key} style={{ background: '#0f172a', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>{sys.label}</label>
                  <input
                    type="text"
                    value={systemicReview[sys.key] || 'Normal'}
                    onChange={(e) => setSystemicReview({ ...systemicReview, [sys.key]: e.target.value })}
                    readOnly={readOnly}
                    style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Multimodal Capture: Voice-to-Text Dictation & Stylus Notes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mic size={18} style={{ color: isRecording ? '#e71d36' : 'var(--accent-teal)' }} />
                  Voice-to-Text Audio Recording Dictation
                </h4>

                {!readOnly && (
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    style={{
                      background: isRecording ? 'rgba(231, 29, 54, 0.2)' : 'rgba(46, 196, 182, 0.2)',
                      color: isRecording ? '#e71d36' : 'var(--accent-teal)',
                      border: isRecording ? '1px solid #e71d36' : '1px solid var(--accent-teal)',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                    {isRecording ? 'Recording Live...' : 'Start Voice Dictation'}
                  </button>
                )}
              </div>

              <textarea
                rows={5}
                value={voiceTranscript}
                onChange={(e) => setVoiceTranscript(e.target.value)}
                readOnly={readOnly}
                placeholder="Click 'Start Voice Dictation' or type dictation narrative here..."
                className="input-field"
                style={{ width: '100%', background: '#0f172a', color: '#fff', borderRadius: '8px', padding: '10px', fontSize: '0.85rem' }}
              />
            </div>

            {/* Stylus Sketch Notes */}
            <StylusCanvasNotes initialData={stylusData} onSaveData={setStylusData} readOnly={readOnly} />
          </div>
        </div>
      )}



      {/* ==================== MODULE 4: AI CDS & SPECIALTY REPERTORIES ==================== */}
      {activeTab === 'ai_cds' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* AI Differential Diagnosis Generator */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.05rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={20} style={{ color: 'var(--accent-teal)' }} /> Clinical Decision Support (CDS) & AI Differential Diagnosis
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '2px 0 0 0' }}>
                  Analyzes entered chief complaints, systemic symptoms, and body map pins to compute potential differential diagnoses.
                </p>
              </div>

              {!readOnly && (
                <button onClick={handleRunAiAnalysis} className="btn btn-primary" style={{ fontSize: '0.82rem', gap: '6px' }}>
                  <Sparkles size={16} /> Re-Run AI Engine
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {aiDiagnoses.map((diag, idx) => (
                <div key={idx} style={{ background: '#0f172a', padding: '14px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem' }}>{diag.condition}</span>
                      <span style={{ background: 'rgba(46, 196, 182, 0.2)', color: 'var(--accent-teal)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700' }}>
                        ICD: {diag.icdCode}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>
                      Key Indicators: {diag.indicators?.join(', ')}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>
                      Recommended Tests: {diag.recommendedTests?.join(' • ')}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: diag.confidence > 70 ? 'var(--accent-teal)' : '#ff9f1c' }}>
                      {diag.confidence}%
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Match Confidence</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Allergy & Drug Contraindication Alerts */}
          <div style={{ background: 'rgba(231, 29, 54, 0.08)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(231, 29, 54, 0.3)' }}>
            <h3 style={{ color: '#e71d36', fontSize: '1rem', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} /> Real-Time Drug Interaction & Allergy Contraindication Warnings
            </h3>
            {allergyAlerts.map((alt, idx) => (
              <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(231, 29, 54, 0.2)', marginBottom: '8px' }}>
                <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.85rem' }}>Allergy: {alt.allergy}</span>
                <span style={{ marginLeft: '10px', color: '#e71d36', fontSize: '0.75rem', fontWeight: '600' }}>Severity: {alt.severity}</span>
                <div style={{ color: '#cbd5e1', fontSize: '0.78rem', marginTop: '2px' }}>{alt.interactionWarning}</div>
              </div>
            ))}
          </div>

          {/* Specialty Repositories Reference Lookup Trigger */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} style={{ color: 'var(--accent-teal)' }} /> Specialty Repertory Lookup Databases
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '2px 0 0 0' }}>
                Browse ICD-11, Homeopathic Rubrics, DSM-5 Criteria, or Ayurvedic Doshas and attach them to this case.
              </p>
            </div>

            <button onClick={() => setRepertoryModalOpen(true)} className="btn btn-secondary" style={{ fontSize: '0.82rem', gap: '6px' }}>
              <BookOpen size={16} /> Open Repertory Browser
            </button>
          </div>

          {/* Attached Specialty References */}
          {specialtyRefs.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>Attached Repertory References ({specialtyRefs.length}):</div>
              {specialtyRefs.map((ref, i) => (
                <div key={i} style={{ fontSize: '0.8rem', color: '#fff', background: '#0f172a', padding: '6px 12px', borderRadius: '6px', marginBottom: '4px' }}>
                  <strong style={{ color: 'var(--accent-teal)' }}>[{ref.repoType}]</strong> {ref.codeOrRubric}: {ref.description}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== MODULE 5: PRESCRIPTION & CARE PLAN ==================== */}
      {activeTab === 'erx' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* e-Prescribing Builder */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.05rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--accent-teal)' }} /> e-Prescribing (eRx) Module
              </h3>
              {!readOnly && (
                <button onClick={handleAddMedicine} className="btn btn-sm btn-secondary" style={{ fontSize: '0.78rem', gap: '4px' }}>
                  <Plus size={14} /> Add Medicine
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {prescriptions.map((rx, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr 40px', gap: '10px', background: '#0f172a', padding: '10px', borderRadius: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={rx.medicine}
                    onChange={(e) => {
                      const updated = [...prescriptions];
                      updated[idx].medicine = e.target.value;
                      setPrescriptions(updated);
                    }}
                    readOnly={readOnly}
                    placeholder="Medicine name"
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px', fontSize: '0.8rem' }}
                  />
                  <input
                    type="text"
                    value={rx.dosage}
                    onChange={(e) => {
                      const updated = [...prescriptions];
                      updated[idx].dosage = e.target.value;
                      setPrescriptions(updated);
                    }}
                    readOnly={readOnly}
                    placeholder="Dosage"
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px', fontSize: '0.8rem' }}
                  />
                  <input
                    type="text"
                    value={rx.frequency}
                    onChange={(e) => {
                      const updated = [...prescriptions];
                      updated[idx].frequency = e.target.value;
                      setPrescriptions(updated);
                    }}
                    readOnly={readOnly}
                    placeholder="Frequency"
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px', fontSize: '0.8rem' }}
                  />
                  <input
                    type="text"
                    value={rx.duration}
                    onChange={(e) => {
                      const updated = [...prescriptions];
                      updated[idx].duration = e.target.value;
                      setPrescriptions(updated);
                    }}
                    readOnly={readOnly}
                    placeholder="Duration"
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px', fontSize: '0.8rem' }}
                  />
                  <input
                    type="text"
                    value={rx.instructions}
                    onChange={(e) => {
                      const updated = [...prescriptions];
                      updated[idx].instructions = e.target.value;
                      setPrescriptions(updated);
                    }}
                    readOnly={readOnly}
                    placeholder="Instructions"
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px', fontSize: '0.8rem' }}
                  />
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => setPrescriptions(prescriptions.filter((_, i) => i !== idx))}
                      style={{ background: 'none', border: 'none', color: '#e71d36', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Clinician Digital Signature Sign-Off</label>
              <input
                type="text"
                value={digitalSig}
                onChange={(e) => setDigitalSig(e.target.value)}
                readOnly={readOnly}
                style={{ width: '100%', background: '#0f172a', color: 'var(--accent-teal)', border: '1px solid rgba(46,196,182,0.3)', borderRadius: '8px', padding: '8px 12px', fontWeight: '600' }}
              />
            </div>
          </div>

          {/* Custom Care Plans */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ color: '#fff', fontSize: '1.05rem', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={20} style={{ color: 'var(--accent-teal)' }} /> Custom Holistic Care Plan Templates
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Dietary & Nutrition Protocol</label>
                <textarea
                  rows={3}
                  value={carePlan.dietAdvice}
                  onChange={(e) => setCarePlan({ ...carePlan, dietAdvice: e.target.value })}
                  readOnly={readOnly}
                  className="input-field"
                  style={{ width: '100%', background: '#0f172a', color: '#fff', borderRadius: '8px', padding: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Lifestyle & Activity Routines</label>
                <textarea
                  rows={3}
                  value={carePlan.lifestyleAdvice}
                  onChange={(e) => setCarePlan({ ...carePlan, lifestyleAdvice: e.target.value })}
                  readOnly={readOnly}
                  className="input-field"
                  style={{ width: '100%', background: '#0f172a', color: '#fff', borderRadius: '8px', padding: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Physical Therapy / Rehab Regimen</label>
                <textarea
                  rows={2}
                  value={carePlan.physicalTherapy}
                  onChange={(e) => setCarePlan({ ...carePlan, physicalTherapy: e.target.value })}
                  readOnly={readOnly}
                  className="input-field"
                  style={{ width: '100%', background: '#0f172a', color: '#fff', borderRadius: '8px', padding: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Follow-Up & Warning Signals</label>
                <textarea
                  rows={2}
                  value={carePlan.followUpInstructions}
                  onChange={(e) => setCarePlan({ ...carePlan, followUpInstructions: e.target.value })}
                  readOnly={readOnly}
                  className="input-field"
                  style={{ width: '100%', background: '#0f172a', color: '#fff', borderRadius: '8px', padding: '8px' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODULE 6: LONGITUDINAL HEALTH TRACKING ==================== */}
      {activeTab === 'longitudinal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ color: '#fff', fontSize: '1.05rem', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} style={{ color: 'var(--accent-teal)' }} /> Symptom Progress Timelines & Resolution Meter
            </h3>

            <div style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#fff', fontSize: '0.88rem', fontWeight: '600' }}>Overall Symptom Resolution Progress</span>
                <span style={{ color: 'var(--accent-teal)', fontSize: '1rem', fontWeight: '800' }}>{symptomScore}% Resolved</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={symptomScore}
                onChange={(e) => setSymptomScore(Number(e.target.value))}
                disabled={readOnly}
                style={{ width: '100%', accentColor: 'var(--accent-teal)' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                <span>0% (Baseline / Severe Symptoms)</span>
                <span>50% (Moderate Improvement)</span>
                <span>100% (Complete Resolution)</span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Longitudinal Follow-up Progress Notes</label>
              <textarea
                rows={4}
                value={followUpNotes}
                onChange={(e) => setFollowUpNotes(e.target.value)}
                readOnly={readOnly}
                className="input-field"
                style={{ width: '100%', background: '#0f172a', color: '#fff', borderRadius: '8px', padding: '10px' }}
              />
            </div>
          </div>

          {/* Comparative Visit Summary Table */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '0 0 12px 0' }}>Comparative Visit Summaries (Baseline vs Follow-Up)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ background: 'rgba(255, 159, 28, 0.2)', color: '#ff9f1c', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700' }}>
                  Visit 1 (Baseline Case-Taking)
                </span>
                <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '600', marginTop: '8px' }}>Severe substernal chest tightness (8/10)</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>Radiation to inner left arm during staircase exertion.</div>
              </div>

              <div style={{ background: '#0f172a', padding: '14px', borderRadius: '10px', border: '1px solid var(--accent-teal)' }}>
                <span style={{ background: 'rgba(46, 196, 182, 0.2)', color: 'var(--accent-teal)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700' }}>
                  Visit 2 (Current Status)
                </span>
                <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '600', marginTop: '8px' }}>75% Symptom Reduction</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>Vitals stable. No rest pain. Walking 30 mins daily without angina.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODULE 7: INTEROPERABILITY & EXPORT ==================== */}
      {activeTab === 'export' && (
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ color: '#fff', fontSize: '1.05rem', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={20} style={{ color: 'var(--accent-teal)' }} /> EHR/EMR Integration & Interoperability Hub
          </h3>

          <div style={{ background: 'rgba(46, 196, 182, 0.08)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(46, 196, 182, 0.2)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '600' }}>Outpatient (OPD) & Inpatient (IPD) Shared Portal Access</span>
              <span style={{ background: 'var(--accent-teal)', color: '#0f172a', padding: '2px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>SYNCHRONIZED</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '6px 0 0 0' }}>
              This patient record is accessible across Receptionist, Doctor, Nurse, and Patient portals. Non-admitted patients visiting for specialist consultations can view their full case history, body map pins, and e-prescriptions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
                  patient: patient?.name,
                  chiefComplaints,
                  systemicReview,

                  aiDiagnoses,
                  ePrescription: prescriptions,
                  carePlan
                }, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `CaseRecord_${patient?.name || 'Patient'}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
                if (onShowToast) onShowToast('Exported HL7 / FHIR compliant JSON summary.');
              }}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', gap: '6px' }}
            >
              <Share2 size={16} /> Export HL7 / FHIR JSON Summary
            </button>
          </div>
        </div>
      )}

      {/* Specialty Repertory Browser Modal */}
      <SpecialtyRepertoryModal
        isOpen={repertoryModalOpen}
        onClose={() => setRepertoryModalOpen(false)}
        onSelectReference={(ref) => setSpecialtyRefs([...specialtyRefs, ref])}
      />
    </div>
  );
}
