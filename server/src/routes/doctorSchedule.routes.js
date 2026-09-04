import { Router } from 'express';
import DoctorSchedule from '../models/DoctorSchedule.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const items = await DoctorSchedule.find().sort({ userId: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const item = await DoctorSchedule.findOne({ userId: req.params.userId });
    if (!item) return res.status(404).json({ message: 'Doctor schedule not found.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:userId', authorize('Doctor', 'Admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.role === 'Doctor' && req.user.userId !== userId) {
      return res.status(403).json({ message: 'You can only update your own schedule.' });
    }

    const item = await DoctorSchedule.findOne({ userId });
    if (!item) return res.status(404).json({ message: 'Doctor schedule not found.' });

    const allowed = ['timings', 'cabin', 'status'];
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
