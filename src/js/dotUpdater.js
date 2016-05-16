/*
  David Lettier (C) 2016
  http://www.lettier.com/
*/

function DotUpdater () {}

DotUpdater.prototype.update = function (params) {
  var dot = params.dot;

  if (!dot) {return;}

  fjs.each(function (param) {
    if (params[param]) {
      dot[param] = params[param];
    }
  }.bind(this), [
    "id",
    "x",
    "y",
    "z",
    "classs",
    "color",
    "view"
  ]);

  if (dot.view) {
    this.updateView(params);
  }

  this.updateFeatures(params);

  return dot;
};

DotUpdater.prototype.updateFeatures = function (params) {
  var dot = params.dot;

  if (!dot) {return;}

  dot.features = [];

  fjs.each(function (feature) {
    if (dot[feature]) {
      dot.features.push(dot[feature]);
    }
  }.bind(this), [
    "x",
    "y",
    "z"
  ]);

  return dot.features;
};

DotUpdater.prototype.updateView = function (params) {
  var dot = params.dot;

  if (!dot) {return;}

  if (!dot.view) {return;}

  fjs.each(function (param) {
    if (params[param]) {
      dot.view[param] = params[param];
      dot[param] = params[param];
    }
  }.bind(this), [
    "x",
    "y"
  ]);

  if (params.color) {
    this.updateViewColor(params);
  }

  return dot.view;
};

DotUpdater.prototype.updateViewColor = function (params) {
  var dot = params.dot;
  var color = params.color;

  if (!dot) {return;}

  if (!dot.view || !color) {return;}

  dot.color = color;

  // Change the color used when drawing this
  // object on the canvas.
  dot.view.graphics._fill.style = color;
};
