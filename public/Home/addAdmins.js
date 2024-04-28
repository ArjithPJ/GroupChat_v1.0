const newAdminMembers = document.getElementById('adminMembers');
console.log("NpindW", newAdminMembers);
const newAdmins = document.getElementById('new-admins');

const addAdminButton = document.getElementById('add-admin-button');

newAdminMembers.addEventListener('change', function(){
    const selectedOption = this.options[this.selectedIndex];
    const memberId = selectedOption.value;
    const memberName = selectedOption.textContent;

    const memberSpan = document.createElement('span');
    memberSpan.textContent = memberName;
    memberSpan.id = memberId;

    const removeButton = document.createElement('button');
    removeButton.textContent= 'x';

    const newAdminDiv = document.createElement('div');
    newAdminDiv.class = 'new-admin-member';
    newAdminDiv.appendChild(memberSpan);
    newAdminDiv.appendChild(removeButton);
    newAdmins.appendChild(newAdminDiv);
    removeButton.addEventListener('click', function() {
        removeButton.parentElement.remove();
    });

    this.value = '0';
});

newAdminMembers.addEventListener('click', async function() {
    try{
        const currentGroup = localStorage.getItem('currentGroup');
        const response = await axios.get(`http://localhost:3000/getMembers?group_id=${currentGroup}`);
        if(response.status === 200){
            const members = response.data.users;
            newAdminMembers.innerHTML=`<option value="0" selected>Select</option>`;
            members.forEach(member => {
                console.log(member);
                const option = document.createElement('option');
                option.value=member.id;
                option.textContent = member.name;
                newAdminMembers.appendChild(option);
                
            })
        }
    }
    catch(error){
        console.log(error);
        console.log("Internal Server Error");
    }
    
});


addAdminButton.addEventListener('click', function() {
    // Collect the IDs of selected users
    const selectedUserIds = [];
    const selectedUserNames=[];
    const selectedSpans = newAdmins.querySelectorAll('span');
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
    addAdmins(selectedUserIds, selectedUserNames);
});

async function addAdmins(selectedUserIds, selectedUserNames) {
    try{
        const currentGroup = localStorage.getItem('currentGroup');
        const details={
            selectedUserIds: selectedUserIds,
            selectedUserNames: selectedUserNames,
            currentGroup: currentGroup
        };
        
        const response = await axios.post('http://localhost:3000/add-admins', details);
        if(response.status === 200){
            console.log("Admins added");
            localStorage.setItem('Darkknight', 200);
            
        }
    }
    catch(error){
        console.log(error);
        console.log("Internal Server Error");
        localStorage.setItem('Darkknight', 500);
    }
};