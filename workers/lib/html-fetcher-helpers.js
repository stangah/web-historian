var fs = require('fs');
var request = require('request');
var path = require('path');
var mysql = require('mysql');
module.exports.datadir = path.join(__dirname, "../../data/sites/"); // tests will need to override this.

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'webhistorian'
});

exports.readUrls = function(filePath, cb){
  if(fs.existsSync(filePath)){
    cb( ('' + fs.readFileSync(filePath)).split('\n') );
  }else{
    // error
    console.log('readUrls: File not found.');
  }
};

exports.downloadUrls = function(urls){
  //iterate over urls
  // pipe to new files
  if (!Array.isArray(urls)) {
    throw new Error('downloadUrls: input is not an array');
  } else {
    connection.connect();
    connection.query('SELECT site FROM Sites', function(err, rows, fields) {
      if (err)  console.log(err);
      for (var i = 0; i < rows.length-1; i++) {
        request('http://' + rows[i].site).pipe(fs.createWriteStream(module.exports.datadir + rows[i].site));
      }
    });
    connection.end();
    return true;
  }
};

