'use strict';

// Top piano variables

// Canvas sizes
const top_piano_width = window.innerWidth / 3;
const top_piano_height = window.innerHeight / 30;

// Note active states (all false by default)
var top_piano_active_notes = Array.apply(null, Array(MIDI_NC)).map(() => {return false;});
// Top piano event queue
// Send in things like {note: 50, active: true}, {note: 55, active: false},
// or {clear: true} to reset the keyboard
var topPEQueue = [];

// p5.js canvas display sketch for top piano
const top_piano = (sketch) => {

    // Configurable parameters
    const black_to_white_p = 0.6; // Black to white key height proportion (e.g. 0.7 for 70%)
    const border_weight = 0.5; // Border thickness (between keys)
    const border_color = "black"; // Border color (between keys)

    // Calculate key parameters
    const unit_width = top_piano_width / MIDI_NC; // Unit width that applies to all keys
    const white_key_h = top_piano_height; // White key height
    const black_key_h = white_key_h * black_to_white_p; // Black key height

    // Function to render a key
    function drawKey(index)
    {
        // Draw polygons
        sketch.beginShape();
        sketch.vertex(index * unit_width, 0);
        sketch.vertex((index + 1) * unit_width, 0);

        switch (index % 12)
        {
            // White keys: extended right
            case 0:
            case 5:
                sketch.vertex((index + 1) * unit_width, black_key_h);
                sketch.vertex((index + 1.5) * unit_width, black_key_h);
                sketch.vertex((index + 1.5) * unit_width, white_key_h);
                sketch.vertex(index * unit_width, white_key_h);
                break;

            // White keys: extended left
            case 4:
            case 11:
                sketch.vertex((index + 1) * unit_width, white_key_h);
                sketch.vertex((index - 0.5) * unit_width, white_key_h);
                sketch.vertex((index - 0.5) * unit_width, black_key_h);
                sketch.vertex(index * unit_width, black_key_h);
                break;

            // White keys: extended left and right
            case 2:
            case 7:
            case 9:
                sketch.vertex((index + 1) * unit_width, black_key_h);
                sketch.vertex((index + 1.5) * unit_width, black_key_h);
                sketch.vertex((index + 1.5) * unit_width, white_key_h);
                sketch.vertex((index - 0.5) * unit_width, white_key_h);
                sketch.vertex((index - 0.5) * unit_width, black_key_h);
                sketch.vertex(index * unit_width, black_key_h);
                break;


            // Black keys
            default:
                sketch.vertex((index + 1) * unit_width, black_key_h);
                sketch.vertex(index * unit_width, black_key_h);
                break;
        }
        sketch.endShape(sketch.CLOSE);
    }

    // Set default key color
    function setDefKeyColor(index)
    {

        // Set fill to key color
        switch (index % 12)
        {
            // Black keys
            case 1:
            case 3:
            case 6:
            case 8:
            case 10:
                sketch.fill("black");
                break;

            // White keys
            default:
                sketch.fill("white");
                break;
        }

    }

    // Initialize/reset top keyboard
    function topKbdInit()
    {
        // Set white background
        sketch.background("white");
        // Set border
        sketch.strokeWeight(border_weight);
        sketch.stroke(border_color);

        // Draw keys
        for (var i = 0; i < MIDI_NC; i++)
        {
            setDefKeyColor(i);
            drawKey(i);
        }
    }

    // Setup
    sketch.setup = () => {
        // Create canvas
        sketch.createCanvas(top_piano_width, top_piano_height);
        topKbdInit();
    };

    // Draw loop
    sketch.draw = () => {
        // Temporary note number to toggle
        var temp_pack;

        // Iterate the toggle queue
        for (var i = 0; i < topPEQueue.length; i++)
        {
            // Change note states
            temp_pack = topPEQueue.shift()
            console.log(temp_pack);

            // If instructed to clear the keyboard
            if (temp_pack.clear)
            {
                // Clear it
                topKbdInit();
                break;
            }
            else
            {
                top_piano_active_notes[temp_pack.note] = temp_pack.active;

                // Render notes
                if (!top_piano_active_notes[temp_pack.note])
                {
                    // Note off, default colors
                    setDefKeyColor(temp_pack.note);
                }
                else
                {
                    // Note off, fill red
                    sketch.fill("red");
                }

                drawKey(temp_pack.note);
            }
        }
    };
};

// Run top piano sketch on canvas
let top_piano_inst = new p5(top_piano, document.getElementById("top-piano"));
