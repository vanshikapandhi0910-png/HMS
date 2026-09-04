import React, { useState } from 'react';
import { 
  Building2, Heart, Award, ShieldCheck, Stethoscope, Users, Pill, 
  TestTube, Bed, Activity, CheckCircle2, Star, Clock, Calendar, ArrowRight,
  Sparkles, Search, Filter, PhoneCall
} from 'lucide-react';
import { HOSPITABLE_NURSES, SPECIALIST_DOCTORS, PHARMACY_MEDICINES } from '../data/hospitalData';

export default function HomeAbout({ stats, onOpenLoginModal, onNavigateServices }) {
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [pharmacySearch, setPharmacySearch] = useState('');

  const specialtiesList = ['All', 'Cardiologist', 'Neurologist', 'Orthopaedic', 'Dermatologist', 'Dentist', 'Physiotherapist', 'Pediatrician', 'Gynecologist', 'Pathologist', 'Radiologist'];

  const filteredDoctors = selectedSpecialty === 'All' 
    ? SPECIALIST_DOCTORS 
    : SPECIALIST_DOCTORS.filter(d => d.specialty === selectedSpecialty);

  const filteredPharmacy = PHARMACY_MEDICINES.filter(m => 
    m.name.toLowerCase().includes(pharmacySearch.toLowerCase()) || 
    m.category.toLowerCase().includes(pharmacySearch.toLowerCase())
  );

  return (
    <div className="main-container">
      {/* HERO BANNER */}
      <div className="hero-banner">
        <div>
          <div className="badge badge-teal" style={{ marginBottom: '16px' }}>
            <Sparkles size={14} /> Premier 150-Bed Multi-Specialty Hospital
          </div>
          <h1 className="hero-heading">
            World-Class Medical Care at <span>CITY Hospital</span>
          </h1>
          <p className="hero-desc">
            Empowering healthier lives through compassionate nursing care, renowned specialist doctors, an authorized & affordable pharmacy, 24/7 blood-testing labs, and cutting-edge ICUs & OPDs.
          </p>

          <div className="hero-stats-row">
            <div className="hero-stat-card">
              <div className="hero-stat-num">150</div>
              <div className="hero-stat-label">Total Beds Matrix</div>
            </div>
            <div className="hero-stat-card">
              <div className="hero-stat-num">45+</div>
              <div className="hero-stat-label">Specialist Doctors</div>
            </div>
            <div className="hero-stat-card">
              <div className="hero-stat-num">24/7</div>
              <div className="hero-stat-label">Inbuilt Blood Lab</div>
            </div>
            <div className="hero-stat-card">
              <div className="hero-stat-num">99.8%</div>
              <div className="hero-stat-label">Patient Recovery</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', marginTop: '28px' }}>
            <button className="btn btn-primary" onClick={onNavigateServices}>
              <Bed size={16} /> View Room & ICU Availability
            </button>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', background: 'rgba(11, 19, 43, 0.85)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity color="var(--accent-cyan)" size={20} /> Live Availability Tracker
            </h3>
            <span className="badge badge-teal">Updated Realtime</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>General Ward Beds</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>80 Total Capacity</div>
              </div>
              <span className="badge badge-cyan">{stats.generalWardBeds - stats.generalWardOccupied} Beds Free</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>AC Private Deluxe Rooms</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>40 Total Capacity</div>
              </div>
              <span className="badge badge-teal">{stats.acRoomsTotal - stats.acRoomsOccupied} Rooms Free</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Non-AC Separate Rooms</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>20 Total Capacity</div>
              </div>
              <span className="badge badge-amber">{stats.nonAcRoomsTotal - stats.nonAcRoomsOccupied} Rooms Free</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>ICUs & Cardiac Ventilators</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>10 Total Critical Units</div>
              </div>
              <span className="badge badge-rose">{stats.icuBedsTotal - stats.icuBedsOccupied} ICUs Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* BRIEF DESCRIPTION OF CITY HOSPITAL */}
      <section style={{ marginBottom: '50px' }}>
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div className="logo-icon-bg">
              <Building2 color="#fff" size={24} />
            </div>
            <div>
              <h2 className="section-title" style={{ fontSize: '1.8rem', margin: 0 }}>About CITY Hospital</h2>
              <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: '600' }}>NABH Accredited | Founded on Ethics, Empathy, & Clinical Excellence</p>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '20px' }}>
            Established with a mission to deliver international standard medical treatments at accessible costs, <strong>CITY Hospital</strong> is a premier 150-bed multi-specialty institution. Located in the heart of the city, our facility features 24-hour Emergency & Trauma Care, state-of-the-art Operation Theaters, advanced NABL-accredited diagnostic laboratories, 3.0T MRI, 128-slice CT scans, and a dedicated blood bank with component separation.
          </p>

          <div className="grid-3">
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <ShieldCheck color="var(--accent-teal)" size={24} style={{ marginBottom: '8px' }} />
              <h4 style={{ color: '#fff', marginBottom: '4px' }}>Patient First Ethics</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>100% transparent billing, zero hidden fees, and dedicated patient care coordinators for every ward.</p>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <Stethoscope color="var(--accent-cyan)" size={24} style={{ marginBottom: '8px' }} />
              <h4 style={{ color: '#fff', marginBottom: '4px' }}>Top Specialist Panel</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Senior consultants in Cardiology, Neurology, Orthopaedics, Pediatrics, Gynecology, Dermatology & Radiology.</p>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <TestTube color="var(--accent-indigo)" size={24} style={{ marginBottom: '8px' }} />
              <h4 style={{ color: '#fff', marginBottom: '4px' }}>Inbuilt Diagnostic Labs</h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Automated blood testing, pathology, and digital radiology reports available on your phone within 2 hours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOSPITABLE NURSES SECTION */}
      <section style={{ marginBottom: '50px' }}>
        <h2 className="section-title">Hospitable & Compassionate Nurses</h2>
        <p className="section-subtitle">
          Our nursing staff provides 24/7 attentive, warm, and highly skilled bedside care across ICUs, Wards, and Operating Suites.
        </p>

        <div className="grid-4">
          {HOSPITABLE_NURSES.map(nurse => (
            <div className="glass-card" key={nurse.id} style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <img src={nurse.image} alt={nurse.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '14px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="badge badge-teal">{nurse.shift}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={12} fill="var(--accent-amber)" /> {nurse.rating}
                </span>
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '2px' }}>{nurse.name}</h3>
              <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>{nurse.role}</p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                <div>• Assigned: <strong>{nurse.ward}</strong></div>
                <div>• Experience: <strong>{nurse.experience}</strong></div>
              </div>
              <p style={{ fontStyle: 'italic', fontSize: '0.82rem', color: '#cbd5e1', marginTop: 'auto', background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: '8px' }}>
                "{nurse.motto}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SPECIALIST DOCTORS SECTION */}
      <section style={{ marginBottom: '50px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 className="section-title">Specialist Doctors Directory</h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Consult with board-certified medical experts across 10 specialized departments.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {specialtiesList.map(sp => (
              <button
                key={sp}
                onClick={() => setSelectedSpecialty(sp)}
                className={`btn btn-sm ${selectedSpecialty === sp ? 'btn-primary' : 'btn-secondary'}`}
              >
                {sp}
              </button>
            ))}
          </div>
        </div>

        <div className="grid-3">
          {filteredDoctors.map(doctor => (
            <div className="glass-card doctor-card" key={doctor.id}>
              <img src={doctor.image} alt={doctor.name} className="doctor-img" />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge badge-cyan">{doctor.specialty}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--accent-amber)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={14} fill="var(--accent-amber)" /> {doctor.rating} ({doctor.reviews} reviews)
                </span>
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '4px' }}>{doctor.name}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{doctor.qualification}</p>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
                <div><Clock size={13} inline color="var(--accent-teal)" /> <strong>Timings:</strong> {doctor.timings}</div>
                <div><Building2 size={13} inline color="var(--accent-cyan)" /> <strong>Location:</strong> {doctor.cabin}</div>
                <div><CheckCircle2 size={13} inline color="var(--accent-teal)" /> <strong>Status:</strong> <span style={{ color: 'var(--accent-teal)' }}>{doctor.availability}</span></div>
                <div><strong>Consultation Fee:</strong> <span style={{ color: '#fff', fontWeight: '700' }}>{doctor.fee}</span></div>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>{doctor.bio}</p>

              <button className="btn btn-primary btn-sm" style={{ marginTop: 'auto', width: '100%' }} onClick={onOpenLoginModal}>
                <Calendar size={14} /> Book OPD Consultation
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* AUTHORISED & AFFORDABLE PHARMACY + INBUILT BLOOD LABS */}
      <section className="grid-2" style={{ marginBottom: '50px' }}>
        {/* Pharmacy Card */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div className="logo-icon-bg" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <Pill color="#fff" size={24} />
            </div>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.3rem' }}>Authorised & Affordable Pharmacy</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>24x7 In-House Pharmacy with up to 25% Discount on Generic Medicines</p>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="Search medicine by name or category..."
                value={pharmacySearch}
                onChange={e => setPharmacySearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
            {filteredPharmacy.map(med => (
              <div key={med.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff' }}>{med.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{med.category} • In Stock: {med.stock} units</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--accent-teal)' }}>₹{med.discountPrice} <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{med.price}</span></div>
                  <span className={`badge ${med.prescriptionReq ? 'badge-amber' : 'badge-teal'}`} style={{ fontSize: '0.7rem' }}>
                    {med.prescriptionReq ? 'Rx Req' : 'OTC'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blood Lab Card */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div className="logo-icon-bg" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              <TestTube color="#fff" size={24} />
            </div>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.3rem' }}>Inbuilt Blood-Testing & Pathology Labs</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>NABL Accredited Fully Automated Diagnostic Center</p>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            CITY Hospital operates an advanced 24x7 clinical pathology lab. All blood tests, lipid panels, liver function tests, and hormone assays are conducted using robotic analyzer machines for zero human error.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 color="var(--accent-teal)" size={20} />
              <div>
                <strong style={{ color: '#fff', fontSize: '0.9rem' }}>Fast Turnaround Time (2 Hours)</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Emergency blood panel results delivered to ICU and Patient Portal within 120 minutes.</p>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 color="var(--accent-cyan)" size={20} />
              <div>
                <strong style={{ color: '#fff', fontSize: '0.9rem' }}>24/7 Inbuilt Blood Bank</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cryo-preserved Packed Red Blood Cells (PRBC), Platelets & Fresh Frozen Plasma (FFP).</p>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 color="var(--accent-indigo)" size={20} />
              <div>
                <strong style={{ color: '#fff', fontSize: '0.9rem' }}>Direct Digital Uploads</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pathologists instantly upload verified lab reports directly to attending doctors & patients.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
