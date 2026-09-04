import { Router } from 'express';
import Notice from '../models/Notice.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const items = await Notice.find().sort({ createdAt: -1 });
    res.json(items.map((n) => n.text));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authorize('Admin'), async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ message: 'Notice text is required.' });
    await Notice.create({ text, postedBy: req.user.name, date: new Date().toISOString().split('T')[0] });
    const items = await Notice.find().sort({ createdAt: -1 });
    res.status(201).json(items.map((n) => n.text));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
