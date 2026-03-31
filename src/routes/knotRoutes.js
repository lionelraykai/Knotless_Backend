import express from 'express';
const router = express.Router();
import { 
    getKnots, 
    getKnot, 
    createKnot, 
    voteKnot, 
    downvoteKnot,
    addSolution,
    markSolutionCorrect,
    voteSolution
} from '../controllers/knotController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/', getKnots);
router.get('/:id', getKnot);
router.post('/', protect, createKnot);
router.post('/:id/vote', protect, voteKnot);
router.post('/:id/downvote', protect, downvoteKnot);
router.post('/:id/solutions', protect, addSolution);
router.patch('/:id/solutions/:solutionId/correct', protect, markSolutionCorrect);
router.patch('/:id/solutions/:solutionId/vote', protect, voteSolution);

export default router;
