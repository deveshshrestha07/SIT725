const { getDb } = require('../dbconnection');
const { ObjectId } = require('mongodb');

class ContentModel {
    static async create(content) {
        try {
            const db = getDb();
            return await db.collection('content').insertOne({
                ...content,
                createdAt: new Date()
            });
        } catch (error) {
            console.error('Model Error - create:', error);
            throw error;
        }
    }

    static async getAll() {
        try {
            const db = getDb();
            return await db.collection('content').find({}).toArray();
        } catch (error) {
            console.error('Model Error - getAll:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const db = getDb();
            return await db.collection('content').deleteOne({
                _id: new ObjectId(id)
            });
        } catch (error) {
            console.error('Model Error - delete:', error);
            throw error;
        }
    }
}

module.exports = ContentModel;