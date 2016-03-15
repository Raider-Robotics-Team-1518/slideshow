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

// read in the configuration details to get the base paths
var ssDir = expandHomeDir(config.slideshowDirectory),
	sdMP = expandHomeDir(config.sdCardMountPoint);

console.log('ssDir: ' + ssDir + ' exists: ' + fs.existsSync(ssDir));
console.log('sdMP: ' + sdMP + ' exists: ' + fs.existsSync(sdMP));

// figure out the SD card's name
var sdCardName = getSDCardName(),
	sdCardPath;
if (!sdCardName) {
	console.log("No SD card present at " + sdMP);
	ipcRenderer.send('close-import-window');
}

console.log('getSDCardName(): ' + getSDCardName());
console.log('path.join(sdMP, sdCardName): ' + path.join(sdMP, sdCardName));

sdCardPath = path.join(sdMP, sdCardName);

var message = document.getElementById('message');

document.getElementById('cancel').addEventListener('click', function (e) {
	ipcRenderer.send('close-import-window');
});

document.getElementById('ok').addEventListener('click', function (e) {
	fs.ensureDirSync(ssDir);
	var photoPath, photosToCopy = [];
	// see if there's a DCIM path
	if (fs.existsSync(path.join(sdCardPath, 'DCIM'))) {
		console.log('DCIM directory present, adding it to the base path');
		photoPath = path.join(sdCardPath, 'DCIM');
	} else {
		photoPath = sdCardPath;
	}
	console.log('Our source path is: ' + photoPath);
	_.each(wrench.readdirSyncRecursive(photoPath), function (file) {
		// build the list of files to copy
		var f = file.toLowerCase(),
			fqname = path.join(photoPath, file);
		if ((path.extname(f) === '.jpg' || path.extname(f) === '.jpg') && path.basename(f).charAt(0) !== '.') {
			// copy only JPG files but not those that begin with '.' (hidden/special files)
			console.log('Will copy: ' + fqname);
			photosToCopy.push(fqname);
		}
	});
	if (photosToCopy.length > 0) {
		// now, actually copy them
		_.each(photosToCopy, function (fileToCopy) {
			console.log('Copying: ' + fileToCopy);
			fs.copySync(fileToCopy, ssDir, {
				clobber: false
			});
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

function getSDCardName() {
	if (config.cameraCardName && fs.existsSync(path.join(config.sdCardMountPoint, config.cameraCardName))) {
		// if user has defined a camera card name and it exists, return it
		return config.cameraCardName;
	}
	var possibleSDCards = fs.readdirSync(config.sdCardMountPoint);
	if (!possibleSDCards || possibleSDCards.length === 0) {
		alert('No SD card inserted');
		return false;
	} else if (possibleSDCards.length > 1) {
		alert('Only one camera card can be inserted at a time.');
		return false;
	} else {
		return possibleSDCards[0];
	}
}