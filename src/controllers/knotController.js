import Knot from '../models/Knot.js';
import User from '../models/User.js';

// @desc    Get all knots
// @route   GET /api/knots
// @access  Public
export const getKnots = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category && category !== 'All Knots') {
            query.category = category;
        }

        const knots = await Knot.find(query)
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 });
        res.status(200).json(knots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single knot
// @route   GET /api/knots/:id
// @access  Public
export const getKnot = async (req, res) => {
    try {
        const knot = await Knot.findById(req.params.id)
            .populate('author', 'name avatar')
            .populate('solutions.user', 'name avatar');

        if (!knot) {
            return res.status(404).json({ message: 'Knot not found' });
        }

        res.status(200).json(knot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a knot
// @route   POST /api/knots
// @access  Private
export const createKnot = async (req, res) => {
    try {
        const { title, content, category, excerpt, image } = req.body;

        const knot = await Knot.create({
            title,
            content,
            category,
            excerpt,
            image,
            author: req.user.id
        });

        res.status(201).json(knot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Vote for a knot
// @route   POST /api/knots/:id/vote
// @access  Private
export const voteKnot = async (req, res) => {
    try {
        const knot = await Knot.findById(req.params.id);

        if (!knot) {
            return res.status(404).json({ message: 'Knot not found' });
        }

        const userId = req.user.id;
        const upvoteIndex = knot.upvoters.indexOf(userId);
        const downvoteIndex = knot.downvoters.indexOf(userId);

        if (upvoteIndex > -1) {
            // Already upvoted, toggle off
            knot.upvoters.splice(upvoteIndex, 1);
        } else {
            // Not upvoted, add to upvoters
            knot.upvoters.push(userId);
            // Remove from downvoters if exists
            if (downvoteIndex > -1) {
                knot.downvoters.splice(downvoteIndex, 1);
            }
        }

        await knot.save();
        res.status(200).json(knot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Downvote a knot
// @route   POST /api/knots/:id/downvote
// @access  Private
export const downvoteKnot = async (req, res) => {
    try {
        const knot = await Knot.findById(req.params.id);

        if (!knot) {
            return res.status(404).json({ message: 'Knot not found' });
        }

        const userId = req.user.id;
        const upvoteIndex = knot.upvoters.indexOf(userId);
        const downvoteIndex = knot.downvoters.indexOf(userId);

        if (downvoteIndex > -1) {
            // Already downvoted, toggle off
            knot.downvoters.splice(downvoteIndex, 1);
        } else {
            // Not downvoted, add to downvoters
            knot.downvoters.push(userId);
            // Remove from upvoters if exists
            if (upvoteIndex > -1) {
                knot.upvoters.splice(upvoteIndex, 1);
            }
        }

        await knot.save();
        res.status(200).json(knot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a solution to a knot
// @route   POST /api/knots/:id/solutions
// @access  Private
export const addSolution = async (req, res) => {
    try {
        const { content } = req.body;
        const knot = await Knot.findById(req.params.id);

        if (!knot) {
            return res.status(404).json({ message: 'Knot not found' });
        }

        const newSolution = {
            user: req.user.id,
            content
        };

        knot.solutions.push(newSolution);
        await knot.save();

        res.status(201).json(knot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark a solution as correct
// @route   PATCH /api/knots/:id/solutions/:solutionId/correct
// @access  Private
export const markSolutionCorrect = async (req, res) => {
    try {
        const knot = await Knot.findById(req.params.id);

        if (!knot) {
            return res.status(404).json({ message: 'Knot not found' });
        }

        // Only the author can mark a solution as correct
        if (knot.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to mark solution' });
        }

        const solutionId = req.params.solutionId;
        let anyCorrect = false;

        knot.solutions.forEach(sol => {
            if (sol._id.toString() === solutionId) {
                sol.isCorrect = !sol.isCorrect;
            } else {
                // Ensure only one solution is correct
                sol.isCorrect = false;
            }
            if (sol.isCorrect) anyCorrect = true;
        });

        knot.status = anyCorrect ? 'SOLVED' : 'OPEN';
        await knot.save();

        res.status(200).json(knot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Vote for a solution
// @route   PATCH /api/knots/:id/solutions/:solutionId/vote
// @access  Private
export const voteSolution = async (req, res) => {
    try {
        const knot = await Knot.findById(req.params.id);

        if (!knot) {
            return res.status(404).json({ message: 'Knot not found' });
        }

        const solutionId = req.params.solutionId;
        const solution = knot.solutions.id(solutionId);

        if (!solution) {
            return res.status(404).json({ message: 'Solution not found' });
        }

        const userId = req.user.id;
        const upvoteIndex = solution.upvoters.indexOf(userId);

        if (upvoteIndex > -1) {
            // Already upvoted, toggle off
            solution.upvoters.splice(upvoteIndex, 1);
        } else {
            // Not upvoted, add to upvoters
            solution.upvoters.push(userId);
        }

        await knot.save();
        res.status(200).json(knot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
