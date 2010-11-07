// syslog-recv example that filters events and pushes notifications via DNode
var DNode = require('dnode');

// define a callback for the syslog receiver
var syslogCallback = function(msgobject) {
  var push = false; // flag indicating whether the current event should be pushed to the DNode server

  // only forward severe events from sshd & smartd
  if (msgobject.tag.toLowerCase() == "sshd" && msgobject.severity_id <= 5)
    push = true;
  if (msgobject.tag.toLowerCase() == "smartd" && msgobject.severity_id <= 5)
    push = true;

  if (push) {
    // invoke a remote function of the form pushNotification(text)
    // with the event details
    DNode.connect(6060, function(remote) {
      remote.pushNotification(
        "[" + msgobject.tag + "@" + msgobject.rinfo.address + "] " +
        "(" + msgobject.severity + "): " +
        msgobject.content);
      });
  }
}

// syslog receiver setup
var syslogReceiver = require("../lib/syslog-recv");
// create a listening server on port 514 (default) on all interfaces
// every incoming message invokes the passed callback
var syslogServer = syslogReceiver.getServer(514, null, syslogCallback);
