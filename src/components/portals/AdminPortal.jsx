import React, { useState, useEffect } from 'react';
import { 
  Users, DollarSign, Wrench, AlertTriangle, Plus, Trash2, 
  FileText, Activity, Megaphone, Check, X, CalendarClock,
  Undo2, Redo2, RotateCcw
} from 'lucide-react';
import { staffApi, expenseApi, complaintApi, noticeApi, leaveApi, requisitionApi } from '../../api/hospitalApi';

export default function AdminPortal({ 
  staffList, setStaffList, 
  expensesList, setExpensesList, 
  complaintsList, setComplaintsList,
  patientsList, onShowToast,
  noticesList, setNoticesList,
  leavesList, setLeavesList,
  requisitionsList, setRequisitionsList
}) {
  const [activeTab, setActiveTab] = useState('budget');
  const [busy, setBusy] = useState(false);

  // New Staff Modal State
  const [newStaffModal, setNewStaffModal] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('Doctor');
  const [staffDept, setStaffDept] = useState('Cardiology');
  const [staffSalary, setStaffSalary] = useState('120000');

  // New Expense State
  const [newExpenseModal, setNewExpenseModal] = useState(false);
  const [expCategory, setExpCategory] = useState('Machinery & Diagnostic Equipment');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');

  // Patient Notice State
  const [noticeText, setNoticeText] = useState('');

  // Undo / Redo History Stack State
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Calculations
  const totalPayroll = staffList.reduce((acc, s) => acc + Number(s.salary), 0);
  const totalExpenses = expensesList.reduce((acc, e) => acc + Number(e.amount), 0);

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

  // Keyboard Shortcuts Listener (Ctrl+Z for Undo, Ctrl+Y / Ctrl+Shift+Z for Redo)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack]);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      let created;
      try {
        created = await staffApi.add({ name: staffName, role: staffRole, dept: staffDept, salary: Number(staffSalary) });
      } catch (e) {
        // Fallback for mock/offline
      }
      const newMember = (created && created.id) ? created : {
        id: `STF-${Math.floor(200 + Math.random() * 800)}`,
        name: staffName,
        role: staffRole,
        dept: staffDept,
        salary: Number(staffSalary),
        status: 'Present'
      };

      setStaffList(prev => [...prev, newMember]);
      setNewStaffModal(false);
      setStaffName('');

      // Create Action Record for Undo / Redo
      const actionRecord = {
        type: 'ADD_STAFF',
        description: `Added staff member ${newMember.name} (${newMember.role})`,
        item: newMember,
        undo: async () => {
          try { await staffApi.remove(newMember.id); } catch (e) {}
          setStaffList(prev => prev.filter(s => s.id !== newMember.id));
          onShowToast(`Undid addition of ${newMember.name}.`);
        },
        redo: async () => {
          try { await staffApi.add(newMember); } catch (e) {}
          setStaffList(prev => [...prev, newMember]);
          onShowToast(`Re-added staff member ${newMember.name}.`);
        }
      };

      setUndoStack(prev => [...prev, actionRecord]);
      setRedoStack([]);

      onShowToast(`Staff ${newMember.name} added successfully.`, {
        label: 'Undo Action',
        onClick: async () => {
          await actionRecord.undo();
          setUndoStack(prev => prev.filter(a => a !== actionRecord));
          setRedoStack(prev => [...prev, actionRecord]);
        }
      });
    } catch (err) {
      onShowToast(err.message || 'Could not add staff.');
    } finally {
      setBusy(false);
    }
  };

  const handleRemoveStaff = async (id, name) => {
    const targetStaff = staffList.find(s => s.id === id);
    if (!targetStaff) return;

    if (window.confirm(`Are you sure you want to remove staff member ${name}?`)) {
      const index = staffList.findIndex(s => s.id === id);
      try {
        await staffApi.remove(id);
      } catch (err) {
        // Fallback for local update if server fails
      }

      setStaffList(prev => prev.filter(s => s.id !== id));

      // Create Action Record for Undo / Redo
      const actionRecord = {
        type: 'REMOVE_STAFF',
        description: `Removed staff member ${name} (${targetStaff.role})`,
        item: targetStaff,
        index,
        undo: async () => {
          try {
            await staffApi.add(targetStaff);
          } catch (e) {}
          setStaffList(prev => {
            if (prev.some(s => s.id === targetStaff.id)) return prev;
            const next = [...prev];
            const insertIdx = index >= 0 && index <= next.length ? index : next.length;
            next.splice(insertIdx, 0, targetStaff);
            return next;
          });
          onShowToast(`Restored staff member ${name}.`);
        },
        redo: async () => {
          try {
            await staffApi.remove(targetStaff.id);
          } catch (e) {}
          setStaffList(prev => prev.filter(s => s.id !== targetStaff.id));
          onShowToast(`Removed staff member ${name}.`);
        }
      };

      setUndoStack(prev => [...prev, actionRecord]);
      setRedoStack([]);

      onShowToast(`Staff member ${name} removed.`, {
        label: 'Undo Action',
        onClick: async () => {
          await actionRecord.undo();
          setUndoStack(prev => prev.filter(a => a !== actionRecord));
          setRedoStack(prev => [...prev, actionRecord]);
        }
      });
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const created = await expenseApi.add({ category: expCategory, description: expDesc, amount: Number(expAmount) });
      setExpensesList([...expensesList, created]);
      onShowToast(`Expense ₹${expAmount} logged under ${expCategory}`);
      setNewExpenseModal(false);
      setExpDesc('');
      setExpAmount('');
    } catch (err) {
      onShowToast(err.message || 'Could not log expense.');
    } finally {
      setBusy(false);
    }
  };

  const handleBroadcastNotice = async (e) => {
    e.preventDefault();
    if (!noticeText) return;
    try {
      const updated = await noticeApi.add(noticeText);
      setNoticesList(updated);
      onShowToast('Hospital broadcast notice published!');
      setNoticeText('');
    } catch (err) {
      onShowToast(err.message || 'Could not publish notice.');
    }
  };

  const handleResolveComplaint = async (id) => {
    try {
      const updated = await complaintApi.resolve(id);
      setComplaintsList(complaintsList.map(c => c.id === id ? updated : c));
      onShowToast('Complaint marked as Resolved.');
    } catch (err) {
      onShowToast(err.message || 'Could not resolve complaint.');
    }
  };

  const handleLeaveDecision = async (id, status) => {
    try {
      const updated = await leaveApi.update(id, { status });
      setLeavesList(leavesList.map(l => l.id === id ? updated : l));
      onShowToast(`Leave ${id} ${status.toLowerCase()}.`);
    } catch (err) {
      onShowToast(err.message || 'Could not update leave status.');
    }
  };

  const handleRequisitionDecision = async (id, status) => {
    try {
      const updated = await requisitionApi.update(id, { status });
      setRequisitionsList(requisitionsList.map(r => r.id === id ? updated : r));
      onShowToast(`Requisition ${id} ${status.toLowerCase()}.`);
    } catch (err) {
      onShowToast(err.message || 'Could not update requisition status.');
    }
  };

  return (
    <div className="main-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span className="badge badge-rose" style={{ marginBottom: '6px' }}>Master Admin Access</span>
          <h1 className="section-title" style={{ fontSize: '2.2rem', margin: 0 }}>Hospital Administration Portal</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Undo / Redo Toolbar Controls */}
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
              title="Undo last staff action (Ctrl+Z)"
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

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Monthly Operating Budget</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-teal)' }}>₹28,50,000</div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="portal-tabs">
        <button className={`portal-tab-btn ${activeTab === 'budget' ? 'active' : ''}`} onClick={() => setActiveTab('budget')}>
          <DollarSign size={16} /> Budget & Machinery Expenses
        </button>
        <button className={`portal-tab-btn ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')}>
          <Users size={16} /> Staff Management & Salaries
        </button>
        <button className={`portal-tab-btn ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>
          <Activity size={16} /> Patient Notices & Admissions
        </button>
        <button className={`portal-tab-btn ${activeTab === 'complaints' ? 'active' : ''}`} onClick={() => setActiveTab('complaints')}>
          <AlertTriangle size={16} /> Complaint Box ({complaintsList.filter(c => c.status !== 'Resolved').length})
        </button>
        <button className={`portal-tab-btn ${activeTab === 'approvals' ? 'active' : ''}`} onClick={() => setActiveTab('approvals')}>
          <CalendarClock size={16} /> Leave & Requisition Approvals ({leavesList.filter(l => l.status === 'Pending Approval').length + requisitionsList.filter(r => r.status === 'Pending').length})
        </button>
      </div>

      {/* 1. BUDGET & EXPENSES TAB */}
      {activeTab === 'budget' && (
        <div>
          <div className="grid-3" style={{ marginBottom: '28px' }}>
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Monthly Staff Salary Expenditure</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-cyan)', margin: '4px 0' }}>
                ₹{totalPayroll.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)' }}>{staffList.length} Active Staff Members</div>
            </div>

            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Machinery, Repairs & Uniform Expenses</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-amber)', margin: '4px 0' }}>
                ₹{totalExpenses.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{expensesList.length} Approved Items</div>
            </div>

            <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => setNewExpenseModal(true)}>
                <Plus size={16} /> Log New Hospital Expense
              </button>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px' }}>Expense Ledger & Machinery Repair Accounts</h3>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>EXP ID</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date Logged</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expensesList.map(exp => (
                    <tr key={exp.id}>
                      <td><strong>{exp.id}</strong></td>
                      <td><span className="badge badge-cyan">{exp.category}</span></td>
                      <td>{exp.description}</td>
                      <td style={{ color: 'var(--accent-teal)', fontWeight: '700' }}>₹{exp.amount.toLocaleString()}</td>
                      <td>{exp.date}</td>
                      <td><span className="badge badge-teal">{exp.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. STAFF MANAGEMENT TAB */}
      {activeTab === 'staff' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>Staff Directory, Addition/Removal & Salary Register</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Tip: Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '4px', color: '#fff' }}>Ctrl + Z</kbd> to Undo or <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '4px', color: '#fff' }}>Ctrl + Y</kbd> to Redo staff additions/removals
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                style={{ opacity: undoStack.length === 0 ? 0.4 : 1 }}
              >
                <Undo2 size={14} /> Undo ({undoStack.length})
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                style={{ opacity: redoStack.length === 0 ? 0.4 : 1 }}
              >
                <Redo2 size={14} /> Redo ({redoStack.length})
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setNewStaffModal(true)}>
                <Plus size={14} /> Add New Staff Member
              </button>
            </div>
          </div>

          {/* Recently Removed Banner */}
          {undoStack.filter(a => a.type === 'REMOVE_STAFF').length > 0 && (
            <div style={{
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RotateCcw size={18} color="#ff6b6b" />
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.88rem' }}>Recently Removed Staff:</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                    {undoStack.filter(a => a.type === 'REMOVE_STAFF').map(a => `${a.item.name} (${a.item.role})`).join(', ')}
                  </span>
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                style={{ borderColor: '#ffd166', color: '#ffd166', background: 'rgba(255,209,102,0.1)', fontSize: '0.8rem' }}
                onClick={handleUndo}
              >
                <Undo2 size={13} /> Undo Last Deletion
              </button>
            </div>
          )}

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Monthly Salary</th>
                  <th>Attendance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map(stf => (
                  <tr key={stf.id}>
                    <td><strong>{stf.id}</strong></td>
                    <td><strong style={{ color: '#fff' }}>{stf.name}</strong></td>
                    <td><span className="badge badge-cyan">{stf.role}</span></td>
                    <td>{stf.dept}</td>
                    <td style={{ color: 'var(--accent-teal)', fontWeight: '700' }}>₹{stf.salary.toLocaleString()} / mo</td>
                    <td>
                      <span className={`badge ${stf.status === 'Present' ? 'badge-teal' : 'badge-amber'}`}>
                        {stf.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveStaff(stf.id, stf.name)}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PATIENTS & BROADCAST NOTICES TAB */}
      {activeTab === 'patients' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity color="var(--accent-teal)" size={20} /> Master Patient EHR & Hospital Admission Directory ({patientsList?.length || 0})
            </h3>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Name / Details</th>
                    <th>Assigned Doctor</th>
                    <th>Room / Ward</th>
                    <th>Condition</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(patientsList || []).map(pat => (
                    <tr key={pat.id}>
                      <td><strong>{pat.id}</strong></td>
                      <td>
                        <strong style={{ color: '#fff' }}>{pat.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pat.age} yrs • {pat.gender}</div>
                      </td>
                      <td><span className="badge badge-cyan">{pat.doctorAssigned}</span></td>
                      <td>{pat.room}</td>
                      <td>{pat.condition}</td>
                      <td>
                        <span className={`badge ${pat.status === 'Admitted' ? 'badge-teal' : pat.status === 'Critical Care' ? 'badge-rose' : 'badge-amber'}`}>
                          {pat.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid-2">
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Megaphone color="var(--accent-cyan)" size={20} /> Broadcast Notice to Patients & Staff
              </h3>

              <form onSubmit={handleBroadcastNotice}>
                <div className="form-group">
                  <label className="form-label">Notice Announcement Text</label>
                  <textarea 
                    className="form-textarea" 
                    rows={4} 
                    placeholder="Enter notice regarding visiting hours, sanitation, or emergency updates..." 
                    value={noticeText}
                    onChange={e => setNoticeText(e.target.value)}
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  <Megaphone size={16} /> Broadcast Notice
                </button>
              </form>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px' }}>Active Broadcast Bulletins</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {noticesList.map((note, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', borderLeft: '4px solid var(--accent-cyan)' }}>
                    <p style={{ color: '#fff', fontSize: '0.9rem' }}>{note}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Broadcasted by Admin Today</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. COMPLAINT BOX TAB */}
      {activeTab === 'complaints' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px' }}>Hospital Central Complaint Box</h3>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>CMP ID</th>
                  <th>Submitted By</th>
                  <th>Category</th>
                  <th>Subject & Details</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaintsList.map(cmp => (
                  <tr key={cmp.id}>
                    <td><strong>{cmp.id}</strong></td>
                    <td>
                      <div><strong>{cmp.submittedBy}</strong></div>
                      <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>{cmp.role}</span>
                    </td>
                    <td><span className="badge badge-amber">{cmp.category}</span></td>
                    <td>
                      <strong style={{ color: '#fff' }}>{cmp.subject}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cmp.detail}</div>
                    </td>
                    <td>{cmp.date}</td>
                    <td>
                      <span className={`badge ${cmp.status === 'Resolved' ? 'badge-teal' : 'badge-rose'}`}>
                        {cmp.status}
                      </span>
                    </td>
                    <td>
                      {cmp.status !== 'Resolved' && (
                        <button className="btn btn-success btn-sm" onClick={() => handleResolveComplaint(cmp.id)}>
                          <Check size={13} /> Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. LEAVE & REQUISITION APPROVALS TAB */}
      {activeTab === 'approvals' && (
        <div>
          <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText color="var(--accent-cyan)" size={20} /> Staff & Doctor Leave Approvals
            </h3>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Leave ID</th>
                    <th>Applicant</th>
                    <th>Role / Dept</th>
                    <th>Leave Duration</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leavesList.map(l => (
                    <tr key={l.id}>
                      <td><strong>{l.id}</strong></td>
                      <td><strong style={{ color: '#fff' }}>{l.applicantName}</strong></td>
                      <td><span className="badge badge-cyan">{l.role}</span> {l.dept}</td>
                      <td>{l.leaveDates}</td>
                      <td style={{ fontSize: '0.82rem' }}>{l.reason}</td>
                      <td>
                        <span className={`badge ${l.status === 'Approved' ? 'badge-teal' : l.status === 'Rejected' ? 'badge-rose' : 'badge-amber'}`}>
                          {l.status}
                        </span>
                      </td>
                      <td>
                        {l.status === 'Pending Approval' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-success btn-sm" onClick={() => handleLeaveDecision(l.id, 'Approved')}>
                              <Check size={13} /> Approve
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleLeaveDecision(l.id, 'Rejected')}>
                              <X size={13} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wrench color="var(--accent-amber)" size={20} /> Equipment & Medicine Requisition Approvals
            </h3>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Req ID</th>
                    <th>Requested By</th>
                    <th>Item & Qty</th>
                    <th>Justification</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requisitionsList.map(r => (
                    <tr key={r.id}>
                      <td><strong>{r.id}</strong></td>
                      <td>
                        <strong style={{ color: '#fff' }}>{r.submittedBy}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>{r.role} • {r.dept}</div>
                      </td>
                      <td><span className="badge badge-cyan">{r.itemName}</span> x{r.quantity}</td>
                      <td style={{ fontSize: '0.82rem' }}>{r.reason}</td>
                      <td>{r.date}</td>
                      <td>
                        <span className={`badge ${r.status === 'Approved' ? 'badge-teal' : r.status === 'Rejected' ? 'badge-rose' : 'badge-amber'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        {r.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-success btn-sm" onClick={() => handleRequisitionDecision(r.id, 'Approved')}>
                              <Check size={13} /> Approve
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleRequisitionDecision(r.id, 'Rejected')}>
                              <X size={13} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD STAFF */}
      {newStaffModal && (
        <div className="modal-overlay" onClick={() => setNewStaffModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#fff' }}>Add New Staff Member</h3>
              <button className="close-modal-btn" onClick={() => setNewStaffModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddStaff}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" value={staffName} onChange={e => setStaffName(e.target.value)} required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Role Category</label>
                  <select className="form-select" value={staffRole} onChange={e => setStaffRole(e.target.value)}>
                    <option>Doctor</option>
                    <option>Nurse</option>
                    <option>Receptionist</option>
                    <option>Pathologist</option>
                    <option>Radiologist</option>
                    <option>Menial Staff (Orderly/Janitor)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input type="text" className="form-input" value={staffDept} onChange={e => setStaffDept(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Monthly Salary (₹)</label>
                <input type="number" className="form-input" value={staffSalary} onChange={e => setStaffSalary(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setNewStaffModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Adding...' : 'Add Staff Member'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG EXPENSE */}
      {newExpenseModal && (
        <div className="modal-overlay" onClick={() => setNewExpenseModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#fff' }}>Log Hospital Expense</h3>
              <button className="close-modal-btn" onClick={() => setNewExpenseModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddExpense}>
              <div className="form-group">
                <label className="form-label">Expense Category</label>
                <select className="form-select" value={expCategory} onChange={e => setExpCategory(e.target.value)}>
                  <option>Machinery & Diagnostic Equipment</option>
                  <option>Staff Salary & Uniforms</option>
                  <option>Hospital Infrastructure Repair</option>
                  <option>Labs & Blood Bank Reagents</option>
                  <option>Pharmacy Wholesale Stock</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Expense Description</label>
                <input type="text" className="form-input" placeholder="e.g. Servicing of CT Scan Cooling Unit" value={expDesc} onChange={e => setExpDesc(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input type="number" className="form-input" placeholder="e.g. 85000" value={expAmount} onChange={e => setExpAmount(e.target.value)} required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setNewExpenseModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Logging...' : 'Log Expense'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
