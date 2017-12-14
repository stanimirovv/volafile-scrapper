var page = require('webpage').create();
var system = require('system');

// USAGE: phantomjs scrapper.js <room id>

// since volafile uses web sockets to send data in chuncks, phantomJS's onloadfinish
// doesn't work since it may be registered as finished without receaving all pictures
// that is why the current solution by simply waiting a few seconds isn't that bad

// First and only argument is the unique room hash
var args = system.args;
if (args[1] === undefined ) {
   console.log( "You must pass as a command line parameter the hash of the room" ); 
   phantom.exit(1);
}

roomURL = 'https://volafile.org/r/' + args[1];
page.open( roomURL, function (status) {
    if (status !== 'success') {
        console.log('Unable to load the address!');
        phantom.exit();
    } else {
        window.setTimeout(function () {
            console.log( page.content );
            phantom.exit();
        }, 8000);
    }
});

