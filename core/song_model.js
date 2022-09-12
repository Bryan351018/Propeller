'use strict';

// Current project
var current_project =
{
    name: "untitled",
    initialized: false, // Is the project initialized
    instrument_bank: [], // Instruments used by each track
    time_sigs: [], // List of time signatures and their locations, e.g. {top: 4, bottom: 4, at: 480},
                   // where "at" is in ticks
    midi_contents: null
};

// Initialize an instrument on a specific key
function initIns(loc, name, key)
{
    return new Promise(function(resolve, reject)
    {
        // Attempt to initialize
        Soundfont.instrument(ac, getSFName(name)).then(
            // Initialization successful
            function(ins)
            {
                // Set array specified in "loc"
                loc[key] = {player: ins, instances: []};
                resolve("Successfully initialized " + getSFName(name) + ` as ${loc}[${key}].player`);
            }
        ).catch(
            // Initialization failed
            function()
            {
                reject("Could not initialize " + getSFName(name));
            }
        );
    })
}

// Set MIDI Contents in project
function proj_set_MIDI()
{
    current_project.midi_contents = MIDIContents;
}

// Walk through MIDI data in an imported file
async function midi_pass_set()
{
    var tempInsBank = []; // Temporary instrument bank
    var tempTickNum = 0; // Temporary tick number

    // For each track
    for (var track_num in current_project.midi_contents.tracks)
    {
        // Set current tick number for the track
        tempTickNum = 0;

        // Set progress bar
        setProgress(track_num, 0, current_project.midi_contents.header.numTracks - 1, true, "Loading");

        // For each event
        for (var event of current_project.midi_contents.tracks[track_num])
        {
            // Advance current tick number
            tempTickNum += event.deltaTime;

            switch (event.type)
            {
                // Program change: register instrument bank
                case "programChange":
                    // If the instrument has not already been cached
                    if (!tempInsBank[event.programNumber])
                    {
                        // Cache the instrument
                        await initIns(tempInsBank, getSfInstName(inst_info[event.programNumber].instrument), event.programNumber);
                    }
                    break;

                // Time signature event: load time signatures
                case "timeSignature":
                    current_project.time_sigs.push({top: event.numerator, bottom: event.denominator, at: tempTickNum});
                    break;

                default:
                    break;
            }
        }

        // If the temporary bank is empty
        if (!tempInsBank.length)
        {
            // Initialize a piano
            initIns(tempInsBank, getSfInstName(inst_info[0].instrument), 0);
        }

        // Store the cached instrument banks in project
        current_project.instrument_bank[track_num] = tempInsBank;
        // Prepare the temporary bank for the next project
        tempInsBank = [];
    }

    console.info("Pass finished");
    current_project.initialized = true;
    setProgress(0, 0, 0, false, "");
}

// Export MIDI Contents from project
function proj_export_MIDI()
{
    MIDIContents = current_project.midi_contents;
    saveMIDIFile(current_project.name + ".mid");
}
