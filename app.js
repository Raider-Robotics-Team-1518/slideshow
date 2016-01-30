'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

var ipc = require("electron").ipcMain;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 600,
		height: 300,
		resizable: false,
		'accept-first-mouse': true,
		'title-bar-style': 'hidden',
		title: 'Slideshow',
		backgroundColor: '#fff'
	});

	// and load the index.html of the app.
	mainWindow.loadURL('file://' + __dirname + '/screens/index.html');

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

/*
 *	SLIDESHOW OPTIONS WINDOW FUNCTIONS
 */
var slideshowOptionsWindow;
ipc.on('open-slideshow-options', function () {
	console.log('open-slideshow-options');
	if (slideshowOptionsWindow) {
		return;
	}

	slideshowOptionsWindow = new BrowserWindow({
		frame: false,
		height: 300,
		resizable: false,
		width: 400
	});

	slideshowOptionsWindow.loadURL('file://' + __dirname + '/screens/startSlideshow.html');

	slideshowOptionsWindow.on('closed', function () {
		slideshowOptionsWindow = undefined;
	});
});

ipc.on('close-slideshow-options', function () {
	console.log('close-slideshow-options');
	if (slideshowOptionsWindow) {
		slideshowOptionsWindow.destroy();
		slideshowOptionsWindow = undefined;
	} else {
		console.log('slideshowOptionsWindow does not exist');
	}
});

/*
 *	IMPORT WINDOW FUNCTIONS
 */
var importWindow;
ipc.on('open-import-window', function () {
	console.log('open-import-window');
	if (importWindow) {
		return;
	}

	importWindow = new BrowserWindow({
		frame: false,
		height: 300,
		resizable: false,
		width: 400
	});

	importWindow.loadURL('file://' + __dirname + '/screens/import.html');

	importWindow.on('closed', function () {
		importWindow = undefined;
	});
});

ipc.on('close-import-window', function () {
	console.log('close-import-window');
	if (importWindow) {
		importWindow.destroy();
		importWindow = undefined;
	} else {
		console.log('import window does not exist');
	}
});

/*
 *	REMOVE PHOTOS WINDOW FUNCTIONS
 */
var removeWindow;
ipc.on('open-remove-window', function () {
	console.log('open-remove-window');
	if (removeWindow) {
		return;
	}

	removeWindow = new BrowserWindow({
		frame: false,
		height: 300,
		resizable: false,
		width: 400
	});

	removeWindow.loadURL('file://' + __dirname + '/screens/remove.html');

	removeWindow.on('closed', function () {
		removeWindow = undefined;
	});
});

ipc.on('close-remove-window', function () {
	console.log('close-remove-window');
	if (removeWindow) {
		removeWindow.destroy();
		removeWindow = undefined;
	} else {
		console.log('removeWindow does not exist');
	}
});


/*
 * LOGGER IPC FUNCTION
 */

ipc.on('log', function (event, msg) {
	if (typeof msg === 'string') {
		console.log(msg);
	} else {
		console.log(JSON.stringify(msg));
	}
});

ipc.on('close-main-window', function () {
	console.log('quitting...');
	app.quit();
});