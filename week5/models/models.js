const { ObjectId } = require('mongodb');
const { getDb } = require('../dbconnection');

class ContentModel {
    static async create(content) {
        const db = getDb();
        return await db.collection('content').insertOne(content);
    }

    static async getAll() {
        const db = getDb();
        return await db.collection('content').find().toArray();
    }

    static async delete(id) {
        const db = getDb();
        return await db.collection('content').deleteOne({ _id: new ObjectId(id) });
    }
}

module.exports = ContentModel;