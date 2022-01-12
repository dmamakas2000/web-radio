// App imports
const express = require('express');
const fs = require('fs');
const path = require('path');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const app = express();

// Initializations
var jingles = require('./htdocs/json/jingles.json');
var ads = require('./htdocs/json/ads.json');
var playlist_1 = require('./htdocs/json/playlist_1.json');
var playlist_2 = require('./htdocs/json/playlist_2.json');
var playlist_3 = require('./htdocs/json/playlist_3.json');
var playlist_4 = require('./htdocs/json/playlist_4.json');
var playlist_5 = require('./htdocs/json/playlist_5.json');

var streamPlaylist = require("./htdocs/stream/stream-playlist.json");
var playlistToStream = streamPlaylist['playlist_id'];

// Axios
const axios = require("axios");

// Http adapter
const httpAdapter = require("axios/lib/adapters/http");

// Import AdminDAO class
const AdminDAO = require('./htdocs/js/AdminDAO.js')

// Host
const hostname = 'localhost';

// App port
const port = 8080;

// Administrators
const adminN1 = new AdminDAO("bobos@aueb.gr", "Dogpassword");
const adminN2 = new AdminDAO("funkyCat@aueb.gr", "ilovedogs");

// App configuration
var age = null;
app.use('/', express.static(__dirname + '/htdocs'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessions({
    secret: "mysecretcookieforloginasadmin",
    saveUninitialized:true,
    cookie: { maxAge: age },
    resave: false 
}));
app.use(cookieParser());
var session;

// Admin endpoint
app.get('/admin', function(req, res){

    var options = {
        root: path.join(__dirname, 'private')
    }
	session=req.session;
	if (session.email && session.password) {
		res.sendFile('admin.html', options, function(err){
			console.log(err)
		});
	}
	else {
		res.redirect('/login');
	}
})

// Login endpoint
app.get('/login', function(req, res){

    var options = {
        root: path.join(__dirname, 'private')
    }
	session=req.session;
	if (session.email && session.password) {
		res.redirect('/');
	}
	else {
		res.sendFile('login.html', options, function(err){
			console.log(err)
		});
	}
})

// Application - GET endpoint (Logout)
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

// Important headers in order not to generate CORS errors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

// Get jingles endpoinf
app.get("/get/jingles", (req, res) => {
	res.status(200).send(jingles);
});

// Get adds endpoint
app.get("/get/ads", (req, res) => {
	res.status(200).send(ads);
});

// Get playlist endpoint
app.get("/get/playlist", (req, res) => {
	playlistToStream = streamPlaylist['playlist_id'];

	if (playlistToStream == 1) {
		res.status(200).send(playlist_1);
	} else if (playlistToStream == 2) {
		res.status(200).send(playlist_2);
	} else if (playlistToStream == 3) {
		res.status(200).send(playlist_3);
	} else if (playlistToStream == 4) {
		res.status(200).send(playlist_4);
	} else if (playlistToStream == 5) {
		res.status(200).send(playlist_5);
	}
});

// Application - POST endpoint (Login Authentication)
app.post('/auth/login', function (req, res) {
	const userEmail = req.body.email;
	const userPassword = req.body.password;
	session = req.session;

	// Validation
	if ((userEmail.localeCompare(adminN1.getEmail()) == 0 && userPassword.localeCompare(adminN1.getPassword()) == 0) || (userEmail.localeCompare(adminN2.getEmail()) == 0 && userPassword.localeCompare(adminN2.getPassword()) == 0)) {
		// Administrator 1 logged in - Respond with status 200 - OK
		session.email = userEmail;
		session.password = userPassword;
	
		if (req.body.remember == true) {
			age = 1000 * 60 * 60 * 24;
		}
		else {
			age = null;
		}
		session.cookie.maxAge = age;
		res.status(200).send({ok: "true"});
	}
	else {
		// Do not log the user -  Respond with status 200 - OK
		res.status(200).send({ok: "false"});
	}
});

// Slug
app.get('/:slug?', function (req, res) { 
	slug = req.params.slug;
	var options = {
		root: path.join(__dirname, 'htdocs')
	}
	if(!slug) {
		slug = 'index'
	};
	res.sendFile(slug+'.html', options, function(err){
		// console.log(err)
	});
})

// Write to playlist endpoint
app.post('/playlist/:id', function (req, res) {
	var fileName = './htdocs/stream/stream-playlist.json';
	var file = require(fileName);
	file.playlist_id = req.params.id;
    
	fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
		if (err) return console.log(err);
		console.log(JSON.stringify(file, null, 2));
		console.log('writing to ' + fileName);
	});
});

// Make the application listening on port 8080
app.listen(port, hostname, () => {
  console.log(`App running at http://${hostname}:${port}/`);
});