import React, { useState, useEffect } from 'react';
import { 
  UserCheck, Bed, FileText, Search, 
  UserPlus, Clock, LogOut, Check, X,
  UserX, UserMinus, Filter, Undo2, Redo2, RotateCcw
} from 'lucide-react';
import { INITIAL_VISITING_DOCTORS } from '../../data/hospitalData';
import { staffApi, patientApi, catalogApi, roomRequestApi, roomApi } from '../../api/hospitalApi';

export default function ReceptionistPortal({ 
  staffList, setStaffList, 
  patientsList, setPatientsList, 
  roomsList, setRoomsList,
  leavesList,
  onShowToast 
}) {
  const [activeTab, setActiveTab] = useState('attendance');
  const [patientSearch, setPatientSearch] = useState('');
  const [patientStatusFilter, setPatientStatusFilter] = useState('All');
  const [staffSearch, setStaffSearch] = useState('');
  const [staffRoleFilter, setStaffRoleFilter] = useState('All');
  const [staffStatusFilter, setStaffStatusFilter] = useState('All');
  const [roomFilter, setRoomFilter] = useState('All');

  // Action History Stacks for Undo & Redo
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Visiting Doctors (loaded from server catalog)
  const [visitingDoctors, setVisitingDoctors] = useState(INITIAL_VISITING_DOCTORS);

  // Room Change Requests (loaded from server)
  const [roomChangeRequests, setRoomChangeRequests] = useState([]);

  useEffect(() => {
    catalogApi.visitingDoctors()
      .then(items => { if (items && items.length) setVisitingDoctors(items); })
      .catch(() => {});
    roomRequestApi.getAll()
      .then(setRoomChangeRequests)
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

  const roomTypeMatches = (toRoom) => {
    if (toRoom.includes('AC Deluxe')) return 'AC Deluxe Private Room';
    if (toRoom.includes('Non-AC') || toRoom.includes('Non AC')) return 'Non-AC Private Room';
    if (toRoom.includes('General Ward') || toRoom.includes('Ward Bed')) return 'General Ward';
    return 'ICU / Cardiac Care Unit';
  };

  const handleRoomRequestDecision = async (reqId, decision) => {
    const oldReq = roomChangeRequests.find(r => r.id === reqId);
    if (!oldReq) return;

    try {
      const updated = await roomRequestApi.update(reqId, { status: decision });
      setRoomChangeRequests(prev => prev.map(r => r.id === reqId ? (updated || { ...r, status: decision }) : r));

      const actionRecord = {
        type: 'ROOM_REQUEST',
        description: `Room request ${reqId} ${decision}`,
        undo: async () => {
          try { await roomRequestApi.update(reqId, { status: oldReq.status }); } catch (e) {}
          setRoomChangeRequests(prev => prev.map(r => r.id === reqId ? oldReq : r));
          onShowToast(`Undid room request decision for ${reqId}.`);
        },
        redo: async () => {
          try { await roomRequestApi.update(reqId, { status: decision }); } catch (e) {}
          setRoomChangeRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: decision } : r));
          onShowToast(`Redid room request decision for ${reqId}.`);
        }
      };

      setUndoStack(prev => [...prev, actionRecord]);
      setRedoStack([]);

      if (decision === 'Approved') {
        const targetType = roomTypeMatches(oldReq.toRoom);
        const room = roomsList.find(r => r.type === targetType && r.status === 'Available');
        if (room) {
          const roomUpdated = await roomApi.update(room.roomNumber, { status: 'Occupied', patientName: oldReq.patientName });
          setRoomsList(roomsList.map(r => r.roomNumber === room.roomNumber ? (roomUpdated || { ...r, status: 'Occupied', patientName: oldReq.patientName }) : r));
          onShowToast(`Room change approved! ${room.roomNumber} (${targetType}) assigned to ${oldReq.patientName}.`, {
            onUndo: actionRecord.undo,
            onRedo: actionRecord.redo
          });
        } else {
          onShowToast(`Room change approved for ${oldReq.patientName}. No available ${targetType} room left in matrix.`, {
            onUndo: actionRecord.undo,
            onRedo: actionRecord.redo
          });
        }
      } else {
        onShowToast(`Room change request ${reqId} ${decision.toLowerCase()}.`, {
          onUndo: actionRecord.undo,
          onRedo: actionRecord.redo
        });
      }
    } catch (err) {
      onShowToast(err.message || 'Could not update room change request.');
    }
  };

  // Helper to check if a staff member has an Admin-Approved leave
  const getApprovedLeaveForStaff = (stfName) => {
    if (!stfName || !leavesList) return null;
    return leavesList.find(l => 
      l.status === 'Approved' && (
        l.applicantName.toLowerCase().includes(stfName.toLowerCase()) ||
        stfName.toLowerCase().includes(l.applicantName.toLowerCase())
      )
    );
  };

  // Receptionist Direct Room Availability Toggle (Occupied vs Free/Available)
  const toggleRoomStatus = async (roomNum) => {
    const target = roomsList.find(r => r.roomNumber === roomNum);
    if (!target) return;
    const nextStatus = target.status === 'Available' ? 'Occupied' : 'Available';
    const nextPatient = nextStatus === 'Occupied' ? 'Manual Patient Assigned' : '-';

    try {
      const updated = await roomApi.update(roomNum, { status: nextStatus, patientName: nextPatient });
      setRoomsList(prev => prev.map(r => r.roomNumber === roomNum ? (updated || { ...r, status: nextStatus, patientName: nextPatient }) : r));
      onShowToast(`Room ${roomNum} status changed to ${nextStatus === 'Available' ? 'Free / Available' : 'Occupied'}.`);
    } catch (err) {
      setRoomsList(prev => prev.map(r => r.roomNumber === roomNum ? { ...r, status: nextStatus, patientName: nextPatient } : r));
      onShowToast(`Room ${roomNum} status changed to ${nextStatus === 'Available' ? 'Free / Available' : 'Occupied'}.`);
    }
  };

  // Staff Attendance Status Update (Present, Absent, On Leave)
  const updateStaffAttendance = async (id, newStatus) => {
    const target = staffList.find(s => s.id === id);
    if (!target) return;
    const oldStatus = target.status;

    try {
      const updated = await staffApi.setAttendance(id, newStatus);
      setStaffList(prev => prev.map(s => s.id === id ? (updated || { ...s, status: newStatus }) : s));

      const actionRecord = {
        type: 'STAFF_ATTENDANCE',
        description: `Attendance for ${target.name} set to ${newStatus}`,
        undo: async () => {
          try { await staffApi.setAttendance(id, oldStatus); } catch (e) {}
          setStaffList(prev => prev.map(s => s.id === id ? { ...s, status: oldStatus } : s));
          onShowToast(`Undid attendance update. ${target.name} restored to ${oldStatus}.`);
        },
        redo: async () => {
          try { await staffApi.setAttendance(id, newStatus); } catch (e) {}
          setStaffList(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
          onShowToast(`Redid attendance update. ${target.name} set to ${newStatus}.`);
        }
      };

      setUndoStack(prev => [...prev, actionRecord]);
      setRedoStack([]);

      onShowToast(`Attendance for ${target.name} updated to ${newStatus}.`, {
        onUndo: actionRecord.undo,
        onRedo: actionRecord.redo,
        undoLabel: '↺ Undo Attendance',
        redoLabel: '↻ Redo Attendance'
      });
    } catch (err) {
      setStaffList(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
      onShowToast(`Attendance for ${target.name} updated to ${newStatus}.`);
    }
  };

  // Receptionist action to mark staff absent based on Admin-approved leave
  const handleMarkAbsentForApprovedLeave = async (leave) => {
    const targetStaff = staffList.find(s => 
      s.name.toLowerCase().includes(leave.applicantName.toLowerCase()) ||
      leave.applicantName.toLowerCase().includes(s.name.toLowerCase())
    );
    if (targetStaff) {
      await updateStaffAttendance(targetStaff.id, 'Absent');
      onShowToast(`Marked ${targetStaff.name} ABSENT in attendance based on Admin-Approved leave (${leave.leaveDates})!`);
    } else {
      onShowToast(`Staff member "${leave.applicantName}" not found in active roster.`);
    }
  };

  // Toggle quick attendance
  const toggleAttendance = (id) => {
    const target = staffList.find(s => s.id === id);
    if (!target) return;
    const nextStatus = target.status === 'Present' ? 'Absent' : 'Present';
    updateStaffAttendance(id, nextStatus);
  };

  // Patient Presence Status Update
  const updatePatientPresence = async (id, newStatus) => {
    const target = patientsList.find(p => p.id === id);
    if (!target) return;
    const oldStatus = target.status;

    try {
      const updated = await patientApi.update(id, { status: newStatus });
      setPatientsList(prev => prev.map(p => p.id === id ? (updated || { ...p, status: newStatus }) : p));

      const actionRecord = {
        type: 'PATIENT_STATUS',
        description: `Patient ${target.name} set to ${newStatus}`,
        undo: async () => {
          try { await patientApi.update(id, { status: oldStatus }); } catch (e) {}
          setPatientsList(prev => prev.map(p => p.id === id ? { ...p, status: oldStatus } : p));
          onShowToast(`Undid status change for ${target.name}. Restored to ${oldStatus}.`);
        },
        redo: async () => {
          try { await patientApi.update(id, { status: newStatus }); } catch (e) {}
          setPatientsList(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
          onShowToast(`Redid status change for ${target.name}. Set to ${newStatus}.`);
        }
      };

      setUndoStack(prev => [...prev, actionRecord]);
      setRedoStack([]);

      onShowToast(`Patient ${target.name} presence status updated to "${newStatus}".`, {
        onUndo: actionRecord.undo,
        onRedo: actionRecord.redo,
        undoLabel: '↺ Undo Status',
        redoLabel: '↻ Redo Status'
      });
    } catch (err) {
      setPatientsList(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
      onShowToast(`Patient ${target.name} presence status updated to "${newStatus}".`);
    }
  };

  // Unified Patient Registration State (Non-Admitted OPD vs Admitted IPD)
  const [checkinModal, setCheckinModal] = useState(false);
  const [regCategory, setRegCategory] = useState('opd'); // 'opd' (Non-Admitted / Regular) | 'ipd' (Hospital Admission)
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState('Male');
  const [regDoctor, setRegDoctor] = useState('Dr. Arvind Swamy (Cardiologist)');
  const [regRoomType, setRegRoomType] = useState('General Ward Bed');
  const [regComplaint, setRegComplaint] = useState('Regular Specialist Check-Up');

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    if (!regName.trim()) {
      onShowToast('Please enter the patient full name.');
      return;
    }

    const isOpd = regCategory === 'opd';
    const generatedId = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;

    const patientPayload = {
      id: generatedId,
      name: regName.trim(),
      age: Number(regAge) || 30,
      gender: regGender,
      room: isOpd ? 'OPD Walk-in' : `${regRoomType} - Assigned`,
      doctorAssigned: regDoctor,
      condition: regComplaint || (isOpd ? 'Regular Specialist Check-Up' : 'Under Observation'),
      status: isOpd ? 'OPD Patient' : 'Admitted'
    };

    let finalPatient = patientPayload;
    try {
      const created = await patientApi.add(patientPayload);
      if (created && created.id) {
        finalPatient = created;
      }
    } catch (err) {
      console.warn('Backend API patient save skipped/failed, using fallback local record:', err.message);
    }

    setPatientsList(prev => [finalPatient, ...prev]);

    const actionRecord = {
      type: 'REGISTER_PATIENT',
      description: `Registered patient ${regName} (${finalPatient.id})`,
      undo: async () => {
        try { await patientApi.remove(finalPatient.id); } catch (e) {}
        setPatientsList(prev => prev.filter(p => p.id !== finalPatient.id));
        onShowToast(`Undid registration for ${regName}.`);
      },
      redo: async () => {
        try { await patientApi.add(patientPayload); } catch (e) {}
        setPatientsList(prev => [finalPatient, ...prev]);
        onShowToast(`Redid registration for ${regName}.`);
      }
    };

    setUndoStack(prev => [...prev, actionRecord]);
    setRedoStack([]);

    onShowToast(
      `✓ Patient ${regName} registered! Patient Account Created — User ID: ${finalPatient.id} | Password: pat123 (${isOpd ? 'OPD Patient' : 'Admitted'}). Hand these login credentials to the patient.`,
      {
        onUndo: actionRecord.undo,
        onRedo: actionRecord.redo,
        undoLabel: '↺ Undo Reg',
        redoLabel: '↻ Redo Reg'
      }
    );

    setCheckinModal(false);
    setRegName('');
    setRegAge('');
    setRegComplaint('Regular Specialist Check-Up');
  };

  // Discharge Patient Form Action
  const handleDischargePatient = async (patId, patName) => {
    const targetPatient = patientsList.find(p => p.id === patId);
    if (!targetPatient) return;
    const oldStatus = targetPatient.status;

    if (window.confirm(`Process discharge clearance form for ${patName} (${patId})?`)) {
      try {
        const updated = await patientApi.update(patId, { status: 'Discharged' });
        setPatientsList(prev => prev.map(p => p.id === patId ? (updated || { ...p, status: 'Discharged' }) : p));

        const actionRecord = {
          type: 'DISCHARGE_PATIENT',
          description: `Discharged patient ${patName}`,
          undo: async () => {
            try { await patientApi.update(patId, { status: oldStatus }); } catch (e) {}
            setPatientsList(prev => prev.map(p => p.id === patId ? { ...p, status: oldStatus } : p));
            onShowToast(`Undid discharge for ${patName}. Status restored to ${oldStatus}.`);
          },
          redo: async () => {
            try { await patientApi.update(patId, { status: 'Discharged' }); } catch (e) {}
            setPatientsList(prev => prev.map(p => p.id === patId ? { ...p, status: 'Discharged' } : p));
            onShowToast(`Redid discharge for ${patName}.`);
          }
        };

        setUndoStack(prev => [...prev, actionRecord]);
        setRedoStack([]);

        onShowToast(`Discharge clearance approved for ${patName}.`, {
          onUndo: actionRecord.undo,
          onRedo: actionRecord.redo,
          undoLabel: '↺ Undo Discharge',
          redoLabel: '↻ Redo Discharge'
        });
      } catch (err) {
        onShowToast(err.message || 'Could not process discharge.');
      }
    }
  };

  const filteredPatients = patientsList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(patientSearch.toLowerCase()) || 
      p.id.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.room.toLowerCase().includes(patientSearch.toLowerCase());
    const matchesStatus = patientStatusFilter === 'All' || p.status === patientStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredStaff = staffList.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
      s.id.toLowerCase().includes(staffSearch.toLowerCase()) ||
      s.dept.toLowerCase().includes(staffSearch.toLowerCase());
    const matchesRole = staffRoleFilter === 'All' || s.role.toLowerCase().includes(staffRoleFilter.toLowerCase());
    const matchesStatus = staffStatusFilter === 'All' || s.status === staffStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const presentStaffCount = staffList.filter(s => s.status === 'Present').length;
  const absentStaffCount = staffList.filter(s => s.status === 'Absent').length;
  const leaveStaffCount = staffList.filter(s => s.status === 'On Leave').length;

  return (
    <div className="main-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span className="badge badge-teal" style={{ marginBottom: '6px' }}>Front Desk & Admission Console</span>
          <h1 className="section-title" style={{ fontSize: '2.2rem', margin: 0 }}>Receptionist Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* UNDO / REDO TOOLBAR CONTROLS */}
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

          <button className="btn btn-primary" onClick={() => setCheckinModal(true)}>
            <UserPlus size={16} /> Check-In New Patient
          </button>
        </div>
      </div>

      <div className="portal-tabs">
        <button className={`portal-tab-btn ${activeTab === 'opd_registration' ? 'active' : ''}`} onClick={() => setActiveTab('opd_registration')}>
          <UserPlus size={16} /> Outpatient (OPD) Specialist Registration
        </button>
        <button className={`portal-tab-btn ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
          <UserCheck size={16} /> Staff Attendance (Doctors, Nurses, Menial Staff)
        </button>
        <button className={`portal-tab-btn ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>
          <Search size={16} /> Patient Presence & Discharge Forms
        </button>
        <button className={`portal-tab-btn ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>
          <Bed size={16} /> Room Availability (150 Wards Matrix)
        </button>
        <button className={`portal-tab-btn ${activeTab === 'visiting' ? 'active' : ''}`} onClick={() => setActiveTab('visiting')}>
          <Clock size={16} /> Visiting Outsider Doctors Roster
        </button>
        <button className={`portal-tab-btn ${activeTab === 'leaves' ? 'active' : ''}`} onClick={() => setActiveTab('leaves')}>
          <FileText size={16} /> Staff Leave Forms Reader
        </button>
        <button className={`portal-tab-btn ${activeTab === 'roomchanges' ? 'active' : ''}`} onClick={() => setActiveTab('roomchanges')}>
          <Bed size={16} /> Room Change Approvals ({roomChangeRequests.filter(r => r.status === 'Pending').length})
        </button>
      </div>

      {/* 0. OPD / REGISTRATION TAB */}
      {activeTab === 'opd_registration' && (
        <div className="grid-2">
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus color="var(--accent-teal)" size={20} /> New Patient Registration Console
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Register new patients for either regular non-admitted specialist check-ups (OPD) or hospital admission (IPD).
            </p>

            <form onSubmit={handleRegisterPatient}>
              {/* Category Selector Card */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-teal)' }}>
                  1. Select Registration Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setRegCategory('opd')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: regCategory === 'opd' ? '2px solid var(--accent-teal)' : '1px solid rgba(255,255,255,0.1)',
                      background: regCategory === 'opd' ? 'rgba(46, 196, 182, 0.15)' : 'rgba(255,255,255,0.03)',
                      color: regCategory === 'opd' ? 'var(--accent-teal)' : '#cbd5e1',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>🟢 Non-Admitted / Regular Check-Up</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '2px' }}>OPD Outpatient Visit</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegCategory('ipd')}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: regCategory === 'ipd' ? '2px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.1)',
                      background: regCategory === 'ipd' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.03)',
                      color: regCategory === 'ipd' ? 'var(--accent-cyan)' : '#cbd5e1',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>🔵 Hospital Admission</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '2px' }}>IPD Inpatient Ward/Room</div>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Patient Name</label>
                <input type="text" className="form-input" value={regName} onChange={e => setRegName(e.target.value)} required placeholder="e.g. Rohit Bansal" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Age (Years)</label>
                  <input type="number" className="form-input" value={regAge} onChange={e => setRegAge(e.target.value)} required placeholder="35" />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-select" value={regGender} onChange={e => setRegGender(e.target.value)}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Specialist Doctor</label>
                <select className="form-select" value={regDoctor} onChange={e => setRegDoctor(e.target.value)}>
                  <option>Dr. Ananya Roy (Dermatologist)</option>
                  <option>Dr. Arvind Swamy (Cardiologist)</option>
                  <option>Dr. Meera Nambiar (Neurologist)</option>
                  <option>Dr. Rajeshwar Sharma (Orthopaedic)</option>
                  <option>Dr. Vikram Sethi (Dentist)</option>
                  <option>Dr. Kavita Menon (Gynecologist)</option>
                  <option>Dr. Rohan Kapur (Pediatrician)</option>
                </select>
              </div>

              {regCategory === 'ipd' && (
                <div className="form-group">
                  <label className="form-label">Hospital Room / Ward Category</label>
                  <select className="form-select" value={regRoomType} onChange={e => setRegRoomType(e.target.value)}>
                    <option>General Ward Bed</option>
                    <option>Private AC Deluxe Room</option>
                    <option>Private Non-AC Room</option>
                    <option>ICU Bed</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Chief Symptom / Consultation Reason</label>
                <textarea rows={2} className="form-input" value={regComplaint} onChange={e => setRegComplaint(e.target.value)} required />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Register Patient & Generate ID
              </button>
            </form>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px' }}>Registered OPD Walk-in Consultations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
              {patientsList.filter(p => p.status === 'OPD Patient' || p.room === 'OPD Walk-in').map(pat => (
                <div key={pat.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem' }}>{pat.name}</span>
                    <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>{pat.id}</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
                    Assigned: <strong style={{ color: 'var(--accent-teal)' }}>{pat.doctorAssigned}</strong>
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.78rem', marginTop: '4px' }}>
                    Complaint: {pat.condition}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 1. ATTENDANCE TAB */}
      {activeTab === 'attendance' && (
        <div>
          {/* Summary Stat Cards */}
          <div className="grid-4" style={{ marginBottom: '20px' }}>
            <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '12px' }}>
                <UserCheck size={22} color="var(--accent-teal)" />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Staff Present Today</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>{presentStaffCount} / {staffList.length}</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(244, 63, 94, 0.15)', padding: '12px', borderRadius: '12px' }}>
                <UserX size={22} color="var(--accent-rose)" />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Staff Absent</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>{absentStaffCount}</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '12px', borderRadius: '12px' }}>
                <UserMinus size={22} color="var(--accent-amber)" />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>On Leave</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>{leaveStaffCount}</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '12px', borderRadius: '12px' }}>
                <Clock size={22} color="var(--accent-cyan)" />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Attendance Rate</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                  {staffList.length ? Math.round((presentStaffCount / staffList.length) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>
                Daily Duty Attendance Roster (Doctors, Nurses & Support Staff)
              </h3>

              {/* Search & Filter Controls */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '32px', fontSize: '0.82rem', height: '34px' }}
                    placeholder="Search staff name/ID..."
                    value={staffSearch}
                    onChange={e => setStaffSearch(e.target.value)}
                  />
                </div>

                <select
                  className="form-select"
                  style={{ width: '130px', fontSize: '0.82rem', height: '34px' }}
                  value={staffRoleFilter}
                  onChange={e => setStaffRoleFilter(e.target.value)}
                >
                  <option value="All">All Roles</option>
                  <option value="Doctor">Doctors</option>
                  <option value="Nurse">Nurses</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Menial">Support Staff</option>
                </select>

                <select
                  className="form-select"
                  style={{ width: '130px', fontSize: '0.82rem', height: '34px' }}
                  value={staffStatusFilter}
                  onChange={e => setStaffStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Staff ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Current Status</th>
                    <th>Attendance Access Control</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map(stf => {
                    const approvedLeave = getApprovedLeaveForStaff(stf.name);
                    return (
                      <tr key={stf.id}>
                        <td><strong>{stf.id}</strong></td>
                        <td>
                          <strong style={{ color: '#fff' }}>{stf.name}</strong>
                          {approvedLeave && (
                            <div style={{ marginTop: '2px' }}>
                              <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                                ★ Admin Approved Leave ({approvedLeave.leaveDates})
                              </span>
                            </div>
                          )}
                        </td>
                        <td><span className="badge badge-cyan">{stf.role}</span></td>
                        <td>{stf.dept}</td>
                        <td>
                          <span className={`badge ${stf.status === 'Present' ? 'badge-teal' : stf.status === 'On Leave' ? 'badge-amber' : 'badge-rose'}`}>
                            {stf.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button 
                              className={`btn btn-sm ${stf.status === 'Present' ? 'btn-primary' : 'btn-secondary'}`}
                              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                              onClick={() => updateStaffAttendance(stf.id, 'Present')}
                            >
                              Mark Present
                            </button>
                            <button 
                              className={`btn btn-sm ${stf.status === 'Absent' ? 'btn-danger' : approvedLeave ? 'btn-danger' : 'btn-secondary'}`}
                              style={{
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                border: approvedLeave && stf.status !== 'Absent' ? '1px solid #ff6b6b' : undefined,
                                fontWeight: approvedLeave ? '700' : 'normal'
                              }}
                              onClick={() => updateStaffAttendance(stf.id, 'Absent')}
                            >
                              {approvedLeave && stf.status !== 'Absent' ? 'Mark Absent (Approved Leave)' : 'Mark Absent'}
                            </button>
                            <button 
                              className={`btn btn-sm ${stf.status === 'On Leave' ? 'btn-secondary' : 'btn-secondary'}`}
                              style={{
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                color: stf.status === 'On Leave' ? '#ffd166' : 'var(--text-muted)',
                                borderColor: stf.status === 'On Leave' ? '#ffd166' : 'var(--border-color)',
                                background: stf.status === 'On Leave' ? 'rgba(255,209,102,0.15)' : 'transparent'
                              }}
                              onClick={() => updateStaffAttendance(stf.id, 'On Leave')}
                            >
                              Mark On Leave
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. PATIENTS PRESENCE & DISCHARGE TAB */}
      {activeTab === 'patients' && (
        <div>
          <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="Search patient by ID, name, or room..."
                value={patientSearch}
                onChange={e => setPatientSearch(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} style={{ color: 'var(--text-muted)' }} />
              <select
                className="form-select"
                style={{ width: '170px' }}
                value={patientStatusFilter}
                onChange={e => setPatientStatusFilter(e.target.value)}
              >
                <option value="All">All Presence Statuses</option>
                <option value="Admitted">Admitted (In Ward)</option>
                <option value="Critical Care">Critical Care (ICU)</option>
                <option value="OPD Patient">OPD / Outpatient</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Patient Details</th>
                  <th>Assigned Doctor</th>
                  <th>Room / Ward</th>
                  <th>Condition</th>
                  <th>Presence Status Access</th>
                  <th>Discharge Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(pat => (
                  <tr key={pat.id}>
                    <td><strong>{pat.id}</strong></td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#fff' }}>{pat.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pat.age} yrs • {pat.gender}</div>
                    </td>
                    <td><span className="badge badge-cyan">{pat.doctorAssigned}</span></td>
                    <td>{pat.room}</td>
                    <td>{pat.condition}</td>
                    <td>
                      <select
                        className="form-select"
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.78rem',
                          height: '32px',
                          borderColor: pat.status === 'Admitted' ? 'var(--accent-teal)' : pat.status === 'Critical Care' ? 'var(--accent-rose)' : pat.status === 'Discharged' ? 'var(--border-color)' : 'var(--accent-amber)',
                          color: pat.status === 'Admitted' ? '#2ec4b6' : pat.status === 'Critical Care' ? '#ff6b6b' : '#fff'
                        }}
                        value={pat.status}
                        onChange={e => updatePatientPresence(pat.id, e.target.value)}
                      >
                        <option value="Admitted">Admitted (Present)</option>
                        <option value="Critical Care">Critical Care (ICU)</option>
                        <option value="OPD Patient">OPD Patient</option>
                        <option value="Discharged">Discharged</option>
                      </select>
                    </td>
                    <td>
                      {pat.status !== 'Discharged' ? (
                        <button className="btn btn-secondary btn-sm" onClick={() => handleDischargePatient(pat.id, pat.name)}>
                          <LogOut size={13} /> Discharge Clearance Form
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Discharged & Cleared</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ROOM AVAILABILITY TAB */}
      {activeTab === 'rooms' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>
                150-Room Realtime Availability Matrix (General Ward, AC/Non-AC, ICU)
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
                Click "Mark Occupied" or "Mark Free" on any room to toggle realtime availability status.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-teal">Free: {roomsList.filter(r => r.status === 'Available').length}</span>
              <span className="badge badge-rose">Occupied: {roomsList.filter(r => r.status === 'Occupied').length}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', maxHeight: '440px', overflowY: 'auto' }}>
            {roomsList.slice(0, 75).map(room => (
              <div 
                key={room.roomNumber}
                style={{ 
                  background: room.status === 'Available' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                  border: `1px solid ${room.status === 'Available' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                  borderRadius: '10px',
                  padding: '10px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>{room.roomNumber}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{room.type}</div>
                  <span className={`badge ${room.status === 'Available' ? 'badge-teal' : 'badge-rose'}`} style={{ fontSize: '0.65rem', marginTop: '4px' }}>
                    {room.status}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleRoomStatus(room.roomNumber)}
                  className={`btn btn-sm ${room.status === 'Available' ? 'btn-primary' : 'btn-danger'}`}
                  style={{ fontSize: '0.68rem', padding: '4px 6px', marginTop: '8px', width: '100%', borderRadius: '6px' }}
                >
                  {room.status === 'Available' ? 'Mark Occupied' : 'Mark Free (Available)'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VISITING DOCTORS TAB */}
      {activeTab === 'visiting' && (
        <div className="grid-2">
          {visitingDoctors.map(doc => (
            <div className="glass-card" key={doc.id} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-indigo">Outsider Visiting Specialist</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{doc.contact}</span>
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '4px' }}>{doc.name}</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--accent-teal)', marginBottom: '8px' }}>{doc.specialty} ({doc.hospital})</p>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <strong>Visiting Hours:</strong> {doc.visitingSchedule}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. LEAVE FORMS TAB */}
      {activeTab === 'leaves' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>Staff & Doctor Leave Forms (Admin Approved Roster)</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Note: Staff leave applications are reviewed and approved by Master Admin. Once approved, the receptionist uses this console to mark the staff member as ABSENT in attendance.
            </p>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Leave ID</th>
                  <th>Applicant Name</th>
                  <th>Role / Dept</th>
                  <th>Leave Duration</th>
                  <th>Reason</th>
                  <th>Admin Approval Status</th>
                  <th>Receptionist Attendance Action</th>
                </tr>
              </thead>
              <tbody>
                {leavesList.map(lv => {
                  const targetStaff = staffList.find(s => 
                    s.name.toLowerCase().includes(lv.applicantName.toLowerCase()) ||
                    lv.applicantName.toLowerCase().includes(s.name.toLowerCase())
                  );
                  const isMarkedAbsent = targetStaff && (targetStaff.status === 'Absent' || targetStaff.status === 'On Leave');

                  return (
                    <tr key={lv.id}>
                      <td><strong>{lv.id}</strong></td>
                      <td>
                        <strong style={{ color: '#fff' }}>{lv.applicantName}</strong>
                        {targetStaff && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                            Current Duty Status: {targetStaff.status}
                          </div>
                        )}
                      </td>
                      <td><span className="badge badge-cyan">{lv.role}</span> <span style={{ fontSize: '0.8rem' }}>{lv.dept}</span></td>
                      <td>{lv.leaveDates}</td>
                      <td style={{ fontSize: '0.82rem' }}>{lv.reason}</td>
                      <td>
                        <span className={`badge ${lv.status === 'Approved' ? 'badge-teal' : lv.status === 'Rejected' ? 'badge-rose' : 'badge-amber'}`}>
                          {lv.status === 'Approved' ? '✓ Admin Approved' : lv.status}
                        </span>
                      </td>
                      <td>
                        {lv.status === 'Approved' ? (
                          isMarkedAbsent ? (
                            <span className="badge badge-teal" style={{ fontSize: '0.78rem' }}>
                              ✓ Marked Absent in Attendance
                            </span>
                          ) : (
                            <button
                              className="btn btn-danger btn-sm"
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}
                              onClick={() => handleMarkAbsentForApprovedLeave(lv)}
                            >
                              <UserX size={13} /> Mark Absent in Attendance
                            </button>
                          )
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {lv.status === 'Pending Approval' ? 'Awaiting Admin Approval' : 'No Action Needed'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. ROOM CHANGE APPROVALS TAB */}
      {activeTab === 'roomchanges' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px' }}>
            Patient Room Change Requests (Approve assigns an available room automatically)
          </h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Patient</th>
                  <th>From Room</th>
                  <th>Requested Room</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {roomChangeRequests.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No room change requests submitted yet.</td>
                  </tr>
                ) : (
                  roomChangeRequests.map(req => (
                    <tr key={req.id}>
                      <td><strong>{req.id}</strong></td>
                      <td>
                        <strong style={{ color: '#fff' }}>{req.patientName}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>{req.patientId}</div>
                      </td>
                      <td>{req.fromRoom}</td>
                      <td><span className="badge badge-cyan">{req.toRoom}</span></td>
                      <td style={{ fontSize: '0.82rem' }}>{req.reason}</td>
                      <td>{req.date}</td>
                      <td>
                        <span className={`badge ${req.status === 'Approved' ? 'badge-teal' : req.status === 'Rejected' ? 'badge-rose' : 'badge-amber'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        {req.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-success btn-sm" onClick={() => handleRoomRequestDecision(req.id, 'Approved')}>
                              <Check size={13} /> Approve
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleRoomRequestDecision(req.id, 'Rejected')}>
                              <X size={13} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CHECKIN & REGISTRATION MODAL */}
      {checkinModal && (
        <div className="modal-overlay" onClick={() => setCheckinModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 style={{ color: '#fff' }}>New Patient Check-In & Registration</h3>
              <button className="close-modal-btn" onClick={() => setCheckinModal(false)}>✕</button>
            </div>
            <form onSubmit={handleRegisterPatient}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '700', color: 'var(--accent-teal)' }}>
                  Select Registration Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setRegCategory('opd')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: regCategory === 'opd' ? '2px solid var(--accent-teal)' : '1px solid rgba(255,255,255,0.1)',
                      background: regCategory === 'opd' ? 'rgba(46, 196, 182, 0.15)' : 'rgba(255,255,255,0.03)',
                      color: regCategory === 'opd' ? 'var(--accent-teal)' : '#cbd5e1',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>🟢 Non-Admitted (OPD)</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Regular Specialist Check-Up</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegCategory('ipd')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: regCategory === 'ipd' ? '2px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.1)',
                      background: regCategory === 'ipd' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.03)',
                      color: regCategory === 'ipd' ? 'var(--accent-cyan)' : '#cbd5e1',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>🔵 Hospital Admission (IPD)</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Assign Room / Bed</div>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Patient Full Name</label>
                <input type="text" className="form-input" value={regName} onChange={e => setRegName(e.target.value)} required placeholder="e.g. Aarav Kumar" />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input type="number" className="form-input" value={regAge} onChange={e => setRegAge(e.target.value)} required placeholder="30" />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-select" value={regGender} onChange={e => setRegGender(e.target.value)}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Assign Specialist Doctor</label>
                  <select className="form-select" value={regDoctor} onChange={e => setRegDoctor(e.target.value)}>
                    <option>Dr. Arvind Swamy (Cardiologist)</option>
                    <option>Dr. Ananya Roy (Dermatologist)</option>
                    <option>Dr. Meera Nambiar (Neurologist)</option>
                    <option>Dr. Rajeshwar Sharma (Orthopaedic)</option>
                    <option>Dr. Vikram Sethi (Dentist)</option>
                    <option>Dr. Kavita Menon (Gynecologist)</option>
                    <option>Dr. Rohan Kapur (Pediatrician)</option>
                  </select>
                </div>

                {regCategory === 'ipd' ? (
                  <div className="form-group">
                    <label className="form-label">Assign Room Category</label>
                    <select className="form-select" value={regRoomType} onChange={e => setRegRoomType(e.target.value)}>
                      <option>General Ward Bed</option>
                      <option>Private AC Deluxe Room</option>
                      <option>Private Non-AC Room</option>
                      <option>ICU Bed</option>
                    </select>
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">Consultation Status</label>
                    <input type="text" className="form-input" value="OPD Walk-in / Outpatient" disabled />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Chief Symptom / Consultation Reason</label>
                <input type="text" className="form-input" value={regComplaint} onChange={e => setRegComplaint(e.target.value)} required placeholder="e.g. Chest tightness or skin check" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setCheckinModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Register Patient & Issue ID</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
