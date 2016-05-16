/*
  David Lettier (C) 2016
  http://www.lettier.com/
*/

function DistanceCalculator () {
}

DistanceCalculator.prototype.init = function (params) {
  this.initParams = params;
  this.method = params.method;
};

DistanceCalculator.prototype.distance = function (a, b) {
  if (!a || !b) {
    throw "DistanceCalculator - ERROR! a or b undefined";
  }

  if (!a.features || !b.features) {
    throw "DistanceCalculator - ERROR! a.features or b.features undefined";
  }

  if (!fjs.isArray(a.features) || !fjs.isArray(b.features)) {
    throw "DistanceCalculator - ERROR! a.features or b.features not array";
  }

  if (a.features.length !== b.features.length) {
    throw "DistanceCalculator - ERROR! a.features != b.features";
  }

  return this[this.method](a, b);
};

DistanceCalculator.prototype.euclidean = function (a, b) {
  var squaredDeltas = fjs.map(function (aB) {
    return (aB[0] - aB[1]) * (aB[0] - aB[1]);
  }, this._zip(a, b));

  return Math.sqrt(
    fjs.reduce(function (c, d) {
      return c + d;
    }, squaredDeltas)
  );
};

DistanceCalculator.prototype._zip = function (a, b) {
  var zip = [];

  fjs.each(function (_, i) {
    zip.push([a.features[i], b.features[i]]);
  }, a.features);

  return zip;
};
