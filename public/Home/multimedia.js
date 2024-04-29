document.addEventListener("DOMContentLoaded", function() {
    // Get the button that opens the modal
    const uploadbtn = document.getElementById("upload-file-btn");

    // Get the <span> element that closes the modal
    const uploadspan = document.querySelector(".modal-content .close");

    // Get the modal
    const uploadModal = document.getElementById("file-upload-modal");

    // When the user clicks the button, open the modal
    uploadbtn.onclick = function() {
        uploadModal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    uploadspan.onclick = function() {
        uploadModal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === uploadModal) {
            uploadModal.style.display = "none";
        }
    }

    // Function to close the modal
    function closeModal() {
        uploadModal.style.display = "none";
    }
});


const uploadButton = document.getElementById("upload");
const fileInput = document.getElementById("file-input");

// Add event listener for the upload file button
uploadButton.addEventListener('click', async function uploadFile() {
    // Get the file from the file input element
    const file = fileInput.files[0];

    if (file) {
        // Create a FormData object
        const formData = new FormData();
        formData.append('file', file);

        // Get the token from wherever it's stored in your frontend (e.g., localStorage)
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const currentGroup = localStorage.getItem('currentGroup');

        // Include the token in the request body
        formData.append('token', token);
        formData.append('currentGroup', currentGroup);

        console.log("File:", file);

        try {
            // Make a POST request to your backend endpoint using Axios
            const response = await axios.post('http://23.22.247.49:3000/postDownload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 200) {
                console.log('File uploaded successfully:', response.data.fileUrl);
                const messageInput = document.getElementById("message");
                messageInput.value = response.data.fileUrl;
                const sendButton = document.getElementById("send");
                const uploadModal = document.getElementById("file-upload-modal");
                uploadModal.style.display = "none";
                sendButton.click();
                
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            // Optionally, handle errors
        }
    } else {
        console.error('No file selected');
        // Optionally, handle no file selected
    }
});




