import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import staffRoutes from './routes/staff.routes.js';
import patientRoutes from './routes/patient.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import reportRoutes from './routes/report.routes.js';
import roomRoutes from './routes/room.routes.js';
import reviewRoutes from './routes/review.routes.js';
import noticeRoutes from './routes/notice.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import billRoutes from './routes/bill.routes.js';
import prescriptionRoutes from './routes/prescription.routes.js';
import leaveRoutes from './routes/leave.routes.js';
import catalogRoutes from './routes/catalog.routes.js';
import roomRequestRoutes from './routes/roomRequest.routes.js';
import requisitionRoutes from './routes/requisition.routes.js';
import doctorScheduleRoutes from './routes/doctorSchedule.routes.js';
import caseRecordRoutes from './routes/caseRecord.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'CITY Hospital API' }));

app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/room-requests', roomRequestRoutes);
app.use('/api/requisitions', requisitionRoutes);
app.use('/api/doctor-schedules', doctorScheduleRoutes);
app.use('/api/case-records', caseRecordRoutes);
app.use('/api', catalogRoutes);

app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

export default app;
