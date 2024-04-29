const groupList = document.querySelector(".your-groups");
const chatContainer = document.querySelector('.chat-container');

// Function to show chats
async function showChats(chats, groupName) {
    const chatsContainer = document.getElementById('chats');
    // Clear previous chats
    chatsContainer.innerHTML = "";
    const name = localStorage.getItem('name');

    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Add each chat message to the DOM
    chats.forEach(chat => {
        const testElement = document.querySelector('.chats');
        const chatElement = document.createElement('div');
        if (chat.name === name) {
            chatElement.classList.add("chat-bubble", "outgoing");
        } else {
            chatElement.classList.add("chat-bubble", "incoming");
        }
        const p = document.createElement('p');
        p.className = 'message';

        // Replace URLs in the message with clickable links
        const messageWithLinks = chat.chat.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
        p.innerHTML = messageWithLinks;

        const sender = document.createElement('span');
        sender.className = "sender-name";
        sender.innerHTML = chat.name;
        const span = document.createElement('span');
        span.className = 'timestamp';
        chatElement.appendChild(sender);
        chatElement.appendChild(p);
        chatElement.appendChild(span);
        const time = new Date(chat.time);
        const hours = time.getHours();
        const minutes = time.getMinutes();
        span.innerHTML = `${hours}:${minutes}`;
        chatsContainer.appendChild(chatElement);

    });
    console.log("Chats is shown");
}


// Function to fetch chats
const fetchChats = async (groupId, groupName) => {
    try {
        console.log("Socket called fetch chats!!");
        const token = localStorage.getItem('token');
        const adminButton = document.getElementById('add-members');

        const response = await axios.get(`http://localhost:3000/getChats?group_id=${groupId}&token=${token}`, {
            validateStatus: function (status) {
                return status >= 200 && status < 500; // Accept only status codes between 200 and 499
            }
        });
        if (response.status === 200) {
            const chats = response.data.chats;
            const isAdmin = response.data.isAdmin;
            const currentGroup = response.data.currentGroup;
            const currentGroupName = response.data.currentGroupName;
            localStorage.setItem('currentGroup', JSON.stringify(parseInt(currentGroup, 10)));
            localStorage.setItem('currentGroupName', currentGroupName);
            localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
            if (localStorage.getItem('isAdmin') === 'false') {
                adminButton.disabled = 'true';
            }
            console.log("Chats", chats);
            await showChats(chats, groupName);
        } else {
            console.log("Response Status:", response.status);
        }
    } catch (error) {
        console.error("Error fetching chats:", error);
    }
};

// Socket event listener for 'fetchChats'
socket.on('fetchChats', async () => {
    // Call fetchChats function to update chats
    console.log("Socket Triggered");
    const groupId = parseInt(localStorage.getItem('currentGroup'),10);
    const groupName = localStorage.getItem('currentGroupName');
    await fetchChats(groupId, groupName);
});

// Add a click event listener to the group list
groupList.addEventListener("click", async function (event) {
    const clickedGroup = event.target.closest("div.groupname");
    const groupName = clickedGroup.textContent;
    const groupId = clickedGroup.id;
    console.log("Clicked gorpeID", groupId, groupName);
    const token = localStorage.getItem('token');
    chatContainer.style.display = 'block';

    // Clear previous interval if exists
    //clearInterval(intervalId);
    const contentsContainer = document.querySelector('.contents');
    if (document.querySelector('.group-name')) {
        document.querySelector('.group-name').remove();
    }
    const groupNameDiv = document.createElement('div');
    groupNameDiv.className = 'group-name';
    const adminButton = document.createElement('button');
    adminButton.id = 'add-members';
    adminButton.innerHTML = `<i class='fas fa-pen'></i>`;

    const grname = document.createElement('h2');
    grname.id = 'gr-name';
    grname.innerHTML = groupName;
    groupNameDiv.appendChild(grname);
    groupNameDiv.appendChild(adminButton);
    contentsContainer.prepend(groupNameDiv);
    const modal = document.getElementById('myModal-editgroup');
    const closeBtn = modal.querySelector('.close-editGroup');

    adminButton.onclick = async function (e) {
        e.preventDefault();
        modal.style.display = "block";
    }

    closeBtn.addEventListener("click", function () {
        // Hide the modal when close button is clicked
        modal.style.display = "none";
    });

    // Close the modal when the user clicks outside of it
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    console.log("Clicked group:", clickedGroup);
    console.log("Token:", token);

    // Call fetchChats immediately and then every second
    await fetchChats(groupId, groupName);

    if (!clickedGroup) return; // Ignore clicks outside of list items

    // Remove the "selected" class from all list items
    const allGroups = groupList.querySelectorAll("div");
    allGroups.forEach(group => group.classList.remove("selected"));

    // Add the "selected" class to the clicked group
    clickedGroup.classList.add("selected");

    // You can now implement logic to display the chats of the selected group
    // For example, you can fetch and display the chats associated with the clicked group
});
