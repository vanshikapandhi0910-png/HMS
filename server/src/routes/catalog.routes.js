import { Router } from 'express';
import Catalog from '../models/Catalog.js';
import Statistic from '../models/Statistic.js';

const router = Router();

async function getCatalog(kind) {
  const docs = await Catalog.find({ kind }).sort({ 'data.id': 1 });
  return docs.map((d) => d.data);
}

router.get('/stats', async (req, res) => {
  try {
    const stat = await Statistic.findOne({ key: 'hospital' });
    res.json(stat ? stat.data : {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/doctors', async (req, res) => {
  try {
    res.json(await getCatalog('doctors'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/nurses', async (req, res) => {
  try {
    res.json(await getCatalog('nurses'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/medicines', async (req, res) => {
  try {
    res.json(await getCatalog('medicines'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/machines', async (req, res) => {
  try {
    res.json(await getCatalog('machines'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/visiting-doctors', async (req, res) => {
  try {
    res.json(await getCatalog('visitingDoctors'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
