var path = require('path');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var caching = require('../workers/htmlfetcher');
var htmlfetchers = require('../workers/lib/html-fetcher-helpers');

module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'webhistorian',
  database : 'WebHistorian'
});

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
  var pathName = url.parse(req.url).pathname;
  var lookup = '';

  if (pathName === "/") {
    lookup = './public/index.html';
  } else if(pathName === "/siteList"){
    lookup = '/siteList';
  } else if (pathName.slice(0,4) === "/css") {
    lookup = './public' + pathName;
  } else {
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
      // NEED SQL HERE
      fs.exists(path.resolve(__dirname, lookup), function(exists) {
        if(exists) {
          fs.readFile(path.resolve(__dirname, lookup), function(err, data) {
            if (err) {
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
      console.log('posting');
      // the problem is that we are not writing to the test sites.txt
      res.writeHead(302, headers);
      collectData(req, function(data){
        var url = data.replace(/url=/,'');
        // append data to file
        // NEED SQL HERE
        connection.connect();
        // connection.query('SELECT site FROM Sites', function(err, rows, fields) {
        //   if (err)  console.log(err);
        //   for(var i = 0; i < rows.length; i++){
        //     sites.push(rows[i].site);
        //   }
        connection.query("INSERT INTO Sites (site) VALUES (?)", [url], function(err, rows, fields) {
          if (err) console.log(err);
          htmlfetchers.downloadUrls([url]);
          connection.end();
        });
      });
      res.end();
      break;
    case 'OPTIONS':
      res.writeHead(200, headers);
      res.end();
      break;
    default:
      break;
  }
};
