import mongoose from 'mongoose';

const DraftSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['blog', 'knot'],
        required: true
    },
    // Common fields
    title: {
        type: String,
        trim: true,
        default: ''
    },
    category: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    // Knot specific
    content: {
        type: String,
        default: ''
    },
    // Blog specific
    sections: [{
        type: {
            type: String,
            enum: ['text', 'image'],
            required: true
        },
        content: {
            type: String,
            required: true
        }
    }],
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model('Draft', DraftSchema);
