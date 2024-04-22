async function login(e) {
    try{
        e.preventDefault();
        console.log(e.target.email.value);
        //localStorage.removeItem('downloads');
        const loginDetails = {
            email: e.target.email.value,
            password: e.target.password.value
        }
        console.log(loginDetails);
        const response = await axios.post('http://localhost:3000/login', loginDetails, {
            validateStatus: function (status) {
                return status >= 200 && status < 500; // Accept only status codes between 200 and 499
            }
        });
        console.log("Response:", response.status);
        if(response.status ===200){
            const token = response.data.token;
            const name = response.data.name;
            localStorage.setItem('token', token);
            localStorage.setItem('name', name);
            window.location.href = "../Home/index.html";
        
        }
        else if(response.status === 404){
            //window.location.href = "../Login/login.html";
            //alert("User account doesn't exist");
            const loginForm = document.body.querySelector('.login-form');
            const signuplink = document.body.querySelector('.signup-link');
            console.log(loginForm);
            let paragraph = document.body.querySelector('p');
            if(!paragraph)
                paragraph=document.createElement('p');
            paragraph.innerHTML="";
            paragraph.innerHTML = "User Account doesn't exist";
            loginForm.insertBefore(paragraph, signuplink); 
            //throw new Error('Failed to Login');
        }
        else if(response.status === 401){
            //alert("Incorrect Password");
            const loginForm = document.body.querySelector('.login-form');
            const signuplink = document.body.querySelector('.signup-link');
            console.log(loginForm);
            let paragraph = document.body.querySelector('p');
            console.log("Paragraph", paragraph);
            if(!paragraph)
                paragraph=document.createElement('p');
            paragraph.innerHTML="";
            paragraph.innerHTML = "Incorrect Password";
            loginForm.insertBefore(paragraph, signuplink); 
            
        }
        else{
            alert("Something went wrong");
        }
    }
    catch(err){
        //document.body.innerHTML+= `<div style="color:red;">${err} <div>`;
        console.log(err);
    };
};