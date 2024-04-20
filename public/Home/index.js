document.addEventListener("DOMContentLoaded", function() {
    const messages = document.getElementById("messages");
    const messageInput = document.getElementById("message");
    const sendButton = document.getElementById("send");

    // Function to add a new message to the chat
    function addMessage(messageText) {
        const li = document.createElement("li");
        li.textContent = messageText;
        messages.appendChild(li);
    }

    // Event listener for the send button
    sendButton.addEventListener("click", function() {
        const message = messageInput.value.trim();
        if (message !== "") {
            addMessage(message);
            messageInput.value = "";
        }
    });

    // Simulate receiving a message (for demonstration purposes)
    addMessage("Welcome to the chat app!");

    // You can replace the above line with actual logic to receive messages from a server
});
