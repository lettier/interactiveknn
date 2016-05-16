/*
  David Lettier (C) 2016
  http://www.lettier.com/
*/

function getComputedStyleAttr(nodeId, styleAttr) {
  var node = getNodeById(nodeId);
  var style = getComputedStyle(node)[styleAttr];

  if (style && style.indexOf("px") > -1) {
    style = parseInt(style.replace("px"), 10);
  }

  return style;
}

function getNodeById(id) {
  return document.getElementById(id);
}

// Returns an array: [min, min + step, ..., max].
function range(min, max, step) {
  var r = [];

  if (typeof(step) === "undefined") {
    step = 1;
  }

  if (min && max && step) {
    while (min <= max) {
      r.push(min);
      min += step;
    }
  }

  return r;
}
