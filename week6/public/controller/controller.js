const { getDb } = require('../../dbconnection');
const { ObjectId } = require('mongodb');

const ContentController = {
    // Add new content
    async addContent(req, res) {
        try {
            const { heading, description, picture } = req.body;
            
            if (!heading || !description || !picture) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const db = getDb();
            const content = {
                heading,
                description,
                picture,
                createdAt: new Date()
            };

            const result = await db.collection('contents').insertOne(content);
            res.json({ ...content, _id: result.insertedId });
        } catch (error) {
            console.error('Error adding content:', error);
            res.status(500).json({ error: 'Error adding content' });
        }
    },

    // Get all content
    async getAllContent(req, res) {
        try {
            const db = getDb();
            const content = await db.collection('contents')
                .find()
                .sort({ createdAt: -1 })
                .toArray();
            res.json(content);
        } catch (error) {
            console.error('Error fetching content:', error);
            res.status(500).json({ error: 'Error fetching content' });
        }
    },

    // Delete content
    async deleteContent(req, res) {
        try {
            const { id } = req.params;
            
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid content ID' });
            }

            const db = getDb();
            const result = await db.collection('contents')
                .deleteOne({ _id: new ObjectId(id) });
            
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Content not found' });
            }

            res.json({ message: 'Content deleted successfully' });
        } catch (error) {
            console.error('Error deleting content:', error);
            res.status(500).json({ error: 'Error deleting content' });
        }
    }
};

module.exports = ContentController;