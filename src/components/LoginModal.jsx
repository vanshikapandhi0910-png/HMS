import React, { useState } from 'react';
import { Lock, User, Key, Shield, ArrowRight, UserCheck } from 'lucide-react';
import { authApi } from '../api/hospitalApi';
import { setToken } from '../api/client';

const ACCOUNT_DIRECTORY = [
  // Admin & Staff
  { id: 'ADM-001', name: 'Dr. Rajesh Gupta (Chief Admin)', role: 'Admin', password: 'admin123' },
  { id: 'STF-201', name: 'Suresh Gupta (Lead Receptionist)', role: 'Receptionist', password: 'rec123' },

  // Nurses
  { id: 'NUR-01', name: 'Sister Mary Fernandez (Head ICU Nurse)', role: 'Nurse', password: 'nurse123' },
  { id: 'NUR-02', name: 'Nurse Sunita Rao (Senior Staff Nurse)', role: 'Nurse', password: 'nurse123' },
  { id: 'NUR-03', name: 'Nurse Priya Nair (Pediatric & NICU Nurse)', role: 'Nurse', password: 'nurse123' },
  { id: 'NUR-04', name: 'Nurse David Chen (Emergency & OT Nurse)', role: 'Nurse', password: 'nurse123' },

  // Doctors
  { id: 'DOC-101', name: 'Dr. Arvind Swamy (Cardiologist)', role: 'Doctor', password: 'doc123' },
  { id: 'DOC-102', name: 'Dr. Meera Nambiar (Neurologist)', role: 'Doctor', password: 'doc123' },
  { id: 'DOC-103', name: 'Dr. Rajeshwar Sharma (Orthopaedic)', role: 'Doctor', password: 'doc123' },
  { id: 'DOC-104', name: 'Dr. Ananya Roy (Dermatologist)', role: 'Doctor', password: 'doc123' },
  { id: 'DOC-105', name: 'Dr. Vikram Sethi (Dentist)', role: 'Doctor', password: 'doc123' },
  { id: 'DOC-106', name: 'Dr. Sunita Deshmukh (Physiotherapist)', role: 'Doctor', password: 'doc123' },
  { id: 'DOC-107', name: 'Dr. Rohan Kapur (Pediatrician)', role: 'Doctor', password: 'doc123' },
  { id: 'DOC-108', name: 'Dr. Kavita Menon (Gynecologist)', role: 'Doctor', password: 'doc123' },
  { id: 'DOC-109', name: 'Dr. Sanjay Gupta (Pathologist)', role: 'Doctor', password: 'doc123' },
  { id: 'DOC-110', name: 'Dr. Priya Varma (Radiologist)', role: 'Doctor', password: 'doc123' },

  // Patients
  { id: 'PAT-1001', name: 'Aarav Kumar (Patient #1001)', role: 'Patient', password: 'pat123' },
  { id: 'PAT-1002', name: 'Suman Lata (Patient #1002)', role: 'Patient', password: 'pat123' },
  { id: 'PAT-1003', name: 'Vikram Malhotra (Patient #1003)', role: 'Patient', password: 'pat123' },
  { id: 'PAT-1004', name: 'Neha Saxena (Patient #1004)', role: 'Patient', password: 'pat123' },
  { id: 'PAT-1005', name: 'Rohit Bansal (Patient #1005)', role: 'Patient', password: 'pat123' },
];

export default function LoginModal({ isOpen, onClose, onLoginSuccess, patientsList = [] }) {
  const [role, setRole] = useState('Nurse');
  const [selectedAccountId, setSelectedAccountId] = useState('NUR-01');
  const [userId, setUserId] = useState('NUR-01');
  const [password, setPassword] = useState('nurse123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Build dynamic patient list from registered patients + default accounts
  const dynamicPatientAccounts = patientsList.map(p => ({
    id: p.id,
    name: `${p.name} (${p.id}) [${p.status}]`,
    role: 'Patient',
    password: 'pat123'
  }));

  const staticNonPatientAccounts = ACCOUNT_DIRECTORY.filter(a => a.role !== 'Patient');
  const staticPatientAccounts = ACCOUNT_DIRECTORY.filter(a => a.role === 'Patient');
  
  // Combine registered patients with static mock patients, avoiding duplicate IDs
  const combinedPatients = [...dynamicPatientAccounts];
  staticPatientAccounts.forEach(sp => {
    if (!combinedPatients.some(dp => dp.id.toLowerCase() === sp.id.toLowerCase())) {
      combinedPatients.push(sp);
    }
  });

  const allAccounts = [...staticNonPatientAccounts, ...combinedPatients];

  const availableAccountsForRole = allAccounts.filter(
    (acc) => acc.role.toLowerCase() === role.toLowerCase()
  );

  const handleRoleChange = (newRole) => {
    setError('');
    setRole(newRole);
    const available = allAccounts.filter(
      (acc) => acc.role.toLowerCase() === newRole.toLowerCase()
    );
    if (available.length > 0) {
      const defaultAcc = available[0];
      setSelectedAccountId(defaultAcc.id);
      setUserId(defaultAcc.id);
      setPassword(defaultAcc.password);
    }
  };

  const handleAccountSelect = (accId) => {
    setSelectedAccountId(accId);
    const target = allAccounts.find((acc) => acc.id === accId);
    if (target) {
      setUserId(target.id);
      setPassword(target.password || 'pat123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const trimmedId = userId.trim();
    const foundAcc = allAccounts.find(
      (a) => a.id.toLowerCase() === trimmedId.toLowerCase()
    );
    const resolvedName = foundAcc ? foundAcc.name : `${role} (${trimmedId})`;

    try {
      let data;
      try {
        data = await authApi.login({
          userId: trimmedId,
          password: password.trim(),
          role: role,
        });
        if (data && data.token) {
          setToken(data.token);
        }
      } catch (err) {
        console.warn('Backend API login fallback activated:', err.message);
        data = {
          token: `demo_token_${Date.now()}`,
          user: {
            id: trimmedId,
            name: resolvedName,
            role: role,
          },
        };
        setToken(data.token);
      }

      onLoginSuccess({
        id: data.user?.id || trimmedId,
        name: data.user?.name || resolvedName,
        role: data.user?.role || role,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="logo-icon-bg" style={{ width: '38px', height: '38px' }}>
              <Lock color="#fff" size={20} />
            </div>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>Portal Authentication</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Login with User ID, Password & Selected Profile</p>
            </div>
          </div>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Role Category Selector */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} color="var(--accent-cyan)" /> 1. Select User Role / Category
            </label>
            <select className="form-select" value={role} onChange={(e) => handleRoleChange(e.target.value)}>
              <option value="Admin">Admin (Chief Admin / Payroll & Budget)</option>
              <option value="Receptionist">Employee (Receptionist / Desk & Roster)</option>
              <option value="Nurse">Nurse (ICU, General Ward, NICU, OT Nurses)</option>
              <option value="Doctor">Doctor (Cardiologist, Neurologist, Ortho, etc.)</option>
              <option value="Patient">Patient (In-Patient / OPD Accounts)</option>
            </select>
          </div>

          {/* Individual User Account Selector */}
          {availableAccountsForRole.length > 0 && (
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={14} color="var(--accent-teal)" /> 2. Select Individual {role} Account
              </label>
              <select
                className="form-select"
                value={selectedAccountId}
                onChange={(e) => handleAccountSelect(e.target.value)}
              >
                {availableAccountsForRole.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.id} — {acc.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} color="var(--accent-teal)" /> User ID / Registration Code
            </label>
            <input
              type="text"
              className="form-input"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={14} color="var(--accent-amber)" /> Password
            </label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ background: 'rgba(6, 182, 212, 0.08)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
            <strong style={{ color: 'var(--accent-cyan)' }}>Demo Credentials Auto-Filled:</strong> Select any specific Nurse (Sister Mary, Nurse Sunita, Nurse Priya, Nurse David) or Doctor (Dr. Arvind, Dr. Meera, Dr. Rajeshwar, etc.) from the dropdown above.
          </div>

          {error && (
            <div style={{ background: 'rgba(244, 63, 94, 0.12)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', color: '#fda4af', marginBottom: '16px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Verifying credentials...' : `Enter ${role} Portal`} <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
