'use strict';

const ipcRenderer = require('electron').ipcRenderer;
var remote = require("remote");

var exec = require('child_process').exec;
var expandHomeDir = require('expand-home-dir')
var fs = require('fs-extra');
var path = require('path');
var sys = require('sys');

var defaultDelay = 5;
var config = require('../config.json');
var logger = require('../lib/logger');

document.getElementById('cancel').addEventListener('click', function (e) {
	ipcRenderer.send('close-slideshow-options');
});

/*
 	Runs the "feh" screensaver command to start the slideshow. The basic command format will be:
 		feh -Y -x -q -D 5 -B black -F -Z -z -r /media/

	 from http://www.instructables.com/id/Easy-Raspberry-Pi-Based-ScreensaverSlideshow-for-E/?ALLSTEPS#step7
	 -Z Auto Zoom
	 -x Borderless
	 -F Fullscreen
	 -Y hide pointer
	 -B image background
	 -q quiet no error reporting
	 -z Randomise
	 -r Recursive search all folders in folders
	 -D Slide delay in seconds
*/

document.getElementById('ok').addEventListener('click', function (e) {
	fs.ensureDirSync(expandHomeDir(config.slideshowDirectory));
	if (countFilesInDirectory(expandHomeDir(config.slideshowDirectory))) {
		var delay = document.getElementById('delay').value || defaultDelay;
		var random = document.getElementById("random").checked ? " - z" : " ";
		exec("feh -Y -x -q -B black -F -Z" + random + "-D " + delay + " " + expandHomeDir(config.slideshowDirectory), function (error, stdout, stderr) {
			sys.print('stdout: ' + stdout);
			sys.print('stderr: ' + stderr);
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		});
		ipcRenderer.send('close-slideshow-options');
	} else {
		alert("There are no pictures in the " + expandHomeDir(config.slideshowDirectory) + " folder!");
		ipcRenderer.send('close-slideshow-options');
	}
});

document.addEventListener("keydown", function (e) {
	if (e.keyCode === 123) { // F12
		var window = remote.getCurrentWindow();
		window.toggleDevTools();
	}
});

function countFilesInDirectory(dir) {
	exec('ls -A ' + dir + ' | wc -l', function (error, stdout, stderr) {
		if (!error) {
			var numberOfFilesAsString = stdout.trim();
			console.log("There are " + numberOfFilesAsString + " files in " + dir);
			return numberOfFilesAsString;
		} else {
			throw error;
		}
	});
}