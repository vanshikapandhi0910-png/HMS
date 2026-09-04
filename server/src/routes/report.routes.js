import { Router } from 'express';
import Report from '../models/Report.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { patientId } = req.query;
    const filter = patientId ? { patientId } : {};
    const items = await Report.find(filter).sort({ id: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authorize('Doctor'), async (req, res) => {
  try {
    const { patientId, patientName, doctorId, doctorName, testType, department, uploadedBy, findings, status } = req.body || {};
    if (!patientId || !patientName || !testType) {
      return res.status(400).json({ message: 'Patient ID, Patient Name and Test Type are required.' });
    }

    const id = `REP-${Math.floor(100 + Math.random() * 900)}`;
    const item = await Report.create({
      id,
      patientId,
      patientName,
      doctorId: doctorId || req.user.userId,
      doctorName: doctorName || req.user.name,
      testType,
      department: department || 'Pathology Lab',
      uploadedBy: uploadedBy || `${req.user.name} (Specialist)`,
      uploadDate: new Date().toLocaleString(),
      findings: findings || '',
      status: status || 'Normal / Clear',
      downloadUrl: '#',
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
