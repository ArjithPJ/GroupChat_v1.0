// Function to search members in real-time as the user types
const name = document.getElementById('searchMembers');
name.addEventListener('keyup', function() {
    // Your code logic here
    searchMembers();
});
async function searchMembers() {
    const searchInput = document.getElementById('searchMembers').value;
    console.log("searchvalie:",searchInput);
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.style.display='block';
    
    // Make a request to your backend API to search for members
    const response = await axios.get(`http://localhost:3000/search-users?searchInput=${searchInput}`);
    console.log("Users:", response.data);
    const data = await response.data.users;
    console.log("Data:", data);

    // Clear previous search results
    searchResultsContainer.innerHTML = '';

    // Display search results
    data.forEach(member => {
        console.log(member);
        const memberDiv = document.createElement('div');
        memberDiv.innerHTML = `<span id="${member.id}">${member.name}</span>`;

        // Add click event listener to select the member
        memberDiv.addEventListener('click', async() => {
            await selectMember(member);
            // Hide the search results container after selecting a member
            searchResultsContainer.style.display = 'none';
        });

        searchResultsContainer.appendChild(memberDiv);
        name.addEventListener('blur', () => {
            // Hide the search results container when the search input loses focus
            setTimeout(() => {
                searchResultsContainer.style.display = 'none';
            }, 100);
        });
    });
}




// Function to select a member and display it in selectedMembersList
function selectMember(member) {
    const selectedMembersList = document.getElementById('selectedMembersList');
    const memberDiv = document.createElement('div');
    memberDiv.classList.add('selected-member');

    // Create a span for the member name
    const nameSpan = document.createElement('span');

    nameSpan.textContent = member.name;
    nameSpan.id=member.id;
    memberDiv.appendChild(nameSpan);

    // Create a button for removing the member
    const removeButton = document.createElement('button');
    removeButton.textContent = 'x';
    removeButton.classList.add('remove-button');

    // Add click event listener to remove the member
    removeButton.addEventListener('click', function() {
        memberDiv.remove();
    });

    memberDiv.appendChild(removeButton);

    selectedMembersList.appendChild(memberDiv);
    document.getElementById('searchMembers').value='';
    document.getElementById('searchResults').innerHTML='';
}


const addButton = document.getElementById('add-more');

addButton.addEventListener('click', async function() {
    // Your code logic here
    await addMembers();
});

// Function to send selected members to the backend
async function addMembers() {
    const selectedMembers = document.querySelectorAll('.selected-member');

    // Arrays to store member names and IDs
    const memberNames = [];
    const memberIds = [];

    selectedMembers.forEach(member => {
        // Get the member name from the span element inside the div
        const name = member.querySelector('span').textContent;
        memberNames.push(name);

        // Get the member ID from the id attribute of the span element
        const id = member.querySelector('span').id;
        memberIds.push(id);
    });
    console.log("Member Names:", memberNames);
    console.log("Member IDs:", memberIds);


    try {
        const currentGroup = localStorage.getItem('currentGroup');
        const currentGroupName = localStorage.getItem('currentGroupName');
        // Make a request to your backend API to add members using axios.post
        const response = await axios.post('http://localhost:3000/add-members', {
            memberIds: memberIds,
            memberNames: memberNames,
            currentGroup: currentGroup,
            currentGroupName: currentGroupName
        });
        if(response.status ===200){
            console.log("Added to the group");
            const selectedMembersList = document.getElementById("selectedMembersList");
            selectedMembersList.innerHTML='';
            const modal = document.getElementById('myModal-editgroup');
            
            modal.style.display='none';
        }

        console.log('Members added successfully');
    } catch (error) {
        console.error('Failed to add members:', error);
    }
}
