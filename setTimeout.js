Math._round = Math.round;

Math.round = function(number, precision) {
  precision = Math.abs(parseInt(precision)) || 0;
  var coefficient = Math.pow(10, precision);
  return Math._round(number * coefficient) / coefficient;
};

Math.bytesToSize = function(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) {
    return '0 Bytes';
  }
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};


var i = 0;
function _waitForever() {

  /*var garbageCollectMe = */
  setTimeout(function() {

    i++;
    //console.log(i);
    if (i == 100) {
      i = 0;

      var now = new Date();
      var memoryUsage = process.memoryUsage();
      memoryUsage.tm = now.getTime() - start.getTime();
      memoryUsage.rss = Math.bytesToSize(memoryUsage.rss);
      memoryUsage.hT = Math.bytesToSize(memoryUsage.heapTotal);
      memoryUsage.hU = Math.bytesToSize(memoryUsage.heapUsed);
      delete memoryUsage.heapTotal;
      delete memoryUsage.heapUsed;
      console.log('memoryUsage', memoryUsage);
    }

    /*
    var memwatch = require('memwatch');
    memwatch.on('stats', function(stats) {
      stats.estimated_base = Math.bytesToSize(stats.estimated_base);
      stats.current_base = Math.bytesToSize(stats.current_base);
      console.log(stats);
    })
    */

    _waitForever();
  }, 1 /*1000 * 100*/);
}

var start = new Date();
_waitForever();
