import express from 'express';
import {
  login,
  register,
  logout,
  forgetPassword,
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/authentication.middlewares.js';

const router = express.Router();

// Register router
router.post('/register', register);

// Login router
router.post('/login', login);

// Forget Password router
router.post('/password-reset', forgetPassword);

// Logout router
router.post('/logout', authMiddleware, logout);

export default router;
