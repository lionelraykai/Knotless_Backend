import Draft from '../models/Draft.js';

// @desc    Get user drafts
// @route   GET /api/drafts
// @access  Private
export const getDrafts = async (req, res) => {
    try {
        const drafts = await Draft.find({ author: req.user.id })
            .sort({ updatedAt: -1 });
        res.status(200).json(drafts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single draft
// @route   GET /api/drafts/:id
// @access  Private
export const getDraft = async (req, res) => {
    try {
        const draft = await Draft.findById(req.params.id);

        if (!draft) {
            return res.status(404).json({ message: 'Draft not found' });
        }

        if (draft.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.status(200).json(draft);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upsert a draft (Create or Update)
// @route   POST /api/drafts
// @access  Private
export const upsertDraft = async (req, res) => {
    try {
        const { draftId, type, title, content, sections, category, image } = req.body;

        let draft;

        if (draftId) {
            // Update existing
            draft = await Draft.findById(draftId);
            if (!draft) {
                return res.status(404).json({ message: 'Draft not found' });
            }
            if (draft.author.toString() !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            draft.title = title !== undefined ? title : draft.title;
            draft.content = content !== undefined ? content : draft.content;
            draft.sections = sections !== undefined ? sections : draft.sections;
            draft.category = category !== undefined ? category : draft.category;
            draft.image = image !== undefined ? image : draft.image;
            draft.updatedAt = Date.now();
            
            await draft.save();
        } else {
            // Create new
            draft = await Draft.create({
                type,
                title: title || '',
                content: content || '',
                sections: sections || [],
                category: category || '',
                image: image || '',
                author: req.user.id
            });
        }

        res.status(draftId ? 200 : 201).json(draft);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a draft
// @route   DELETE /api/drafts/:id
// @access  Private
export const deleteDraft = async (req, res) => {
    try {
        const draft = await Draft.findById(req.params.id);

        if (!draft) {
            return res.status(404).json({ message: 'Draft not found' });
        }

        if (draft.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Draft.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Draft deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
