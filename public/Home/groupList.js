const groupList = document.querySelector(".your-groups");
let intervalId; // Variable to store the interval ID

// Add a click event listener to the group list
groupList.addEventListener("click", async function(event) {
    const clickedGroup = event.target.closest("div.groupname");
    console.log(clickedGroup);
    const groupName = clickedGroup.textContent;
    const groupId = clickedGroup.id;
    console.log(groupName);
    const token = localStorage.getItem('token');

    // Clear previous interval if exists
    clearInterval(intervalId);
    const contentsContainer = document.querySelector('.contents');
    if(document.querySelector('.group-name')){
        document.querySelector('.group-name').remove();
    }
    const groupNameDiv = document.createElement('div');
    groupNameDiv.className = 'group-name';
    const adminButton = document.createElement('button');
    adminButton.id='add-members';
    adminButton.innerHTML='Edit Group';
    const grname= document.createElement('h2');
    grname.id='gr-name';
    grname.innerHTML= groupName;
    groupNameDiv.appendChild(grname);
    groupNameDiv.appendChild(adminButton);
    contentsContainer.prepend(groupNameDiv);
    const modal = document.getElementById('myModal-editgroup');
    const closeBtn = modal.querySelector('.close-editGroup');

    
    
    adminButton.onclick =async function(e){
        e.preventDefault();
        modal.style.display = "block";
        // const response = await axios.get(`http://localhost:3000/getMembers?group_id=${groupId}`,{
        //     validateStatus: function (status) {
        //         return status >= 200 && status < 500; // Accept only status codes between 200 and 499
        //     }
        // });
        
        // if(response.status===200){
        //     const users = response.data.users;
        //     console.log("Users:", users);
        //     var userList = document.getElementById("current-userList");
        //     userList.innerHTML = ""; // Clear existing users
        //     users.forEach(function(user) {
        //         var checkbox = document.createElement("input");
        //         checkbox.type = "checkbox";
        //         checkbox.name = "users[]";
        //         checkbox.value = user.id;
        //         userList.appendChild(checkbox);
        //         userList.appendChild(document.createTextNode(user.name));
        //         userList.appendChild(document.createElement("br"));
        //     });
        // }

    }






    closeBtn.addEventListener("click", function() {
        // Hide the modal when close button is clicked
        modal.style.display = "none";
    });
    
    // Close the modal when the user clicks outside of it
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Function to fetch chats
    const fetchChats = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/getChats?group_id=${groupId}&token=${token}`, {
                validateStatus: function(status) {
                    return status >= 200 && status < 500; // Accept only status codes between 200 and 499
                }
            });
            if (response.status === 200) {
                const chats = response.data.chats;
                const currentGroup = response.data.currentGroup;
                const currentGroupName = response.data.currentGroupName;
                localStorage.setItem('currentGroup', JSON.stringify(parseInt(currentGroup,10)));
                localStorage.setItem('currentGroupName', currentGroupName);
                await showChats(chats, groupName);
            } else {
                console.log("Response Status:", response.status);
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };
    console.log("Clicked group:", clickedGroup);
    console.log("Token:", token);
    // Call fetchChats immediately and then every second
    fetchChats();
    intervalId = setInterval(fetchChats, 1000);

    if (!clickedGroup) return; // Ignore clicks outside of list items

    // Remove the "selected" class from all list items
    const allGroups = groupList.querySelectorAll("div");
    allGroups.forEach(group => group.classList.remove("selected"));

    // Add the "selected" class to the clicked group
    clickedGroup.classList.add("selected");

    // You can now implement logic to display the chats of the selected group
    // For example, you can fetch and display the chats associated with the clicked group
});

async function showChats(chats, groupName){
    
    const chatsContainer = document.getElementById('chats');
    // Clear previous chats
    chatsContainer.innerHTML = "";
    const name = localStorage.getItem('name');

    // Add each chat message to the DOM
    chats.forEach(chat => {
        const testElement = document.querySelector('.chats');
        const chatElement = document.createElement('div');
        if(chat.name === name){
            chatElement.classList.add("chat-bubble", "outgoing");
        }
        else{
            chatElement.classList.add("chat-bubble","incoming");
        }
        const p = document.createElement('p');
        p.className = 'message';
        p.innerHTML = chat.chat
        const sender = document.createElement('span');
        sender.className="sender-name";
        sender.innerHTML=chat.name;
        const span = document.createElement('span');
        span.className = 'timestamp';
        chatElement.appendChild(sender);
        chatElement.appendChild(p);
        chatElement.appendChild(span);
        const time = new Date(chat.time);
        const hours=time.getHours();
        const minutes = time.getMinutes();
        span.innerHTML =`${hours}:${minutes}`;
        chatsContainer.appendChild(chatElement);

    });
}
