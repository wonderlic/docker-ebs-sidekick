var AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION
});

var ec2 = new AWS.EC2();
var metadata = new AWS.MetadataService();

var volumeId = process.env.VOLUME_ID;
var instanceId = process.env.INSTANCE_ID || null;  // Read this from the metadata service if not passed in
var device = process.env.DEVICE;

function _getInstanceId(cb) {
  metadata.request('/latest/meta-data/instance-id', function(err, data) {
    if (err) { return cb(err); }
    console.log('Running on instance ' + data);
    cb(null, data);
  });
}

function _detachVolume(cb) {
  console.log('Checking volume ' + volumeId + ' ...');
  ec2.describeVolumes({VolumeIds: [volumeId]}, function(err, data) {
    if (err) { return cb(err); }
    var volume = data.Volumes[0];
    if (volume.Attachments && volume.Attachments.length > 0) {
      console.log('Volume ' + volumeId + ' currently attached to instance ' + volume.Attachments[0].InstanceId);
      console.log('Detaching volume ' + volumeId + ' ...');
      ec2.detachVolume({VolumeId: volumeId}, function(err, data) {
        if (err) { return cb(err); }
        _waitForDetachment(cb);
      });
    } else {
      console.log('Volume ' + volumeId + ' not currently attached');
      cb();
    }
  });
}

function _waitForDetachment(cb) {
  ec2.describeVolumes({VolumeIds: [volumeId]}, function(err, data) {
    if (err) { return cb(err); }
    var volume = data.Volumes[0];
    if (volume.Attachments && volume.Attachments.length > 0) {
      console.log('...waiting for detachment...');
      setTimeout(function() { _waitForDetachment(cb); }, 1000);
    } else {
      console.log('Volume ' + volumeId + ' successfully detached');
      cb();
    }
  });
}

function _attachVolume(cb) {
  console.log('Attaching volume ' + volumeId + ' to instance ' + instanceId + ' on device ' + device + ' ...');
  ec2.attachVolume({VolumeId: volumeId, InstanceId: instanceId, Device: device}, function(err, data) {
    if (err) { return cb(err); }
    _waitForAttachment(cb);
  });
}

function _waitForAttachment(cb) {
  ec2.describeVolumes({VolumeIds: [volumeId]}, function(err, data) {
    if (err) { return cb(err); }
    var volume = data.Volumes[0];
    if (volume.Attachments && volume.Attachments.length > 0 && volume.Attachments[0].State === "attached") {
      console.log('Volume ' + volumeId + ' successfully attached to instance ' + instanceId + ' on device ' + device);
      cb();
    } else {
      console.log('...waiting for attachment...');
      setTimeout(function() { _waitForAttachment(cb); }, 1000);
    }
  });
}

function _waitForever() {
  setTimeout(function() { _waitForever(); }, 100000);
}

function _handleError(err) {
  console.error(err);
  process.exit(1);
}

var _exitInProgress = false;

function _exitProcess() {
  if (!_exitInProgress) {
    _exitInProgress = true;
    _detachVolume(function(err) {
      if (err) {return _handleError(err); }
      process.exit(0);
    });
  }
}

process.on('SIGINT', function() {
  console.log('Received SIGINT. Exiting...');
  _exitProcess();
});

process.on('SIGTERM', function() {
  console.log('Received SIGTERM. Exiting...');
  _exitProcess();
});

// Main processing logic...

function _start() {
  _detachVolume(function(err) {
    if (err) {return _handleError(err); }

    _attachVolume(function(err) {
      if (err) {return _handleError(err); }

      _waitForever();
    })
  });
}

if (instanceId) {
  _start();
} else {
  _getInstanceId(function(err, data) {
    if (err) {return _handleError(err);}
    instanceId = data;
    _start();
  });
}
