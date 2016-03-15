const electron = require('electron');
var ipcRenderer = require('electron').ipcRenderer;
var remote = require("remote");

var _ = require('lodash');
var expandHomeDir = require('expand-home-dir')
var fs = require('fs-extra');
var gm = require('gm'); // GraphicsMagick 
var path = require('path');
var wrench = require('wrench');

var config = require('../config.json');
var logger = require('../lib/logger');

var ssDir = expandHomeDir(config.slideshowDirectory),
	sdMP = expandHomeDir(config.sdCardMountPoint);

// config.sdCardMountPoint
// size.width, size.height -- use for resizing

var message = document.getElementById('message');

document.getElementById('cancel').addEventListener('click', function (e) {
	ipcRenderer.send('close-import-window');
});

document.getElementById('ok').addEventListener('click', function (e) {
	fs.ensureDirSync(ssDir);
	var photoPath, photosToCopy = [];
	try {
		// see if there's a DCIM path
		fs.accessSync(path.join(sdMP, 'DCIM'), fs.R_OK);
		photoPath = path.join(sdMP, 'DCIM');
	} catch (err) {
		// either sdCardMountPoint doesn't exist (but we tested for that in index.js)
		// or we don't have read access to it
		console.log(err);
		photoPath = sdMP;
	}

	_.each(wrench.readdirSyncRecursive(sdMP), function (file) {
		// build the list of files to copy
		var f = file.toLowerCase(),
			fqname = path.join(photoPath, file);
		if ((path.extname(f) === '.jpg' || path.extname(f) === '.jpg') && path.basename(f).charAt(0) !== '.') {
			// copy only JPG files but not those that begin with '.' (hidden/special files)
			photosToCopy.push(fqname);
		}
	});
	if (photosToCopy.length > 0) {
		// now, actually copy them
		_.each(photosToCopy, function (fileToCopy) {
			fs.copySync(fileToCopy, ssDir);
		});

		alert("Copied " + photosToCopy.length + " photos to " + config.slideshowDirectory);
		ipcRenderer.send('close-import-window');
	} else {
		alert("No photos found to copy.");
	}


});

document.addEventListener("keydown", function (e) {
	if (e.keyCode === 123) { // F12
		var window = remote.getCurrentWindow();
		window.toggleDevTools();
	}
});