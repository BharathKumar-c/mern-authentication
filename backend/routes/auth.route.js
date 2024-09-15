import express from 'express';
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgetPassword,
  resetPassword,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/Login', login);
router.post('/logout', logout);

router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgetPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
