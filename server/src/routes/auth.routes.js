import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken, protect } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { userId, role, password } = req.body || {};

    if (!userId || !role) {
      return res.status(400).json({ message: 'User ID and Role are required.' });
    }

    const user = await User.findOne({ userId: userId.trim() });
    if (!user) {
      return res.status(401).json({ message: `No account found for User ID "${userId}".` });
    }

    if (user.role !== role) {
      return res.status(401).json({ message: `This User ID belongs to role "${user.role}", not "${role}".` });
    }

    if (password && user.passwordHash) {
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        return res.status(401).json({ message: 'Incorrect password.' });
      }
    }

    const token = signToken(user);
    return res.json({
      token,
      user: { id: user.userId, name: user.name, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get('/me', protect, async (req, res) => {
  const u = req.user;
  return res.json({ user: { id: u.userId, name: u.name, role: u.role } });
});

export default router;
