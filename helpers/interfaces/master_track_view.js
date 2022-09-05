'use strict';

// Measure/tick display element
var meas_num = document.getElementById("meas-num");

// Real time display element
var time_num = document.getElementById("time-num");

// BPM display element
var bpm_disp_el = document.getElementById("bpm");

// Time signature display elements
var time_sig_disp_el_top = document.getElementById("time-sig-numerator"); // Numerator
var time_sig_disp_el_bottom = document.getElementById("time-sig-denominator"); // denominator

// Key signature display element
var key_sig_disp_el = document.getElementById("key-sig");

// Seconds elapsed
var sec_elapsed = 0;

// ID of real time timer
var real_time_timer_id;

function setDispBPM(value)
{
    bpm_disp_el.textContent = value.toFixed(3);
}

function updateTimeSig()
{
    time_sig_disp_el_top.textContent = time_sig[0];
    time_sig_disp_el_bottom.textContent = time_sig[1];
}

function setKeySig(text)
{
    key_sig_disp_el.textContent = text;
}

// TODO
function updateMeasNum()
{
    // 1. Get tick num

    // 2. Tick num modulo ticks/beat to get final number

    // 3. Tick num divide ticks/beat to get beat count (raw)
}

// Slightly inaccurate
function setRealTimerState(state)
{
    // Display string
    var dispStr = "";
    if (state)
    {
        real_time_timer_id = setInterval(function()
        {
            // Format time
            dispStr += Math.floor(sec_elapsed / 60) + ":";

            if (sec_elapsed % 60 < 10)
            {
                dispStr += "0";
            }
            dispStr += sec_elapsed % 60;

            time_num.textContent = dispStr;
            dispStr = "";

            // Increment time
            sec_elapsed++;
        }, 1000);
    }
    else
    {
        clearInterval(real_time_timer_id);
    }
}
