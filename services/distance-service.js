var distance = require('google-distance');

exports.getDistance = function(queryObj, next) {
  // for testing purposes
  // origin: '37.772886,-122.423771',
  // destination: '37.871601,-122.269104',

  distance.get({
      index: queryObj.index,
      origin: queryObj.origin,
      destination: queryObj.destination,
      units: 'imperial'
    },
    function(err, data) {
      if (err) return next(err);
      return next(null, data);
    });
};
