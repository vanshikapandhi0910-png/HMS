import React, { useState, useEffect } from 'react';
import {
  Pill, Activity, Clock, FileText, Plus, CheckCircle2, Moon, Sun,
  Bed, AlertTriangle, Send, LogOut, HeartPulse, Undo2, Redo2, RotateCcw
} from 'lucide-react';
import { PHARMACY_MEDICINES } from '../../data/hospitalData';
import { patientApi, leaveApi, catalogApi, requisitionApi } from '../../api/hospitalApi';

export default function NursePortal({
  patientsList, setPatientsList,
  leavesList, setLeavesList,
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('inventory');
  const [nurseShift, setNurseShift] = useState('Day Shift (08:00 AM - 08:00 PM)');

  // Undo / Redo Action History Stacks
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Equipment & Medicine Inventory state
  const [medicines, setMedicines] = useState(PHARMACY_MEDICINES);
  const [equipments, setEquipments] = useState([
    { id: "EQ-01", name: "Digital Sphygmomanometer (BP Monitor)", count: 18, status: "Normal" },
    { id: "EQ-02", name: "Pulse Oximeters (Fingertip)", count: 45, status: "Normal" },
    { id: "EQ-03", name: "Infusion Syringe Pumps", count: 12, status: "Low Stock" },
    { id: "EQ-04", name: "Oxygen Cylinders & Flowmeters", count: 30, status: "Normal" },
    { id: "EQ-05", name: "ECG 12-Lead Portable Machines", count: 5, status: "Normal" }
  ]);
  const [myRequisitions, setMyRequisitions] = useState([]);

  useEffect(() => {
    catalogApi.medicines()
      .then(items => { if (items && items.length) setMedicines(items); })
      .catch(() => { });
    requisitionApi.getAll()
      .then(items => { if (items && items.length) setMyRequisitions(items); })
      .catch(() => { });
  }, []);

  // Requisition form modal
  const [reqModal, setReqModal] = useState(false);
  const [reqItem, setReqItem] = useState('Infusion Syringe Pumps');
  const [reqQty, setReqQty] = useState('5');
  const [reqReason, setReqReason] = useState('ICU Bed Occupancy Increased');

  // Personal Nurse Leave form state
  const [leaveModal, setLeaveModal] = useState(false);
  const [leaveDates, setLeaveDates] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

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

  const handleToggleShift = () => {
    const prevShift = nurseShift;
    const nextShift = nurseShift.includes('Day')
      ? 'Night Shift (08:00 PM - 08:00 AM)'
      : 'Day Shift (08:00 AM - 08:00 PM)';

    setNurseShift(nextShift);

    const actionRecord = {
      type: 'TOGGLE_SHIFT',
      description: `Shift changed to ${nextShift}`,
      undo: async () => {
        setNurseShift(prevShift);
        onShowToast(`Undid shift change. Reverted to ${prevShift}.`);
      },
      redo: async () => {
        setNurseShift(nextShift);
        onShowToast(`Redid shift change. Set to ${nextShift}.`);
      }
    };

    setUndoStack(prev => [...prev, actionRecord]);
    setRedoStack([]);

    onShowToast(`Shift updated to ${nextShift}!`, {
      onUndo: actionRecord.undo,
      onRedo: actionRecord.redo,
      undoLabel: '↺ Undo Shift',
      redoLabel: '↻ Redo Shift'
    });
  };

  const handleSendRequisition = async (e) => {
    e.preventDefault();
    try {
      const created = await requisitionApi.add({ itemName: reqItem, quantity: Number(reqQty) || 1, reason: reqReason, dept: 'ICU Unit' });
      const newReq = created || {
        id: `REQ-${Math.floor(300 + Math.random() * 700)}`,
        itemName: reqItem,
        quantity: Number(reqQty) || 1,
        reason: reqReason,
        dept: 'ICU Unit',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };

      setMyRequisitions(prev => [newReq, ...prev]);
      setReqModal(false);

      const actionRecord = {
        type: 'ADD_REQUISITION',
        description: `Requested ${reqQty}x ${reqItem}`,
        undo: async () => {
          setMyRequisitions(prev => prev.filter(r => r.id !== newReq.id));
          onShowToast(`Undid requisition for ${reqItem}.`);
        },
        redo: async () => {
          setMyRequisitions(prev => [newReq, ...prev]);
          onShowToast(`Redid requisition for ${reqItem}.`);
        }
      };

      setUndoStack(prev => [...prev, actionRecord]);
      setRedoStack([]);

      onShowToast(`Requisition sent to Admin for ${reqQty}x ${reqItem}`, {
        onUndo: actionRecord.undo,
        onRedo: actionRecord.redo,
        undoLabel: '↺ Undo Req',
        redoLabel: '↻ Redo Req'
      });
    } catch (err) {
      onShowToast(err.message || 'Could not submit requisition.');
    }
  };

  const handleApplyNurseLeave = async (e) => {
    e.preventDefault();
    try {
      const created = await leaveApi.add({
        applicantName: 'Sister Mary Fernandez',
        role: 'Nurse',
        dept: 'ICU Unit',
        leaveDates,
        reason: leaveReason,
      });
      const newLeave = created || {
        id: `LV-${Math.floor(100 + Math.random() * 900)}`,
        applicantName: 'Sister Mary Fernandez',
        role: 'Nurse',
        dept: 'ICU Unit',
        leaveDates,
        reason: leaveReason,
        status: 'Pending Approval'
      };

      setLeavesList(prev => [newLeave, ...prev]);
      setLeaveModal(false);
      setLeaveDates('');
      setLeaveReason('');

      const actionRecord = {
        type: 'APPLY_LEAVE',
        description: `Applied nurse leave (${leaveDates})`,
        undo: async () => {
          setLeavesList(prev => prev.filter(l => l.id !== newLeave.id));
          onShowToast('Undid leave application.');
        },
        redo: async () => {
          setLeavesList(prev => [newLeave, ...prev]);
          onShowToast('Redid leave application.');
        }
      };

      setUndoStack(prev => [...prev, actionRecord]);
      setRedoStack([]);

      onShowToast('Personal leave form submitted to Admin!', {
        onUndo: actionRecord.undo,
        onRedo: actionRecord.redo,
        undoLabel: '↺ Undo Leave',
        redoLabel: '↻ Redo Leave'
      });
    } catch (err) {
      onShowToast(err.message || 'Could not submit leave.');
    }
  };

  const handleClearPatientDischarge = async (patId, patName) => {
    const targetPatient = patientsList.find(p => p.id === patId);
    if (!targetPatient) return;
    const oldStatus = targetPatient.status;

    try {
      const updated = await patientApi.update(patId, { status: 'Discharged' });
      setPatientsList(prev => prev.map(p => p.id === patId ? (updated || { ...p, status: 'Discharged' }) : p));

      const actionRecord = {
        type: 'DISCHARGE_PATIENT',
        description: `Signed discharge clearance for ${patName}`,
        patientId: patId,
        undo: async () => {
          try { await patientApi.update(patId, { status: oldStatus }); } catch (e) { }
          setPatientsList(prev => prev.map(p => p.id === patId ? { ...p, status: oldStatus } : p));
          onShowToast(`Undid discharge clearance. ${patName} status restored to ${oldStatus}.`);
        },
        redo: async () => {
          try { await patientApi.update(patId, { status: 'Discharged' }); } catch (e) { }
          setPatientsList(prev => prev.map(p => p.id === patId ? { ...p, status: 'Discharged' } : p));
          onShowToast(`Redid discharge clearance for ${patName}.`);
        }
      };

      setUndoStack(prev => [...prev, actionRecord]);
      setRedoStack([]);

      onShowToast(`Nursing Discharge Clearance signed for ${patName}!`, {
        onUndo: actionRecord.undo,
        onRedo: actionRecord.redo,
        undoLabel: '↺ Undo Discharge',
        redoLabel: '↻ Redo Discharge'
      });
    } catch (err) {
      onShowToast(err.message || 'Could not sign discharge.');
    }
  };

  return (
    <div className="main-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span className="badge badge-teal" style={{ marginBottom: '6px' }}>Bedside Care & Ward Operations</span>
          <h1 className="section-title" style={{ fontSize: '2.2rem', margin: 0 }}>Nurse Operations Portal</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* UNDO / REDO ACTION HISTORY CONTROLS */}
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

          {/* SHIFT SELECTION CONTROLLER */}
          <div className="glass-card" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Duty Shift</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {nurseShift.includes('Day') ? <Sun color="var(--accent-amber)" size={16} /> : <Moon color="var(--accent-indigo)" size={16} />}
                {nurseShift}
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleToggleShift}>
              Switch Shift
            </button>
          </div>
        </div>
      </div>

      <div className="portal-tabs">
        <button className={`portal-tab-btn ${activeTab === 'opd_intake' ? 'active' : ''}`} onClick={() => setActiveTab('opd_intake')}>
          <Activity size={16} /> Outpatient (OPD) Vitals & Case Intake
        </button>
        <button className={`portal-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
          <Pill size={16} /> Present Inventory & Requisitions
        </button>
        <button className={`portal-tab-btn ${activeTab === 'occupancy' ? 'active' : ''}`} onClick={() => setActiveTab('occupancy')}>
          <Bed size={16} /> Patients Occupying Rooms & Discharge Forms
        </button>
        <button className={`portal-tab-btn ${activeTab === 'leaves' ? 'active' : ''}`} onClick={() => setActiveTab('leaves')}>
          <FileText size={16} /> My Leave Applications ({leavesList.filter(l => l.role === 'Nurse').length})
        </button>
      </div>

      {/* 0. OPD VITALS & INTAKE TAB */}
      {activeTab === 'opd_intake' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity color="var(--accent-teal)" size={22} /> Outpatient Check-up Vitals & Baseline Systemic Intake
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Record baseline vital signs (BP, Pulse, SpO2, Temp) for non-admitted outpatient walk-ins before specialist consultation.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {patientsList.filter(p => p.status === 'OPD Patient' || p.room === 'OPD Walk-in').map(pat => (
              <div key={pat.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <span style={{ color: '#fff', fontWeight: '700', fontSize: '1.05rem' }}>{pat.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '10px' }}>ID: {pat.id} | Age: {pat.age}Y</span>
                  </div>
                  <span className="badge badge-teal">Assigned: {pat.doctorAssigned}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                  <div style={{ background: '#0f172a', padding: '8px', borderRadius: '6px' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Blood Pressure</label>
                    <input type="text" defaultValue="120/80 mmHg" style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--accent-teal)', fontWeight: '600', fontSize: '0.85rem' }} />
                  </div>
                  <div style={{ background: '#0f172a', padding: '8px', borderRadius: '6px' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Heart Rate</label>
                    <input type="text" defaultValue="76 bpm" style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--accent-teal)', fontWeight: '600', fontSize: '0.85rem' }} />
                  </div>
                  <div style={{ background: '#0f172a', padding: '8px', borderRadius: '6px' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Oxygen SpO2</label>
                    <input type="text" defaultValue="98%" style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--accent-teal)', fontWeight: '600', fontSize: '0.85rem' }} />
                  </div>
                  <div style={{ background: '#0f172a', padding: '8px', borderRadius: '6px' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Temperature</label>
                    <input type="text" defaultValue="98.6 °F" style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--accent-teal)', fontWeight: '600', fontSize: '0.85rem' }} />
                  </div>
                  <div style={{ background: '#0f172a', padding: '8px', borderRadius: '6px' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Resp Rate</label>
                    <input type="text" defaultValue="16 / min" style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--accent-teal)', fontWeight: '600', fontSize: '0.85rem' }} />
                  </div>
                </div>

                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => onShowToast(`Baseline vitals logged for ${pat.name}! Synced to Doctor Portal.`)}
                    className="btn btn-sm btn-primary"
                    style={{ fontSize: '0.78rem' }}
                  >
                    Save & Sync Vitals
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1. INVENTORY & REQUISITIONS */}
      {activeTab === 'inventory' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>Equipments & Medicines Present in Ward</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setReqModal(true)}>
              <Plus size={14} /> Request Required Equipments / Medicines
            </button>
          </div>

          <div className="grid-2" style={{ marginBottom: '24px' }}>
            {/* Equipment Box */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '12px' }}>Ward Medical Equipments</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {equipments.map(eq => (
                  <div key={eq.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.9rem' }}>{eq.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Quantity Present: {eq.count} units</div>
                    </div>
                    <span className={`badge ${eq.status === 'Normal' ? 'badge-teal' : 'badge-amber'}`}>{eq.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Medicines Stock Box */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h4 style={{ color: 'var(--accent-teal)', marginBottom: '12px' }}>Ward Pharmacy & Emergency Drugs Stock</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                {medicines.map(med => (
                  <div key={med.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.88rem' }}>{med.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{med.category}</div>
                    </div>
                    <span className="badge badge-cyan">{med.stock} in stock</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Requisition History */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ color: '#fff', marginBottom: '12px' }}>My Requisition History & Status</h4>
            {myRequisitions.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No requisitions submitted yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {myRequisitions.map(req => (
                  <div key={req.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.9rem' }}>{req.itemName} (x{req.quantity})</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.reason} • {req.date}</div>
                    </div>
                    <span className={`badge ${req.status === 'Approved' ? 'badge-teal' : req.status === 'Rejected' ? 'badge-rose' : 'badge-amber'}`}>{req.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. ROOM OCCUPANCY & DISCHARGE FORMS */}
      {activeTab === 'occupancy' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px' }}>
            Patients Occupying Rooms & Bedside Nursing Vitals
          </h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Occupied Room / Bed</th>
                  <th>Attending Doctor</th>
                  <th>Clinical Status</th>
                  <th>Nursing Action</th>
                </tr>
              </thead>
              <tbody>
                {patientsList.map(pat => (
                  <tr key={pat.id}>
                    <td><strong>{pat.id}</strong></td>
                    <td><strong style={{ color: '#fff' }}>{pat.name}</strong> ({pat.age} yrs)</td>
                    <td><span className="badge badge-cyan">{pat.room}</span></td>
                    <td>{pat.doctorAssigned}</td>
                    <td>
                      <span className={`badge ${pat.status === 'Admitted' ? 'badge-teal' : pat.status === 'Critical Care' ? 'badge-rose' : 'badge-amber'}`}>
                        {pat.status}
                      </span>
                    </td>
                    <td>
                      {pat.status !== 'Discharged' ? (
                        <button className="btn btn-secondary btn-sm" onClick={() => handleClearPatientDischarge(pat.id, pat.name)}>
                          <LogOut size={13} /> Sign Nursing Discharge Form
                        </button>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="badge badge-teal" style={{ fontSize: '0.78rem' }}>✓ Cleared for Discharge</span>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '2px 8px', fontSize: '0.72rem', borderColor: '#ffd166', color: '#ffd166' }}
                            onClick={() => handleUndo()}
                            title="Undo discharge action"
                          >
                            <Undo2 size={12} /> Undo
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '2px 8px', fontSize: '0.72rem', borderColor: '#2ec4b6', color: '#2ec4b6' }}
                            onClick={() => handleRedo()}
                            title="Redo action"
                          >
                            <Redo2 size={12} /> Redo
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. LEAVE FORMS (SELF & DOCTORS) */}
      {activeTab === 'leaves' && (
        <div className="grid-2">
          {/* Apply Leave for Nurses */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.15rem' }}>Apply Personal Nurse Leave Form</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setLeaveModal(true)}>
                <Plus size={14} /> Apply Leave
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Submit your shift coverage leave application to the Chief Nursing Officer and Admin.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {leavesList.filter(l => l.role === 'Nurse').map(l => (
                <div key={l.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', borderLeft: '4px solid var(--accent-cyan)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: '#fff' }}>{l.applicantName}</strong>
                    <span className={`badge ${l.status === 'Approved' ? 'badge-teal' : 'badge-amber'}`}>{l.status}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '2px' }}>{l.leaveDates}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Reason: {l.reason}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Read Doctors Approved Leave Forms */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '14px' }}>
              Read Doctors' Approved Leave Schedule
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Check doctor availability to manage patient OPD queues and on-call emergency duty.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {leavesList.filter(l => l.role === 'Doctor').map(l => (
                <div key={l.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', borderLeft: '4px solid var(--accent-teal)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: '#fff' }}>{l.applicantName} ({l.dept})</strong>
                    <span className="badge badge-teal">{l.status}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-teal)', marginTop: '2px' }}>{l.leaveDates}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Reason: {l.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REQUISITION MODAL */}
      {reqModal && (
        <div className="modal-overlay" onClick={() => setReqModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#fff' }}>Request Required Equipment / Medicines</h3>
              <button className="close-modal-btn" onClick={() => setReqModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSendRequisition}>
              <div className="form-group">
                <label className="form-label">Select Equipment / Medicine Required</label>
                <input type="text" className="form-input" value={reqItem} onChange={e => setReqItem(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity Needed</label>
                <input type="number" className="form-input" value={reqQty} onChange={e => setReqQty(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Clinical Justification / Reason</label>
                <textarea className="form-textarea" rows={3} value={reqReason} onChange={e => setReqReason(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setReqModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><Send size={14} /> Submit Requisition</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NURSE LEAVE MODAL */}
      {leaveModal && (
        <div className="modal-overlay" onClick={() => setLeaveModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#fff' }}>Apply Nurse Leave Form</h3>
              <button className="close-modal-btn" onClick={() => setLeaveModal(false)}>✕</button>
            </div>
            <form onSubmit={handleApplyNurseLeave}>
              <div className="form-group">
                <label className="form-label">Leave Duration (Dates)</label>
                <input type="text" className="form-input" placeholder="e.g. 2026-08-12 to 2026-08-14" value={leaveDates} onChange={e => setLeaveDates(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Reason for Leave</label>
                <textarea className="form-textarea" rows={3} placeholder="Enter personal or medical reason..." value={leaveReason} onChange={e => setLeaveReason(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setLeaveModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Leave Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
