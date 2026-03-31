import mongoose from 'mongoose';

const KnotSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    excerpt: {
        type: String,
        maxlength: [200, 'Excerpt cannot be more than 200 characters']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: [
            'Development',
            'Design',
            'Food',
            'Fitness',
            'Social Media',
            'Health Issues',
            'Education',
            'Technology',
            'Travel',
            'Lifestyle',
            'Business',
            'Entertainment',
            'Finance'
        ]
    },
    status: {
        type: String,
        enum: ['OPEN', 'SOLVED'],
        default: 'OPEN'
    },
    upvoters: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    downvoters: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    image: {
        type: String,
        default: null
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    solutions: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        content: String,
        isCorrect: {
            type: Boolean,
            default: false
        },
        upvoters: [{
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Knot', KnotSchema);
