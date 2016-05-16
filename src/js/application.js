/*
  David Lettier (C) 2016
  http://www.lettier.com/
*/

function Application () {
}

Application.prototype.init = function (params) {
  // Get the window dimensions.
  var windowWidth  = window.innerWidth;
  var windowHeight = window.innerHeight;

  this.classsToColorMapper = new ClasssToColorMapper();

  this.distanceCalculator = new DistanceCalculator();
  this.distanceCalculator.init({
    method: "euclidean"
  });

  this.kNN = new KNN();
  this.kNN.init(
    {
      k: 5,
      distanceCalculator: this.distanceCalculator
    }
  );

  // Create the canvas component.
  // Store the object on this
  // so that it can be accessed in
  // update.
  this.canvas = new Canvas();

  // Initialize the canvas
  // expanding it to the size of the
  // window.
  this.canvas.init(
    {
      canvasId: "canvas",
      bounds: {
        top: 0,
        bottom: windowHeight,
        left: 0,
        right: windowWidth
      },
      sidebar: {
        color: getComputedStyleAttr("baseSidebar", "color"),
        width: getComputedStyleAttr("baseSidebar", "width")
      },
      baseDotsParams: [
        {
          classs: "purple",
          color: this.classsToColorMapper.map("purple")
        },
        {
          classs: "orange",
          color: this.classsToColorMapper.map("orange")
        },
        {
          classs: "yellow",
          color: this.classsToColorMapper.map("yellow")
        },
        {
          classs: "green",
          color: this.classsToColorMapper.map("green")
        },
        {
          classs: "blue",
          color: this.classsToColorMapper.map("blue")
        },
        {
          classs: null,
          color: this.classsToColorMapper.map("gray")
        },
      ]
    }
  );

  // Start the game loop with the first call to update.
  window.requestAnimationFrame(this.update.bind(this));

  // Call reset if the player resizes the browser window.
  window.addEventListener("resize", this.reset.bind(this));

  this.pubSubTokens = [
    [
      "classified",
      PubSub.subscribe(
        "classified",
        this.dotClassified.bind(this)
      )
    ]
  ];

  this.gui = new GUI();

  this.gui.init({application: this});
};

Application.prototype.update = function () {
  var delta = null;

  // Get the current time.
  this.now = Date.now();

  if (!this.then) {
    // If then isn't defined, set it to now.
    this.then = this.now;
  }

  delta = (this.now - this.then) / 1000;

  // Canvas returns true if it is ready.
  if (this.canvas.update(delta) === true) {
      this.requestAnimationFrameId = window.requestAnimationFrame(
        this.update.bind(this)
      );
  } else {
    // Canvas returned false so cancel the next request.
    window.cancelAnimationFrame(this.requestAnimationFrameId);
  }

  // Reset then to now.
  this.then = this.now;
};

Application.prototype.reset = function (params) {
  // Reset all components.
  this.canvas.reset();

  this.gui.reset();

  // Remove all objects listening
  // for messages.
  PubSub.clearAllSubscriptions();

  // Do not listen for the resize event.
  window.removeEventListener("resize", this.reset);

  // Initialize the game over from scratch.
  this.init();
};

Application.prototype.knownDots = function () {
  return fjs.select(
    "x => x.classs !== " + null,
    this.canvas.dots
  );
};

Application.prototype.unknownDots = function () {
  return fjs.select(
    "x => x.classs === " + null,
    this.canvas.dots
  );
};

Application.prototype.runKNN = function () {
  this.kNN.run(
    {
      knownDots: this.knownDots(),
      unknownDots: this.unknownDots()
    }
  );
};

Application.prototype.dotClassified = function (message, params) {
  params.color = this.classsToColorMapper.map(params.classs);

  this.canvas.updateDot(params);
};
