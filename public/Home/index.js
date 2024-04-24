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
        const currentGroup = localStorage.getItem('currentGroup');
        
        if (message !== "") {
            addMessage(message);
            messageInput.value = "";
            
            const messageDetails = {
                token: token,
                currentGroup: currentGroup,
                message: message,
                time: new Date()
            };
            
            try {
                console.log("Message clicked");
                const response = await axios.post("http://localhost:3000/storechat", messageDetails, {
                    validateStatus: function (status) {
                        return status >= 200 && status < 500; // Accept only status codes between 200 and 499
                    }
                });
                console.log(response.status);
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
    getGroups();
    // if(!localStorage.getItem(currentGroup)){
    //     getChats();
    //     setInterval(getChats, 1000);
    // }
    //getChats();

    //setInterval(getChats, 1000);
};

async function getGroups(){
    try{
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/getGroups?token=${token}`,{
            validateStatus: function (status) {
                return status >= 200 && status < 500; // Accept only status codes between 200 and 499
            }
        });
        if(response.status === 200){
            const belongedGroups=response.data.belongedGroups;
            localStorage.setItem('belongedGroups', JSON.stringify(belongedGroups));
            const groupsDiv = document.querySelector(".your-groups");
            belongedGroups.forEach((group)=>{
                console.log(group);
                const newgroupDiv = document.createElement('div');
                newgroupDiv.className = "groupname";
                newgroupDiv.id=group.group_id;
                newgroupDiv.innerHTML=group.group_name;
                groupsDiv.appendChild(newgroupDiv);
            });
        }
    }
    catch(error){
        console.log(error);
    }
}
