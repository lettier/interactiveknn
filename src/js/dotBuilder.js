/*
  David Lettier (C) 2016
  http://www.lettier.com/
*/

function DotBuilder () {
}

DotBuilder.prototype.init = function (params) {
  this.stage = params.stage;

  return this;
};

DotBuilder.prototype.buildDot = function (params) {
  var dot = new Dot();
  var displayObject = null;

  params.WIDTH = dot.WIDTH;
  params.HEIGHT = dot.HEIGHT;

  displayObject = this.buildDisplayObject(params, "drawEllipse");

  params.view = displayObject;
  params.id = displayObject.id;
  params.features = [
    displayObject.x,
    displayObject.y
  ];

  dot.init(params);

  displayObject.dot = dot;

  return dot;
};

DotBuilder.prototype.buildDisplayObject = function (params, drawFunct) {
  // Create the Stage shape.
  var shape = new createjs.Shape();

  shape.graphics.beginFill(
    params.color
  )[drawFunct](0, 0, params.WIDTH, params.HEIGHT);

  shape.x = params.x;
  shape.y = params.y;

  shape.regX = params.WIDTH / 2; // The center of the object.
  shape.regY = params.HEIGHT / 2; // The center of the object.

  return this.stage.addChild(shape);
};
