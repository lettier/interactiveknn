/*
  David Lettier (C) 2016
  http://www.lettier.com/
*/

function GUI () {
}

GUI.prototype.init = function (params) {
  var application = params.application;

  this.datGUI = new dat.GUI();
  this.datGUI.add(application.kNN, 'k').min(1).max(20).step(1).listen();
  this.datGUI.add(application, 'runKNN');
  this.datGUI.add(application, 'reset');
};

GUI.prototype.reset = function () {
  this.datGUI.destroy();
  this.datGUI = undefined;
};
