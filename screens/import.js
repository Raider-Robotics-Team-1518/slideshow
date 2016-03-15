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
		fs.accessSync(sdMP, fs.R_OK);
	} catch (err) {
		// either sdCardMountPoint doesn't exist (but we tested for that in index.js)
		// or we don't have read access to it
		console(log);
		return;
	}

	_.each(wrench.readdirSyncRecursive(photoPath), function (file) {
		var f = file.toLowerCase(),
			fqname = path.join(photoPath, file);
		if ((path.extname(f) === '.jpg' || path.extname(f) === '.jpg') && path.basename(f).charAt(0) !== '.') {
			photosToCopy.push(path.basename(file));
			var width, height;
			gm(fqname).size(function (err, value) {
				width = value.width;
				height = value.height;
			});
			if (width > height) {
				// landscape oriented photos, resize to screen width
				gm(fqname)
					.resize(screen.width)
					.quality(70)
					.autoOrient()
					.write(path.join(ssDir, path.basename(file)), function (err) {
						if (err) {
							console(JSON.stringify(err));
						}
					});
			} else {
				gm(fqname)
					.resize(null, screen.height)
					.quality(70)
					.autoOrient()
					.write(path.join(ssDir, path.basename(file)), function (err) {
						if (err) {
							console(JSON.stringify(err));
						}
					});
			}

		}
	});
	if (photosToCopy.length > 0) {
		alert("Copied " + photosToCopy.length + " photos to " + config.slideshowDirectory);
		ipcRenderer.send('close-import-window');
	} else {
		alert("Something went wrong");
	}


});

document.addEventListener("keydown", function (e) {
	if (e.keyCode === 123) { // F12
		var window = remote.getCurrentWindow();
		window.toggleDevTools();
	}
});