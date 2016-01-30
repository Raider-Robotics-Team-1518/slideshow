# Slideshow tool for Raspberry Pi

Simple slideshow tool for use by Team 1518 Raider Robotics for their Raspberry Pi-based pit area TV system. 

This tool will copy and automatically resize photos from an SD card to a folder in your home directory. Click a button to start the slideshow. 

## Installation instructions

You will need ImageMagick installed. On the Raspberry Pi, in a terminal, enter:

```shell
sudo apt-get update
sudo apt-get install imagemagick
```

Next, install `feh` and `xscreensaver`:

```
sudo apt-get install feh
sudo apt-get install xscreensaver
```

You'll want to configure the screensaver to make sure it keeps the screen on. 

Choose Start > Preferences > Screensaver. In the blank out time box, enter `720`. This will keep the screensaver running and monitor on for 12 hours.

Now, download the project's files to a folder in your home directory:

```
cd ~
git clone https://github.com/Raider-Robotics-Team-1518/slideshow.git
cd slideshow
```

(If you don't have Git installed, you can download a zip from the GitHub repository then extract it to a folder in your home directory.)

Install the project's dependencies:

```
npm install
```

Configure the app to read and write to the correct folders. Open the app's config.json file in a text editor. Most likely, the `slideshowDirectory` value can be left as-is. You'll need to connect your SD card reader, insert a camera memory card, and figure out the path to that resulting volume. Edit `sdCardMountPoint` to match that.

```
{
	"slideshowDirectory": "~/Documents/slideshow/photos",
	"sdCardMountPoint": "/Volumes/Untitled"
}
```

[instructions here for placing an icon on the desktop]

## Usage instructions

|Function|Description|
|-----|------|
|**Importing Pictures**|1. Insert your camera's memory card. <br/>2. Click **Import pictures from the SD card**.<br/>3. Click **Import**<br/><br/>Existing photos will be overwritten if duplicate file names exist. Photos are resized automatically to your match screen's height and width at 70% JPG quality.|
|**Start Slideshow**|1. Click the **Start the slideshow** button<br/>2. Optionally, edit the display time and whether to show photos randomly or sequentially (based on their name).<br/>3. Click Go!<br/><br/>To stop the slideshow, right click on a picture and choose Exit.|
|**Remove old photos**|_not yet implemented_|




# Credits/License

Written by Tim Poulsen, @skypanther, 2016

License: MIT