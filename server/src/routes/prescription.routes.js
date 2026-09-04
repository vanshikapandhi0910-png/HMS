import { Router } from 'express';
import Prescription from '../models/Prescription.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { patientId } = req.query;
    const filter = patientId ? { patientId } : {};
    const items = await Prescription.find(filter).sort({ id: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { patientId, patientName, doctorName, diagnosis, medicines, advice } = req.body || {};
    if (!patientId || !patientName || !diagnosis) {
      return res.status(400).json({ message: 'Patient ID, Patient Name and Diagnosis are required.' });
    }

    const id = `RX-${Math.floor(800 + Math.random() * 200)}`;
    const item = await Prescription.create({
      id,
      patientId,
      patientName,
      doctorName: doctorName || req.user.name,
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      medicines: medicines || [],
      advice: advice || '',
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
