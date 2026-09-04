import { Router } from 'express';
import Requisition from '../models/Requisition.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    let filter = {};
    if (!['Admin', 'Receptionist'].includes(req.user.role)) {
      filter = { submittedById: req.user.userId };
    }
    const items = await Requisition.find(filter).sort({ id: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { itemName, quantity, reason, dept } = req.body || {};
    if (!itemName || !reason) return res.status(400).json({ message: 'Item name and reason are required.' });

    const id = `REQ-${Math.floor(300 + Math.random() * 700)}`;
    const item = await Requisition.create({
      id,
      submittedById: req.user.userId,
      submittedBy: req.user.name,
      role: req.user.role,
      dept: dept || '',
      itemName,
      quantity: Number(quantity) || 1,
      reason,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', authorize('Admin'), async (req, res) => {
  try {
    const item = await Requisition.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Requisition not found.' });
    if (req.body.status) item.status = req.body.status;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
