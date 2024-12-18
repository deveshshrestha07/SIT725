const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { connectToDatabase } = require('./dbconnection');
const contentRouter = require('./public/router/router');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', contentRouter);

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

module.exports = app;