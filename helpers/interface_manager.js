'use strict';

// Keys of the top keyboard (elements)
var top_kbd_els = [];

// Determines if a MIDI note number represents a white key
function isWhiteKey(num)
{
    // 12 keys on a keyboard
    switch (num % 12)
    {
        // Black keys
        case 1:
        case 3:
        case 6:
        case 8:
        case 10:
            return false;

        // White keys
        default:
            return true;
    }
}

// Get black key spacing
function getBKeySpacing(num)
{
    // Constants in JS
    const piano_spacing = 2;
    const white_K_width = 6;

    // Get computed style
    const doc_root = getComputedStyle(document.querySelector(':root'));

    // Initial offset
    const initoff = white_K_width / 4 - 0.5;

    // Spacing between black keys
    const spacing = white_K_width - piano_spacing;

    var result = initoff;
    var i = 1; // Temporary note number tracker

    while (i < num)
    {
        switch (i % 12)
        {
            // Jump 3 semitones
            case 3:
            case 10:
                result += 2 * spacing;
                i += 3;
                break;

            // Jump 2 semitones
            default:
                result += spacing;
                i += 2;
                break;
        }
    }

    return result;
}

// Initialize top keyboard
function initTopKeyboard()
{
    // Keyboard slot
    var kbd_slot = document.getElementById("top-piano");

    // Temporary element
    var temp_el = null;


    // Generate 128 keys
    for (var i = 0; i < 128; i++)
    {
        // Create a key
        temp_el = document.createElement("div");

        if (isWhiteKey(i))
        {
            temp_el.setAttribute("class", "white-key");
        }
        else
        {
            temp_el.setAttribute("class", "black-key");
            temp_el.setAttribute("style", `left: ${getBKeySpacing(i)}px`);
        }

        top_kbd_els.push(temp_el);
        kbd_slot.appendChild(temp_el);
    }
}

// Set a top keyboard key on or off
function setTopKeyState(index, state)
{
    if (state)
    {
        // Add ".active"
        top_kbd_els[index].classList.add("active");
    }
    else
    {
        // Remove ".active"
        top_kbd_els[index].classList.remove("active");
    }
}
