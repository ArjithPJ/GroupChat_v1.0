const currentGroup = localStorage.getItem('currentGroup');

const selectMembers = document.getElementById('removeSelectedMembers');
console.log("BAn", selectMembers);

const selectedMembersList = document.getElementById('removeselectedMembersList');

const removeMembersButton = document.getElementById('remove-button');

selectMembers.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    if (selectedOption.value !== '0') {
        const memberId = selectedOption.value;
        const memberName = selectedOption.textContent;
        
        // Create span element for selected member
        const memberSpan = document.createElement('span');
        memberSpan.textContent = memberName;
        memberSpan.id = memberId;
        // Create remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'x';
        

        // Append remove button to span
        const newRemoveDiv= document.createElement('div');
        newRemoveDiv.class='remove-selected-member';
        newRemoveDiv.appendChild(memberSpan);
        newRemoveDiv.appendChild(removeButton);
        selectedMembersList.append(newRemoveDiv);
        removeButton.addEventListener('click', function() {
            selectMembers.innerHTML=`<option value="0" selected>Select</option>`;
            removeButton.parentElement.remove(); // Remove the span when the button is clicked
        });

        // Append span to selectedMembersList
        // selectedMembersList.appendChild(memberSpan);
        // selectedMembersList.appendChild(removeButton);

        // Reset select element to default option
        this.value = '0';
    }
});

// Assuming 'selectedMembers' is the ID of the select element
selectMembers.addEventListener('click', async function() {
    // Make a request to your backend API to get members
    const currentGroup = localStorage.getItem('currentGroup');
    selectMembers.innerHTML=`<option value="0" selected>Select</option>`;
    await axios.get(`http://localhost:3000/getMembers?group_id=${currentGroup}`)
        .then(response => {
            const members = response.data.users;
            console.log(response.data.users); // Assuming the response contains an array of member objects
            // Iterate over the members and create an option for each one
            selectMembers.innerHTML=`<option value="0" selected>Select</option>`;
            members.forEach(member => {
                const option = document.createElement('option');
                option.value = member.id; // Assuming member objects have an 'id' property
                option.textContent = member.name; // Assuming member objects have a 'name' property
                selectMembers.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Failed to fetch members:', error);
        });
});




removeMembersButton.addEventListener('click', function() {
    // Collect the IDs of selected users
    const selectedUserIds = [];
    const selectedUserNames=[];
    const selectedSpans = selectedMembersList.querySelectorAll('span');
    selectedSpans.forEach(span => {
        const memberId = parseInt(span.id,10);
        const memberName=span.textContent;
        selectedUserIds.push(memberId);
        selectedUserNames.push(memberName);
    });
    console.log("Batman-", selectedUserIds);
    localStorage.setItem('batman', JSON.stringify(selectedUserIds));
    localStorage.setItem('robin', JSON.stringify(selectedUserNames));
    // Call removeMembers function with selectedUserIds
    removeMembers(selectedUserIds, selectedUserNames);
});


async function removeMembers(selectedUserIds, selectedUserNames) {
    try{
        const currentGroup = localStorage.getItem('currentGroup');
        const details = {
            selectedUserIds: selectedUserIds,
            selectedUserNames: selectedUserNames,
            currentGroup: currentGroup
        };
        const response = await axios.post('http://localhost:3000/remove-members', details);
        if(response.status ===200){
            console.log("Members removed");
            console.log("Response status", response.status);
            localStorage.setItem('removed',response.status);
        }
    }
    catch(error){
        console.log(error);
        console.log("Internal Server Error");
    }
}

