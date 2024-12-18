const ContentModel = require('../models/models');

class ContentController {
    static async addContent(req, res) {
        try {
            const { heading, description, picture } = req.body;
            const content = { heading, description, picture };
            await ContentModel.create(content);
            res.status(201).json({ message: 'Content added successfully!' });
        } catch (error) {
            console.error('Error in addContent:', error);
            res.status(500).json({ message: 'Error adding content', error: error.message });
        }
    }

    static async getAllContent(req, res) {
        try {
            const content = await ContentModel.getAll();
            res.json(content);
        } catch (error) {
            console.error('Error in getAllContent:', error);
            res.status(500).json({ message: 'Error fetching content', error: error.message });
        }
    }

    static async deleteContent(req, res) {
        try {
            const result = await ContentModel.delete(req.params.id);
            if (result.deletedCount === 1) {
                res.status(200).json({ message: 'Content deleted successfully!' });
            } else {
                res.status(404).json({ message: 'Content not found!' });
            }
        } catch (error) {
            console.error('Error in deleteContent:', error);
            res.status(500).json({ message: 'Error deleting content', error: error.message });
        }
    }
}

module.exports = ContentController;