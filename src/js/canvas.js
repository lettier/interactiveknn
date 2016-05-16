/*
  David Lettier (C) 2016
  http://www.lettier.com/
*/

function Canvas () {
}

Canvas.prototype.init = function (params) {
  this.initParams = params;

  this.bounds = params.bounds;

  this.canvasId = params.canvasId;
  this.canvasNode = getNodeById(this.canvasId);
  this.canvasNode.width  = window.innerWidth;
  this.canvasNode.height = window.innerHeight;
  this.canvasNode.style.width  =  window.innerWidth + "px";
  this.canvasNode.style.height = window.innerHeight + "px";

  this.pubSubTokens = [];

  // Handles drawing all the objects to the canvas.
  this.stage = new createjs.Stage(this.canvasId);

  this.baseDots = [];
  this.dots = [];
  this.dotColors = params.dotColors;
  this.dotBuilder = new DotBuilder();
  this.dotBuilder.init({stage: this.stage});
  this.dotUpdater = new DotUpdater();
  this.dotEventHandler = new DotEventHandler();
  this.dotEventHandler.init({canvas: this});

  this.addSidebar(params.sidebar);
  this.buildBaseDots(params.baseDotsParams);
  this.dotEventHandler.enableDragDropBaseDots(this.baseDots);

  // Need for time-based animation.
  this.delta = 0;

  // If not ready, the Canvas will not update.
  this.ready = true;
};

Canvas.prototype.addSidebar = function (params) {
  this.sidebar = {};

  this.sidebar.width = params.width;
  this.sidebar.height = this.bounds.bottom - this.bounds.top;
  this.sidebar.color = params.color;

  var sidebarShape = new createjs.Shape();

  sidebarShape.graphics.beginFill(
    this.sidebar.color
  ).drawRect(
    0,
    0,
    this.sidebar.width,
    this.sidebar.height
  );

  sidebarShape.x = 0;
  sidebarShape.y = 0;

  this.sidebar.view = this.stage.addChild(sidebarShape);

  return this.sidebar;
};

Canvas.prototype.buildBaseDots = function (baseDotsParams) {
  fjs.each(function (baseDotParams, i) {
    baseDotParams.x = 50;
    baseDotParams.y = 50 + (i * 10) + getComputedStyleAttr("baseDot", "height") * i;

    this.addDot(
      "baseDots",
      baseDotParams
    );
  }.bind(this), baseDotsParams);
};

Canvas.prototype.addDot = function (arrayKey, params) {
  var dot = this.dotBuilder.buildDot(params);

  this[arrayKey].push(
    dot
  );

  return dot;
};

Canvas.prototype.removeDot = function (arrayKey, params) {
  var dot = params.dot;

  this[arrayKey] = fjs.select(
    "x => x.id !== " + dot.id,
    this[arrayKey]
  );

  return dot;
};

Canvas.prototype.updateDot = function (params) {
  this.dotUpdater.update(params);
};

Canvas.prototype.update = function (delta) {
  // If not ready, just exit.
  if (this.ready === false) {return false;}

  // Update the delta for this current update.
  this.delta = delta;

  // Clear and redraw the canvas.
  this.stage.update();

  return true;
};

Canvas.prototype.reset = function () {
  // Signal that the canvas is not ready for updating.
  this.ready = false;

  // Clear out all objects.
  this.baseDots = [];
  this.dots = [];
  this.dotBuilder = undefined;
  this.dotUpdater = undefined;
  this.dotEventHandler = undefined;

  // Clear the stage.
  this.stage.removeAllChildren();
  this.stage.removeAllEventListeners();
  this.stage = undefined;

  // Unsubscribe from all messages.
  fjs.each(function (pubSubToken) {
    PubSub.unsubscribe(pubSubToken[1]);
  }.bind(this), this.pubSubTokens);
};
