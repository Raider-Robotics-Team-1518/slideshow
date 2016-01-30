const ipcRenderer = require('electron').ipcRenderer;
exports.log = function (msg) {
	ipcRenderer.send('log', msg);
}