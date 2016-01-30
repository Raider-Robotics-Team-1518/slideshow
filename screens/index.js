const electron = require('electron');
const app = electron.app;
const ipcRenderer = require('electron').ipcRenderer;

var electronScreen = electron.screen;
var exec = require('child_process').exec;
var fs = require('fs-extra')
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
var deletePhotos = document.getElementById('deletePhotos');
deletePhotos.addEventListener("click", function () {
	ipcRenderer.send('open-remove-window');
});









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
	child = exec("umount " + config.sdCardMountPoint, function (error, stdout, stderr) {
		// sys.print('stdout: ' + stdout);
		// sys.print('stderr: ' + stderr);
		if (error !== null) {
			logger.log('exec error: ' + error);
		}
	});
}

// Quit button - not working so commented out
var quitButton = document.getElementById('btnQuit');
quitButton.addEventListener("click", function () {
	logger.log('index.js - sending quit message');
	// ipcRenderer.send('close-main-window');
});