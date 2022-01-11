// Disable automatic page reload - Select the form
var form = document.getElementById("admin-form");

// Apply the function
function handleForm(event) { 
    event.preventDefault(); 
}

// Add event - On form submit
form.addEventListener('submit', handleForm);

/* -------------------------- CONSTANTS -------------------------- */

// Redirect URL
const redirect_uri = "http://localhost:8080/admin";

// Spotify constants
const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";

/*
Handles the case when page loads.
*/
function onPageLoad() {
    if ( window.location.search.length > 0 ) {
        // URL contains more than 0 parameters, so continue to authorization
        handleRedirect();
    }
    else{
        // URL is plain and does not contain any paramerers
    }
    
}

/* 
Handles redirect from administrator's initial page.
*/
function handleRedirect() {
    // Authorization code
    let code = getCode();
    // Request access token using the code we get back from Spotify
    fetchAccessToken( code );
    // Remove param from url
    window.history.pushState("", "", redirect_uri);
}

/*
Retrieves the code from the URL.
*/ 
function getCode() {
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    // Return the code
    return code;
}

/*
Constructs the body given a specific authorization code.
*/
function fetchAccessToken( code ) {
    let body = "grant_type=authorization_code";
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + localStorage.getItem("client_id");
    body += "&client_secret=" +  localStorage.getItem("client_secret");
    callAuthorizationApi(body);
}

/*
Fetches the Spotify API and requests authorization.
*/
function callAuthorizationApi(body) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(localStorage.getItem("client_id") + ":" +  localStorage.getItem("client_secret")));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

/*
Handles the response returned from Spotify's server.
*/
function handleAuthorizationResponse() {
    if ( this.status == 200 ) {
        // Successful response
        var data = JSON.parse(this.responseText);
        console.log(data);
        var data = JSON.parse(this.responseText);
        if ( data.access_token != undefined ){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if ( data.refresh_token  != undefined ){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        if (data.access_token != undefined && data.refresh_token  != undefined) {
            displayAuthState(true);
        }
        onPageLoad();
    }
    else {
        // Failed response
        console.log(this.responseText);
        displayAuthState(false);
    }
}

/*
Displays the result of authorization [success/fail] via dynamically assigning HTML code into admin's script.
*/
function displayAuthState(state) {
    if (state) {
        const innerHTML = "Success";
        document.getElementById("alert-section").classList.remove("alert-danger");
        document.getElementById("alert-section").classList.add("alert-success");
        document.getElementById("alert-section").innerHTML = innerHTML;
    } else {
        const innerHTML = "Fail";
        document.getElementById("alert-section").classList.remove("alert-success");
        document.getElementById("alert-section").classList.add("alert-danger");
        document.getElementById("alert-section").innerHTML = innerHTML;
    }
}

/*
Retrieves client-id and client-secret typed from the user.
*/
function authSpotify() {
    // User-typed client-id
    client_id = document.getElementById("client-id").value;
    // User-typed client-secret
    client_secret = document.getElementById("client-secret").value;

    // Update local storage
    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret);

    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    // Show Spotify's authorization screen - Redirection
    window.location.href = url;
}

function logout() {
    window.location.href = "/logout";
}

function changePlaylistId() {
	var selectedPlaylist = document.getElementById("music-genre");
	var playlistId = selectedPlaylist.value;
    
    // Fetch the POST endpoint and send the data
    fetch('http://localhost:8080/playlist/'+playlistId, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*", 
            "Access-Control-Allow-Credentials" : "true"
        }
	})
	
	document.getElementById("message").innerHTML = "Οι αλλαγές πραγματοποιήθηκαν!";
}