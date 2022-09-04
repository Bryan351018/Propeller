'use strict';

// Current project
var current_project =
{
    name: "untitled",
    midi_contents: null
};

// Set MIDI Contents in project
function proj_set_MIDI()
{
    current_project.midi_contents = MIDIContents;
}

// Export MIDI Contents from project
function proj_export_MIDI()
{
    MIDIContents = current_project.midi_contents;
    saveMIDIFile(current_project.name + ".mid");
}
