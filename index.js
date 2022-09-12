'use strict';

// Soundfont collection name (e.g. FluidR3_GM)
const col_name = "FluidR3_GM";

// Soundfont extension (ogg/mp3)
var sf_ext;
// Automatic extension selection
if (document.getElementById("audio-format-test").canPlayType("audio/ogg"))
{
    sf_ext = "ogg";
}
else
{
    sf_ext = "mp3";
}

// Parsed MIDI contents
var MIDIContents;

// Sound state (muted/unmuted)
var sound_enabled = false;

// Load and parse a MIDI file into MIDIContents, then call a function on success
function loadMIDIFile(call_func)
{
    return new Promise(function(resolve, reject)
    {
        // Get file
        const file = document.getElementById("file-in").files[0];
        console.info("Loading \"" + file.name + "\" (" + file.size + " B)");
        // Check for non-MIDIs
        if (file.type != "audio/midi")
        {
            console.error("The inputted file is not a MIDI file");
            reject("The inputted file is not a MIDI file");
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

                // Call the function
                call_func.call();
                resolve("MIDI file loaded successfully");
            }
        ).catch(
            // Read failed
            function()
            {
                console.error("Failed to read MIDI file");
                reject("Failed to read MIDI file");
            }
        );
    });
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

// Set state of progress bar
function setProgress(value, vmin, vmax, visible, message)
{
    var barEl = document.getElementById("progress");
    var txtEl = document.getElementById("progress-txt");

    // Set percentage
    const val = ((value - vmin) / (vmax - vmin) * 100).toFixed(3) + "%";
    barEl.firstElementChild.style.width = val;
    barEl.firstElementChild.textContent = val;
    txtEl.textContent = message;

    // Set visibility
    if (visible)
    {
        txtEl.style.display = "inline-block";
        barEl.style.display = "flex";
    }
    else
    {
        txtEl.style.display = "none";
        barEl.style.display = "none";
    }

    barEl.setAttribute("aria-valuenow", value);
    barEl.setAttribute("aria-valuemin", vmin);
    barEl.setAttribute("aria-valuemax", vmax);
}

// Automatically initialize components on window load
window.onload = function()
{
    loadNavs();
    createCurChDisp();
    updateCurChDisp();
    setProgress(0, 0, 0, false, "");
}
