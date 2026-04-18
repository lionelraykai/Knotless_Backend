import express from 'express';
const router = express.Router();
import {
    getDrafts,
    getDraft,
    upsertDraft,
    deleteDraft
} from '../controllers/draftController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/', protect, getDrafts);
router.get('/:id', protect, getDraft);
router.post('/', protect, upsertDraft);
router.delete('/:id', protect, deleteDraft);

export default router;
