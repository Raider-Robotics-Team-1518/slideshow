'use strict';

const ipcRenderer = require('electron').ipcRenderer;
var sys = require('sys');
var exec = require('child_process').exec;
var config = require('../config.json');
var defaultDelay = 5;
var fs = require('fs-extra')

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
	fs.ensureDirSync(config.slideshowDirectory);
	fs.readFile(config.slideshowDirectory, function (err, data) {
		if (err) {
			console.log(err);
		}
		if (!data || data.length === 0) {
			alert("There are no pictures in the " + config.slideshowDirectory + "folder!");
			ipcRenderer.send('close-slideshow-options');
		} else {
			var delay = document.getElementById('delay').value || defaultDelay;
			var random = document.getElementById("random").checked ? " - z" : " ";
			exec("feh -Y -x -q -B black -F -Z" + random + "-D " + delay + " " + config.slideshowDirectory, function (error, stdout, stderr) {
				sys.print('stdout: ' + stdout);
				sys.print('stderr: ' + stderr);
				if (error !== null) {
					console.log('exec error: ' + error);
				}
			});
			ipcRenderer.send('close-slideshow-options');
		}
	});

});