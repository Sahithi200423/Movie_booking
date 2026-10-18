import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { generateToken, authenticate, AuthRequest } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// POST /api/auth/register (Rate limited: 15 attempts / 15m)
router.post('/register', authLimiter, async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const newUser = db.createUser({
      name,
      email: email.trim().toLowerCase(),
      password,
      phone
    });

    const token = generateToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to CineBook.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token
      }
    });
  } catch (err: unknown) {
    const error = err as { statusCode?: number; message?: string };
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Registration failed.'
    });
  }
});

// POST /api/auth/login (Rate limited: 15 attempts / 15m)
router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.findUserByEmail(email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const match = bcrypt.compareSync(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    return res.json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token
      }
    });
  } catch (err: unknown) {
    const error = err as Error;
    return res.status(500).json({ success: false, message: error.message || 'Login error.' });
  }
});

// GET /api/auth/me (Current user session)
router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const user = db.findUserByEmail(req.user.email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    }
  });
});

// POST /api/auth/demo (Rate limited: 15 attempts / 15m) - Convenient quick login for testing
router.post('/demo', authLimiter, (req: Request, res: Response) => {
  const role = req.body.role === 'admin' ? 'admin' : 'user';
  const email = role === 'admin' ? 'admin@cinebook.com' : 'user@cinebook.com';
  const user = db.findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Demo user not found' });
  }

  const token = generateToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });

  return res.json({
    success: true,
    message: `Logged in as demo ${role}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token
    }
  });
});

export default router;
