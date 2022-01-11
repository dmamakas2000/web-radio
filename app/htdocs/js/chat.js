// Get the current socket
const socket = io('http://localhost:9898')

// Chat list root element
const chatListRootElement = document.getElementById("messages-section");

// Client's (User's) unique ID
const uniqueUserId = "#user" + Date.now();

socket.emit('new-user', uniqueUserId);

socket.on('user-connected', name => {
    createNewRecievedMessage(name, "Joined the chat");
})

socket.on('user-disconnected', name => {
    createNewRecievedMessage(name, "Left the chat");
})

// A new message was recieved from someone else
socket.on('chat-message', data => {
    createNewRecievedMessage(data.name, data.message);
})

/*
Creates a new message sent from the user
*/
function createNewMessage(message) {
    const li = document.createElement("li");
    li.classList.add("out");

    const div1 = document.createElement("div");
    div1.classList.add("chat-img");

    const img = document.createElement("img");
    img.src = "images/logo.png";

    const div2 = document.createElement("div");
    div2.classList.add("chat-body");

    const div3 = document.createElement("div");
    div3.classList.add("chat-message");

    const h5 = document.createElement("h5");
    h5.innerHTML = "You";

    const p = document.createElement("p");
    p.innerHTML = message;

    // Appends
    div3.appendChild(h5);
    div3.appendChild(p);
    div2.appendChild(div3);
    div1.appendChild(img);
    li.appendChild(div1);
    li.appendChild(div2);
    chatListRootElement.appendChild(li);
}

/*
Creates message divs for messages comming from other users.
*/
function createNewRecievedMessage(user, messageSent) {
    const li = document.createElement("li");
    li.classList.add("in");

    const div1 = document.createElement("div");
    div1.classList.add("chat-img");

    const img = document.createElement("img");
    img.src = "images/logo.png";

    const div2 = document.createElement("div");
    div2.classList.add("chat-body");

    const div3 = document.createElement("div");
    div3.classList.add("chat-message");

    const h5 = document.createElement("h5");
    h5.innerHTML = user;

    const p = document.createElement("p");
    p.innerHTML = messageSent;

    // Appends
    div3.appendChild(h5);
    div3.appendChild(p);
    div2.appendChild(div3);
    div1.appendChild(img);
    li.appendChild(div1);
    li.appendChild(div2);
    chatListRootElement.appendChild(li);
}

/*
Enter key pressed on input for chatting.
*/
document.getElementById("send-message-input").onkeydown = function(event){
    var e = event || window.event;
    if(e.keyCode == 13){
        handleSendButtonPressed();
    }
}

/*
Handles the event of sending a new message.
*/
function handleSendButtonPressed() {
    // Get the text user wants to send out
    const messageToSend = document.getElementById("send-message-input").value;
    // Set the input's text to blank
    document.getElementById("send-message-input").value = "";
    // Create a new message div
    createNewMessage(messageToSend);
    // Emit
    socket.emit('send-chat-message', messageToSend);
}

/*
Create a message div saying that the user joined the chat.
*/
createNewMessage("You joined the chat");