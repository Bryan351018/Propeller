'use strict';

// Main editor window element
var main_e_window_el = document.getElementById("main-editor-window");
// To determine canvas dimensions...

// Track selector element width
var track_selector_el_width = document.getElementById("track-selector").offsetWidth;
// Navbar height
const navbar_height = document.getElementById("navbar").offsetHeight;
// Toolbar height
const toolbar_height = document.getElementById("toolbar").offsetHeight;
const main_e_window_width = window.innerWidth - track_selector_el_width; // Width of display
const main_e_window_height = window.innerHeight - navbar_height - toolbar_height - window.innerHeight / 6; // Height of display
const time_bar_height = 30; // Height of the bar showing the measure number and marker
const column_height = 100; // Column height (used for piano)

// Global variables to communicate with editor
var unit_width = (main_e_window_height - time_bar_height) / MIDI_NC; // Unit width that applies to all keys
var piano_offset = 0; // Piano vertical offset
var beat_line_off = 0; // Beat line offset
var beat_line_width = 100; // Beat line width
var beat_line_beats_per_meas = 3; // Beats per measure for the beat lines
var piano_roll_width; // Width of the piano roll, initialized in sketch
var piano_roll_height; // Height of the piano roll, initialized in sketch


// p5.js canvas display for the main editor!
const main_editor_window = (sketch) => {
    // Setup
    sketch.setup = () => {
        sketch.createCanvas(main_e_window_width, main_e_window_height);
        sketch.background(50);
        piano_roll_height = main_e_window_height - 50;
        piano_roll_width = main_e_window_width - 50;
    }

    // Configurable parameters
    const black_to_white_p = 0.6; // Black to white key height proportion (e.g. 0.7 for 70%)
    const border_weight = 1; // Border thickness (between keys)
    const border_color = "black"; // Border color (between keys)
    const ed_line_weight = 1; // Editor line weight
    const ed_line_color = 120; // Editor line color (grayscale number)
    const time_bar_fill_color = 30; // Time bar fill color (grayscale number)
    const time_bar_border_color = "black"; // Time bar border color
    const time_bar_border_weight = 1; // Time bar border weight
    const beat_line_color1 = "red"; // Beat line beat 1 color (grayscale number)
    const beat_line_color2 = "yellow"; // Beat line other beats color (grayscale number)
    const beat_line_weight = 1; // Beat line weight


    /* ===== COMPONENT: PIANO ===== */

    // Calculate key parameters

    const white_key_h = column_height; // White key height
    const black_key_h = white_key_h * black_to_white_p; // Black key height

    // Draw a vertex (y, x) to make the piano vertical, with optional shifts (very lazy)
    function vertexReversed(y, x)
    {
        sketch.vertex(x, sketch.height - y + piano_offset);
    }

    // Function to render a key
    function drawKey(index)
    {
        // Draw polygons
        sketch.beginShape();
        vertexReversed(index * unit_width, 0);
        vertexReversed((index + 1) * unit_width, 0);

        switch (index % 12)
        {
            // White keys: extended right
            case 0:
            case 5:
                vertexReversed((index + 1) * unit_width, black_key_h);
                vertexReversed((index + 1.5) * unit_width, black_key_h);
                vertexReversed((index + 1.5) * unit_width, white_key_h);
                vertexReversed(index * unit_width, white_key_h);
                break;

            // White keys: extended left
            case 4:
            case 11:
                vertexReversed((index + 1) * unit_width, white_key_h);
                vertexReversed((index - 0.5) * unit_width, white_key_h);
                vertexReversed((index - 0.5) * unit_width, black_key_h);
                vertexReversed(index * unit_width, black_key_h);
                break;

            // White keys: extended left and right
            case 2:
            case 7:
            case 9:
                vertexReversed((index + 1) * unit_width, black_key_h);
                vertexReversed((index + 1.5) * unit_width, black_key_h);
                vertexReversed((index + 1.5) * unit_width, white_key_h);
                vertexReversed((index - 0.5) * unit_width, white_key_h);
                vertexReversed((index - 0.5) * unit_width, black_key_h);
                vertexReversed(index * unit_width, black_key_h);
                break;


            // Black keys
            default:
                vertexReversed((index + 1) * unit_width, black_key_h);
                vertexReversed(index * unit_width, black_key_h);
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

    // Draw keyboard
    function drawKbd()
    {
        // Temporary output height
        var temp_output_height;

        // Set border
        sketch.strokeWeight(border_weight);
        sketch.stroke(border_color);

        // Draw keys
        for (var i = 0; i < MIDI_NC; i++)
        {
            temp_output_height = sketch.height - ((i + 1) * unit_width) + piano_offset;

            // If the key is in the piano roll
            if (temp_output_height >= time_bar_height && temp_output_height < piano_roll_height)
            {
                setDefKeyColor(i);
                drawKey(i);
            }
        }
    }


    /* ===== COMPONENT: KEYBOARD EDITOR LINES ===== */
    function drawKbdEdLines()
    {
        // Temporary line height
        var temp_line_height;

        sketch.strokeWeight(ed_line_weight);
        sketch.stroke(ed_line_color);
        for (var i = 0; i < MIDI_NC; i++)
        {
            // Check if the line isn't beyond the height of the piano roll
            temp_line_height = sketch.height - unit_width * i + piano_offset;
            if (temp_line_height < piano_roll_height)
            {
                sketch.line(white_key_h, temp_line_height,
                            piano_roll_width, temp_line_height);
            }
        }
    }

    /* ===== COMPONENT: TIME BAR ===== */
    function drawTimeBar()
    {
        // Set appearances
        sketch.fill(time_bar_fill_color);
        sketch.stroke(time_bar_border_color);
        sketch.strokeWeight(time_bar_border_weight);

        // Draw a big bar
        sketch.rect(white_key_h, 0, piano_roll_width - column_height, time_bar_height);
    }

    /* ===== COMPONENT: BEAT LINES ===== */
    function drawBeatLines()
    {
        // Set appearances
        sketch.stroke(beat_line_color1);
        sketch.strokeWeight(beat_line_weight);

        // Draw lines
        for (var x_coord = white_key_h + beat_line_off; x_coord <= piano_roll_width; x_coord += beat_line_width)
        {
            sketch.line(x_coord, 0, x_coord, piano_roll_height);
        }
    }

    /* ===== COMPONENT: SCROLL BARS */
    function drawVertScrollBar()
    {
        // Draws a vertical scroll bar
        
    }

    // Draw loop
    sketch.draw = () => {
        drawKbd();
        drawKbdEdLines();
        drawTimeBar();
        drawBeatLines();
    }
};

let main_editor_window_inst = new p5(main_editor_window, main_e_window_el);
