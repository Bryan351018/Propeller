'use strict';

// Instrument info interpreter

// Get a soundfont-style instrument name
function getSfInstName(fullStr)
{
    // Temporary string
    var tempStr = fullStr;

    // Make everything lowercase
    tempStr = tempStr.toLowerCase();

    // Replace spaces by underscores
    tempStr = tempStr.replace(/ /g, "_");

    // Remove brackets and plus signs
    tempStr = tempStr.replace(/[()+]/g, "");

    return tempStr;
}
