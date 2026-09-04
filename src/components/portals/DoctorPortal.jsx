import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, Clock, Building, Cpu, FileText, Plus, CheckCircle2, 
  Search, Eye, Send, TestTube, AlertCircle, Edit3, ShieldAlert, FileUp, Lock,
  Undo2, Redo2, RotateCcw
} from 'lucide-react';
import { INITIAL_PRESCRIPTIONS, PHARMACY_MEDICINES, INITIAL_CASE_RECORDS } from '../../data/hospitalData';
import { prescriptionApi, leaveApi, doctorScheduleApi, requisitionApi, caseRecordApi } from '../../api/hospitalApi';
import CaseTakingSuite from '../caseTaking/CaseTakingSuite';

export default function DoctorPortal({ 
  currentUser, 
  reportsList, 
  patientsList,
  leavesList, setLeavesList,
  onUploadReport,
  onShowToast 
}) {
  const [activeTab, setActiveTab] = useState('casetaking');
  const [caseRecords, setCaseRecords] = useState(INITIAL_CASE_RECORDS);

  // Filter patients: Radiologist & Pathologist see all; every other doctor sees only their own patients
  const doctorSpecialty = currentUser?.specialty || '';
  const isDiagnosticDoctor = ['Pathologist', 'Radiologist'].includes(doctorSpecialty);
  const visiblePatients = isDiagnosticDoctor
    ? (patientsList || [])
    : (patientsList || []).filter(p =>
        p.doctorSpecialty === doctorSpecialty ||
        (p.doctorAssigned && currentUser?.name && p.doctorAssigned.toLowerCase().includes(
          (currentUser.name.replace(/^Dr\.\s*/i, '').split(' ')[0] || '').toLowerCase()
        ))
      );

  const [selectedCasePatient, setSelectedCasePatient] = useState(visiblePatients?.[0] || null);

  useEffect(() => {
    caseRecordApi.getAll()
      .then(items => { if (items && items.length) setCaseRecords(items); })
      .catch(() => {});
  }, []);

  const handleSaveCaseRecord = async (record) => {
    try {
      const saved = await caseRecordApi.save(record);
      setCaseRecords(prev => {
        const idx = prev.findIndex(r => r.id === record.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = saved || record;
          return copy;
        }
        return [saved || record, ...prev];
      });
    } catch {
      setCaseRecords(prev => [record, ...prev]);
    }
  };

  // Action History Stacks for Undo & Redo
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Timings & Cabin State
  const [opdTimings, setOpdTimings] = useState('09:00 AM - 02:00 PM (Mon-Sat)');
  const [cabinNum, setCabinNum] = useState('Cabin 104 - Cardiac Wing, 1st Floor');
  const [doctorStatus, setDoctorStatus] = useState('Available for OPD');

  // Equipment Request State
  const [eqModal, setEqModal] = useState(false);
  const [eqName, setEqName] = useState('Portable Echo Sonography Machine');
  const [eqReason, setEqReason] = useState('Bedside Emergency Cardiac Scanning');
  const [myRequisitions, setMyRequisitions] = useState([]);

  // Leave Form State
  const [leaveModal, setLeaveModal] = useState(false);
  const [leaveDates, setLeaveDates] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  const activeDoctorId = currentUser?.id || 'DOC-101';

  // Load doctor's OPD schedule + own equipment requisitions from server
  useEffect(() => {
    doctorScheduleApi.getByUser(activeDoctorId)
      .then(sched => {
        if (sched) {
          setOpdTimings(sched.timings);
          setCabinNum(sched.cabin);
          setDoctorStatus(sched.status);
        }
      })
      .catch(() => {});
    requisitionApi.getAll()
      .then(items => { if (items && items.length) setMyRequisitions(items); })
      .catch(() => {});
  }, [activeDoctorId]);

  // Electronic Prescription Builder State
  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);

  useEffect(() => {
    prescriptionApi.getAll()
      .then(items => { if (items && items.length) setPrescriptions(items); })
      .catch(() => {});
  }, []);

  // Undo Handler
  const handleUndo = async () => {
    if (undoStack.length === 0) return;
    const action = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, prev.length - 1));
    await action.undo();
    setRedoStack(prev => [...prev, action]);
  };

  // Redo Handler
  const handleRedo = async () => {
    if (redoStack.length === 0) return;
    const action = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, prev.length - 1));
    await action.redo();
    setUndoStack(prev => [...prev, action]);
  };

  // Keyboard Shortcuts (Ctrl+Z for Undo, Ctrl+Y for Redo)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack]);

  const [rxModal, setRxModal] = useState(false);
  const [rxPatientId, setRxPatientId] = useState('PAT-1001');
  const [rxPatientName, setRxPatientName] = useState('Aarav Kumar');
  const [rxDiagnosis, setRxDiagnosis] = useState('Coronary Artery Disease - Hypertensive Heart');
  const [rxMed1, setRxMed1] = useState('Atorvastatin 10mg');
  const [rxDosage1, setRxDosage1] = useState('1 Tablet daily after dinner (30 Days)');
  const [rxAdvice, setRxAdvice] = useState('Strict low-sodium diet, regular BP monitoring.');

  // Patient Search & Diagnostic Report Upload Modal State
  const [reportSearch, setReportSearch] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState('Pathologist (Blood Test & Pathology)');
  const [uploadPatientId, setUploadPatientId] = useState('PAT-1001');
  const [uploadPatientName, setUploadPatientName] = useState('Aarav Kumar');
  const [uploadDoctorId, setUploadDoctorId] = useState(currentUser?.id || 'DOC-101');
  const [uploadDoctorName, setUploadDoctorName] = useState(currentUser?.name || 'Dr. Arvind Swamy');
  const [uploadTestType, setUploadTestType] = useState('Complete Blood Count (CBC) & HbA1c');
  const [uploadFindings, setUploadFindings] = useState('Hemoglobin: 14.5 g/dL (Normal). Fasting Blood Glucose: 105 mg/dL.');
  const [uploadStatus, setUploadStatus] = useState('Normal / Clear');

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    const oldTimings = opdTimings;
    const oldCabin = cabinNum;
    const oldStatus = doctorStatus;

    try {
      await doctorScheduleApi.update(activeDoctorId, { timings: opdTimings, cabin: cabinNum, status: doctorStatus });

      const actionRecord = {
        type: 'UPDATE_SCHEDULE',
        description: 'Updated OPD Schedule & Location',
        undo: async () => {
          setOpdTimings(oldTimings);
          setCabinNum(oldCabin);
          setDoctorStatus(oldStatus);
          try { await doctorScheduleApi.update(activeDoctorId, { timings: oldTimings, cabin: oldCabin, status: oldStatus }); } catch (e) {}
          onShowToast('Undid OPD schedule update.');
        },
        redo: async () => {
          setOpdTimings(opdTimings);
          setCabinNum(cabinNum);
          setDoctorStatus(doctorStatus);
          try { await doctorScheduleApi.update(activeDoctorId, { timings: opdTimings, cabin: cabinNum, status: doctorStatus }); } catch (e) {}
          onShowToast('Redid OPD schedule update.');
        }
      };

      setUndoStack(prev => [...prev, actionRecord]);
      setRedoStack([]);

      onShowToast('OPD Schedule & Cabin Location updated successfully!', {
        onUndo: actionRecord.undo,
        onRedo: actionRecord.redo,
        undoLabel: '↺ Undo Schedule',
        redoLabel: '↻ Redo Schedule'
      });
    } catch (err) {
      onShowToast(err.message || 'Could not update schedule.');
    }
  };

  const handleSendEqRequest = async (e) => {
    e.preventDefault();
    try {
      const created = await requisitionApi.add({ itemName: eqName, quantity: 1, reason: eqReason, dept: 'Cardiology' });
      const newReq = created || {
        id: `REQ-${Math.floor(300 + Math.random() * 700)}`,
        itemName: eqName,
        quantity: 1,
        reason: eqReason,
        dept: 'Cardiology',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };

      setMyRequisitions(prev => [newReq, ...prev]);
      setEqModal(false);

      const actionRecord = {
        type: 'ADD_EQ_REQ',
        description: `Requested ${eqName}`,
        undo: async () => {
          setMyRequisitions(prev => prev.filter(r => r.id !== newReq.id));
          onShowToast(`Undid equipment request for ${eqName}.`);
        },
        redo: async () => {
          setMyRequisitions(prev => [newReq, ...prev]);
          onShowToast(`Redid equipment request for ${eqName}.`);
        }
      };

      setUndoStack(prev => [...prev, actionRecord]);
      setRedoStack([]);

      onShowToast(`Equipment request for "${eqName}" submitted to Admin.`, {
        onUndo: actionRecord.undo,
        onRedo: actionRecord.redo,
        undoLabel: '↺ Undo Req',
        redoLabel: '↻ Redo Req'
      });
    } catch (err) {
      onShowToast(err.message || 'Could not submit equipment request.');
    }
  };

  const handleApplyDoctorLeave = async (e) => {
    e.preventDefault();
    try {
      const created = await leaveApi.add({
        applicantName: currentUser ? currentUser.name : 'Dr. Arvind Swamy',
        role: 'Doctor',
        dept: 'Cardiology',
        leaveDates,
        reason: leaveReason,
      });
      const newLeave = created || {
        id: `LV-${Math.floor(100 + Math.random() * 900)}`,
        applicantName: currentUser ? currentUser.name : 'Dr. Arvind Swamy',
        role: 'Doctor',
        dept: 'Cardiology',
        leaveDates,
        reason: leaveReason,
        status: 'Pending Approval'
      };

      setLeavesList(prev => [newLeave, ...prev]);
      setLeaveModal(false);
      setLeaveDates('');
      setLeaveReason('');

      const actionRecord = {
        type: 'DOCTOR_LEAVE',
        description: `Doctor leave requested for ${leaveDates}`,
        undo: async () => {
          setLeavesList(prev => prev.filter(l => l.id !== newLeave.id));
          onShowToast('Undid doctor leave application.');
        },
        redo: async () => {
          setLeavesList(prev => [newLeave, ...prev]);
          onShowToast('Redid doctor leave application.');
        }
      };

      setUndoStack(prev => [...prev, actionRecord]);
      setRedoStack([]);

      onShowToast('Doctor Leave Application submitted to Medical Director.', {
        onUndo: actionRecord.undo,
        onRedo: actionRecord.redo,
        undoLabel: '↺ Undo Leave',
        redoLabel: '↻ Redo Leave'
      });
    } catch (err) {
      onShowToast(err.message || 'Could not submit leave application.');
    }
  };

  const handleGeneratePrescription = async (e) => {
    e.preventDefault();
    try {
      const created = await prescriptionApi.add({
        patientId: rxPatientId,
        patientName: rxPatientName,
        doctorName: currentUser ? currentUser.name : 'Dr. Arvind Swamy',
        diagnosis: rxDiagnosis,
        medicines: [
          { name: rxMed1, dosage: rxDosage1 }
        ],
        advice: rxAdvice
      });
      const newRx = created || {
        id: `RX-${Math.floor(800 + Math.random() * 200)}`,
        patientId: rxPatientId,
        patientName: rxPatientName,
        doctorName: currentUser ? currentUser.name : 'Dr. Arvind Swamy',
        date: new Date().toISOString().split('T')[0],
        diagnosis: rxDiagnosis,
        medicines: [{ name: rxMed1, dosage: rxDosage1 }],
        advice: rxAdvice
      };

      setPrescriptions(prev => [newRx, ...prev]);
      setRxModal(false);

      const actionRecord = {
        type: 'GENERATE_RX',
        description: `Prescription generated for ${rxPatientName}`,
        undo: async () => {
          setPrescriptions(prev => prev.filter(r => r.id !== newRx.id));
          onShowToast(`Undid prescription for ${rxPatientName}.`);
        },
        redo: async () => {
          setPrescriptions(prev => [newRx, ...prev]);
          onShowToast(`Redid prescription for ${rxPatientName}.`);
        }
      };

      setUndoStack(prev => [...prev, actionRecord]);
      setRedoStack([]);

      onShowToast(`Digital Prescription RX generated for ${rxPatientName}!`, {
        onUndo: actionRecord.undo,
        onRedo: actionRecord.redo,
        undoLabel: '↺ Undo RX',
        redoLabel: '↻ Redo RX'
      });
    } catch (err) {
      onShowToast(err.message || 'Could not generate prescription.');
    }
  };

  const handleUploadDiagnosticReport = (e) => {
    e.preventDefault();
    const newReport = {
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      patientId: uploadPatientId,
      patientName: uploadPatientName,
      doctorId: uploadDoctorId,
      doctorName: uploadDoctorName,
      testType: uploadTestType,
      department: uploadType.includes('Pathologist') ? 'Pathology Lab' : 'Radiology Imaging',
      uploadedBy: `${currentUser?.name || 'Diagnostic Specialist'} (${uploadType.includes('Pathologist') ? 'Pathologist' : 'Radiologist'})`,
      uploadDate: new Date().toLocaleString(),
      findings: uploadFindings,
      status: uploadStatus,
      downloadUrl: '#'
    };

    if (onUploadReport) {
      onUploadReport(newReport);
    }

    const actionRecord = {
      type: 'UPLOAD_REPORT',
      description: `Report uploaded for ${uploadPatientName}`,
      undo: async () => {
        onShowToast(`Undid diagnostic report upload for ${uploadPatientName}.`);
      },
      redo: async () => {
        if (onUploadReport) onUploadReport(newReport);
        onShowToast(`Redid diagnostic report upload for ${uploadPatientName}.`);
      }
    };

    setUndoStack(prev => [...prev, actionRecord]);
    setRedoStack([]);

    onShowToast(`Diagnostic Report uploaded & linked to Patient ID ${uploadPatientId} and Doctor ID ${uploadDoctorId}!`, {
      onUndo: actionRecord.undo,
      onRedo: actionRecord.redo,
      undoLabel: '↺ Undo Upload',
      redoLabel: '↻ Redo Upload'
    });
    setReportModalOpen(false);
  };

  const filteredReports = reportsList.filter(r => 
    r.patientName.toLowerCase().includes(reportSearch.toLowerCase()) || 
    r.patientId.toLowerCase().includes(reportSearch.toLowerCase()) ||
    (r.doctorId && r.doctorId.toLowerCase().includes(reportSearch.toLowerCase())) ||
    r.testType.toLowerCase().includes(reportSearch.toLowerCase()) ||
    r.uploadedBy.toLowerCase().includes(reportSearch.toLowerCase())
  );

  return (
    <div className="main-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '6px' }}>Consulting Specialist Workstation</span>
          <h1 className="section-title" style={{ fontSize: '2.2rem', margin: 0 }}>Doctor's Portal</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* UNDO / REDO CONTROLS IN DOCTOR PORTAL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: undoStack.length === 0 ? 0.4 : 1,
                cursor: undoStack.length === 0 ? 'not-allowed' : 'pointer'
              }}
              disabled={undoStack.length === 0}
              onClick={handleUndo}
              title="Undo last action (Ctrl+Z)"
            >
              <Undo2 size={15} /> Undo {undoStack.length > 0 && <span className="badge badge-amber" style={{ padding: '1px 6px', fontSize: '0.7rem' }}>{undoStack.length}</span>}
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: redoStack.length === 0 ? 0.4 : 1,
                cursor: redoStack.length === 0 ? 'not-allowed' : 'pointer'
              }}
              disabled={redoStack.length === 0}
              onClick={handleRedo}
              title="Redo action (Ctrl+Y)"
            >
              <Redo2 size={15} /> Redo {redoStack.length > 0 && <span className="badge badge-teal" style={{ padding: '1px 6px', fontSize: '0.7rem' }}>{redoStack.length}</span>}
            </button>
          </div>

          <button className="btn btn-primary btn-sm" onClick={() => setRxModal(true)}>
            <Edit3 size={14} /> Create Digital Prescription
          </button>
        </div>
      </div>

      <div className="portal-tabs">
        <button className={`portal-tab-btn ${activeTab === 'casetaking' ? 'active' : ''}`} onClick={() => setActiveTab('casetaking')}>
          <Stethoscope size={16} /> Patient Case-Taking Software (7 Modules)
        </button>
        <button className={`portal-tab-btn ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
          <Clock size={16} /> Timings, Cabin & OPD Status
        </button>
        <button className={`portal-tab-btn ${activeTab === 'rx' ? 'active' : ''}`} onClick={() => setActiveTab('rx')}>
          <FileText size={16} /> Electronic Prescriptions ({prescriptions.length})
        </button>
        <button className={`portal-tab-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
          <TestTube size={16} /> Patient Blood & Radiology Reports
        </button>
        <button className={`portal-tab-btn ${activeTab === 'equipment' ? 'active' : ''}`} onClick={() => setActiveTab('equipment')}>
          <Cpu size={16} /> Equipment Request & Machinery
        </button>
        <button className={`portal-tab-btn ${activeTab === 'leaves' ? 'active' : ''}`} onClick={() => setActiveTab('leaves')}>
          <FileText size={16} /> Doctor Leave Application Form
        </button>
      </div>

      {/* 0. PATIENT CASE-TAKING SOFTWARE TAB */}
      {activeTab === 'casetaking' && (
        <div>
          <div className="glass-card" style={{ padding: '20px', marginBottom: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>Select Active Patient (Inpatient IPD or Outpatient OPD)</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
                  Choose a patient to launch full clinical case-taking, body mapping, AI decision support, and e-prescriptions.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                  value={selectedCasePatient?.id || ''}
                  onChange={(e) => {
                    const pat = visiblePatients.find(p => p.id === e.target.value);
                    setSelectedCasePatient(pat);
                  }}
                  className="input-field"
                  style={{ background: '#0f172a', color: '#fff', padding: '8px 14px', borderRadius: '8px', minWidth: '260px' }}
                >
                  {visiblePatients.length === 0 ? (
                    <option value="">No patients assigned</option>
                  ) : visiblePatients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) - {p.status} [{p.condition}]
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <CaseTakingSuite
            patient={selectedCasePatient || patientsList[0]}
            currentUser={currentUser}
            existingRecord={caseRecords.find(r => r.patientId === (selectedCasePatient?.id || patientsList[0]?.id))}
            onSaveRecord={handleSaveCaseRecord}
            onShowToast={onShowToast}
          />
        </div>
      )}

      {/* 1. TIMINGS & CABIN TAB */}
      {activeTab === 'schedule' && (
        <div className="grid-2">
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock color="var(--accent-teal)" size={20} /> OPD Schedule & Cabin Settings
            </h3>

            <form onSubmit={handleUpdateSchedule}>
              <div className="form-group">
                <label className="form-label">OPD Availability Timings</label>
                <input type="text" className="form-input" value={opdTimings} onChange={e => setOpdTimings(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Cabin Number & Location</label>
                <input type="text" className="form-input" value={cabinNum} onChange={e => setCabinNum(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Current OPD Status Badge</label>
                <select className="form-select" value={doctorStatus} onChange={e => setDoctorStatus(e.target.value)}>
                  <option>Available for OPD</option>
                  <option>In Surgery / OT</option>
                  <option>ICU Emergency Call</option>
                  <option>On Lunch Break</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary">
                Update Schedule & Location
              </button>
            </form>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px' }}>My Active OPD Dashboard Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Doctor Profile</div>
                <div style={{ fontWeight: '700', color: '#fff', fontSize: '1rem' }}>{currentUser ? currentUser.name : 'Dr. Arvind Swamy'}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)' }}>Senior Consultant - Cardiology</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location</div>
                <div style={{ fontWeight: '700', color: 'var(--accent-teal)' }}>{cabinNum}</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current Status</div>
                <span className="badge badge-teal" style={{ marginTop: '4px' }}>{doctorStatus}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ELECTRONIC PRESCRIPTIONS TAB */}
      {activeTab === 'rx' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>Electronic Prescriptions Archive</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setRxModal(true)}>
              <Plus size={14} /> Write New Prescription
            </button>
          </div>

          <div className="grid-2">
            {prescriptions.map(rx => (
              <div className="glass-card" key={rx.id} style={{ padding: '20px', borderLeft: '4px solid var(--accent-cyan)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>{rx.id}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rx.date}</span>
                </div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '2px' }}>{rx.patientName} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({rx.patientId})</span></h4>
                <div style={{ fontSize: '0.82rem', color: 'var(--accent-teal)', marginBottom: '10px' }}>Diagnosis: {rx.diagnosis}</div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', marginBottom: '10px', fontSize: '0.82rem' }}>
                  <strong>Prescribed Medicines:</strong>
                  {rx.medicines.map((m, idx) => (
                    <div key={idx} style={{ color: '#fff', marginTop: '4px' }}>• {m.name} - <em>{m.dosage}</em></div>
                  ))}
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <strong>Doctor Advice:</strong> {rx.advice}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. PATIENT BLOOD & RADIOLOGY REPORTS TAB */}
      {activeTab === 'reports' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="Search reports by Patient ID, Doctor ID, Patient Name, or Test Type..."
                value={reportSearch}
                onChange={e => setReportSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setReportModalOpen(true)}>
              <FileUp size={14} /> Upload Diagnostic Report (Pathologist/Radiologist)
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Patient ID & Name</th>
                  <th>Doctor ID & Name</th>
                  <th>Examination Test</th>
                  <th>Uploaded By</th>
                  <th>Date</th>
                  <th>Findings Summary</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(rep => (
                  <tr key={rep.id}>
                    <td><strong>{rep.id}</strong></td>
                    <td>
                      <strong style={{ color: '#fff' }}>{rep.patientName}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>{rep.patientId}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#fff' }}>{rep.doctorName || 'Dr. Arvind Swamy'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rep.doctorId || 'DOC-101'}</div>
                    </td>
                    <td><span className="badge badge-cyan">{rep.testType}</span></td>
                    <td>{rep.uploadedBy}</td>
                    <td>{rep.uploadDate}</td>
                    <td style={{ fontSize: '0.82rem' }}>{rep.findings}</td>
                    <td>
                      <span className={`badge ${rep.status.includes('Normal') ? 'badge-teal' : 'badge-rose'}`}>
                        {rep.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. EQUIPMENT REQUEST TAB */}
      {activeTab === 'equipment' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>Specialized Medical Equipment Requisition</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Request specialized machinery or surgical toolkits from Admin.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setEqModal(true)}>
              <Plus size={16} /> New Equipment Request
            </button>
          </div>

          <div className="grid-2">
            {myRequisitions.length === 0 ? (
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ color: '#fff', margin: '4px 0' }}>No equipment requisitions submitted yet.</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Use "New Equipment Request" to ask Admin for specialized machinery or toolkits.</p>
              </div>
            ) : (
              myRequisitions.map(req => (
                <div key={req.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ color: 'var(--accent-cyan)' }}>Request #{req.id}</strong>
                    <span className={`badge ${req.status === 'Approved' ? 'badge-teal' : req.status === 'Rejected' ? 'badge-rose' : 'badge-amber'}`}>{req.status}</span>
                  </div>
                  <h4 style={{ color: '#fff', margin: '4px 0' }}>{req.itemName} {req.quantity > 1 ? `(x${req.quantity})` : ''}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Justification: {req.reason}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Requested on {req.date}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. DOCTOR LEAVE FORM TAB */}
      {activeTab === 'leaves' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>Doctor Leave Applications</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setLeaveModal(true)}>
              <Plus size={14} /> Apply Doctor Leave
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Leave ID</th>
                  <th>Dates</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leavesList.filter(l => l.role === 'Doctor').map(l => (
                  <tr key={l.id}>
                    <td><strong>{l.id}</strong></td>
                    <td style={{ color: 'var(--accent-teal)', fontWeight: '700' }}>{l.leaveDates || l.dates}</td>
                    <td>{l.reason}</td>
                    <td><span className="badge badge-teal">{l.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: WRITE PRESCRIPTION */}
      {rxModal && (
        <div className="modal-overlay" onClick={() => setRxModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#fff' }}>Electronic Prescription Builder</h3>
              <button className="close-modal-btn" onClick={() => setRxModal(false)}>✕</button>
            </div>
            <form onSubmit={handleGeneratePrescription}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Patient ID</label>
                  <input type="text" className="form-input" value={rxPatientId} onChange={e => setRxPatientId(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Patient Name</label>
                  <input type="text" className="form-input" value={rxPatientName} onChange={e => setRxPatientName(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Medical Diagnosis</label>
                <input type="text" className="form-input" value={rxDiagnosis} onChange={e => setRxDiagnosis(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Select Medicine from Pharmacy DB</label>
                <select className="form-select" value={rxMed1} onChange={e => setRxMed1(e.target.value)}>
                  {PHARMACY_MEDICINES.map(m => (
                    <option key={m.id} value={m.name}>{m.name} ({m.category})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Dosage & Frequency Instructions</label>
                <input type="text" className="form-input" value={rxDosage1} onChange={e => setRxDosage1(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Lifestyle & Dietary Advice</label>
                <textarea className="form-textarea" rows={2} value={rxAdvice} onChange={e => setRxAdvice(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setRxModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><Send size={14} /> Generate & Issue Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EQUIPMENT REQUEST */}
      {eqModal && (
        <div className="modal-overlay" onClick={() => setEqModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#fff' }}>Medical Equipment Requisition Form</h3>
              <button className="close-modal-btn" onClick={() => setEqModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSendEqRequest}>
              <div className="form-group">
                <label className="form-label">Equipment / Device Name</label>
                <input type="text" className="form-input" value={eqName} onChange={e => setEqName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Medical Justification</label>
                <textarea className="form-textarea" rows={3} value={eqReason} onChange={e => setEqReason(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEqModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DOCTOR LEAVE */}
      {leaveModal && (
        <div className="modal-overlay" onClick={() => setLeaveModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#fff' }}>Doctor Leave Application</h3>
              <button className="close-modal-btn" onClick={() => setLeaveModal(false)}>✕</button>
            </div>
            <form onSubmit={handleApplyDoctorLeave}>
              <div className="form-group">
                <label className="form-label">Leave Duration (Dates)</label>
                <input type="text" className="form-input" placeholder="e.g. 2026-08-20 to 2026-08-22" value={leaveDates} onChange={e => setLeaveDates(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Reason for Absence</label>
                <textarea className="form-textarea" rows={3} value={leaveReason} onChange={e => setLeaveReason(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setLeaveModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD DIAGNOSTIC LAB / RADIOLOGY REPORT */}
      {reportModalOpen && (
        <div className="modal-overlay" onClick={() => setReportModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileUp color="var(--accent-cyan)" size={20} /> Pathologist & Radiologist Report Uploader
              </h3>
              <button className="close-modal-btn" onClick={() => setReportModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleUploadDiagnosticReport}>
              <div className="form-group">
                <label className="form-label">Diagnostic Department & Specialist Role</label>
                <select className="form-select" value={uploadType} onChange={e => setUploadType(e.target.value)}>
                  <option>Pathologist (Blood Test & Pathology Lab Report)</option>
                  <option>Radiologist (MRI / CT / PET / X-Ray Report)</option>
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Patient ID</label>
                  <input type="text" className="form-input" value={uploadPatientId} onChange={e => setUploadPatientId(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Patient Full Name</label>
                  <input type="text" className="form-input" value={uploadPatientName} onChange={e => setUploadPatientName(e.target.value)} required />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Concerned Doctor ID</label>
                  <input type="text" className="form-input" value={uploadDoctorId} onChange={e => setUploadDoctorId(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Concerned Doctor Name</label>
                  <input type="text" className="form-input" value={uploadDoctorName} onChange={e => setUploadDoctorName(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Examination / Test Name</label>
                <input type="text" className="form-input" value={uploadTestType} onChange={e => setUploadTestType(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Diagnostic Findings & Results Summary</label>
                <textarea className="form-textarea" rows={3} value={uploadFindings} onChange={e => setUploadFindings(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Medical Impression Status</label>
                <select className="form-select" value={uploadStatus} onChange={e => setUploadStatus(e.target.value)}>
                  <option>Normal / Clear</option>
                  <option>Requires Doctor Review</option>
                  <option>Critical Attention Needed</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setReportModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <FileUp size={16} /> Link & Upload Report to Patient & Doctor IDs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
