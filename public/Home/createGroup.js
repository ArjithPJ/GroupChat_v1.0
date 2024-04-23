var modal = document.getElementById("myModal");
var btn  = document.getElementById("createGroupButton");

var span = document.getElementsByClassName("close")[0];

btn.onclick = async function(e) {
    e.preventDefault();
    modal.style.display = "block";
    const response = await axios.get('http://localhost:3000/getUsers',{
        validateStatus: function (status) {
            return status >= 200 && status < 500; // Accept only status codes between 200 and 499
        }
    });
    if(response.status===200){
        const users = response.data.users;
        var userList = document.getElementById("userList");
        userList.innerHTML = ""; // Clear existing users
        users.forEach(function(user) {
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "users[]";
            checkbox.value = user.id;
            userList.appendChild(checkbox);
            userList.appendChild(document.createTextNode(user.name));
            userList.appendChild(document.createElement("br"));
        });
    }
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if(event.target === modal){
        modal.style.display="none";
    }
}

var createGroupBtn = document.getElementById("create-group-btn");
var groupName = document.getElementById("groupName");
var userList = document.getElementsByName("users[]");
const token = localStorage.getItem('token');

createGroupBtn.onclick = async function(e) {
    e.preventDefault();
    console.log("Hey its clicked");
    var selectedUsers = [];
    userList.forEach(function(user) {
        if (user.checked) {
            selectedUsers.push(user.value);
        }
    });
    console.log(selectedUsers);
    // Check if group name is empty
    if (!groupName.value.trim()) {
        alert("Please enter a group name");
        return;
    }
    // Check if at least one user is selected
    if (selectedUsers.length === 0) {
        alert("Please select at least one user");
        return;
    }
    // Send data to server
    try {
        console.log("we are in");
        const response = await axios.post('http://localhost:3000/createGroup', {
            groupName: groupName.value,
            selectedUsers: selectedUsers,
            token: token
        });
        console.log("No error");
        if (response.status === 200) {
            alert("Group created successfully!");
            modal.style.display = "none"; // Close the modal
            const belongedGroups = response.data.belongedGroups;
            localStorage.setItem('belongedGroups', JSON.stringify(belongedGroups));
        } else {
            alert("Failed to create group");
        }
    } catch (error) {
        console.error("Error:", error);
        
    }
}