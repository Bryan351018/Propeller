'use strict';
// Current channel display, but without canvas

// Channel display element
var cur_ch_disp_el = document.getElementById("current-channel-display");

// ID prefixes of boxes
const cur_ch_disp_box_prefix = "cur-ch-disp-box-";

// Value bar height (in pixels)
//const cur_ch_disp_v_bar_height = 5;

// Create display
function createCurChDisp()
{
    // Current display box element
    var cur_box;
    // Current effect text element
    var cur_fx_txt;
    // Display bar elements, left and right, outer and inner
    var cur_bar_neg_outer;
    var cur_bar_neg_inner;
    var cur_bar_pos_outer;
    var cur_bar_pos_inner;
    // Current effect value element
    var cur_fx_val;

    // Iterate the effects object
    for (var key of Object.keys(fx_disp_attr))
    {
        // Create new display box
        cur_box = document.createElement("div");
        // Create new effect text element and set text
        cur_fx_txt = document.createElement("p");
        cur_fx_txt.textContent = key;
        // Create progress bars
        if (fx_disp_attr[key].min < 0)
        {
            cur_bar_neg_outer = document.createElement("div");
            //cur_bar_neg_outer.style.height = cur_ch_disp_v_bar_height + "px";
            cur_bar_neg_outer.style.transform = "rotate(180deg)";
            cur_bar_neg_inner = document.createElement("span");
            cur_bar_neg_outer.appendChild(cur_bar_neg_inner);
        }
        cur_bar_pos_outer = document.createElement("div");
        cur_bar_pos_inner = document.createElement("span");
        //cur_bar_pos_outer.style.height = cur_ch_disp_v_bar_height + "px";
        cur_bar_pos_outer.appendChild(cur_bar_pos_inner);

        // Create effect value text element
        cur_fx_val = document.createElement("p");

        // Pack everything together
        cur_box.appendChild(cur_fx_txt);

        // Pack progress bars
        var bar_wrapper = document.createElement("div");
        bar_wrapper.classList.add("horizontal-container");

        // If the bar needs to handle negative values
        if (fx_disp_attr[key].min < 0)
        {
            // Append negative part
            bar_wrapper.appendChild(cur_bar_neg_outer);

            // Set styles for negative and positive parts
            cur_bar_neg_outer.style.width = fx_disp_attr[key].disp_width / 2 + "px";
            cur_bar_pos_outer.style.width = fx_disp_attr[key].disp_width / 2 + "px";
            cur_bar_neg_inner.style.backgroundColor = fx_disp_attr[key].color;
        }
        else
        {
            // Set styles for positive parts
            cur_bar_pos_outer.style.width = fx_disp_attr[key].disp_width + "px";
        }
        cur_bar_pos_inner.style.backgroundColor = fx_disp_attr[key].color;

        bar_wrapper.appendChild(cur_bar_pos_outer);
        cur_box.appendChild(bar_wrapper);

        cur_box.appendChild(cur_fx_val);
        cur_box.id = cur_ch_disp_box_prefix + key;

        // Add it to the webpage
        cur_ch_disp_el.appendChild(cur_box);
        cur_box = null;
    }
}

// Update display
function updateCurChDisp()
{
    // Update channel number
    cur_ch_disp_el.firstElementChild.firstElementChild.textContent = "Ch " + cur_ch;

    // Current display box
    var cur_box;
    // Meter boxes
    var meter_boxes;

    // Update effect values
    for (var key of Object.keys(fx_disp_attr))
    {
        // Set current display box
        cur_box = document.getElementById(cur_ch_disp_box_prefix + key);

        // Meter
        meter_boxes = cur_box.getElementsByTagName("span");
        // If the meter accepts only positive values
        if (meter_boxes.length == 1)
        {
            meter_boxes[0].style.width = cur_ch_param[key] / fx_disp_attr[key].max * 100 + "%";
        }
        // Otherwise
        else
        {
            // If the value is positive
            if (cur_ch_param[key] > 0)
            {
                meter_boxes[0].style.width = 0;
                meter_boxes[1].style.width = cur_ch_param[key] / fx_disp_attr[key].max * 100 + "%";
            }
            // If the value is negative
            else if (cur_ch_param[key] < 0)
            {
                meter_boxes[0].style.width = cur_ch_param[key] / fx_disp_attr[key].min * 100 + "%";
                meter_boxes[1].style.width = 0;
            }
            // If the value is zero
            else
            {
                meter_boxes[0].style.width = 0;
                meter_boxes[1].style.width = 0;
            }
        }

        // Text
        cur_box.lastElementChild.textContent = cur_ch_param[key];
    }
}
