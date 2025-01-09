// const readline = require('readline');
// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const http = require('http');
// const socketIO = require('socket.io');
// const { connectToDatabase, getDb } = require('./dbconnection'); // Import database connection

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// // Middleware
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));


// // Serve index.html for root route
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Socket.IO setup
// io.on('connection', (socket) => {
//     console.log(`A user connected: ${socket.id}`);

//     // Welcome message for the client
//     socket.emit('message', { from: 'Server', message: 'Welcome to the chat!' });

//     // Listen for client messages and save to the database
//     socket.on('message', async (data) => {
//         console.log(`Message from ${socket.id}: ${data}`);

//         try {
//             const db = getDb(); // Get the connected database instance
//             const messagesCollection = db.collection('messages'); // Use a 'messages' collection
//             await messagesCollection.insertOne({ from: socket.id, message: data, timestamp: new Date() }); // Save message to database
//             console.log('Message saved to database');
//         } catch (err) {
//             console.error('Error saving message to database:', err);
//         }

//         // Broadcast to all clients
//         io.emit('message', { from: socket.id, message: data });
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log(`A user disconnected: ${socket.id}`);
//     });
// });

// // Server-side chat input
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

// rl.on('line', (input) => {
//     // Broadcast server's message to all clients
//     io.emit('message', { from: 'Server', message: input });
// });

// // Start the server after database connection
// async function startServer() {
//     try {
//         await connectToDatabase(); // Establish the database connection
//         server.listen(3000, () => {
//             console.log('Server running on http://localhost:3000');
//             console.log('Type a message in the terminal to send it to clients.');
//         });
//     } catch (error) {
//         console.error('Failed to start server:', error);
//         process.exit(1); // Exit if the database connection fails
//     }
// }

// startServer();

const readline = require('readline');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const { connectToDatabase, getDb } = require('./dbconnection'); // Import database connection
const router = require('./router/router'); // Import the router file

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mount the API router
app.use('/api', router); // Use the router for all routes starting with /api

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.IO setup
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Welcome message for the client
    socket.emit('message', { from: 'Server', message: 'Welcome to the chat!' });

    // Listen for client messages and save to the database
    socket.on('message', async (data) => {
        console.log(`Message from ${socket.id}: ${data}`);

        try {
            const db = getDb(); // Get the connected database instance
            const messagesCollection = db.collection('messages'); // Use a 'messages' collection
            await messagesCollection.insertOne({ from: socket.id, message: data, timestamp: new Date() }); // Save message to database
            console.log('Message saved to database');
        } catch (err) {
            console.error('Error saving message to database:', err);
        }

        // Broadcast to all clients
        io.emit('message', { from: socket.id, message: data });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`A user disconnected: ${socket.id}`);
    });
});

// Server-side chat input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on('line', (input) => {
    // Broadcast server's message to all clients
    io.emit('message', { from: 'Server', message: input });
});

// Start the server after database connection
async function startServer() {
    try {
        await connectToDatabase(); // Establish the database connection
        server.listen(3000, () => {
            console.log('Server running on http://localhost:3000');
            console.log('Type a message in the terminal to send it to clients.');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1); // Exit if the database connection fails
    }
}

startServer();
