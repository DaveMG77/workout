$(document).ready(function(){
    var exercise = 0, exerciseType = 0, timeDirect = 0, goalAcheive = 0;
    var curTime = $(".timer .x-time");
    var totTime = $(".timer .tot-time");
    var tenths = 0, seconds = 0, minutes = 0, hours = 0, t;
    var curTen = 0, curSec = 0, curMin = 0, curHour = 0;
    var curTenDown = 0, curSecDown = 0, curMinDown = 0, curHourDown = 0;
    var goalSec = 0, goalMin = 0, xName;
    var newLineTime = "<div><input type='text' placeholder='Exercise'></div><div><input type='number' placeholder='Minutes'></div>";
    newLineTime     +="<div><input type='number' placeholder='Seconds'></div><div><a href='#' class='del'>&#45;</a></div>";
    var newLineReps = "<div><input type='text' placeholder='Exercise'></div><div></div>";
    newLineReps     +="<div><input type='text' placeholder='Reps'></div><div><a href='#' class='del'>&#45;</a></div>";
    var sound = document.getElementById("nextSound");
    sound.preload = "auto";
    
    $(".tools .add").click(function(){
        var numLines = $(".schedule li").length;
        if ($(this).hasClass("add-time")){
            $(".schedule").append("<li class='timed cf'>" + newLineTime + "</li>");
            $(".tools .run").html("Run");
        } else {
            $(".schedule").append("<li class='cf'>" + newLineReps + "</li>");
            $(".tools .run").html("Run");
        }
        $(".schedule li:eq(" + numLines + ") .del").click(function(){
            if ($(".schedule li").length > 1){
                $(this).parent().parent().remove();
                $(".tools .run").html("Run");
            }
            return false;
        });
        return false;
    });
    
    function checkValues(){
        var numLines = $(".schedule li").length;
        var clean = true;
        for (var i = 0; i < numLines; i++){
            $(".schedule li:eq(" + i + ") .err").remove();
            if ($(".schedule li:eq(" + i + ")").hasClass("timed")){
                var minutes = $(".schedule li:eq(" + i + ") div:eq(1) input").val();
                var seconds = $(".schedule li:eq(" + i + ") div:eq(2) input").val();
                if ((!minutes) && (!seconds)){
                    $(".schedule li:eq(" + i + ")").append("<div class='err'><div>Please add time</div></div>");
                    clean = false;
                }
            } else {
                var name = $(".schedule li:eq(" + i + ") div:eq(0) input").val();
                var reps = $(".schedule li:eq(" + i + ") div:eq(2) input").val();
                if ((!name) && (!reps)){
                    $(".schedule li:eq(" + i + ")").append("<div class='err'><div>Please add reps or an exercise name</div></div>");
                    clean = false;
                }
            }
        }
        return clean;
    }

    function loadExercise(){
        xName = $(".schedule li:eq(" + exercise + ") div:eq(0) input").val();
        if ($(".schedule li:eq(" + exercise + ")").hasClass("timed")){
            goalMin = $(".schedule li:eq(" + exercise + ") div:eq(1) input").val();
            goalSec = $(".schedule li:eq(" + exercise + ") div:eq(2) input").val();
            if (!goalMin){goalMin = 0}
            if (!goalSec){goalSec = 0}
            exerciseType = 0; timeDirect = 0;
        } else {
            var reps = $(".schedule li:eq(" + exercise + ") div:eq(2) input").val();
            if (reps){
                xName = reps + " - " + xName;
            }
            goalMin = 99; goalSec = 0;
            exerciseType = 1; timeDirect = 1;
        }
        $(".timer .name").html(xName);
    }

    function running() {
        // Check if exercise has completed, log results, play sound, load new exercise or
        // end the workout and log the final time.
        if (((curMin >= goalMin) && (curSec >= goalSec)) || (goalAcheive)){
            $(".results").append("<li class='cf'><div>" + xName + "</div><div>" + curHour + ":" + 
                (curMin > 9 ? curMin : "0" + curMin) + ":" + 
                (curSec > 9 ? curSec : "0" + curSec) + ":" + 
                (curTen > 0 ? curTen : "0" + curTen) + "</div></li>");
            exercise+=1;
            sound.currentTime = 0;
            sound.play();
            if ($(".schedule li:eq(" + exercise + ")").length){
                loadExercise();
                curMin = 0, curSec = 0, curTen = 0;
                goalAcheive = 0;
            } else {
                clearTimeout(t);
                $(".tools .run").removeClass("on").html("Run Again");
                $(".timer .name").html("Workout Finished");
                $(".timer").removeClass("full");
                $(curTime).addClass("hidden");
                $(".results").append("<li class='total cf'><div>Total Time</div><div>" + hours + ":" + 
                    (minutes > 9 ? minutes : "0" + minutes) + ":" + 
                    (seconds > 9 ? seconds : "0" + seconds) + ":" + 
                    (tenths > 0 ? tenths : "0" + tenths) + "</div></li>");
                exercise = 0, goalAcheive = 0;
                tenths = 0, seconds = 0, minutes = 0, hours = 0, t;
                curTen = 0, curSec = 0, curMin = 0, curHour = 0;
                curTenDown = 0, curSecDown = 0, curMinDown = 0, curHourDown = 0;
                goalSec = 0, goalMin = 0;
                return;
            }
        }
        
        // Counting
        curTen+=10; tenths+=10;
        
        if (curTen >= 100){
            curTen = 0;
            curSec++;
            if (curSec >= 60){
                curSec = 0;
                curMin++;
                if (curMin >= 60){
                    curMin = 0;
                    curHour++;
                }
            }
        }
        
        if (curTen > 0){curTenDown = 100 - curTen} else {curTenDown = 0}
        if (curSec < goalSec) {
            if (curTen > 0){
                curSecDown = goalSec - curSec - 1;
            } else {
                curSecDown = goalSec - curSec;
            }
            curMinDown = goalMin - curMin;
        } else {
            if (curTen > 0){
                curSecDown = (60 - (curSec - goalSec)) - 1;
            } else {
                curSecDown = 60 - (curSec - goalSec);
            }
            curMinDown = goalMin - curMin - 1;
            if (curMinDown == -1){
                curSecDown = 0;
                curMinDown = 0;
            }
        }

        if (tenths >= 100){
            tenths = 0;
            seconds++;
            if (seconds >= 60){
                seconds = 0;
                minutes++;
                if (minutes >= 60){
                    minutes = 0;
                    hours++;
                }
            }
        }
        
        // Displaying time elapsed. timeDirect = 1: counting up, 0: counting down
        if (timeDirect == 1){
            $(curTime).html(curHour + ":" + 
                (curMin > 9 ? curMin : "0" + curMin) + ":" + 
                (curSec > 9 ? curSec : "0" + curSec) + ":" + 
                (curTen > 0 ? curTen : "0" + curTen));
        } else {
            $(curTime).html(curHourDown + ":" + 
                (curMinDown > 9 ? curMinDown : "0" + curMinDown) + ":" + 
                (curSecDown > 9 ? curSecDown : "0" + curSecDown) + ":" + 
                (curTenDown > 0 ? curTenDown : "0" + curTenDown));
        }
        $(totTime).html(hours + ":" + 
            (minutes > 9 ? minutes : "0" + minutes) + ":" + 
            (seconds > 9 ? seconds : "0" + seconds) + ":" + 
            (tenths > 0 ? tenths : "0" + tenths));
        
        timer();
    }
    function timer() {
        t = setTimeout(running, 100);
    }
    // Run and pause control
    $(".tools .run, .timer .control").click(function(){
        // On click to start, clear results (if running again), show results
        // and show current exercise time (if running again)
        if (checkValues()){
            if (exercise == 0){
                $(".sub-title, .results").removeClass("hidden");
                $(curTime).removeClass("hidden");
                $(".results").html("");
            }
            if ($(".tools .run").hasClass("on")){
                clearTimeout(t);
                $(".timer").addClass("full-stop");
                $(".tools .run").removeClass("on").html("Run");
            } else {
                loadExercise();
                timer();
                $(".timer").removeClass("full-stop").addClass("full");
                $(".tools .run").addClass("on").html("Pause");
            }
        }
        return false;
    });
    $(".timer .close").click(function(){
        $(".timer").removeClass("full").removeClass("full-stop");
        return false;
    });
    $(".timer .skip").click(function(){
        goalAcheive = 1;
        return false;
    });
    $(document).keyup(function(e){
        if (e.keyCode==32){
            goalAcheive = 1;
        }
    });
});