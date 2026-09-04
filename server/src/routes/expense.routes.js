import { Router } from 'express';
import Expense from '../models/Expense.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const items = await Expense.find().sort({ id: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authorize('Admin'), async (req, res) => {
  try {
    const { category, description, amount } = req.body || {};
    if (!description || !amount) return res.status(400).json({ message: 'Description and Amount are required.' });

    const id = `EXP-${Math.floor(500 + Math.random() * 500)}`;
    const item = await Expense.create({
      id,
      category: category || 'Machinery & Diagnostic Equipment',
      description,
      amount: Number(amount),
      date: new Date().toISOString().split('T')[0],
      status: 'Approved',
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
