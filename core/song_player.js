'use strict';

/* === CONTEXT SETUP === */

// List of initialized instruments
var instruments = [];

// Audio context
var ac;

// Tuna interface
var tuna;

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

// Initialize an instrument on a specific channel
function initIns(name, channel)
{
    return new Promise(function(resolve, reject)
    {
        // Attempt to initialize
        Soundfont.instrument(ac, getSFName(name)).then(
            // Initialization successful
            function(ins)
            {
                // Set instruments array
                instruments[channel] = {player: ins, instances: []};
                resolve("Successfully initialized " + getSFName(name) + ` as instruments[${channel}].player`);
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


/* === PLAYER === */

// Beats per minute
var BPM = 120;

// Current tick number (audible, uneven increments present)
var aud_cur_tick = 0;

// Delta T arrays for each track
var deltaT = [];

// Event index for each track
var evInd = [];

// The micro- inverse
const MICRO_INV = 10e5;

// Is playing flag
var is_playing = false;

// Microseconds/beat to seconds/tick
// Parameters: (microseconds per beat, ticks per beat)
function mu_s_beat_to_s_tick(mu_s_beat, tick_beat)
{
    return ((mu_s_beat / MICRO_INV) / tick_beat);
}

// Microseconds/beat to beats/minute, aka BPM
function mu_s_beat_to_bpm(mu_s_beat)
{
    return 1 / (mu_s_beat / MICRO_INV) * 60;
}

// Resolve after a certain delay, part of score_play()
function resolve_after(time)
{
    return new Promise(function(resolve)
    {
        setTimeout(function()
        {
            resolve(`Delayed successfully for ${time} ms`);
        }, time);
    })
}

// Play score
async function score_play()
{
    is_playing = true;

    // Contents to play
    const contents = current_project.midi_contents;

    // Wait time (seconds) per tick
    var unit_wait_time = 0.5; // Default playing speed: 120 BPM
    console.log(unit_wait_time);

    // Initialize event index array with 0's
    for (var i = 0; i < contents.header.numTracks; i++)
    {
        evInd.push(0);
    }

    // For each track
    for (var track of contents.tracks) // "track_num" is an index here
    {
        // Initialize the delta T array
        deltaT.push(track[0].deltaTime);
    }

    // Least delta T
    var leastdT;
    // Track indexes containing least delta time values
    var ldT_indexes = [];
    // Current event
    var cur_event;

    // Loop if the song is playing
    while (is_playing)
    {
        console.log(`Tick ${aud_cur_tick}`);

        // Calculate least delta T
        leastdT = Number.MAX_SAFE_INTEGER;
        // For each element in delta T array
        for (var item_ind in deltaT)
        {
            // If a new item has less delta T
            if (deltaT[item_ind] < leastdT)
            {
                // Set the indexes and least delta T
                ldT_indexes = [item_ind];
                leastdT = deltaT[item_ind]
                continue;
            }

            // If a new item has the same delta T
            if (deltaT[item_ind] == leastdT)
            {
                // Push a new item to indexes
                ldT_indexes.push(item_ind);
            }
        }

        // If leastdT is non-zero
        if (leastdT)
        {
            // Subtract all items by least delta time
            for (var i in deltaT)
            {
                deltaT[i] -= leastdT;
            }

            // Add current tick number
            aud_cur_tick += leastdT;

            // Wait
            await resolve_after(leastdT * unit_wait_time * 1000);
        }
        // If leastdT is zero
        else
        {
            // For each track that had the least delta time values
            for (var index of ldT_indexes)
            {
                cur_event = contents.tracks[index][evInd[index]];

                // ===== EVENT PROCESSING =====
                switch (cur_event?.type)
                {
                    // Tempo change
                    case "setTempo":
                        // Recalculate unit wait time
                        unit_wait_time = mu_s_beat_to_s_tick(cur_event.microsecondsPerBeat, contents.header.ticksPerBeat);
                        BPM = mu_s_beat_to_bpm(cur_event.microsecondsPerBeat);
                        break;

                    case "programChange":
                        await initIns(getSfInstName(inst_info[cur_event.programNumber].instrument), index);
                        break;

                    case "noteOn":
                        instruments[index].instances[cur_event.noteNumber] = instruments[index].player.start(cur_event.noteNumber, ac.currentTime, {gain: cur_event.velocity / 127});
                        break;

                    case "noteOff":
                        instruments[index].instances[cur_event.noteNumber].stop();
                        break;

                    default:
                        if (cur_event)
                        {
                            console.warn(`Event "${cur_event.type}" was unhandled`);
                        }
                        break;
                }

                console.log(`Track ${index}: `, cur_event);

                // Increment event index
                evInd[index]++;

                // Recalculate delta T
                deltaT[index] = contents.tracks[index][evInd[index]]?.deltaTime;
            }
        }
    }
}

// Stop score
function score_stop()
{
    is_playing = false;
    aud_cur_tick = 0;
}