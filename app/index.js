
var d3 = require('d3');
require('./main.css');
var RationalBezierCurve = require('../lib/rational-bezier-curve');

var svg = d3.select('#example').append('svg')
  .attr({
    width: 800,
    height: 500
  });

var cx = 400;
var cy = 200;
var rx = 250;
var ry = 100;
var ellipse = { cx: cx, cy: cy, rx: rx, ry: ry }
var ellipses = [ellipse];

var ellipseLayer = svg.append('g').attr('class', 'ellipse-layer');
var controlLayer = svg.append('g').attr('class', 'control-layer');
var curveLayer = svg.append('g').attr('class', 'curve-layer');

ellipseLayer.selectAll('ellipse.reference').data(ellipses)
  .enter().append('ellipse')
  .attr({
    'class': 'reference',
    cx: function(d) { return d.cx; },
    cy: function(d) { return d.cy; },
    rx: function(d) { return d.rx; },
    ry: function(d) { return d.ry; }
  });

var controlPoints = [
  { x: cx + rx, y: cy,      w: 1},
  { x: cx + rx, y: cy - ry, w: 1},
  { x: cx,      y: cy - ry, w: 2}
];
console.log('controlPoints', controlPoints);

function drawControlPoints() {
  controlLayer.selectAll('circle.control').data(controlPoints)
    .enter().append('circle')
    .attr({
      'class': 'control',
      cx: function(d) { return d.x; },
      cy: function(d) { return d.y; },
      r: 4
    });
}
drawControlPoints();


function drawRationalBezierCurve() {
  var i, t;
  var n = 32;
  var curvePoints = [];
  var curve = new RationalBezierCurve(
    [controlPoints[0].x, controlPoints[1].x, controlPoints[2].x],
    [controlPoints[0].y, controlPoints[1].y, controlPoints[2].y],
    [controlPoints[0].w, controlPoints[1].w, controlPoints[2].w]
  );

  console.log(curve);

  for (i = 0; i <= n; i++) {
    t = i / n;
    curvePoints.push(curve.getPointAt(t));
  }
  console.log('curvePoints', curvePoints);
  curveLayer.selectAll('circle.curve').data(curvePoints)
    .enter().append('circle')
    .attr({
      'class': 'curve',
      cx: function(d) { return d.x; },
      cy: function(d) { return d.y; },
      r: 1
    });

  var lines = [];
  for (i = 0; i < n; i++) {
    lines.push({
      x1: curvePoints[i].x,
      y1: curvePoints[i].y,
      x2: curvePoints[i + 1].x,
      y2: curvePoints[i + 1].y
    });
  }
  curveLayer.selectAll('line.curve').data(lines)
    .enter().append('line')
    .attr({
      'class': 'curve',
      x1: function(d) { return d.x1; },
      y1: function(d) { return d.y1; },
      x2: function(d) { return d.x2; },
      y2: function(d) { return d.y2; }
    });
}
drawRationalBezierCurve();
