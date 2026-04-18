import Blog from '../models/Blog.js';

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'name avatar')
            .populate('comments.user', 'name avatar');

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = async (req, res) => {
    try {
        const { title, sections } = req.body;

        const blog = await Blog.create({
            title,
            sections,
            author: req.user.id
        });

        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle like for a blog
// @route   POST /api/blogs/:id/like
// @access  Private
export const likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const userId = req.user.id;
        const likeIndex = blog.likes.indexOf(userId);

        if (likeIndex > -1) {
            // Already liked, toggle off
            blog.likes.splice(likeIndex, 1);
        } else {
            // Not liked, add to likes
            blog.likes.push(userId);
        }

        await blog.save();
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a comment to a blog
// @route   POST /api/blogs/:id/comment
// @access  Private
export const commentBlog = async (req, res) => {
    try {
        const { content } = req.body;
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const newComment = {
            user: req.user.id,
            content
        };

        blog.comments.push(newComment);
        await blog.save();

        // Repopulate user details on the new comment
        await blog.populate('comments.user', 'name avatar');

        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Make sure user owns the blog
        if (blog.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this blog' });
        }

        await blog.deleteOne();
        res.status(200).json({ message: 'Blog removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
