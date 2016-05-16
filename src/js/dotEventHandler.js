/*
  David Lettier (C) 2016
  http://www.lettier.com/
*/

function DotEventHandler () {}

DotEventHandler.prototype.init = function (params) {
  this.canvas = params.canvas;
};

DotEventHandler.prototype.pressMoveEventHandler = function (event, data) {
  var target = event.target;
  var dot = target.dot;

  this.canvas.updateDot(
    {
      dot: dot,
      x: event.rawX,
      y: event.rawY
    }
  );
};

DotEventHandler.prototype.mouseDownEventHandler = function (event, data) {
  var target = event.target;
  var dot = target.dot;
  var params = dot.initParams;
  var newDot = this.canvas.addDot("baseDots", params);

  this.canvas.removeDot("baseDots", {dot: dot});
  this.canvas.dots.push(dot);

  newDot.view.on(
    "mousedown",
    this.mouseDownEventHandler.bind(this),
    null,
    false
  );

  newDot.view.on(
    "pressmove",
    this.pressMoveEventHandler.bind(this),
    null,
    false
  );
};

DotEventHandler.prototype.enableDragDropBaseDots = function (baseDots) {
  fjs.each(function (baseDot) {
    baseDot.view.on(
      "pressmove",
      this.pressMoveEventHandler.bind(this),
      null,
      false
    );
    baseDot.view.on(
      "mousedown",
      this.mouseDownEventHandler.bind(this),
      null,
      false
    );
  }.bind(this), baseDots);
};
