import { Router } from 'express';
import Staff from '../models/Staff.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const items = await Staff.find().sort({ id: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authorize('Admin'), async (req, res) => {
  try {
    const { id: providedId, name, role, dept, salary, status } = req.body || {};
    if (!name || !role) return res.status(400).json({ message: 'Name and Role are required.' });

    const id = providedId || `STF-${Math.floor(200 + Math.random() * 800)}`;
    const item = await Staff.create({ id, name, role, dept: dept || '', salary: Number(salary) || 0, status: status || 'Present' });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authorize('Admin'), async (req, res) => {
  try {
    const item = await Staff.findOneAndDelete({ id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Staff member not found.' });
    res.json({ message: 'Staff member removed.', item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/attendance', authorize('Admin', 'Receptionist'), async (req, res) => {
  try {
    const item = await Staff.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Staff member not found.' });

    const next = req.body.status || (item.status === 'Present' ? 'Absent' : 'Present');
    item.status = next;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
