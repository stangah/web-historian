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

exports.readUrls = function(filePath, cb){
  var sites = [];
  connection.connect();
  connection.query('SELECT site FROM Sites', function(err, rows, fields) {
    if (err)  console.log(err);
    for(var i = 0; i < rows.length; i++){
      sites.push(rows[i].site);
    }
    connection.end();
    cb(sites);
  });
};

exports.downloadUrls = function(urls){
  //iterate over urls
  // pipe to new files
  if (!Array.isArray(urls)) {
    throw new Error('downloadUrls: input is not an array');
  } else {
    for (var i = 0; i < urls.length; i++) {
      request('http://' + urls[i]).pipe(fs.createWriteStream(module.exports.datadir + urls[i]));
    }
    return true;
  }
};

