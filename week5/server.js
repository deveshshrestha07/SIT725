const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { connectToDatabase } = require('./dbconnection');
const router = require('./router/router');

const app = express();


// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));  // Serve static files
app.use('/api', router);  // Mount API routes under /api

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

async function startServer() {
    try {
        await connectToDatabase();
        app.listen(3000, () => console.log('Server running on http://localhost:3000'));
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();