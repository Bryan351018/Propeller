# Propeller
## A web-based, MIDI-compliant Digital Audio Workstation
Inspired by "Domino", a similar Digital Audio Workstation that I have used in the past.

### Video Demo: https://youtu.be/VZztzfJfDZ4


### File Hierarchy
+ configs/: configuration files
	+ instrument_info.js: MIDI instrument configs
	+ navbar_bindings.js: Navigation bar configs
+ core/: files to load and edit the Propeller project at a higher level
	+ song_model.js: The structure of a Propeller project, and import/export functions
	+ song_player.js: Governs playing of MIDI data
+ helpers/: sets up some components
	+ interfaces/: Scripts and styles for some Propeller interfaces
		+ common.js: Constants and variables that the components share
		+ current_channel_display_nocanvas.css: Styling for the current channel display
		+ current_channel_display_nocanvas.js: Script for the current channel display
		+ main_editor_window.js: Script for the main editor window
		+ master_track_view.css: Styling for the master track view
		+ master_track_view.js: Script for the master track view
		+ top_piano.js: Script for the top piano
	+ inst_info_interpreter.js: Makes readinng configs/instrument_info.js easier
	+ nav_bar_loader.js: Loads the navigation bar from configs/navbar_bindings.js
+ libs/: 3rd party libraries
+ soundfonts/: soundfonts (i.e. sound files and javascript files that determine the sound of MIDI notes), will be removed in the future for the ability to upload custom soundfonts
+ index.css: Styling for the index page
+ index.html: The index page (i.e. the HTML file to visit in the web browser to use the application)
+ index.js: Scripts for the index page
+ README.md: This file

### Design Choices
While researching the libraries available, I found [MIDI.js](https://github.com/mudcube/MIDI.js). Its tutorial works, but it is very undocumented and a little hard to use. So, I resorted to using other libraries.


### Libraries Used
+ soundfont-player
+ midi-file
+ FileSaver.js
+ tuna
+ Bootstrap
+ p5.js
+ hammer.js
