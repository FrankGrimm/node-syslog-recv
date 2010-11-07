// example for syslog-recv 
// counts events / second and outputs event information to stdout

// counter output & reset
var evtCounter = 0;

setInterval(function() {
  if (evtCounter > 0) {
    console.log("Handled events/second: " + evtCounter);
    evtCounter = 0;
  }
}, 1000);

var syslogCallback = function(evt) {
  evtCounter++; // increment event counter
  console.log("[" + evt.tag + "@" + evt.rinfo.address + " (" + evt.severity + ")] " + evt.content);
}

// syslog receiver setup
var syslogReceiver = require("../lib/syslog-recv");
// create a listening server on port 514 (default) on all interfaces
// every incoming message invokes the passed callback
var syslogServer = syslogReceiver.getServer(514, null, syslogCallback);
