document.addEventListener("DOMContentLoaded", function() {
    const chatsContainer = document.getElementById('chats');
    const messages = document.getElementById("messages");
    const messageInput = document.getElementById("message");
    const sendButton = document.getElementById("send");

    // Function to add a new message to the chat
    function addMessage(messageText) {
        const chatElement = document.createElement('div');
        chatElement.classList.add("chat-bubble","outgoing");
        const p = document.createElement('p');
        p.className = 'message';
        p.innerHTML = messageText;
        const span = document.createElement('span');
        span.className = 'timestamp';
        chatElement.appendChild(p);
        chatElement.appendChild(span);
        span.innerHTML = new Date();
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

});

window.onload = function() {
    getChats();

    setInterval(getChats, 1000);
};

async function getChats() {
    try{
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/getChats`,{
            validateStatus: function (status) {
                return status >= 200 && status < 500; // Accept only status codes between 200 and 499
            }
        });
        if(response.status === 200){
            const chats = response.data.chats;
            console.log("Chats:", chats);
            localStorage.setItem('chats', JSON.stringify(chats));
            const name = localStorage.getItem('name');
            const chatsContainer = document.getElementById('chats');

            // Clear previous chats
            chatsContainer.innerHTML = "";

            // Add each chat message to the DOM
            chats.forEach(chat => {
                const testElement = document.querySelector('.chats');
                const chatElement = document.createElement('div');
                console.log(chat.name, name);
                if(chat.name === name){
                    chatElement.classList.add("chat-bubble", "outgoing");
                }
                else{
                    chatElement.classList.add("chat-bubble","incoming");
                }
                const p = document.createElement('p');
                p.className = 'message';
                p.innerHTML = chat.chat
                const span = document.createElement('span');
                span.className = 'timestamp';
                chatElement.appendChild(p);
                chatElement.appendChild(span);
                span.innerHTML = new Date(chat.time);
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
