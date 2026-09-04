import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const items = await Patient.find().sort({ id: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, age, gender, room, doctorAssigned, condition, status, password } = req.body || {};
    if (!name) return res.status(400).json({ message: 'Patient name is required.' });

    const id = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const item = await Patient.create({
      id,
      name,
      age: Number(age) || 30,
      gender: gender || 'Male',
      room: room || 'General Ward - Assigned',
      doctorAssigned: doctorAssigned || '',
      condition: condition || 'Under Observation',
      status: status || 'Admitted',
    });

    // Automatically create User credentials account for Patient login
    const patientPassword = password || 'pat123';
    const passwordHash = await bcrypt.hash(patientPassword, 10);
    await User.create({
      userId: id,
      name,
      role: 'Patient',
      passwordHash,
    });

    const responseItem = item.toObject ? item.toObject() : { ...item };
    responseItem.defaultPassword = patientPassword;

    res.status(201).json(responseItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const item = await Patient.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Patient not found.' });

    const allowed = ['age', 'room', 'doctorAssigned', 'condition', 'status', 'name', 'gender'];
    allowed.forEach((key) => {
      if (req.body && req.body[key] !== undefined) item[key] = req.body[key];
    });
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Patient.findOneAndDelete({ id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Patient not found.' });
    res.json({ message: 'Patient removed.', item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
