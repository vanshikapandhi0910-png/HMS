import React, { useState } from 'react';
import { 
  Bed, Cpu, Activity, Heart, Shield, Stethoscope, 
  CheckCircle2, AlertCircle, Sparkles, Building, Lock, FileText
} from 'lucide-react';
import { MEDICAL_MACHINES, INITIAL_ROOMS_DETAIL } from '../data/hospitalData';

export default function ServicesSection({ onShowToast, onOpenLoginModal }) {
  const [selectedRoomCategory, setSelectedRoomCategory] = useState('All');

  const filteredRooms = selectedRoomCategory === 'All'
    ? INITIAL_ROOMS_DETAIL
    : INITIAL_ROOMS_DETAIL.filter(r => r.type.includes(selectedRoomCategory));

  return (
    <div className="main-container">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="badge badge-cyan" style={{ marginBottom: '12px' }}>
          <Sparkles size={14} /> Comprehensive 150-Room & Medical Diagnostic Infrastructure
        </div>
        <h1 className="section-title" style={{ fontSize: '2.5rem' }}>CITY Hospital Services & Diagnostics</h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Explore our 150-room inpatient wards, top specialist departments, and high-tech diagnostic machinery (3.0T MRI, CT, PET-Scan, Modern OTs).
        </p>
      </div>

      {/* 1. 150 ROOMS INFRASTRUCTURE SECTION */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bed color="var(--accent-cyan)" size={24} /> 150-Rooms Availability & Matrix
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Breakdown of General Wards (80 Beds), Separate AC Rooms (40), Separate Non-AC Rooms (20), and Critical ICUs (10).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'General Ward', 'AC Deluxe', 'Non-AC', 'ICU'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedRoomCategory(cat)}
                className={`btn btn-sm ${selectedRoomCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Room Category Cards Overview */}
        <div className="grid-4" style={{ marginBottom: '28px' }}>
          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-cyan)' }}>
            <h4 style={{ color: '#fff', marginBottom: '6px' }}>General Ward</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>80 Beds</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Rate: ₹1,200 / night</div>
            <div className="badge badge-cyan" style={{ marginTop: '10px' }}>22 Available</div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-teal)' }}>
            <h4 style={{ color: '#fff', marginBottom: '6px' }}>Private AC Rooms</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-teal)' }}>40 Rooms</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Rate: ₹4,500 / night</div>
            <div className="badge badge-teal" style={{ marginTop: '10px' }}>11 Available</div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-amber)' }}>
            <h4 style={{ color: '#fff', marginBottom: '6px' }}>Private Non-AC Rooms</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-amber)' }}>20 Rooms</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Rate: ₹2,800 / night</div>
            <div className="badge badge-amber" style={{ marginTop: '10px' }}>6 Available</div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-rose)' }}>
            <h4 style={{ color: '#fff', marginBottom: '6px' }}>ICU & Cardiac Units</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-rose)' }}>10 ICUs</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Rate: ₹8,500 / night</div>
            <div className="badge badge-rose" style={{ marginTop: '10px' }}>3 Available</div>
          </div>
        </div>

        {/* Live Matrix Scrollable Grid preview of Rooms */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h4 style={{ color: '#fff', marginBottom: '14px', fontSize: '1.1rem' }}>Showing Live Status of 150 Rooms ({filteredRooms.length} Displayed)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
            {filteredRooms.slice(0, 48).map(room => (
              <div 
                key={room.roomNumber}
                style={{ 
                  background: room.status === 'Available' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                  border: `1px solid ${room.status === 'Available' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                  borderRadius: '10px',
                  padding: '10px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>{room.roomNumber}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{room.type}</div>
                <span className={`badge ${room.status === 'Available' ? 'badge-teal' : 'badge-rose'}`} style={{ fontSize: '0.65rem', marginTop: '4px' }}>
                  {room.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SPECIALIST DEPARTMENTS (10 KEY SPECIALTIES) */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Stethoscope color="var(--accent-teal)" size={24} /> 10 Specialist Departments & Diagnostics
        </h2>

        <div className="grid-2">
          {/* Protected Privacy Information Box */}
          <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(15, 23, 42, 0.9))', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="badge badge-indigo">Protected Digital Health Records</span>
              <Lock color="var(--accent-indigo)" size={24} />
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '8px' }}>Patient Diagnostic Reports Security Policy</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              In compliance with patient confidentiality protocols, diagnostic lab & radiology reports (CBC, MRI, CT, PET-Scans) are strictly accessible only to:
            </p>
            <ul style={{ fontSize: '0.84rem', color: '#fff', paddingLeft: '20px', lineHeight: '1.7', marginBottom: '20px' }}>
              <li><strong>The Patient:</strong> Accessible under their personal Patient ID in the Patient Care Portal.</li>
              <li><strong>The Concerned Consulting Doctor:</strong> Accessible under their Doctor ID in the Doctor Workstation.</li>
              <li><strong>Pathologist & Radiologist:</strong> Diagnostic uploads linked directly by Patient ID and Doctor ID.</li>
            </ul>
            <button className="btn btn-primary" onClick={onOpenLoginModal}>
              <Lock size={16} /> Login to Access Private Health Locker
            </button>
          </div>

          {/* List of 10 Specialties */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '14px' }}>Specialist Medical Services Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.85rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>1. Cardiologist:</strong> ECG, Angioplasty, TAVI & Cardiac ICU
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>2. Neurologist:</strong> Brain MRI, Stroke Care, Epilepsy Clinic
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>3. Orthopaedic:</strong> Robotic Joint Surgery & Fracture Care
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>4. Dermatologist:</strong> Laser Therapy & Clinical Skin Care
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>5. Dentist:</strong> Implantology & Painless Root Canal
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>6. Physiotherapist:</strong> Post-Op Rehab & Mobility Training
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>7. Pediatrician:</strong> Child Health & Neonatal NICU
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>8. Gynecologist:</strong> Maternity Suite & Fetal Care
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--accent-indigo)' }}>9. Pathologist:</strong> Blood Labs & Automated Hematology
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--accent-indigo)' }}>10. Radiologist:</strong> 3.0T MRI, CT & PET-Scan Diagnostics
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ADVANCED MEDICAL EXAMINATIONS & MACHINES SHOWCASE */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu color="var(--accent-blue)" size={24} /> High-Tech Medical Examinations & Machinery
        </h2>
        <p className="section-subtitle">
          Including 3.0T MRI, 128-Slice CT Scan, 24/7 Blood Bank, PET-Scan, and Modern Laminar Flow OTs.
        </p>

        <div className="grid-3">
          {MEDICAL_MACHINES.map(mac => (
            <div className="glass-card" key={mac.id} style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <img src={mac.image} alt={mac.name} style={{ width: '100%', height: '170px', objectFit: 'cover', borderRadius: '12px', marginBottom: '14px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="badge badge-cyan">{mac.dept}</span>
                <span className="badge badge-teal">{mac.status}</span>
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '6px' }}>{mac.name}</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{mac.description}</p>
              
              <div style={{ marginTop: 'auto', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Capacity: <strong style={{ color: '#fff' }}>{mac.dailyCapacity}</strong></span>
                <span>Calibrated: <strong style={{ color: 'var(--accent-teal)' }}>{mac.lastMaintenance}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
