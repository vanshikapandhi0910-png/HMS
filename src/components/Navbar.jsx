import React from 'react';
import { Activity, Shield, Stethoscope, Star, User, LogOut, PhoneCall, Bed, HeartPulse } from 'lucide-react';
import { clearToken } from '../api/client';

export default function Navbar({ activeTab, setActiveTab, currentUser, setCurrentUser, onOpenLoginModal }) {
  return (
    <>
      <div className="top-ticker">
        <div className="top-ticker-item">
          <span className="pulse-dot"></span>
          <strong>CITY Hospital Emergency Hotline:</strong> +91 (800) 555-CITY / 108 (24x7 Ambulance Active)
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span className="top-ticker-item">
            <Bed size={14} style={{ color: 'var(--accent-cyan)' }} />
            150 Total Beds (108 Occupied / 42 Free)
          </span>
          <span className="top-ticker-item">
            <HeartPulse size={14} style={{ color: 'var(--accent-teal)' }} />
            OPD Queues: Normal Wait Time (~10 mins)
          </span>
        </div>
      </div>

      <nav className="navbar">
        <div className="logo-container" onClick={() => setActiveTab('home')}>
          <div className="logo-icon-bg">
            <Activity color="#ffffff" size={26} />
          </div>
          <div>
            <div className="logo-text">CITY HOSPITAL</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '700' }}>
              NABH & NABL Accredited Multi-Specialty
            </div>
          </div>
        </div>

        <div className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Stethoscope size={16} />
            Home & About
          </button>

          <button
            className={`nav-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <Activity size={16} />
            Services & Rooms
          </button>

          <button
            className={`nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <Star size={16} />
            Reviews (5/5★)
          </button>

          {currentUser && (
            <button
              className={`nav-btn ${activeTab === 'portal' ? 'active' : ''}`}
              onClick={() => setActiveTab('portal')}
            >
              <Shield size={16} />
              {currentUser.role.toUpperCase()} PORTAL
            </button>
          )}
        </div>

        <div>
          {currentUser ? (
            <div className="user-session-badge">
              <User size={16} color="var(--accent-cyan)" />
              <div style={{ fontSize: '0.85rem' }}>
                <span style={{ fontWeight: '700', color: '#fff' }}>{currentUser.name}</span>
                <span className="badge badge-teal" style={{ marginLeft: '8px', padding: '2px 8px' }}>
                  {currentUser.role}
                </span>
              </div>
              <button
                onClick={() => {
                  clearToken();
                  setCurrentUser(null);
                  setActiveTab('home');
                }}
                className="btn btn-secondary btn-sm"
                style={{ marginLeft: '6px', padding: '4px 10px' }}
                title="Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button className="portal-login-btn" onClick={onOpenLoginModal}>
              <User size={18} />
              Login with ID / Role
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
