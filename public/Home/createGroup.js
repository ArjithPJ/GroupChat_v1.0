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
        const creatorName = localStorage.getItem('name');
        users.forEach(function(user) {
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "users[]";
            checkbox.value = user.id;
            var label = document.createElement("label");
            var newDiv = document.createElement("div");
            newDiv.style.display='flex';
            label.className="name";
            label.style.marginTop='10px';
            userList.appendChild(label);
            label.textContent=user.name;
            
            newDiv.appendChild(checkbox);
            newDiv.appendChild(label);
            
            userList.appendChild(newDiv);
            
            userList.appendChild(document.createElement("br"));
            if (user.name === creatorName) {
                checkbox.checked = true; // Check the checkbox
                checkbox.disabled = true; // Disable the checkbox
            }
        });
        var createGroupBtn = document.getElementById("create-group-btn");
        var groupName = document.getElementById("groupName");
        var userList = document.getElementsByName("users[]");
        var userNamesList = document.querySelectorAll(".name");
        console.log('usernamesList',userNamesList);
        const token = localStorage.getItem('token');

        createGroupBtn.onclick = async function(e) {
            e.preventDefault();
            console.log("Hey its clicked");
            console.log('usernamesList',userNamesList);
            console.log(userNamesList);
            var selectedUsers = [];
            var selectedUsernames=[];
            for(let i = 0; i< userList.length; i++){
                let user=userList[i];
                let name=userNamesList[i];
                if(user.checked){
                    selectedUsers.push(user.value);
                    selectedUsernames.push(name.textContent);
                }
            }
            console.log(selectedUsers);
            console.log(selectedUsernames);
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
                const response = await axios.post('http://localhost:3000/createGroup', {
                    groupName: groupName.value,
                    selectedUsers: selectedUsers,
                    selectedUsernames: selectedUsernames,
                    token: token
                });
                console.log("No error");
                if (response.status === 200) {
                    alert("Group created successfully!");
                    modal.style.display = "none"; // Close the modal
                    const belongedGroups = response.data.belongedGroups;
                    localStorage.setItem('belongedGroups', JSON.stringify(belongedGroups));
                    window.location.reload();
                    //window.href.location = './index.html';
                } else {
                    alert("Failed to create group");
                }
            } catch (error) {
                console.error("Error:", error);
                
            }
        }

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






