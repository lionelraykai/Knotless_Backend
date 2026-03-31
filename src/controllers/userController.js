import User from '../models/User.js';
import Knot from '../models/Knot.js';

// @desc    Get user profile data and stats
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch user's knots (contributions)
        const contributions = await Knot.find({ author: req.user.id }).sort({ createdAt: -1 });

        // Calculate stats
        const stats = {
            problemsSolved: contributions.length, // Simplified metric
            totalUpvotes: contributions.reduce((acc, knot) => acc + knot.votes, 0),
            knowledgeContributions: await Knot.countDocuments({ 'solutions.user': req.user.id })
        };

        res.status(200).json({
            user,
            stats,
            contributions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
        user.website = req.body.website !== undefined ? req.body.website : user.website;
        user.avatar = req.body.avatar || user.avatar;
        user.publicProfile = req.body.publicProfile !== undefined ? req.body.publicProfile : user.publicProfile;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            bio: updatedUser.bio,
            website: updatedUser.website,
            publicProfile: updatedUser.publicProfile
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
