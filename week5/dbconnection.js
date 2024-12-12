const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://devesh:admin@test.m2erqon.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true, 
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    }
});

let db;

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db('contentDB');
        console.log('Connected to MongoDB');
        
        // Test the connection
        await db.command({ ping: 1 });
        console.log("Database connection test successful!");
        
        return db;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

function getDb() {
    if (!db) {
        throw new Error('Database not initialized. Call connectToDatabase first.');
    }
    return db;
}

process.on('SIGINT', async () => {
    try {
        await client.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error during database disconnection:', err);
        process.exit(1);
    }
});

module.exports = {
    connectToDatabase,
    getDb
}