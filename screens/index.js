const electron = require('electron');
const app = electron.app;
const ipcRenderer = require('electron').ipcRenderer;

var electronScreen = electron.screen;
var exec = require('child_process').exec;
var fs = require('fs-extra')
var path = require('path');
var remote = require("remote");
var size = electronScreen.getPrimaryDisplay().workAreaSize;
var sys = require('sys');
var busy, child;

var config = require('../config.json');
var logger = require('../lib/logger');


/*
 * Start the slideshow
 * Steps:
 * 		1. Check that pictures exist in the slideshow folder. If not, warn & return to main screen
 * 		2. Prompt them for options: delay, randomize
 * 		3. Start the `feh` command
 */
var startSlideshow = document.getElementById('startSlideshow');
startSlideshow.addEventListener("click", function () {
	ipcRenderer.send('open-slideshow-options');
});


/*
 * Import pictures
 * Steps:
 * 		1. Check if card is mounted,
 * 			if not, prompt them to insert the card and click continue, wait
 * 		2. Prompt to remove old files first or just add new files
 * 		3. Scan card for photos, looking first in root directory, then in subfolders of DCIM
 * 		4. Build an array of photos (fully-qualified paths and file names) to import
 * 		5. If choice was to remove old photos, delete all from config.slideshowDirectory
 * 		6. If choice was to just copy, get list of existing photos then do an _.difference() to get an array of just the new photos
 * 		7. array.forEach(), resize each, save to config.slideshowDirectory
 * 		8. Unmount the sd card
 * 		9. Prompt them that it’s done, remove the card
 */
var importPictures = document.getElementById('importPictures');
importPictures.addEventListener("click", function () {
	// check if card is mounted
	try {
		fs.accessSync(config.sdCardMountPoint, fs.R_OK);
	} catch (err) {
		alert("Make sure the SD card is inserted");
		return;
	}
	ipcRenderer.send('open-import-window');
});

/*
 * Delete old pictures
 * Steps:
 * 		1. Scan config.slideshowDirectory to get a count of photos. If none exist, or directory doesn't exist, tell them then return
 * 		2. Prompt them "Are you sure you want to delete NN photos? There's no undo!"
 * 		3. If yes, wrench.recursiveDelete(config.slideshowDirectory)
 */
// var deletePhotos = document.getElementById('deletePhotos');
// deletePhotos.addEventListener("click", function () {
// 	ipcRenderer.send('open-remove-window');
// });


/*
 * Eject button
 */
var btnEject = document.getElementById('btnEject');
btnEject.addEventListener('click', function () {
	if (busy) {
		alert("I'm busying copying or deleting. I can't eject the SD card now. Please wait.");
	} else {
		unmountCard();
		busy = undefined;
	}
});

function unmountCard() {
	var sdCardName = getSDCardName;
	if (!sdCardName) {
		return;
	}
	child = exec("umount " + path.join(config.sdCardMountPoint, sdCardName), function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
		sys.print('stderr: ' + stderr);
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
}

function getSDCardName() {
	if (config.cameraCardName && fs.existsSync(path.join(config.sdCardMountPoint, config.cameraCardName))) {
		// if user has defined a camera card name and it exists, return it
		return config.cameraCardName;
	}
	var possibleSDCards = fs.readdirSync(config.sdCardMountPoint);
	if (!possibleSDCards || possibleSDCards.length === 0) {
		alert('No SD card mounted');
		return false;
	} else if (possibleSDCards.length > 1) {
		alert('Only one camera card can be inserted at a time.');
		return false;
	} else {
		return possibleSDCards[0];
	}
}

// Quit button - not working so commented out
// var quitButton = document.getElementById('btnQuit');
// quitButton.addEventListener("click", function () {
// 	console.log('index.js - sending quit message');
// 	// ipcRenderer.send('close-main-window');
// });
document.addEventListener("keydown", function (e) {
	if (e.keyCode === 123) { // F12
		var window = remote.getCurrentWindow();
		window.toggleDevTools();
	}
});