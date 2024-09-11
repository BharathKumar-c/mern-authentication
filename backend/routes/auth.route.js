import express from 'express';
import {login, logout, signup} from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/signup', signup);
router.get('/Login', login);
router.get('/logout', logout);

export default router;
