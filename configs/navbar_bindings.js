'use strict';

// To indicate a seperator, set name to ""
// If target is a string instead of an array, that sets the action string of the menu item
// (e.g. "file:open" for File -> Open, with label = "file" and target = "open")
// Action strings get passed to commitAction() where you can handle them.

var navbar_bindings = [
    // "File" tab
    {
        name: "File",
        label: "file",
        target:
        [
            {name: "Open", target: "open"},
            {name: "Import", target: "import"},
            {name: "Save", target: "save"},
            {name: "Export", target: "export"}
        ]
    },
    // "Edit" tab
    {
        name: "Edit",
        label: "edit",
        target:
        [
            {name: "Undo", target: "undo"},
            {name: "Redo", target: "redo"},
            {name: ""},
            {name: "Copy", target: "copy"},
            {name: "Cut", target: "cut"},
            {name: "Paste", target: "paste"}
        ]
    },
    // "View" tab
    {
        name: "View",
        label: "view",
        target:
        [
            {name: "Score view", target: "score_view"},
            {name: "Track view", target: "track_view"},
        ]
    },
    // "Insert event" tab
    {
        name: "Insert event...",
        label: "insert",
        target:
        [
            {name: "Tempo", target: "tempo"},
            {name: "Time signature", target: "time_sig"},
            {name: "Key signature", target: "key_sig"},
            {name: ""},
            {name: "Program change", target: "prog_change"},
            {name: "Volume", target: "volume"},
            {name: "Panpot", target: "panpot"},
            {name: "Expression", target: "expression"},
            {name: "Pitch bend", target: "pitch_bend"},
            {name: "Modulation", target: "modulation"},
            {name: "Hold", target: "hold"},
            {name: "Low pass filter cutoff frequency", target: "LPF_cutoff"},
            {name: "Low pass filter resonance amount", target: "LPF_resonance"},
            {name: "Reverb", target: "reverb"},
            {name: "Chorus", target: "chorus"},
            {name: "Delay", target: "delay"},
            {name: "Attack time", target: "attack"},
            {name: "Decay time", target: "decay"},
            {name: "Release time", target: "release"}
        ]
    },
    // "Actions" tab
    {
        name: "Actions",
        label: "actions",
        target:
        [
            {name: "Bulk changes...", target: "bulk_changes"},
            {name: "Quantize", target: "quantize"},
            {name: "Join", target: "join"},
            {name: "Horizontal flip", target: "flip"},
            {name: "Vertical inversion", target: "invert"},
            {name: ""},
            {name: "1 octave up", target: "1va_up"},
            {name: "1 octave down", target: "1va_down"},
            {name: ""},
            {name: "Stretch entire selection...", target: "stretch"}
        ]
    },

    // "Tools" tab
    {
        name: "Tools",
        label: "tools",
        target:
        [
            {name: "Pen", target: "pen"},
            {name: "Select", target: "select"},
            {name: "Eraser", target: "eraser"},
            {
                name: "Stamp", target:
                [
                    {name: "Configure...", target: "stamp_conf"},
                    // An insert label
                    {insert_id: "stamps"}
                ]
            },
            {name: ""},
            {name: "Freehand", target: "freehand"},
            {name: "Line", target: "line"},
            {name: "Spline", target: "spline"},
            {name: "Random", target: "random"},
            {
                name: "Custom",
                target:
                [
                    {name: "Configure...", target: "func_conf"},
                    {insert_id: "funcs"}
                ]
            },
            {name: ""},
            {
                name: "Quantization",
                target:
                [
                    {name: "Custom...", target: "quant_custom"},
                    {name: "Whole note", target: "quant_1n"},
                    {name: "Half note", target: "quant_1/2n"},
                    {name: "Whole note triplet", target: "quant_1/3n"},
                    {name: "8th note", target: "quant_1/8n"},
                    {name: "8th note triplet", target: "quant_1/24n"},
                    {name: "16th note", target: "quant_1/16n"}
                    // Maybe more as we go
                ]
            },
            {
                name: "Default note length",
                target:
                [
                    {name: "Custom...", target: "n_len_custom"},
                    {name: "Whole note", target: "n_len_1n"},
                    {name: "Half note", target: "n_len_1/2n"},
                    {name: "Whole note triplet", target: "n_len_1/3n"},
                    {name: "8th note", target: "n_len_1/8n"},
                    {name: "8th note triplet", target: "n_len_1/24n"},
                    {name: "16th note", target: "n_len_1/16n"}
                    // Maybe more as we go
                ]
            },
            {
                name: "Default note velocity",
                target:
                [
                    {name: "Custom...", target: "n_vel_custom"},
                    // Maybe more as we go
                ]
            },
        ]

    },
    // "Playback" tab
    {
        name: "Playback",
        label: "playback",
        target:
        [
            {name: "Play/stop", target: "toggle_play_stop"},
            {name: "Pause", target: "pause"},
            {name: "Loop", target: "loop"},
            {name: ""},
            {name: "Start of the song", target: "goto_start"},
            {name: "End of the song", target: "goto_end"},
            {name: "Previous bar", target: "prev_bar"},
            {name: "Next bar", target: "next_bar"},
            {name: ""},
            {name: "Play all tracks", target: "all_tracks"},
            {name: "Solo track", target: "solo_track"}
        ]
    },
    // "Track" tab
    {
        name: "Track",
        label: "track",
        target:
        [
            {name: "Add track...", target: "add"},
            {name: "Properties...", target: "properties"},
            {name: "Reference track(s)...", target: "ref_tracks"},
            {name: ""},
            {insert_id: "tracks"}
        ]
    },
    // "Markings" tab
    {
        name: "Markings",
        label: "markings",
        target:
        [
            {name: "Add scale guide...", target: "add_scale_guide"},
            {name: ""},
            {name: "Add marker...", target: "add_marker"},
            {name: "Edit marker...", target: "edit_marker"},
            {name: "Delete marker...", target: "del_marker"},
            {name: "Previous marker", target: "prev_marker"},
            {name: "Next marker", target: "next_marker"},
            {name: ""},
            {insert_id: "markers"}
        ]
    }
    // Still more...
];

// Insert points
var insert_points = {
    stamps:
    {
        label: "tools",
        path: [5, 3] // Tab 6, menu 4
    },
    funcs:
    {
        label: "tools",
        path: [5, 9] // Tab 6, menu 10
    },
    tracks:
    {
        label: "track",
        path: [7, 4] // Tab 8, menu 5
    },
    markers:
    {
        label: "markings",
        path: [8, 8] // Tab 9, menu 9
    }
};
