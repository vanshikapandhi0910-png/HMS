import { Router } from 'express';
import Complaint from '../models/Complaint.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const items = await Complaint.find().sort({ id: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { submittedBy, role, category, subject, detail } = req.body || {};
    if (!subject || !detail) return res.status(400).json({ message: 'Subject and Detail are required.' });

    const id = `CMP-${Math.floor(10 + Math.random() * 90)}`;
    const item = await Complaint.create({
      id,
      submittedBy: submittedBy || req.user.name,
      role: role || req.user.role,
      category: category || 'Nursing & Housekeeping Care',
      subject,
      detail,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Review',
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/resolve', authorize('Admin'), async (req, res) => {
  try {
    const item = await Complaint.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Complaint not found.' });
    item.status = 'Resolved';
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
