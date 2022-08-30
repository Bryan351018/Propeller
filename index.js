'use strict';

// Audio context
var ac;

// Soundfont collection name (e.g. FluidR3_GM)
const col_name = "FluidR3_GM";

// Soundfont extension (ogg/mp3)
var sf_ext = "ogg";

// List of initialized instruments
var instruments = {};

// Parsed MIDI contents
var MIDIContents;

// Tuna interface
var tuna;

// Sound state (muted/unmuted)
var sound_enabled = false;

// Get soundfont name of a specific instrument
function getSFName(insName)
{
    // insName: instrument name (e.g. accordion)
    return "soundfonts/" + col_name + "/" + insName + "-" + sf_ext + ".js";
}

// Initialize audio context and tuna interface
function audioCtxInit()
{
    ac = new AudioContext();
    tuna = new Tuna(ac);
}

// Initialize an instrument
function initIns(name)
{
    // Attempt to initialize
    Soundfont.instrument(ac, getSFName(name)).then(
        // Initialization successful
        function(ins)
        {
            // Set instruments array
            instruments[name] = ins;
        }
    ).catch(
        // Initialization failed
        function()
        {
            console.error("Could not initialize " + getSFName(name));
        }
    );
}

// Load and parse a MIDI file into MIDIContents
function loadMIDIFile()
{
    // Get file
    const file = document.getElementById("file-in").files[0];
    console.info("Loading \"" + file.name + "\" (" + file.size + " B)");
    // Check for non-MIDIs
    if (file.type != "audio/midi")
    {
        console.error("The inputted file is not a MIDI file");
        return null;
    }

    // Read file
    file.arrayBuffer().then(
        // Read successful
        function(contents)
        {
            console.log(contents);

            // Must be seperate
            MIDIContents = new Uint8Array(contents);
            MIDIContents = parseMidi(MIDIContents);

            console.info(MIDIContents);
        }
    ).catch(
        // Read failed
        function()
        {
            console.error("Failed to read MIDI file");
        }
    );
}

// Download a file (https://stackoverflow.com/questions/54626186/how-to-download-file-with-javascript)
function downloadURI(uri, name)
{
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
    link.remove();
}

// Parse MIDIContents and generate a downloadable MIDI File
function saveMIDIFile(name)
{
    let rectifiedArray = new Uint8Array(writeMidi(MIDIContents));
    console.log(rectifiedArray);

    let blob = new File([rectifiedArray], {type: "audio/midi"});
    console.info(blob);
    saveAs(blob, name);
}

// Toggle the mute/unmute button in the navbar
function toggleMute()
{
    // Get element
    var ind = document.getElementById("sound-toggle");

    // Toggle
    if (!sound_enabled)
    {
        // Unmute
        if (!ac)
        {
            audioCtxInit();
        }
        else
        {
            ac.resume();
        }

        ind.setAttribute("class", "bi bi-volume-up-fill");
        sound_enabled = true;
    }
    else
    {
        // Mute
        ac.suspend();
        ind.setAttribute("class", "bi bi-volume-mute");
        sound_enabled = false;
    }
}

window.onload = function()
{
    loadNavs();

}
