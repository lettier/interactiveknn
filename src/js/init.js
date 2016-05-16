/*
  David Lettier (C) 2016
  http://www.lettier.com/
*/

function init() {
  // The instructions overlay before the game starts.
  var overLay = getNodeById("overlay");

  var application = new Application();
  application.init();

  // Hide the instructions.
  overlay.style.visibility = "hidden";
}

