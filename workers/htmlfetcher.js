// eventually, you'll have some code here that uses the tested helpers
// to actually download the urls you want to download.
var htmlFetcher = require('./lib/html-fetcher-helpers');
var path = require('path');

module.exports.cacheSites = function() {
  htmlFetcher.readUrls(htmlFetcher.downloadUrls);
};