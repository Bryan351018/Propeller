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

// A safer inplementation of log10 for digit amount checking
function safeDigits(num)
{
    if (num == 0)
    {
        return 1;
    }
    else
    {
        return Math.floor(Math.log10(num)) + 1;
    }
}

// Pad tick number with spaces
function pad(num, digits)
{
    // Result string
    var res = "";

    for (var i = 0; i < digits - safeDigits(num); i++)
    {
        // Using non-breaking space
        res += "&nbsp;";
    }

    res += num;

    return res;
}

// Get beat and measure number
function getBeatAndMeasureNum(tick)
{
    var tick_quota = tick; // Tick number to be gradually subtracted to get the beat number
    var measures = 1; // Measure number
    var index = 0; // Index for the time signature records

    // If the index exists, and there is a time signature change
    while (current_project.time_sigs[index] && tick >= current_project.time_sigs[index].at)
    {
        // If the next time signature change exists, and the tick number reaches it
        if (current_project.time_sigs[index + 1] && tick >= current_project.time_sigs[index + 1].at)
        {
            // Increase previous measures
            measures += Math.floor(Math.floor(
                (current_project.time_sigs[index + 1].at - current_project.time_sigs[index].at)
                 / ref_t_per_b)
                / current_project.time_sigs[index].top);

            // Reduce tick quota
            tick_quota -= current_project.time_sigs[index + 1].at - current_project.time_sigs[index].at;
        }


        // Increment index
        index++;
    }

    // Shift index back to correct location
    index--;

    return {
        beat_num: Math.floor(tick_quota / ref_t_per_b) % current_project.time_sigs[index].top + 1,
        mea_num: measures + Math.floor(Math.floor(tick_quota / ref_t_per_b) / current_project.time_sigs[index].top)
    };
}

// TODO
function updateMeasNum()
{
    // 1. Get tick num

    // 2. Tick num modulo ticks/beat to get proper tick number
    const proper_tick = pad(aud_cur_tick % ref_t_per_b, safeDigits(ref_t_per_b));

    // 3. Tick num divide ticks/beat to get beat count (raw)
    const raw_beat_count = Math.floor(aud_cur_tick / ref_t_per_b);

    // 4. Raw beat count modulo time sig numerator, then add 1 to get measure num (since they start from 1)
    const proper_beat = getBeatAndMeasureNum(aud_cur_tick).beat_num;

    // 5. Raw beat count divide time sig numerator, then add 1 to get measure num (since they start from 1)
    const measure_num = getBeatAndMeasureNum(aud_cur_tick).mea_num;

    meas_num.innerHTML = measure_num + ":" + proper_beat + ":" + proper_tick;
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
