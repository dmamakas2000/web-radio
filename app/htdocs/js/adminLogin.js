// Disable automatic page reload - Select the form
var form = document.getElementById("login-form");

// Apply the function
function handleForm(event) { 
    event.preventDefault(); 
}

// Add event - On form submit
form.addEventListener('submit', handleForm);

// Function called once the login button is pressed
function fetchServerToAuthenticate() {
    // Select e-mail's field value
    var emailField = document.getElementById("email").value;
    // Select password's field value
    var passwordField = document.getElementById("password").value;
    var rememberField = document.getElementById("customCheck1").checked;
    
    // Fetch the POST endpoint and send the data
    fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*", 
            "Access-Control-Allow-Credentials" : "true"
        },
        body: JSON.stringify({email: emailField, password: passwordField, remember: rememberField})
        })
    .then(res => 
        res.json()
    )
    .then(res => 
        doLogAdministratorIn(res)
    );
}

function doLogAdministratorIn(res) {
    console.log("Got in the function");
    console.log(res);
    if (res.ok.localeCompare("true") == 0) {
        // If user is authenticated, log him in
        window.location.replace("http://localhost:8080/admin");
    } else {
        // If the user is not authenticated, don't log him in
        const errorMessage = "Could not find administrator matching those credentials. Please try again.";
        const htmlErrorSection = "<div class='alert alert-danger' role='alert'>" + errorMessage + "</div>";

        document.getElementById("error-message").innerHTML = htmlErrorSection;
    }
}