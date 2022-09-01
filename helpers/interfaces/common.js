'use strict';

// Things that interfaces have in common

// Amount of note numbers specified in MIDI
const MIDI_NC = 128;

// Properties of effect displays
const fx_disp_attr =
{
    vel:
    {
        max: 127,
        min: 0,
        color: "red",
        disp_width: 30
    },
    vol:
    {
        max: 127,
        min: 0,
        color: "red",
        disp_width: 30
    },
    pan:
    {
        max: 64,
        min: -63,
        color: "green",
        disp_width: 30
    },
    expr:
    {
        max: 127,
        min: 0,
        color: "red",
        disp_width: 30
    },
    bend:
    {
        max: 8192,
        min: -8191,
        color: "green",
        disp_width: 50
    },
    mod:
    {
        max: 127,
        min: 0,
        color: "blue",
        disp_width: 30
    },
    hold:
    {
        max: 127,
        min: 0,
        color: "purple",
        disp_width: 30
    },
    cut:
    {
        max: 127,
        min: 0,
        color: "yellow",
        disp_width: 30
    },
    reso:
    {
        max: 127,
        min: 0,
        color: "yellow",
        disp_width: 30
    },
    rev:
    {
        max: 127,
        min: 0,
        color: "yellow",
        disp_width: 30
    },
    cho:
    {
        max: 127,
        min: 0,
        color: "yellow",
        disp_width: 30
    },
    del:
    {
        max: 127,
        min: 0,
        color: "yellow",
        disp_width: 30
    },
    att:
    {
        max: 127,
        min: 0,
        color: "orange",
        disp_width: 30
    },
    dec:
    {
        max: 127,
        min: 0,
        color: "orange",
        disp_width: 30
    },
    rel:
    {
        max: 127,
        min: 0,
        color: "orange",
        disp_width: 30
    }
}

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
    cut: 0,
    reso: 0,
    rev: 0,
    cho: 40,
    del: 0,
    att: 0,
    dec: 0,
    rel: 0
};
