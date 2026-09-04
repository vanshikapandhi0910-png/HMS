import React, { useState, useEffect } from 'react';
import { 
  Calendar, CreditCard, Bed, AlertTriangle, FileText, Download, Eye, 
  Plus, CheckCircle2, Stethoscope, Clock, ShieldCheck, DollarSign
} from 'lucide-react';
import { SPECIALIST_DOCTORS, INITIAL_CASE_RECORDS } from '../../data/hospitalData';
import { appointmentApi, billApi, complaintApi, prescriptionApi, roomRequestApi, caseRecordApi } from '../../api/hospitalApi';
import CaseTakingSuite from '../caseTaking/CaseTakingSuite';

export default function PatientPortal({ 
  currentUser, 
  reportsList, 
  patientsList = [],
  complaintsList, setComplaintsList, 
  onShowToast 
}) {
  const [activeTab, setActiveTab] = useState('casehistory');

  // Case Record & Profile for Patient
  const activePatientId = currentUser?.id || 'PAT-1001';
  const currentPatientObj = patientsList.find(p => p.id.toLowerCase() === activePatientId.toLowerCase()) || {
    id: activePatientId,
    name: currentUser?.name || 'Patient',
    status: 'OPD / Admitted',
    condition: 'Regular Specialist Check-Up'
  };

  const [caseRecord, setCaseRecord] = useState(
    INITIAL_CASE_RECORDS.find(r => r.patientId.toLowerCase() === activePatientId.toLowerCase()) || INITIAL_CASE_RECORDS[0]
  );

  useEffect(() => {
    caseRecordApi.getAll({ patientId: activePatientId })
      .then(records => {
        if (records && records.length) setCaseRecord(records[0]);
      })
      .catch(() => {});
  }, [activePatientId]);

  // Appointments State (loaded from server)
  const [appointments, setAppointments] = useState([]);
  const [aptModal, setAptModal] = useState(false);
  const [aptDoctor, setAptDoctor] = useState('Dr. Arvind Swamy');
  const [aptDate, setAptDate] = useState('2026-08-05');
  const [aptTime, setAptTime] = useState('11:00 AM');
  const [aptReason, setAptReason] = useState('Routine Cardiac Follow-Up');

  // Patient Invoices & Bill State (loaded from server)
  const [bills, setBills] = useState([]);

  // Prescriptions for this patient (loaded from server)
  const [myPrescriptions, setMyPrescriptions] = useState([]);

  // Room Change Requests (loaded from server)
  const [roomRequests, setRoomRequests] = useState([]);

  useEffect(() => {
    appointmentApi.getByPatient(activePatientId)
      .then(setAppointments)
      .catch(() => {});
    billApi.getByPatient(activePatientId)
      .then(setBills)
      .catch(() => {});
    prescriptionApi.getAll({ patientId: activePatientId })
      .then(setMyPrescriptions)
      .catch(() => {});
    roomRequestApi.getAll({ patientId: activePatientId })
      .then(setRoomRequests)
      .catch(() => {});
  }, [activePatientId]);

  // Room Change Request State
  const [roomChangeModal, setRoomChangeModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('General Ward - Bed 14');
  const [requestedRoom, setRequestedRoom] = useState('Private AC Deluxe Room (₹4,500/night)');
  const [roomChangeReason, setRoomChangeReason] = useState('Prefer private space for recovery with family');

  // Complaint Box State
  const [complaintCategory, setComplaintCategory] = useState('Nursing & Housekeeping');
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDetail, setComplaintDetail] = useState('');

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    const docObj = SPECIALIST_DOCTORS.find(d => d.name === aptDoctor) || SPECIALIST_DOCTORS[0];
    try {
      const created = await appointmentApi.add({
        patientId: activePatientId,
        doctorName: docObj.name,
        specialty: docObj.specialty,
        date: aptDate,
        time: aptTime,
        cabin: docObj.cabin,
        reason: aptReason,
      });
      setAppointments([created, ...appointments]);
      onShowToast(`OPD Appointment confirmed with ${docObj.name} for ${aptDate} at ${aptTime}!`);
      setAptModal(false);
    } catch (err) {
      onShowToast(err.message || 'Could not book appointment.');
    }
  };

  const handlePayBill = async (id, amount) => {
    try {
      const updated = await billApi.pay(id);
      setBills(bills.map(b => b.id === id ? updated : b));
      onShowToast(`Invoice ${id} for ₹${amount} paid online via Patient Portal!`);
    } catch (err) {
      onShowToast(err.message || 'Could not process payment.');
    }
  };

  const handleRequestRoomChange = async (e) => {
    e.preventDefault();
    try {
      const created = await roomRequestApi.add({
        patientId: activePatientId,
        patientName: currentUser ? currentUser.name : 'Aarav Kumar',
        fromRoom: currentRoom,
        toRoom: requestedRoom,
        reason: roomChangeReason,
      });
      setRoomRequests([created, ...roomRequests]);
      onShowToast(`Room Change Request to "${requestedRoom}" submitted to Reception!`);
      setRoomChangeModal(false);
    } catch (err) {
      onShowToast(err.message || 'Could not submit room change request.');
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    try {
      const created = await complaintApi.add({
        submittedBy: currentUser ? currentUser.name : 'Aarav Kumar (Patient)',
        role: 'Patient',
        category: complaintCategory,
        subject: complaintSubject,
        detail: complaintDetail,
      });
      setComplaintsList([created, ...complaintsList]);
      onShowToast('Complaint submitted directly to Admin & Grievance Box.');
      setComplaintSubject('');
      setComplaintDetail('');
    } catch (err) {
      onShowToast(err.message || 'Could not submit complaint.');
    }
  };

  const patientReports = reportsList.filter(r => 
    r.patientId.toLowerCase() === activePatientId.toLowerCase() ||
    (currentUser?.name && r.patientName.toLowerCase().includes(currentUser.name.toLowerCase())) ||
    (activePatientId === 'PAT-1001' && r.patientName.includes('Aarav'))
  );

  return (
    <div className="main-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span className="badge badge-teal" style={{ marginBottom: '6px' }}>Personal Health Locker & Self-Service</span>
          <h1 className="section-title" style={{ fontSize: '2.2rem', margin: 0 }}>Patient Care Portal</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setAptModal(true)}>
          <Calendar size={16} /> Book Doctor Appointment
        </button>
      </div>

      <div className="portal-tabs">
        <button className={`portal-tab-btn ${activeTab === 'casehistory' ? 'active' : ''}`} onClick={() => setActiveTab('casehistory')}>
          <Stethoscope size={16} /> My Case History & Visual Health Map
        </button>
        <button className={`portal-tab-btn ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
          <Calendar size={16} /> Doctor OPD Appointments
        </button>
        <button className={`portal-tab-btn ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')}>
          <CreditCard size={16} /> Hospital Bills & Online Payment
        </button>
        <button className={`portal-tab-btn ${activeTab === 'roomchange' ? 'active' : ''}`} onClick={() => setActiveTab('roomchange')}>
          <Bed size={16} /> Room Change Requests
        </button>
        <button className={`portal-tab-btn ${activeTab === 'records' ? 'active' : ''}`} onClick={() => setActiveTab('records')}>
          <FileText size={16} /> Prescriptions & Blood / Radiology Reports
        </button>
        <button className={`portal-tab-btn ${activeTab === 'complaint' ? 'active' : ''}`} onClick={() => setActiveTab('complaint')}>
          <AlertTriangle size={16} /> Patient Complaint Box
        </button>
      </div>

      {/* 0. CASE HISTORY & HEALTH MAP TAB */}
      {activeTab === 'casehistory' && (
        <CaseTakingSuite
          patient={currentPatientObj}
          currentUser={currentUser}
          existingRecord={caseRecord}
          readOnly={true}
          onShowToast={onShowToast}
        />
      )}

      {/* 1. BOOK APPOINTMENTS TAB */}
      {activeTab === 'appointments' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>My OPD Appointments</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setAptModal(true)}>
              <Plus size={14} /> Book New Appointment
            </button>
          </div>

          <div className="grid-2">
            {appointments.map(apt => (
              <div className="glass-card" key={apt.id} style={{ padding: '20px', borderLeft: '4px solid var(--accent-cyan)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-cyan">{apt.specialty}</span>
                  <span className="badge badge-teal">{apt.status}</span>
                </div>
                <h4 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '4px' }}>{apt.doctorName}</h4>
                <div style={{ fontSize: '0.84rem', color: 'var(--accent-teal)', marginBottom: '10px' }}>
                  <Clock size={14} inline /> {apt.date} at {apt.time}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location: {apt.cabin}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. BILLING & INVOICES TAB */}
      {activeTab === 'billing' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px' }}>Hospital Itemized Invoices & Bill Payment</h3>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Service Description</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Payment Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(b => (
                  <tr key={b.id}>
                    <td><strong>{b.id}</strong></td>
                    <td>{b.description}</td>
                    <td style={{ color: 'var(--accent-teal)', fontWeight: '700' }}>₹{b.amount.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${b.status === 'Paid' ? 'badge-teal' : 'badge-amber'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.status !== 'Paid' ? (
                        <button className="btn btn-success btn-sm" onClick={() => handlePayBill(b.id, b.amount)}>
                          <CreditCard size={14} /> Pay ₹{b.amount} Online
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Receipt Downloaded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. OPTION TO CHANGE ROOM TAB */}
      {activeTab === 'roomchange' && (
        <div className="grid-2">
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bed color="var(--accent-cyan)" size={20} /> Request Room Upgrade or Change
            </h3>

            <form onSubmit={handleRequestRoomChange}>
              <div className="form-group">
                <label className="form-label">Current Room / Ward</label>
                <input type="text" className="form-input" value={currentRoom} onChange={e => setCurrentRoom(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Desired Room Category</label>
                <select className="form-select" value={requestedRoom} onChange={e => setRequestedRoom(e.target.value)}>
                  <option>Private AC Deluxe Room (₹4,500/night)</option>
                  <option>Private Non-AC Room (₹2,800/night)</option>
                  <option>General Ward Bed (₹1,200/night)</option>
                  <option>VIP Suite (₹8,000/night)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Reason for Room Change</label>
                <textarea className="form-textarea" rows={3} value={roomChangeReason} onChange={e => setRoomChangeReason(e.target.value)} required />
              </div>

              <button type="submit" className="btn btn-primary">
                Submit Room Change Request
              </button>
            </form>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px' }}>Room Change History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {roomRequests.map(r => (
                <div key={r.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', borderLeft: '4px solid var(--accent-teal)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ color: '#fff' }}>{r.id}</strong>
                    <span className={`badge ${r.status === 'Approved' ? 'badge-teal' : r.status === 'Rejected' ? 'badge-rose' : 'badge-amber'}`}>{r.status}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>From {r.fromRoom} ➔ {r.toRoom}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Requested on: {r.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. PRESCRIPTIONS & REPORTS LOCKER */}
      {activeTab === 'records' && (
        <div className="grid-2">
          {/* Digital Prescriptions */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText color="var(--accent-cyan)" size={20} /> Doctor Prescriptions
            </h3>
            {myPrescriptions.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                No prescriptions currently on file for Patient ID {activePatientId}.
              </div>
            ) : (
              myPrescriptions.map(rx => (
                <div key={rx.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', marginBottom: '12px' }}>
                  <div style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{rx.id} • {rx.date}</div>
                  <div style={{ fontSize: '0.9rem', color: '#fff', margin: '4px 0' }}>Doctor: {rx.doctorName}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Diagnosis: {rx.diagnosis}</div>
                </div>
              ))
            )}
          </div>

          {/* Blood & Radiology Test Reports */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText color="var(--accent-teal)" size={20} /> Blood Test & Radiology Reports
            </h3>
            {patientReports.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                No diagnostic lab or radiology reports currently on file for Patient ID {activePatientId}.
              </div>
            ) : (
              patientReports.map(rep => (
                <div key={rep.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#fff' }}>{rep.testType}</strong>
                    <span className={`badge ${rep.status.includes('Normal') ? 'badge-teal' : 'badge-rose'}`}>{rep.status}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', margin: '4px 0' }}>
                    Doctor: {rep.doctorName || 'Dr. Arvind Swamy'} ({rep.doctorId || 'DOC-101'})
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Uploaded By: {rep.uploadedBy} on {rep.uploadDate}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#fff', margin: '6px 0' }}>Findings: {rep.findings}</div>
                  <button className="btn btn-secondary btn-sm" onClick={() => alert(`Downloading official PDF for ${rep.testType} (Patient ID: ${rep.patientId}, Doctor ID: ${rep.doctorId})...`)}>
                    <Download size={13} /> Download PDF
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. COMPLAINT BOX TAB */}
      {activeTab === 'complaint' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle color="var(--accent-amber)" size={20} /> Submit Complaint to Hospital Management
          </h3>

          <form onSubmit={handleSubmitComplaint}>
            <div className="form-group">
              <label className="form-label">Complaint Category</label>
              <select className="form-select" value={complaintCategory} onChange={e => setComplaintCategory(e.target.value)}>
                <option>Nursing & Housekeeping Care</option>
                <option>Food & Drinking Water</option>
                <option>Pharmacy & Medicine Pricing</option>
                <option>Lab Report Delay</option>
                <option>Doctor Consultation Timing</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input type="text" className="form-input" placeholder="e.g. Delay in morning vital check" value={complaintSubject} onChange={e => setComplaintSubject(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description</label>
              <textarea className="form-textarea" rows={4} placeholder="Provide details regarding room number, time, and issue experienced..." value={complaintDetail} onChange={e => setComplaintDetail(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit Grievance Complaint
            </button>
          </form>
        </div>
      )}

      {/* MODAL: APPOINTMENT BOOKING */}
      {aptModal && (
        <div className="modal-overlay" onClick={() => setAptModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#fff' }}>Book Specialist Doctor OPD Appointment</h3>
              <button className="close-modal-btn" onClick={() => setAptModal(false)}>✕</button>
            </div>
            <form onSubmit={handleBookAppointment}>
              <div className="form-group">
                <label className="form-label">Select Specialist Doctor</label>
                <select className="form-select" value={aptDoctor} onChange={e => setAptDoctor(e.target.value)}>
                  {SPECIALIST_DOCTORS.map(d => (
                    <option key={d.id} value={d.name}>{d.name} ({d.specialty} - Fee: {d.fee})</option>
                  ))}
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input type="date" className="form-input" value={aptDate} onChange={e => setAptDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Time Slot</label>
                  <select className="form-select" value={aptTime} onChange={e => setAptTime(e.target.value)}>
                    <option>10:00 AM</option>
                    <option>11:30 AM</option>
                    <option>02:00 PM</option>
                    <option>04:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reason for Consultation</label>
                <textarea className="form-textarea" rows={2} value={aptReason} onChange={e => setAptReason(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setAptModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm OPD Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
