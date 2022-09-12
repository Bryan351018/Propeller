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
1. While researching the libraries available, I found [MIDI.js](https://github.com/mudcube/MIDI.js). Its tutorial works, but it is very undocumented and a little hard to use. So, I resorted to using other libraries.
2. MIDI playing was more complicated than I expected, since each tick in MIDI files are usually shorter than 2 miliseconds, so short that setTimeout() in JavaScript could not handle. So, I compensated this by dynamically stepping the shortest tick available, to be most performant and not miss events.
3. AudioContext, which allows arbitrary playing of sounds in a browser, requires manual user action like clicks to be initialized. So, I added a mute button on the top-right corner of the page.

### Plans
- [ ] Fix tick display bug
- [ ] Fix parallel loading bug
- [ ] Add support for playback speed change
- [ ] Add support for marker display

### Libraries Used
+ [soundfont-player](https://github.com/danigb/soundfont-player)
	+ This allows me to play sounds from MIDI data according to a soundfont
+ [midi-file](https://github.com/carter-thaxton/midi-file)
    + This allows me to convert between raw MIDI file bytes from an ArrayBuffer, and a format more readable for JavaScript
+ [FileSaver.js](https://github.com/eligrey/FileSaver.js)
    + This makes things easy when downloading files, when saving projects and exporting MIDI or sound files
+ [tuna](https://github.com/Theodeus/tuna)
    + This is an audio effects library that gives support to MIDI controller events, like reverb, delay, and such
+ [Bootstrap](https://getbootstrap.com/)
    + Bootstrap makes things easier and cleaner when creating UI in an HTML page
+ [p5.js](https://p5js.org/)
    + p5.js is used in canvas-driven components (e.g. top piano and main editor) to not deal with lots of CSS positioning attributes
+ [hammer.js](http://hammerjs.github.io/)
    + hammer.js allows gesture detection on mobile devices
