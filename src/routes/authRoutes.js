import express from 'express';
const router = express.Router();
import { signup, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
