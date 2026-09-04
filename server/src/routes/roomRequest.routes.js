import { Router } from 'express';
import RoomRequest from '../models/RoomRequest.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { patientId } = req.query;
    let filter = {};
    if (req.user.role === 'Patient') {
      filter = { patientId: patientId || req.user.userId };
    } else if (patientId) {
      filter = { patientId };
    }
    const items = await RoomRequest.find(filter).sort({ id: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { patientId, patientName, fromRoom, toRoom, reason } = req.body || {};
    if (!toRoom || !reason) return res.status(400).json({ message: 'Requested room and reason are required.' });

    const id = `RCR-${Math.floor(100 + Math.random() * 900)}`;
    const item = await RoomRequest.create({
      id,
      patientId: patientId || req.user.userId,
      patientName: patientName || req.user.name,
      fromRoom,
      toRoom,
      reason,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', authorize('Admin', 'Receptionist'), async (req, res) => {
  try {
    const item = await RoomRequest.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Room change request not found.' });
    if (req.body.status) item.status = req.body.status;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
