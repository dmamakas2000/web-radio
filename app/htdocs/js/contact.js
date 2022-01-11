// Disable automatic page reload - Select the form
var form = document.getElementById("contact-form");

// Apply the function
function handleForm(event) { 
    event.preventDefault(); 
}

// Add event - On form submit
form.addEventListener('submit', handleForm);

var nameField;
var emailField;
var messageField;

function getEmailSendDetails() {
    nameField = document.getElementById("name").value;
    emailField = document.getElementById("email").value;
    messageField = document.getElementById("message").value;
}

function sendEmailDetailsIntoServer() {
    getEmailSendDetails();

    // Fetch the POST endpoint and send the data
    fetch('http://localhost:7070/contact', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*", 
            "Access-Control-Allow-Credentials" : "true"
        },
        body: JSON.stringify({name: nameField, email: emailField, message: messageField})
        })
    .then(res => handleServersResponse(res));
}

function handleServersResponse(res) {
    var alertSection = document.getElementById("alert-message");

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";

    if (res.ok) {
        // Mail was sent
        const htmlMessage = "Your message was sent with success!";
        alertSection.classList.remove("alert-danger");
        alertSection.classList.add("alert-success");
        alertSection.innerHTML = htmlMessage;
    } else {
        // Mail was not sent
        alertSection.classList.remove("alert-success");
        alertSection.classList.add("alert-danger");
        const htmlMessage = "There was an error occured while sending your message. Please check again your inputs.";
        alertSection.innerHTML = htmlMessage;
    }
}