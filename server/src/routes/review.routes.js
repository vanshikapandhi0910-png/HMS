import { Router } from 'express';
import Review from '../models/Review.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const items = await Review.find().sort({ id: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { patientName, patientAge, treatment, rating, comment } = req.body || {};
    if (!patientName || !treatment || !comment) {
      return res.status(400).json({ message: 'Name, Treatment and Comment are required.' });
    }

    const id = `REV-${Date.now()}`;
    const item = await Review.create({
      id,
      patientName,
      patientAge: Number(patientAge) || 0,
      treatment,
      rating: Number(rating) || 5,
      date: new Date().toISOString().split('T')[0],
      comment,
      verified: true,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
