'use strict';

// Virtual navigation bar slot shared between 2 function to prevent tag autocomplete
var virtual_slot = "";

// Recursive function to set inner context menus
function setCtxMenus(obj, label)
{
    // If a context menu has context menus in it
    if (Array.isArray(obj.target))
    {
        // Start of context menu
        virtual_slot += "<ul class=\"dropdown-menu\">";

        // Recursion
        for (var menu of obj.target)
        {
            setCtxMenus(menu, label);
        }

        // End of context menu
        virtual_slot += "</ul>";
    }
    else
    {
        // Add a menu item or seperator

        // If menu item detected
        if (obj.name.length)
        {
            virtual_slot += `<li><a class=\"dropdown-item\" href="javascript:commitAction('${label}:${obj.target}');">${obj.name}</a></li>`;
        }
        // If seperator detected
        else
        {
            virtual_slot += "<li><hr class=\"dropdown-divider\"></li>";
        }
    }
}

// Listen to window.onload() event and initialize navbar
window.onload = function()
{
    // Navigation bar slot
    var slot = document.getElementById("navbar-slots");

    // Current label
    var cur_label;
    var cur_obj;

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
        setCtxMenus(item, cur_label);

        // End current context list
        virtual_slot += "</li>";
    }

    slot.innerHTML = virtual_slot;
}

// Commit an action according to an action string (such as those in context menus)
function commitAction(action)
{
    console.info("Action commited: " + action);
}
