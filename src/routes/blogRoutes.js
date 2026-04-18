import express from 'express';
const router = express.Router();
import {
    getBlogs,
    getBlog,
    createBlog,
    likeBlog,
    commentBlog,
    deleteBlog
} from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/', getBlogs);
router.get('/:id', getBlog);
router.post('/', protect, createBlog);
router.post('/:id/like', protect, likeBlog);
router.post('/:id/comment', protect, commentBlog);
router.delete('/:id', protect, deleteBlog);

export default router;
