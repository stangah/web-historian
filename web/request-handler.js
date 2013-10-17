var path = require('path');
var fs = require('fs');
var url = require('url');
var caching = require('../workers/htmlfetcher');
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var collectData = function(request, callback){
  var data = "";
  request.on('data', function(chunk){
    data += chunk;
  });
  request.on('end', function(){
    callback(data);
  });
};

module.exports.handleRequest = function (req, res) {
  caching.cacheSites();
  console.log(exports.datadir);

  var pathName = url.parse(req.url).pathname;
  var lookup = '';

  if (pathName === "/") {
    lookup = './public/index.html';
  } else if (pathName.slice(0,4) === "/css") {
    lookup = './public' + pathName;
  } else {  // this will not allow us to get files referenced by index.html
    lookup = '../data/sites' + pathName;
  }

  // specify contentType based on file extension
  var extname = path.extname(lookup);
  var contentType;
  switch(extname){
    case '.js':
      contentType = "text/javascript";
      break;
    case '.css':
      contentType = "text/css";
      break;
    default:
      contentType = "text/html";
      break;
  }

  // handle different method types
  switch(req.method) {
    case 'GET':
      fs.exists(path.resolve(__dirname, lookup), function(exists) {
        if(exists) {
          fs.readFile(path.resolve(__dirname, lookup), function(err, data) {
          if (err) {
            console.log(err);
            res.writeHead(500);
            res.end();
          } else {
            res.writeHead(200, {"Content-Type": contentType });
            res.end(data);
          }
          });
        } else {
          res.writeHead(404, headers);
          res.end();
        }
      });
      break;
    case 'POST':
      // the problem is that we are not writing to the test sites.txt
      res.writeHead(302, headers);
      collectData(req, function(data){
        var url = data.replace(/url=/,'');
        // append data to file
        fs.appendFile(module.exports.datadir, url + '\n', function (err) {
        if (err) throw err;
          console.log('Data successfully appended to file!');
        });
      });
      res.end();
      break;
    case 'OPTIONS':
      break;
    default:
      break;
  }
};
