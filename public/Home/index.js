document.addEventListener("DOMContentLoaded", function() {
    const chatsContainer = document.getElementById('chats');
    const messages = document.getElementById("messages");
    const messageInput = document.getElementById("message");
    const sendButton = document.getElementById("send");

    // Function to add a new message to the chat
    function addMessage(messageText) {
        const chatElement = document.createElement('div');
        chatElement.classList.add('chat');
        chatElement.textContent = messageText;
        chatsContainer.appendChild(chatElement);
    }

    // Event listener for the send button
    sendButton.addEventListener("click", async function() {
        const message = messageInput.value.trim();
        const token = localStorage.getItem('token');
        
        if (message !== "") {
            addMessage(message);
            messageInput.value = "";
            
            const messageDetails = {
                token: token,
                message: message,
                time: new Date()
            };
            
            try {
                const response = await axios.post("http://localhost:3000/storechat", messageDetails, {
                    validateStatus: function (status) {
                        return status >= 200 && status < 500; // Accept only status codes between 200 and 499
                    }
                });
                
                if (response.status === 200) {
                    console.log("Chat entered successfully");
                    const chats = localStorage.setItem('chats',JSON.stringify(response.data.chats));
                }
            } catch (error) {
                console.error("Error:", error);
                // Handle errors
            }
        }
    });
    

    // Simulate receiving a message (for demonstration purposes)

    // You can replace the above line with actual logic to receive messages from a server
});

window.onload = function() {
    getChats();
};

async function getChats() {
    try{
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/getChats?token=${token}`);
        if(response.status === 200){
            const chats = response.data.chats;
            console.log("Chats:", chats);
            localStorage.setItem('chats', JSON.stringify(chats));
            const chatsContainer = document.getElementById('chats');

            // Clear previous chats
            chatsContainer.innerHTML = "";

            // Add each chat message to the DOM
            chats.forEach(chat => {
                const chatElement = document.createElement('div');
                chatElement.classList.add('chat');
                chatElement.textContent = chat.chat; // Assuming chat message is stored in 'message' field
                chatsContainer.appendChild(chatElement);
            });
        } 
        else {
            console.log("Something went wrong");
        }
    }
    catch(error){
        console.error(error);
        console.log("Chats could not be retrieved");
    }
}
