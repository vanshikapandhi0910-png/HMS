import { Router } from 'express';
import Bill from '../models/Bill.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { patientId } = req.query;
    const filter = patientId ? { patientId } : {};
    const items = await Bill.find(filter).sort({ id: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { patientId, description, amount } = req.body || {};
    if (!description || !amount) return res.status(400).json({ message: 'Description and Amount are required.' });

    const id = `INV-${Math.floor(9900 + Math.random() * 100)}`;
    const item = await Bill.create({
      id,
      patientId: patientId || req.user.userId,
      description,
      amount: Number(amount),
      status: 'Pending Payment',
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/pay', async (req, res) => {
  try {
    const item = await Bill.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Invoice not found.' });
    item.status = 'Paid';
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
