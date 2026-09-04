import React from 'react';
import { Activity, Phone, Mail, MapPin, ShieldCheck, Heart, Award } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="main-container" style={{ padding: 0 }}>
        <div className="grid-4" style={{ marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div className="logo-icon-bg" style={{ width: '36px', height: '36px' }}>
                <Activity color="#fff" size={20} />
              </div>
              <span className="logo-text" style={{ fontSize: '1.2rem' }}>CITY HOSPITAL</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Providing world-class multi-specialty healthcare with 150 beds, advanced diagnostic labs, 24/7 ICU, affordable pharmacy, and top medical specialists.
            </p>
            <div className="badge badge-teal">
              <ShieldCheck size={14} /> NABH Accredited Hospital
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '16px' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('home')}>➔ Home & About CITY Hospital</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('services')}>➔ 150 Rooms Infrastructure & Wards</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('services')}>➔ Specialist Doctors Directory</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('services')}>➔ Diagnostic Scans (MRI, CT, PET)</li>
              <li style={{ cursor: 'pointer' }} onClick={() => onNavigate('reviews')}>➔ Patient Reviews & 5★ Ratings</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '16px' }}>Specialist Departments</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <li>• Cardiology & Heart Institute</li>
              <li>• Neurology & Stroke Care</li>
              <li>• Orthopaedics & Joint Surgery</li>
              <li>• Dermatology & Cosmetic Unit</li>
              <li>• Pediatrics & NICU Ward</li>
              <li>• Inbuilt Blood Bank & Pathology</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '16px' }}>Contact & Emergency</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--accent-cyan)" />
                <span>Sector 14, Health Boulevard, Metropolitan CITY</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="var(--accent-teal)" />
                <span>Emergency: +91 (800) 555-CITY</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="var(--accent-blue)" />
                <span>care@cityhospital.org</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <Award size={16} color="var(--accent-amber)" />
                <span>24x7 Ambulance & Blood Bank Available</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.82rem' }}>
          <div>© {new Date().getFullYear()} CITY Hospital Management System. All Rights Reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Built with <Heart size={14} color="var(--accent-rose)" fill="var(--accent-rose)" /> for world-class patient care.
          </div>
        </div>
      </div>
    </footer>
  );
}
