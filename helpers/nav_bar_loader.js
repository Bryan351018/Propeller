'use strict';

// Virtual navigation bar slot shared between 2 functions to prevent tag autocomplete
var virtual_slot = "";

// Recursive function to set inner context menus
function setCtxMenus(obj, label, layer)
{
    // If a context menu has context menus in it
    if (Array.isArray(obj.target))
    {
        // Start of context menu
        if (layer == 0)
        {
            virtual_slot += "<ul class=\"dropdown-menu dropdown-menu-dark\">";
        }
        else
        {
            virtual_slot += `<li class="dropdown-submenu dropend"><a href="#" data-bs-toggle="dropdown" class="dropdown-item dropdown-toggle">${obj.name}</a>`;
            virtual_slot += "<ul class=\"dropdown-menu dropdown-menu-dark\">";
        }

        // Recursion
        for (var menu of obj.target)
        {
            setCtxMenus(menu, label, layer + 1);
        }

        // End of context menu
        virtual_slot += "</ul>";

        if (layer > 0)
        {
            virtual_slot += "</li>";
        }
    }
    else
    {
        // Add a context menu insert point
        if (obj.name == undefined)
        {
            virtual_slot += `<span id="${obj.insert_id}"></span>`;
        }

        // Add a menu item or seperator

        // If menu item detected
        else if (obj.name.length)
        {
            // If not a submenu
            if (!Array.isArray(obj.target))
            {
                virtual_slot += `<li><a class="dropdown-item" href="javascript:commitAction('${label}:${obj.target}');">${obj.name}</a></li>`;
            }
            else
            {
                virtual_slot += `<li><a class="dropdown-item" href="#');">${obj.name}</a></li>`;
            }
        }
        // If seperator detected
        else
        {
            virtual_slot += "<li><hr class=\"dropdown-divider\"></li>";
        }
    }
}

// Load navbar
function loadNavs()
{
    // Navigation bar slot
    var slot = document.getElementById("navbar-slots");

    // Current label
    var cur_label;

    // Iterate the bindings list
    for (var item of navbar_bindings)
    {
        // Set action label (for calling functions later)
        cur_label = item.label;

        // Add HTML chunk for context list
        virtual_slot += "<li class=\"nav-item dropdown\">";
        virtual_slot += "<a class=\"nav-link dropdown-toggle\" href=\"#\" role=\"button\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\">"
        virtual_slot += item.name;
        virtual_slot += "</a>";

        // Set additional context menus
        setCtxMenus(item, cur_label, 0);

        // End current context list
        virtual_slot += "</li>";
    }

    // Set innerHTML
    slot.innerHTML = virtual_slot;
    // Clear virtual slot
    virtual_slot = "";
}

// Update the context menu in the location specified by ins_id, to set_items
function updateCtxMenu(ins_id, set_items)
{
    // Get insert slot
    var ins_slot = document.getElementById(ins_id);

    // Get contents to insert
    var check_slot = navbar_bindings;

    // Go to paths
    for (var path of insert_points[ins_id].path)
    {
        check_slot = check_slot[path].target;
    }

    // Flag for if the insert flag is detected in navbar_bindings
    var ins_p_detected = false;

    // See what has been updated
    for (var item of check_slot)
    {
        // If insert point detected
        if (item.insert_id == ins_id)
        {
            ins_p_detected = true;
        }

        // Here comes the stuff about to be inserted
        if (ins_p_detected)
        {
            for (var set_item of set_items)
            {
                // Update the menu
                virtual_slot += `<li><a class=\"dropdown-item\" href="javascript:commitAction('${insert_points[ins_id].label}:${set_item.target}');">${set_item.name}</a></li>`;
            }
            // Update innerHTML
            ins_slot.innerHTML = virtual_slot;
            // Clear virtual slot
            virtual_slot = "";

            return true;
        }
    }

    console.warn("A valid insert point cannot be found");
    return false;
}

// Commit an action according to an action string (such as those in context menus)
function commitAction(action)
{
    console.info("Action commited: " + action);

    // File input element
    var file_in_el = document.getElementById("file-in");

    switch (action)
    {
        // Handle fullscreen
        case "propeller:toggle_fullscreen":
            const fullScrEl = document.getElementById("main-editor-window");
            if (fullScrEl.requestFullscreen)
            {
                fullScrEl.requestFullscreen();
            }
            else
            {
                fullScrEl.webkitRequestFullscreen();
            }
            break;

        case "file:open":
            file_in_el.click();
            break;

        // Import
        case "file:import":
            // First setup the loading
            file_in_el.onchange = function()
            {
                // Function chaining; loads the file, then set the current project
                loadMIDIFile(proj_set_MIDI);
            }
            // Then input file
            file_in_el.click();
            break;

        // Export
        case "file:export":
            proj_export_MIDI();
            break;

        // Playback
        case "playback:toggle_play_stop":
            // TEMPORARY
            if (is_playing)
            {
                score_stop();
                document.getElementById("control-play-stop").innerHTML = '<i class="bi bi-play"></i>';
            }
            else
            {
                // If the audio context has not been initialized
                if (!ac)
                {
                    // initialize it
                    audioCtxInit();
                }
                // Auto-unmute
                if (!sound_enabled)
                {
                    toggleMute();
                }

                score_play();
                document.getElementById("control-play-stop").innerHTML = '<i class="bi bi-stop-fill"></i>';
            }

            break;

        default:
            console.warn("This action is currently unhandled");
            break;
    }
}
