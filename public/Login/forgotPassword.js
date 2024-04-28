async function forgotPassword(e){
    try{
        e.preventDefault();
        const email = e.target.querySelector('#email').value;
        const verificationDetails = {
            email: email
        }
        const response =await axios.post('http://23.22.247.49:3000/password/forgotpassword', verificationDetails);
        if(response.status === 200){
            console.log("Email Sent");
            localStorage.setItem('email', JSON.stringify(email));
            window.location.href = "../Login/login.html";
        }
    }
    catch{
        console.log("Hello");
    }
}