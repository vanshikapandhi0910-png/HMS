import { Router } from 'express';
import Leave from '../models/Leave.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const items = await Leave.find().sort({ id: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { applicantName, role, dept, leaveDates, reason } = req.body || {};
    if (!leaveDates || !reason) return res.status(400).json({ message: 'Leave dates and reason are required.' });

    const id = `LV-${Math.floor(100 + Math.random() * 900)}`;
    const item = await Leave.create({
      id,
      applicantName: applicantName || req.user.name,
      role: role || req.user.role,
      dept: dept || '',
      leaveDates,
      reason,
      status: 'Pending Approval',
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const item = await Leave.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Leave record not found.' });
    if (req.body.status) item.status = req.body.status;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
