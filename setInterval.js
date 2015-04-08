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

var start = new Date();
var i = 0;
var waitForever = setInterval(function() {

  i++;
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
}, 1);
