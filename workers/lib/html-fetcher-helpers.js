var fs = require('fs');
var request = require('request');
var path = require('path');
module.exports.datadir = path.join(__dirname, "../../data/sites/"); // tests will need to override this.


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
    for (var i = 0; i < urls.length-1; i++) {
      console.log('url: ', urls[i]);
      console.log('module.exports.datadir: ', module.exports.datadir);
      request('http://' + urls[i]).pipe(fs.createWriteStream(module.exports.datadir + urls[i]));
    }
    return true;
  }
};