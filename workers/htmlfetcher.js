// eventually, you'll have some code here that uses the tested helpers
// to actually download the urls you want to download.
var htmlFetcher = require('./lib/html-fetcher-helpers');
var path = require('path');
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.

module.exports.cacheSites = function() {
  htmlFetcher.readUrls(module.exports.datadir, htmlFetcher.downloadUrls);
};