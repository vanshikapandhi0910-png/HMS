import { Router } from 'express';
import Room from '../models/Room.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const items = await Room.find().sort({ roomNumber: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:roomNumber', async (req, res) => {
  try {
    const item = await Room.findOne({ roomNumber: req.params.roomNumber });
    if (!item) return res.status(404).json({ message: 'Room not found.' });

    const allowed = ['status', 'patientName', 'nurseAssigned'];
    allowed.forEach((key) => {
      if (req.body && req.body[key] !== undefined) item[key] = req.body[key];
    });
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
