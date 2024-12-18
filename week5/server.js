const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { connectToDatabase } = require('./dbconnection');
const router = require('./router/router');

const app = express();

// Add CSP headers middleware
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "img-src 'self' data: https:; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "script-src 'self' 'unsafe-inline' https://code.jquery.com https://cdnjs.cloudflare.com; " +
        "connect-src 'self';"
    );
    next();
});

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