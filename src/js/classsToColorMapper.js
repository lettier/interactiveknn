/*
  David Lettier (C) 2016
  http://www.lettier.com/
*/

function ClasssToColorMapper () {
}

ClasssToColorMapper.prototype.map = function (classs) {
  return getComputedStyleAttr(classs.toLowerCase() + "Dot", "color");
};

