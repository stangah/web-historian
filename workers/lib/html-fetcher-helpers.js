var fs = require('fs');
var request = require('request');
var path = require('path');
var mysql = require('mysql');
module.exports.datadir = path.join(__dirname, "../../data/sites/"); // tests will need to override this.

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'webhistorian',
  database : 'WebHistorian'
});

exports.readUrls = function(cb){
  var sites = [];
  var sitesObj = {};
  connection.query('SELECT site FROM Sites', function(err, rows, fields) {
    if (err)  console.log(err);
    for(var i = 0; i < rows.length; i++){
      sitesObj[rows[i].site] = true;
    }
    for (var key in sitesObj) {
      sites.push(key);
    }
    console.log(sites);
    cb(sites);
  });
};

exports.downloadUrls = function(urls){
  //iterate over urls
  // pipe to new files
  if (!Array.isArray(urls)) {
    throw new Error('downloadUrls: input is not an array');
  } else {
    var timeStamp = Date.now().toString();
    for (var i = 0; i < urls.length; i++) {
      request('http://' + urls[i]).pipe(fs.createWriteStream(module.exports.datadir + urls[i] + timeStamp));
      connection.query("INSERT INTO Sites (site, timestamp) VALUES (?, ?)", [urls[i], timeStamp], function(err, rows, fields) {
        if (err) { console.log(err); }
      });
    }
    return true;
  }
};

