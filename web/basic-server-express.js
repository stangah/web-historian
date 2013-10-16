var express = require('express');
var app = express();
var http = require("http");
var myStuff = require("./request-handler");

var port = 8080;
var ip = "127.0.0.1";
console.log("Listening on http://" + ip + ":" + port);
app.listen(port, ip);

app.get('/', function(request, response) {
  //stuff
  
});

app.get('/path/otherpath', function(request, response) {
  //other stuff
});

app.post('/path', function(request, response) {
  //stuff to do for posting
});