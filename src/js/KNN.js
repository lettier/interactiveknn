/*
  David Lettier (C) 2016
  http://www.lettier.com/
*/

function KNN () {
}

KNN.prototype.init = function (params) {
  this.k = params.k;
  this.distanceCalculator = params.distanceCalculator;
};

KNN.prototype.run = function (params) {
  if (typeof(this.k) !== "number") {return;}
  if (this.k <= 0) {return;}

  this.k = parseInt(this.k, 10);

  this.knownDots = params.knownDots;
  this.unknownDots = params.unknownDots;

  if (!this.knownDots || !this.unknownDots) {return;}
  if (this.knownDots.length < 1 || this.unknownDots.length < 1) {return;}
  if (this.knownDots.length < this.k) {
    this.k = this.knownDots.length;
  }

  if (this._setUpCycle()) {
    window.requestAnimationFrame(this._cycle.bind(this));
  }
};

KNN.prototype._setUpCycle = function () {
  this.currentDot = fjs.first(
    "x => true",
    this.unknownDots
  );

  if (!this.currentDot) {return false;}

  this.unknownDots = fjs.select(
    "x => x.id !== " + this.currentDot.id,
    this.unknownDots
  );

  return true;
};

KNN.prototype._cycle = function () {
  this._distances();
  this._sortDistances();
  this._kNearestNeighbors();
  this._classsByVote();

  if (this.unknownDots.length > 0) {
    if (this._setUpCycle()) {
      window.requestAnimationFrame(this._cycle.bind(this));
    }
  }
};

KNN.prototype._distances = function () {
  this.currentDot.distances = fjs.map(
    function (knownDot) {
      return [
        this.distanceCalculator.distance(
          knownDot,
          this.currentDot
        ),
        knownDot
      ];
    }.bind(this),
    this.knownDots
  );
};

KNN.prototype._sortDistances = function () {
  this.currentDot.distances.sort(function (a, b) {
    return a[0] - b[0];
  });
};

KNN.prototype._kNearestNeighbors = function () {
  this.currentDot.kNearestNeighbors = this.currentDot.distances.slice(
    0,
    this.k
  );
};

KNN.prototype._classsByVote = function () {
  var dot = null;
  var classs = null;
  var classsCount = {};

  fjs.each(function (kNearestNeighbor) {
    var classs = kNearestNeighbor[1].classs;

    classsCount[classs] = classsCount[classs] || 0;
    classsCount[classs] += 1;
  }.bind(this), this.currentDot.kNearestNeighbors);

  classs = fjs.first(
    "x => true",
    fjs.best(function (a, b) {
      return a[1] > b[1];
    }.bind(this), fjs.toArray(classsCount))
  );

  dot = this.currentDot;

  PubSub.publish(
    "classified",
    {
      dot: dot,
      classs: classs
    }
  );
};
