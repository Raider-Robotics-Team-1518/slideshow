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

// config.sdCardMountPoint
// size.width, size.height -- use for resizing

var message = document.getElementById('message');

document.getElementById('cancel').addEventListener('click', function (e) {
	ipcRenderer.send('close-remove-window');
});

document.getElementById('ok').addEventListener('click', function (e) {
	if (document.getElementById("confirm").checked) {
		logger.log('DELETING FILES!');
		fs.emptyDir(expandHomeDir(config.slideshowDirectory), function (err) {
			if (!err) logger.log('Files deleted.');
		});
	} else {
		alert('You must check the Are You Sure box.');
	}

});