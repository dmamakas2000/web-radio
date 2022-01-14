/*
HTML elements.
*/
const playPauseButton = document.getElementById("live");
const songDescription = document.getElementById("liveD");
const liveSongPlaying = document.getElementById("liveS");

/*
Current date and time.
*/
let date;
let curr_time;
let prev_time = '';

/*
Stream settings.
*/
let tracksAreRandom = false;
let playAds = false;
let playTime = false;

/*
Max number of all numbers to be generated randomly.
*/
var numRandoms;
var jingle_numRandoms;
var ad_numRandoms;

/*
All numbers that generated randomly.
*/
var uniqueRandoms = [];
var jingleRandoms = [];
var adRandoms = [];

/*
Boolean variable indicating if the next sound to be streamed should be a track (0), a jingle (1), an ad (2), or a time announcement (3).
*/
var comingNext = 0;

/*
Track index which is currently playing.
*/
let track_index = 0;
let jingle_index = 0;
let ad_index = 0;
let time_index = -1;

/*
Boolean variable indicating if a song is currently playing.
*/
let isPlaying = false;

/*
Current playlist.
*/
var playlist;
var jingles;
var ads;
var time;

/*
Server's URL used in order to get the current playlist choosed by the administrator.
*/
const SERVER_APP_URL = "http://localhost:8080/get/playlist";

/*
Server's URL used in order to get the jingles used to be streamed between tracks.
*/
const SERVER_APP_JINGLES = "http://localhost:8080/get/jingles";

/*
Server's URL used in order to get the ads used to be streamed between tracks.
*/
const SERVER_APP_ADS = "http://localhost:8080/get/ads";

/*
Server's URL used in order to get the time announcements used to be streamed every hour.
*/
const SERVER_APP_TIME = "http://localhost:8080/get/time";

/*
New audio element.
*/
let curr_track = document.createElement('audio');

/*
Once the window loads.
*/
window.onload = function() {
    getPlaylistFromServer();
	getJinglesFromServer();
	getAdsFromServer();
	getTimeFromServer();
	getStreamSettings();

    /*
    Load the first track in the tracklist
    */
    sleep(500).then(() => {
        // Song to start
        console.log("The playlist we should play now is: ");
        console.log(JSON.stringify(playlist, null, 2));
		if (tracksAreRandom) {
			track_index = makeUniqueRandom(uniqueRandoms, numRandoms);
		}
        // Loads the first track
		loadTrack(track_index);
    });
};

/*
Sleep time expects milliseconds.
*/
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

/*
Gets stream settings from server.
*/
function getStreamSettings() {
	let url = "/get/stream_settings";
	
	let myHeaders = new Headers();

	let init = {
		method: "GET",
		headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : "*", 
            "Access-Control-Allow-Credentials" : "true"
        }
	}
	
	fetch(url, init)
		.then(response => response.json() )
		.then(obj => {		
				console.log(obj);		
				if (obj.random_tracks == "yes") {
					tracksAreRandom = true;
				}
				
				if (obj.ads == "yes") {
					playAds = true;
				}
				
				if (obj.time_announcement == "yes") {
					playTime = true;
				}
		})
		.catch(error => {
			console.log(error)
		})
		sleep(1000).then(() => {
			// Do nothing
		});
		
}

/*
Gets the playlist returned from the server (app.js).
*/
function getPlaylistFromServer() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            playlist = JSON.parse(this.responseText);
			numRandoms = playlist.length;
        }
    };
	xhttp.open("GET", SERVER_APP_URL, true);
	xhttp.send();
}

/*
Gets the ads playlist returned from the server (app.js).
*/
function getAdsFromServer() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            ads = JSON.parse(this.responseText);
			ad_numRandoms = ads.length;
        }
    };
	xhttp.open("GET", SERVER_APP_ADS, true);
	xhttp.send();
}

/*
Gets the jingles playlist returned from the server (app.js).
*/
function getJinglesFromServer() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            jingles = JSON.parse(this.responseText);
			jingle_numRandoms = jingles.length;
        }
    };
	xhttp.open("GET", SERVER_APP_JINGLES, true);
	xhttp.send();
}

/*
Gets the time announcements playlist returned from the server (app.js).
*/
function getTimeFromServer() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            time = JSON.parse(this.responseText);
        }
    };
	xhttp.open("GET", SERVER_APP_TIME, true);
	xhttp.send();
}

/*
Prepares next track for loading.
*/
function loadTrack(track_id) {
	if (!playTime) {
		comingNext = 2;
		if (!playAds) {
			comingNext = 1;
		}
	}
	else {
		comingNext = 3;
	}
    curr_track.src = playlist[track_id].path;
	curr_track.load();
	curr_track.addEventListener("ended", nextTrack);
}

/*
Loads next track into the queue.
*/
function nextTrack() {
    if (comingNext == 1) {
        comingNext = 0;
        // Jingle to pick
		jingle_index = makeUniqueRandom(jingleRandoms, jingle_numRandoms);

        var prev_track_muted = curr_track.muted;
        curr_track.src = jingles[jingle_index].path;
	    curr_track.load();
	    curr_track.addEventListener("ended", nextTrack);
		
        play();
        if (prev_track_muted == true) {
            pause();
        }
    }
    else if (comingNext == 2) {
		var againAd = Math.floor(Math.random() * 3); //random integer from 0 to 3
		if (againAd == 0) {
			comingNext = 2;
		}
		else {
			comingNext = 1;
		}
		
        // Ad to pick
		ad_index = makeUniqueRandom(adRandoms, ad_numRandoms);

        var prev_track_muted = curr_track.muted;
        curr_track.src = ads[ad_index].path;
	    curr_track.load();
	    curr_track.addEventListener("ended", nextTrack);
		
        play();
        if (prev_track_muted == true) {
            pause();
        }
    }
    else if (comingNext == 3) {
		if (playAds) {
			comingNext = Math.floor(Math.random() * 2) + 1; //random integer from 1 to 2
		}
		else {
			comingNext = 1;
		}
		
		date = new Date();
		curr_time = (date.getHours()<10?'0':'') + date.getHours() + ":" + (date.getMinutes()<10?'0':'') + date.getMinutes();
		
		var found_time = false;
		var hour;
		var min;
		for (let i = 0; i < time.length; i = i + 2) {
			hour = parseInt(time[i].time.split(':')[0]);
			min = parseInt(time[i].time.split(':')[1]);
			if (hour == date.getHours()) {
				
				if (date.getMinutes() >= 57 && date.getMinutes() <= 59) {
					time_index = i+2;
					if (hour == 23) {
						time_index = 0;
					}
				}
				else if (date.getMinutes() >= 0 && date.getMinutes() <= 3) {
					time_index = i;
				}
				else if (date.getMinutes() >= 27 && date.getMinutes() <= 33) {
					time_index = i+1;
				}
				
				if (time_index != -1) {
					if (prev_time != time[time_index].time) {
						prev_time = time[time_index].time;
						found_time = true;
						break;
					}
				}
			}
		}
		
		if (found_time) {
			var prev_track_muted = curr_track.muted;
			curr_track.src = time[time_index].path;
			curr_track.load();
			curr_track.addEventListener("ended", nextTrack);
			
			play();
			if (prev_track_muted == true) {
				pause();
			}
		}
		else {
			nextTrack();
		}
    }
	else {
		if (tracksAreRandom) {
			track_index = makeUniqueRandom(uniqueRandoms, numRandoms);
		}
		else {
			if (track_index < playlist.length - 1)
			  track_index += 1;
			else track_index = 0;
		}
	
        var prev_track_muted = curr_track.muted;
	    loadTrack(track_index);
        
        play();
        if (prev_track_muted == true) {
            pause();
        }
    }
}

/*
Function indicating if we need to call play/pause function.
*/
function playPause() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

/*
Starts the stream.
*/
function play() {
    curr_track.play();
    isPlaying = true;
    curr_track.muted = false;
    songDescription.style.display = "block";
    liveSongPlaying.innerHTML = playlist[track_index].artist + " - " + playlist[track_index].name;
    playPauseButton.innerHTML = '<i class="fas fa-stop"></i>';
}

/*
Pauses the stream.
*/
function pause() {
    // curr_track.pause();
    curr_track.muted = true;
    isPlaying = false;
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
}

/*
Generates random numbers.
*/
function makeUniqueRandom(numbers, random_num) {
    // Refill the array if needed
    if (!numbers.length) {
        for (var i = 0; i < random_num; i++) {
            numbers.push(i);
        }
    }
    var index = Math.floor(Math.random() * numbers.length);
    var val = numbers[index];
    // Now remove that value from the array
    numbers.splice(index, 1);
    return val;
}