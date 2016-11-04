/*
JQUERY: STOPWATCH & COUNTDOWN
This is a basic stopwatch & countdown plugin to run with jquery.
Start timer, pause it, stop it or reset it.
Same behaviour with the countdown besides you need to input the countdown value in seconds first.
At the end of the countdown a callback function is invoked.
Any questions, suggestions? marc.fuehnen(at)gmail.com
*/
var uiGameScore = $('#gameScore');
var uiScore = $('#score');
var uiMS = $('#crono_ms');
var uiS = $('#crono_s');
var uiM = $('#crono_m');
var uiModal = $('#modal');

$(document).ready(function() {
    (function($){
        $.extend({
            APP : {                
                formatTimer : function(a) {
                    if (a < 10) {
                        a = '0' + a;
                    }                              
                    return a;
                },                   
                startTimer : function() {
                    // get current date
                    $.APP.d1 = new Date();
                    // get current timestamp (for calculations)
                    $.APP.t1 = $.APP.d1.getTime(); 
                    // reset state
                    $.APP.state = 'alive';
                    // start loop
                    $.APP.loopTimer();
                },
                stopTimer : function() {                   
                    // set state
                    $.APP.state = 'stop';
                    if(uiM.html() != '0') {
                        uiGameScore.html(uiM.html() + "m" + uiS.html() + "s" + uiMS.html());
                    } else {
                        uiGameScore.html(uiS.html() + "s" + uiMS.html());
                    }
                    uiModal.modal('show');
                },   
                loopTimer : function() {
                    var td;
                    var d2,t2;
                    var ms = 0;
                    var s  = 0;
                    var m  = 0;
                    var h  = 0;
                    if ($.APP.state === 'alive') {
                        // get current date and convert it into 
                        // timestamp for calculations
                        d2 = new Date();
                        t2 = d2.getTime();   
                        // calculate time difference between
                        // initial and current timestamp
                        td = t2 - $.APP.t1; 
                        // calculate milliseconds
                        ms = td%1000;
                        if (ms < 1) {
                            ms = 0;
                        } else {    
                            // calculate seconds
                            s = (td-ms)/1000;
                            if (s < 1) {
                                s = 0;
                            } else {
                                // calculate minutes   
                                var m = (s-(s%60))/60;
                                if (m < 1) {
                                    m = 0;
                                } else {
                                    // calculate hours
                                    var h = (m-(m%60))/60;
                                    if (h < 1) {
                                        h = 0;
                                    }                             
                                } 
                            }
                        }
                        // substract elapsed minutes & hours
                        ms = Math.round(ms/100);
                        s  = s-(m*60);
                        m  = m-(h*60);                                
                        // update display
                        uiMS.html($.APP.formatTimer(ms));
                        uiS.html($.APP.formatTimer(s));
                        uiM.html(m);
                        uiScore.val(td);
                        // loop
                        $.APP.t = setTimeout($.APP.loopTimer,10);
                    } else {
                        // kill loop
                        clearTimeout($.APP.t);
                        return true;
                    }  
                }
            }    
        });                
    })(jQuery);
});
