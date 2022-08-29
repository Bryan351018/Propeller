// To indicate a seperator, set name to ""
const navbar_bindings = [
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
            // And more to add here
        ]
    }
]
