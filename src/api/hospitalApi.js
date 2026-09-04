import { api } from './client';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  me: () => api.get('/auth/me'),
};

export const staffApi = {
  getAll: () => api.get('/staff'),
  add: (data) => api.post('/staff', data),
  remove: (id) => api.del(`/staff/${id}`),
  setAttendance: (id, status) => api.patch(`/staff/${id}/attendance`, { status }),
};

export const patientApi = {
  getAll: () => api.get('/patients'),
  add: (data) => api.post('/patients', data),
  update: (id, data) => api.patch(`/patients/${id}`, data),
  remove: (id) => api.del(`/patients/${id}`),
};

export const expenseApi = {
  getAll: () => api.get('/expenses'),
  add: (data) => api.post('/expenses', data),
};

export const complaintApi = {
  getAll: () => api.get('/complaints'),
  add: (data) => api.post('/complaints', data),
  resolve: (id) => api.patch(`/complaints/${id}/resolve`),
};

export const reportApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/reports${qs ? `?${qs}` : ''}`);
  },
  add: (data) => api.post('/reports', data),
};

export const roomApi = {
  getAll: () => api.get('/rooms'),
  update: (roomNumber, data) => api.patch(`/rooms/${encodeURIComponent(roomNumber)}`, data),
};

export const reviewApi = {
  getAll: () => api.get('/reviews'),
  add: (data) => api.post('/reviews', data),
};

export const noticeApi = {
  getAll: () => api.get('/notices'),
  add: (text) => api.post('/notices', { text }),
};

export const appointmentApi = {
  getByPatient: (patientId) => api.get(`/appointments?patientId=${encodeURIComponent(patientId)}`),
  add: (data) => api.post('/appointments', data),
};

export const billApi = {
  getByPatient: (patientId) => api.get(`/bills?patientId=${encodeURIComponent(patientId)}`),
  add: (data) => api.post('/bills', data),
  pay: (id) => api.patch(`/bills/${id}/pay`),
};

export const prescriptionApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/prescriptions${qs ? `?${qs}` : ''}`);
  },
  add: (data) => api.post('/prescriptions', data),
};

export const leaveApi = {
  getAll: () => api.get('/leaves'),
  add: (data) => api.post('/leaves', data),
  update: (id, data) => api.patch(`/leaves/${id}`, data),
};

export const roomRequestApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/room-requests${qs ? `?${qs}` : ''}`);
  },
  add: (data) => api.post('/room-requests', data),
  update: (id, data) => api.patch(`/room-requests/${id}`, data),
};

export const requisitionApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/requisitions${qs ? `?${qs}` : ''}`);
  },
  add: (data) => api.post('/requisitions', data),
  update: (id, data) => api.patch(`/requisitions/${id}`, data),
};

export const doctorScheduleApi = {
  getAll: () => api.get('/doctor-schedules'),
  getByUser: (userId) => api.get(`/doctor-schedules/${encodeURIComponent(userId)}`),
  update: (userId, data) => api.patch(`/doctor-schedules/${encodeURIComponent(userId)}`, data),
};

export const catalogApi = {
  stats: () => api.get('/stats'),
  doctors: () => api.get('/doctors'),
  nurses: () => api.get('/nurses'),
  medicines: () => api.get('/medicines'),
  machines: () => api.get('/machines'),
  visitingDoctors: () => api.get('/visiting-doctors'),
};

export const caseRecordApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/case-records${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => api.get(`/case-records/${encodeURIComponent(id)}`),
  save: (data) => api.post('/case-records', data),
  update: (id, data) => api.patch(`/case-records/${encodeURIComponent(id)}`, data),
};

