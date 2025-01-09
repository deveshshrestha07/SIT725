document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const chatWindow = document.getElementById('chatWindow');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const typingStatus = document.getElementById('typingStatus');

    // Display previous messages
    socket.on('previousMessages', (messages) => {
        messages.forEach((msg) => {
            chatWindow.innerHTML += `<p><strong>${msg.from}:</strong> ${msg.message}</p>`;
        });
        chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the latest message
    });

    // Display incoming messages
    socket.on('message', (data) => {
        chatWindow.innerHTML += `<p><strong>${data.from}:</strong> ${data.message}</p>`;
        chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the latest message
    });

    // Send message
    sendButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            socket.emit('message', message); // Send message to server
            messageInput.value = ''; // Clear input field
        }
    });

    // Typing status
    messageInput.addEventListener('input', () => {
        socket.emit('typing', `${socket.id} is typing...`); // Send typing status with the sender's socket ID
    });

    socket.on('typing', (data) => {
        typingStatus.textContent = data;
    });

    socket.on('stopTyping', () => {
        typingStatus.textContent = '';
    });

    messageInput.addEventListener('blur', () => {
        socket.emit('stopTyping');
    });
});
