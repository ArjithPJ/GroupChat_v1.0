async function signup(e) {
    try{
        e.preventDefault();
        console.log(e.target.email.value);

        const signupDetails = {
            name: e.target.name.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
            password: e.target.password.value
        }
        console.log(signupDetails);
        const response =await axios.post('http://localhost:3000/signup', signupDetails, {
            validateStatus: function (status) {
                return status >= 200 && status < 500; // Accept only status codes between 200 and 499
            }
        });
        if(response.status ===201){
            alert("User logged in");
            window.location.href = "../Login/login.html";
        }
        else if(response.status === 409){
            alert("User already exists");
        }
        else{
            throw new Error('Failed to signup');
        }
    }
    catch(err){
        document.body.innerHTML+= `<div style="color:red;">${err} <div>`;
    };
};