/*
  David Lettier (C) 2016
  http://www.lettier.com/
*/

function Dot () {}

Dot.prototype.init = function (params) {
  this.initParams = params;
  this.id = params.id;
  this.x = params.x;
  this.y = params.y;
  this.z = params.z;
  this.features = params.features || [];
  this.classs = params.classs;
  this.color = params.color;
  this.view = params.view; // The Stage object.
};

Dot.prototype.WIDTH = (function () {
  // Get the height from the hidden ballLeft element.
  var attr = getComputedStyleAttr("baseDot", "width");

  return attr;
})();

Dot.prototype.HEIGHT = (function () {
  // Get the height from the hidden ballLeft element.
  var attr = getComputedStyleAttr("baseDot", "height");

  return attr;
})();

