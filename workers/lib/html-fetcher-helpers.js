var fs = require('fs');

exports.readUrls = function(filePath, cb){
  cb( ('' + fs.readFileSync(filePath)).split('\n') );
};

exports.downloadUrls = function(urls){
  // fixme
};
