import express from 'express';
import CaseRecord from '../models/CaseRecord.js';

const router = express.Router();

// GET all case records
router.get('/', async (req, res) => {
  try {
    const { patientId, doctorAssigned } = req.query;
    const filter = {};
    if (patientId) filter.patientId = patientId;
    if (doctorAssigned) filter.doctorAssigned = doctorAssigned;

    const records = await CaseRecord.find(filter).sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single case record by ID
router.get('/:id', async (req, res) => {
  try {
    const record = await CaseRecord.findOne({ id: req.params.id });
    if (!record) return res.status(404).json({ message: 'Case record not found' });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create or update case record
router.post('/', async (req, res) => {
  try {
    const recordData = req.body;
    let existing = await CaseRecord.findOne({ id: recordData.id });
    if (existing) {
      Object.assign(existing, recordData);
      await existing.save();
      return res.json(existing);
    }
    const newRecord = new CaseRecord(recordData);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH update case record
router.patch('/:id', async (req, res) => {
  try {
    const updated = await CaseRecord.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Case record not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
