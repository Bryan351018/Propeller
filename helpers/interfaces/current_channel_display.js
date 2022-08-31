'use strict';

// Work in Progress 

// Display variables

const cur_ch_disp_width = window.innerWidth / 2; // Width of display
const cur_ch_disp_height = window.innerHeight / 10; // Height of display

// Current channel
var cur_ch = 0;

// Channel effect parameters
var cur_ch_param = {
    vel: 0,
    vol: 100,
    pan: 0,
    expr: 0,
    bend: 0,
    mod: 0,
    hold: 0,
    cutoff: 0,
    reso: 0,
    reverb: 0,
    chorus: 0,
    delay: 0,
    attack: 0,
    decay: 0,
    release: 0
};

// Display updated flag (set this to false to update display)
var disp_updated = false;

const cur_channel_disp = (sketch) => {
    // Display border weight
    const disp_border_weight = 5;
    // Channel number offset
    const ch_num_off = 15;
    // Separater offset
    const sep_off = 10;
    // Separater thickness
    const sep_weight = 1;

    // Setup
    sketch.setup = () => {
        // Create canvas
        sketch.createCanvas(cur_ch_disp_width, cur_ch_disp_height);
        // Set font
        sketch.textFont("Courier New");
    };

    // Effect displays X coordinates
    var drawX;

    // Draws a parameter visualization module at (TLx, TLy), the top-left point
    function drawModule(name, value, minV, maxV, color, TLx, TLy)
    {
        //debugger;
        // Magic anchor height
        const anchorH = sketch.height / 5;
        // Element spacing
        const spacing = 4;

        // Base width
        const baseWidth = sketch.textWidth(name) / 2;

        // Set text properties
        sketch.textSize(anchorH);
        sketch.textAlign(sketch.LEFT, sketch.TOP);

        sketch.fill("lime");
        // Draw text
        sketch.text(name, TLx, TLy + spacing);

        sketch.noFill();
        // Draw box
        sketch.strokeWeight(sep_weight);
        sketch.stroke("white");
        sketch.rect(TLx, TLy + 2 * anchorH, baseWidth, anchorH);

        // If the value could be negative
        if (minV < 0)
        {
            // Place separater right in the middle
            sketch.stroke("grey");
            sketch.line(TLx + baseWidth / 2, TLy + 2 * anchorH + sep_weight,
                        TLx + baseWidth / 2, TLy + 3 * anchorH - sep_weight);

            // Display box
            sketch.noStroke();
            sketch.fill(color);

            if (value > 0)
            {
                // Positive value
                sketch.rect(TLx + baseWidth / 2, TLy + 2 * anchorH,
                            (value / maxV) * baseWidth / 2, anchorH);
            }
            else
            {
                sketch.rectMode(sketch.CORNERS);

                // Negative value
                sketch.rect((TLx + baseWidth / 2) - (Math.abs(value) / Math.abs(minV) * (baseWidth / 2)),
                            TLy + 2 * anchorH,
                            TLx + baseWidth / 2,
                            TLy + 3 * anchorH);


                sketch.rectMode(sketch.CORNER);
            }
        }
        // Else
        else
        {
            // Display box
            sketch.noStroke();
            sketch.fill(color);
            sketch.rect(TLx, TLy + 2 * anchorH, (value / maxV) * baseWidth, anchorH);
        }
        // Value text
        sketch.noStroke();
        sketch.fill("lime");
        sketch.textAlign(sketch.CENTER, sketch.TOP);
        sketch.text(value, TLx + baseWidth / 2, TLy + 3 * anchorH + spacing);

        // Update drawX
        drawX += baseWidth * 3;
    }

    // Draw loop
    sketch.draw = () => {
        // If display not updated
        if (!disp_updated)
        {
            // Set background slightly grey
            sketch.background(20);
            // Add a solid lime border
            sketch.noFill();
            sketch.strokeWeight(disp_border_weight);
            sketch.stroke("aqua");
            sketch.rect(0, 0, cur_ch_disp_width, cur_ch_disp_height);
            sketch.noStroke();

            // Add fixed labels
            sketch.fill("lime");

            // Channel indicator
            sketch.textSize(20);
            sketch.textAlign(sketch.LEFT, sketch.CENTER);
            sketch.text(`Ch ${cur_ch}`, ch_num_off, sketch.height / 2);

            sketch.strokeWeight(sep_weight);

            // Draw separater
            sketch.stroke("grey");
            sketch.line(sketch.textWidth(`Ch ${cur_ch}`) + ch_num_off + sep_off, disp_border_weight,
                        sketch.textWidth(`Ch ${cur_ch}`) + ch_num_off + sep_off, sketch.height - disp_border_weight);

            // Properties of effect displays
            const fx_disp_attr =
            {
                vel:
                {
                    max: 127,
                    min: 0,
                    color: "red"
                },
                vol:
                {
                    max: 127,
                    min: 0,
                    color: "red"
                },
                pan:
                {
                    max: 64,
                    min: -63,
                    color: "green"
                },
                expr:
                {
                    max: 127,
                    min: 0,
                    color: "red"
                },
                bend:
                {
                    max: 8192,
                    min: -8191,
                    color: "green"
                },
                mod:
                {
                    max: 127,
                    min: 0,
                    color: "blue"
                },
                hold:
                {
                    max: 127,
                    min: 0,
                    color: "purple"
                },
                cutoff:
                {
                    max: 127,
                    min: 0,
                    color: "yellow"
                },
                reso:
                {
                    max: 127,
                    min: 0,
                    color: "yellow"
                },
                reverb:
                {
                    max: 127,
                    min: 0,
                    color: "yellow"
                },
                chorus:
                {
                    max: 127,
                    min: 0,
                    color: "yellow"
                },
                delay:
                {
                    max: 127,
                    min: 0,
                    color: "yellow"
                },
                attack:
                {
                    max: 127,
                    min: 0,
                    color: "orange"
                },
                decay:
                {
                    max: 127,
                    min: 0,
                    color: "orange"
                },
                release:
                {
                    max: 127,
                    min: 0,
                    color: "orange"
                }
            }

            drawX = sketch.textWidth(`Ch ${cur_ch}`) + ch_num_off + sep_off + 3;
            for (var i of Object.keys(fx_disp_attr))
            {
                // Draw display modules
                drawModule(i, cur_ch_param[i], fx_disp_attr[i].min,
                           fx_disp_attr[i].max, fx_disp_attr[i].color, drawX, 0);
            }

            // Set state
            disp_updated = true;
        }
    };
};

// Run current channel display sketch on canvas
let cur_channel_disp_inst = new p5(cur_channel_disp, document.getElementById("current-channel-display"));
