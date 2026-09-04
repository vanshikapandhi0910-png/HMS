import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeAbout from './components/HomeAbout';
import ServicesSection from './components/ServicesSection';
import ReviewsSection from './components/ReviewsSection';
import LoginModal from './components/LoginModal';

// Portals
import AdminPortal from './components/portals/AdminPortal';
import ReceptionistPortal from './components/portals/ReceptionistPortal';
import NursePortal from './components/portals/NursePortal';
import DoctorPortal from './components/portals/DoctorPortal';
import PatientPortal from './components/portals/PatientPortal';

// Data (initial fallback state before server responds)
import {
  INITIAL_HOSPITAL_STATS,
  INITIAL_REVIEWS,
  INITIAL_SAMPLE_PATIENTS,
  INITIAL_STAFF_MEMBERS,
  INITIAL_EXPENSES,
  INITIAL_REPORTS,
  INITIAL_COMPLAINTS,
  INITIAL_ROOMS_DETAIL
} from './data/hospitalData';

// API
import {
  catalogApi,
  reviewApi,
  staffApi,
  patientApi,
  expenseApi,
  complaintApi,
  reportApi,
  roomApi,
  noticeApi,
  leaveApi,
  requisitionApi,
} from './api/hospitalApi';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'services', 'reviews', 'portal'
  const [currentUser, setCurrentUser] = useState(null); // { id, name, role }
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Shared Central Hospital State
  const [stats, setStats] = useState(INITIAL_HOSPITAL_STATS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [staffList, setStaffList] = useState(INITIAL_STAFF_MEMBERS);
  const [patientsList, setPatientsList] = useState(INITIAL_SAMPLE_PATIENTS);
  const [expensesList, setExpensesList] = useState(INITIAL_EXPENSES);
  const [reportsList, setReportsList] = useState(INITIAL_REPORTS);
  const [complaintsList, setComplaintsList] = useState(INITIAL_COMPLAINTS);
  const [roomsList, setRoomsList] = useState(INITIAL_ROOMS_DETAIL);
  const [noticesList, setNoticesList] = useState([
    'Urgent: Mandatory HVAC sanitation completed in Ward 3.',
    'Notice: Blood bank component freezer annual audit at 4 PM today.',
  ]);
  const [leavesList, setLeavesList] = useState([]);
  const [requisitionsList, setRequisitionsList] = useState([]);

  // Toast Notification State
  const [toasts, setToasts] = useState([]);

  const showToast = (message, action = null) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, action }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  // Load every protected list from the server (requires a valid login token).
  const loadAllData = useCallback(async () => {
    const results = await Promise.allSettled([
      catalogApi.stats().then(setStats),
      reviewApi.getAll().then(setReviews),
      staffApi.getAll().then(setStaffList),
      patientApi.getAll().then(setPatientsList),
      expenseApi.getAll().then(setExpensesList),
      complaintApi.getAll().then(setComplaintsList),
      reportApi.getAll().then(setReportsList),
      roomApi.getAll().then(setRoomsList),
      noticeApi.getAll().then(setNoticesList),
      leaveApi.getAll().then(setLeavesList),
      requisitionApi.getAll().then(setRequisitionsList),
    ]);
    results
      .filter(r => r.status === 'rejected')
      .forEach(r => console.warn('API load skipped:', r.reason?.message));
  }, []);

  // On first mount, always fetch public data; protected lists are fetched if already logged in.
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleLoginSuccess = async (user) => {
    setCurrentUser(user);
    setActiveTab('portal');
    showToast(`Welcome ${user.name}! Switched to ${user.role} Portal.`);
    await loadAllData();
  };

  const handleAddReview = async (newRev) => {
    try {
      const created = await reviewApi.add(newRev);
      setReviews([created, ...reviews]);
    } catch (err) {
      showToast(err.message || 'Could not publish review.');
    }
  };

  const handleUploadReport = async (newRep) => {
    try {
      const created = await reportApi.add(newRep);
      setReportsList([created, ...reportsList]);
    } catch (err) {
      showToast(err.message || 'Could not upload report.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onOpenLoginModal={() => setLoginModalOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {/* PUBLIC SECTIONS */}
        {activeTab === 'home' && (
          <HomeAbout
            stats={stats}
            onOpenLoginModal={() => setLoginModalOpen(true)}
            onNavigateServices={() => setActiveTab('services')}
          />
        )}

        {activeTab === 'services' && (
          <ServicesSection
            onShowToast={showToast}
            onOpenLoginModal={() => setLoginModalOpen(true)}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewsSection
            reviews={reviews}
            onAddReview={handleAddReview}
            onShowToast={showToast}
          />
        )}

        {/* ROLE-BASED PORTALS */}
        {activeTab === 'portal' && (
          <div>
            {!currentUser ? (
              <div className="main-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
                  <h2 style={{ color: '#fff', marginBottom: '12px' }}>Authentication Required</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                    Please login with your User ID and select your role (Admin, Receptionist, Nurse, Doctor, or Patient) to access portal controls.
                  </p>
                  <button className="btn btn-primary" onClick={() => setLoginModalOpen(true)}>
                    Login to Access Portal
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {currentUser.role === 'Admin' && (
                  <AdminPortal
                    staffList={staffList}
                    setStaffList={setStaffList}
                    expensesList={expensesList}
                    setExpensesList={setExpensesList}
                    complaintsList={complaintsList}
                    setComplaintsList={setComplaintsList}
                    patientsList={patientsList}
                    noticesList={noticesList}
                    setNoticesList={setNoticesList}
                    leavesList={leavesList}
                    setLeavesList={setLeavesList}
                    requisitionsList={requisitionsList}
                    setRequisitionsList={setRequisitionsList}
                    onShowToast={showToast}
                  />
                )}

                {currentUser.role === 'Receptionist' && (
                  <ReceptionistPortal
                    staffList={staffList}
                    setStaffList={setStaffList}
                    patientsList={patientsList}
                    setPatientsList={setPatientsList}
                    roomsList={roomsList}
                    setRoomsList={setRoomsList}
                    leavesList={leavesList}
                    onShowToast={showToast}
                  />
                )}

                {currentUser.role === 'Nurse' && (
                  <NursePortal
                    patientsList={patientsList}
                    setPatientsList={setPatientsList}
                    leavesList={leavesList}
                    setLeavesList={setLeavesList}
                    onShowToast={showToast}
                  />
                )}

                {currentUser.role === 'Doctor' && (
                  <DoctorPortal
                    currentUser={currentUser}
                    reportsList={reportsList}
                    patientsList={patientsList}
                    leavesList={leavesList}
                    setLeavesList={setLeavesList}
                    onUploadReport={handleUploadReport}
                    onShowToast={showToast}
                  />
                )}

                {currentUser.role === 'Patient' && (
                  <PatientPortal
                    currentUser={currentUser}
                    reportsList={reportsList}
                    patientsList={patientsList}
                    complaintsList={complaintsList}
                    setComplaintsList={setComplaintsList}
                    onShowToast={showToast}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer onNavigate={setActiveTab} />

      {/* LOGIN MODAL WITH DROPDOWN ROLE CHOICE */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        patientsList={patientsList}
      />

      {/* TOAST NOTIFICATION CONTAINER WITH UNDO & REDO BUTTONS */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--accent-teal)' }}>✓</span>
            <span style={{ fontSize: '0.88rem', color: '#fff', flex: 1 }}>{toast.message}</span>
            {toast.action && (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {toast.action.onUndo && (
                  <button
                    className="btn btn-sm btn-secondary"
                    style={{
                      padding: '3px 10px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#ffd166',
                      borderColor: '#ffd166',
                      background: 'rgba(255, 209, 102, 0.12)',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                    onClick={async () => {
                      await toast.action.onUndo();
                      setToasts(prev => prev.filter(t => t.id !== toast.id));
                    }}
                  >
                    {toast.action.undoLabel || '↺ Undo'}
                  </button>
                )}
                {toast.action.onRedo && (
                  <button
                    className="btn btn-sm btn-secondary"
                    style={{
                      padding: '3px 10px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#2ec4b6',
                      borderColor: '#2ec4b6',
                      background: 'rgba(46, 196, 182, 0.12)',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                    onClick={async () => {
                      await toast.action.onRedo();
                      setToasts(prev => prev.filter(t => t.id !== toast.id));
                    }}
                  >
                    {toast.action.redoLabel || '↻ Redo'}
                  </button>
                )}
                {!toast.action.onUndo && !toast.action.onRedo && toast.action.onClick && (
                  <button
                    className="btn btn-sm btn-secondary"
                    style={{
                      padding: '3px 10px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#ffd166',
                      borderColor: '#ffd166',
                      background: 'rgba(255, 209, 102, 0.12)',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                    onClick={async () => {
                      await toast.action.onClick();
                      setToasts(prev => prev.filter(t => t.id !== toast.id));
                    }}
                  >
                    {toast.action.label || 'Undo Action'}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
