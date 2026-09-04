import { Router } from 'express';
import Patient from '../models/Patient.js';
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
    const { name, age, gender, room, doctorAssigned, condition, status } = req.body || {};
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
    res.status(201).json(item);
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
