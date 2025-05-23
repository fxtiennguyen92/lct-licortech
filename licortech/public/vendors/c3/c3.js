/* @license C3.js v0.7.20 | (c) C3 Team and other contributors | http://c3js.org/ */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.c3 = factory());
}(this, (function () { 'use strict';

  function ChartInternal(api) {
      var $$ = this;
      // Note: This part will be replaced by rollup-plugin-modify
      // When bundling esm output. Beware of changing this line.
      // TODO: Maybe we should check that the modification by rollup-plugin-modify
      // is valid during unit tests.
      $$.d3 = window.d3
          ? window.d3
          : typeof require !== 'undefined'
              ? require('d3')
              : undefined;
      $$.api = api;
      $$.config = $$.getDefaultConfig();
      $$.data = {};
      $$.cache = {};
      $$.axes = {};
  }

  /**
   * The Chart class
   *
   * The methods of this class is the public APIs of the chart object.
   */
  function Chart(config) {
      this.internal = new ChartInternal(this);
      this.internal.loadConfig(config);
      this.internal.beforeInit(config);
      this.internal.init();
      this.internal.afterInit(config);
      (function bindThis(fn, target, argThis) {
          Object.keys(fn).forEach(function (key) {
              target[key] = fn[key].bind(argThis);
              if (Object.keys(fn[key]).length > 0) {
                  bindThis(fn[key], target[key], argThis);
              }
          });
      })(Chart.prototype, this, this);
  }

  var asHalfPixel = function (n) {
      return Math.ceil(n) + 0.5;
  };
  var ceil10 = function (v) {
      return Math.ceil(v / 10) * 10;
  };
  var diffDomain = function (d) {
      return d[1] - d[0];
  };
  var getOption = function (options, key, defaultValue) {
      return isDefined(options[key]) ? options[key] : defaultValue;
  };
  var getPathBox = function (path) {
      var box = getBBox(path), items = [path.pathSegList.getItem(0), path.pathSegList.getItem(1)], minX = items[0].x, minY = Math.min(items[0].y, items[1].y);
      return { x: minX, y: minY, width: box.width, height: box.height };
  };
  var getBBox = function (element) {
      try {
          return element.getBBox();
      }
      catch (ignore) {
          // Firefox will throw an exception if getBBox() is called whereas the
          // element is rendered with display:none
          // See https://github.com/c3js/c3/issues/2692
          // The previous code was using `getBoundingClientRect` which was returning
          // everything at 0 in this case so let's reproduce this behavior here.
          return { x: 0, y: 0, width: 0, height: 0 };
      }
  };
  var hasValue = function (dict, value) {
      var found = false;
      Object.keys(dict).forEach(function (key) {
          if (dict[key] === value) {
              found = true;
          }
      });
      return found;
  };
  var isArray = function (o) {
      return Array.isArray(o);
  };
  var isDefined = function (v) {
      return typeof v !== 'undefined';
  };
  var isEmpty = function (o) {
      return (typeof o === 'undefined' ||
          o === null ||
          (isString(o) && o.length === 0) ||
          (typeof o === 'object' && Object.keys(o).length === 0));
  };
  var isFunction = function (o) {
      return typeof o === 'function';
  };
  var isNumber = function (o) {
      return typeof o === 'number';
  };
  var isString = function (o) {
      return typeof o === 'string';
  };
  var isUndefined = function (v) {
      return typeof v === 'undefined';
  };
  var isValue = function (v) {
      return v || v === 0;
  };
  var notEmpty = function (o) {
      return !isEmpty(o);
  };
  var sanitise = function (str) {
      return typeof str === 'string'
          ? str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
          : str;
  };
  var flattenArray = function (arr) {
      return Array.isArray(arr) ? [].concat.apply([], arr) : [];
  };
  /**
   * Returns whether the point is within the given box.
   *
   * @param {Array} point An [x,y] coordinate
   * @param {Object} box An object with {x, y, width, height} keys
   * @param {Number} sensitivity An offset to ease check on very small boxes
   */
  var isWithinBox = function (point, box, sensitivity) {
      if (sensitivity === void 0) { sensitivity = 0; }
      var xStart = box.x - sensitivity;
      var xEnd = box.x + box.width + sensitivity;
      var yStart = box.y + box.height + sensitivity;
      var yEnd = box.y - sensitivity;
      return (xStart < point[0] && point[0] < xEnd && yEnd < point[1] && point[1] < yStart);
  };
  /**
   * Returns Internet Explorer version number (or false if no Internet Explorer used).
   *
   * @param string agent Optional parameter to specify user agent
   */
  var getIEVersion = function (agent) {
      // https://stackoverflow.com/questions/19999388/check-if-user-is-using-ie
      if (typeof agent === 'undefined') {
          agent = window.navigator.userAgent;
      }
      var pos = agent.indexOf('MSIE '); // up to IE10
      if (pos > 0) {
          return parseInt(agent.substring(pos + 5, agent.indexOf('.', pos)), 10);
      }
      pos = agent.indexOf('Trident/'); // IE11
      if (pos > 0) {
          pos = agent.indexOf('rv:');
          return parseInt(agent.substring(pos + 3, agent.indexOf('.', pos)), 10);
      }
      return false;
  };
  /**
   * Returns whether the used browser is Internet Explorer.
   *
   * @param version Optional parameter to specify IE version
   */
  var isIE = function (version) {
      var ver = getIEVersion();
      if (typeof version === 'undefined') {
          return !!ver;
      }
      return version === ver;
  };

  function AxisInternal(component, params) {
      var internal = this;
      internal.component = component;
      internal.params = params || {};
      internal.d3 = component.d3;
      internal.scale = internal.d3.scaleLinear();
      internal.range;
      internal.orient = 'bottom';
      internal.innerTickSize = 6;
      internal.outerTickSize = this.params.withOuterTick ? 6 : 0;
      internal.tickPadding = 3;
      internal.tickValues = null;
      internal.tickFormat;
      internal.tickArguments;
      internal.tickOffset = 0;
      internal.tickCulling = true;
      internal.tickCentered;
      internal.tickTextCharSize;
      internal.tickTextRotate = internal.params.tickTextRotate;
      internal.tickLength;
      internal.axis = internal.generateAxis();
  }
  AxisInternal.prototype.axisX = function (selection, x, tickOffset) {
      selection.attr('transform', function (d) {
          return 'translate(' + Math.ceil(x(d) + tickOffset) + ', 0)';
      });
  };
  AxisInternal.prototype.axisY = function (selection, y) {
      selection.attr('transform', function (d) {
          return 'translate(0,' + Math.ceil(y(d)) + ')';
      });
  };
  AxisInternal.prototype.scaleExtent = function (domain) {
      var start = domain[0], stop = domain[domain.length - 1];
      return start < stop ? [start, stop] : [stop, start];
  };
  AxisInternal.prototype.generateTicks = function (scale) {
      var internal = this;
      var i, domain, ticks = [];
      if (scale.ticks) {
          return scale.ticks.apply(scale, internal.tickArguments);
      }
      domain = scale.domain();
      for (i = Math.ceil(domain[0]); i < domain[1]; i++) {
          ticks.push(i);
      }
      if (ticks.length > 0 && ticks[0] > 0) {
          ticks.unshift(ticks[0] - (ticks[1] - ticks[0]));
      }
      return ticks;
  };
  AxisInternal.prototype.copyScale = function () {
      var internal = this;
      var newScale = internal.scale.copy(), domain;
      if (internal.params.isCategory) {
          domain = internal.scale.domain();
          newScale.domain([domain[0], domain[1] - 1]);
      }
      return newScale;
  };
  AxisInternal.prototype.textFormatted = function (v) {
      var internal = this, formatted = internal.tickFormat ? internal.tickFormat(v) : v;
      return typeof formatted !== 'undefined' ? formatted : '';
  };
  AxisInternal.prototype.updateRange = function () {
      var internal = this;
      internal.range = internal.scale.rangeExtent
          ? internal.scale.rangeExtent()
          : internal.scaleExtent(internal.scale.range());
      return internal.range;
  };
  AxisInternal.prototype.updateTickTextCharSize = function (tick) {
      var internal = this;
      if (internal.tickTextCharSize) {
          return internal.tickTextCharSize;
      }
      var size = {
          h: 11.5,
          w: 5.5
      };
      tick
          .select('text')
          .text(function (d) {
          return internal.textFormatted(d);
      })
          .each(function (d) {
          var box = getBBox(this), text = internal.textFormatted(d), h = box.height, w = text ? box.width / text.length : undefined;
          if (h && w) {
              size.h = h;
              size.w = w;
          }
      })
          .text('');
      internal.tickTextCharSize = size;
      return size;
  };
  AxisInternal.prototype.isVertical = function () {
      return this.orient === 'left' || this.orient === 'right';
  };
  AxisInternal.prototype.tspanData = function (d, i, scale) {
      var internal = this;
      var splitted = internal.params.tickMultiline
          ? internal.splitTickText(d, scale)
          : [].concat(internal.textFormatted(d));
      if (internal.params.tickMultiline && internal.params.tickMultilineMax > 0) {
          splitted = internal.ellipsify(splitted, internal.params.tickMultilineMax);
      }
      return splitted.map(function (s) {
          return { index: i, splitted: s, length: splitted.length };
      });
  };
  AxisInternal.prototype.splitTickText = function (d, scale) {
      var internal = this, tickText = internal.textFormatted(d), maxWidth = internal.params.tickWidth, subtext, spaceIndex, textWidth, splitted = [];
      if (Object.prototype.toString.call(tickText) === '[object Array]') {
          return tickText;
      }
      if (!maxWidth || maxWidth <= 0) {
          maxWidth = internal.isVertical()
              ? 95
              : internal.params.isCategory
                  ? Math.ceil(scale(1) - scale(0)) - 12
                  : 110;
      }
      function split(splitted, text) {
          spaceIndex = undefined;
          for (var i = 1; i < text.length; i++) {
              if (text.charAt(i) === ' ') {
                  spaceIndex = i;
              }
              subtext = text.substr(0, i + 1);
              textWidth = internal.tickTextCharSize.w * subtext.length;
              // if text width gets over tick width, split by space index or crrent index
              if (maxWidth < textWidth) {
                  return split(splitted.concat(text.substr(0, spaceIndex ? spaceIndex : i)), text.slice(spaceIndex ? spaceIndex + 1 : i));
              }
          }
          return splitted.concat(text);
      }
      return split(splitted, tickText + '');
  };
  AxisInternal.prototype.ellipsify = function (splitted, max) {
      if (splitted.length <= max) {
          return splitted;
      }
      var ellipsified = splitted.slice(0, max);
      var remaining = 3;
      for (var i = max - 1; i >= 0; i--) {
          var available = ellipsified[i].length;
          ellipsified[i] = ellipsified[i]
              .substr(0, available - remaining)
              .padEnd(available, '.');
          remaining -= available;
          if (remaining <= 0) {
              break;
          }
      }
      return ellipsified;
  };
  AxisInternal.prototype.updateTickLength = function () {
      var internal = this;
      internal.tickLength =
          Math.max(internal.innerTickSize, 0) + internal.tickPadding;
  };
  AxisInternal.prototype.lineY2 = function (d) {
      var internal = this, tickPosition = internal.scale(d) + (internal.tickCentered ? 0 : internal.tickOffset);
      return internal.range[0] < tickPosition && tickPosition < internal.range[1]
          ? internal.innerTickSize
          : 0;
  };
  AxisInternal.prototype.textY = function () {
      var internal = this, rotate = internal.tickTextRotate;
      return rotate
          ? 11.5 - 2.5 * (rotate / 15) * (rotate > 0 ? 1 : -1)
          : internal.tickLength;
  };
  AxisInternal.prototype.textTransform = function () {
      var internal = this, rotate = internal.tickTextRotate;
      return rotate ? 'rotate(' + rotate + ')' : '';
  };
  AxisInternal.prototype.textTextAnchor = function () {
      var internal = this, rotate = internal.tickTextRotate;
      return rotate ? (rotate > 0 ? 'start' : 'end') : 'middle';
  };
  AxisInternal.prototype.tspanDx = function () {
      var internal = this, rotate = internal.tickTextRotate;
      return rotate ? 8 * Math.sin(Math.PI * (rotate / 180)) : 0;
  };
  AxisInternal.prototype.tspanDy = function (d, i) {
      var internal = this, dy = internal.tickTextCharSize.h;
      if (i === 0) {
          if (internal.isVertical()) {
              dy = -((d.length - 1) * (internal.tickTextCharSize.h / 2) - 3);
          }
          else {
              dy = '.71em';
          }
      }
      return dy;
  };
  AxisInternal.prototype.generateAxis = function () {
      var internal = this, d3 = internal.d3, params = internal.params;
      function axis(g, transition) {
          var self;
          g.each(function () {
              var g = (axis.g = d3.select(this));
              var scale0 = this.__chart__ || internal.scale, scale1 = (this.__chart__ = internal.copyScale());
              var ticksValues = internal.tickValues
                  ? internal.tickValues
                  : internal.generateTicks(scale1), ticks = g.selectAll('.tick').data(ticksValues, scale1), tickEnter = ticks
                  .enter()
                  .insert('g', '.domain')
                  .attr('class', 'tick')
                  .style('opacity', 1e-6), 
              // MEMO: No exit transition. The reason is this transition affects max tick width calculation because old tick will be included in the ticks.
              tickExit = ticks.exit().remove(), tickUpdate = ticks.merge(tickEnter), tickTransform, tickX, tickY;
              if (params.isCategory) {
                  internal.tickOffset = Math.ceil((scale1(1) - scale1(0)) / 2);
                  tickX = internal.tickCentered ? 0 : internal.tickOffset;
                  tickY = internal.tickCentered ? internal.tickOffset : 0;
              }
              else {
                  internal.tickOffset = tickX = 0;
              }
              internal.updateRange();
              internal.updateTickLength();
              internal.updateTickTextCharSize(g.select('.tick'));
              var lineUpdate = tickUpdate
                  .select('line')
                  .merge(tickEnter.append('line')), textUpdate = tickUpdate.select('text').merge(tickEnter.append('text'));
              var tspans = tickUpdate
                  .selectAll('text')
                  .selectAll('tspan')
                  .data(function (d, i) {
                  return internal.tspanData(d, i, scale1);
              }), tspanEnter = tspans.enter().append('tspan'), tspanUpdate = tspanEnter.merge(tspans).text(function (d) {
                  return d.splitted;
              });
              tspans.exit().remove();
              var path = g.selectAll('.domain').data([0]), pathUpdate = path
                  .enter()
                  .append('path')
                  .merge(path)
                  .attr('class', 'domain');
              // TODO: each attr should be one function and change its behavior by internal.orient, probably
              switch (internal.orient) {
                  case 'bottom': {
                      tickTransform = internal.axisX;
                      lineUpdate
                          .attr('x1', tickX)
                          .attr('x2', tickX)
                          .attr('y2', function (d, i) {
                          return internal.lineY2(d, i);
                      });
                      textUpdate
                          .attr('x', 0)
                          .attr('y', function (d, i) {
                          return internal.textY(d, i);
                      })
                          .attr('transform', function (d, i) {
                          return internal.textTransform(d, i);
                      })
                          .style('text-anchor', function (d, i) {
                          return internal.textTextAnchor(d, i);
                      });
                      tspanUpdate
                          .attr('x', 0)
                          .attr('dy', function (d, i) {
                          return internal.tspanDy(d, i);
                      })
                          .attr('dx', function (d, i) {
                          return internal.tspanDx(d, i);
                      });
                      pathUpdate.attr('d', 'M' +
                          internal.range[0] +
                          ',' +
                          internal.outerTickSize +
                          'V0H' +
                          internal.range[1] +
                          'V' +
                          internal.outerTickSize);
                      break;
                  }
                  case 'top': {
                      // TODO: rotated tick text
                      tickTransform = internal.axisX;
                      lineUpdate
                          .attr('x1', tickX)
                          .attr('x2', tickX)
                          .attr('y2', function (d, i) {
                          return -1 * internal.lineY2(d, i);
                      });
                      textUpdate
                          .attr('x', 0)
                          .attr('y', function (d, i) {
                          return (-1 * internal.textY(d, i) -
                              (params.isCategory ? 2 : internal.tickLength - 2));
                      })
                          .attr('transform', function (d, i) {
                          return internal.textTransform(d, i);
                      })
                          .style('text-anchor', function (d, i) {
                          return internal.textTextAnchor(d, i);
                      });
                      tspanUpdate
                          .attr('x', 0)
                          .attr('dy', function (d, i) {
                          return internal.tspanDy(d, i);
                      })
                          .attr('dx', function (d, i) {
                          return internal.tspanDx(d, i);
                      });
                      pathUpdate.attr('d', 'M' +
                          internal.range[0] +
                          ',' +
                          -internal.outerTickSize +
                          'V0H' +
                          internal.range[1] +
                          'V' +
                          -internal.outerTickSize);
                      break;
                  }
                  case 'left': {
                      tickTransform = internal.axisY;
                      lineUpdate
                          .attr('x2', -internal.innerTickSize)
                          .attr('y1', tickY)
                          .attr('y2', tickY);
                      textUpdate
                          .attr('x', -internal.tickLength)
                          .attr('y', internal.tickOffset)
                          .style('text-anchor', 'end');
                      tspanUpdate
                          .attr('x', -internal.tickLength)
                          .attr('dy', function (d, i) {
                          return internal.tspanDy(d, i);
                      });
                      pathUpdate.attr('d', 'M' +
                          -internal.outerTickSize +
                          ',' +
                          internal.range[0] +
                          'H0V' +
                          internal.range[1] +
                          'H' +
                          -internal.outerTickSize);
                      break;
                  }
                  case 'right': {
                      tickTransform = internal.axisY;
                      lineUpdate
                          .attr('x2', internal.innerTickSize)
                          .attr('y1', tickY)
                          .attr('y2', tickY);
                      textUpdate
                          .attr('x', internal.tickLength)
                          .attr('y', internal.tickOffset)
                          .style('text-anchor', 'start');
                      tspanUpdate.attr('x', internal.tickLength).attr('dy', function (d, i) {
                          return internal.tspanDy(d, i);
                      });
                      pathUpdate.attr('d', 'M' +
                          internal.outerTickSize +
                          ',' +
                          internal.range[0] +
                          'H0V' +
                          internal.range[1] +
                          'H' +
                          internal.outerTickSize);
                      break;
                  }
              }
              if (scale1.rangeBand) {
                  var x = scale1, dx = x.rangeBand() / 2;
                  scale0 = scale1 = function (d) {
                      return x(d) + dx;
                  };
              }
              else if (scale0.rangeBand) {
                  scale0 = scale1;
              }
              else {
                  tickExit.call(tickTransform, scale1, internal.tickOffset);
              }
              tickEnter.call(tickTransform, scale0, internal.tickOffset);
              self = (transition ? tickUpdate.transition(transition) : tickUpdate)
                  .style('opacity', 1)
                  .call(tickTransform, scale1, internal.tickOffset);
          });
          return self;
      }
      axis.scale = function (x) {
          if (!arguments.length) {
              return internal.scale;
          }
          internal.scale = x;
          return axis;
      };
      axis.orient = function (x) {
          if (!arguments.length) {
              return internal.orient;
          }
          internal.orient =
              x in { top: 1, right: 1, bottom: 1, left: 1 } ? x + '' : 'bottom';
          return axis;
      };
      axis.tickFormat = function (format) {
          if (!arguments.length) {
              return internal.tickFormat;
          }
          internal.tickFormat = format;
          return axis;
      };
      axis.tickCentered = function (isCentered) {
          if (!arguments.length) {
              return internal.tickCentered;
          }
          internal.tickCentered = isCentered;
          return axis;
      };
      axis.tickOffset = function () {
          return internal.tickOffset;
      };
      axis.tickInterval = function () {
          var interval, length;
          if (params.isCategory) {
              interval = internal.tickOffset * 2;
          }
          else {
              length =
                  axis.g
                      .select('path.domain')
                      .node()
                      .getTotalLength() -
                      internal.outerTickSize * 2;
              interval = length / axis.g.selectAll('line').size();
          }
          return interval === Infinity ? 0 : interval;
      };
      axis.ticks = function () {
          if (!arguments.length) {
              return internal.tickArguments;
          }
          internal.tickArguments = arguments;
          return axis;
      };
      axis.tickCulling = function (culling) {
          if (!arguments.length) {
              return internal.tickCulling;
          }
          internal.tickCulling = culling;
          return axis;
      };
      axis.tickValues = function (x) {
          if (typeof x === 'function') {
              internal.tickValues = function () {
                  return x(internal.scale.domain());
              };
          }
          else {
              if (!arguments.length) {
                  return internal.tickValues;
              }
              internal.tickValues = x;
          }
          return axis;
      };
      return axis;
  };

  var CLASS = {
      target: 'c3-target',
      chart: 'c3-chart',
      chartLine: 'c3-chart-line',
      chartLines: 'c3-chart-lines',
      chartBar: 'c3-chart-bar',
      chartBars: 'c3-chart-bars',
      chartText: 'c3-chart-text',
      chartTexts: 'c3-chart-texts',
      chartArc: 'c3-chart-arc',
      chartArcs: 'c3-chart-arcs',
      chartArcsTitle: 'c3-chart-arcs-title',
      chartArcsBackground: 'c3-chart-arcs-background',
      chartArcsGaugeUnit: 'c3-chart-arcs-gauge-unit',
      chartArcsGaugeMax: 'c3-chart-arcs-gauge-max',
      chartArcsGaugeMin: 'c3-chart-arcs-gauge-min',
      selectedCircle: 'c3-selected-circle',
      selectedCircles: 'c3-selected-circles',
      eventRect: 'c3-event-rect',
      eventRects: 'c3-event-rects',
      eventRectsSingle: 'c3-event-rects-single',
      eventRectsMultiple: 'c3-event-rects-multiple',
      zoomRect: 'c3-zoom-rect',
      brush: 'c3-brush',
      dragZoom: 'c3-drag-zoom',
      focused: 'c3-focused',
      defocused: 'c3-defocused',
      region: 'c3-region',
      regions: 'c3-regions',
      title: 'c3-title',
      tooltipContainer: 'c3-tooltip-container',
      tooltip: 'c3-tooltip',
      tooltipName: 'c3-tooltip-name',
      shape: 'c3-shape',
      shapes: 'c3-shapes',
      line: 'c3-line',
      lines: 'c3-lines',
      bar: 'c3-bar',
      bars: 'c3-bars',
      circle: 'c3-circle',
      circles: 'c3-circles',
      arc: 'c3-arc',
      arcLabelLine: 'c3-arc-label-line',
      arcs: 'c3-arcs',
      area: 'c3-area',
      areas: 'c3-areas',
      empty: 'c3-empty',
      text: 'c3-text',
      texts: 'c3-texts',
      gaugeValue: 'c3-gauge-value',
      grid: 'c3-grid',
      gridLines: 'c3-grid-lines',
      xgrid: 'c3-xgrid',
      xgrids: 'c3-xgrids',
      xgridLine: 'c3-xgrid-line',
      xgridLines: 'c3-xgrid-lines',
      xgridFocus: 'c3-xgrid-focus',
      ygrid: 'c3-ygrid',
      ygrids: 'c3-ygrids',
      ygridLine: 'c3-ygrid-line',
      ygridLines: 'c3-ygrid-lines',
      colorScale: 'c3-colorscale',
      stanfordElements: 'c3-stanford-elements',
      stanfordLine: 'c3-stanford-line',
      stanfordLines: 'c3-stanford-lines',
      stanfordRegion: 'c3-stanford-region',
      stanfordRegions: 'c3-stanford-regions',
      stanfordText: 'c3-stanford-text',
      stanfordTexts: 'c3-stanford-texts',
      axis: 'c3-axis',
      axisX: 'c3-axis-x',
      axisXLabel: 'c3-axis-x-label',
      axisY: 'c3-axis-y',
      axisYLabel: 'c3-axis-y-label',
      axisY2: 'c3-axis-y2',
      axisY2Label: 'c3-axis-y2-label',
      legendBackground: 'c3-legend-background',
      legendItem: 'c3-legend-item',
      legendItemEvent: 'c3-legend-item-event',
      legendItemTile: 'c3-legend-item-tile',
      legendItemHidden: 'c3-legend-item-hidden',
      legendItemFocused: 'c3-legend-item-focused',
      dragarea: 'c3-dragarea',
      EXPANDED: '_expanded_',
      SELECTED: '_selected_',
      INCLUDED: '_included_'
  };

  var AxisClass = /** @class */ (function () {
      function AxisClass(owner) {
          this.owner = owner;
          this.d3 = owner.d3;
          this.internal = AxisInternal;
      }
      return AxisClass;
  }());
  var Axis = AxisClass;
  Axis.prototype.init = function init() {
      var $$ = this.owner, config = $$.config, main = $$.main;
      $$.axes.x = main
          .append('g')
          .attr('class', CLASS.axis + ' ' + CLASS.axisX)
          .attr('clip-path', config.axis_x_inner ? '' : $$.clipPathForXAxis)
          .attr('transform', $$.getTranslate('x'))
          .style('visibility', config.axis_x_show ? 'visible' : 'hidden');
      $$.axes.x
          .append('text')
          .attr('class', CLASS.axisXLabel)
          .attr('transform', config.axis_rotated ? 'rotate(-90)' : '')
          .style('text-anchor', this.textAnchorForXAxisLabel.bind(this));
      $$.axes.y = main
          .append('g')
          .attr('class', CLASS.axis + ' ' + CLASS.axisY)
          .attr('clip-path', config.axis_y_inner ? '' : $$.clipPathForYAxis)
          .attr('transform', $$.getTranslate('y'))
          .style('visibility', config.axis_y_show ? 'visible' : 'hidden');
      $$.axes.y
          .append('text')
          .attr('class', CLASS.axisYLabel)
          .attr('transform', config.axis_rotated ? '' : 'rotate(-90)')
          .style('text-anchor', this.textAnchorForYAxisLabel.bind(this));
      $$.axes.y2 = main
          .append('g')
          .attr('class', CLASS.axis + ' ' + CLASS.axisY2)
          // clip-path?
          .attr('transform', $$.getTranslate('y2'))
          .style('visibility', config.axis_y2_show ? 'visible' : 'hidden');
      $$.axes.y2
          .append('text')
          .attr('class', CLASS.axisY2Label)
          .attr('transform', config.axis_rotated ? '' : 'rotate(-90)')
          .style('text-anchor', this.textAnchorForY2AxisLabel.bind(this));
  };
  Axis.prototype.getXAxis = function getXAxis(scale, orient, tickFormat, tickValues, withOuterTick, withoutTransition, withoutRotateTickText) {
      var $$ = this.owner, config = $$.config, axisParams = {
          isCategory: $$.isCategorized(),
          withOuterTick: withOuterTick,
          tickMultiline: config.axis_x_tick_multiline,
          tickMultilineMax: config.axis_x_tick_multiline
              ? Number(config.axis_x_tick_multilineMax)
              : 0,
          tickWidth: config.axis_x_tick_width,
          tickTextRotate: withoutRotateTickText ? 0 : config.axis_x_tick_rotate,
          withoutTransition: withoutTransition
      }, axis = new this.internal(this, axisParams).axis.scale(scale).orient(orient);
      if ($$.isTimeSeries() && tickValues && typeof tickValues !== 'function') {
          tickValues = tickValues.map(function (v) {
              return $$.parseDate(v);
          });
      }
      // Set tick
      axis.tickFormat(tickFormat).tickValues(tickValues);
      if ($$.isCategorized()) {
          axis.tickCentered(config.axis_x_tick_centered);
          if (isEmpty(config.axis_x_tick_culling)) {
              config.axis_x_tick_culling = false;
          }
      }
      return axis;
  };
  Axis.prototype.updateXAxisTickValues = function updateXAxisTickValues(targets, axis) {
      var $$ = this.owner, config = $$.config, tickValues;
      if (config.axis_x_tick_fit || config.axis_x_tick_count) {
          tickValues = this.generateTickValues($$.mapTargetsToUniqueXs(targets), config.axis_x_tick_count, $$.isTimeSeries());
      }
      if (axis) {
          axis.tickValues(tickValues);
      }
      else {
          $$.xAxis.tickValues(tickValues);
          $$.subXAxis.tickValues(tickValues);
      }
      return tickValues;
  };
  Axis.prototype.getYAxis = function getYAxis(axisId, scale, orient, tickValues, withOuterTick, withoutTransition, withoutRotateTickText) {
      var $$ = this.owner;
      var config = $$.config;
      var tickFormat = config["axis_" + axisId + "_tick_format"];
      if (!tickFormat && $$.isAxisNormalized(axisId)) {
          tickFormat = function (x) { return x + "%"; };
      }
      var axis = new this.internal(this, {
          withOuterTick: withOuterTick,
          withoutTransition: withoutTransition,
          tickTextRotate: withoutRotateTickText ? 0 : config.axis_y_tick_rotate
      }).axis
          .scale(scale)
          .orient(orient);
      if (tickFormat) {
          axis.tickFormat(tickFormat);
      }
      if ($$.isTimeSeriesY()) {
          axis.ticks(config.axis_y_tick_time_type, config.axis_y_tick_time_interval);
      }
      else {
          axis.tickValues(tickValues);
      }
      return axis;
  };
  Axis.prototype.getId = function getId(id) {
      var config = this.owner.config;
      return id in config.data_axes ? config.data_axes[id] : 'y';
  };
  Axis.prototype.getXAxisTickFormat = function getXAxisTickFormat() {
      // #2251 previously set any negative values to a whole number,
      // however both should be truncated according to the users format specification
      var $$ = this.owner, config = $$.config;
      var format = $$.isTimeSeries()
          ? $$.defaultAxisTimeFormat
          : $$.isCategorized()
              ? $$.categoryName
              : function (v) {
                  return v;
              };
      if (config.axis_x_tick_format) {
          if (isFunction(config.axis_x_tick_format)) {
              format = config.axis_x_tick_format;
          }
          else if ($$.isTimeSeries()) {
              format = function (date) {
                  return date ? $$.axisTimeFormat(config.axis_x_tick_format)(date) : '';
              };
          }
      }
      return isFunction(format)
          ? function (v) {
              return format.call($$, v);
          }
          : format;
  };
  Axis.prototype.getTickValues = function getTickValues(tickValues, axis) {
      return tickValues ? tickValues : axis ? axis.tickValues() : undefined;
  };
  Axis.prototype.getXAxisTickValues = function getXAxisTickValues() {
      return this.getTickValues(this.owner.config.axis_x_tick_values, this.owner.xAxis);
  };
  Axis.prototype.getYAxisTickValues = function getYAxisTickValues() {
      return this.getTickValues(this.owner.config.axis_y_tick_values, this.owner.yAxis);
  };
  Axis.prototype.getY2AxisTickValues = function getY2AxisTickValues() {
      return this.getTickValues(this.owner.config.axis_y2_tick_values, this.owner.y2Axis);
  };
  Axis.prototype.getLabelOptionByAxisId = function getLabelOptionByAxisId(axisId) {
      var $$ = this.owner, config = $$.config, option;
      if (axisId === 'y') {
          option = config.axis_y_label;
      }
      else if (axisId === 'y2') {
          option = config.axis_y2_label;
      }
      else if (axisId === 'x') {
          option = config.axis_x_label;
      }
      return option;
  };
  Axis.prototype.getLabelText = function getLabelText(axisId) {
      var option = this.getLabelOptionByAxisId(axisId);
      return isString(option) ? option : option ? option.text : null;
  };
  Axis.prototype.setLabelText = function setLabelText(axisId, text) {
      var $$ = this.owner, config = $$.config, option = this.getLabelOptionByAxisId(axisId);
      if (isString(option)) {
          if (axisId === 'y') {
              config.axis_y_label = text;
          }
          else if (axisId === 'y2') {
              config.axis_y2_label = text;
          }
          else if (axisId === 'x') {
              config.axis_x_label = text;
          }
      }
      else if (option) {
          option.text = text;
      }
  };
  Axis.prototype.getLabelPosition = function getLabelPosition(axisId, defaultPosition) {
      var option = this.getLabelOptionByAxisId(axisId), position = option && typeof option === 'object' && option.position
          ? option.position
          : defaultPosition;
      return {
          isInner: position.indexOf('inner') >= 0,
          isOuter: position.indexOf('outer') >= 0,
          isLeft: position.indexOf('left') >= 0,
          isCenter: position.indexOf('center') >= 0,
          isRight: position.indexOf('right') >= 0,
          isTop: position.indexOf('top') >= 0,
          isMiddle: position.indexOf('middle') >= 0,
          isBottom: position.indexOf('bottom') >= 0
      };
  };
  Axis.prototype.getXAxisLabelPosition = function getXAxisLabelPosition() {
      return this.getLabelPosition('x', this.owner.config.axis_rotated ? 'inner-top' : 'inner-right');
  };
  Axis.prototype.getYAxisLabelPosition = function getYAxisLabelPosition() {
      return this.getLabelPosition('y', this.owner.config.axis_rotated ? 'inner-right' : 'inner-top');
  };
  Axis.prototype.getY2AxisLabelPosition = function getY2AxisLabelPosition() {
      return this.getLabelPosition('y2', this.owner.config.axis_rotated ? 'inner-right' : 'inner-top');
  };
  Axis.prototype.getLabelPositionById = function getLabelPositionById(id) {
      return id === 'y2'
          ? this.getY2AxisLabelPosition()
          : id === 'y'
              ? this.getYAxisLabelPosition()
              : this.getXAxisLabelPosition();
  };
  Axis.prototype.textForXAxisLabel = function textForXAxisLabel() {
      return this.getLabelText('x');
  };
  Axis.prototype.textForYAxisLabel = function textForYAxisLabel() {
      return this.getLabelText('y');
  };
  Axis.prototype.textForY2AxisLabel = function textForY2AxisLabel() {
      return this.getLabelText('y2');
  };
  Axis.prototype.xForAxisLabel = function xForAxisLabel(forHorizontal, position) {
      var $$ = this.owner;
      if (forHorizontal) {
          return position.isLeft ? 0 : position.isCenter ? $$.width / 2 : $$.width;
      }
      else {
          return position.isBottom
              ? -$$.height
              : position.isMiddle
                  ? -$$.height / 2
                  : 0;
      }
  };
  Axis.prototype.dxForAxisLabel = function dxForAxisLabel(forHorizontal, position) {
      if (forHorizontal) {
          return position.isLeft ? '0.5em' : position.isRight ? '-0.5em' : '0';
      }
      else {
          return position.isTop ? '-0.5em' : position.isBottom ? '0.5em' : '0';
      }
  };
  Axis.prototype.textAnchorForAxisLabel = function textAnchorForAxisLabel(forHorizontal, position) {
      if (forHorizontal) {
          return position.isLeft ? 'start' : position.isCenter ? 'middle' : 'end';
      }
      else {
          return position.isBottom ? 'start' : position.isMiddle ? 'middle' : 'end';
      }
  };
  Axis.prototype.xForXAxisLabel = function xForXAxisLabel() {
      return this.xForAxisLabel(!this.owner.config.axis_rotated, this.getXAxisLabelPosition());
  };
  Axis.prototype.xForYAxisLabel = function xForYAxisLabel() {
      return this.xForAxisLabel(this.owner.config.axis_rotated, this.getYAxisLabelPosition());
  };
  Axis.prototype.xForY2AxisLabel = function xForY2AxisLabel() {
      return this.xForAxisLabel(this.owner.config.axis_rotated, this.getY2AxisLabelPosition());
  };
  Axis.prototype.dxForXAxisLabel = function dxForXAxisLabel() {
      return this.dxForAxisLabel(!this.owner.config.axis_rotated, this.getXAxisLabelPosition());
  };
  Axis.prototype.dxForYAxisLabel = function dxForYAxisLabel() {
      return this.dxForAxisLabel(this.owner.config.axis_rotated, this.getYAxisLabelPosition());
  };
  Axis.prototype.dxForY2AxisLabel = function dxForY2AxisLabel() {
      return this.dxForAxisLabel(this.owner.config.axis_rotated, this.getY2AxisLabelPosition());
  };
  Axis.prototype.dyForXAxisLabel = function dyForXAxisLabel() {
      var $$ = this.owner, config = $$.config, position = this.getXAxisLabelPosition();
      if (config.axis_rotated) {
          return position.isInner
              ? '1.2em'
              : -25 - ($$.config.axis_x_inner ? 0 : this.getMaxTickWidth('x'));
      }
      else {
          return position.isInner ? '-0.5em' : $$.getHorizontalAxisHeight('x') - 10;
      }
  };
  Axis.prototype.dyForYAxisLabel = function dyForYAxisLabel() {
      var $$ = this.owner, position = this.getYAxisLabelPosition();
      if ($$.config.axis_rotated) {
          return position.isInner ? '-0.5em' : '3em';
      }
      else {
          return position.isInner
              ? '1.2em'
              : -10 - ($$.config.axis_y_inner ? 0 : this.getMaxTickWidth('y') + 10);
      }
  };
  Axis.prototype.dyForY2AxisLabel = function dyForY2AxisLabel() {
      var $$ = this.owner, position = this.getY2AxisLabelPosition();
      if ($$.config.axis_rotated) {
          return position.isInner ? '1.2em' : '-2.2em';
      }
      else {
          return position.isInner
              ? '-0.5em'
              : 15 + ($$.config.axis_y2_inner ? 0 : this.getMaxTickWidth('y2') + 15);
      }
  };
  Axis.prototype.textAnchorForXAxisLabel = function textAnchorForXAxisLabel() {
      var $$ = this.owner;
      return this.textAnchorForAxisLabel(!$$.config.axis_rotated, this.getXAxisLabelPosition());
  };
  Axis.prototype.textAnchorForYAxisLabel = function textAnchorForYAxisLabel() {
      var $$ = this.owner;
      return this.textAnchorForAxisLabel($$.config.axis_rotated, this.getYAxisLabelPosition());
  };
  Axis.prototype.textAnchorForY2AxisLabel = function textAnchorForY2AxisLabel() {
      var $$ = this.owner;
      return this.textAnchorForAxisLabel($$.config.axis_rotated, this.getY2AxisLabelPosition());
  };
  Axis.prototype.getMaxTickWidth = function getMaxTickWidth(id, withoutRecompute) {
      var $$ = this.owner, maxWidth = 0, targetsToShow, scale, axis, dummy, svg;
      if (withoutRecompute && $$.currentMaxTickWidths[id]) {
          return $$.currentMaxTickWidths[id];
      }
      if ($$.svg) {
          targetsToShow = $$.filterTargetsToShow($$.data.targets);
          if (id === 'y') {
              scale = $$.y.copy().domain($$.getYDomain(targetsToShow, 'y'));
              axis = this.getYAxis(id, scale, $$.yOrient, $$.yAxisTickValues, false, true, true);
          }
          else if (id === 'y2') {
              scale = $$.y2.copy().domain($$.getYDomain(targetsToShow, 'y2'));
              axis = this.getYAxis(id, scale, $$.y2Orient, $$.y2AxisTickValues, false, true, true);
          }
          else {
              scale = $$.x.copy().domain($$.getXDomain(targetsToShow));
              axis = this.getXAxis(scale, $$.xOrient, $$.xAxisTickFormat, $$.xAxisTickValues, false, true, true);
              this.updateXAxisTickValues(targetsToShow, axis);
          }
          dummy = $$.d3
              .select('body')
              .append('div')
              .classed('c3', true);
          (svg = dummy
              .append('svg')
              .style('visibility', 'hidden')
              .style('position', 'fixed')
              .style('top', 0)
              .style('left', 0)),
              svg
                  .append('g')
                  .call(axis)
                  .each(function () {
                  $$.d3
                      .select(this)
                      .selectAll('text')
                      .each(function () {
                      var box = getBBox(this);
                      if (maxWidth < box.width) {
                          maxWidth = box.width;
                      }
                  });
                  dummy.remove();
              });
      }
      $$.currentMaxTickWidths[id] =
          maxWidth <= 0 ? $$.currentMaxTickWidths[id] : maxWidth;
      return $$.currentMaxTickWidths[id];
  };
  Axis.prototype.updateLabels = function updateLabels(withTransition) {
      var $$ = this.owner;
      var axisXLabel = $$.main.select('.' + CLASS.axisX + ' .' + CLASS.axisXLabel), axisYLabel = $$.main.select('.' + CLASS.axisY + ' .' + CLASS.axisYLabel), axisY2Label = $$.main.select('.' + CLASS.axisY2 + ' .' + CLASS.axisY2Label);
      (withTransition ? axisXLabel.transition() : axisXLabel)
          .attr('x', this.xForXAxisLabel.bind(this))
          .attr('dx', this.dxForXAxisLabel.bind(this))
          .attr('dy', this.dyForXAxisLabel.bind(this))
          .text(this.textForXAxisLabel.bind(this));
      (withTransition ? axisYLabel.transition() : axisYLabel)
          .attr('x', this.xForYAxisLabel.bind(this))
          .attr('dx', this.dxForYAxisLabel.bind(this))
          .attr('dy', this.dyForYAxisLabel.bind(this))
          .text(this.textForYAxisLabel.bind(this));
      (withTransition ? axisY2Label.transition() : axisY2Label)
          .attr('x', this.xForY2AxisLabel.bind(this))
          .attr('dx', this.dxForY2AxisLabel.bind(this))
          .attr('dy', this.dyForY2AxisLabel.bind(this))
          .text(this.textForY2AxisLabel.bind(this));
  };
  Axis.prototype.getPadding = function getPadding(padding, key, defaultValue, domainLength) {
      var p = typeof padding === 'number' ? padding : padding[key];
      if (!isValue(p)) {
          return defaultValue;
      }
      if (padding.unit === 'ratio') {
          return padding[key] * domainLength;
      }
      // assume padding is pixels if unit is not specified
      return this.convertPixelsToAxisPadding(p, domainLength);
  };
  Axis.prototype.convertPixelsToAxisPadding = function convertPixelsToAxisPadding(pixels, domainLength) {
      var $$ = this.owner, length = $$.config.axis_rotated ? $$.width : $$.height;
      return domainLength * (pixels / length);
  };
  Axis.prototype.generateTickValues = function generateTickValues(values, tickCount, forTimeSeries) {
      var tickValues = values, targetCount, start, end, count, interval, i, tickValue;
      if (tickCount) {
          targetCount = isFunction(tickCount) ? tickCount() : tickCount;
          // compute ticks according to tickCount
          if (targetCount === 1) {
              tickValues = [values[0]];
          }
          else if (targetCount === 2) {
              tickValues = [values[0], values[values.length - 1]];
          }
          else if (targetCount > 2) {
              count = targetCount - 2;
              start = values[0];
              end = values[values.length - 1];
              interval = (end - start) / (count + 1);
              // re-construct unique values
              tickValues = [start];
              for (i = 0; i < count; i++) {
                  tickValue = +start + interval * (i + 1);
                  tickValues.push(forTimeSeries ? new Date(tickValue) : tickValue);
              }
              tickValues.push(end);
          }
      }
      if (!forTimeSeries) {
          tickValues = tickValues.sort(function (a, b) {
              return a - b;
          });
      }
      return tickValues;
  };
  Axis.prototype.generateTransitions = function generateTransitions(duration) {
      var $$ = this.owner, axes = $$.axes;
      return {
          axisX: duration ? axes.x.transition().duration(duration) : axes.x,
          axisY: duration ? axes.y.transition().duration(duration) : axes.y,
          axisY2: duration ? axes.y2.transition().duration(duration) : axes.y2,
          axisSubX: duration ? axes.subx.transition().duration(duration) : axes.subx
      };
  };
  Axis.prototype.redraw = function redraw(duration, isHidden) {
      var $$ = this.owner, transition = duration ? $$.d3.transition().duration(duration) : null;
      $$.axes.x.style('opacity', isHidden ? 0 : 1).call($$.xAxis, transition);
      $$.axes.y.style('opacity', isHidden ? 0 : 1).call($$.yAxis, transition);
      $$.axes.y2.style('opacity', isHidden ? 0 : 1).call($$.y2Axis, transition);
      $$.axes.subx.style('opacity', isHidden ? 0 : 1).call($$.subXAxis, transition);
  };

  var c3 = {
      version: '0.7.20',
      chart: {
          fn: Chart.prototype,
          internal: {
              fn: ChartInternal.prototype,
              axis: {
                  fn: AxisClass.prototype,
                  internal: {
                      fn: AxisInternal.prototype
                  }
              }
          }
      },
      generate: function (config) {
          return new Chart(config);
      }
  };
  ChartInternal.prototype.beforeInit = function () {
      // can do something
  };
  ChartInternal.prototype.afterInit = function () {
      // can do something
  };
  ChartInternal.prototype.init = function () {
      var $$ = this, config = $$.config;
      $$.initParams();
      if (config.data_url) {
          $$.convertUrlToData(config.data_url, config.data_mimeType, config.data_headers, config.data_keys, $$.initWithData);
      }
      else if (config.data_json) {
          $$.initWithData($$.convertJsonToData(config.data_json, config.data_keys));
      }
      else if (config.data_rows) {
          $$.initWithData($$.convertRowsToData(config.data_rows));
      }
      else if (config.data_columns) {
          $$.initWithData($$.convertColumnsToData(config.data_columns));
      }
      else {
          throw Error('url or json or rows or columns is required.');
      }
  };
  ChartInternal.prototype.initParams = function () {
      var $$ = this, d3 = $$.d3, config = $$.config;
      // MEMO: clipId needs to be unique because it conflicts when multiple charts exist
      $$.clipId = 'c3-' + new Date().valueOf() + '-clip';
      $$.clipIdForXAxis = $$.clipId + '-xaxis';
      $$.clipIdForYAxis = $$.clipId + '-yaxis';
      $$.clipIdForGrid = $$.clipId + '-grid';
      $$.clipIdForSubchart = $$.clipId + '-subchart';
      $$.clipPath = $$.getClipPath($$.clipId);
      $$.clipPathForXAxis = $$.getClipPath($$.clipIdForXAxis);
      $$.clipPathForYAxis = $$.getClipPath($$.clipIdForYAxis);
      $$.clipPathForGrid = $$.getClipPath($$.clipIdForGrid);
      $$.clipPathForSubchart = $$.getClipPath($$.clipIdForSubchart);
      $$.dragStart = null;
      $$.dragging = false;
      $$.flowing = false;
      $$.cancelClick = false;
      $$.mouseover = undefined;
      $$.transiting = false;
      $$.color = $$.generateColor();
      $$.levelColor = $$.generateLevelColor();
      $$.dataTimeParse = (config.data_xLocaltime ? d3.timeParse : d3.utcParse)($$.config.data_xFormat);
      $$.axisTimeFormat = config.axis_x_localtime ? d3.timeFormat : d3.utcFormat;
      $$.defaultAxisTimeFormat = function (date) {
          if (date.getMilliseconds()) {
              return d3.timeFormat('.%L')(date);
          }
          if (date.getSeconds()) {
              return d3.timeFormat(':%S')(date);
          }
          if (date.getMinutes()) {
              return d3.timeFormat('%I:%M')(date);
          }
          if (date.getHours()) {
              return d3.timeFormat('%I %p')(date);
          }
          if (date.getDay() && date.getDate() !== 1) {
              return d3.timeFormat('%-m/%-d')(date);
          }
          if (date.getDate() !== 1) {
              return d3.timeFormat('%-m/%-d')(date);
          }
          if (date.getMonth()) {
              return d3.timeFormat('%-m/%-d')(date);
          }
          return d3.timeFormat('%Y/%-m/%-d')(date);
      };
      $$.hiddenTargetIds = [];
      $$.hiddenLegendIds = [];
      $$.focusedTargetIds = [];
      $$.defocusedTargetIds = [];
      $$.xOrient = config.axis_rotated
          ? config.axis_x_inner
              ? 'right'
              : 'left'
          : config.axis_x_inner
              ? 'top'
              : 'bottom';
      $$.yOrient = config.axis_rotated
          ? config.axis_y_inner
              ? 'top'
              : 'bottom'
          : config.axis_y_inner
              ? 'right'
              : 'left';
      $$.y2Orient = config.axis_rotated
          ? config.axis_y2_inner
              ? 'bottom'
              : 'top'
          : config.axis_y2_inner
              ? 'left'
              : 'right';
      $$.subXOrient = config.axis_rotated ? 'left' : 'bottom';
      $$.isLegendRight = config.legend_position === 'right';
      $$.isLegendInset = config.legend_position === 'inset';
      $$.isLegendTop =
          config.legend_inset_anchor === 'top-left' ||
              config.legend_inset_anchor === 'top-right';
      $$.isLegendLeft =
          config.legend_inset_anchor === 'top-left' ||
              config.legend_inset_anchor === 'bottom-left';
      $$.legendStep = 0;
      $$.legendItemWidth = 0;
      $$.legendItemHeight = 0;
      $$.currentMaxTickWidths = {
          x: 0,
          y: 0,
          y2: 0
      };
      $$.rotated_padding_left = 30;
      $$.rotated_padding_right = config.axis_rotated && !config.axis_x_show ? 0 : 30;
      $$.rotated_padding_top = 5;
      $$.withoutFadeIn = {};
      $$.intervalForObserveInserted = undefined;
      $$.axes.subx = d3.selectAll([]); // needs when excluding subchart.js
  };
  ChartInternal.prototype.initChartElements = function () {
      if (this.initBar) {
          this.initBar();
      }
      if (this.initLine) {
          this.initLine();
      }
      if (this.initArc) {
          this.initArc();
      }
      if (this.initGauge) {
          this.initGauge();
      }
      if (this.initText) {
          this.initText();
      }
  };
  ChartInternal.prototype.initWithData = function (data) {
      var $$ = this, d3 = $$.d3, config = $$.config;
      var defs, main, binding = true;
      $$.axis = new AxisClass($$);
      if (!config.bindto) {
          $$.selectChart = d3.selectAll([]);
      }
      else if (typeof config.bindto.node === 'function') {
          $$.selectChart = config.bindto;
      }
      else {
          $$.selectChart = d3.select(config.bindto);
      }
      if ($$.selectChart.empty()) {
          $$.selectChart = d3
              .select(document.createElement('div'))
              .style('opacity', 0);
          $$.observeInserted($$.selectChart);
          binding = false;
      }
      $$.selectChart.html('').classed('c3', true);
      // Init data as targets
      $$.data.xs = {};
      $$.data.targets = $$.convertDataToTargets(data);
      if (config.data_filter) {
          $$.data.targets = $$.data.targets.filter(config.data_filter);
      }
      // Set targets to hide if needed
      if (config.data_hide) {
          $$.addHiddenTargetIds(config.data_hide === true
              ? $$.mapToIds($$.data.targets)
              : config.data_hide);
      }
      if (config.legend_hide) {
          $$.addHiddenLegendIds(config.legend_hide === true
              ? $$.mapToIds($$.data.targets)
              : config.legend_hide);
      }
      if ($$.isStanfordGraphType()) {
          $$.initStanfordData();
      }
      // Init sizes and scales
      $$.updateSizes();
      $$.updateScales();
      // Set domains for each scale
      $$.x.domain(d3.extent($$.getXDomain($$.data.targets)));
      $$.y.domain($$.getYDomain($$.data.targets, 'y'));
      $$.y2.domain($$.getYDomain($$.data.targets, 'y2'));
      $$.subX.domain($$.x.domain());
      $$.subY.domain($$.y.domain());
      $$.subY2.domain($$.y2.domain());
      // Save original x domain for zoom update
      $$.orgXDomain = $$.x.domain();
      /*-- Basic Elements --*/
      // Define svgs
      $$.svg = $$.selectChart
          .append('svg')
          .style('overflow', 'hidden')
          .on('mouseenter', function () {
          return config.onmouseover.call($$);
      })
          .on('mouseleave', function () {
          return config.onmouseout.call($$);
      });
      if ($$.config.svg_classname) {
          $$.svg.attr('class', $$.config.svg_classname);
      }
      // Define defs
      defs = $$.svg.append('defs');
      $$.clipChart = $$.appendClip(defs, $$.clipId);
      $$.clipXAxis = $$.appendClip(defs, $$.clipIdForXAxis);
      $$.clipYAxis = $$.appendClip(defs, $$.clipIdForYAxis);
      $$.clipGrid = $$.appendClip(defs, $$.clipIdForGrid);
      $$.clipSubchart = $$.appendClip(defs, $$.clipIdForSubchart);
      $$.updateSvgSize();
      // Define regions
      main = $$.main = $$.svg.append('g').attr('transform', $$.getTranslate('main'));
      if ($$.initPie) {
          $$.initPie();
      }
      if ($$.initDragZoom) {
          $$.initDragZoom();
      }
      if (config.subchart_show && $$.initSubchart) {
          $$.initSubchart();
      }
      if ($$.initTooltip) {
          $$.initTooltip();
      }
      if ($$.initLegend) {
          $$.initLegend();
      }
      if ($$.initTitle) {
          $$.initTitle();
      }
      if ($$.initZoom) {
          $$.initZoom();
      }
      if ($$.isStanfordGraphType()) {
          $$.drawColorScale();
      }
      // Update selection based on size and scale
      // TODO: currently this must be called after initLegend because of update of sizes, but it should be done in initSubchart.
      if (config.subchart_show && $$.initSubchartBrush) {
          $$.initSubchartBrush();
      }
      /*-- Main Region --*/
      // text when empty
      main
          .append('text')
          .attr('class', CLASS.text + ' ' + CLASS.empty)
          .attr('text-anchor', 'middle') // horizontal centering of text at x position in all browsers.
          .attr('dominant-baseline', 'middle'); // vertical centering of text at y position in all browsers, except IE.
      // Regions
      $$.initRegion();
      // Grids
      $$.initGrid();
      // Define g for chart area
      main
          .append('g')
          .attr('clip-path', $$.clipPath)
          .attr('class', CLASS.chart);
      // Grid lines
      if (config.grid_lines_front) {
          $$.initGridLines();
      }
      $$.initStanfordElements();
      // Cover whole with rects for events
      $$.initEventRect();
      // Define g for chart
      $$.initChartElements();
      // Add Axis
      $$.axis.init();
      // Set targets
      $$.updateTargets($$.data.targets);
      // Set default extent if defined
      if (config.axis_x_selection) {
          $$.brush.selectionAsValue($$.getDefaultSelection());
      }
      // Draw with targets
      if (binding) {
          $$.updateDimension();
          $$.config.oninit.call($$);
          $$.redraw({
              withTransition: false,
              withTransform: true,
              withUpdateXDomain: true,
              withUpdateOrgXDomain: true,
              withTransitionForAxis: false
          });
      }
      // Bind to resize event
      $$.bindResize();
      // Bind to window focus event
      $$.bindWindowFocus();
      // export element of the chart
      $$.api.element = $$.selectChart.node();
  };
  ChartInternal.prototype.smoothLines = function (el, type) {
      var $$ = this;
      if (type === 'grid') {
          el.each(function () {
              var g = $$.d3.select(this), x1 = g.attr('x1'), x2 = g.attr('x2'), y1 = g.attr('y1'), y2 = g.attr('y2');
              g.attr({
                  x1: Math.ceil(x1),
                  x2: Math.ceil(x2),
                  y1: Math.ceil(y1),
                  y2: Math.ceil(y2)
              });
          });
      }
  };
  ChartInternal.prototype.updateSizes = function () {
      var $$ = this, config = $$.config;
      var legendHeight = $$.legend ? $$.getLegendHeight() : 0, legendWidth = $$.legend ? $$.getLegendWidth() : 0, legendHeightForBottom = $$.isLegendRight || $$.isLegendInset ? 0 : legendHeight, hasArc = $$.hasArcType(), xAxisHeight = config.axis_rotated || hasArc ? 0 : $$.getHorizontalAxisHeight('x'), subchartXAxisHeight = config.axis_rotated || hasArc ? 0 : $$.getHorizontalAxisHeight('x', true), subchartHeight = config.subchart_show && !hasArc
          ? config.subchart_size_height + subchartXAxisHeight
          : 0;
      $$.currentWidth = $$.getCurrentWidth();
      $$.currentHeight = $$.getCurrentHeight();
      // for main
      $$.margin = config.axis_rotated
          ? {
              top: $$.getHorizontalAxisHeight('y2') + $$.getCurrentPaddingTop(),
              right: hasArc ? 0 : $$.getCurrentPaddingRight(),
              bottom: $$.getHorizontalAxisHeight('y') +
                  legendHeightForBottom +
                  $$.getCurrentPaddingBottom(),
              left: subchartHeight + (hasArc ? 0 : $$.getCurrentPaddingLeft())
          }
          : {
              top: 4 + $$.getCurrentPaddingTop(),
              right: hasArc ? 0 : $$.getCurrentPaddingRight(),
              bottom: xAxisHeight +
                  subchartHeight +
                  legendHeightForBottom +
                  $$.getCurrentPaddingBottom(),
              left: hasArc ? 0 : $$.getCurrentPaddingLeft()
          };
      // for subchart
      $$.margin2 = config.axis_rotated
          ? {
              top: $$.margin.top,
              right: NaN,
              bottom: 20 + legendHeightForBottom,
              left: $$.rotated_padding_left
          }
          : {
              top: $$.currentHeight - subchartHeight - legendHeightForBottom,
              right: NaN,
              bottom: subchartXAxisHeight + legendHeightForBottom,
              left: $$.margin.left
          };
      // for legend
      $$.margin3 = {
          top: 0,
          right: NaN,
          bottom: 0,
          left: 0
      };
      if ($$.updateSizeForLegend) {
          $$.updateSizeForLegend(legendHeight, legendWidth);
      }
      $$.width = $$.currentWidth - $$.margin.left - $$.margin.right;
      $$.height = $$.currentHeight - $$.margin.top - $$.margin.bottom;
      if ($$.width < 0) {
          $$.width = 0;
      }
      if ($$.height < 0) {
          $$.height = 0;
      }
      $$.width2 = config.axis_rotated
          ? $$.margin.left - $$.rotated_padding_left - $$.rotated_padding_right
          : $$.width;
      $$.height2 = config.axis_rotated
          ? $$.height
          : $$.currentHeight - $$.margin2.top - $$.margin2.bottom;
      if ($$.width2 < 0) {
          $$.width2 = 0;
      }
      if ($$.height2 < 0) {
          $$.height2 = 0;
      }
      // for arc
      $$.arcWidth = $$.width - ($$.isLegendRight ? legendWidth + 10 : 0);
      $$.arcHeight = $$.height - ($$.isLegendRight ? 0 : 10);
      if ($$.hasType('gauge') && !config.gauge_fullCircle) {
          $$.arcHeight += $$.height - $$.getGaugeLabelHeight();
      }
      if ($$.updateRadius) {
          $$.updateRadius();
      }
      if ($$.isLegendRight && hasArc) {
          $$.margin3.left = $$.arcWidth / 2 + $$.radiusExpanded * 1.1;
      }
  };
  ChartInternal.prototype.updateTargets = function (targets) {
      var $$ = this, config = $$.config;
      /*-- Main --*/
      //-- Text --//
      $$.updateTargetsForText(targets);
      //-- Bar --//
      $$.updateTargetsForBar(targets);
      //-- Line --//
      $$.updateTargetsForLine(targets);
      //-- Arc --//
      if ($$.hasArcType() && $$.updateTargetsForArc) {
          $$.updateTargetsForArc(targets);
      }
      /*-- Sub --*/
      if (config.subchart_show && $$.updateTargetsForSubchart) {
          $$.updateTargetsForSubchart(targets);
      }
      // Fade-in each chart
      $$.showTargets();
  };
  ChartInternal.prototype.showTargets = function () {
      var $$ = this;
      $$.svg
          .selectAll('.' + CLASS.target)
          .filter(function (d) {
          return $$.isTargetToShow(d.id);
      })
          .transition()
          .duration($$.config.transition_duration)
          .style('opacity', 1);
  };
  ChartInternal.prototype.redraw = function (options, transitions) {
      var $$ = this, main = $$.main, d3 = $$.d3, config = $$.config;
      var areaIndices = $$.getShapeIndices($$.isAreaType), barIndices = $$.getShapeIndices($$.isBarType), lineIndices = $$.getShapeIndices($$.isLineType);
      var withY, withSubchart, withTransition, withTransitionForExit, withTransitionForAxis, withTransform, withUpdateXDomain, withUpdateOrgXDomain, withTrimXDomain, withLegend, withEventRect, withDimension, withUpdateXAxis;
      var hideAxis = $$.hasArcType();
      var drawArea, drawBar, drawLine, xForText, yForText;
      var duration, durationForExit, durationForAxis;
      var transitionsToWait, waitForDraw, flow, transition;
      var targetsToShow = $$.filterTargetsToShow($$.data.targets), tickValues, i, intervalForCulling, xDomainForZoom;
      var xv = $$.xv.bind($$), cx, cy;
      options = options || {};
      withY = getOption(options, 'withY', true);
      withSubchart = getOption(options, 'withSubchart', true);
      withTransition = getOption(options, 'withTransition', true);
      withTransform = getOption(options, 'withTransform', false);
      withUpdateXDomain = getOption(options, 'withUpdateXDomain', false);
      withUpdateOrgXDomain = getOption(options, 'withUpdateOrgXDomain', false);
      withTrimXDomain = getOption(options, 'withTrimXDomain', true);
      withUpdateXAxis = getOption(options, 'withUpdateXAxis', withUpdateXDomain);
      withLegend = getOption(options, 'withLegend', false);
      withEventRect = getOption(options, 'withEventRect', true);
      withDimension = getOption(options, 'withDimension', true);
      withTransitionForExit = getOption(options, 'withTransitionForExit', withTransition);
      withTransitionForAxis = getOption(options, 'withTransitionForAxis', withTransition);
      duration = withTransition ? config.transition_duration : 0;
      durationForExit = withTransitionForExit ? duration : 0;
      durationForAxis = withTransitionForAxis ? duration : 0;
      transitions = transitions || $$.axis.generateTransitions(durationForAxis);
      // update legend and transform each g
      if (withLegend && config.legend_show) {
          $$.updateLegend($$.mapToIds($$.data.targets), options, transitions);
      }
      else if (withDimension) {
          // need to update dimension (e.g. axis.y.tick.values) because y tick values should change
          // no need to update axis in it because they will be updated in redraw()
          $$.updateDimension(true);
      }
      // MEMO: needed for grids calculation
      if ($$.isCategorized() && targetsToShow.length === 0) {
          $$.x.domain([0, $$.axes.x.selectAll('.tick').size()]);
      }
      if (targetsToShow.length) {
          $$.updateXDomain(targetsToShow, withUpdateXDomain, withUpdateOrgXDomain, withTrimXDomain);
          if (!config.axis_x_tick_values) {
              tickValues = $$.axis.updateXAxisTickValues(targetsToShow);
          }
      }
      else {
          $$.xAxis.tickValues([]);
          $$.subXAxis.tickValues([]);
      }
      if (config.zoom_rescale && !options.flow) {
          xDomainForZoom = $$.x.orgDomain();
      }
      $$.y.domain($$.getYDomain(targetsToShow, 'y', xDomainForZoom));
      $$.y2.domain($$.getYDomain(targetsToShow, 'y2', xDomainForZoom));
      if (!config.axis_y_tick_values && config.axis_y_tick_count) {
          $$.yAxis.tickValues($$.axis.generateTickValues($$.y.domain(), config.axis_y_tick_count));
      }
      if (!config.axis_y2_tick_values && config.axis_y2_tick_count) {
          $$.y2Axis.tickValues($$.axis.generateTickValues($$.y2.domain(), config.axis_y2_tick_count));
      }
      // axes
      $$.axis.redraw(durationForAxis, hideAxis);
      // Update axis label
      $$.axis.updateLabels(withTransition);
      // show/hide if manual culling needed
      if ((withUpdateXDomain || withUpdateXAxis) && targetsToShow.length) {
          if (config.axis_x_tick_culling && tickValues) {
              for (i = 1; i < tickValues.length; i++) {
                  if (tickValues.length / i < config.axis_x_tick_culling_max) {
                      intervalForCulling = i;
                      break;
                  }
              }
              $$.svg.selectAll('.' + CLASS.axisX + ' .tick text').each(function (e) {
                  var index = tickValues.indexOf(e);
                  if (index >= 0) {
                      d3.select(this).style('display', index % intervalForCulling ? 'none' : 'block');
                  }
              });
          }
          else {
              $$.svg
                  .selectAll('.' + CLASS.axisX + ' .tick text')
                  .style('display', 'block');
          }
      }
      // setup drawer - MEMO: these must be called after axis updated
      drawArea = $$.generateDrawArea
          ? $$.generateDrawArea(areaIndices, false)
          : undefined;
      drawBar = $$.generateDrawBar ? $$.generateDrawBar(barIndices) : undefined;
      drawLine = $$.generateDrawLine
          ? $$.generateDrawLine(lineIndices, false)
          : undefined;
      xForText = $$.generateXYForText(areaIndices, barIndices, lineIndices, true);
      yForText = $$.generateXYForText(areaIndices, barIndices, lineIndices, false);
      // update circleY based on updated parameters
      $$.updateCircleY();
      // generate circle x/y functions depending on updated params
      cx = ($$.config.axis_rotated ? $$.circleY : $$.circleX).bind($$);
      cy = ($$.config.axis_rotated ? $$.circleX : $$.circleY).bind($$);
      // Update sub domain
      if (withY) {
          $$.subY.domain($$.getYDomain(targetsToShow, 'y'));
          $$.subY2.domain($$.getYDomain(targetsToShow, 'y2'));
      }
      // xgrid focus
      $$.updateXgridFocus();
      // Data empty label positioning and text.
      main
          .select('text.' + CLASS.text + '.' + CLASS.empty)
          .attr('x', $$.width / 2)
          .attr('y', $$.height / 2)
          .text(config.data_empty_label_text)
          .transition()
          .style('opacity', targetsToShow.length ? 0 : 1);
      // event rect
      if (withEventRect) {
          $$.redrawEventRect();
      }
      // grid
      $$.updateGrid(duration);
      $$.updateStanfordElements(duration);
      // rect for regions
      $$.updateRegion(duration);
      // bars
      $$.updateBar(durationForExit);
      // lines, areas and circles
      $$.updateLine(durationForExit);
      $$.updateArea(durationForExit);
      $$.updateCircle(cx, cy);
      // text
      if ($$.hasDataLabel()) {
          $$.updateText(xForText, yForText, durationForExit);
      }
      // title
      if ($$.redrawTitle) {
          $$.redrawTitle();
      }
      // arc
      if ($$.redrawArc) {
          $$.redrawArc(duration, durationForExit, withTransform);
      }
      // subchart
      if (config.subchart_show && $$.redrawSubchart) {
          $$.redrawSubchart(withSubchart, transitions, duration, durationForExit, areaIndices, barIndices, lineIndices);
      }
      if ($$.isStanfordGraphType()) {
          $$.drawColorScale();
      }
      // circles for select
      main
          .selectAll('.' + CLASS.selectedCircles)
          .filter($$.isBarType.bind($$))
          .selectAll('circle')
          .remove();
      if (options.flow) {
          flow = $$.generateFlow({
              targets: targetsToShow,
              flow: options.flow,
              duration: options.flow.duration,
              drawBar: drawBar,
              drawLine: drawLine,
              drawArea: drawArea,
              cx: cx,
              cy: cy,
              xv: xv,
              xForText: xForText,
              yForText: yForText
          });
      }
      if (duration && $$.isTabVisible()) {
          // Only use transition if tab visible. See #938.
          // transition should be derived from one transition
          transition = d3.transition().duration(duration);
          transitionsToWait = [];
          [
              $$.redrawBar(drawBar, true, transition),
              $$.redrawLine(drawLine, true, transition),
              $$.redrawArea(drawArea, true, transition),
              $$.redrawCircle(cx, cy, true, transition),
              $$.redrawText(xForText, yForText, options.flow, true, transition),
              $$.redrawRegion(true, transition),
              $$.redrawGrid(true, transition)
          ].forEach(function (transitions) {
              transitions.forEach(function (transition) {
                  transitionsToWait.push(transition);
              });
          });
          // Wait for end of transitions to call flow and onrendered callback
          waitForDraw = $$.generateWait();
          transitionsToWait.forEach(function (t) {
              waitForDraw.add(t);
          });
          waitForDraw(function () {
              if (flow) {
                  flow();
              }
              if (config.onrendered) {
                  config.onrendered.call($$);
              }
          });
      }
      else {
          $$.redrawBar(drawBar);
          $$.redrawLine(drawLine);
          $$.redrawArea(drawArea);
          $$.redrawCircle(cx, cy);
          $$.redrawText(xForText, yForText, options.flow);
          $$.redrawRegion();
          $$.redrawGrid();
          if (flow) {
              flow();
          }
          if (config.onrendered) {
              config.onrendered.call($$);
          }
      }
      // update fadein condition
      $$.mapToIds($$.data.targets).forEach(function (id) {
          $$.withoutFadeIn[id] = true;
      });
  };
  ChartInternal.prototype.updateAndRedraw = function (options) {
      var $$ = this, config = $$.config, transitions;
      options = options || {};
      // same with redraw
      options.withTransition = getOption(options, 'withTransition', true);
      options.withTransform = getOption(options, 'withTransform', false);
      options.withLegend = getOption(options, 'withLegend', false);
      // NOT same with redraw
      options.withUpdateXDomain = getOption(options, 'withUpdateXDomain', true);
      options.withUpdateOrgXDomain = getOption(options, 'withUpdateOrgXDomain', true);
      options.withTransitionForExit = false;
      options.withTransitionForTransform = getOption(options, 'withTransitionForTransform', options.withTransition);
      // MEMO: this needs to be called before updateLegend and it means this ALWAYS needs to be called)
      $$.updateSizes();
      // MEMO: called in updateLegend in redraw if withLegend
      if (!(options.withLegend && config.legend_show)) {
          transitions = $$.axis.generateTransitions(options.withTransitionForAxis ? config.transition_duration : 0);
          // Update scales
          $$.updateScales();
          $$.updateSvgSize();
          // Update g positions
          $$.transformAll(options.withTransitionForTransform, transitions);
      }
      // Draw with new sizes & scales
      $$.redraw(options, transitions);
  };
  ChartInternal.prototype.redrawWithoutRescale = function () {
      this.redraw({
          withY: false,
          withSubchart: false,
          withEventRect: false,
          withTransitionForAxis: false
      });
  };
  ChartInternal.prototype.isTimeSeries = function () {
      return this.config.axis_x_type === 'timeseries';
  };
  ChartInternal.prototype.isCategorized = function () {
      return this.config.axis_x_type.indexOf('categor') >= 0;
  };
  ChartInternal.prototype.isCustomX = function () {
      var $$ = this, config = $$.config;
      return !$$.isTimeSeries() && (config.data_x || notEmpty(config.data_xs));
  };
  ChartInternal.prototype.isTimeSeriesY = function () {
      return this.config.axis_y_type === 'timeseries';
  };
  ChartInternal.prototype.getTranslate = function (target) {
      var $$ = this, config = $$.config, x, y;
      if (target === 'main') {
          x = asHalfPixel($$.margin.left);
          y = asHalfPixel($$.margin.top);
      }
      else if (target === 'context') {
          x = asHalfPixel($$.margin2.left);
          y = asHalfPixel($$.margin2.top);
      }
      else if (target === 'legend') {
          x = $$.margin3.left;
          y = $$.margin3.top;
      }
      else if (target === 'x') {
          x = 0;
          y = config.axis_rotated ? 0 : $$.height;
      }
      else if (target === 'y') {
          x = 0;
          y = config.axis_rotated ? $$.height : 0;
      }
      else if (target === 'y2') {
          x = config.axis_rotated ? 0 : $$.width;
          y = config.axis_rotated ? 1 : 0;
      }
      else if (target === 'subx') {
          x = 0;
          y = config.axis_rotated ? 0 : $$.height2;
      }
      else if (target === 'arc') {
          x = $$.arcWidth / 2;
          y = $$.arcHeight / 2 - ($$.hasType('gauge') ? 6 : 0); // to prevent wrong display of min and max label
      }
      return 'translate(' + x + ',' + y + ')';
  };
  ChartInternal.prototype.initialOpacity = function (d) {
      return d.value !== null && this.withoutFadeIn[d.id] ? 1 : 0;
  };
  ChartInternal.prototype.initialOpacityForCircle = function (d) {
      return d.value !== null && this.withoutFadeIn[d.id]
          ? this.opacityForCircle(d)
          : 0;
  };
  ChartInternal.prototype.opacityForCircle = function (d) {
      var isPointShouldBeShown = isFunction(this.config.point_show)
          ? this.config.point_show(d)
          : this.config.point_show;
      var opacity = isPointShouldBeShown || this.isStanfordType(d) ? 1 : 0;
      return isValue(d.value) ? (this.isScatterType(d) ? 0.5 : opacity) : 0;
  };
  ChartInternal.prototype.opacityForText = function () {
      return this.hasDataLabel() ? 1 : 0;
  };
  ChartInternal.prototype.xx = function (d) {
      return d ? this.x(d.x) : null;
  };
  ChartInternal.prototype.xvCustom = function (d, xyValue) {
      var $$ = this, value = xyValue ? d[xyValue] : d.value;
      if ($$.isTimeSeries()) {
          value = $$.parseDate(d.value);
      }
      else if ($$.isCategorized() && typeof d.value === 'string') {
          value = $$.config.axis_x_categories.indexOf(d.value);
      }
      return Math.ceil($$.x(value));
  };
  ChartInternal.prototype.yvCustom = function (d, xyValue) {
      var $$ = this, yScale = d.axis && d.axis === 'y2' ? $$.y2 : $$.y, value = xyValue ? d[xyValue] : d.value;
      return Math.ceil(yScale(value));
  };
  ChartInternal.prototype.xv = function (d) {
      var $$ = this, value = d.value;
      if ($$.isTimeSeries()) {
          value = $$.parseDate(d.value);
      }
      else if ($$.isCategorized() && typeof d.value === 'string') {
          value = $$.config.axis_x_categories.indexOf(d.value);
      }
      return Math.ceil($$.x(value));
  };
  ChartInternal.prototype.yv = function (d) {
      var $$ = this, yScale = d.axis && d.axis === 'y2' ? $$.y2 : $$.y;
      return Math.ceil(yScale(d.value));
  };
  ChartInternal.prototype.subxx = function (d) {
      return d ? this.subX(d.x) : null;
  };
  ChartInternal.prototype.transformMain = function (withTransition, transitions) {
      var $$ = this, xAxis, yAxis, y2Axis;
      if (transitions && transitions.axisX) {
          xAxis = transitions.axisX;
      }
      else {
          xAxis = $$.main.select('.' + CLASS.axisX);
          if (withTransition) {
              xAxis = xAxis.transition();
          }
      }
      if (transitions && transitions.axisY) {
          yAxis = transitions.axisY;
      }
      else {
          yAxis = $$.main.select('.' + CLASS.axisY);
          if (withTransition) {
              yAxis = yAxis.transition();
          }
      }
      if (transitions && transitions.axisY2) {
          y2Axis = transitions.axisY2;
      }
      else {
          y2Axis = $$.main.select('.' + CLASS.axisY2);
          if (withTransition) {
              y2Axis = y2Axis.transition();
          }
      }
      (withTransition ? $$.main.transition() : $$.main).attr('transform', $$.getTranslate('main'));
      xAxis.attr('transform', $$.getTranslate('x'));
      yAxis.attr('transform', $$.getTranslate('y'));
      y2Axis.attr('transform', $$.getTranslate('y2'));
      $$.main
          .select('.' + CLASS.chartArcs)
          .attr('transform', $$.getTranslate('arc'));
  };
  ChartInternal.prototype.transformAll = function (withTransition, transitions) {
      var $$ = this;
      $$.transformMain(withTransition, transitions);
      if ($$.config.subchart_show) {
          $$.transformContext(withTransition, transitions);
      }
      if ($$.legend) {
          $$.transformLegend(withTransition);
      }
  };
  ChartInternal.prototype.updateSvgSize = function () {
      var $$ = this, brush = $$.svg.select("." + CLASS.brush + " .overlay");
      $$.svg.attr('width', $$.currentWidth).attr('height', $$.currentHeight);
      $$.svg
          .selectAll(['#' + $$.clipId, '#' + $$.clipIdForGrid])
          .select('rect')
          .attr('width', $$.width)
          .attr('height', $$.height);
      $$.svg
          .select('#' + $$.clipIdForXAxis)
          .select('rect')
          .attr('x', $$.getXAxisClipX.bind($$))
          .attr('y', $$.getXAxisClipY.bind($$))
          .attr('width', $$.getXAxisClipWidth.bind($$))
          .attr('height', $$.getXAxisClipHeight.bind($$));
      $$.svg
          .select('#' + $$.clipIdForYAxis)
          .select('rect')
          .attr('x', $$.getYAxisClipX.bind($$))
          .attr('y', $$.getYAxisClipY.bind($$))
          .attr('width', $$.getYAxisClipWidth.bind($$))
          .attr('height', $$.getYAxisClipHeight.bind($$));
      $$.svg
          .select('#' + $$.clipIdForSubchart)
          .select('rect')
          .attr('width', $$.width)
          .attr('height', (brush.size() && brush.attr('height')) || 0);
      // MEMO: parent div's height will be bigger than svg when <!DOCTYPE html>
      $$.selectChart.style('max-height', $$.currentHeight + 'px');
  };
  ChartInternal.prototype.updateDimension = function (withoutAxis) {
      var $$ = this;
      if (!withoutAxis) {
          if ($$.config.axis_rotated) {
              $$.axes.x.call($$.xAxis);
              $$.axes.subx.call($$.subXAxis);
          }
          else {
              $$.axes.y.call($$.yAxis);
              $$.axes.y2.call($$.y2Axis);
          }
      }
      $$.updateSizes();
      $$.updateScales();
      $$.updateSvgSize();
      $$.transformAll(false);
  };
  ChartInternal.prototype.observeInserted = function (selection) {
      var $$ = this, observer;
      if (typeof MutationObserver === 'undefined') {
          window.console.error('MutationObserver not defined.');
          return;
      }
      observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
              if (mutation.type === 'childList' && mutation.previousSibling) {
                  observer.disconnect();
                  // need to wait for completion of load because size calculation requires the actual sizes determined after that completion
                  $$.intervalForObserveInserted = window.setInterval(function () {
                      // parentNode will NOT be null when completed
                      if (selection.node().parentNode) {
                          window.clearInterval($$.intervalForObserveInserted);
                          $$.updateDimension();
                          if ($$.brush) {
                              $$.brush.update();
                          }
                          $$.config.oninit.call($$);
                          $$.redraw({
                              withTransform: true,
                              withUpdateXDomain: true,
                              withUpdateOrgXDomain: true,
                              withTransition: false,
                              withTransitionForTransform: false,
                              withLegend: true
                          });
                          selection.transition().style('opacity', 1);
                      }
                  }, 10);
              }
          });
      });
      observer.observe(selection.node(), {
          attributes: true,
          childList: true,
          characterData: true
      });
  };
  /**
   * Binds handlers to the window resize event.
   */
  ChartInternal.prototype.bindResize = function () {
      var $$ = this, config = $$.config;
      $$.resizeFunction = $$.generateResize(); // need to call .remove
      $$.resizeFunction.add(function () {
          config.onresize.call($$);
      });
      if (config.resize_auto) {
          $$.resizeFunction.add(function () {
              if ($$.resizeTimeout !== undefined) {
                  window.clearTimeout($$.resizeTimeout);
              }
              $$.resizeTimeout = window.setTimeout(function () {
                  delete $$.resizeTimeout;
                  $$.updateAndRedraw({
                      withUpdateXDomain: false,
                      withUpdateOrgXDomain: false,
                      withTransition: false,
                      withTransitionForTransform: false,
                      withLegend: true
                  });
                  if ($$.brush) {
                      $$.brush.update();
                  }
              }, 100);
          });
      }
      $$.resizeFunction.add(function () {
          config.onresized.call($$);
      });
      $$.resizeIfElementDisplayed = function () {
          // if element not displayed skip it
          if ($$.api == null || !$$.api.element.offsetParent) {
              return;
          }
          $$.resizeFunction();
      };
      window.addEventListener('resize', $$.resizeIfElementDisplayed, false);
  };
  /**
   * Binds handlers to the window focus event.
   */
  ChartInternal.prototype.bindWindowFocus = function () {
      var _this = this;
      if (this.windowFocusHandler) {
          // The handler is already set
          return;
      }
      this.windowFocusHandler = function () {
          _this.redraw();
      };
      window.addEventListener('focus', this.windowFocusHandler);
  };
  /**
   * Unbinds from the window focus event.
   */
  ChartInternal.prototype.unbindWindowFocus = function () {
      window.removeEventListener('focus', this.windowFocusHandler);
      delete this.windowFocusHandler;
  };
  ChartInternal.prototype.generateResize = function () {
      var resizeFunctions = [];
      function callResizeFunctions() {
          resizeFunctions.forEach(function (f) {
              f();
          });
      }
      callResizeFunctions.add = function (f) {
          resizeFunctions.push(f);
      };
      callResizeFunctions.remove = function (f) {
          for (var i = 0; i < resizeFunctions.length; i++) {
              if (resizeFunctions[i] === f) {
                  resizeFunctions.splice(i, 1);
                  break;
              }
          }
      };
      return callResizeFunctions;
  };
  ChartInternal.prototype.endall = function (transition, callback) {
      var n = 0;
      transition
          .each(function () {
          ++n;
      })
          .on('end', function () {
          if (!--n) {
              callback.apply(this, arguments);
          }
      });
  };
  ChartInternal.prototype.generateWait = function () {
      var $$ = this;
      var transitionsToWait = [], f = function (callback) {
          var timer = setInterval(function () {
              if (!$$.isTabVisible()) {
                  return;
              }
              var done = 0;
              transitionsToWait.forEach(function (t) {
                  if (t.empty()) {
                      done += 1;
                      return;
                  }
                  try {
                      t.transition();
                  }
                  catch (e) {
                      done += 1;
                  }
              });
              if (done === transitionsToWait.length) {
                  clearInterval(timer);
                  if (callback) {
                      callback();
                  }
              }
          }, 50);
      };
      f.add = function (transition) {
          transitionsToWait.push(transition);
      };
      return f;
  };
  ChartInternal.prototype.parseDate = function (date) {
      var $$ = this, parsedDate;
      if (date instanceof Date) {
          parsedDate = date;
      }
      else if (typeof date === 'string') {
          parsedDate = $$.dataTimeParse(date);
      }
      else if (typeof date === 'object') {
          parsedDate = new Date(+date);
      }
      else if (typeof date === 'number' && !isNaN(date)) {
          parsedDate = new Date(+date);
      }
      if (!parsedDate || isNaN(+parsedDate)) {
          window.console.error("Failed to parse x '" + date + "' to Date object");
      }
      return parsedDate;
  };
  ChartInternal.prototype.isTabVisible = function () {
      return !document.hidden;
  };
  ChartInternal.prototype.getPathBox = getPathBox;
  ChartInternal.prototype.CLASS = CLASS;

  /* jshint ignore:start */
  (function () {
      if (!('SVGPathSeg' in window)) {
          // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-InterfaceSVGPathSeg
          window.SVGPathSeg = function (type, typeAsLetter, owningPathSegList) {
              this.pathSegType = type;
              this.pathSegTypeAsLetter = typeAsLetter;
              this._owningPathSegList = owningPathSegList;
          };
          window.SVGPathSeg.prototype.classname = 'SVGPathSeg';
          window.SVGPathSeg.PATHSEG_UNKNOWN = 0;
          window.SVGPathSeg.PATHSEG_CLOSEPATH = 1;
          window.SVGPathSeg.PATHSEG_MOVETO_ABS = 2;
          window.SVGPathSeg.PATHSEG_MOVETO_REL = 3;
          window.SVGPathSeg.PATHSEG_LINETO_ABS = 4;
          window.SVGPathSeg.PATHSEG_LINETO_REL = 5;
          window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS = 6;
          window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL = 7;
          window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS = 8;
          window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL = 9;
          window.SVGPathSeg.PATHSEG_ARC_ABS = 10;
          window.SVGPathSeg.PATHSEG_ARC_REL = 11;
          window.SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS = 12;
          window.SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL = 13;
          window.SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS = 14;
          window.SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL = 15;
          window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS = 16;
          window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL = 17;
          window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS = 18;
          window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL = 19;
          // Notify owning PathSegList on any changes so they can be synchronized back to the path element.
          window.SVGPathSeg.prototype._segmentChanged = function () {
              if (this._owningPathSegList)
                  this._owningPathSegList.segmentChanged(this);
          };
          window.SVGPathSegClosePath = function (owningPathSegList) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CLOSEPATH, 'z', owningPathSegList);
          };
          window.SVGPathSegClosePath.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegClosePath.prototype.toString = function () {
              return '[object SVGPathSegClosePath]';
          };
          window.SVGPathSegClosePath.prototype._asPathString = function () {
              return this.pathSegTypeAsLetter;
          };
          window.SVGPathSegClosePath.prototype.clone = function () {
              return new window.SVGPathSegClosePath(undefined);
          };
          window.SVGPathSegMovetoAbs = function (owningPathSegList, x, y) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_MOVETO_ABS, 'M', owningPathSegList);
              this._x = x;
              this._y = y;
          };
          window.SVGPathSegMovetoAbs.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegMovetoAbs.prototype.toString = function () {
              return '[object SVGPathSegMovetoAbs]';
          };
          window.SVGPathSegMovetoAbs.prototype._asPathString = function () {
              return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y;
          };
          window.SVGPathSegMovetoAbs.prototype.clone = function () {
              return new window.SVGPathSegMovetoAbs(undefined, this._x, this._y);
          };
          Object.defineProperty(window.SVGPathSegMovetoAbs.prototype, 'x', {
              get: function () {
                  return this._x;
              },
              set: function (x) {
                  this._x = x;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegMovetoAbs.prototype, 'y', {
              get: function () {
                  return this._y;
              },
              set: function (y) {
                  this._y = y;
                  this._segmentChanged();
              },
              enumerable: true
          });
          window.SVGPathSegMovetoRel = function (owningPathSegList, x, y) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_MOVETO_REL, 'm', owningPathSegList);
              this._x = x;
              this._y = y;
          };
          window.SVGPathSegMovetoRel.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegMovetoRel.prototype.toString = function () {
              return '[object SVGPathSegMovetoRel]';
          };
          window.SVGPathSegMovetoRel.prototype._asPathString = function () {
              return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y;
          };
          window.SVGPathSegMovetoRel.prototype.clone = function () {
              return new window.SVGPathSegMovetoRel(undefined, this._x, this._y);
          };
          Object.defineProperty(window.SVGPathSegMovetoRel.prototype, 'x', {
              get: function () {
                  return this._x;
              },
              set: function (x) {
                  this._x = x;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegMovetoRel.prototype, 'y', {
              get: function () {
                  return this._y;
              },
              set: function (y) {
                  this._y = y;
                  this._segmentChanged();
              },
              enumerable: true
          });
          window.SVGPathSegLinetoAbs = function (owningPathSegList, x, y) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_LINETO_ABS, 'L', owningPathSegList);
              this._x = x;
              this._y = y;
          };
          window.SVGPathSegLinetoAbs.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegLinetoAbs.prototype.toString = function () {
              return '[object SVGPathSegLinetoAbs]';
          };
          window.SVGPathSegLinetoAbs.prototype._asPathString = function () {
              return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y;
          };
          window.SVGPathSegLinetoAbs.prototype.clone = function () {
              return new window.SVGPathSegLinetoAbs(undefined, this._x, this._y);
          };
          Object.defineProperty(window.SVGPathSegLinetoAbs.prototype, 'x', {
              get: function () {
                  return this._x;
              },
              set: function (x) {
                  this._x = x;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegLinetoAbs.prototype, 'y', {
              get: function () {
                  return this._y;
              },
              set: function (y) {
                  this._y = y;
                  this._segmentChanged();
              },
              enumerable: true
          });
          window.SVGPathSegLinetoRel = function (owningPathSegList, x, y) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_LINETO_REL, 'l', owningPathSegList);
              this._x = x;
              this._y = y;
          };
          window.SVGPathSegLinetoRel.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegLinetoRel.prototype.toString = function () {
              return '[object SVGPathSegLinetoRel]';
          };
          window.SVGPathSegLinetoRel.prototype._asPathString = function () {
              return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y;
          };
          window.SVGPathSegLinetoRel.prototype.clone = function () {
              return new window.SVGPathSegLinetoRel(undefined, this._x, this._y);
          };
          Object.defineProperty(window.SVGPathSegLinetoRel.prototype, 'x', {
              get: function () {
                  return this._x;
              },
              set: function (x) {
                  this._x = x;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegLinetoRel.prototype, 'y', {
              get: function () {
                  return this._y;
              },
              set: function (y) {
                  this._y = y;
                  this._segmentChanged();
              },
              enumerable: true
          });
          window.SVGPathSegCurvetoCubicAbs = function (owningPathSegList, x, y, x1, y1, x2, y2) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS, 'C', owningPathSegList);
              this._x = x;
              this._y = y;
              this._x1 = x1;
              this._y1 = y1;
              this._x2 = x2;
              this._y2 = y2;
          };
          window.SVGPathSegCurvetoCubicAbs.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegCurvetoCubicAbs.prototype.toString = function () {
              return '[object SVGPathSegCurvetoCubicAbs]';
          };
          window.SVGPathSegCurvetoCubicAbs.prototype._asPathString = function () {
              return (this.pathSegTypeAsLetter +
                  ' ' +
                  this._x1 +
                  ' ' +
                  this._y1 +
                  ' ' +
                  this._x2 +
                  ' ' +
                  this._y2 +
                  ' ' +
                  this._x +
                  ' ' +
                  this._y);
          };
          window.SVGPathSegCurvetoCubicAbs.prototype.clone = function () {
              return new window.SVGPathSegCurvetoCubicAbs(undefined, this._x, this._y, this._x1, this._y1, this._x2, this._y2);
          };
          Object.defineProperty(window.SVGPathSegCurvetoCubicAbs.prototype, 'x', {
              get: function () {
                  return this._x;
              },
              set: function (x) {
                  this._x = x;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoCubicAbs.prototype, 'y', {
              get: function () {
                  return this._y;
              },
              set: function (y) {
                  this._y = y;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoCubicAbs.prototype, 'x1', {
              get: function () {
                  return this._x1;
              },
              set: function (x1) {
                  this._x1 = x1;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoCubicAbs.prototype, 'y1', {
              get: function () {
                  return this._y1;
              },
              set: function (y1) {
                  this._y1 = y1;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoCubicAbs.prototype, 'x2', {
              get: function () {
                  return this._x2;
              },
              set: function (x2) {
                  this._x2 = x2;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoCubicAbs.prototype, 'y2', {
              get: function () {
                  return this._y2;
              },
              set: function (y2) {
                  this._y2 = y2;
                  this._segmentChanged();
              },
              enumerable: true
          });
          window.SVGPathSegCurvetoCubicRel = function (owningPathSegList, x, y, x1, y1, x2, y2) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL, 'c', owningPathSegList);
              this._x = x;
              this._y = y;
              this._x1 = x1;
              this._y1 = y1;
              this._x2 = x2;
              this._y2 = y2;
          };
          window.SVGPathSegCurvetoCubicRel.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegCurvetoCubicRel.prototype.toString = function () {
              return '[object SVGPathSegCurvetoCubicRel]';
          };
          window.SVGPathSegCurvetoCubicRel.prototype._asPathString = function () {
              return (this.pathSegTypeAsLetter +
                  ' ' +
                  this._x1 +
                  ' ' +
                  this._y1 +
                  ' ' +
                  this._x2 +
                  ' ' +
                  this._y2 +
                  ' ' +
                  this._x +
                  ' ' +
                  this._y);
          };
          window.SVGPathSegCurvetoCubicRel.prototype.clone = function () {
              return new window.SVGPathSegCurvetoCubicRel(undefined, this._x, this._y, this._x1, this._y1, this._x2, this._y2);
          };
          Object.defineProperty(window.SVGPathSegCurvetoCubicRel.prototype, 'x', {
              get: function () {
                  return this._x;
              },
              set: function (x) {
                  this._x = x;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoCubicRel.prototype, 'y', {
              get: function () {
                  return this._y;
              },
              set: function (y) {
                  this._y = y;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoCubicRel.prototype, 'x1', {
              get: function () {
                  return this._x1;
              },
              set: function (x1) {
                  this._x1 = x1;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoCubicRel.prototype, 'y1', {
              get: function () {
                  return this._y1;
              },
              set: function (y1) {
                  this._y1 = y1;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoCubicRel.prototype, 'x2', {
              get: function () {
                  return this._x2;
              },
              set: function (x2) {
                  this._x2 = x2;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoCubicRel.prototype, 'y2', {
              get: function () {
                  return this._y2;
              },
              set: function (y2) {
                  this._y2 = y2;
                  this._segmentChanged();
              },
              enumerable: true
          });
          window.SVGPathSegCurvetoQuadraticAbs = function (owningPathSegList, x, y, x1, y1) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS, 'Q', owningPathSegList);
              this._x = x;
              this._y = y;
              this._x1 = x1;
              this._y1 = y1;
          };
          window.SVGPathSegCurvetoQuadraticAbs.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegCurvetoQuadraticAbs.prototype.toString = function () {
              return '[object SVGPathSegCurvetoQuadraticAbs]';
          };
          window.SVGPathSegCurvetoQuadraticAbs.prototype._asPathString = function () {
              return (this.pathSegTypeAsLetter +
                  ' ' +
                  this._x1 +
                  ' ' +
                  this._y1 +
                  ' ' +
                  this._x +
                  ' ' +
                  this._y);
          };
          window.SVGPathSegCurvetoQuadraticAbs.prototype.clone = function () {
              return new window.SVGPathSegCurvetoQuadraticAbs(undefined, this._x, this._y, this._x1, this._y1);
          };
          Object.defineProperty(window.SVGPathSegCurvetoQuadraticAbs.prototype, 'x', {
              get: function () {
                  return this._x;
              },
              set: function (x) {
                  this._x = x;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoQuadraticAbs.prototype, 'y', {
              get: function () {
                  return this._y;
              },
              set: function (y) {
                  this._y = y;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoQuadraticAbs.prototype, 'x1', {
              get: function () {
                  return this._x1;
              },
              set: function (x1) {
                  this._x1 = x1;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoQuadraticAbs.prototype, 'y1', {
              get: function () {
                  return this._y1;
              },
              set: function (y1) {
                  this._y1 = y1;
                  this._segmentChanged();
              },
              enumerable: true
          });
          window.SVGPathSegCurvetoQuadraticRel = function (owningPathSegList, x, y, x1, y1) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL, 'q', owningPathSegList);
              this._x = x;
              this._y = y;
              this._x1 = x1;
              this._y1 = y1;
          };
          window.SVGPathSegCurvetoQuadraticRel.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegCurvetoQuadraticRel.prototype.toString = function () {
              return '[object SVGPathSegCurvetoQuadraticRel]';
          };
          window.SVGPathSegCurvetoQuadraticRel.prototype._asPathString = function () {
              return (this.pathSegTypeAsLetter +
                  ' ' +
                  this._x1 +
                  ' ' +
                  this._y1 +
                  ' ' +
                  this._x +
                  ' ' +
                  this._y);
          };
          window.SVGPathSegCurvetoQuadraticRel.prototype.clone = function () {
              return new window.SVGPathSegCurvetoQuadraticRel(undefined, this._x, this._y, this._x1, this._y1);
          };
          Object.defineProperty(window.SVGPathSegCurvetoQuadraticRel.prototype, 'x', {
              get: function () {
                  return this._x;
              },
              set: function (x) {
                  this._x = x;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoQuadraticRel.prototype, 'y', {
              get: function () {
                  return this._y;
              },
              set: function (y) {
                  this._y = y;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoQuadraticRel.prototype, 'x1', {
              get: function () {
                  return this._x1;
              },
              set: function (x1) {
                  this._x1 = x1;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoQuadraticRel.prototype, 'y1', {
              get: function () {
                  return this._y1;
              },
              set: function (y1) {
                  this._y1 = y1;
                  this._segmentChanged();
              },
              enumerable: true
          });
          window.SVGPathSegArcAbs = function (owningPathSegList, x, y, r1, r2, angle, largeArcFlag, sweepFlag) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_ARC_ABS, 'A', owningPathSegList);
              this._x = x;
              this._y = y;
              this._r1 = r1;
              this._r2 = r2;
              this._angle = angle;
              this._largeArcFlag = largeArcFlag;
              this._sweepFlag = sweepFlag;
          };
          window.SVGPathSegArcAbs.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegArcAbs.prototype.toString = function () {
              return '[object SVGPathSegArcAbs]';
          };
          window.SVGPathSegArcAbs.prototype._asPathString = function () {
              return (this.pathSegTypeAsLetter +
                  ' ' +
                  this._r1 +
                  ' ' +
                  this._r2 +
                  ' ' +
                  this._angle +
                  ' ' +
                  (this._largeArcFlag ? '1' : '0') +
                  ' ' +
                  (this._sweepFlag ? '1' : '0') +
                  ' ' +
                  this._x +
                  ' ' +
                  this._y);
          };
          window.SVGPathSegArcAbs.prototype.clone = function () {
              return new window.SVGPathSegArcAbs(undefined, this._x, this._y, this._r1, this._r2, this._angle, this._largeArcFlag, this._sweepFlag);
          };
          Object.defineProperty(window.SVGPathSegArcAbs.prototype, 'x', {
              get: function () {
                  return this._x;
              },
              set: function (x) {
                  this._x = x;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegArcAbs.prototype, 'y', {
              get: function () {
                  return this._y;
              },
              set: function (y) {
                  this._y = y;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegArcAbs.prototype, 'r1', {
              get: function () {
                  return this._r1;
              },
              set: function (r1) {
                  this._r1 = r1;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegArcAbs.prototype, 'r2', {
              get: function () {
                  return this._r2;
              },
              set: function (r2) {
                  this._r2 = r2;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegArcAbs.prototype, 'angle', {
              get: function () {
                  return this._angle;
              },
              set: function (angle) {
                  this._angle = angle;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegArcAbs.prototype, 'largeArcFlag', {
              get: function () {
                  return this._largeArcFlag;
              },
              set: function (largeArcFlag) {
                  this._largeArcFlag = largeArcFlag;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegArcAbs.prototype, 'sweepFlag', {
              get: function () {
                  return this._sweepFlag;
              },
              set: function (sweepFlag) {
                  this._sweepFlag = sweepFlag;
                  this._segmentChanged();
              },
              enumerable: true
          });
          window.SVGPathSegArcRel = function (owningPathSegList, x, y, r1, r2, angle, largeArcFlag, sweepFlag) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_ARC_REL, 'a', owningPathSegList);
              this._x = x;
              this._y = y;
              this._r1 = r1;
              this._r2 = r2;
              this._angle = angle;
              this._largeArcFlag = largeArcFlag;
              this._sweepFlag = sweepFlag;
          };
          window.SVGPathSegArcRel.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegArcRel.prototype.toString = function () {
              return '[object SVGPathSegArcRel]';
          };
          window.SVGPathSegArcRel.prototype._asPathString = function () {
              return (this.pathSegTypeAsLetter +
                  ' ' +
                  this._r1 +
                  ' ' +
                  this._r2 +
                  ' ' +
                  this._angle +
                  ' ' +
                  (this._largeArcFlag ? '1' : '0') +
                  ' ' +
                  (this._sweepFlag ? '1' : '0') +
                  ' ' +
                  this._x +
                  ' ' +
                  this._y);
          };
          window.SVGPathSegArcRel.prototype.clone = function () {
              return new window.SVGPathSegArcRel(undefined, this._x, this._y, this._r1, this._r2, this._angle, this._largeArcFlag, this._sweepFlag);
          };
          Object.defineProperty(window.SVGPathSegArcRel.prototype, 'x', {
              get: function () {
                  return this._x;
              },
              set: function (x) {
                  this._x = x;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegArcRel.prototype, 'y', {
              get: function () {
                  return this._y;
              },
              set: function (y) {
                  this._y = y;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegArcRel.prototype, 'r1', {
              get: function () {
                  return this._r1;
              },
              set: function (r1) {
                  this._r1 = r1;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegArcRel.prototype, 'r2', {
              get: function () {
                  return this._r2;
              },
              set: function (r2) {
                  this._r2 = r2;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegArcRel.prototype, 'angle', {
              get: function () {
                  return this._angle;
              },
              set: function (angle) {
                  this._angle = angle;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegArcRel.prototype, 'largeArcFlag', {
              get: function () {
                  return this._largeArcFlag;
              },
              set: function (largeArcFlag) {
                  this._largeArcFlag = largeArcFlag;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegArcRel.prototype, 'sweepFlag', {
              get: function () {
                  return this._sweepFlag;
              },
              set: function (sweepFlag) {
                  this._sweepFlag = sweepFlag;
                  this._segmentChanged();
              },
              enumerable: true
          });
          window.SVGPathSegLinetoHorizontalAbs = function (owningPathSegList, x) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS, 'H', owningPathSegList);
              this._x = x;
          };
          window.SVGPathSegLinetoHorizontalAbs.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegLinetoHorizontalAbs.prototype.toString = function () {
              return '[object SVGPathSegLinetoHorizontalAbs]';
          };
          window.SVGPathSegLinetoHorizontalAbs.prototype._asPathString = function () {
              return this.pathSegTypeAsLetter + ' ' + this._x;
          };
          window.SVGPathSegLinetoHorizontalAbs.prototype.clone = function () {
              return new window.SVGPathSegLinetoHorizontalAbs(undefined, this._x);
          };
          Object.defineProperty(window.SVGPathSegLinetoHorizontalAbs.prototype, 'x', {
              get: function () {
                  return this._x;
              },
              set: function (x) {
                  this._x = x;
                  this._segmentChanged();
              },
              enumerable: true
          });
          window.SVGPathSegLinetoHorizontalRel = function (owningPathSegList, x) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL, 'h', owningPathSegList);
              this._x = x;
          };
          window.SVGPathSegLinetoHorizontalRel.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegLinetoHorizontalRel.prototype.toString = function () {
              return '[object SVGPathSegLinetoHorizontalRel]';
          };
          window.SVGPathSegLinetoHorizontalRel.prototype._asPathString = function () {
              return this.pathSegTypeAsLetter + ' ' + this._x;
          };
          window.SVGPathSegLinetoHorizontalRel.prototype.clone = function () {
              return new window.SVGPathSegLinetoHorizontalRel(undefined, this._x);
          };
          Object.defineProperty(window.SVGPathSegLinetoHorizontalRel.prototype, 'x', {
              get: function () {
                  return this._x;
              },
              set: function (x) {
                  this._x = x;
                  this._segmentChanged();
              },
              enumerable: true
          });
          window.SVGPathSegLinetoVerticalAbs = function (owningPathSegList, y) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS, 'V', owningPathSegList);
              this._y = y;
          };
          window.SVGPathSegLinetoVerticalAbs.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegLinetoVerticalAbs.prototype.toString = function () {
              return '[object SVGPathSegLinetoVerticalAbs]';
          };
          window.SVGPathSegLinetoVerticalAbs.prototype._asPathString = function () {
              return this.pathSegTypeAsLetter + ' ' + this._y;
          };
          window.SVGPathSegLinetoVerticalAbs.prototype.clone = function () {
              return new window.SVGPathSegLinetoVerticalAbs(undefined, this._y);
          };
          Object.defineProperty(window.SVGPathSegLinetoVerticalAbs.prototype, 'y', {
              get: function () {
                  return this._y;
              },
              set: function (y) {
                  this._y = y;
                  this._segmentChanged();
              },
              enumerable: true
          });
          window.SVGPathSegLinetoVerticalRel = function (owningPathSegList, y) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL, 'v', owningPathSegList);
              this._y = y;
          };
          window.SVGPathSegLinetoVerticalRel.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegLinetoVerticalRel.prototype.toString = function () {
              return '[object SVGPathSegLinetoVerticalRel]';
          };
          window.SVGPathSegLinetoVerticalRel.prototype._asPathString = function () {
              return this.pathSegTypeAsLetter + ' ' + this._y;
          };
          window.SVGPathSegLinetoVerticalRel.prototype.clone = function () {
              return new window.SVGPathSegLinetoVerticalRel(undefined, this._y);
          };
          Object.defineProperty(window.SVGPathSegLinetoVerticalRel.prototype, 'y', {
              get: function () {
                  return this._y;
              },
              set: function (y) {
                  this._y = y;
                  this._segmentChanged();
              },
              enumerable: true
          });
          window.SVGPathSegCurvetoCubicSmoothAbs = function (owningPathSegList, x, y, x2, y2) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS, 'S', owningPathSegList);
              this._x = x;
              this._y = y;
              this._x2 = x2;
              this._y2 = y2;
          };
          window.SVGPathSegCurvetoCubicSmoothAbs.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegCurvetoCubicSmoothAbs.prototype.toString = function () {
              return '[object SVGPathSegCurvetoCubicSmoothAbs]';
          };
          window.SVGPathSegCurvetoCubicSmoothAbs.prototype._asPathString = function () {
              return (this.pathSegTypeAsLetter +
                  ' ' +
                  this._x2 +
                  ' ' +
                  this._y2 +
                  ' ' +
                  this._x +
                  ' ' +
                  this._y);
          };
          window.SVGPathSegCurvetoCubicSmoothAbs.prototype.clone = function () {
              return new window.SVGPathSegCurvetoCubicSmoothAbs(undefined, this._x, this._y, this._x2, this._y2);
          };
          Object.defineProperty(window.SVGPathSegCurvetoCubicSmoothAbs.prototype, 'x', {
              get: function () {
                  return this._x;
              },
              set: function (x) {
                  this._x = x;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoCubicSmoothAbs.prototype, 'y', {
              get: function () {
                  return this._y;
              },
              set: function (y) {
                  this._y = y;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoCubicSmoothAbs.prototype, 'x2', {
              get: function () {
                  return this._x2;
              },
              set: function (x2) {
                  this._x2 = x2;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoCubicSmoothAbs.prototype, 'y2', {
              get: function () {
                  return this._y2;
              },
              set: function (y2) {
                  this._y2 = y2;
                  this._segmentChanged();
              },
              enumerable: true
          });
          window.SVGPathSegCurvetoCubicSmoothRel = function (owningPathSegList, x, y, x2, y2) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL, 's', owningPathSegList);
              this._x = x;
              this._y = y;
              this._x2 = x2;
              this._y2 = y2;
          };
          window.SVGPathSegCurvetoCubicSmoothRel.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegCurvetoCubicSmoothRel.prototype.toString = function () {
              return '[object SVGPathSegCurvetoCubicSmoothRel]';
          };
          window.SVGPathSegCurvetoCubicSmoothRel.prototype._asPathString = function () {
              return (this.pathSegTypeAsLetter +
                  ' ' +
                  this._x2 +
                  ' ' +
                  this._y2 +
                  ' ' +
                  this._x +
                  ' ' +
                  this._y);
          };
          window.SVGPathSegCurvetoCubicSmoothRel.prototype.clone = function () {
              return new window.SVGPathSegCurvetoCubicSmoothRel(undefined, this._x, this._y, this._x2, this._y2);
          };
          Object.defineProperty(window.SVGPathSegCurvetoCubicSmoothRel.prototype, 'x', {
              get: function () {
                  return this._x;
              },
              set: function (x) {
                  this._x = x;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoCubicSmoothRel.prototype, 'y', {
              get: function () {
                  return this._y;
              },
              set: function (y) {
                  this._y = y;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoCubicSmoothRel.prototype, 'x2', {
              get: function () {
                  return this._x2;
              },
              set: function (x2) {
                  this._x2 = x2;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoCubicSmoothRel.prototype, 'y2', {
              get: function () {
                  return this._y2;
              },
              set: function (y2) {
                  this._y2 = y2;
                  this._segmentChanged();
              },
              enumerable: true
          });
          window.SVGPathSegCurvetoQuadraticSmoothAbs = function (owningPathSegList, x, y) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS, 'T', owningPathSegList);
              this._x = x;
              this._y = y;
          };
          window.SVGPathSegCurvetoQuadraticSmoothAbs.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegCurvetoQuadraticSmoothAbs.prototype.toString = function () {
              return '[object SVGPathSegCurvetoQuadraticSmoothAbs]';
          };
          window.SVGPathSegCurvetoQuadraticSmoothAbs.prototype._asPathString = function () {
              return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y;
          };
          window.SVGPathSegCurvetoQuadraticSmoothAbs.prototype.clone = function () {
              return new window.SVGPathSegCurvetoQuadraticSmoothAbs(undefined, this._x, this._y);
          };
          Object.defineProperty(window.SVGPathSegCurvetoQuadraticSmoothAbs.prototype, 'x', {
              get: function () {
                  return this._x;
              },
              set: function (x) {
                  this._x = x;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoQuadraticSmoothAbs.prototype, 'y', {
              get: function () {
                  return this._y;
              },
              set: function (y) {
                  this._y = y;
                  this._segmentChanged();
              },
              enumerable: true
          });
          window.SVGPathSegCurvetoQuadraticSmoothRel = function (owningPathSegList, x, y) {
              window.SVGPathSeg.call(this, window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL, 't', owningPathSegList);
              this._x = x;
              this._y = y;
          };
          window.SVGPathSegCurvetoQuadraticSmoothRel.prototype = Object.create(window.SVGPathSeg.prototype);
          window.SVGPathSegCurvetoQuadraticSmoothRel.prototype.toString = function () {
              return '[object SVGPathSegCurvetoQuadraticSmoothRel]';
          };
          window.SVGPathSegCurvetoQuadraticSmoothRel.prototype._asPathString = function () {
              return this.pathSegTypeAsLetter + ' ' + this._x + ' ' + this._y;
          };
          window.SVGPathSegCurvetoQuadraticSmoothRel.prototype.clone = function () {
              return new window.SVGPathSegCurvetoQuadraticSmoothRel(undefined, this._x, this._y);
          };
          Object.defineProperty(window.SVGPathSegCurvetoQuadraticSmoothRel.prototype, 'x', {
              get: function () {
                  return this._x;
              },
              set: function (x) {
                  this._x = x;
                  this._segmentChanged();
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathSegCurvetoQuadraticSmoothRel.prototype, 'y', {
              get: function () {
                  return this._y;
              },
              set: function (y) {
                  this._y = y;
                  this._segmentChanged();
              },
              enumerable: true
          });
          // Add createSVGPathSeg* functions to window.SVGPathElement.
          // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-Interfacewindow.SVGPathElement.
          window.SVGPathElement.prototype.createSVGPathSegClosePath = function () {
              return new window.SVGPathSegClosePath(undefined);
          };
          window.SVGPathElement.prototype.createSVGPathSegMovetoAbs = function (x, y) {
              return new window.SVGPathSegMovetoAbs(undefined, x, y);
          };
          window.SVGPathElement.prototype.createSVGPathSegMovetoRel = function (x, y) {
              return new window.SVGPathSegMovetoRel(undefined, x, y);
          };
          window.SVGPathElement.prototype.createSVGPathSegLinetoAbs = function (x, y) {
              return new window.SVGPathSegLinetoAbs(undefined, x, y);
          };
          window.SVGPathElement.prototype.createSVGPathSegLinetoRel = function (x, y) {
              return new window.SVGPathSegLinetoRel(undefined, x, y);
          };
          window.SVGPathElement.prototype.createSVGPathSegCurvetoCubicAbs = function (x, y, x1, y1, x2, y2) {
              return new window.SVGPathSegCurvetoCubicAbs(undefined, x, y, x1, y1, x2, y2);
          };
          window.SVGPathElement.prototype.createSVGPathSegCurvetoCubicRel = function (x, y, x1, y1, x2, y2) {
              return new window.SVGPathSegCurvetoCubicRel(undefined, x, y, x1, y1, x2, y2);
          };
          window.SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticAbs = function (x, y, x1, y1) {
              return new window.SVGPathSegCurvetoQuadraticAbs(undefined, x, y, x1, y1);
          };
          window.SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticRel = function (x, y, x1, y1) {
              return new window.SVGPathSegCurvetoQuadraticRel(undefined, x, y, x1, y1);
          };
          window.SVGPathElement.prototype.createSVGPathSegArcAbs = function (x, y, r1, r2, angle, largeArcFlag, sweepFlag) {
              return new window.SVGPathSegArcAbs(undefined, x, y, r1, r2, angle, largeArcFlag, sweepFlag);
          };
          window.SVGPathElement.prototype.createSVGPathSegArcRel = function (x, y, r1, r2, angle, largeArcFlag, sweepFlag) {
              return new window.SVGPathSegArcRel(undefined, x, y, r1, r2, angle, largeArcFlag, sweepFlag);
          };
          window.SVGPathElement.prototype.createSVGPathSegLinetoHorizontalAbs = function (x) {
              return new window.SVGPathSegLinetoHorizontalAbs(undefined, x);
          };
          window.SVGPathElement.prototype.createSVGPathSegLinetoHorizontalRel = function (x) {
              return new window.SVGPathSegLinetoHorizontalRel(undefined, x);
          };
          window.SVGPathElement.prototype.createSVGPathSegLinetoVerticalAbs = function (y) {
              return new window.SVGPathSegLinetoVerticalAbs(undefined, y);
          };
          window.SVGPathElement.prototype.createSVGPathSegLinetoVerticalRel = function (y) {
              return new window.SVGPathSegLinetoVerticalRel(undefined, y);
          };
          window.SVGPathElement.prototype.createSVGPathSegCurvetoCubicSmoothAbs = function (x, y, x2, y2) {
              return new window.SVGPathSegCurvetoCubicSmoothAbs(undefined, x, y, x2, y2);
          };
          window.SVGPathElement.prototype.createSVGPathSegCurvetoCubicSmoothRel = function (x, y, x2, y2) {
              return new window.SVGPathSegCurvetoCubicSmoothRel(undefined, x, y, x2, y2);
          };
          window.SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticSmoothAbs = function (x, y) {
              return new window.SVGPathSegCurvetoQuadraticSmoothAbs(undefined, x, y);
          };
          window.SVGPathElement.prototype.createSVGPathSegCurvetoQuadraticSmoothRel = function (x, y) {
              return new window.SVGPathSegCurvetoQuadraticSmoothRel(undefined, x, y);
          };
          if (!('getPathSegAtLength' in window.SVGPathElement.prototype)) {
              // Add getPathSegAtLength to SVGPathElement.
              // Spec: https://www.w3.org/TR/SVG11/single-page.html#paths-__svg__SVGPathElement__getPathSegAtLength
              // This polyfill requires SVGPathElement.getTotalLength to implement the distance-along-a-path algorithm.
              window.SVGPathElement.prototype.getPathSegAtLength = function (distance) {
                  if (distance === undefined || !isFinite(distance))
                      throw 'Invalid arguments.';
                  var measurementElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                  measurementElement.setAttribute('d', this.getAttribute('d'));
                  var lastPathSegment = measurementElement.pathSegList.numberOfItems - 1;
                  // If the path is empty, return 0.
                  if (lastPathSegment <= 0)
                      return 0;
                  do {
                      measurementElement.pathSegList.removeItem(lastPathSegment);
                      if (distance > measurementElement.getTotalLength())
                          break;
                      lastPathSegment--;
                  } while (lastPathSegment > 0);
                  return lastPathSegment;
              };
          }
      }
      if (!('SVGPathSegList' in window)) {
          // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-InterfaceSVGPathSegList
          window.SVGPathSegList = function (pathElement) {
              this._pathElement = pathElement;
              this._list = this._parsePath(this._pathElement.getAttribute('d'));
              // Use a MutationObserver to catch changes to the path's "d" attribute.
              this._mutationObserverConfig = {
                  attributes: true,
                  attributeFilter: ['d']
              };
              this._pathElementMutationObserver = new MutationObserver(this._updateListFromPathMutations.bind(this));
              this._pathElementMutationObserver.observe(this._pathElement, this._mutationObserverConfig);
          };
          window.SVGPathSegList.prototype.classname = 'SVGPathSegList';
          Object.defineProperty(window.SVGPathSegList.prototype, 'numberOfItems', {
              get: function () {
                  this._checkPathSynchronizedToList();
                  return this._list.length;
              },
              enumerable: true
          });
          // Add the pathSegList accessors to window.SVGPathElement.
          // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-InterfaceSVGAnimatedPathData
          Object.defineProperty(window.SVGPathElement.prototype, 'pathSegList', {
              get: function () {
                  if (!this._pathSegList)
                      this._pathSegList = new window.SVGPathSegList(this);
                  return this._pathSegList;
              },
              enumerable: true
          });
          // FIXME: The following are not implemented and simply return window.SVGPathElement.pathSegList.
          Object.defineProperty(window.SVGPathElement.prototype, 'normalizedPathSegList', {
              get: function () {
                  return this.pathSegList;
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathElement.prototype, 'animatedPathSegList', {
              get: function () {
                  return this.pathSegList;
              },
              enumerable: true
          });
          Object.defineProperty(window.SVGPathElement.prototype, 'animatedNormalizedPathSegList', {
              get: function () {
                  return this.pathSegList;
              },
              enumerable: true
          });
          // Process any pending mutations to the path element and update the list as needed.
          // This should be the first call of all public functions and is needed because
          // MutationObservers are not synchronous so we can have pending asynchronous mutations.
          window.SVGPathSegList.prototype._checkPathSynchronizedToList = function () {
              this._updateListFromPathMutations(this._pathElementMutationObserver.takeRecords());
          };
          window.SVGPathSegList.prototype._updateListFromPathMutations = function (mutationRecords) {
              if (!this._pathElement)
                  return;
              var hasPathMutations = false;
              mutationRecords.forEach(function (record) {
                  if (record.attributeName == 'd')
                      hasPathMutations = true;
              });
              if (hasPathMutations)
                  this._list = this._parsePath(this._pathElement.getAttribute('d'));
          };
          // Serialize the list and update the path's 'd' attribute.
          window.SVGPathSegList.prototype._writeListToPath = function () {
              this._pathElementMutationObserver.disconnect();
              this._pathElement.setAttribute('d', window.SVGPathSegList._pathSegArrayAsString(this._list));
              this._pathElementMutationObserver.observe(this._pathElement, this._mutationObserverConfig);
          };
          // When a path segment changes the list needs to be synchronized back to the path element.
          window.SVGPathSegList.prototype.segmentChanged = function (pathSeg) {
              this._writeListToPath();
          };
          window.SVGPathSegList.prototype.clear = function () {
              this._checkPathSynchronizedToList();
              this._list.forEach(function (pathSeg) {
                  pathSeg._owningPathSegList = null;
              });
              this._list = [];
              this._writeListToPath();
          };
          window.SVGPathSegList.prototype.initialize = function (newItem) {
              this._checkPathSynchronizedToList();
              this._list = [newItem];
              newItem._owningPathSegList = this;
              this._writeListToPath();
              return newItem;
          };
          window.SVGPathSegList.prototype._checkValidIndex = function (index) {
              if (isNaN(index) || index < 0 || index >= this.numberOfItems)
                  throw 'INDEX_SIZE_ERR';
          };
          window.SVGPathSegList.prototype.getItem = function (index) {
              this._checkPathSynchronizedToList();
              this._checkValidIndex(index);
              return this._list[index];
          };
          window.SVGPathSegList.prototype.insertItemBefore = function (newItem, index) {
              this._checkPathSynchronizedToList();
              // Spec: If the index is greater than or equal to numberOfItems, then the new item is appended to the end of the list.
              if (index > this.numberOfItems)
                  index = this.numberOfItems;
              if (newItem._owningPathSegList) {
                  // SVG2 spec says to make a copy.
                  newItem = newItem.clone();
              }
              this._list.splice(index, 0, newItem);
              newItem._owningPathSegList = this;
              this._writeListToPath();
              return newItem;
          };
          window.SVGPathSegList.prototype.replaceItem = function (newItem, index) {
              this._checkPathSynchronizedToList();
              if (newItem._owningPathSegList) {
                  // SVG2 spec says to make a copy.
                  newItem = newItem.clone();
              }
              this._checkValidIndex(index);
              this._list[index] = newItem;
              newItem._owningPathSegList = this;
              this._writeListToPath();
              return newItem;
          };
          window.SVGPathSegList.prototype.removeItem = function (index) {
              this._checkPathSynchronizedToList();
              this._checkValidIndex(index);
              var item = this._list[index];
              this._list.splice(index, 1);
              this._writeListToPath();
              return item;
          };
          window.SVGPathSegList.prototype.appendItem = function (newItem) {
              this._checkPathSynchronizedToList();
              if (newItem._owningPathSegList) {
                  // SVG2 spec says to make a copy.
                  newItem = newItem.clone();
              }
              this._list.push(newItem);
              newItem._owningPathSegList = this;
              // TODO: Optimize this to just append to the existing attribute.
              this._writeListToPath();
              return newItem;
          };
          window.SVGPathSegList._pathSegArrayAsString = function (pathSegArray) {
              var string = '';
              var first = true;
              pathSegArray.forEach(function (pathSeg) {
                  if (first) {
                      first = false;
                      string += pathSeg._asPathString();
                  }
                  else {
                      string += ' ' + pathSeg._asPathString();
                  }
              });
              return string;
          };
          // This closely follows SVGPathParser::parsePath from Source/core/svg/SVGPathParser.cpp.
          window.SVGPathSegList.prototype._parsePath = function (string) {
              if (!string || string.length == 0)
                  return [];
              var owningPathSegList = this;
              var Builder = function () {
                  this.pathSegList = [];
              };
              Builder.prototype.appendSegment = function (pathSeg) {
                  this.pathSegList.push(pathSeg);
              };
              var Source = function (string) {
                  this._string = string;
                  this._currentIndex = 0;
                  this._endIndex = this._string.length;
                  this._previousCommand = window.SVGPathSeg.PATHSEG_UNKNOWN;
                  this._skipOptionalSpaces();
              };
              Source.prototype._isCurrentSpace = function () {
                  var character = this._string[this._currentIndex];
                  return (character <= ' ' &&
                      (character == ' ' ||
                          character == '\n' ||
                          character == '\t' ||
                          character == '\r' ||
                          character == '\f'));
              };
              Source.prototype._skipOptionalSpaces = function () {
                  while (this._currentIndex < this._endIndex && this._isCurrentSpace())
                      this._currentIndex++;
                  return this._currentIndex < this._endIndex;
              };
              Source.prototype._skipOptionalSpacesOrDelimiter = function () {
                  if (this._currentIndex < this._endIndex &&
                      !this._isCurrentSpace() &&
                      this._string.charAt(this._currentIndex) != ',')
                      return false;
                  if (this._skipOptionalSpaces()) {
                      if (this._currentIndex < this._endIndex &&
                          this._string.charAt(this._currentIndex) == ',') {
                          this._currentIndex++;
                          this._skipOptionalSpaces();
                      }
                  }
                  return this._currentIndex < this._endIndex;
              };
              Source.prototype.hasMoreData = function () {
                  return this._currentIndex < this._endIndex;
              };
              Source.prototype.peekSegmentType = function () {
                  var lookahead = this._string[this._currentIndex];
                  return this._pathSegTypeFromChar(lookahead);
              };
              Source.prototype._pathSegTypeFromChar = function (lookahead) {
                  switch (lookahead) {
                      case 'Z':
                      case 'z':
                          return window.SVGPathSeg.PATHSEG_CLOSEPATH;
                      case 'M':
                          return window.SVGPathSeg.PATHSEG_MOVETO_ABS;
                      case 'm':
                          return window.SVGPathSeg.PATHSEG_MOVETO_REL;
                      case 'L':
                          return window.SVGPathSeg.PATHSEG_LINETO_ABS;
                      case 'l':
                          return window.SVGPathSeg.PATHSEG_LINETO_REL;
                      case 'C':
                          return window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS;
                      case 'c':
                          return window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL;
                      case 'Q':
                          return window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS;
                      case 'q':
                          return window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL;
                      case 'A':
                          return window.SVGPathSeg.PATHSEG_ARC_ABS;
                      case 'a':
                          return window.SVGPathSeg.PATHSEG_ARC_REL;
                      case 'H':
                          return window.SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS;
                      case 'h':
                          return window.SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL;
                      case 'V':
                          return window.SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS;
                      case 'v':
                          return window.SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL;
                      case 'S':
                          return window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS;
                      case 's':
                          return window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL;
                      case 'T':
                          return window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS;
                      case 't':
                          return window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL;
                      default:
                          return window.SVGPathSeg.PATHSEG_UNKNOWN;
                  }
              };
              Source.prototype._nextCommandHelper = function (lookahead, previousCommand) {
                  // Check for remaining coordinates in the current command.
                  if ((lookahead == '+' ||
                      lookahead == '-' ||
                      lookahead == '.' ||
                      (lookahead >= '0' && lookahead <= '9')) &&
                      previousCommand != window.SVGPathSeg.PATHSEG_CLOSEPATH) {
                      if (previousCommand == window.SVGPathSeg.PATHSEG_MOVETO_ABS)
                          return window.SVGPathSeg.PATHSEG_LINETO_ABS;
                      if (previousCommand == window.SVGPathSeg.PATHSEG_MOVETO_REL)
                          return window.SVGPathSeg.PATHSEG_LINETO_REL;
                      return previousCommand;
                  }
                  return window.SVGPathSeg.PATHSEG_UNKNOWN;
              };
              Source.prototype.initialCommandIsMoveTo = function () {
                  // If the path is empty it is still valid, so return true.
                  if (!this.hasMoreData())
                      return true;
                  var command = this.peekSegmentType();
                  // Path must start with moveTo.
                  return (command == window.SVGPathSeg.PATHSEG_MOVETO_ABS ||
                      command == window.SVGPathSeg.PATHSEG_MOVETO_REL);
              };
              // Parse a number from an SVG path. This very closely follows genericParseNumber(...) from Source/core/svg/SVGParserUtilities.cpp.
              // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-PathDataBNF
              Source.prototype._parseNumber = function () {
                  var exponent = 0;
                  var integer = 0;
                  var frac = 1;
                  var decimal = 0;
                  var sign = 1;
                  var expsign = 1;
                  var startIndex = this._currentIndex;
                  this._skipOptionalSpaces();
                  // Read the sign.
                  if (this._currentIndex < this._endIndex &&
                      this._string.charAt(this._currentIndex) == '+')
                      this._currentIndex++;
                  else if (this._currentIndex < this._endIndex &&
                      this._string.charAt(this._currentIndex) == '-') {
                      this._currentIndex++;
                      sign = -1;
                  }
                  if (this._currentIndex == this._endIndex ||
                      ((this._string.charAt(this._currentIndex) < '0' ||
                          this._string.charAt(this._currentIndex) > '9') &&
                          this._string.charAt(this._currentIndex) != '.'))
                      // The first character of a number must be one of [0-9+-.].
                      return undefined;
                  // Read the integer part, build right-to-left.
                  var startIntPartIndex = this._currentIndex;
                  while (this._currentIndex < this._endIndex &&
                      this._string.charAt(this._currentIndex) >= '0' &&
                      this._string.charAt(this._currentIndex) <= '9')
                      this._currentIndex++; // Advance to first non-digit.
                  if (this._currentIndex != startIntPartIndex) {
                      var scanIntPartIndex = this._currentIndex - 1;
                      var multiplier = 1;
                      while (scanIntPartIndex >= startIntPartIndex) {
                          integer +=
                              multiplier * (this._string.charAt(scanIntPartIndex--) - '0');
                          multiplier *= 10;
                      }
                  }
                  // Read the decimals.
                  if (this._currentIndex < this._endIndex &&
                      this._string.charAt(this._currentIndex) == '.') {
                      this._currentIndex++;
                      // There must be a least one digit following the .
                      if (this._currentIndex >= this._endIndex ||
                          this._string.charAt(this._currentIndex) < '0' ||
                          this._string.charAt(this._currentIndex) > '9')
                          return undefined;
                      while (this._currentIndex < this._endIndex &&
                          this._string.charAt(this._currentIndex) >= '0' &&
                          this._string.charAt(this._currentIndex) <= '9') {
                          frac *= 10;
                          decimal += (this._string.charAt(this._currentIndex) - '0') / frac;
                          this._currentIndex += 1;
                      }
                  }
                  // Read the exponent part.
                  if (this._currentIndex != startIndex &&
                      this._currentIndex + 1 < this._endIndex &&
                      (this._string.charAt(this._currentIndex) == 'e' ||
                          this._string.charAt(this._currentIndex) == 'E') &&
                      this._string.charAt(this._currentIndex + 1) != 'x' &&
                      this._string.charAt(this._currentIndex + 1) != 'm') {
                      this._currentIndex++;
                      // Read the sign of the exponent.
                      if (this._string.charAt(this._currentIndex) == '+') {
                          this._currentIndex++;
                      }
                      else if (this._string.charAt(this._currentIndex) == '-') {
                          this._currentIndex++;
                          expsign = -1;
                      }
                      // There must be an exponent.
                      if (this._currentIndex >= this._endIndex ||
                          this._string.charAt(this._currentIndex) < '0' ||
                          this._string.charAt(this._currentIndex) > '9')
                          return undefined;
                      while (this._currentIndex < this._endIndex &&
                          this._string.charAt(this._currentIndex) >= '0' &&
                          this._string.charAt(this._currentIndex) <= '9') {
                          exponent *= 10;
                          exponent += this._string.charAt(this._currentIndex) - '0';
                          this._currentIndex++;
                      }
                  }
                  var number = integer + decimal;
                  number *= sign;
                  if (exponent)
                      number *= Math.pow(10, expsign * exponent);
                  if (startIndex == this._currentIndex)
                      return undefined;
                  this._skipOptionalSpacesOrDelimiter();
                  return number;
              };
              Source.prototype._parseArcFlag = function () {
                  if (this._currentIndex >= this._endIndex)
                      return undefined;
                  var flag = false;
                  var flagChar = this._string.charAt(this._currentIndex++);
                  if (flagChar == '0')
                      flag = false;
                  else if (flagChar == '1')
                      flag = true;
                  else
                      return undefined;
                  this._skipOptionalSpacesOrDelimiter();
                  return flag;
              };
              Source.prototype.parseSegment = function () {
                  var lookahead = this._string[this._currentIndex];
                  var command = this._pathSegTypeFromChar(lookahead);
                  if (command == window.SVGPathSeg.PATHSEG_UNKNOWN) {
                      // Possibly an implicit command. Not allowed if this is the first command.
                      if (this._previousCommand == window.SVGPathSeg.PATHSEG_UNKNOWN)
                          return null;
                      command = this._nextCommandHelper(lookahead, this._previousCommand);
                      if (command == window.SVGPathSeg.PATHSEG_UNKNOWN)
                          return null;
                  }
                  else {
                      this._currentIndex++;
                  }
                  this._previousCommand = command;
                  switch (command) {
                      case window.SVGPathSeg.PATHSEG_MOVETO_REL:
                          return new window.SVGPathSegMovetoRel(owningPathSegList, this._parseNumber(), this._parseNumber());
                      case window.SVGPathSeg.PATHSEG_MOVETO_ABS:
                          return new window.SVGPathSegMovetoAbs(owningPathSegList, this._parseNumber(), this._parseNumber());
                      case window.SVGPathSeg.PATHSEG_LINETO_REL:
                          return new window.SVGPathSegLinetoRel(owningPathSegList, this._parseNumber(), this._parseNumber());
                      case window.SVGPathSeg.PATHSEG_LINETO_ABS:
                          return new window.SVGPathSegLinetoAbs(owningPathSegList, this._parseNumber(), this._parseNumber());
                      case window.SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL:
                          return new window.SVGPathSegLinetoHorizontalRel(owningPathSegList, this._parseNumber());
                      case window.SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS:
                          return new window.SVGPathSegLinetoHorizontalAbs(owningPathSegList, this._parseNumber());
                      case window.SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL:
                          return new window.SVGPathSegLinetoVerticalRel(owningPathSegList, this._parseNumber());
                      case window.SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS:
                          return new window.SVGPathSegLinetoVerticalAbs(owningPathSegList, this._parseNumber());
                      case window.SVGPathSeg.PATHSEG_CLOSEPATH:
                          this._skipOptionalSpaces();
                          return new window.SVGPathSegClosePath(owningPathSegList);
                      case window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:
                          var points = {
                              x1: this._parseNumber(),
                              y1: this._parseNumber(),
                              x2: this._parseNumber(),
                              y2: this._parseNumber(),
                              x: this._parseNumber(),
                              y: this._parseNumber()
                          };
                          return new window.SVGPathSegCurvetoCubicRel(owningPathSegList, points.x, points.y, points.x1, points.y1, points.x2, points.y2);
                      case window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
                          var points = {
                              x1: this._parseNumber(),
                              y1: this._parseNumber(),
                              x2: this._parseNumber(),
                              y2: this._parseNumber(),
                              x: this._parseNumber(),
                              y: this._parseNumber()
                          };
                          return new window.SVGPathSegCurvetoCubicAbs(owningPathSegList, points.x, points.y, points.x1, points.y1, points.x2, points.y2);
                      case window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL:
                          var points = {
                              x2: this._parseNumber(),
                              y2: this._parseNumber(),
                              x: this._parseNumber(),
                              y: this._parseNumber()
                          };
                          return new window.SVGPathSegCurvetoCubicSmoothRel(owningPathSegList, points.x, points.y, points.x2, points.y2);
                      case window.SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS:
                          var points = {
                              x2: this._parseNumber(),
                              y2: this._parseNumber(),
                              x: this._parseNumber(),
                              y: this._parseNumber()
                          };
                          return new window.SVGPathSegCurvetoCubicSmoothAbs(owningPathSegList, points.x, points.y, points.x2, points.y2);
                      case window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL:
                          var points = {
                              x1: this._parseNumber(),
                              y1: this._parseNumber(),
                              x: this._parseNumber(),
                              y: this._parseNumber()
                          };
                          return new window.SVGPathSegCurvetoQuadraticRel(owningPathSegList, points.x, points.y, points.x1, points.y1);
                      case window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS:
                          var points = {
                              x1: this._parseNumber(),
                              y1: this._parseNumber(),
                              x: this._parseNumber(),
                              y: this._parseNumber()
                          };
                          return new window.SVGPathSegCurvetoQuadraticAbs(owningPathSegList, points.x, points.y, points.x1, points.y1);
                      case window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL:
                          return new window.SVGPathSegCurvetoQuadraticSmoothRel(owningPathSegList, this._parseNumber(), this._parseNumber());
                      case window.SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS:
                          return new window.SVGPathSegCurvetoQuadraticSmoothAbs(owningPathSegList, this._parseNumber(), this._parseNumber());
                      case window.SVGPathSeg.PATHSEG_ARC_REL:
                          var points = {
                              x1: this._parseNumber(),
                              y1: this._parseNumber(),
                              arcAngle: this._parseNumber(),
                              arcLarge: this._parseArcFlag(),
                              arcSweep: this._parseArcFlag(),
                              x: this._parseNumber(),
                              y: this._parseNumber()
                          };
                          return new window.SVGPathSegArcRel(owningPathSegList, points.x, points.y, points.x1, points.y1, points.arcAngle, points.arcLarge, points.arcSweep);
                      case window.SVGPathSeg.PATHSEG_ARC_ABS:
                          var points = {
                              x1: this._parseNumber(),
                              y1: this._parseNumber(),
                              arcAngle: this._parseNumber(),
                              arcLarge: this._parseArcFlag(),
                              arcSweep: this._parseArcFlag(),
                              x: this._parseNumber(),
                              y: this._parseNumber()
                          };
                          return new window.SVGPathSegArcAbs(owningPathSegList, points.x, points.y, points.x1, points.y1, points.arcAngle, points.arcLarge, points.arcSweep);
                      default:
                          throw 'Unknown path seg type.';
                  }
              };
              var builder = new Builder();
              var source = new Source(string);
              if (!source.initialCommandIsMoveTo())
                  return [];
              while (source.hasMoreData()) {
                  var pathSeg = source.parseSegment();
                  if (!pathSeg)
                      return [];
                  builder.appendSegment(pathSeg);
              }
              return builder.pathSegList;
          };
      }
  })();
  // String.padEnd polyfill for IE11
  //
  // https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd
  if (!String.prototype.padEnd) {
      String.prototype.padEnd = function padEnd(targetLength, padString) {
          targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
          padString = String(typeof padString !== 'undefined' ? padString : ' ');
          if (this.length > targetLength) {
              return String(this);
          }
          else {
              targetLength = targetLength - this.length;
              if (targetLength > padString.length) {
                  padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
              }
              return String(this) + padString.slice(0, targetLength);
          }
      };
  }
  // Object.assign polyfill for IE11
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
  if (typeof Object.assign !== 'function') {
      // Must be writable: true, enumerable: false, configurable: true
      Object.defineProperty(Object, 'assign', {
          value: function assign(target, varArgs) {
              if (target === null || target === undefined) {
                  throw new TypeError('Cannot convert undefined or null to object');
              }
              var to = Object(target);
              for (var index = 1; index < arguments.length; index++) {
                  var nextSource = arguments[index];
                  if (nextSource !== null && nextSource !== undefined) {
                      for (var nextKey in nextSource) {
                          // Avoid bugs when hasOwnProperty is shadowed
                          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                              to[nextKey] = nextSource[nextKey];
                          }
                      }
                  }
              }
              return to;
          },
          writable: true,
          configurable: true
      });
  }
  /* jshint ignore:end */

  Chart.prototype.axis = function () { };
  Chart.prototype.axis.labels = function (labels) {
      var $$ = this.internal;
      if (arguments.length) {
          Object.keys(labels).forEach(function (axisId) {
              $$.axis.setLabelText(axisId, labels[axisId]);
          });
          $$.axis.updateLabels();
      }
      // TODO: return some values?
  };
  Chart.prototype.axis.max = function (max) {
      var $$ = this.internal, config = $$.config;
      if (arguments.length) {
          if (typeof max === 'object') {
              if (isValue(max.x)) {
                  config.axis_x_max = max.x;
              }
              if (isValue(max.y)) {
                  config.axis_y_max = max.y;
              }
              if (isValue(max.y2)) {
                  config.axis_y2_max = max.y2;
              }
          }
          else {
              config.axis_y_max = config.axis_y2_max = max;
          }
          $$.redraw({ withUpdateOrgXDomain: true, withUpdateXDomain: true });
      }
      else {
          return {
              x: config.axis_x_max,
              y: config.axis_y_max,
              y2: config.axis_y2_max
          };
      }
  };
  Chart.prototype.axis.min = function (min) {
      var $$ = this.internal, config = $$.config;
      if (arguments.length) {
          if (typeof min === 'object') {
              if (isValue(min.x)) {
                  config.axis_x_min = min.x;
              }
              if (isValue(min.y)) {
                  config.axis_y_min = min.y;
              }
              if (isValue(min.y2)) {
                  config.axis_y2_min = min.y2;
              }
          }
          else {
              config.axis_y_min = config.axis_y2_min = min;
          }
          $$.redraw({ withUpdateOrgXDomain: true, withUpdateXDomain: true });
      }
      else {
          return {
              x: config.axis_x_min,
              y: config.axis_y_min,
              y2: config.axis_y2_min
          };
      }
  };
  Chart.prototype.axis.range = function (range) {
      if (arguments.length) {
          if (isDefined(range.max)) {
              this.axis.max(range.max);
          }
          if (isDefined(range.min)) {
              this.axis.min(range.min);
          }
      }
      else {
          return {
              max: this.axis.max(),
              min: this.axis.min()
          };
      }
  };
  Chart.prototype.axis.types = function (types) {
      var $$ = this.internal;
      if (types === undefined) {
          return {
              y: $$.config.axis_y_type,
              y2: $$.config.axis_y2_type
          };
      }
      else {
          if (isDefined(types.y)) {
              $$.config.axis_y_type = types.y;
          }
          if (isDefined(types.y2)) {
              $$.config.axis_y2_type = types.y2;
          }
          $$.updateScales();
          $$.redraw();
      }
  };

  Chart.prototype.category = function (i, category) {
      var $$ = this.internal, config = $$.config;
      if (arguments.length > 1) {
          config.axis_x_categories[i] = category;
          $$.redraw();
      }
      return config.axis_x_categories[i];
  };
  Chart.prototype.categories = function (categories) {
      var $$ = this.internal, config = $$.config;
      if (!arguments.length) {
          return config.axis_x_categories;
      }
      config.axis_x_categories = categories;
      $$.redraw();
      return config.axis_x_categories;
  };

  Chart.prototype.resize = function (size) {
      var $$ = this.internal, config = $$.config;
      config.size_width = size ? size.width : null;
      config.size_height = size ? size.height : null;
      this.flush();
  };
  Chart.prototype.flush = function () {
      var $$ = this.internal;
      $$.updateAndRedraw({
          withLegend: true,
          withTransition: false,
          withTransitionForTransform: false
      });
  };
  Chart.prototype.destroy = function () {
      var $$ = this.internal;
      window.clearInterval($$.intervalForObserveInserted);
      if ($$.resizeTimeout !== undefined) {
          window.clearTimeout($$.resizeTimeout);
      }
      window.removeEventListener('resize', $$.resizeIfElementDisplayed);
      // Removes the inner resize functions
      $$.resizeFunction.remove();
      // Unbinds from the window focus event
      $$.unbindWindowFocus();
      $$.selectChart.classed('c3', false).html('');
      // MEMO: this is needed because the reference of some elements will not be released, then memory leak will happen.
      Object.keys($$).forEach(function (key) {
          $$[key] = null;
      });
      return null;
  };

  // TODO: fix
  Chart.prototype.color = function (id) {
      var $$ = this.internal;
      return $$.color(id); // more patterns
  };

  Chart.prototype.data = function (targetIds) {
      var targets = this.internal.data.targets;
      return typeof targetIds === 'undefined'
          ? targets
          : targets.filter(function (t) {
              return [].concat(targetIds).indexOf(t.id) >= 0;
          });
  };
  Chart.prototype.data.shown = function (targetIds) {
      return this.internal.filterTargetsToShow(this.data(targetIds));
  };
  /**
   * Get values of the data loaded in the chart.
   *
   * @param {String|Array} targetId This API returns the value of specified target.
   * @param flat
   * @return {Array} Data values
   */
  Chart.prototype.data.values = function (targetId, flat) {
      if (flat === void 0) { flat = true; }
      var values = null;
      if (targetId) {
          var targets = this.data(targetId);
          if (targets && isArray(targets)) {
              values = targets.reduce(function (ret, v) {
                  var dataValue = v.values.map(function (d) { return d.value; });
                  if (flat) {
                      ret = ret.concat(dataValue);
                  }
                  else {
                      ret.push(dataValue);
                  }
                  return ret;
              }, []);
          }
      }
      return values;
  };
  Chart.prototype.data.names = function (names) {
      this.internal.clearLegendItemTextBoxCache();
      return this.internal.updateDataAttributes('names', names);
  };
  Chart.prototype.data.colors = function (colors) {
      return this.internal.updateDataAttributes('colors', colors);
  };
  Chart.prototype.data.axes = function (axes) {
      return this.internal.updateDataAttributes('axes', axes);
  };
  Chart.prototype.data.stackNormalized = function (normalized) {
      if (normalized === undefined) {
          return this.internal.isStackNormalized();
      }
      this.internal.config.data_stack_normalize = !!normalized;
      this.internal.redraw();
  };

  Chart.prototype.donut = function () { };
  Chart.prototype.donut.padAngle = function (padAngle) {
      if (padAngle === undefined) {
          return this.internal.config.donut_padAngle;
      }
      this.internal.config.donut_padAngle = padAngle;
      this.flush();
  };

  Chart.prototype.flow = function (args) {
      var $$ = this.internal, targets, data, notfoundIds = [], orgDataCount = $$.getMaxDataCount(), dataCount, domain, baseTarget, baseValue, length = 0, tail = 0, diff, to;
      if (args.json) {
          data = $$.convertJsonToData(args.json, args.keys);
      }
      else if (args.rows) {
          data = $$.convertRowsToData(args.rows);
      }
      else if (args.columns) {
          data = $$.convertColumnsToData(args.columns);
      }
      else {
          return;
      }
      targets = $$.convertDataToTargets(data, true);
      // Update/Add data
      $$.data.targets.forEach(function (t) {
          var found = false, i, j;
          for (i = 0; i < targets.length; i++) {
              if (t.id === targets[i].id) {
                  found = true;
                  if (t.values[t.values.length - 1]) {
                      tail = t.values[t.values.length - 1].index + 1;
                  }
                  length = targets[i].values.length;
                  for (j = 0; j < length; j++) {
                      targets[i].values[j].index = tail + j;
                      if (!$$.isTimeSeries()) {
                          targets[i].values[j].x = tail + j;
                      }
                  }
                  t.values = t.values.concat(targets[i].values);
                  targets.splice(i, 1);
                  break;
              }
          }
          if (!found) {
              notfoundIds.push(t.id);
          }
      });
      // Append null for not found targets
      $$.data.targets.forEach(function (t) {
          var i, j;
          for (i = 0; i < notfoundIds.length; i++) {
              if (t.id === notfoundIds[i]) {
                  tail = t.values[t.values.length - 1].index + 1;
                  for (j = 0; j < length; j++) {
                      t.values.push({
                          id: t.id,
                          index: tail + j,
                          x: $$.isTimeSeries() ? $$.getOtherTargetX(tail + j) : tail + j,
                          value: null
                      });
                  }
              }
          }
      });
      // Generate null values for new target
      if ($$.data.targets.length) {
          targets.forEach(function (t) {
              var i, missing = [];
              for (i = $$.data.targets[0].values[0].index; i < tail; i++) {
                  missing.push({
                      id: t.id,
                      index: i,
                      x: $$.isTimeSeries() ? $$.getOtherTargetX(i) : i,
                      value: null
                  });
              }
              t.values.forEach(function (v) {
                  v.index += tail;
                  if (!$$.isTimeSeries()) {
                      v.x += tail;
                  }
              });
              t.values = missing.concat(t.values);
          });
      }
      $$.data.targets = $$.data.targets.concat(targets); // add remained
      // check data count because behavior needs to change when it's only one
      dataCount = $$.getMaxDataCount();
      baseTarget = $$.data.targets[0];
      baseValue = baseTarget.values[0];
      // Update length to flow if needed
      if (isDefined(args.to)) {
          length = 0;
          to = $$.isTimeSeries() ? $$.parseDate(args.to) : args.to;
          baseTarget.values.forEach(function (v) {
              if (v.x < to) {
                  length++;
              }
          });
      }
      else if (isDefined(args.length)) {
          length = args.length;
      }
      // If only one data, update the domain to flow from left edge of the chart
      if (!orgDataCount) {
          if ($$.isTimeSeries()) {
              if (baseTarget.values.length > 1) {
                  diff = baseTarget.values[baseTarget.values.length - 1].x - baseValue.x;
              }
              else {
                  diff = baseValue.x - $$.getXDomain($$.data.targets)[0];
              }
          }
          else {
              diff = 1;
          }
          domain = [baseValue.x - diff, baseValue.x];
          $$.updateXDomain(null, true, true, false, domain);
      }
      else if (orgDataCount === 1) {
          if ($$.isTimeSeries()) {
              diff =
                  (baseTarget.values[baseTarget.values.length - 1].x - baseValue.x) / 2;
              domain = [new Date(+baseValue.x - diff), new Date(+baseValue.x + diff)];
              $$.updateXDomain(null, true, true, false, domain);
          }
      }
      // Set targets
      $$.updateTargets($$.data.targets);
      // Redraw with new targets
      $$.redraw({
          flow: {
              index: baseValue.index,
              length: length,
              duration: isValue(args.duration)
                  ? args.duration
                  : $$.config.transition_duration,
              done: args.done,
              orgDataCount: orgDataCount
          },
          withLegend: true,
          withTransition: orgDataCount > 1,
          withTrimXDomain: false,
          withUpdateXAxis: true
      });
  };
  ChartInternal.prototype.generateFlow = function (args) {
      var $$ = this, config = $$.config, d3 = $$.d3;
      return function () {
          var targets = args.targets, flow = args.flow, drawBar = args.drawBar, drawLine = args.drawLine, drawArea = args.drawArea, cx = args.cx, cy = args.cy, xv = args.xv, xForText = args.xForText, yForText = args.yForText, duration = args.duration;
          var translateX, scaleX = 1, transform, flowIndex = flow.index, flowLength = flow.length, flowStart = $$.getValueOnIndex($$.data.targets[0].values, flowIndex), flowEnd = $$.getValueOnIndex($$.data.targets[0].values, flowIndex + flowLength), orgDomain = $$.x.domain(), domain, durationForFlow = flow.duration || duration, done = flow.done || function () { }, wait = $$.generateWait();
          var xgrid, xgridLines, mainRegion, mainText, mainBar, mainLine, mainArea, mainCircle;
          // set flag
          $$.flowing = true;
          // remove head data after rendered
          $$.data.targets.forEach(function (d) {
              d.values.splice(0, flowLength);
          });
          // update x domain to generate axis elements for flow
          domain = $$.updateXDomain(targets, true, true);
          // update elements related to x scale
          if ($$.updateXGrid) {
              $$.updateXGrid(true);
          }
          xgrid = $$.xgrid || d3.selectAll([]); // xgrid needs to be obtained after updateXGrid
          xgridLines = $$.xgridLines || d3.selectAll([]);
          mainRegion = $$.mainRegion || d3.selectAll([]);
          mainText = $$.mainText || d3.selectAll([]);
          mainBar = $$.mainBar || d3.selectAll([]);
          mainLine = $$.mainLine || d3.selectAll([]);
          mainArea = $$.mainArea || d3.selectAll([]);
          mainCircle = $$.mainCircle || d3.selectAll([]);
          // generate transform to flow
          if (!flow.orgDataCount) {
              // if empty
              if ($$.data.targets[0].values.length !== 1) {
                  translateX = $$.x(orgDomain[0]) - $$.x(domain[0]);
              }
              else {
                  if ($$.isTimeSeries()) {
                      flowStart = $$.getValueOnIndex($$.data.targets[0].values, 0);
                      flowEnd = $$.getValueOnIndex($$.data.targets[0].values, $$.data.targets[0].values.length - 1);
                      translateX = $$.x(flowStart.x) - $$.x(flowEnd.x);
                  }
                  else {
                      translateX = diffDomain(domain) / 2;
                  }
              }
          }
          else if (flow.orgDataCount === 1 ||
              (flowStart && flowStart.x) === (flowEnd && flowEnd.x)) {
              translateX = $$.x(orgDomain[0]) - $$.x(domain[0]);
          }
          else {
              if ($$.isTimeSeries()) {
                  translateX = $$.x(orgDomain[0]) - $$.x(domain[0]);
              }
              else {
                  translateX = $$.x(flowStart.x) - $$.x(flowEnd.x);
              }
          }
          scaleX = diffDomain(orgDomain) / diffDomain(domain);
          transform = 'translate(' + translateX + ',0) scale(' + scaleX + ',1)';
          $$.hideXGridFocus();
          var flowTransition = d3
              .transition()
              .ease(d3.easeLinear)
              .duration(durationForFlow);
          wait.add($$.xAxis($$.axes.x, flowTransition));
          wait.add(mainBar.transition(flowTransition).attr('transform', transform));
          wait.add(mainLine.transition(flowTransition).attr('transform', transform));
          wait.add(mainArea.transition(flowTransition).attr('transform', transform));
          wait.add(mainCircle.transition(flowTransition).attr('transform', transform));
          wait.add(mainText.transition(flowTransition).attr('transform', transform));
          wait.add(mainRegion
              .filter($$.isRegionOnX)
              .transition(flowTransition)
              .attr('transform', transform));
          wait.add(xgrid.transition(flowTransition).attr('transform', transform));
          wait.add(xgridLines.transition(flowTransition).attr('transform', transform));
          wait(function () {
              var i, shapes = [], texts = [];
              // remove flowed elements
              if (flowLength) {
                  for (i = 0; i < flowLength; i++) {
                      shapes.push('.' + CLASS.shape + '-' + (flowIndex + i));
                      texts.push('.' + CLASS.text + '-' + (flowIndex + i));
                  }
                  $$.svg
                      .selectAll('.' + CLASS.shapes)
                      .selectAll(shapes)
                      .remove();
                  $$.svg
                      .selectAll('.' + CLASS.texts)
                      .selectAll(texts)
                      .remove();
                  $$.svg.select('.' + CLASS.xgrid).remove();
              }
              // draw again for removing flowed elements and reverting attr
              xgrid
                  .attr('transform', null)
                  .attr('x1', $$.xgridAttr.x1)
                  .attr('x2', $$.xgridAttr.x2)
                  .attr('y1', $$.xgridAttr.y1)
                  .attr('y2', $$.xgridAttr.y2)
                  .style('opacity', $$.xgridAttr.opacity);
              xgridLines.attr('transform', null);
              xgridLines
                  .select('line')
                  .attr('x1', config.axis_rotated ? 0 : xv)
                  .attr('x2', config.axis_rotated ? $$.width : xv);
              xgridLines
                  .select('text')
                  .attr('x', config.axis_rotated ? $$.width : 0)
                  .attr('y', xv);
              mainBar.attr('transform', null).attr('d', drawBar);
              mainLine.attr('transform', null).attr('d', drawLine);
              mainArea.attr('transform', null).attr('d', drawArea);
              mainCircle
                  .attr('transform', null)
                  .attr('cx', cx)
                  .attr('cy', cy);
              mainText
                  .attr('transform', null)
                  .attr('x', xForText)
                  .attr('y', yForText)
                  .style('fill-opacity', $$.opacityForText.bind($$));
              mainRegion.attr('transform', null);
              mainRegion
                  .filter($$.isRegionOnX)
                  .attr('x', $$.regionX.bind($$))
                  .attr('width', $$.regionWidth.bind($$));
              // callback for end of flow
              done();
              $$.flowing = false;
          });
      };
  };

  Chart.prototype.focus = function (targetIds) {
      var $$ = this.internal, candidates;
      targetIds = $$.mapToTargetIds(targetIds);
      (candidates = $$.svg.selectAll($$.selectorTargets(targetIds.filter($$.isTargetToShow, $$)))),
          this.revert();
      this.defocus();
      candidates.classed(CLASS.focused, true).classed(CLASS.defocused, false);
      if ($$.hasArcType()) {
          $$.expandArc(targetIds);
      }
      $$.toggleFocusLegend(targetIds, true);
      $$.focusedTargetIds = targetIds;
      $$.defocusedTargetIds = $$.defocusedTargetIds.filter(function (id) {
          return targetIds.indexOf(id) < 0;
      });
  };
  Chart.prototype.defocus = function (targetIds) {
      var $$ = this.internal, candidates;
      targetIds = $$.mapToTargetIds(targetIds);
      (candidates = $$.svg.selectAll($$.selectorTargets(targetIds.filter($$.isTargetToShow, $$)))),
          candidates.classed(CLASS.focused, false).classed(CLASS.defocused, true);
      if ($$.hasArcType()) {
          $$.unexpandArc(targetIds);
      }
      $$.toggleFocusLegend(targetIds, false);
      $$.focusedTargetIds = $$.focusedTargetIds.filter(function (id) {
          return targetIds.indexOf(id) < 0;
      });
      $$.defocusedTargetIds = targetIds;
  };
  Chart.prototype.revert = function (targetIds) {
      var $$ = this.internal, candidates;
      targetIds = $$.mapToTargetIds(targetIds);
      candidates = $$.svg.selectAll($$.selectorTargets(targetIds)); // should be for all targets
      candidates.classed(CLASS.focused, false).classed(CLASS.defocused, false);
      if ($$.hasArcType()) {
          $$.unexpandArc(targetIds);
      }
      if ($$.config.legend_show) {
          $$.showLegend(targetIds.filter($$.isLegendToShow.bind($$)));
          $$.legend
              .selectAll($$.selectorLegends(targetIds))
              .filter(function () {
              return $$.d3.select(this).classed(CLASS.legendItemFocused);
          })
              .classed(CLASS.legendItemFocused, false);
      }
      $$.focusedTargetIds = [];
      $$.defocusedTargetIds = [];
  };

  Chart.prototype.xgrids = function (grids) {
      var $$ = this.internal, config = $$.config;
      if (!grids) {
          return config.grid_x_lines;
      }
      config.grid_x_lines = grids;
      $$.redrawWithoutRescale();
      return config.grid_x_lines;
  };
  Chart.prototype.xgrids.add = function (grids) {
      var $$ = this.internal;
      return this.xgrids($$.config.grid_x_lines.concat(grids ? grids : []));
  };
  Chart.prototype.xgrids.remove = function (params) {
      // TODO: multiple
      var $$ = this.internal;
      $$.removeGridLines(params, true);
  };
  Chart.prototype.ygrids = function (grids) {
      var $$ = this.internal, config = $$.config;
      if (!grids) {
          return config.grid_y_lines;
      }
      config.grid_y_lines = grids;
      $$.redrawWithoutRescale();
      return config.grid_y_lines;
  };
  Chart.prototype.ygrids.add = function (grids) {
      var $$ = this.internal;
      return this.ygrids($$.config.grid_y_lines.concat(grids ? grids : []));
  };
  Chart.prototype.ygrids.remove = function (params) {
      // TODO: multiple
      var $$ = this.internal;
      $$.removeGridLines(params, false);
  };

  Chart.prototype.groups = function (groups) {
      var $$ = this.internal, config = $$.config;
      if (isUndefined(groups)) {
          return config.data_groups;
      }
      config.data_groups = groups;
      $$.redraw();
      return config.data_groups;
  };

  Chart.prototype.legend = function () { };
  Chart.prototype.legend.show = function (targetIds) {
      var $$ = this.internal;
      $$.showLegend($$.mapToTargetIds(targetIds));
      $$.updateAndRedraw({ withLegend: true });
  };
  Chart.prototype.legend.hide = function (targetIds) {
      var $$ = this.internal;
      $$.hideLegend($$.mapToTargetIds(targetIds));
      $$.updateAndRedraw({ withLegend: false });
  };

  Chart.prototype.load = function (args) {
      var $$ = this.internal, config = $$.config;
      // update xs if specified
      if (args.xs) {
          $$.addXs(args.xs);
      }
      // update names if exists
      if ('names' in args) {
          Chart.prototype.data.names.bind(this)(args.names);
      }
      // update classes if exists
      if ('classes' in args) {
          Object.keys(args.classes).forEach(function (id) {
              config.data_classes[id] = args.classes[id];
          });
      }
      // update categories if exists
      if ('categories' in args && $$.isCategorized()) {
          config.axis_x_categories = args.categories;
      }
      // update axes if exists
      if ('axes' in args) {
          Object.keys(args.axes).forEach(function (id) {
              config.data_axes[id] = args.axes[id];
          });
      }
      // update colors if exists
      if ('colors' in args) {
          Object.keys(args.colors).forEach(function (id) {
              config.data_colors[id] = args.colors[id];
          });
      }
      // use cache if exists
      if ('cacheIds' in args && $$.hasCaches(args.cacheIds)) {
          $$.load($$.getCaches(args.cacheIds), args.done);
          return;
      }
      // unload if needed
      if (args.unload) {
          // TODO: do not unload if target will load (included in url/rows/columns)
          $$.unload($$.mapToTargetIds(args.unload === true ? null : args.unload), function () {
              $$.loadFromArgs(args);
          });
      }
      else {
          $$.loadFromArgs(args);
      }
  };
  Chart.prototype.unload = function (args) {
      var $$ = this.internal;
      args = args || {};
      if (args instanceof Array) {
          args = { ids: args };
      }
      else if (typeof args === 'string') {
          args = { ids: [args] };
      }
      $$.unload($$.mapToTargetIds(args.ids), function () {
          $$.redraw({
              withUpdateOrgXDomain: true,
              withUpdateXDomain: true,
              withLegend: true
          });
          if (args.done) {
              args.done();
          }
      });
  };

  Chart.prototype.pie = function () { };
  Chart.prototype.pie.padAngle = function (padAngle) {
      if (padAngle === undefined) {
          return this.internal.config.pie_padAngle;
      }
      this.internal.config.pie_padAngle = padAngle;
      this.flush();
  };

  Chart.prototype.regions = function (regions) {
      var $$ = this.internal, config = $$.config;
      if (!regions) {
          return config.regions;
      }
      config.regions = regions;
      $$.redrawWithoutRescale();
      return config.regions;
  };
  Chart.prototype.regions.add = function (regions) {
      var $$ = this.internal, config = $$.config;
      if (!regions) {
          return config.regions;
      }
      config.regions = config.regions.concat(regions);
      $$.redrawWithoutRescale();
      return config.regions;
  };
  Chart.prototype.regions.remove = function (options) {
      var $$ = this.internal, config = $$.config, duration, classes, regions;
      options = options || {};
      duration = getOption(options, 'duration', config.transition_duration);
      classes = getOption(options, 'classes', [CLASS.region]);
      regions = $$.main.select('.' + CLASS.regions).selectAll(classes.map(function (c) {
          return '.' + c;
      }));
      (duration ? regions.transition().duration(duration) : regions)
          .style('opacity', 0)
          .remove();
      config.regions = config.regions.filter(function (region) {
          var found = false;
          if (!region['class']) {
              return true;
          }
          region['class'].split(' ').forEach(function (c) {
              if (classes.indexOf(c) >= 0) {
                  found = true;
              }
          });
          return !found;
      });
      return config.regions;
  };

  Chart.prototype.selected = function (targetId) {
      var $$ = this.internal, d3 = $$.d3;
      return $$.main
          .selectAll('.' + CLASS.shapes + $$.getTargetSelectorSuffix(targetId))
          .selectAll('.' + CLASS.shape)
          .filter(function () {
          return d3.select(this).classed(CLASS.SELECTED);
      })
          .nodes()
          .map(function (d) {
          var data = d.__data__;
          return data.data ? data.data : data;
      });
  };
  Chart.prototype.select = function (ids, indices, resetOther) {
      var $$ = this.internal, d3 = $$.d3, config = $$.config;
      if (!config.data_selection_enabled) {
          return;
      }
      $$.main
          .selectAll('.' + CLASS.shapes)
          .selectAll('.' + CLASS.shape)
          .each(function (d, i) {
          var shape = d3.select(this), id = d.data ? d.data.id : d.id, toggle = $$.getToggle(this, d).bind($$), isTargetId = config.data_selection_grouped || !ids || ids.indexOf(id) >= 0, isTargetIndex = !indices || indices.indexOf(i) >= 0, isSelected = shape.classed(CLASS.SELECTED);
          // line/area selection not supported yet
          if (shape.classed(CLASS.line) || shape.classed(CLASS.area)) {
              return;
          }
          if (isTargetId && isTargetIndex) {
              if (config.data_selection_isselectable(d) && !isSelected) {
                  toggle(true, shape.classed(CLASS.SELECTED, true), d, i);
              }
          }
          else if (isDefined(resetOther) && resetOther) {
              if (isSelected) {
                  toggle(false, shape.classed(CLASS.SELECTED, false), d, i);
              }
          }
      });
  };
  Chart.prototype.unselect = function (ids, indices) {
      var $$ = this.internal, d3 = $$.d3, config = $$.config;
      if (!config.data_selection_enabled) {
          return;
      }
      $$.main
          .selectAll('.' + CLASS.shapes)
          .selectAll('.' + CLASS.shape)
          .each(function (d, i) {
          var shape = d3.select(this), id = d.data ? d.data.id : d.id, toggle = $$.getToggle(this, d).bind($$), isTargetId = config.data_selection_grouped || !ids || ids.indexOf(id) >= 0, isTargetIndex = !indices || indices.indexOf(i) >= 0, isSelected = shape.classed(CLASS.SELECTED);
          // line/area selection not supported yet
          if (shape.classed(CLASS.line) || shape.classed(CLASS.area)) {
              return;
          }
          if (isTargetId && isTargetIndex) {
              if (config.data_selection_isselectable(d)) {
                  if (isSelected) {
                      toggle(false, shape.classed(CLASS.SELECTED, false), d, i);
                  }
              }
          }
      });
  };

  Chart.prototype.show = function (targetIds, options) {
      var $$ = this.internal, targets;
      targetIds = $$.mapToTargetIds(targetIds);
      options = options || {};
      $$.removeHiddenTargetIds(targetIds);
      targets = $$.svg.selectAll($$.selectorTargets(targetIds));
      targets
          .transition()
          .style('display', isIE() ? 'block' : 'initial', 'important')
          .style('opacity', 1, 'important')
          .call($$.endall, function () {
          targets.style('opacity', null).style('opacity', 1);
      });
      if (options.withLegend) {
          $$.showLegend(targetIds);
      }
      $$.redraw({
          withUpdateOrgXDomain: true,
          withUpdateXDomain: true,
          withLegend: true
      });
  };
  Chart.prototype.hide = function (targetIds, options) {
      var $$ = this.internal, targets;
      targetIds = $$.mapToTargetIds(targetIds);
      options = options || {};
      $$.addHiddenTargetIds(targetIds);
      targets = $$.svg.selectAll($$.selectorTargets(targetIds));
      targets
          .transition()
          .style('opacity', 0, 'important')
          .call($$.endall, function () {
          targets.style('opacity', null).style('opacity', 0);
          targets.style('display', 'none');
      });
      if (options.withLegend) {
          $$.hideLegend(targetIds);
      }
      $$.redraw({
          withUpdateOrgXDomain: true,
          withUpdateXDomain: true,
          withLegend: true
      });
  };
  Chart.prototype.toggle = function (targetIds, options) {
      var that = this, $$ = this.internal;
      $$.mapToTargetIds(targetIds).forEach(function (targetId) {
          $$.isTargetToShow(targetId)
              ? that.hide(targetId, options)
              : that.show(targetId, options);
      });
  };

  Chart.prototype.subchart = function () { };
  Chart.prototype.subchart.isShown = function () {
      var $$ = this.internal;
      return $$.config.subchart_show;
  };
  Chart.prototype.subchart.show = function () {
      var $$ = this.internal;
      if ($$.config.subchart_show) {
          return;
      }
      $$.config.subchart_show = true;
      // insert DOM
      $$.initSubchart();
      // update dimensions with sub chart now visible
      $$.updateDimension();
      // insert brush (depends on sizes previously updated)
      $$.initSubchartBrush();
      // attach data
      $$.updateTargetsForSubchart($$.getTargets());
      // reset fade-in state
      $$.mapToIds($$.data.targets).forEach(function (id) {
          $$.withoutFadeIn[id] = false;
      });
      // redraw chart !
      $$.updateAndRedraw();
      // update visible targets !
      $$.showTargets();
  };
  Chart.prototype.subchart.hide = function () {
      var $$ = this.internal;
      if (!$$.config.subchart_show) {
          return;
      }
      $$.config.subchart_show = false;
      // remove DOM
      $$.removeSubchart();
      // re-render chart
      $$.redraw();
  };

  Chart.prototype.tooltip = function () { };
  Chart.prototype.tooltip.show = function (args) {
      var $$ = this.internal, targets, data, mouse = {};
      // determine mouse position on the chart
      if (args.mouse) {
          mouse = args.mouse;
      }
      else {
          // determine focus data
          if (args.data) {
              data = args.data;
          }
          else if (typeof args.x !== 'undefined') {
              if (args.id) {
                  targets = $$.data.targets.filter(function (t) {
                      return t.id === args.id;
                  });
              }
              else {
                  targets = $$.data.targets;
              }
              data = $$.filterByX(targets, args.x).slice(0, 1)[0];
          }
          mouse = data ? $$.getMousePosition(data) : null;
      }
      // emulate mouse events to show
      $$.dispatchEvent('mousemove', mouse);
      $$.config.tooltip_onshow.call($$, data);
  };
  Chart.prototype.tooltip.hide = function () {
      // TODO: get target data by checking the state of focus
      this.internal.dispatchEvent('mouseout', 0);
      this.internal.config.tooltip_onhide.call(this);
  };

  Chart.prototype.transform = function (type, targetIds) {
      var $$ = this.internal, options = ['pie', 'donut'].indexOf(type) >= 0 ? { withTransform: true } : null;
      $$.transformTo(targetIds, type, options);
  };
  ChartInternal.prototype.transformTo = function (targetIds, type, optionsForRedraw) {
      var $$ = this, withTransitionForAxis = !$$.hasArcType(), options = optionsForRedraw || {
          withTransitionForAxis: withTransitionForAxis
      };
      options.withTransitionForTransform = false;
      $$.transiting = false;
      $$.setTargetType(targetIds, type);
      $$.updateTargets($$.data.targets); // this is needed when transforming to arc
      $$.updateAndRedraw(options);
  };

  Chart.prototype.x = function (x) {
      var $$ = this.internal;
      if (arguments.length) {
          $$.updateTargetX($$.data.targets, x);
          $$.redraw({ withUpdateOrgXDomain: true, withUpdateXDomain: true });
      }
      return $$.data.xs;
  };
  Chart.prototype.xs = function (xs) {
      var $$ = this.internal;
      if (arguments.length) {
          $$.updateTargetXs($$.data.targets, xs);
          $$.redraw({ withUpdateOrgXDomain: true, withUpdateXDomain: true });
      }
      return $$.data.xs;
  };

  Chart.prototype.zoom = function (domain) {
      var $$ = this.internal;
      if (domain) {
          if ($$.isTimeSeries()) {
              domain = domain.map(function (x) {
                  return $$.parseDate(x);
              });
          }
          if ($$.config.subchart_show) {
              $$.brush.selectionAsValue(domain, true);
          }
          else {
              $$.updateXDomain(null, true, false, false, domain);
              $$.redraw({ withY: $$.config.zoom_rescale, withSubchart: false });
          }
          $$.config.zoom_onzoom.call(this, $$.x.orgDomain());
          return domain;
      }
      else {
          return $$.x.domain();
      }
  };
  Chart.prototype.zoom.enable = function (enabled) {
      var $$ = this.internal;
      $$.config.zoom_enabled = enabled;
      $$.updateAndRedraw();
  };
  Chart.prototype.unzoom = function () {
      var $$ = this.internal;
      if ($$.config.subchart_show) {
          $$.brush.clear();
      }
      else {
          $$.updateXDomain(null, true, false, false, $$.subX.domain());
          $$.redraw({ withY: $$.config.zoom_rescale, withSubchart: false });
      }
  };
  Chart.prototype.zoom.max = function (max) {
      var $$ = this.internal, config = $$.config, d3 = $$.d3;
      if (max === 0 || max) {
          config.zoom_x_max = d3.max([$$.orgXDomain[1], max]);
      }
      else {
          return config.zoom_x_max;
      }
  };
  Chart.prototype.zoom.min = function (min) {
      var $$ = this.internal, config = $$.config, d3 = $$.d3;
      if (min === 0 || min) {
          config.zoom_x_min = d3.min([$$.orgXDomain[0], min]);
      }
      else {
          return config.zoom_x_min;
      }
  };
  Chart.prototype.zoom.range = function (range) {
      if (arguments.length) {
          if (isDefined(range.max)) {
              this.domain.max(range.max);
          }
          if (isDefined(range.min)) {
              this.domain.min(range.min);
          }
      }
      else {
          return {
              max: this.domain.max(),
              min: this.domain.min()
          };
      }
  };

  ChartInternal.prototype.initPie = function () {
      var $$ = this, d3 = $$.d3;
      $$.pie = d3
          .pie()
          .padAngle(this.getPadAngle.bind(this))
          .value(function (d) {
          return d.values.reduce(function (a, b) {
              return a + b.value;
          }, 0);
      });
      var orderFct = $$.getOrderFunction();
      // we need to reverse the returned order if asc or desc to have the slice in expected order.
      if (orderFct && ($$.isOrderAsc() || $$.isOrderDesc())) {
          var defaultSort_1 = orderFct;
          orderFct = function (t1, t2) { return defaultSort_1(t1, t2) * -1; };
      }
      $$.pie.sort(orderFct || null);
  };
  ChartInternal.prototype.updateRadius = function () {
      var $$ = this, config = $$.config, w = config.gauge_width || config.donut_width, gaugeArcWidth = $$.filterTargetsToShow($$.data.targets).length *
          $$.config.gauge_arcs_minWidth;
      $$.radiusExpanded =
          (Math.min($$.arcWidth, $$.arcHeight) / 2) * ($$.hasType('gauge') ? 0.85 : 1);
      $$.radius = $$.radiusExpanded * 0.95;
      $$.innerRadiusRatio = w ? ($$.radius - w) / $$.radius : 0.6;
      $$.innerRadius =
          $$.hasType('donut') || $$.hasType('gauge')
              ? $$.radius * $$.innerRadiusRatio
              : 0;
      $$.gaugeArcWidth = w
          ? w
          : gaugeArcWidth <= $$.radius - $$.innerRadius
              ? $$.radius - $$.innerRadius
              : gaugeArcWidth <= $$.radius
                  ? gaugeArcWidth
                  : $$.radius;
  };
  ChartInternal.prototype.getPadAngle = function () {
      if (this.hasType('pie')) {
          return this.config.pie_padAngle || 0;
      }
      else if (this.hasType('donut')) {
          return this.config.donut_padAngle || 0;
      }
      else {
          return 0;
      }
  };
  ChartInternal.prototype.updateArc = function () {
      var $$ = this;
      $$.svgArc = $$.getSvgArc();
      $$.svgArcExpanded = $$.getSvgArcExpanded();
      $$.svgArcExpandedSub = $$.getSvgArcExpanded(0.98);
  };
  ChartInternal.prototype.updateAngle = function (d) {
      var $$ = this, config = $$.config, found = false, index = 0, gMin, gMax, gTic, gValue;
      if (!config) {
          return null;
      }
      $$.pie($$.filterTargetsToShow($$.data.targets)).forEach(function (t) {
          if (!found && t.data.id === d.data.id) {
              found = true;
              d = t;
              d.index = index;
          }
          index++;
      });
      if (isNaN(d.startAngle)) {
          d.startAngle = 0;
      }
      if (isNaN(d.endAngle)) {
          d.endAngle = d.startAngle;
      }
      if ($$.isGaugeType(d.data)) {
          gMin = config.gauge_min;
          gMax = config.gauge_max;
          gTic = (Math.PI * (config.gauge_fullCircle ? 2 : 1)) / (gMax - gMin);
          gValue = d.value < gMin ? 0 : d.value < gMax ? d.value - gMin : gMax - gMin;
          d.startAngle = config.gauge_startingAngle;
          d.endAngle = d.startAngle + gTic * gValue;
      }
      return found ? d : null;
  };
  ChartInternal.prototype.getSvgArc = function () {
      var $$ = this, hasGaugeType = $$.hasType('gauge'), singleArcWidth = $$.gaugeArcWidth / $$.filterTargetsToShow($$.data.targets).length, arc = $$.d3
          .arc()
          .outerRadius(function (d) {
          return hasGaugeType ? $$.radius - singleArcWidth * d.index : $$.radius;
      })
          .innerRadius(function (d) {
          return hasGaugeType
              ? $$.radius - singleArcWidth * (d.index + 1)
              : $$.innerRadius;
      }), newArc = function (d, withoutUpdate) {
          var updated;
          if (withoutUpdate) {
              return arc(d);
          } // for interpolate
          updated = $$.updateAngle(d);
          return updated ? arc(updated) : 'M 0 0';
      };
      newArc.centroid = arc.centroid;
      return newArc;
  };
  ChartInternal.prototype.getSvgArcExpanded = function (rate) {
      rate = rate || 1;
      var $$ = this, hasGaugeType = $$.hasType('gauge'), singleArcWidth = $$.gaugeArcWidth / $$.filterTargetsToShow($$.data.targets).length, expandWidth = Math.min($$.radiusExpanded * rate - $$.radius, singleArcWidth * 0.8 - (1 - rate) * 100), arc = $$.d3
          .arc()
          .outerRadius(function (d) {
          return hasGaugeType
              ? $$.radius - singleArcWidth * d.index + expandWidth
              : $$.radiusExpanded * rate;
      })
          .innerRadius(function (d) {
          return hasGaugeType
              ? $$.radius - singleArcWidth * (d.index + 1)
              : $$.innerRadius;
      });
      return function (d) {
          var updated = $$.updateAngle(d);
          return updated ? arc(updated) : 'M 0 0';
      };
  };
  ChartInternal.prototype.getArc = function (d, withoutUpdate, force) {
      return force || this.isArcType(d.data)
          ? this.svgArc(d, withoutUpdate)
          : 'M 0 0';
  };
  ChartInternal.prototype.transformForArcLabel = function (d) {
      var $$ = this, config = $$.config, updated = $$.updateAngle(d), c, x, y, h, ratio, translate = '', hasGauge = $$.hasType('gauge');
      if (updated && !hasGauge) {
          c = this.svgArc.centroid(updated);
          x = isNaN(c[0]) ? 0 : c[0];
          y = isNaN(c[1]) ? 0 : c[1];
          h = Math.sqrt(x * x + y * y);
          if ($$.hasType('donut') && config.donut_label_ratio) {
              ratio = isFunction(config.donut_label_ratio)
                  ? config.donut_label_ratio(d, $$.radius, h)
                  : config.donut_label_ratio;
          }
          else if ($$.hasType('pie') && config.pie_label_ratio) {
              ratio = isFunction(config.pie_label_ratio)
                  ? config.pie_label_ratio(d, $$.radius, h)
                  : config.pie_label_ratio;
          }
          else {
              ratio =
                  $$.radius && h
                      ? ((36 / $$.radius > 0.375 ? 1.175 - 36 / $$.radius : 0.8) *
                          $$.radius) /
                          h
                      : 0;
          }
          translate = 'translate(' + x * ratio + ',' + y * ratio + ')';
      }
      else if (updated &&
          hasGauge &&
          $$.filterTargetsToShow($$.data.targets).length > 1) {
          var y1 = Math.sin(updated.endAngle - Math.PI / 2);
          x = Math.cos(updated.endAngle - Math.PI / 2) * ($$.radiusExpanded + 25);
          y = y1 * ($$.radiusExpanded + 15 - Math.abs(y1 * 10)) + 3;
          translate = 'translate(' + x + ',' + y + ')';
      }
      return translate;
  };
  /**
   * @deprecated Use `getRatio('arc', d)` instead.
   */
  ChartInternal.prototype.getArcRatio = function (d) {
      return this.getRatio('arc', d);
  };
  ChartInternal.prototype.convertToArcData = function (d) {
      return this.addName({
          id: d.data.id,
          value: d.value,
          ratio: this.getRatio('arc', d),
          index: d.index
      });
  };
  ChartInternal.prototype.textForArcLabel = function (d) {
      var $$ = this, updated, value, ratio, id, format;
      if (!$$.shouldShowArcLabel()) {
          return '';
      }
      updated = $$.updateAngle(d);
      value = updated ? updated.value : null;
      ratio = $$.getRatio('arc', updated);
      id = d.data.id;
      if (!$$.hasType('gauge') && !$$.meetsArcLabelThreshold(ratio)) {
          return '';
      }
      format = $$.getArcLabelFormat();
      return format
          ? format(value, ratio, id)
          : $$.defaultArcValueFormat(value, ratio);
  };
  ChartInternal.prototype.textForGaugeMinMax = function (value, isMax) {
      var $$ = this, format = $$.getGaugeLabelExtents();
      return format ? format(value, isMax) : value;
  };
  ChartInternal.prototype.expandArc = function (targetIds) {
      var $$ = this, interval;
      // MEMO: avoid to cancel transition
      if ($$.transiting) {
          interval = window.setInterval(function () {
              if (!$$.transiting) {
                  window.clearInterval(interval);
                  if ($$.legend.selectAll('.c3-legend-item-focused').size() > 0) {
                      $$.expandArc(targetIds);
                  }
              }
          }, 10);
          return;
      }
      targetIds = $$.mapToTargetIds(targetIds);
      $$.svg
          .selectAll($$.selectorTargets(targetIds, '.' + CLASS.chartArc))
          .each(function (d) {
          if (!$$.shouldExpand(d.data.id)) {
              return;
          }
          $$.d3
              .select(this)
              .selectAll('path')
              .transition()
              .duration($$.expandDuration(d.data.id))
              .attr('d', $$.svgArcExpanded)
              .transition()
              .duration($$.expandDuration(d.data.id) * 2)
              .attr('d', $$.svgArcExpandedSub)
              .each(function (d) {
              if ($$.isDonutType(d.data)) ;
          });
      });
  };
  ChartInternal.prototype.unexpandArc = function (targetIds) {
      var $$ = this;
      if ($$.transiting) {
          return;
      }
      targetIds = $$.mapToTargetIds(targetIds);
      $$.svg
          .selectAll($$.selectorTargets(targetIds, '.' + CLASS.chartArc))
          .selectAll('path')
          .transition()
          .duration(function (d) {
          return $$.expandDuration(d.data.id);
      })
          .attr('d', $$.svgArc);
      $$.svg.selectAll('.' + CLASS.arc);
  };
  ChartInternal.prototype.expandDuration = function (id) {
      var $$ = this, config = $$.config;
      if ($$.isDonutType(id)) {
          return config.donut_expand_duration;
      }
      else if ($$.isGaugeType(id)) {
          return config.gauge_expand_duration;
      }
      else if ($$.isPieType(id)) {
          return config.pie_expand_duration;
      }
      else {
          return 50;
      }
  };
  ChartInternal.prototype.shouldExpand = function (id) {
      var $$ = this, config = $$.config;
      return (($$.isDonutType(id) && config.donut_expand) ||
          ($$.isGaugeType(id) && config.gauge_expand) ||
          ($$.isPieType(id) && config.pie_expand));
  };
  ChartInternal.prototype.shouldShowArcLabel = function () {
      var $$ = this, config = $$.config, shouldShow = true;
      if ($$.hasType('donut')) {
          shouldShow = config.donut_label_show;
      }
      else if ($$.hasType('pie')) {
          shouldShow = config.pie_label_show;
      }
      // when gauge, always true
      return shouldShow;
  };
  ChartInternal.prototype.meetsArcLabelThreshold = function (ratio) {
      var $$ = this, config = $$.config, threshold = $$.hasType('donut')
          ? config.donut_label_threshold
          : config.pie_label_threshold;
      return ratio >= threshold;
  };
  ChartInternal.prototype.getArcLabelFormat = function () {
      var $$ = this, config = $$.config, format = config.pie_label_format;
      if ($$.hasType('gauge')) {
          format = config.gauge_label_format;
      }
      else if ($$.hasType('donut')) {
          format = config.donut_label_format;
      }
      return format;
  };
  ChartInternal.prototype.getGaugeLabelExtents = function () {
      var $$ = this, config = $$.config;
      return config.gauge_label_extents;
  };
  ChartInternal.prototype.getArcTitle = function () {
      var $$ = this;
      return $$.hasType('donut') ? $$.config.donut_title : '';
  };
  ChartInternal.prototype.updateTargetsForArc = function (targets) {
      var $$ = this, main = $$.main, mainPies, mainPieEnter, classChartArc = $$.classChartArc.bind($$), classArcs = $$.classArcs.bind($$), classFocus = $$.classFocus.bind($$);
      mainPies = main
          .select('.' + CLASS.chartArcs)
          .selectAll('.' + CLASS.chartArc)
          .data($$.pie(targets))
          .attr('class', function (d) {
          return classChartArc(d) + classFocus(d.data);
      });
      mainPieEnter = mainPies
          .enter()
          .append('g')
          .attr('class', classChartArc);
      mainPieEnter.append('g').attr('class', classArcs);
      mainPieEnter
          .append('text')
          .attr('dy', $$.hasType('gauge') ? '-.1em' : '.35em')
          .style('opacity', 0)
          .style('text-anchor', 'middle')
          .style('pointer-events', 'none');
      // MEMO: can not keep same color..., but not bad to update color in redraw
      //mainPieUpdate.exit().remove();
  };
  ChartInternal.prototype.initArc = function () {
      var $$ = this;
      $$.arcs = $$.main
          .select('.' + CLASS.chart)
          .append('g')
          .attr('class', CLASS.chartArcs)
          .attr('transform', $$.getTranslate('arc'));
      $$.arcs
          .append('text')
          .attr('class', CLASS.chartArcsTitle)
          .style('text-anchor', 'middle')
          .text($$.getArcTitle());
  };
  ChartInternal.prototype.redrawArc = function (duration, durationForExit, withTransform) {
      var $$ = this, d3 = $$.d3, config = $$.config, main = $$.main, arcs, mainArc, arcLabelLines, mainArcLabelLine, hasGaugeType = $$.hasType('gauge');
      arcs = main
          .selectAll('.' + CLASS.arcs)
          .selectAll('.' + CLASS.arc)
          .data($$.arcData.bind($$));
      mainArc = arcs
          .enter()
          .append('path')
          .attr('class', $$.classArc.bind($$))
          .style('fill', function (d) {
          return $$.color(d.data);
      })
          .style('cursor', function (d) {
          return config.interaction_enabled && config.data_selection_isselectable(d)
              ? 'pointer'
              : null;
      })
          .each(function (d) {
          if ($$.isGaugeType(d.data)) {
              d.startAngle = d.endAngle = config.gauge_startingAngle;
          }
          this._current = d;
      })
          .merge(arcs);
      if (hasGaugeType) {
          arcLabelLines = main
              .selectAll('.' + CLASS.arcs)
              .selectAll('.' + CLASS.arcLabelLine)
              .data($$.arcData.bind($$));
          mainArcLabelLine = arcLabelLines
              .enter()
              .append('rect')
              .attr('class', function (d) {
              return (CLASS.arcLabelLine +
                  ' ' +
                  CLASS.target +
                  ' ' +
                  CLASS.target +
                  '-' +
                  d.data.id);
          })
              .merge(arcLabelLines);
          if ($$.filterTargetsToShow($$.data.targets).length === 1) {
              mainArcLabelLine.style('display', 'none');
          }
          else {
              mainArcLabelLine
                  .style('fill', function (d) {
                  return $$.levelColor
                      ? $$.levelColor(d.data.values.reduce(function (total, item) {
                          return total + item.value;
                      }, 0))
                      : $$.color(d.data);
              })
                  .style('display', config.gauge_labelLine_show ? '' : 'none')
                  .each(function (d) {
                  var lineLength = 0, lineThickness = 2, x = 0, y = 0, transform = '';
                  if ($$.hiddenTargetIds.indexOf(d.data.id) < 0) {
                      var updated = $$.updateAngle(d), innerLineLength = ($$.gaugeArcWidth /
                          $$.filterTargetsToShow($$.data.targets).length) *
                          (updated.index + 1), lineAngle = updated.endAngle - Math.PI / 2, arcInnerRadius = $$.radius - innerLineLength, linePositioningAngle = lineAngle - (arcInnerRadius === 0 ? 0 : 1 / arcInnerRadius);
                      lineLength = $$.radiusExpanded - $$.radius + innerLineLength;
                      x = Math.cos(linePositioningAngle) * arcInnerRadius;
                      y = Math.sin(linePositioningAngle) * arcInnerRadius;
                      transform =
                          'rotate(' +
                              (lineAngle * 180) / Math.PI +
                              ', ' +
                              x +
                              ', ' +
                              y +
                              ')';
                  }
                  d3.select(this)
                      .attr('x', x)
                      .attr('y', y)
                      .attr('width', lineLength)
                      .attr('height', lineThickness)
                      .attr('transform', transform)
                      .style('stroke-dasharray', '0, ' + (lineLength + lineThickness) + ', 0');
              });
          }
      }
      mainArc
          .attr('transform', function (d) {
          return !$$.isGaugeType(d.data) && withTransform ? 'scale(0)' : '';
      })
          .on('mouseover', config.interaction_enabled
          ? function (d) {
              var updated, arcData;
              if ($$.transiting) {
                  // skip while transiting
                  return;
              }
              updated = $$.updateAngle(d);
              if (updated) {
                  arcData = $$.convertToArcData(updated);
                  // transitions
                  $$.expandArc(updated.data.id);
                  $$.api.focus(updated.data.id);
                  $$.toggleFocusLegend(updated.data.id, true);
                  $$.config.data_onmouseover(arcData, this);
              }
          }
          : null)
          .on('mousemove', config.interaction_enabled
          ? function (d) {
              var updated = $$.updateAngle(d), arcData, selectedData;
              if (updated) {
                  (arcData = $$.convertToArcData(updated)),
                      (selectedData = [arcData]);
                  $$.showTooltip(selectedData, this);
              }
          }
          : null)
          .on('mouseout', config.interaction_enabled
          ? function (d) {
              var updated, arcData;
              if ($$.transiting) {
                  // skip while transiting
                  return;
              }
              updated = $$.updateAngle(d);
              if (updated) {
                  arcData = $$.convertToArcData(updated);
                  // transitions
                  $$.unexpandArc(updated.data.id);
                  $$.api.revert();
                  $$.revertLegend();
                  $$.hideTooltip();
                  $$.config.data_onmouseout(arcData, this);
              }
          }
          : null)
          .on('click', config.interaction_enabled
          ? function (d, i) {
              var updated = $$.updateAngle(d), arcData;
              if (updated) {
                  arcData = $$.convertToArcData(updated);
                  if ($$.toggleShape) {
                      $$.toggleShape(this, arcData, i);
                  }
                  $$.config.data_onclick.call($$.api, arcData, this);
              }
          }
          : null)
          .each(function () {
          $$.transiting = true;
      })
          .transition()
          .duration(duration)
          .attrTween('d', function (d) {
          var updated = $$.updateAngle(d), interpolate;
          if (!updated) {
              return function () {
                  return 'M 0 0';
              };
          }
          //                if (this._current === d) {
          //                    this._current = {
          //                        startAngle: Math.PI*2,
          //                        endAngle: Math.PI*2,
          //                    };
          //                }
          if (isNaN(this._current.startAngle)) {
              this._current.startAngle = 0;
          }
          if (isNaN(this._current.endAngle)) {
              this._current.endAngle = this._current.startAngle;
          }
          interpolate = d3.interpolate(this._current, updated);
          this._current = interpolate(0);
          return function (t) {
              // prevents crashing the charts once in transition and chart.destroy() has been called
              if ($$.config === null) {
                  return 'M 0 0';
              }
              var interpolated = interpolate(t);
              interpolated.data = d.data; // data.id will be updated by interporator
              return $$.getArc(interpolated, true);
          };
      })
          .attr('transform', withTransform ? 'scale(1)' : '')
          .style('fill', function (d) {
          return $$.levelColor
              ? $$.levelColor(d.data.values.reduce(function (total, item) {
                  return total + item.value;
              }, 0))
              : $$.color(d.data.id);
      }) // Where gauge reading color would receive customization.
          .call($$.endall, function () {
          $$.transiting = false;
      });
      arcs
          .exit()
          .transition()
          .duration(durationForExit)
          .style('opacity', 0)
          .remove();
      main
          .selectAll('.' + CLASS.chartArc)
          .select('text')
          .style('opacity', 0)
          .attr('class', function (d) {
          return $$.isGaugeType(d.data) ? CLASS.gaugeValue : '';
      })
          .text($$.textForArcLabel.bind($$))
          .attr('transform', $$.transformForArcLabel.bind($$))
          .style('font-size', function (d) {
          return $$.isGaugeType(d.data) &&
              $$.filterTargetsToShow($$.data.targets).length === 1
              ? Math.round($$.radius / 5) + 'px'
              : '';
      })
          .transition()
          .duration(duration)
          .style('opacity', function (d) {
          return $$.isTargetToShow(d.data.id) && $$.isArcType(d.data) ? 1 : 0;
      });
      main
          .select('.' + CLASS.chartArcsTitle)
          .style('opacity', $$.hasType('donut') || hasGaugeType ? 1 : 0);
      if (hasGaugeType) {
          var index_1 = 0;
          var backgroundArc = $$.arcs
              .select('g.' + CLASS.chartArcsBackground)
              .selectAll('path.' + CLASS.chartArcsBackground)
              .data($$.data.targets);
          backgroundArc
              .enter()
              .append('path')
              .attr('class', function (d, i) {
              return CLASS.chartArcsBackground + ' ' + CLASS.chartArcsBackground + '-' + i;
          })
              .merge(backgroundArc)
              .attr('d', function (d1) {
              if ($$.hiddenTargetIds.indexOf(d1.id) >= 0) {
                  return 'M 0 0';
              }
              var d = {
                  data: [{ value: config.gauge_max }],
                  startAngle: config.gauge_startingAngle,
                  endAngle: -1 *
                      config.gauge_startingAngle *
                      (config.gauge_fullCircle ? Math.PI : 1),
                  index: index_1++
              };
              return $$.getArc(d, true, true);
          });
          backgroundArc.exit().remove();
          $$.arcs
              .select('.' + CLASS.chartArcsGaugeUnit)
              .attr('dy', '.75em')
              .text(config.gauge_label_show ? config.gauge_units : '');
          $$.arcs
              .select('.' + CLASS.chartArcsGaugeMin)
              .attr('dx', -1 *
              ($$.innerRadius +
                  ($$.radius - $$.innerRadius) / (config.gauge_fullCircle ? 1 : 2)) +
              'px')
              .attr('dy', '1.2em')
              .text(config.gauge_label_show
              ? $$.textForGaugeMinMax(config.gauge_min, false)
              : '');
          $$.arcs
              .select('.' + CLASS.chartArcsGaugeMax)
              .attr('dx', $$.innerRadius +
              ($$.radius - $$.innerRadius) / (config.gauge_fullCircle ? 1 : 2) +
              'px')
              .attr('dy', '1.2em')
              .text(config.gauge_label_show
              ? $$.textForGaugeMinMax(config.gauge_max, true)
              : '');
      }
  };
  ChartInternal.prototype.initGauge = function () {
      var arcs = this.arcs;
      if (this.hasType('gauge')) {
          arcs.append('g').attr('class', CLASS.chartArcsBackground);
          arcs
              .append('text')
              .attr('class', CLASS.chartArcsGaugeUnit)
              .style('text-anchor', 'middle')
              .style('pointer-events', 'none');
          arcs
              .append('text')
              .attr('class', CLASS.chartArcsGaugeMin)
              .style('text-anchor', 'middle')
              .style('pointer-events', 'none');
          arcs
              .append('text')
              .attr('class', CLASS.chartArcsGaugeMax)
              .style('text-anchor', 'middle')
              .style('pointer-events', 'none');
      }
  };
  ChartInternal.prototype.getGaugeLabelHeight = function () {
      return this.config.gauge_label_show ? 20 : 0;
  };

  /**
   * Store value into cache
   *
   * @param key
   * @param value
   */
  ChartInternal.prototype.addToCache = function (key, value) {
      this.cache["$" + key] = value;
  };
  /**
   * Returns a cached value or undefined
   *
   * @param key
   * @return {*}
   */
  ChartInternal.prototype.getFromCache = function (key) {
      return this.cache["$" + key];
  };
  /**
   * Reset cached data
   */
  ChartInternal.prototype.resetCache = function () {
      var _this = this;
      Object.keys(this.cache)
          .filter(function (key) { return /^\$/.test(key); })
          .forEach(function (key) {
          delete _this.cache[key];
      });
  };
  // Old API that stores Targets
  ChartInternal.prototype.hasCaches = function (ids) {
      for (var i = 0; i < ids.length; i++) {
          if (!(ids[i] in this.cache)) {
              return false;
          }
      }
      return true;
  };
  ChartInternal.prototype.addCache = function (id, target) {
      this.cache[id] = this.cloneTarget(target);
  };
  ChartInternal.prototype.getCaches = function (ids) {
      var targets = [], i;
      for (i = 0; i < ids.length; i++) {
          if (ids[i] in this.cache) {
              targets.push(this.cloneTarget(this.cache[ids[i]]));
          }
      }
      return targets;
  };

  ChartInternal.prototype.categoryName = function (i) {
      var config = this.config;
      return i < config.axis_x_categories.length ? config.axis_x_categories[i] : i;
  };

  ChartInternal.prototype.generateTargetClass = function (targetId) {
      return targetId || targetId === 0 ? ('-' + targetId).replace(/\s/g, '-') : '';
  };
  ChartInternal.prototype.generateClass = function (prefix, targetId) {
      return ' ' + prefix + ' ' + prefix + this.generateTargetClass(targetId);
  };
  ChartInternal.prototype.classText = function (d) {
      return this.generateClass(CLASS.text, d.index);
  };
  ChartInternal.prototype.classTexts = function (d) {
      return this.generateClass(CLASS.texts, d.id);
  };
  ChartInternal.prototype.classShape = function (d) {
      return this.generateClass(CLASS.shape, d.index);
  };
  ChartInternal.prototype.classShapes = function (d) {
      return this.generateClass(CLASS.shapes, d.id);
  };
  ChartInternal.prototype.classLine = function (d) {
      return this.classShape(d) + this.generateClass(CLASS.line, d.id);
  };
  ChartInternal.prototype.classLines = function (d) {
      return this.classShapes(d) + this.generateClass(CLASS.lines, d.id);
  };
  ChartInternal.prototype.classCircle = function (d) {
      return this.classShape(d) + this.generateClass(CLASS.circle, d.index);
  };
  ChartInternal.prototype.classCircles = function (d) {
      return this.classShapes(d) + this.generateClass(CLASS.circles, d.id);
  };
  ChartInternal.prototype.classBar = function (d) {
      return this.classShape(d) + this.generateClass(CLASS.bar, d.index);
  };
  ChartInternal.prototype.classBars = function (d) {
      return this.classShapes(d) + this.generateClass(CLASS.bars, d.id);
  };
  ChartInternal.prototype.classArc = function (d) {
      return this.classShape(d.data) + this.generateClass(CLASS.arc, d.data.id);
  };
  ChartInternal.prototype.classArcs = function (d) {
      return this.classShapes(d.data) + this.generateClass(CLASS.arcs, d.data.id);
  };
  ChartInternal.prototype.classArea = function (d) {
      return this.classShape(d) + this.generateClass(CLASS.area, d.id);
  };
  ChartInternal.prototype.classAreas = function (d) {
      return this.classShapes(d) + this.generateClass(CLASS.areas, d.id);
  };
  ChartInternal.prototype.classRegion = function (d, i) {
      return (this.generateClass(CLASS.region, i) + ' ' + ('class' in d ? d['class'] : ''));
  };
  ChartInternal.prototype.classEvent = function (d) {
      return this.generateClass(CLASS.eventRect, d.index);
  };
  ChartInternal.prototype.classTarget = function (id) {
      var $$ = this;
      var additionalClassSuffix = $$.config.data_classes[id], additionalClass = '';
      if (additionalClassSuffix) {
          additionalClass = ' ' + CLASS.target + '-' + additionalClassSuffix;
      }
      return $$.generateClass(CLASS.target, id) + additionalClass;
  };
  ChartInternal.prototype.classFocus = function (d) {
      return this.classFocused(d) + this.classDefocused(d);
  };
  ChartInternal.prototype.classFocused = function (d) {
      return ' ' + (this.focusedTargetIds.indexOf(d.id) >= 0 ? CLASS.focused : '');
  };
  ChartInternal.prototype.classDefocused = function (d) {
      return (' ' + (this.defocusedTargetIds.indexOf(d.id) >= 0 ? CLASS.defocused : ''));
  };
  ChartInternal.prototype.classChartText = function (d) {
      return CLASS.chartText + this.classTarget(d.id);
  };
  ChartInternal.prototype.classChartLine = function (d) {
      return CLASS.chartLine + this.classTarget(d.id);
  };
  ChartInternal.prototype.classChartBar = function (d) {
      return CLASS.chartBar + this.classTarget(d.id);
  };
  ChartInternal.prototype.classChartArc = function (d) {
      return CLASS.chartArc + this.classTarget(d.data.id);
  };
  ChartInternal.prototype.getTargetSelectorSuffix = function (targetId) {
      var targetClass = this.generateTargetClass(targetId);
      if (window.CSS && window.CSS.escape) {
          return window.CSS.escape(targetClass);
      }
      // fallback on imperfect method for old browsers (does not handles unicode)
      return targetClass.replace(/([?!@#$%^&*()=+,.<>'":;\[\]\/|~`{}\\])/g, '\\$1');
  };
  ChartInternal.prototype.selectorTarget = function (id, prefix) {
      return (prefix || '') + '.' + CLASS.target + this.getTargetSelectorSuffix(id);
  };
  ChartInternal.prototype.selectorTargets = function (ids, prefix) {
      var $$ = this;
      ids = ids || [];
      return ids.length
          ? ids.map(function (id) {
              return $$.selectorTarget(id, prefix);
          })
          : null;
  };
  ChartInternal.prototype.selectorLegend = function (id) {
      return '.' + CLASS.legendItem + this.getTargetSelectorSuffix(id);
  };
  ChartInternal.prototype.selectorLegends = function (ids) {
      var $$ = this;
      return ids && ids.length
          ? ids.map(function (id) {
              return $$.selectorLegend(id);
          })
          : null;
  };

  ChartInternal.prototype.getClipPath = function (id) {
      return 'url(' + (isIE(9) ? '' : document.URL.split('#')[0]) + '#' + id + ')';
  };
  ChartInternal.prototype.appendClip = function (parent, id) {
      return parent
          .append('clipPath')
          .attr('id', id)
          .append('rect');
  };
  ChartInternal.prototype.getAxisClipX = function (forHorizontal) {
      // axis line width + padding for left
      var left = Math.max(30, this.margin.left);
      return forHorizontal ? -(1 + left) : -(left - 1);
  };
  ChartInternal.prototype.getAxisClipY = function (forHorizontal) {
      return forHorizontal ? -20 : -this.margin.top;
  };
  ChartInternal.prototype.getXAxisClipX = function () {
      var $$ = this;
      return $$.getAxisClipX(!$$.config.axis_rotated);
  };
  ChartInternal.prototype.getXAxisClipY = function () {
      var $$ = this;
      return $$.getAxisClipY(!$$.config.axis_rotated);
  };
  ChartInternal.prototype.getYAxisClipX = function () {
      var $$ = this;
      return $$.config.axis_y_inner ? -1 : $$.getAxisClipX($$.config.axis_rotated);
  };
  ChartInternal.prototype.getYAxisClipY = function () {
      var $$ = this;
      return $$.getAxisClipY($$.config.axis_rotated);
  };
  ChartInternal.prototype.getAxisClipWidth = function (forHorizontal) {
      var $$ = this, left = Math.max(30, $$.margin.left), right = Math.max(30, $$.margin.right);
      // width + axis line width + padding for left/right
      return forHorizontal ? $$.width + 2 + left + right : $$.margin.left + 20;
  };
  ChartInternal.prototype.getAxisClipHeight = function (forHorizontal) {
      // less than 20 is not enough to show the axis label 'outer' without legend
      return ((forHorizontal ? this.margin.bottom : this.margin.top + this.height) + 20);
  };
  ChartInternal.prototype.getXAxisClipWidth = function () {
      var $$ = this;
      return $$.getAxisClipWidth(!$$.config.axis_rotated);
  };
  ChartInternal.prototype.getXAxisClipHeight = function () {
      var $$ = this;
      return $$.getAxisClipHeight(!$$.config.axis_rotated);
  };
  ChartInternal.prototype.getYAxisClipWidth = function () {
      var $$ = this;
      return ($$.getAxisClipWidth($$.config.axis_rotated) +
          ($$.config.axis_y_inner ? 20 : 0));
  };
  ChartInternal.prototype.getYAxisClipHeight = function () {
      var $$ = this;
      return $$.getAxisClipHeight($$.config.axis_rotated);
  };

  ChartInternal.prototype.generateColor = function () {
      var $$ = this, config = $$.config, d3 = $$.d3, colors = config.data_colors, pattern = notEmpty(config.color_pattern)
          ? config.color_pattern
          : d3.schemeCategory10, callback = config.data_color, ids = [];
      return function (d) {
          var id = d.id || (d.data && d.data.id) || d, color;
          // if callback function is provided
          if (colors[id] instanceof Function) {
              color = colors[id](d);
          }
          // if specified, choose that color
          else if (colors[id]) {
              color = colors[id];
          }
          // if not specified, choose from pattern
          else {
              if (ids.indexOf(id) < 0) {
                  ids.push(id);
              }
              color = pattern[ids.indexOf(id) % pattern.length];
              colors[id] = color;
          }
          return callback instanceof Function ? callback(color, d) : color;
      };
  };
  ChartInternal.prototype.generateLevelColor = function () {
      var $$ = this, config = $$.config, colors = config.color_pattern, threshold = config.color_threshold, asValue = threshold.unit === 'value', values = threshold.values && threshold.values.length ? threshold.values : [], max = threshold.max || 100;
      return notEmpty(threshold) && notEmpty(colors)
          ? function (value) {
              var i, v, color = colors[colors.length - 1];
              for (i = 0; i < values.length; i++) {
                  v = asValue ? value : (value * 100) / max;
                  if (v < values[i]) {
                      color = colors[i];
                      break;
                  }
              }
              return color;
          }
          : null;
  };

  ChartInternal.prototype.getDefaultConfig = function () {
      var config = {
          bindto: '#chart',
          svg_classname: undefined,
          size_width: undefined,
          size_height: undefined,
          padding_left: undefined,
          padding_right: undefined,
          padding_top: undefined,
          padding_bottom: undefined,
          resize_auto: true,
          zoom_enabled: false,
          zoom_initialRange: undefined,
          zoom_type: 'scroll',
          zoom_disableDefaultBehavior: false,
          zoom_privileged: false,
          zoom_rescale: false,
          zoom_onzoom: function () { },
          zoom_onzoomstart: function () { },
          zoom_onzoomend: function () { },
          zoom_x_min: undefined,
          zoom_x_max: undefined,
          interaction_brighten: true,
          interaction_enabled: true,
          onmouseover: function () { },
          onmouseout: function () { },
          onresize: function () { },
          onresized: function () { },
          oninit: function () { },
          onrendered: function () { },
          transition_duration: 350,
          data_epochs: 'epochs',
          data_x: undefined,
          data_xs: {},
          data_xFormat: '%Y-%m-%d',
          data_xLocaltime: true,
          data_xSort: true,
          data_idConverter: function (id) {
              return id;
          },
          data_names: {},
          data_classes: {},
          data_groups: [],
          data_axes: {},
          data_type: undefined,
          data_types: {},
          data_labels: {},
          data_order: 'desc',
          data_regions: {},
          data_color: undefined,
          data_colors: {},
          data_hide: false,
          data_filter: undefined,
          data_selection_enabled: false,
          data_selection_grouped: false,
          data_selection_isselectable: function () {
              return true;
          },
          data_selection_multiple: true,
          data_selection_draggable: false,
          data_stack_normalize: false,
          data_onclick: function () { },
          data_onmouseover: function () { },
          data_onmouseout: function () { },
          data_onselected: function () { },
          data_onunselected: function () { },
          data_url: undefined,
          data_headers: undefined,
          data_json: undefined,
          data_rows: undefined,
          data_columns: undefined,
          data_mimeType: undefined,
          data_keys: undefined,
          // configuration for no plot-able data supplied.
          data_empty_label_text: '',
          // subchart
          subchart_show: false,
          subchart_size_height: 60,
          subchart_axis_x_show: true,
          subchart_onbrush: function () { },
          // color
          color_pattern: [],
          color_threshold: {},
          // legend
          legend_show: true,
          legend_hide: false,
          legend_position: 'bottom',
          legend_inset_anchor: 'top-left',
          legend_inset_x: 10,
          legend_inset_y: 0,
          legend_inset_step: undefined,
          legend_item_onclick: undefined,
          legend_item_onmouseover: undefined,
          legend_item_onmouseout: undefined,
          legend_equally: false,
          legend_padding: 0,
          legend_item_tile_width: 10,
          legend_item_tile_height: 10,
          // axis
          axis_rotated: false,
          axis_x_show: true,
          axis_x_type: 'indexed',
          axis_x_localtime: true,
          axis_x_categories: [],
          axis_x_tick_centered: false,
          axis_x_tick_format: undefined,
          axis_x_tick_culling: {},
          axis_x_tick_culling_max: 10,
          axis_x_tick_count: undefined,
          axis_x_tick_fit: true,
          axis_x_tick_values: null,
          axis_x_tick_rotate: 0,
          axis_x_tick_outer: true,
          axis_x_tick_multiline: true,
          axis_x_tick_multilineMax: 0,
          axis_x_tick_width: null,
          axis_x_max: undefined,
          axis_x_min: undefined,
          axis_x_padding: {},
          axis_x_height: undefined,
          axis_x_selection: undefined,
          axis_x_label: {},
          axis_x_inner: undefined,
          axis_y_show: true,
          axis_y_type: 'linear',
          axis_y_max: undefined,
          axis_y_min: undefined,
          axis_y_inverted: false,
          axis_y_center: undefined,
          axis_y_inner: undefined,
          axis_y_label: {},
          axis_y_tick_format: undefined,
          axis_y_tick_outer: true,
          axis_y_tick_values: null,
          axis_y_tick_rotate: 0,
          axis_y_tick_count: undefined,
          axis_y_tick_time_type: undefined,
          axis_y_tick_time_interval: undefined,
          axis_y_padding: {},
          axis_y_default: undefined,
          axis_y2_show: false,
          axis_y2_type: 'linear',
          axis_y2_max: undefined,
          axis_y2_min: undefined,
          axis_y2_inverted: false,
          axis_y2_center: undefined,
          axis_y2_inner: undefined,
          axis_y2_label: {},
          axis_y2_tick_format: undefined,
          axis_y2_tick_outer: true,
          axis_y2_tick_values: null,
          axis_y2_tick_count: undefined,
          axis_y2_padding: {},
          axis_y2_default: undefined,
          // grid
          grid_x_show: false,
          grid_x_type: 'tick',
          grid_x_lines: [],
          grid_y_show: false,
          // not used
          // grid_y_type: 'tick',
          grid_y_lines: [],
          grid_y_ticks: 10,
          grid_focus_show: true,
          grid_lines_front: true,
          // point - point of each data
          point_show: true,
          point_r: 2.5,
          point_sensitivity: 10,
          point_focus_expand_enabled: true,
          point_focus_expand_r: undefined,
          point_select_r: undefined,
          // line
          line_connectNull: false,
          line_step_type: 'step',
          // bar
          bar_width: undefined,
          bar_width_ratio: 0.6,
          bar_width_max: undefined,
          bar_zerobased: true,
          bar_space: 0,
          // area
          area_zerobased: true,
          area_above: false,
          // pie
          pie_label_show: true,
          pie_label_format: undefined,
          pie_label_threshold: 0.05,
          pie_label_ratio: undefined,
          pie_expand: {},
          pie_expand_duration: 50,
          pie_padAngle: 0,
          // gauge
          gauge_fullCircle: false,
          gauge_label_show: true,
          gauge_labelLine_show: true,
          gauge_label_format: undefined,
          gauge_min: 0,
          gauge_max: 100,
          gauge_startingAngle: (-1 * Math.PI) / 2,
          gauge_label_extents: undefined,
          gauge_units: undefined,
          gauge_width: undefined,
          gauge_arcs_minWidth: 5,
          gauge_expand: {},
          gauge_expand_duration: 50,
          // donut
          donut_label_show: true,
          donut_label_format: undefined,
          donut_label_threshold: 0.05,
          donut_label_ratio: undefined,
          donut_width: undefined,
          donut_title: '',
          donut_expand: {},
          donut_expand_duration: 50,
          donut_padAngle: 0,
          // spline
          spline_interpolation_type: 'cardinal',
          // stanford
          stanford_lines: [],
          stanford_regions: [],
          stanford_texts: [],
          stanford_scaleMin: undefined,
          stanford_scaleMax: undefined,
          stanford_scaleWidth: undefined,
          stanford_scaleFormat: undefined,
          stanford_scaleValues: undefined,
          stanford_colors: undefined,
          stanford_padding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
          },
          // region - region to change style
          regions: [],
          // tooltip - show when mouseover on each data
          tooltip_show: true,
          tooltip_grouped: true,
          tooltip_order: undefined,
          tooltip_format_title: undefined,
          tooltip_format_name: undefined,
          tooltip_format_value: undefined,
          tooltip_horizontal: undefined,
          tooltip_position: undefined,
          tooltip_contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
              return this.getTooltipContent
                  ? this.getTooltipContent(d, defaultTitleFormat, defaultValueFormat, color)
                  : '';
          },
          tooltip_init_show: false,
          tooltip_init_x: 0,
          tooltip_init_position: { top: '0px', left: '50px' },
          tooltip_onshow: function () { },
          tooltip_onhide: function () { },
          // title
          title_text: undefined,
          title_padding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
          },
          title_position: 'top-center'
      };
      Object.keys(this.additionalConfig).forEach(function (key) {
          config[key] = this.additionalConfig[key];
      }, this);
      return config;
  };
  ChartInternal.prototype.additionalConfig = {};
  ChartInternal.prototype.loadConfig = function (config) {
      var this_config = this.config, target, keys, read;
      function find() {
          var key = keys.shift();
          //        console.log("key =>", key, ", target =>", target);
          if (key && target && typeof target === 'object' && key in target) {
              target = target[key];
              return find();
          }
          else if (!key) {
              return target;
          }
          else {
              return undefined;
          }
      }
      Object.keys(this_config).forEach(function (key) {
          target = config;
          keys = key.split('_');
          read = find();
          //        console.log("CONFIG : ", key, read);
          if (isDefined(read)) {
              this_config[key] = read;
          }
      });
  };

  ChartInternal.prototype.convertUrlToData = function (url, mimeType, headers, keys, done) {
      var $$ = this, type = mimeType ? mimeType : 'csv', f, converter;
      if (type === 'json') {
          f = $$.d3.json;
          converter = $$.convertJsonToData;
      }
      else if (type === 'tsv') {
          f = $$.d3.tsv;
          converter = $$.convertXsvToData;
      }
      else {
          f = $$.d3.csv;
          converter = $$.convertXsvToData;
      }
      f(url, headers)
          .then(function (data) {
          done.call($$, converter.call($$, data, keys));
      })
          .catch(function (error) {
          throw error;
      });
  };
  ChartInternal.prototype.convertXsvToData = function (xsv) {
      var keys = xsv.columns, rows = xsv;
      if (rows.length === 0) {
          return {
              keys: keys,
              rows: [keys.reduce(function (row, key) {
                      var _a;
                      return Object.assign(row, (_a = {}, _a[key] = null, _a));
                  }, {})]
          };
      }
      else {
          // [].concat() is to convert result into a plain array otherwise
          // test is not happy because rows have properties.
          return { keys: keys, rows: [].concat(xsv) };
      }
  };
  ChartInternal.prototype.convertJsonToData = function (json, keys) {
      var $$ = this, new_rows = [], targetKeys, data;
      if (keys) {
          // when keys specified, json would be an array that includes objects
          if (keys.x) {
              targetKeys = keys.value.concat(keys.x);
              $$.config.data_x = keys.x;
          }
          else {
              targetKeys = keys.value;
          }
          new_rows.push(targetKeys);
          json.forEach(function (o) {
              var new_row = [];
              targetKeys.forEach(function (key) {
                  // convert undefined to null because undefined data will be removed in convertDataToTargets()
                  var v = $$.findValueInJson(o, key);
                  if (isUndefined(v)) {
                      v = null;
                  }
                  new_row.push(v);
              });
              new_rows.push(new_row);
          });
          data = $$.convertRowsToData(new_rows);
      }
      else {
          Object.keys(json).forEach(function (key) {
              new_rows.push([key].concat(json[key]));
          });
          data = $$.convertColumnsToData(new_rows);
      }
      return data;
  };
  /**
   * Finds value from the given nested object by the given path.
   * If it's not found, then this returns undefined.
   * @param {Object} object the object
   * @param {string} path the path
   */
  ChartInternal.prototype.findValueInJson = function (object, path) {
      if (path in object) {
          // If object has a key that contains . or [], return the key's value
          // instead of searching for an inner object.
          // See https://github.com/c3js/c3/issues/1691 for details.
          return object[path];
      }
      path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties (replace [] with .)
      path = path.replace(/^\./, ''); // strip a leading dot
      var pathArray = path.split('.');
      for (var i = 0; i < pathArray.length; ++i) {
          var k = pathArray[i];
          if (k in object) {
              object = object[k];
          }
          else {
              return;
          }
      }
      return object;
  };
  /**
   * Converts the rows to normalized data.
   * @param {any[][]} rows The row data
   * @return {Object}
   */
  ChartInternal.prototype.convertRowsToData = function (rows) {
      var newRows = [];
      var keys = rows[0];
      for (var i = 1; i < rows.length; i++) {
          var newRow = {};
          for (var j = 0; j < rows[i].length; j++) {
              if (isUndefined(rows[i][j])) {
                  throw new Error('Source data is missing a component at (' + i + ',' + j + ')!');
              }
              newRow[keys[j]] = rows[i][j];
          }
          newRows.push(newRow);
      }
      return { keys: keys, rows: newRows };
  };
  /**
   * Converts the columns to normalized data.
   * @param {any[][]} columns The column data
   * @return {Object}
   */
  ChartInternal.prototype.convertColumnsToData = function (columns) {
      var newRows = [];
      var keys = [];
      for (var i = 0; i < columns.length; i++) {
          var key = columns[i][0];
          for (var j = 1; j < columns[i].length; j++) {
              if (isUndefined(newRows[j - 1])) {
                  newRows[j - 1] = {};
              }
              if (isUndefined(columns[i][j])) {
                  throw new Error('Source data is missing a component at (' + i + ',' + j + ')!');
              }
              newRows[j - 1][key] = columns[i][j];
          }
          keys.push(key);
      }
      return { keys: keys, rows: newRows };
  };
  /**
   * Converts the data format into the target format.
   * @param {!Object} data
   * @param {!Array} data.keys Ordered list of target IDs.
   * @param {!Array} data.rows Rows of data to convert.
   * @param {boolean} appendXs True to append to $$.data.xs, False to replace.
   * @return {!Array}
   */
  ChartInternal.prototype.convertDataToTargets = function (data, appendXs) {
      var $$ = this, config = $$.config, targets, ids, xs, keys, epochs;
      // handles format where keys are not orderly provided
      if (isArray(data)) {
          keys = Object.keys(data[0]);
      }
      else {
          keys = data.keys;
          data = data.rows;
      }
      xs = keys.filter($$.isX, $$);
      if (!$$.isStanfordGraphType()) {
          ids = keys.filter($$.isNotX, $$);
      }
      else {
          epochs = keys.filter($$.isEpochs, $$);
          ids = keys.filter($$.isNotXAndNotEpochs, $$);
          if (xs.length !== 1 || epochs.length !== 1 || ids.length !== 1) {
              throw new Error("You must define the 'x' key name and the 'epochs' for Stanford Diagrams");
          }
      }
      // save x for update data by load when custom x and c3.x API
      ids.forEach(function (id) {
          var xKey = $$.getXKey(id);
          if ($$.isCustomX() || $$.isTimeSeries()) {
              // if included in input data
              if (xs.indexOf(xKey) >= 0) {
                  $$.data.xs[id] = (appendXs && $$.data.xs[id]
                      ? $$.data.xs[id]
                      : []).concat(data
                      .map(function (d) {
                      return d[xKey];
                  })
                      .filter(isValue)
                      .map(function (rawX, i) {
                      return $$.generateTargetX(rawX, id, i);
                  }));
              }
              // if not included in input data, find from preloaded data of other id's x
              else if (config.data_x) {
                  $$.data.xs[id] = $$.getOtherTargetXs();
              }
              // if not included in input data, find from preloaded data
              else if (notEmpty(config.data_xs)) {
                  $$.data.xs[id] = $$.getXValuesOfXKey(xKey, $$.data.targets);
              }
              // MEMO: if no x included, use same x of current will be used
          }
          else {
              $$.data.xs[id] = data.map(function (d, i) {
                  return i;
              });
          }
      });
      // check x is defined
      ids.forEach(function (id) {
          if (!$$.data.xs[id]) {
              throw new Error('x is not defined for id = "' + id + '".');
          }
      });
      // convert to target
      targets = ids.map(function (id, index) {
          var convertedId = config.data_idConverter(id);
          return {
              id: convertedId,
              id_org: id,
              values: data
                  .map(function (d, i) {
                  var xKey = $$.getXKey(id), rawX = d[xKey], value = d[id] !== null && !isNaN(d[id]) ? +d[id] : null, x, returnData;
                  // use x as categories if custom x and categorized
                  if ($$.isCustomX() && $$.isCategorized() && !isUndefined(rawX)) {
                      if (index === 0 && i === 0) {
                          config.axis_x_categories = [];
                      }
                      x = config.axis_x_categories.indexOf(rawX);
                      if (x === -1) {
                          x = config.axis_x_categories.length;
                          config.axis_x_categories.push(rawX);
                      }
                  }
                  else {
                      x = $$.generateTargetX(rawX, id, i);
                  }
                  // mark as x = undefined if value is undefined and filter to remove after mapped
                  if (isUndefined(d[id]) || $$.data.xs[id].length <= i) {
                      x = undefined;
                  }
                  returnData = { x: x, value: value, id: convertedId };
                  if ($$.isStanfordGraphType()) {
                      returnData.epochs = d[epochs];
                  }
                  return returnData;
              })
                  .filter(function (v) {
                  return isDefined(v.x);
              })
          };
      });
      // finish targets
      targets.forEach(function (t) {
          var i;
          // sort values by its x
          if (config.data_xSort) {
              t.values = t.values.sort(function (v1, v2) {
                  var x1 = v1.x || v1.x === 0 ? v1.x : Infinity, x2 = v2.x || v2.x === 0 ? v2.x : Infinity;
                  return x1 - x2;
              });
          }
          // indexing each value
          i = 0;
          t.values.forEach(function (v) {
              v.index = i++;
          });
          // this needs to be sorted because its index and value.index is identical
          $$.data.xs[t.id].sort(function (v1, v2) {
              return v1 - v2;
          });
      });
      // cache information about values
      $$.hasNegativeValue = $$.hasNegativeValueInTargets(targets);
      $$.hasPositiveValue = $$.hasPositiveValueInTargets(targets);
      // set target types
      if (config.data_type) {
          $$.setTargetType($$.mapToIds(targets).filter(function (id) {
              return !(id in config.data_types);
          }), config.data_type);
      }
      // cache as original id keyed
      targets.forEach(function (d) {
          $$.addCache(d.id_org, d);
      });
      return targets;
  };

  ChartInternal.prototype.isEpochs = function (key) {
      var $$ = this, config = $$.config;
      return config.data_epochs && key === config.data_epochs;
  };
  ChartInternal.prototype.isX = function (key) {
      var $$ = this, config = $$.config;
      return ((config.data_x && key === config.data_x) ||
          (notEmpty(config.data_xs) && hasValue(config.data_xs, key)));
  };
  ChartInternal.prototype.isNotX = function (key) {
      return !this.isX(key);
  };
  ChartInternal.prototype.isNotXAndNotEpochs = function (key) {
      return !this.isX(key) && !this.isEpochs(key);
  };
  /**
   * Returns whether the normalized stack option is enabled or not.
   *
   * To be enabled it must also have data.groups defined.
   *
   * @return {boolean}
   */
  ChartInternal.prototype.isStackNormalized = function () {
      return this.config.data_stack_normalize && this.config.data_groups.length > 0;
  };
  /**
   * Returns whether the axis is normalized or not.
   *
   * An axis is normalized as long as one of its associated target
   * is normalized.
   *
   * @param axisId Axis ID (y or y2)
   * @return {Boolean}
   */
  ChartInternal.prototype.isAxisNormalized = function (axisId) {
      var $$ = this;
      if (!$$.isStackNormalized()) {
          // shortcut
          return false;
      }
      return $$.data.targets
          .filter(function (target) { return $$.axis.getId(target.id) === axisId; })
          .some(function (target) { return $$.isTargetNormalized(target.id); });
  };
  /**
   * Returns whether the values for this target ID is normalized or not.
   *
   * To be normalized the option needs to be enabled and target needs
   * to be defined in `data.groups`.
   *
   * @param targetId ID of the target
   * @return {Boolean} True if the target is normalized, false otherwise.
   */
  ChartInternal.prototype.isTargetNormalized = function (targetId) {
      var $$ = this;
      return ($$.isStackNormalized() &&
          $$.config.data_groups.some(function (group) { return group.includes(targetId); }));
  };
  ChartInternal.prototype.getXKey = function (id) {
      var $$ = this, config = $$.config;
      return config.data_x
          ? config.data_x
          : notEmpty(config.data_xs)
              ? config.data_xs[id]
              : null;
  };
  /**
   * Get sum of visible data per index for given axis.
   *
   * Expect axisId to be either 'y' or 'y2'.
   *
   * @private
   * @param axisId Compute sum for data associated to given axis.
   * @return {Array}
   */
  ChartInternal.prototype.getTotalPerIndex = function (axisId) {
      var $$ = this;
      if (!$$.isStackNormalized()) {
          return null;
      }
      var cached = $$.getFromCache('getTotalPerIndex');
      if (cached !== undefined) {
          return cached[axisId];
      }
      var sum = { y: [], y2: [] };
      $$.data.targets
          // keep only target that are normalized
          .filter(function (target) { return $$.isTargetNormalized(target.id); })
          // keep only target that are visible
          .filter(function (target) { return $$.isTargetToShow(target.id); })
          // compute sum per axis
          .forEach(function (target) {
          var sumByAxis = sum[$$.axis.getId(target.id)];
          target.values.forEach(function (v, i) {
              if (!sumByAxis[i]) {
                  sumByAxis[i] = 0;
              }
              sumByAxis[i] += isNumber(v.value) ? v.value : 0;
          });
      });
      $$.addToCache('getTotalPerIndex', sum);
      return sum[axisId];
  };
  /**
   * Get sum of visible data.
   *
   * Should be used for normalised data only since all values
   * are expected to be positive.
   *
   * @private
   * @return {Number}
   */
  ChartInternal.prototype.getTotalDataSum = function () {
      var $$ = this;
      var cached = $$.getFromCache('getTotalDataSum');
      if (cached !== undefined) {
          return cached;
      }
      var totalDataSum = flattenArray($$.data.targets
          .filter(function (target) { return $$.isTargetToShow(target.id); })
          .map(function (target) { return target.values; }))
          .map(function (d) { return d.value; })
          .reduce(function (p, c) { return p + c; }, 0);
      $$.addToCache('getTotalDataSum', totalDataSum);
      return totalDataSum;
  };
  ChartInternal.prototype.getXValuesOfXKey = function (key, targets) {
      var $$ = this, xValues, ids = targets && notEmpty(targets) ? $$.mapToIds(targets) : [];
      ids.forEach(function (id) {
          if ($$.getXKey(id) === key) {
              xValues = $$.data.xs[id];
          }
      });
      return xValues;
  };
  ChartInternal.prototype.getXValue = function (id, i) {
      var $$ = this;
      return id in $$.data.xs && $$.data.xs[id] && isValue($$.data.xs[id][i])
          ? $$.data.xs[id][i]
          : i;
  };
  ChartInternal.prototype.getOtherTargetXs = function () {
      var $$ = this, idsForX = Object.keys($$.data.xs);
      return idsForX.length ? $$.data.xs[idsForX[0]] : null;
  };
  ChartInternal.prototype.getOtherTargetX = function (index) {
      var xs = this.getOtherTargetXs();
      return xs && index < xs.length ? xs[index] : null;
  };
  ChartInternal.prototype.addXs = function (xs) {
      var $$ = this;
      Object.keys(xs).forEach(function (id) {
          $$.config.data_xs[id] = xs[id];
      });
  };
  ChartInternal.prototype.addName = function (data) {
      var $$ = this, name;
      if (data) {
          name = $$.config.data_names[data.id];
          data.name = name !== undefined ? name : data.id;
      }
      return data;
  };
  ChartInternal.prototype.getValueOnIndex = function (values, index) {
      var valueOnIndex = values.filter(function (v) {
          return v.index === index;
      });
      return valueOnIndex.length ? valueOnIndex[0] : null;
  };
  ChartInternal.prototype.updateTargetX = function (targets, x) {
      var $$ = this;
      targets.forEach(function (t) {
          t.values.forEach(function (v, i) {
              v.x = $$.generateTargetX(x[i], t.id, i);
          });
          $$.data.xs[t.id] = x;
      });
  };
  ChartInternal.prototype.updateTargetXs = function (targets, xs) {
      var $$ = this;
      targets.forEach(function (t) {
          if (xs[t.id]) {
              $$.updateTargetX([t], xs[t.id]);
          }
      });
  };
  ChartInternal.prototype.generateTargetX = function (rawX, id, index) {
      var $$ = this, x;
      if ($$.isTimeSeries()) {
          x = rawX ? $$.parseDate(rawX) : $$.parseDate($$.getXValue(id, index));
      }
      else if ($$.isCustomX() && !$$.isCategorized()) {
          x = isValue(rawX) ? +rawX : $$.getXValue(id, index);
      }
      else {
          x = index;
      }
      return x;
  };
  ChartInternal.prototype.cloneTarget = function (target) {
      return {
          id: target.id,
          id_org: target.id_org,
          values: target.values.map(function (d) {
              return {
                  x: d.x,
                  value: d.value,
                  id: d.id
              };
          })
      };
  };
  ChartInternal.prototype.getMaxDataCount = function () {
      var $$ = this;
      return $$.d3.max($$.data.targets, function (t) {
          return t.values.length;
      });
  };
  ChartInternal.prototype.mapToIds = function (targets) {
      return targets.map(function (d) {
          return d.id;
      });
  };
  ChartInternal.prototype.mapToTargetIds = function (ids) {
      var $$ = this;
      return ids ? [].concat(ids) : $$.mapToIds($$.data.targets);
  };
  ChartInternal.prototype.hasTarget = function (targets, id) {
      var ids = this.mapToIds(targets), i;
      for (i = 0; i < ids.length; i++) {
          if (ids[i] === id) {
              return true;
          }
      }
      return false;
  };
  ChartInternal.prototype.isTargetToShow = function (targetId) {
      return this.hiddenTargetIds.indexOf(targetId) < 0;
  };
  ChartInternal.prototype.isLegendToShow = function (targetId) {
      return this.hiddenLegendIds.indexOf(targetId) < 0;
  };
  /**
   * Returns only visible targets.
   *
   * This is the same as calling {@link filterTargetsToShow} on $$.data.targets.
   *
   * @return {Array}
   */
  ChartInternal.prototype.getTargetsToShow = function () {
      var $$ = this;
      return $$.filterTargetsToShow($$.data.targets);
  };
  ChartInternal.prototype.filterTargetsToShow = function (targets) {
      var $$ = this;
      return targets.filter(function (t) {
          return $$.isTargetToShow(t.id);
      });
  };
  /**
   * @return {Array} Returns all the targets attached to the chart, visible or not
   */
  ChartInternal.prototype.getTargets = function () {
      var $$ = this;
      return $$.data.targets;
  };
  ChartInternal.prototype.mapTargetsToUniqueXs = function (targets) {
      var $$ = this;
      var xs = $$.d3
          .set($$.d3.merge(targets.map(function (t) {
          return t.values.map(function (v) {
              return +v.x;
          });
      })))
          .values();
      xs = $$.isTimeSeries()
          ? xs.map(function (x) {
              return new Date(+x);
          })
          : xs.map(function (x) {
              return +x;
          });
      return xs.sort(function (a, b) {
          return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
      });
  };
  ChartInternal.prototype.addHiddenTargetIds = function (targetIds) {
      targetIds = targetIds instanceof Array ? targetIds : new Array(targetIds);
      for (var i = 0; i < targetIds.length; i++) {
          if (this.hiddenTargetIds.indexOf(targetIds[i]) < 0) {
              this.hiddenTargetIds = this.hiddenTargetIds.concat(targetIds[i]);
          }
      }
      this.resetCache();
  };
  ChartInternal.prototype.removeHiddenTargetIds = function (targetIds) {
      this.hiddenTargetIds = this.hiddenTargetIds.filter(function (id) {
          return targetIds.indexOf(id) < 0;
      });
      this.resetCache();
  };
  ChartInternal.prototype.addHiddenLegendIds = function (targetIds) {
      targetIds = targetIds instanceof Array ? targetIds : new Array(targetIds);
      for (var i = 0; i < targetIds.length; i++) {
          if (this.hiddenLegendIds.indexOf(targetIds[i]) < 0) {
              this.hiddenLegendIds = this.hiddenLegendIds.concat(targetIds[i]);
          }
      }
  };
  ChartInternal.prototype.removeHiddenLegendIds = function (targetIds) {
      this.hiddenLegendIds = this.hiddenLegendIds.filter(function (id) {
          return targetIds.indexOf(id) < 0;
      });
  };
  ChartInternal.prototype.getValuesAsIdKeyed = function (targets) {
      var ys = {};
      targets.forEach(function (t) {
          ys[t.id] = [];
          t.values.forEach(function (v) {
              ys[t.id].push(v.value);
          });
      });
      return ys;
  };
  ChartInternal.prototype.checkValueInTargets = function (targets, checker) {
      var ids = Object.keys(targets), i, j, values;
      for (i = 0; i < ids.length; i++) {
          values = targets[ids[i]].values;
          for (j = 0; j < values.length; j++) {
              if (checker(values[j].value)) {
                  return true;
              }
          }
      }
      return false;
  };
  ChartInternal.prototype.hasNegativeValueInTargets = function (targets) {
      return this.checkValueInTargets(targets, function (v) {
          return v < 0;
      });
  };
  ChartInternal.prototype.hasPositiveValueInTargets = function (targets) {
      return this.checkValueInTargets(targets, function (v) {
          return v > 0;
      });
  };
  ChartInternal.prototype.isOrderDesc = function () {
      var config = this.config;
      return (typeof config.data_order === 'string' &&
          config.data_order.toLowerCase() === 'desc');
  };
  ChartInternal.prototype.isOrderAsc = function () {
      var config = this.config;
      return (typeof config.data_order === 'string' &&
          config.data_order.toLowerCase() === 'asc');
  };
  ChartInternal.prototype.getOrderFunction = function () {
      var $$ = this, config = $$.config, orderAsc = $$.isOrderAsc(), orderDesc = $$.isOrderDesc();
      if (orderAsc || orderDesc) {
          var reducer = function (p, c) {
              return p + Math.abs(c.value);
          };
          return function (t1, t2) {
              var t1Sum = t1.values.reduce(reducer, 0), t2Sum = t2.values.reduce(reducer, 0);
              return orderAsc ? t2Sum - t1Sum : t1Sum - t2Sum;
          };
      }
      else if (isFunction(config.data_order)) {
          return config.data_order;
      }
      else if (isArray(config.data_order)) {
          var order = config.data_order;
          return function (t1, t2) {
              return order.indexOf(t1.id) - order.indexOf(t2.id);
          };
      }
  };
  ChartInternal.prototype.orderTargets = function (targets) {
      var fct = this.getOrderFunction();
      if (fct) {
          targets.sort(fct);
      }
      return targets;
  };
  /**
   * Returns all the values from the given targets at the given index.
   *
   * @param {Array} targets
   * @param {Number} index
   * @return {Array}
   */
  ChartInternal.prototype.filterByIndex = function (targets, index) {
      return this.d3.merge(targets.map(function (t) { return t.values.filter(function (v) { return v.index === index; }); }));
  };
  ChartInternal.prototype.filterByX = function (targets, x) {
      return this.d3
          .merge(targets.map(function (t) {
          return t.values;
      }))
          .filter(function (v) {
          return v.x - x === 0;
      });
  };
  ChartInternal.prototype.filterRemoveNull = function (data) {
      return data.filter(function (d) {
          return isValue(d.value);
      });
  };
  ChartInternal.prototype.filterByXDomain = function (targets, xDomain) {
      return targets.map(function (t) {
          return {
              id: t.id,
              id_org: t.id_org,
              values: t.values.filter(function (v) {
                  return xDomain[0] <= v.x && v.x <= xDomain[1];
              })
          };
      });
  };
  ChartInternal.prototype.hasDataLabel = function () {
      var config = this.config;
      if (typeof config.data_labels === 'boolean' && config.data_labels) {
          return true;
      }
      else if (typeof config.data_labels === 'object' &&
          notEmpty(config.data_labels)) {
          return true;
      }
      return false;
  };
  ChartInternal.prototype.getDataLabelLength = function (min, max, key) {
      var $$ = this, lengths = [0, 0], paddingCoef = 1.3;
      $$.selectChart
          .select('svg')
          .selectAll('.dummy')
          .data([min, max])
          .enter()
          .append('text')
          .text(function (d) {
          return $$.dataLabelFormat(d.id)(d);
      })
          .each(function (d, i) {
          lengths[i] = getBBox(this)[key] * paddingCoef;
      })
          .remove();
      return lengths;
  };
  /**
   * Returns true if the given data point is not arc type, otherwise false.
   * @param {Object} d The data point
   * @return {boolean}
   */
  ChartInternal.prototype.isNoneArc = function (d) {
      return this.hasTarget(this.data.targets, d.id);
  };
  /**
   * Returns true if the given data point is arc type, otherwise false.
   * @param {Object} d The data point
   * @return {boolean}
   */
  ChartInternal.prototype.isArc = function (d) {
      return 'data' in d && this.hasTarget(this.data.targets, d.data.id);
  };
  /**
   * Find the closest point from the given pos among the given targets or
   * undefined if none satisfies conditions.
   *
   * @param {Array} targets
   * @param {Array} pos An [x,y] coordinate
   * @return {Object|undefined}
   */
  ChartInternal.prototype.findClosestFromTargets = function (targets, pos) {
      var $$ = this;
      // for each target, find the closest point
      var candidates = targets
          .map(function (t) {
          return $$.findClosest(t.values, pos, $$.config.tooltip_horizontal
              ? $$.horizontalDistance.bind($$)
              : $$.dist.bind($$), $$.config.point_sensitivity);
      })
          .filter(function (v) { return v; });
      // returns the closest of candidates
      if (candidates.length === 0) {
          return undefined;
      }
      else if (candidates.length === 1) {
          return candidates[0];
      }
      else {
          return $$.findClosest(candidates, pos, $$.dist.bind($$));
      }
  };
  /**
   * Find the closest point from the x value or undefined if none satisfies conditions.
   *
   * @param {Array} targets
   * @param {Array} x A value on X axis
   * @return {Object|undefined}
   */
  ChartInternal.prototype.findClosestFromTargetsByX = function (targets, x) {
      var closest;
      var diff;
      targets.forEach(function (t) {
          t.values.forEach(function (d) {
              var newDiff = Math.abs(x - d.x);
              if (diff === undefined || newDiff < diff) {
                  closest = d;
                  diff = newDiff;
              }
          });
      });
      return closest;
  };
  /**
   * Using given compute distance method, returns the closest data point from the
   * given position.
   *
   * Giving optionally a minimum distance to satisfy.
   *
   * @param {Array} dataPoints List of DataPoints
   * @param {Array} pos An [x,y] coordinate
   * @param {Function} computeDist Function to compute distance between 2 points
   * @param {Number} minDist Minimal distance to satisfy
   * @return {Object|undefined} Closest data point
   */
  ChartInternal.prototype.findClosest = function (dataPoints, pos, computeDist, minDist) {
      if (minDist === void 0) { minDist = Infinity; }
      var $$ = this;
      var closest;
      // find closest bar
      dataPoints
          .filter(function (v) { return v && $$.isBarType(v.id); })
          .forEach(function (v) {
          if (!closest) {
              var shape = $$.main
                  .select('.' +
                  CLASS.bars +
                  $$.getTargetSelectorSuffix(v.id) +
                  ' .' +
                  CLASS.bar +
                  '-' +
                  v.index)
                  .node();
              if ($$.isWithinBar(pos, shape)) {
                  closest = v;
              }
          }
      });
      // find closest point from non-bar
      dataPoints
          .filter(function (v) { return v && !$$.isBarType(v.id); })
          .forEach(function (v) {
          var d = computeDist(v, pos);
          if (d < minDist) {
              minDist = d;
              closest = v;
          }
      });
      return closest;
  };
  ChartInternal.prototype.dist = function (data, pos) {
      var $$ = this, config = $$.config, xIndex = config.axis_rotated ? 1 : 0, yIndex = config.axis_rotated ? 0 : 1, y = $$.circleY(data, data.index), x = $$.x(data.x);
      return Math.sqrt(Math.pow(x - pos[xIndex], 2) + Math.pow(y - pos[yIndex], 2));
  };
  ChartInternal.prototype.horizontalDistance = function (data, pos) {
      var $$ = this, config = $$.config, xIndex = config.axis_rotated ? 1 : 0, x = $$.x(data.x);
      return Math.abs(x - pos[xIndex]);
  };
  ChartInternal.prototype.convertValuesToStep = function (values) {
      var converted = [].concat(values), i;
      if (!this.isCategorized()) {
          return values;
      }
      for (i = values.length + 1; 0 < i; i--) {
          converted[i] = converted[i - 1];
      }
      converted[0] = {
          x: converted[0].x - 1,
          value: converted[0].value,
          id: converted[0].id
      };
      converted[values.length + 1] = {
          x: converted[values.length].x + 1,
          value: converted[values.length].value,
          id: converted[values.length].id
      };
      return converted;
  };
  /**
   * Get ratio value
   *
   * @param {String} type Ratio for given type
   * @param {Object} d Data value object
   * @param {Boolean} asPercent Convert the return as percent or not
   * @return {Number} Ratio value
   * @private
   */
  ChartInternal.prototype.getRatio = function (type, d, asPercent) {
      if (asPercent === void 0) { asPercent = false; }
      var $$ = this;
      var api = $$.api;
      var ratio = 0;
      if (d && api.data.shown.call(api).length) {
          ratio = d.ratio || d.value;
          if (type === 'arc') {
              if ($$.hasType('gauge')) {
                  ratio =
                      (d.endAngle - d.startAngle) /
                          (Math.PI * ($$.config.gauge_fullCircle ? 2 : 1));
              }
              else {
                  var total = $$.getTotalDataSum();
                  ratio = d.value / total;
              }
          }
          else if (type === 'index') {
              var total = $$.getTotalPerIndex($$.axis.getId(d.id));
              d.ratio =
                  isNumber(d.value) && total && total[d.index] > 0
                      ? d.value / total[d.index]
                      : 0;
              ratio = d.ratio;
          }
      }
      return asPercent && ratio ? ratio * 100 : ratio;
  };
  ChartInternal.prototype.updateDataAttributes = function (name, attrs) {
      var $$ = this, config = $$.config, current = config['data_' + name];
      if (typeof attrs === 'undefined') {
          return current;
      }
      Object.keys(attrs).forEach(function (id) {
          current[id] = attrs[id];
      });
      $$.redraw({
          withLegend: true
      });
      return current;
  };

  ChartInternal.prototype.load = function (targets, args) {
      var $$ = this;
      if (targets) {
          // filter loading targets if needed
          if (args.filter) {
              targets = targets.filter(args.filter);
          }
          // set type if args.types || args.type specified
          if (args.type || args.types) {
              targets.forEach(function (t) {
                  var type = args.types && args.types[t.id] ? args.types[t.id] : args.type;
                  $$.setTargetType(t.id, type);
              });
          }
          // Update/Add data
          $$.data.targets.forEach(function (d) {
              for (var i = 0; i < targets.length; i++) {
                  if (d.id === targets[i].id) {
                      d.values = targets[i].values;
                      targets.splice(i, 1);
                      break;
                  }
              }
          });
          $$.data.targets = $$.data.targets.concat(targets); // add remained
      }
      // Set targets
      $$.updateTargets($$.data.targets);
      // Redraw with new targets
      $$.redraw({
          withUpdateOrgXDomain: true,
          withUpdateXDomain: true,
          withLegend: true
      });
      if (args.done) {
          args.done();
      }
  };
  ChartInternal.prototype.loadFromArgs = function (args) {
      var $$ = this;
      $$.resetCache();
      if (args.data) {
          $$.load($$.convertDataToTargets(args.data), args);
      }
      else if (args.url) {
          $$.convertUrlToData(args.url, args.mimeType, args.headers, args.keys, function (data) {
              $$.load($$.convertDataToTargets(data), args);
          });
      }
      else if (args.json) {
          $$.load($$.convertDataToTargets($$.convertJsonToData(args.json, args.keys)), args);
      }
      else if (args.rows) {
          $$.load($$.convertDataToTargets($$.convertRowsToData(args.rows)), args);
      }
      else if (args.columns) {
          $$.load($$.convertDataToTargets($$.convertColumnsToData(args.columns)), args);
      }
      else {
          $$.load(null, args);
      }
  };
  ChartInternal.prototype.unload = function (targetIds, done) {
      var $$ = this;
      $$.resetCache();
      if (!done) {
          done = function () { };
      }
      // filter existing target
      targetIds = targetIds.filter(function (id) {
          return $$.hasTarget($$.data.targets, id);
      });
      // If no target, call done and return
      if (!targetIds || targetIds.length === 0) {
          done();
          return;
      }
      $$.svg
          .selectAll(targetIds.map(function (id) {
          return $$.selectorTarget(id);
      }))
          .transition()
          .style('opacity', 0)
          .remove()
          .call($$.endall, done);
      targetIds.forEach(function (id) {
          // Reset fadein for future load
          $$.withoutFadeIn[id] = false;
          // Remove target's elements
          if ($$.legend) {
              $$.legend
                  .selectAll('.' + CLASS.legendItem + $$.getTargetSelectorSuffix(id))
                  .remove();
          }
          // Remove target
          $$.data.targets = $$.data.targets.filter(function (t) {
              return t.id !== id;
          });
      });
  };

  ChartInternal.prototype.getYDomainMin = function (targets) {
      var $$ = this, config = $$.config, ids = $$.mapToIds(targets), ys = $$.getValuesAsIdKeyed(targets), j, k, baseId, idsInGroup, id, hasNegativeValue;
      if (config.data_groups.length > 0) {
          hasNegativeValue = $$.hasNegativeValueInTargets(targets);
          for (j = 0; j < config.data_groups.length; j++) {
              // Determine baseId
              idsInGroup = config.data_groups[j].filter(function (id) {
                  return ids.indexOf(id) >= 0;
              });
              if (idsInGroup.length === 0) {
                  continue;
              }
              baseId = idsInGroup[0];
              // Consider negative values
              if (hasNegativeValue && ys[baseId]) {
                  ys[baseId].forEach(function (v, i) {
                      ys[baseId][i] = v < 0 ? v : 0;
                  });
              }
              // Compute min
              for (k = 1; k < idsInGroup.length; k++) {
                  id = idsInGroup[k];
                  if (!ys[id]) {
                      continue;
                  }
                  ys[id].forEach(function (v, i) {
                      if ($$.axis.getId(id) === $$.axis.getId(baseId) &&
                          ys[baseId] &&
                          !(hasNegativeValue && +v > 0)) {
                          ys[baseId][i] += +v;
                      }
                  });
              }
          }
      }
      return $$.d3.min(Object.keys(ys).map(function (key) {
          return $$.d3.min(ys[key]);
      }));
  };
  ChartInternal.prototype.getYDomainMax = function (targets) {
      var $$ = this, config = $$.config, ids = $$.mapToIds(targets), ys = $$.getValuesAsIdKeyed(targets), j, k, baseId, idsInGroup, id, hasPositiveValue;
      if (config.data_groups.length > 0) {
          hasPositiveValue = $$.hasPositiveValueInTargets(targets);
          for (j = 0; j < config.data_groups.length; j++) {
              // Determine baseId
              idsInGroup = config.data_groups[j].filter(function (id) {
                  return ids.indexOf(id) >= 0;
              });
              if (idsInGroup.length === 0) {
                  continue;
              }
              baseId = idsInGroup[0];
              // Consider positive values
              if (hasPositiveValue && ys[baseId]) {
                  ys[baseId].forEach(function (v, i) {
                      ys[baseId][i] = v > 0 ? v : 0;
                  });
              }
              // Compute max
              for (k = 1; k < idsInGroup.length; k++) {
                  id = idsInGroup[k];
                  if (!ys[id]) {
                      continue;
                  }
                  ys[id].forEach(function (v, i) {
                      if ($$.axis.getId(id) === $$.axis.getId(baseId) &&
                          ys[baseId] &&
                          !(hasPositiveValue && +v < 0)) {
                          ys[baseId][i] += +v;
                      }
                  });
              }
          }
      }
      return $$.d3.max(Object.keys(ys).map(function (key) {
          return $$.d3.max(ys[key]);
      }));
  };
  ChartInternal.prototype.getYDomain = function (targets, axisId, xDomain) {
      var $$ = this, config = $$.config;
      if ($$.isAxisNormalized(axisId)) {
          return [0, 100];
      }
      var targetsByAxisId = targets.filter(function (t) {
          return $$.axis.getId(t.id) === axisId;
      }), yTargets = xDomain
          ? $$.filterByXDomain(targetsByAxisId, xDomain)
          : targetsByAxisId, yMin = axisId === 'y2' ? config.axis_y2_min : config.axis_y_min, yMax = axisId === 'y2' ? config.axis_y2_max : config.axis_y_max, yDomainMin = $$.getYDomainMin(yTargets), yDomainMax = $$.getYDomainMax(yTargets), domain, domainLength, padding_top, padding_bottom, center = axisId === 'y2' ? config.axis_y2_center : config.axis_y_center, yDomainAbs, lengths, diff, ratio, isAllPositive, isAllNegative, isZeroBased = ($$.hasType('bar', yTargets) && config.bar_zerobased) ||
          ($$.hasType('area', yTargets) && config.area_zerobased), isInverted = axisId === 'y2' ? config.axis_y2_inverted : config.axis_y_inverted, showHorizontalDataLabel = $$.hasDataLabel() && config.axis_rotated, showVerticalDataLabel = $$.hasDataLabel() && !config.axis_rotated;
      // MEMO: avoid inverting domain unexpectedly
      yDomainMin = isValue(yMin)
          ? yMin
          : isValue(yMax)
              ? yDomainMin < yMax
                  ? yDomainMin
                  : yMax - 10
              : yDomainMin;
      yDomainMax = isValue(yMax)
          ? yMax
          : isValue(yMin)
              ? yMin < yDomainMax
                  ? yDomainMax
                  : yMin + 10
              : yDomainMax;
      if (yTargets.length === 0) {
          // use current domain if target of axisId is none
          return axisId === 'y2' ? $$.y2.domain() : $$.y.domain();
      }
      if (isNaN(yDomainMin)) {
          // set minimum to zero when not number
          yDomainMin = 0;
      }
      if (isNaN(yDomainMax)) {
          // set maximum to have same value as yDomainMin
          yDomainMax = yDomainMin;
      }
      if (yDomainMin === yDomainMax) {
          yDomainMin < 0 ? (yDomainMax = 0) : (yDomainMin = 0);
      }
      isAllPositive = yDomainMin >= 0 && yDomainMax >= 0;
      isAllNegative = yDomainMin <= 0 && yDomainMax <= 0;
      // Cancel zerobased if axis_*_min / axis_*_max specified
      if ((isValue(yMin) && isAllPositive) || (isValue(yMax) && isAllNegative)) {
          isZeroBased = false;
      }
      // Bar/Area chart should be 0-based if all positive|negative
      if (isZeroBased) {
          if (isAllPositive) {
              yDomainMin = 0;
          }
          if (isAllNegative) {
              yDomainMax = 0;
          }
      }
      domainLength = Math.abs(yDomainMax - yDomainMin);
      padding_top = padding_bottom = domainLength * 0.1;
      if (typeof center !== 'undefined') {
          yDomainAbs = Math.max(Math.abs(yDomainMin), Math.abs(yDomainMax));
          yDomainMax = center + yDomainAbs;
          yDomainMin = center - yDomainAbs;
      }
      // add padding for data label
      if (showHorizontalDataLabel) {
          lengths = $$.getDataLabelLength(yDomainMin, yDomainMax, 'width');
          diff = diffDomain($$.y.range());
          ratio = [lengths[0] / diff, lengths[1] / diff];
          padding_top += domainLength * (ratio[1] / (1 - ratio[0] - ratio[1]));
          padding_bottom += domainLength * (ratio[0] / (1 - ratio[0] - ratio[1]));
      }
      else if (showVerticalDataLabel) {
          lengths = $$.getDataLabelLength(yDomainMin, yDomainMax, 'height');
          var pixelsToAxisPadding = $$.getY(config["axis_" + axisId + "_type"], 
          // input domain as pixels
          [0, config.axis_rotated ? $$.width : $$.height], 
          // output range as axis padding
          [0, domainLength]);
          padding_top += pixelsToAxisPadding(lengths[1]);
          padding_bottom += pixelsToAxisPadding(lengths[0]);
      }
      if (axisId === 'y' && notEmpty(config.axis_y_padding)) {
          padding_top = $$.axis.getPadding(config.axis_y_padding, 'top', padding_top, domainLength);
          padding_bottom = $$.axis.getPadding(config.axis_y_padding, 'bottom', padding_bottom, domainLength);
      }
      if (axisId === 'y2' && notEmpty(config.axis_y2_padding)) {
          padding_top = $$.axis.getPadding(config.axis_y2_padding, 'top', padding_top, domainLength);
          padding_bottom = $$.axis.getPadding(config.axis_y2_padding, 'bottom', padding_bottom, domainLength);
      }
      // Bar/Area chart should be 0-based if all positive|negative
      if (isZeroBased) {
          if (isAllPositive) {
              padding_bottom = yDomainMin;
          }
          if (isAllNegative) {
              padding_top = -yDomainMax;
          }
      }
      domain = [yDomainMin - padding_bottom, yDomainMax + padding_top];
      return isInverted ? domain.reverse() : domain;
  };
  ChartInternal.prototype.getXDomainMin = function (targets) {
      var $$ = this, config = $$.config;
      return isDefined(config.axis_x_min)
          ? $$.isTimeSeries()
              ? this.parseDate(config.axis_x_min)
              : config.axis_x_min
          : $$.d3.min(targets, function (t) {
              return $$.d3.min(t.values, function (v) {
                  return v.x;
              });
          });
  };
  ChartInternal.prototype.getXDomainMax = function (targets) {
      var $$ = this, config = $$.config;
      return isDefined(config.axis_x_max)
          ? $$.isTimeSeries()
              ? this.parseDate(config.axis_x_max)
              : config.axis_x_max
          : $$.d3.max(targets, function (t) {
              return $$.d3.max(t.values, function (v) {
                  return v.x;
              });
          });
  };
  ChartInternal.prototype.getXDomainPadding = function (domain) {
      var $$ = this, config = $$.config, diff = domain[1] - domain[0], maxDataCount, padding, paddingLeft, paddingRight;
      if ($$.isCategorized()) {
          padding = 0;
      }
      else if ($$.hasType('bar')) {
          maxDataCount = $$.getMaxDataCount();
          padding = maxDataCount > 1 ? diff / (maxDataCount - 1) / 2 : 0.5;
      }
      else {
          padding = diff * 0.01;
      }
      if (typeof config.axis_x_padding === 'object' &&
          notEmpty(config.axis_x_padding)) {
          paddingLeft = isValue(config.axis_x_padding.left)
              ? config.axis_x_padding.left
              : padding;
          paddingRight = isValue(config.axis_x_padding.right)
              ? config.axis_x_padding.right
              : padding;
      }
      else if (typeof config.axis_x_padding === 'number') {
          paddingLeft = paddingRight = config.axis_x_padding;
      }
      else {
          paddingLeft = paddingRight = padding;
      }
      return { left: paddingLeft, right: paddingRight };
  };
  ChartInternal.prototype.getXDomain = function (targets) {
      var $$ = this, xDomain = [$$.getXDomainMin(targets), $$.getXDomainMax(targets)], firstX = xDomain[0], lastX = xDomain[1], padding = $$.getXDomainPadding(xDomain), min = 0, max = 0;
      // show center of x domain if min and max are the same
      if (firstX - lastX === 0 && !$$.isCategorized()) {
          if ($$.isTimeSeries()) {
              firstX = new Date(firstX.getTime() * 0.5);
              lastX = new Date(lastX.getTime() * 1.5);
          }
          else {
              firstX = firstX === 0 ? 1 : firstX * 0.5;
              lastX = lastX === 0 ? -1 : lastX * 1.5;
          }
      }
      if (firstX || firstX === 0) {
          min = $$.isTimeSeries()
              ? new Date(firstX.getTime() - padding.left)
              : firstX - padding.left;
      }
      if (lastX || lastX === 0) {
          max = $$.isTimeSeries()
              ? new Date(lastX.getTime() + padding.right)
              : lastX + padding.right;
      }
      return [min, max];
  };
  ChartInternal.prototype.updateXDomain = function (targets, withUpdateXDomain, withUpdateOrgXDomain, withTrim, domain) {
      var $$ = this, config = $$.config;
      if (withUpdateOrgXDomain) {
          $$.x.domain(domain ? domain : $$.d3.extent($$.getXDomain(targets)));
          $$.orgXDomain = $$.x.domain();
          if (config.zoom_enabled) {
              $$.zoom.update();
          }
          $$.subX.domain($$.x.domain());
          if ($$.brush) {
              $$.brush.updateScale($$.subX);
          }
      }
      if (withUpdateXDomain) {
          $$.x.domain(domain
              ? domain
              : !$$.brush || $$.brush.empty()
                  ? $$.orgXDomain
                  : $$.brush.selectionAsValue());
      }
      // Trim domain when too big by zoom mousemove event
      if (withTrim) {
          $$.x.domain($$.trimXDomain($$.x.orgDomain()));
      }
      return $$.x.domain();
  };
  ChartInternal.prototype.trimXDomain = function (domain) {
      var zoomDomain = this.getZoomDomain(), min = zoomDomain[0], max = zoomDomain[1];
      if (domain[0] <= min) {
          domain[1] = +domain[1] + (min - domain[0]);
          domain[0] = min;
      }
      if (max <= domain[1]) {
          domain[0] = +domain[0] - (domain[1] - max);
          domain[1] = max;
      }
      return domain;
  };

  ChartInternal.prototype.drag = function (mouse) {
      var $$ = this, config = $$.config, main = $$.main, d3 = $$.d3;
      var sx, sy, mx, my, minX, maxX, minY, maxY;
      if ($$.hasArcType()) {
          return;
      }
      if (!config.data_selection_enabled) {
          return;
      } // do nothing if not selectable
      if (!config.data_selection_multiple) {
          return;
      } // skip when single selection because drag is used for multiple selection
      sx = $$.dragStart[0];
      sy = $$.dragStart[1];
      mx = mouse[0];
      my = mouse[1];
      minX = Math.min(sx, mx);
      maxX = Math.max(sx, mx);
      minY = config.data_selection_grouped ? $$.margin.top : Math.min(sy, my);
      maxY = config.data_selection_grouped ? $$.height : Math.max(sy, my);
      main
          .select('.' + CLASS.dragarea)
          .attr('x', minX)
          .attr('y', minY)
          .attr('width', maxX - minX)
          .attr('height', maxY - minY);
      // TODO: binary search when multiple xs
      main
          .selectAll('.' + CLASS.shapes)
          .selectAll('.' + CLASS.shape)
          .each(function (d, i) {
          if (!config.data_selection_isselectable(d)) {
              return;
          }
          var shape = d3.select(this), isSelected = shape.classed(CLASS.SELECTED), isIncluded = shape.classed(CLASS.INCLUDED), _x, _y, _w, _h, toggle, isWithin = false, box;
          if (shape.classed(CLASS.circle)) {
              _x = shape.attr('cx') * 1;
              _y = shape.attr('cy') * 1;
              toggle = $$.togglePoint;
              isWithin = minX < _x && _x < maxX && minY < _y && _y < maxY;
          }
          else if (shape.classed(CLASS.bar)) {
              box = getPathBox(this);
              _x = box.x;
              _y = box.y;
              _w = box.width;
              _h = box.height;
              toggle = $$.togglePath;
              isWithin =
                  !(maxX < _x || _x + _w < minX) && !(maxY < _y || _y + _h < minY);
          }
          else {
              // line/area selection not supported yet
              return;
          }
          if (isWithin ^ isIncluded) {
              shape.classed(CLASS.INCLUDED, !isIncluded);
              // TODO: included/unincluded callback here
              shape.classed(CLASS.SELECTED, !isSelected);
              toggle.call($$, !isSelected, shape, d, i);
          }
      });
  };
  ChartInternal.prototype.dragstart = function (mouse) {
      var $$ = this, config = $$.config;
      if ($$.hasArcType()) {
          return;
      }
      if (!config.data_selection_enabled) {
          return;
      } // do nothing if not selectable
      $$.dragStart = mouse;
      $$.main
          .select('.' + CLASS.chart)
          .append('rect')
          .attr('class', CLASS.dragarea)
          .style('opacity', 0.1);
      $$.dragging = true;
  };
  ChartInternal.prototype.dragend = function () {
      var $$ = this, config = $$.config;
      if ($$.hasArcType()) {
          return;
      }
      if (!config.data_selection_enabled) {
          return;
      } // do nothing if not selectable
      $$.main
          .select('.' + CLASS.dragarea)
          .transition()
          .duration(100)
          .style('opacity', 0)
          .remove();
      $$.main.selectAll('.' + CLASS.shape).classed(CLASS.INCLUDED, false);
      $$.dragging = false;
  };

  ChartInternal.prototype.getYFormat = function (forArc) {
      var $$ = this, formatForY = forArc && !$$.hasType('gauge') ? $$.defaultArcValueFormat : $$.yFormat, formatForY2 = forArc && !$$.hasType('gauge') ? $$.defaultArcValueFormat : $$.y2Format;
      return function (v, ratio, id) {
          var format = $$.axis.getId(id) === 'y2' ? formatForY2 : formatForY;
          return format.call($$, v, ratio);
      };
  };
  ChartInternal.prototype.yFormat = function (v) {
      var $$ = this, config = $$.config, format = config.axis_y_tick_format
          ? config.axis_y_tick_format
          : $$.defaultValueFormat;
      return format(v);
  };
  ChartInternal.prototype.y2Format = function (v) {
      var $$ = this, config = $$.config, format = config.axis_y2_tick_format
          ? config.axis_y2_tick_format
          : $$.defaultValueFormat;
      return format(v);
  };
  ChartInternal.prototype.defaultValueFormat = function (v) {
      return isValue(v) ? +v : '';
  };
  ChartInternal.prototype.defaultArcValueFormat = function (v, ratio) {
      return (ratio * 100).toFixed(1) + '%';
  };
  ChartInternal.prototype.dataLabelFormat = function (targetId) {
      var $$ = this, data_labels = $$.config.data_labels, format, defaultFormat = function (v) {
          return isValue(v) ? +v : '';
      };
      // find format according to axis id
      if (typeof data_labels.format === 'function') {
          format = data_labels.format;
      }
      else if (typeof data_labels.format === 'object') {
          if (data_labels.format[targetId]) {
              format =
                  data_labels.format[targetId] === true
                      ? defaultFormat
                      : data_labels.format[targetId];
          }
          else {
              format = function () {
                  return '';
              };
          }
      }
      else {
          format = defaultFormat;
      }
      return format;
  };

  ChartInternal.prototype.initGrid = function () {
      var $$ = this, config = $$.config, d3 = $$.d3;
      $$.grid = $$.main
          .append('g')
          .attr('clip-path', $$.clipPathForGrid)
          .attr('class', CLASS.grid);
      if (config.grid_x_show) {
          $$.grid.append('g').attr('class', CLASS.xgrids);
      }
      if (config.grid_y_show) {
          $$.grid.append('g').attr('class', CLASS.ygrids);
      }
      if (config.grid_focus_show) {
          $$.grid
              .append('g')
              .attr('class', CLASS.xgridFocus)
              .append('line')
              .attr('class', CLASS.xgridFocus);
      }
      $$.xgrid = d3.selectAll([]);
      if (!config.grid_lines_front) {
          $$.initGridLines();
      }
  };
  ChartInternal.prototype.initGridLines = function () {
      var $$ = this, d3 = $$.d3;
      $$.gridLines = $$.main
          .append('g')
          .attr('clip-path', $$.clipPathForGrid)
          .attr('class', CLASS.grid + ' ' + CLASS.gridLines);
      $$.gridLines.append('g').attr('class', CLASS.xgridLines);
      $$.gridLines.append('g').attr('class', CLASS.ygridLines);
      $$.xgridLines = d3.selectAll([]);
  };
  ChartInternal.prototype.updateXGrid = function (withoutUpdate) {
      var $$ = this, config = $$.config, d3 = $$.d3, xgridData = $$.generateGridData(config.grid_x_type, $$.x), tickOffset = $$.isCategorized() ? $$.xAxis.tickOffset() : 0;
      $$.xgridAttr = config.axis_rotated
          ? {
              x1: 0,
              x2: $$.width,
              y1: function (d) {
                  return $$.x(d) - tickOffset;
              },
              y2: function (d) {
                  return $$.x(d) - tickOffset;
              }
          }
          : {
              x1: function (d) {
                  return $$.x(d) + tickOffset;
              },
              x2: function (d) {
                  return $$.x(d) + tickOffset;
              },
              y1: 0,
              y2: $$.height
          };
      $$.xgridAttr.opacity = function () {
          var pos = +d3.select(this).attr(config.axis_rotated ? 'y1' : 'x1');
          return pos === (config.axis_rotated ? $$.height : 0) ? 0 : 1;
      };
      var xgrid = $$.main
          .select('.' + CLASS.xgrids)
          .selectAll('.' + CLASS.xgrid)
          .data(xgridData);
      var xgridEnter = xgrid
          .enter()
          .append('line')
          .attr('class', CLASS.xgrid)
          .attr('x1', $$.xgridAttr.x1)
          .attr('x2', $$.xgridAttr.x2)
          .attr('y1', $$.xgridAttr.y1)
          .attr('y2', $$.xgridAttr.y2)
          .style('opacity', 0);
      $$.xgrid = xgridEnter.merge(xgrid);
      if (!withoutUpdate) {
          $$.xgrid
              .attr('x1', $$.xgridAttr.x1)
              .attr('x2', $$.xgridAttr.x2)
              .attr('y1', $$.xgridAttr.y1)
              .attr('y2', $$.xgridAttr.y2)
              .style('opacity', $$.xgridAttr.opacity);
      }
      xgrid.exit().remove();
  };
  ChartInternal.prototype.updateYGrid = function () {
      var $$ = this, config = $$.config, gridValues = $$.yAxis.tickValues() || $$.y.ticks(config.grid_y_ticks);
      var ygrid = $$.main
          .select('.' + CLASS.ygrids)
          .selectAll('.' + CLASS.ygrid)
          .data(gridValues);
      var ygridEnter = ygrid
          .enter()
          .append('line')
          // TODO: x1, x2, y1, y2, opacity need to be set here maybe
          .attr('class', CLASS.ygrid);
      $$.ygrid = ygridEnter.merge(ygrid);
      $$.ygrid
          .attr('x1', config.axis_rotated ? $$.y : 0)
          .attr('x2', config.axis_rotated ? $$.y : $$.width)
          .attr('y1', config.axis_rotated ? 0 : $$.y)
          .attr('y2', config.axis_rotated ? $$.height : $$.y);
      ygrid.exit().remove();
      $$.smoothLines($$.ygrid, 'grid');
  };
  ChartInternal.prototype.gridTextAnchor = function (d) {
      return d.position ? d.position : 'end';
  };
  ChartInternal.prototype.gridTextDx = function (d) {
      return d.position === 'start' ? 4 : d.position === 'middle' ? 0 : -4;
  };
  ChartInternal.prototype.xGridTextX = function (d) {
      return d.position === 'start'
          ? -this.height
          : d.position === 'middle'
              ? -this.height / 2
              : 0;
  };
  ChartInternal.prototype.yGridTextX = function (d) {
      return d.position === 'start'
          ? 0
          : d.position === 'middle'
              ? this.width / 2
              : this.width;
  };
  ChartInternal.prototype.updateGrid = function (duration) {
      var $$ = this, main = $$.main, config = $$.config, xgridLine, xgridLineEnter, ygridLine, ygridLineEnter, xv = $$.xv.bind($$), yv = $$.yv.bind($$), xGridTextX = $$.xGridTextX.bind($$), yGridTextX = $$.yGridTextX.bind($$);
      // hide if arc type
      $$.grid.style('visibility', $$.hasArcType() ? 'hidden' : 'visible');
      main.select('line.' + CLASS.xgridFocus).style('visibility', 'hidden');
      if (config.grid_x_show) {
          $$.updateXGrid();
      }
      xgridLine = main
          .select('.' + CLASS.xgridLines)
          .selectAll('.' + CLASS.xgridLine)
          .data(config.grid_x_lines);
      // enter
      xgridLineEnter = xgridLine
          .enter()
          .append('g')
          .attr('class', function (d) {
          return CLASS.xgridLine + (d['class'] ? ' ' + d['class'] : '');
      });
      xgridLineEnter
          .append('line')
          .attr('x1', config.axis_rotated ? 0 : xv)
          .attr('x2', config.axis_rotated ? $$.width : xv)
          .attr('y1', config.axis_rotated ? xv : 0)
          .attr('y2', config.axis_rotated ? xv : $$.height)
          .style('opacity', 0);
      xgridLineEnter
          .append('text')
          .attr('text-anchor', $$.gridTextAnchor)
          .attr('transform', config.axis_rotated ? '' : 'rotate(-90)')
          .attr('x', config.axis_rotated ? yGridTextX : xGridTextX)
          .attr('y', xv)
          .attr('dx', $$.gridTextDx)
          .attr('dy', -5)
          .style('opacity', 0);
      // udpate
      $$.xgridLines = xgridLineEnter.merge(xgridLine);
      // done in d3.transition() of the end of this function
      // exit
      xgridLine
          .exit()
          .transition()
          .duration(duration)
          .style('opacity', 0)
          .remove();
      // Y-Grid
      if (config.grid_y_show) {
          $$.updateYGrid();
      }
      ygridLine = main
          .select('.' + CLASS.ygridLines)
          .selectAll('.' + CLASS.ygridLine)
          .data(config.grid_y_lines);
      // enter
      ygridLineEnter = ygridLine
          .enter()
          .append('g')
          .attr('class', function (d) {
          return CLASS.ygridLine + (d['class'] ? ' ' + d['class'] : '');
      });
      ygridLineEnter
          .append('line')
          .attr('x1', config.axis_rotated ? yv : 0)
          .attr('x2', config.axis_rotated ? yv : $$.width)
          .attr('y1', config.axis_rotated ? 0 : yv)
          .attr('y2', config.axis_rotated ? $$.height : yv)
          .style('opacity', 0);
      ygridLineEnter
          .append('text')
          .attr('text-anchor', $$.gridTextAnchor)
          .attr('transform', config.axis_rotated ? 'rotate(-90)' : '')
          .attr('x', config.axis_rotated ? xGridTextX : yGridTextX)
          .attr('y', yv)
          .attr('dx', $$.gridTextDx)
          .attr('dy', -5)
          .style('opacity', 0);
      // update
      $$.ygridLines = ygridLineEnter.merge(ygridLine);
      $$.ygridLines
          .select('line')
          .transition()
          .duration(duration)
          .attr('x1', config.axis_rotated ? yv : 0)
          .attr('x2', config.axis_rotated ? yv : $$.width)
          .attr('y1', config.axis_rotated ? 0 : yv)
          .attr('y2', config.axis_rotated ? $$.height : yv)
          .style('opacity', 1);
      $$.ygridLines
          .select('text')
          .transition()
          .duration(duration)
          .attr('x', config.axis_rotated ? $$.xGridTextX.bind($$) : $$.yGridTextX.bind($$))
          .attr('y', yv)
          .text(function (d) {
          return d.text;
      })
          .style('opacity', 1);
      // exit
      ygridLine
          .exit()
          .transition()
          .duration(duration)
          .style('opacity', 0)
          .remove();
  };
  ChartInternal.prototype.redrawGrid = function (withTransition, transition) {
      var $$ = this, config = $$.config, xv = $$.xv.bind($$), lines = $$.xgridLines.select('line'), texts = $$.xgridLines.select('text');
      return [
          (withTransition ? lines.transition(transition) : lines)
              .attr('x1', config.axis_rotated ? 0 : xv)
              .attr('x2', config.axis_rotated ? $$.width : xv)
              .attr('y1', config.axis_rotated ? xv : 0)
              .attr('y2', config.axis_rotated ? xv : $$.height)
              .style('opacity', 1),
          (withTransition ? texts.transition(transition) : texts)
              .attr('x', config.axis_rotated ? $$.yGridTextX.bind($$) : $$.xGridTextX.bind($$))
              .attr('y', xv)
              .text(function (d) {
              return d.text;
          })
              .style('opacity', 1)
      ];
  };
  ChartInternal.prototype.showXGridFocus = function (selectedData) {
      var $$ = this, config = $$.config, dataToShow = selectedData.filter(function (d) {
          return d && isValue(d.value);
      }), focusEl = $$.main.selectAll('line.' + CLASS.xgridFocus), xx = $$.xx.bind($$);
      if (!config.tooltip_show) {
          return;
      }
      // Hide when stanford plot exists
      if ($$.hasType('stanford') || $$.hasArcType()) {
          return;
      }
      focusEl
          .style('visibility', 'visible')
          .data([dataToShow[0]])
          .attr(config.axis_rotated ? 'y1' : 'x1', xx)
          .attr(config.axis_rotated ? 'y2' : 'x2', xx);
      $$.smoothLines(focusEl, 'grid');
  };
  ChartInternal.prototype.hideXGridFocus = function () {
      this.main.select('line.' + CLASS.xgridFocus).style('visibility', 'hidden');
  };
  ChartInternal.prototype.updateXgridFocus = function () {
      var $$ = this, config = $$.config;
      $$.main
          .select('line.' + CLASS.xgridFocus)
          .attr('x1', config.axis_rotated ? 0 : -10)
          .attr('x2', config.axis_rotated ? $$.width : -10)
          .attr('y1', config.axis_rotated ? -10 : 0)
          .attr('y2', config.axis_rotated ? -10 : $$.height);
  };
  ChartInternal.prototype.generateGridData = function (type, scale) {
      var $$ = this, gridData = [], xDomain, firstYear, lastYear, i, tickNum = $$.main
          .select('.' + CLASS.axisX)
          .selectAll('.tick')
          .size();
      if (type === 'year') {
          xDomain = $$.getXDomain();
          firstYear = xDomain[0].getFullYear();
          lastYear = xDomain[1].getFullYear();
          for (i = firstYear; i <= lastYear; i++) {
              gridData.push(new Date(i + '-01-01 00:00:00'));
          }
      }
      else {
          gridData = scale.ticks(10);
          if (gridData.length > tickNum) {
              // use only int
              gridData = gridData.filter(function (d) {
                  return ('' + d).indexOf('.') < 0;
              });
          }
      }
      return gridData;
  };
  ChartInternal.prototype.getGridFilterToRemove = function (params) {
      return params
          ? function (line) {
              var found = false;
              [].concat(params).forEach(function (param) {
                  if (('value' in param && line.value === param.value) ||
                      ('class' in param && line['class'] === param['class'])) {
                      found = true;
                  }
              });
              return found;
          }
          : function () {
              return true;
          };
  };
  ChartInternal.prototype.removeGridLines = function (params, forX) {
      var $$ = this, config = $$.config, toRemove = $$.getGridFilterToRemove(params), toShow = function (line) {
          return !toRemove(line);
      }, classLines = forX ? CLASS.xgridLines : CLASS.ygridLines, classLine = forX ? CLASS.xgridLine : CLASS.ygridLine;
      $$.main
          .select('.' + classLines)
          .selectAll('.' + classLine)
          .filter(toRemove)
          .transition()
          .duration(config.transition_duration)
          .style('opacity', 0)
          .remove();
      if (forX) {
          config.grid_x_lines = config.grid_x_lines.filter(toShow);
      }
      else {
          config.grid_y_lines = config.grid_y_lines.filter(toShow);
      }
  };

  ChartInternal.prototype.initEventRect = function () {
      var $$ = this, config = $$.config;
      $$.main
          .select('.' + CLASS.chart)
          .append('g')
          .attr('class', CLASS.eventRects)
          .style('fill-opacity', 0);
      $$.eventRect = $$.main
          .select('.' + CLASS.eventRects)
          .append('rect')
          .attr('class', CLASS.eventRect);
      // event rect handle zoom event as well
      if (config.zoom_enabled && $$.zoom) {
          $$.eventRect.call($$.zoom).on('dblclick.zoom', null);
          if (config.zoom_initialRange) {
              // WORKAROUND: Add transition to apply transform immediately when no subchart
              $$.eventRect
                  .transition()
                  .duration(0)
                  .call($$.zoom.transform, $$.zoomTransform(config.zoom_initialRange));
          }
      }
  };
  ChartInternal.prototype.redrawEventRect = function () {
      var $$ = this, d3 = $$.d3, config = $$.config;
      function mouseout() {
          $$.svg.select('.' + CLASS.eventRect).style('cursor', null);
          $$.hideXGridFocus();
          $$.hideTooltip();
          $$.unexpandCircles();
          $$.unexpandBars();
      }
      var isHoveringDataPoint = function (mouse, closest) {
          return closest &&
              ($$.isBarType(closest.id) ||
                  $$.dist(closest, mouse) < config.point_sensitivity);
      };
      var withName = function (d) { return (d ? $$.addName(Object.assign({}, d)) : null); };
      // rects for mouseover
      $$.main
          .select('.' + CLASS.eventRects)
          .style('cursor', config.zoom_enabled
          ? config.axis_rotated
              ? 'ns-resize'
              : 'ew-resize'
          : null);
      $$.eventRect
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', $$.width)
          .attr('height', $$.height)
          .on('mouseout', config.interaction_enabled
          ? function () {
              if (!config) {
                  return;
              } // chart is destroyed
              if ($$.hasArcType()) {
                  return;
              }
              if ($$.mouseover) {
                  config.data_onmouseout.call($$.api, $$.mouseover);
                  $$.mouseover = undefined;
              }
              mouseout();
          }
          : null)
          .on('mousemove', config.interaction_enabled
          ? function () {
              // do nothing when dragging
              if ($$.dragging) {
                  return;
              }
              var targetsToShow = $$.getTargetsToShow();
              // do nothing if arc type
              if ($$.hasArcType(targetsToShow)) {
                  return;
              }
              var mouse = d3.mouse(this);
              var closest = withName($$.findClosestFromTargets(targetsToShow, mouse));
              var isMouseCloseToDataPoint = isHoveringDataPoint(mouse, closest);
              // ensure onmouseout is always called if mousemove switch between 2 targets
              if ($$.mouseover &&
                  (!closest ||
                      closest.id !== $$.mouseover.id ||
                      closest.index !== $$.mouseover.index)) {
                  config.data_onmouseout.call($$.api, $$.mouseover);
                  $$.mouseover = undefined;
              }
              if (closest && !$$.mouseover) {
                  config.data_onmouseover.call($$.api, closest);
                  $$.mouseover = closest;
              }
              // show cursor as pointer if we're hovering a data point close enough
              $$.svg
                  .select('.' + CLASS.eventRect)
                  .style('cursor', isMouseCloseToDataPoint ? 'pointer' : null);
              // if tooltip not grouped, we want to display only data from closest data point
              var showSingleDataPoint = !config.tooltip_grouped || $$.hasType('stanford', targetsToShow);
              // find data to highlight
              var selectedData;
              if (showSingleDataPoint) {
                  if (closest) {
                      selectedData = [closest];
                  }
              }
              else {
                  var closestByX = void 0;
                  if (closest) {
                      // reuse closest value
                      closestByX = closest;
                  }
                  else {
                      // try to find the closest value by X values from the mouse position
                      var mouseX = config.axis_rotated ? mouse[1] : mouse[0];
                      closestByX = $$.findClosestFromTargetsByX(targetsToShow, $$.x.invert(mouseX));
                  }
                  // highlight all data for this 'x' value
                  if (closestByX) {
                      selectedData = $$.filterByX(targetsToShow, closestByX.x);
                  }
              }
              // ensure we have data to show
              if (!selectedData || selectedData.length === 0) {
                  return mouseout();
              }
              // inject names for each point
              selectedData = selectedData.map(withName);
              // show tooltip
              $$.showTooltip(selectedData, this);
              // expand points
              if (config.point_focus_expand_enabled) {
                  $$.unexpandCircles();
                  selectedData.forEach(function (d) {
                      $$.expandCircles(d.index, d.id, false);
                  });
              }
              // expand bars
              $$.unexpandBars();
              selectedData.forEach(function (d) {
                  $$.expandBars(d.index, d.id, false);
              });
              // Show xgrid focus line
              $$.showXGridFocus(selectedData);
          }
          : null)
          .on('click', config.interaction_enabled
          ? function () {
              var targetsToShow = $$.getTargetsToShow();
              if ($$.hasArcType(targetsToShow)) {
                  return;
              }
              var mouse = d3.mouse(this);
              var closest = withName($$.findClosestFromTargets(targetsToShow, mouse));
              if (!isHoveringDataPoint(mouse, closest)) {
                  return;
              }
              // select if selection enabled
              var sameXData;
              if (!config.data_selection_grouped || $$.isStanfordType(closest)) {
                  sameXData = [closest];
              }
              else {
                  sameXData = $$.filterByX(targetsToShow, closest.x);
              }
              // toggle selected state
              sameXData.forEach(function (d) {
                  $$.main
                      .selectAll('.' + CLASS.shapes + $$.getTargetSelectorSuffix(d.id))
                      .selectAll('.' + CLASS.shape + '-' + d.index)
                      .each(function () {
                      if (config.data_selection_grouped ||
                          $$.isWithinShape(this, d)) {
                          $$.toggleShape(this, d, d.index);
                      }
                  });
              });
              // call data_onclick on the closest data point
              if (closest) {
                  var shape = $$.main
                      .selectAll('.' + CLASS.shapes + $$.getTargetSelectorSuffix(closest.id))
                      .select('.' + CLASS.shape + '-' + closest.index);
                  config.data_onclick.call($$.api, closest, shape.node());
              }
          }
          : null)
          .call(config.interaction_enabled && config.data_selection_draggable && $$.drag
          ? d3
              .drag()
              .on('drag', function () {
              $$.drag(d3.mouse(this));
          })
              .on('start', function () {
              $$.dragstart(d3.mouse(this));
          })
              .on('end', function () {
              $$.dragend();
          })
          : function () { });
  };
  ChartInternal.prototype.getMousePosition = function (data) {
      var $$ = this;
      return [$$.x(data.x), $$.getYScale(data.id)(data.value)];
  };
  ChartInternal.prototype.dispatchEvent = function (type, mouse) {
      var $$ = this, selector = '.' + CLASS.eventRect, eventRect = $$.main.select(selector).node(), box = eventRect.getBoundingClientRect(), x = box.left + (mouse ? mouse[0] : 0), y = box.top + (mouse ? mouse[1] : 0), event = document.createEvent('MouseEvents');
      event.initMouseEvent(type, true, true, window, 0, x, y, x, y, false, false, false, false, 0, null);
      eventRect.dispatchEvent(event);
  };

  ChartInternal.prototype.initLegend = function () {
      var $$ = this;
      $$.legendItemTextBox = {};
      $$.legendHasRendered = false;
      $$.legend = $$.svg.append('g').attr('transform', $$.getTranslate('legend'));
      if (!$$.config.legend_show) {
          $$.legend.style('visibility', 'hidden');
          $$.hiddenLegendIds = $$.mapToIds($$.data.targets);
          return;
      }
      // MEMO: call here to update legend box and tranlate for all
      // MEMO: translate will be updated by this, so transform not needed in updateLegend()
      $$.updateLegendWithDefaults();
  };
  ChartInternal.prototype.updateLegendWithDefaults = function () {
      var $$ = this;
      $$.updateLegend($$.mapToIds($$.data.targets), {
          withTransform: false,
          withTransitionForTransform: false,
          withTransition: false
      });
  };
  ChartInternal.prototype.updateSizeForLegend = function (legendHeight, legendWidth) {
      var $$ = this, config = $$.config, insetLegendPosition = {
          top: $$.isLegendTop
              ? $$.getCurrentPaddingTop() + config.legend_inset_y + 5.5
              : $$.currentHeight -
                  legendHeight -
                  $$.getCurrentPaddingBottom() -
                  config.legend_inset_y,
          left: $$.isLegendLeft
              ? $$.getCurrentPaddingLeft() + config.legend_inset_x + 0.5
              : $$.currentWidth -
                  legendWidth -
                  $$.getCurrentPaddingRight() -
                  config.legend_inset_x +
                  0.5
      };
      $$.margin3 = {
          top: $$.isLegendRight
              ? 0
              : $$.isLegendInset
                  ? insetLegendPosition.top
                  : $$.currentHeight - legendHeight,
          right: NaN,
          bottom: 0,
          left: $$.isLegendRight
              ? $$.currentWidth - legendWidth
              : $$.isLegendInset
                  ? insetLegendPosition.left
                  : 0
      };
  };
  ChartInternal.prototype.transformLegend = function (withTransition) {
      var $$ = this;
      (withTransition ? $$.legend.transition() : $$.legend).attr('transform', $$.getTranslate('legend'));
  };
  ChartInternal.prototype.updateLegendStep = function (step) {
      this.legendStep = step;
  };
  ChartInternal.prototype.updateLegendItemWidth = function (w) {
      this.legendItemWidth = w;
  };
  ChartInternal.prototype.updateLegendItemHeight = function (h) {
      this.legendItemHeight = h;
  };
  ChartInternal.prototype.getLegendWidth = function () {
      var $$ = this;
      return $$.config.legend_show
          ? $$.isLegendRight || $$.isLegendInset
              ? $$.legendItemWidth * ($$.legendStep + 1)
              : $$.currentWidth
          : 0;
  };
  ChartInternal.prototype.getLegendHeight = function () {
      var $$ = this, h = 0;
      if ($$.config.legend_show) {
          if ($$.isLegendRight) {
              h = $$.currentHeight;
          }
          else {
              h = Math.max(20, $$.legendItemHeight) * ($$.legendStep + 1);
          }
      }
      return h;
  };
  ChartInternal.prototype.opacityForLegend = function (legendItem) {
      return legendItem.classed(CLASS.legendItemHidden) ? null : 1;
  };
  ChartInternal.prototype.opacityForUnfocusedLegend = function (legendItem) {
      return legendItem.classed(CLASS.legendItemHidden) ? null : 0.3;
  };
  ChartInternal.prototype.toggleFocusLegend = function (targetIds, focus) {
      var $$ = this;
      targetIds = $$.mapToTargetIds(targetIds);
      $$.legend
          .selectAll('.' + CLASS.legendItem)
          .filter(function (id) {
          return targetIds.indexOf(id) >= 0;
      })
          .classed(CLASS.legendItemFocused, focus)
          .transition()
          .duration(100)
          .style('opacity', function () {
          var opacity = focus ? $$.opacityForLegend : $$.opacityForUnfocusedLegend;
          return opacity.call($$, $$.d3.select(this));
      });
  };
  ChartInternal.prototype.revertLegend = function () {
      var $$ = this, d3 = $$.d3;
      $$.legend
          .selectAll('.' + CLASS.legendItem)
          .classed(CLASS.legendItemFocused, false)
          .transition()
          .duration(100)
          .style('opacity', function () {
          return $$.opacityForLegend(d3.select(this));
      });
  };
  ChartInternal.prototype.showLegend = function (targetIds) {
      var $$ = this, config = $$.config;
      if (!config.legend_show) {
          config.legend_show = true;
          $$.legend.style('visibility', 'visible');
          if (!$$.legendHasRendered) {
              $$.updateLegendWithDefaults();
          }
      }
      $$.removeHiddenLegendIds(targetIds);
      $$.legend
          .selectAll($$.selectorLegends(targetIds))
          .style('visibility', 'visible')
          .transition()
          .style('opacity', function () {
          return $$.opacityForLegend($$.d3.select(this));
      });
  };
  ChartInternal.prototype.hideLegend = function (targetIds) {
      var $$ = this, config = $$.config;
      if (config.legend_show && isEmpty(targetIds)) {
          config.legend_show = false;
          $$.legend.style('visibility', 'hidden');
      }
      $$.addHiddenLegendIds(targetIds);
      $$.legend
          .selectAll($$.selectorLegends(targetIds))
          .style('opacity', 0)
          .style('visibility', 'hidden');
  };
  ChartInternal.prototype.clearLegendItemTextBoxCache = function () {
      this.legendItemTextBox = {};
  };
  ChartInternal.prototype.updateLegend = function (targetIds, options, transitions) {
      var $$ = this, config = $$.config;
      var xForLegend, xForLegendText, xForLegendRect, yForLegend, yForLegendText, yForLegendRect, x1ForLegendTile, x2ForLegendTile, yForLegendTile;
      var paddingTop = 4, paddingRight = 10, maxWidth = 0, maxHeight = 0, posMin = 10, tileWidth = config.legend_item_tile_width + 5;
      var l, totalLength = 0, offsets = {}, widths = {}, heights = {}, margins = [0], steps = {}, step = 0;
      var withTransition, withTransitionForTransform;
      var texts, rects, tiles, background;
      // Skip elements when their name is set to null
      targetIds = targetIds.filter(function (id) {
          return !isDefined(config.data_names[id]) || config.data_names[id] !== null;
      });
      options = options || {};
      withTransition = getOption(options, 'withTransition', true);
      withTransitionForTransform = getOption(options, 'withTransitionForTransform', true);
      function getTextBox(textElement, id) {
          if (!$$.legendItemTextBox[id]) {
              $$.legendItemTextBox[id] = $$.getTextRect(textElement.textContent, CLASS.legendItem, textElement);
          }
          return $$.legendItemTextBox[id];
      }
      function updatePositions(textElement, id, index) {
          var reset = index === 0, isLast = index === targetIds.length - 1, box = getTextBox(textElement, id), itemWidth = box.width +
              tileWidth +
              (isLast && !($$.isLegendRight || $$.isLegendInset) ? 0 : paddingRight) +
              config.legend_padding, itemHeight = box.height + paddingTop, itemLength = $$.isLegendRight || $$.isLegendInset ? itemHeight : itemWidth, areaLength = $$.isLegendRight || $$.isLegendInset
              ? $$.getLegendHeight()
              : $$.getLegendWidth(), margin, maxLength;
          // MEMO: care about condifion of step, totalLength
          function updateValues(id, withoutStep) {
              if (!withoutStep) {
                  margin = (areaLength - totalLength - itemLength) / 2;
                  if (margin < posMin) {
                      margin = (areaLength - itemLength) / 2;
                      totalLength = 0;
                      step++;
                  }
              }
              steps[id] = step;
              margins[step] = $$.isLegendInset ? 10 : margin;
              offsets[id] = totalLength;
              totalLength += itemLength;
          }
          if (reset) {
              totalLength = 0;
              step = 0;
              maxWidth = 0;
              maxHeight = 0;
          }
          if (config.legend_show && !$$.isLegendToShow(id)) {
              widths[id] = heights[id] = steps[id] = offsets[id] = 0;
              return;
          }
          widths[id] = itemWidth;
          heights[id] = itemHeight;
          if (!maxWidth || itemWidth >= maxWidth) {
              maxWidth = itemWidth;
          }
          if (!maxHeight || itemHeight >= maxHeight) {
              maxHeight = itemHeight;
          }
          maxLength = $$.isLegendRight || $$.isLegendInset ? maxHeight : maxWidth;
          if (config.legend_equally) {
              Object.keys(widths).forEach(function (id) {
                  widths[id] = maxWidth;
              });
              Object.keys(heights).forEach(function (id) {
                  heights[id] = maxHeight;
              });
              margin = (areaLength - maxLength * targetIds.length) / 2;
              if (margin < posMin) {
                  totalLength = 0;
                  step = 0;
                  targetIds.forEach(function (id) {
                      updateValues(id);
                  });
              }
              else {
                  updateValues(id, true);
              }
          }
          else {
              updateValues(id);
          }
      }
      if ($$.isLegendInset) {
          step = config.legend_inset_step
              ? config.legend_inset_step
              : targetIds.length;
          $$.updateLegendStep(step);
      }
      if ($$.isLegendRight) {
          xForLegend = function (id) {
              return maxWidth * steps[id];
          };
          yForLegend = function (id) {
              return margins[steps[id]] + offsets[id];
          };
      }
      else if ($$.isLegendInset) {
          xForLegend = function (id) {
              return maxWidth * steps[id] + 10;
          };
          yForLegend = function (id) {
              return margins[steps[id]] + offsets[id];
          };
      }
      else {
          xForLegend = function (id) {
              return margins[steps[id]] + offsets[id];
          };
          yForLegend = function (id) {
              return maxHeight * steps[id];
          };
      }
      xForLegendText = function (id, i) {
          return xForLegend(id, i) + 4 + config.legend_item_tile_width;
      };
      yForLegendText = function (id, i) {
          return yForLegend(id, i) + 9;
      };
      xForLegendRect = function (id, i) {
          return xForLegend(id, i);
      };
      yForLegendRect = function (id, i) {
          return yForLegend(id, i) - 5;
      };
      x1ForLegendTile = function (id, i) {
          return xForLegend(id, i) - 2;
      };
      x2ForLegendTile = function (id, i) {
          return xForLegend(id, i) - 2 + config.legend_item_tile_width;
      };
      yForLegendTile = function (id, i) {
          return yForLegend(id, i) + 4;
      };
      // Define g for legend area
      l = $$.legend
          .selectAll('.' + CLASS.legendItem)
          .data(targetIds)
          .enter()
          .append('g')
          .attr('class', function (id) {
          return $$.generateClass(CLASS.legendItem, id);
      })
          .style('visibility', function (id) {
          return $$.isLegendToShow(id) ? 'visible' : 'hidden';
      })
          .style('cursor', function () {
          return config.interaction_enabled ? 'pointer' : 'auto';
      })
          .on('click', config.interaction_enabled
          ? function (id) {
              if (config.legend_item_onclick) {
                  config.legend_item_onclick.call($$, id);
              }
              else {
                  if ($$.d3.event.altKey) {
                      $$.api.hide();
                      $$.api.show(id);
                  }
                  else {
                      $$.api.toggle(id);
                      $$.isTargetToShow(id) ? $$.api.focus(id) : $$.api.revert();
                  }
              }
          }
          : null)
          .on('mouseover', config.interaction_enabled
          ? function (id) {
              if (config.legend_item_onmouseover) {
                  config.legend_item_onmouseover.call($$, id);
              }
              else {
                  $$.d3.select(this).classed(CLASS.legendItemFocused, true);
                  if (!$$.transiting && $$.isTargetToShow(id)) {
                      $$.api.focus(id);
                  }
              }
          }
          : null)
          .on('mouseout', config.interaction_enabled
          ? function (id) {
              if (config.legend_item_onmouseout) {
                  config.legend_item_onmouseout.call($$, id);
              }
              else {
                  $$.d3.select(this).classed(CLASS.legendItemFocused, false);
                  $$.api.revert();
              }
          }
          : null);
      l.append('text')
          .text(function (id) {
          return isDefined(config.data_names[id]) ? config.data_names[id] : id;
      })
          .each(function (id, i) {
          updatePositions(this, id, i);
      })
          .style('pointer-events', 'none')
          .attr('x', $$.isLegendRight || $$.isLegendInset ? xForLegendText : -200)
          .attr('y', $$.isLegendRight || $$.isLegendInset ? -200 : yForLegendText);
      l.append('rect')
          .attr('class', CLASS.legendItemEvent)
          .style('fill-opacity', 0)
          .attr('x', $$.isLegendRight || $$.isLegendInset ? xForLegendRect : -200)
          .attr('y', $$.isLegendRight || $$.isLegendInset ? -200 : yForLegendRect);
      l.append('line')
          .attr('class', CLASS.legendItemTile)
          .style('stroke', $$.color)
          .style('pointer-events', 'none')
          .attr('x1', $$.isLegendRight || $$.isLegendInset ? x1ForLegendTile : -200)
          .attr('y1', $$.isLegendRight || $$.isLegendInset ? -200 : yForLegendTile)
          .attr('x2', $$.isLegendRight || $$.isLegendInset ? x2ForLegendTile : -200)
          .attr('y2', $$.isLegendRight || $$.isLegendInset ? -200 : yForLegendTile)
          .attr('stroke-width', config.legend_item_tile_height);
      // Set background for inset legend
      background = $$.legend.select('.' + CLASS.legendBackground + ' rect');
      if ($$.isLegendInset && maxWidth > 0 && background.size() === 0) {
          background = $$.legend
              .insert('g', '.' + CLASS.legendItem)
              .attr('class', CLASS.legendBackground)
              .append('rect');
      }
      texts = $$.legend
          .selectAll('text')
          .data(targetIds)
          .text(function (id) {
          return isDefined(config.data_names[id]) ? config.data_names[id] : id;
      }) // MEMO: needed for update
          .each(function (id, i) {
          updatePositions(this, id, i);
      });
      (withTransition ? texts.transition() : texts)
          .attr('x', xForLegendText)
          .attr('y', yForLegendText);
      rects = $$.legend.selectAll('rect.' + CLASS.legendItemEvent).data(targetIds);
      (withTransition ? rects.transition() : rects)
          .attr('width', function (id) {
          return widths[id];
      })
          .attr('height', function (id) {
          return heights[id];
      })
          .attr('x', xForLegendRect)
          .attr('y', yForLegendRect);
      tiles = $$.legend.selectAll('line.' + CLASS.legendItemTile).data(targetIds);
      (withTransition ? tiles.transition() : tiles)
          .style('stroke', $$.levelColor
          ? function (id) {
              return $$.levelColor($$.cache[id].values.reduce(function (total, item) {
                  return total + item.value;
              }, 0));
          }
          : $$.color)
          .attr('x1', x1ForLegendTile)
          .attr('y1', yForLegendTile)
          .attr('x2', x2ForLegendTile)
          .attr('y2', yForLegendTile);
      if (background) {
          (withTransition ? background.transition() : background)
              .attr('height', $$.getLegendHeight() - 12)
              .attr('width', maxWidth * (step + 1) + 10);
      }
      // toggle legend state
      $$.legend
          .selectAll('.' + CLASS.legendItem)
          .classed(CLASS.legendItemHidden, function (id) {
          return !$$.isTargetToShow(id);
      });
      // Update all to reflect change of legend
      $$.updateLegendItemWidth(maxWidth);
      $$.updateLegendItemHeight(maxHeight);
      $$.updateLegendStep(step);
      // Update size and scale
      $$.updateSizes();
      $$.updateScales();
      $$.updateSvgSize();
      // Update g positions
      $$.transformAll(withTransitionForTransform, transitions);
      $$.legendHasRendered = true;
  };

  ChartInternal.prototype.initRegion = function () {
      var $$ = this;
      $$.region = $$.main
          .append('g')
          .attr('clip-path', $$.clipPath)
          .attr('class', CLASS.regions);
  };
  ChartInternal.prototype.updateRegion = function (duration) {
      var $$ = this, config = $$.config;
      // hide if arc type
      $$.region.style('visibility', $$.hasArcType() ? 'hidden' : 'visible');
      var mainRegion = $$.main
          .select('.' + CLASS.regions)
          .selectAll('.' + CLASS.region)
          .data(config.regions);
      var g = mainRegion.enter().append('g');
      g.append('rect')
          .attr('x', $$.regionX.bind($$))
          .attr('y', $$.regionY.bind($$))
          .attr('width', $$.regionWidth.bind($$))
          .attr('height', $$.regionHeight.bind($$))
          .style('fill-opacity', function (d) {
          return isValue(d.opacity) ? d.opacity : 0.1;
      });
      g.append('text').text($$.labelRegion.bind($$));
      $$.mainRegion = g.merge(mainRegion).attr('class', $$.classRegion.bind($$));
      mainRegion
          .exit()
          .transition()
          .duration(duration)
          .style('opacity', 0)
          .remove();
  };
  ChartInternal.prototype.redrawRegion = function (withTransition, transition) {
      var $$ = this, regions = $$.mainRegion, regionLabels = $$.mainRegion.selectAll('text');
      return [
          (withTransition ? regions.transition(transition) : regions)
              .attr('x', $$.regionX.bind($$))
              .attr('y', $$.regionY.bind($$))
              .attr('width', $$.regionWidth.bind($$))
              .attr('height', $$.regionHeight.bind($$))
              .style('fill-opacity', function (d) {
              return isValue(d.opacity) ? d.opacity : 0.1;
          }),
          (withTransition ? regionLabels.transition(transition) : regionLabels)
              .attr('x', $$.labelOffsetX.bind($$))
              .attr('y', $$.labelOffsetY.bind($$))
              .attr('transform', $$.labelTransform.bind($$))
              .attr('style', 'text-anchor: left;')
      ];
  };
  ChartInternal.prototype.regionX = function (d) {
      var $$ = this, config = $$.config, xPos, yScale = d.axis === 'y' ? $$.y : $$.y2;
      if (d.axis === 'y' || d.axis === 'y2') {
          xPos = config.axis_rotated ? ('start' in d ? yScale(d.start) : 0) : 0;
      }
      else {
          xPos = config.axis_rotated
              ? 0
              : 'start' in d
                  ? $$.x($$.isTimeSeries() ? $$.parseDate(d.start) : d.start)
                  : 0;
      }
      return xPos;
  };
  ChartInternal.prototype.regionY = function (d) {
      var $$ = this, config = $$.config, yPos, yScale = d.axis === 'y' ? $$.y : $$.y2;
      if (d.axis === 'y' || d.axis === 'y2') {
          yPos = config.axis_rotated ? 0 : 'end' in d ? yScale(d.end) : 0;
      }
      else {
          yPos = config.axis_rotated
              ? 'start' in d
                  ? $$.x($$.isTimeSeries() ? $$.parseDate(d.start) : d.start)
                  : 0
              : 0;
      }
      return yPos;
  };
  ChartInternal.prototype.regionWidth = function (d) {
      var $$ = this, config = $$.config, start = $$.regionX(d), end, yScale = d.axis === 'y' ? $$.y : $$.y2;
      if (d.axis === 'y' || d.axis === 'y2') {
          end = config.axis_rotated
              ? 'end' in d
                  ? yScale(d.end)
                  : $$.width
              : $$.width;
      }
      else {
          end = config.axis_rotated
              ? $$.width
              : 'end' in d
                  ? $$.x($$.isTimeSeries() ? $$.parseDate(d.end) : d.end)
                  : $$.width;
      }
      return end < start ? 0 : end - start;
  };
  ChartInternal.prototype.regionHeight = function (d) {
      var $$ = this, config = $$.config, start = this.regionY(d), end, yScale = d.axis === 'y' ? $$.y : $$.y2;
      if (d.axis === 'y' || d.axis === 'y2') {
          end = config.axis_rotated
              ? $$.height
              : 'start' in d
                  ? yScale(d.start)
                  : $$.height;
      }
      else {
          end = config.axis_rotated
              ? 'end' in d
                  ? $$.x($$.isTimeSeries() ? $$.parseDate(d.end) : d.end)
                  : $$.height
              : $$.height;
      }
      return end < start ? 0 : end - start;
  };
  ChartInternal.prototype.isRegionOnX = function (d) {
      return !d.axis || d.axis === 'x';
  };
  ChartInternal.prototype.labelRegion = function (d) {
      return 'label' in d ? d.label : '';
  };
  ChartInternal.prototype.labelTransform = function (d) {
      return 'vertical' in d && d.vertical ? 'rotate(90)' : '';
  };
  ChartInternal.prototype.labelOffsetX = function (d) {
      var paddingX = 'paddingX' in d ? d.paddingX : 3;
      var paddingY = 'paddingY' in d ? d.paddingY : 3;
      return 'vertical' in d && d.vertical
          ? this.regionY(d) + paddingY
          : this.regionX(d) + paddingX;
  };
  ChartInternal.prototype.labelOffsetY = function (d) {
      var paddingX = 'paddingX' in d ? d.paddingX : 3;
      var paddingY = 'paddingY' in d ? d.paddingY : 3;
      return 'vertical' in d && d.vertical
          ? -(this.regionX(d) + paddingX)
          : this.regionY(d) + 10 + paddingY;
  };

  function c3LogScale(d3, linearScale, logScale) {
      var PROJECTION = [0.01, 10];
      if (!linearScale) {
          linearScale = d3.scaleLinear();
          linearScale.range(PROJECTION);
      }
      if (!logScale) {
          logScale = d3.scaleLog();
          logScale.domain(PROJECTION);
          logScale.nice();
      }
      // copied from https://github.com/compute-io/logspace
      function logspace(a, b, len) {
          var arr, end, tmp, d;
          if (arguments.length < 3) {
              len = 10;
          }
          else {
              if (len === 0) {
                  return [];
              }
          }
          // Calculate the increment:
          end = len - 1;
          d = (b - a) / end;
          // Build the output array...
          arr = new Array(len);
          tmp = a;
          arr[0] = Math.pow(10, tmp);
          for (var i = 1; i < end; i++) {
              tmp += d;
              arr[i] = Math.pow(10, tmp);
          }
          arr[end] = Math.pow(10, b);
          return arr;
      }
      function scale(x) {
          return logScale(linearScale(x));
      }
      scale.domain = function (x) {
          if (!arguments.length) {
              return linearScale.domain();
          }
          linearScale.domain(x);
          return scale;
      };
      scale.range = function (x) {
          if (!arguments.length) {
              return logScale.range();
          }
          logScale.range(x);
          return scale;
      };
      scale.ticks = function (m) {
          return logspace(-2, 1, m || 10).map(function (v) {
              return linearScale.invert(v);
          });
      };
      scale.copy = function () {
          return c3LogScale(d3, linearScale.copy(), logScale.copy());
      };
      return scale;
  }
  ChartInternal.prototype.getScale = function (min, max, forTimeseries) {
      return (forTimeseries ? this.d3.scaleTime() : this.d3.scaleLinear()).range([
          min,
          max
      ]);
  };
  ChartInternal.prototype.getX = function (min, max, domain, offset) {
      var $$ = this, scale = $$.getScale(min, max, $$.isTimeSeries()), _scale = domain ? scale.domain(domain) : scale, key;
      // Define customized scale if categorized axis
      if ($$.isCategorized()) {
          offset =
              offset ||
                  function () {
                      return 0;
                  };
          scale = function (d, raw) {
              var v = _scale(d) + offset(d);
              return raw ? v : Math.ceil(v);
          };
      }
      else {
          scale = function (d, raw) {
              var v = _scale(d);
              return raw ? v : Math.ceil(v);
          };
      }
      // define functions
      for (key in _scale) {
          scale[key] = _scale[key];
      }
      scale.orgDomain = function () {
          return _scale.domain();
      };
      // define custom domain() for categorized axis
      if ($$.isCategorized()) {
          scale.domain = function (domain) {
              if (!arguments.length) {
                  domain = this.orgDomain();
                  return [domain[0], domain[1] + 1];
              }
              _scale.domain(domain);
              return scale;
          };
      }
      return scale;
  };
  /**
   * Creates and configures a D3 scale instance for the given type.
   *
   * By defaults it returns a Linear scale.
   *
   * @param {String} type Type of d3-scale to create. Type can be 'linear', 'time', 'timeseries' or 'log'.
   * @param {Array} domain The scale domain such as [from, to]
   * @param {Array} range The scale's range such as [from, to]
   *
   * @return A d3-scale instance
   */
  ChartInternal.prototype.getY = function (type, domain, range) {
      var scale;
      if (type === 'timeseries' || type === 'time') {
          scale = this.d3.scaleTime();
      }
      else if (type === 'log') {
          scale = c3LogScale(this.d3);
      }
      else if (type === 'linear' || type === undefined) {
          scale = this.d3.scaleLinear();
      }
      else {
          throw new Error("Invalid Y axis type: \"" + type + "\"");
      }
      if (domain) {
          scale.domain(domain);
      }
      if (range) {
          scale.range(range);
      }
      return scale;
  };
  ChartInternal.prototype.getYScale = function (id) {
      return this.axis.getId(id) === 'y2' ? this.y2 : this.y;
  };
  ChartInternal.prototype.getSubYScale = function (id) {
      return this.axis.getId(id) === 'y2' ? this.subY2 : this.subY;
  };
  ChartInternal.prototype.updateScales = function () {
      var $$ = this, config = $$.config, forInit = !$$.x;
      // update edges
      $$.xMin = config.axis_rotated ? 1 : 0;
      $$.xMax = config.axis_rotated ? $$.height : $$.width;
      $$.yMin = config.axis_rotated ? 0 : $$.height;
      $$.yMax = config.axis_rotated ? $$.width : 1;
      $$.subXMin = $$.xMin;
      $$.subXMax = $$.xMax;
      $$.subYMin = config.axis_rotated ? 0 : $$.height2;
      $$.subYMax = config.axis_rotated ? $$.width2 : 1;
      // update scales
      $$.x = $$.getX($$.xMin, $$.xMax, forInit ? undefined : $$.x.orgDomain(), function () {
          return $$.xAxis.tickOffset();
      });
      $$.y = $$.getY(config.axis_y_type, forInit ? config.axis_y_default : $$.y.domain(), [$$.yMin, $$.yMax]);
      $$.y2 = $$.getY(config.axis_y2_type, forInit ? config.axis_y2_default : $$.y2.domain(), [$$.yMin, $$.yMax]);
      $$.subX = $$.getX($$.xMin, $$.xMax, $$.orgXDomain, function (d) {
          return d % 1 ? 0 : $$.subXAxis.tickOffset();
      });
      $$.subY = $$.getY(config.axis_y_type, forInit ? config.axis_y_default : $$.subY.domain(), [$$.subYMin, $$.subYMax]);
      $$.subY2 = $$.getY(config.axis_y2_type, forInit ? config.axis_y2_default : $$.subY2.domain(), [$$.subYMin, $$.subYMax]);
      // update axes
      $$.xAxisTickFormat = $$.axis.getXAxisTickFormat();
      $$.xAxisTickValues = $$.axis.getXAxisTickValues();
      $$.yAxisTickValues = $$.axis.getYAxisTickValues();
      $$.y2AxisTickValues = $$.axis.getY2AxisTickValues();
      $$.xAxis = $$.axis.getXAxis($$.x, $$.xOrient, $$.xAxisTickFormat, $$.xAxisTickValues, config.axis_x_tick_outer);
      $$.subXAxis = $$.axis.getXAxis($$.subX, $$.subXOrient, $$.xAxisTickFormat, $$.xAxisTickValues, config.axis_x_tick_outer);
      $$.yAxis = $$.axis.getYAxis('y', $$.y, $$.yOrient, $$.yAxisTickValues, config.axis_y_tick_outer);
      $$.y2Axis = $$.axis.getYAxis('y2', $$.y2, $$.y2Orient, $$.y2AxisTickValues, config.axis_y2_tick_outer);
      // Set initialized scales to brush and zoom
      if (!forInit) {
          if ($$.brush) {
              $$.brush.updateScale($$.subX);
          }
      }
      // update for arc
      if ($$.updateArc) {
          $$.updateArc();
      }
  };

  ChartInternal.prototype.selectPoint = function (target, d, i) {
      var $$ = this, config = $$.config, cx = (config.axis_rotated ? $$.circleY : $$.circleX).bind($$), cy = (config.axis_rotated ? $$.circleX : $$.circleY).bind($$), r = $$.pointSelectR.bind($$);
      config.data_onselected.call($$.api, d, target.node());
      // add selected-circle on low layer g
      $$.main
          .select('.' + CLASS.selectedCircles + $$.getTargetSelectorSuffix(d.id))
          .selectAll('.' + CLASS.selectedCircle + '-' + i)
          .data([d])
          .enter()
          .append('circle')
          .attr('class', function () {
          return $$.generateClass(CLASS.selectedCircle, i);
      })
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('stroke', function () {
          return $$.color(d);
      })
          .attr('r', function (d) {
          return $$.pointSelectR(d) * 1.4;
      })
          .transition()
          .duration(100)
          .attr('r', r);
  };
  ChartInternal.prototype.unselectPoint = function (target, d, i) {
      var $$ = this;
      $$.config.data_onunselected.call($$.api, d, target.node());
      // remove selected-circle from low layer g
      $$.main
          .select('.' + CLASS.selectedCircles + $$.getTargetSelectorSuffix(d.id))
          .selectAll('.' + CLASS.selectedCircle + '-' + i)
          .transition()
          .duration(100)
          .attr('r', 0)
          .remove();
  };
  ChartInternal.prototype.togglePoint = function (selected, target, d, i) {
      selected ? this.selectPoint(target, d, i) : this.unselectPoint(target, d, i);
  };
  ChartInternal.prototype.selectPath = function (target, d) {
      var $$ = this;
      $$.config.data_onselected.call($$, d, target.node());
      if ($$.config.interaction_brighten) {
          target
              .transition()
              .duration(100)
              .style('fill', function () {
              return $$.d3.rgb($$.color(d)).brighter(0.75);
          });
      }
  };
  ChartInternal.prototype.unselectPath = function (target, d) {
      var $$ = this;
      $$.config.data_onunselected.call($$, d, target.node());
      if ($$.config.interaction_brighten) {
          target
              .transition()
              .duration(100)
              .style('fill', function () {
              return $$.color(d);
          });
      }
  };
  ChartInternal.prototype.togglePath = function (selected, target, d, i) {
      selected ? this.selectPath(target, d, i) : this.unselectPath(target, d, i);
  };
  ChartInternal.prototype.getToggle = function (that, d) {
      var $$ = this, toggle;
      if (that.nodeName === 'circle') {
          if ($$.isStepType(d)) {
              // circle is hidden in step chart, so treat as within the click area
              toggle = function () { }; // TODO: how to select step chart?
          }
          else {
              toggle = $$.togglePoint;
          }
      }
      else if (that.nodeName === 'path') {
          toggle = $$.togglePath;
      }
      return toggle;
  };
  ChartInternal.prototype.toggleShape = function (that, d, i) {
      var $$ = this, d3 = $$.d3, config = $$.config, shape = d3.select(that), isSelected = shape.classed(CLASS.SELECTED), toggle = $$.getToggle(that, d).bind($$);
      if (config.data_selection_enabled && config.data_selection_isselectable(d)) {
          if (!config.data_selection_multiple) {
              $$.main
                  .selectAll('.' +
                  CLASS.shapes +
                  (config.data_selection_grouped
                      ? $$.getTargetSelectorSuffix(d.id)
                      : ''))
                  .selectAll('.' + CLASS.shape)
                  .each(function (d, i) {
                  var shape = d3.select(this);
                  if (shape.classed(CLASS.SELECTED)) {
                      toggle(false, shape.classed(CLASS.SELECTED, false), d, i);
                  }
              });
          }
          shape.classed(CLASS.SELECTED, !isSelected);
          toggle(!isSelected, shape, d, i);
      }
  };

  ChartInternal.prototype.initBar = function () {
      var $$ = this;
      $$.main
          .select('.' + CLASS.chart)
          .append('g')
          .attr('class', CLASS.chartBars);
  };
  ChartInternal.prototype.updateTargetsForBar = function (targets) {
      var $$ = this, config = $$.config, mainBars, mainBarEnter, classChartBar = $$.classChartBar.bind($$), classBars = $$.classBars.bind($$), classFocus = $$.classFocus.bind($$);
      mainBars = $$.main
          .select('.' + CLASS.chartBars)
          .selectAll('.' + CLASS.chartBar)
          .data(targets)
          .attr('class', function (d) {
          return classChartBar(d) + classFocus(d);
      });
      mainBarEnter = mainBars
          .enter()
          .append('g')
          .attr('class', classChartBar)
          .style('pointer-events', 'none');
      // Bars for each data
      mainBarEnter
          .append('g')
          .attr('class', classBars)
          .style('cursor', function (d) {
          return config.data_selection_isselectable(d) ? 'pointer' : null;
      });
  };
  ChartInternal.prototype.updateBar = function (durationForExit) {
      var $$ = this, barData = $$.barData.bind($$), classBar = $$.classBar.bind($$), initialOpacity = $$.initialOpacity.bind($$), color = function (d) {
          return $$.color(d.id);
      };
      var mainBar = $$.main
          .selectAll('.' + CLASS.bars)
          .selectAll('.' + CLASS.bar)
          .data(barData);
      var mainBarEnter = mainBar
          .enter()
          .append('path')
          .attr('class', classBar)
          .style('stroke', color)
          .style('fill', color);
      $$.mainBar = mainBarEnter.merge(mainBar).style('opacity', initialOpacity);
      mainBar
          .exit()
          .transition()
          .duration(durationForExit)
          .style('opacity', 0);
  };
  ChartInternal.prototype.redrawBar = function (drawBar, withTransition, transition) {
      var $$ = this;
      return [
          (withTransition ? this.mainBar.transition(transition) : this.mainBar)
              .attr('d', drawBar)
              .style('stroke', this.color)
              .style('fill', this.color)
              .style('opacity', function (d) { return ($$.isTargetToShow(d.id) ? 1 : 0); })
      ];
  };
  ChartInternal.prototype.getBarW = function (axis, barTargetsNum) {
      var $$ = this, config = $$.config, w = typeof config.bar_width === 'number'
          ? config.bar_width
          : barTargetsNum
              ? (axis.tickInterval() * config.bar_width_ratio) / barTargetsNum
              : 0;
      return config.bar_width_max && w > config.bar_width_max
          ? config.bar_width_max
          : w;
  };
  ChartInternal.prototype.getBars = function (i, id) {
      var $$ = this;
      return (id
          ? $$.main.selectAll('.' + CLASS.bars + $$.getTargetSelectorSuffix(id))
          : $$.main).selectAll('.' + CLASS.bar + (isValue(i) ? '-' + i : ''));
  };
  ChartInternal.prototype.expandBars = function (i, id, reset) {
      var $$ = this;
      if (reset) {
          $$.unexpandBars();
      }
      $$.getBars(i, id).classed(CLASS.EXPANDED, true);
  };
  ChartInternal.prototype.unexpandBars = function (i) {
      var $$ = this;
      $$.getBars(i).classed(CLASS.EXPANDED, false);
  };
  ChartInternal.prototype.generateDrawBar = function (barIndices, isSub) {
      var $$ = this, config = $$.config, getPoints = $$.generateGetBarPoints(barIndices, isSub);
      return function (d, i) {
          // 4 points that make a bar
          var points = getPoints(d, i);
          // switch points if axis is rotated, not applicable for sub chart
          var indexX = config.axis_rotated ? 1 : 0;
          var indexY = config.axis_rotated ? 0 : 1;
          var path = 'M ' +
              points[0][indexX] +
              ',' +
              points[0][indexY] +
              ' ' +
              'L' +
              points[1][indexX] +
              ',' +
              points[1][indexY] +
              ' ' +
              'L' +
              points[2][indexX] +
              ',' +
              points[2][indexY] +
              ' ' +
              'L' +
              points[3][indexX] +
              ',' +
              points[3][indexY] +
              ' ' +
              'z';
          return path;
      };
  };
  ChartInternal.prototype.generateGetBarPoints = function (barIndices, isSub) {
      var $$ = this, axis = isSub ? $$.subXAxis : $$.xAxis, barTargetsNum = barIndices.__max__ + 1, barW = $$.getBarW(axis, barTargetsNum), barX = $$.getShapeX(barW, barTargetsNum, barIndices, !!isSub), barY = $$.getShapeY(!!isSub), barOffset = $$.getShapeOffset($$.isBarType, barIndices, !!isSub), barSpaceOffset = barW * ($$.config.bar_space / 2), yScale = isSub ? $$.getSubYScale : $$.getYScale;
      return function (d, i) {
          var y0 = yScale.call($$, d.id)(0), offset = barOffset(d, i) || y0, // offset is for stacked bar chart
          posX = barX(d), posY = barY(d);
          // fix posY not to overflow opposite quadrant
          if ($$.config.axis_rotated) {
              if ((0 < d.value && posY < y0) || (d.value < 0 && y0 < posY)) {
                  posY = y0;
              }
          }
          posY -= y0 - offset;
          // 4 points that make a bar
          return [
              [posX + barSpaceOffset, offset],
              [posX + barSpaceOffset, posY],
              [posX + barW - barSpaceOffset, posY],
              [posX + barW - barSpaceOffset, offset]
          ];
      };
  };
  /**
   * Returns whether the data point is within the given bar shape.
   *
   * @param mouse
   * @param barShape
   * @return {boolean}
   */
  ChartInternal.prototype.isWithinBar = function (mouse, barShape) {
      return isWithinBox(mouse, getBBox(barShape), 2);
  };

  ChartInternal.prototype.getShapeIndices = function (typeFilter) {
      var $$ = this, config = $$.config, indices = {}, i = 0, j, k;
      $$.filterTargetsToShow($$.data.targets.filter(typeFilter, $$)).forEach(function (d) {
          for (j = 0; j < config.data_groups.length; j++) {
              if (config.data_groups[j].indexOf(d.id) < 0) {
                  continue;
              }
              for (k = 0; k < config.data_groups[j].length; k++) {
                  if (config.data_groups[j][k] in indices) {
                      indices[d.id] = indices[config.data_groups[j][k]];
                      break;
                  }
              }
          }
          if (isUndefined(indices[d.id])) {
              indices[d.id] = i++;
          }
      });
      indices.__max__ = i - 1;
      return indices;
  };
  ChartInternal.prototype.getShapeX = function (offset, targetsNum, indices, isSub) {
      var $$ = this, scale = isSub ? $$.subX : $$.x;
      return function (d) {
          var index = d.id in indices ? indices[d.id] : 0;
          return d.x || d.x === 0 ? scale(d.x) - offset * (targetsNum / 2 - index) : 0;
      };
  };
  ChartInternal.prototype.getShapeY = function (isSub) {
      var $$ = this;
      return function (d) {
          var scale = isSub ? $$.getSubYScale(d.id) : $$.getYScale(d.id);
          return scale($$.isTargetNormalized(d.id) ? $$.getRatio('index', d, true) : d.value);
      };
  };
  ChartInternal.prototype.getShapeOffset = function (typeFilter, indices, isSub) {
      var $$ = this, targets = $$.orderTargets($$.filterTargetsToShow($$.data.targets.filter(typeFilter, $$))), targetIds = targets.map(function (t) {
          return t.id;
      });
      return function (d, i) {
          var scale = isSub ? $$.getSubYScale(d.id) : $$.getYScale(d.id), y0 = scale(0), offset = y0;
          targets.forEach(function (t) {
              var rowValues = $$.isStepType(d)
                  ? $$.convertValuesToStep(t.values)
                  : t.values;
              var isTargetNormalized = $$.isTargetNormalized(d.id);
              var values = rowValues.map(function (v) {
                  return isTargetNormalized ? $$.getRatio('index', v, true) : v.value;
              });
              if (t.id === d.id || indices[t.id] !== indices[d.id]) {
                  return;
              }
              if (targetIds.indexOf(t.id) < targetIds.indexOf(d.id)) {
                  // check if the x values line up
                  if (isUndefined(rowValues[i]) || +rowValues[i].x !== +d.x) {
                      // "+" for timeseries
                      // if not, try to find the value that does line up
                      i = -1;
                      rowValues.forEach(function (v, j) {
                          var x1 = v.x.constructor === Date ? +v.x : v.x;
                          var x2 = d.x.constructor === Date ? +d.x : d.x;
                          if (x1 === x2) {
                              i = j;
                          }
                      });
                  }
                  if (i in rowValues && rowValues[i].value * d.value >= 0) {
                      offset += scale(values[i]) - y0;
                  }
              }
          });
          return offset;
      };
  };
  ChartInternal.prototype.isWithinShape = function (that, d) {
      var $$ = this, shape = $$.d3.select(that), isWithin;
      if (!$$.isTargetToShow(d.id)) {
          isWithin = false;
      }
      else if (that.nodeName === 'circle') {
          isWithin = $$.isStepType(d)
              ? $$.isWithinStep(that, $$.getYScale(d.id)(d.value))
              : $$.isWithinCircle(that, $$.pointSelectR(d) * 1.5);
      }
      else if (that.nodeName === 'path') {
          isWithin = shape.classed(CLASS.bar)
              ? $$.isWithinBar($$.d3.mouse(that), that)
              : true;
      }
      return isWithin;
  };
  ChartInternal.prototype.getInterpolate = function (d) {
      var $$ = this, d3 = $$.d3, types = {
          linear: d3.curveLinear,
          'linear-closed': d3.curveLinearClosed,
          basis: d3.curveBasis,
          'basis-open': d3.curveBasisOpen,
          'basis-closed': d3.curveBasisClosed,
          bundle: d3.curveBundle,
          cardinal: d3.curveCardinal,
          'cardinal-open': d3.curveCardinalOpen,
          'cardinal-closed': d3.curveCardinalClosed,
          monotone: d3.curveMonotoneX,
          step: d3.curveStep,
          'step-before': d3.curveStepBefore,
          'step-after': d3.curveStepAfter
      }, type;
      if ($$.isSplineType(d)) {
          type = types[$$.config.spline_interpolation_type] || types.cardinal;
      }
      else if ($$.isStepType(d)) {
          type = types[$$.config.line_step_type];
      }
      else {
          type = types.linear;
      }
      return type;
  };

  ChartInternal.prototype.initLine = function () {
      var $$ = this;
      $$.main
          .select('.' + CLASS.chart)
          .append('g')
          .attr('class', CLASS.chartLines);
  };
  ChartInternal.prototype.updateTargetsForLine = function (targets) {
      var $$ = this, config = $$.config, mainLines, mainLineEnter, classChartLine = $$.classChartLine.bind($$), classLines = $$.classLines.bind($$), classAreas = $$.classAreas.bind($$), classCircles = $$.classCircles.bind($$), classFocus = $$.classFocus.bind($$);
      mainLines = $$.main
          .select('.' + CLASS.chartLines)
          .selectAll('.' + CLASS.chartLine)
          .data(targets)
          .attr('class', function (d) {
          return classChartLine(d) + classFocus(d);
      });
      mainLineEnter = mainLines
          .enter()
          .append('g')
          .attr('class', classChartLine)
          .style('opacity', 0)
          .style('pointer-events', 'none');
      // Lines for each data
      mainLineEnter.append('g').attr('class', classLines);
      // Areas
      mainLineEnter.append('g').attr('class', classAreas);
      // Circles for each data point on lines
      mainLineEnter.append('g').attr('class', function (d) {
          return $$.generateClass(CLASS.selectedCircles, d.id);
      });
      mainLineEnter
          .append('g')
          .attr('class', classCircles)
          .style('cursor', function (d) {
          return config.data_selection_isselectable(d) ? 'pointer' : null;
      });
      // Update date for selected circles
      targets.forEach(function (t) {
          $$.main
              .selectAll('.' + CLASS.selectedCircles + $$.getTargetSelectorSuffix(t.id))
              .selectAll('.' + CLASS.selectedCircle)
              .each(function (d) {
              d.value = t.values[d.index].value;
          });
      });
      // MEMO: can not keep same color...
      //mainLineUpdate.exit().remove();
  };
  ChartInternal.prototype.updateLine = function (durationForExit) {
      var $$ = this;
      var mainLine = $$.main
          .selectAll('.' + CLASS.lines)
          .selectAll('.' + CLASS.line)
          .data($$.lineData.bind($$));
      var mainLineEnter = mainLine
          .enter()
          .append('path')
          .attr('class', $$.classLine.bind($$))
          .style('stroke', $$.color);
      $$.mainLine = mainLineEnter
          .merge(mainLine)
          .style('opacity', $$.initialOpacity.bind($$))
          .style('shape-rendering', function (d) {
          return $$.isStepType(d) ? 'crispEdges' : '';
      })
          .attr('transform', null);
      mainLine
          .exit()
          .transition()
          .duration(durationForExit)
          .style('opacity', 0);
  };
  ChartInternal.prototype.redrawLine = function (drawLine, withTransition, transition) {
      return [
          (withTransition ? this.mainLine.transition(transition) : this.mainLine)
              .attr('d', drawLine)
              .style('stroke', this.color)
              .style('opacity', 1)
      ];
  };
  ChartInternal.prototype.generateDrawLine = function (lineIndices, isSub) {
      var $$ = this, config = $$.config, line = $$.d3.line(), getPoints = $$.generateGetLinePoints(lineIndices, isSub), yScaleGetter = isSub ? $$.getSubYScale : $$.getYScale, xValue = function (d) {
          return (isSub ? $$.subxx : $$.xx).call($$, d);
      }, yValue = function (d, i) {
          return config.data_groups.length > 0
              ? getPoints(d, i)[0][1]
              : yScaleGetter.call($$, d.id)(d.value);
      };
      line = config.axis_rotated
          ? line.x(yValue).y(xValue)
          : line.x(xValue).y(yValue);
      if (!config.line_connectNull) {
          line = line.defined(function (d) {
              return d.value != null;
          });
      }
      return function (d) {
          var values = config.line_connectNull
              ? $$.filterRemoveNull(d.values)
              : d.values, x = isSub ? $$.subX : $$.x, y = yScaleGetter.call($$, d.id), x0 = 0, y0 = 0, path;
          if ($$.isLineType(d)) {
              if (config.data_regions[d.id]) {
                  path = $$.lineWithRegions(values, x, y, config.data_regions[d.id]);
              }
              else {
                  if ($$.isStepType(d)) {
                      values = $$.convertValuesToStep(values);
                  }
                  path = line.curve($$.getInterpolate(d))(values);
              }
          }
          else {
              if (values[0]) {
                  x0 = x(values[0].x);
                  y0 = y(values[0].value);
              }
              path = config.axis_rotated ? 'M ' + y0 + ' ' + x0 : 'M ' + x0 + ' ' + y0;
          }
          return path ? path : 'M 0 0';
      };
  };
  ChartInternal.prototype.generateGetLinePoints = function (lineIndices, isSub) {
      // partial duplication of generateGetBarPoints
      var $$ = this, config = $$.config, lineTargetsNum = lineIndices.__max__ + 1, x = $$.getShapeX(0, lineTargetsNum, lineIndices, !!isSub), y = $$.getShapeY(!!isSub), lineOffset = $$.getShapeOffset($$.isLineType, lineIndices, !!isSub), yScale = isSub ? $$.getSubYScale : $$.getYScale;
      return function (d, i) {
          var y0 = yScale.call($$, d.id)(0), offset = lineOffset(d, i) || y0, // offset is for stacked area chart
          posX = x(d), posY = y(d);
          // fix posY not to overflow opposite quadrant
          if (config.axis_rotated) {
              if ((0 < d.value && posY < y0) || (d.value < 0 && y0 < posY)) {
                  posY = y0;
              }
          }
          // 1 point that marks the line position
          return [
              [posX, posY - (y0 - offset)],
              [posX, posY - (y0 - offset)],
              [posX, posY - (y0 - offset)],
              [posX, posY - (y0 - offset)] // needed for compatibility
          ];
      };
  };
  ChartInternal.prototype.lineWithRegions = function (d, x, y, _regions) {
      var $$ = this, config = $$.config, prev = -1, i, j, s = 'M', sWithRegion, xp, yp, dx, dy, dd, diff, diffx2, xOffset = $$.isCategorized() ? 0.5 : 0, xValue, yValue, regions = [];
      function isWithinRegions(x, regions) {
          var i;
          for (i = 0; i < regions.length; i++) {
              if (regions[i].start < x && x <= regions[i].end) {
                  return true;
              }
          }
          return false;
      }
      // Check start/end of regions
      if (isDefined(_regions)) {
          for (i = 0; i < _regions.length; i++) {
              regions[i] = {};
              if (isUndefined(_regions[i].start)) {
                  regions[i].start = d[0].x;
              }
              else {
                  regions[i].start = $$.isTimeSeries()
                      ? $$.parseDate(_regions[i].start)
                      : _regions[i].start;
              }
              if (isUndefined(_regions[i].end)) {
                  regions[i].end = d[d.length - 1].x;
              }
              else {
                  regions[i].end = $$.isTimeSeries()
                      ? $$.parseDate(_regions[i].end)
                      : _regions[i].end;
              }
          }
      }
      // Set scales
      xValue = config.axis_rotated
          ? function (d) {
              return y(d.value);
          }
          : function (d) {
              return x(d.x);
          };
      yValue = config.axis_rotated
          ? function (d) {
              return x(d.x);
          }
          : function (d) {
              return y(d.value);
          };
      // Define svg generator function for region
      function generateM(points) {
          return ('M' +
              points[0][0] +
              ' ' +
              points[0][1] +
              ' ' +
              points[1][0] +
              ' ' +
              points[1][1]);
      }
      if ($$.isTimeSeries()) {
          sWithRegion = function (d0, d1, j, diff) {
              var x0 = d0.x.getTime(), x_diff = d1.x - d0.x, xv0 = new Date(x0 + x_diff * j), xv1 = new Date(x0 + x_diff * (j + diff)), points;
              if (config.axis_rotated) {
                  points = [
                      [y(yp(j)), x(xv0)],
                      [y(yp(j + diff)), x(xv1)]
                  ];
              }
              else {
                  points = [
                      [x(xv0), y(yp(j))],
                      [x(xv1), y(yp(j + diff))]
                  ];
              }
              return generateM(points);
          };
      }
      else {
          sWithRegion = function (d0, d1, j, diff) {
              var points;
              if (config.axis_rotated) {
                  points = [
                      [y(yp(j), true), x(xp(j))],
                      [y(yp(j + diff), true), x(xp(j + diff))]
                  ];
              }
              else {
                  points = [
                      [x(xp(j), true), y(yp(j))],
                      [x(xp(j + diff), true), y(yp(j + diff))]
                  ];
              }
              return generateM(points);
          };
      }
      // Generate
      for (i = 0; i < d.length; i++) {
          // Draw as normal
          if (isUndefined(regions) || !isWithinRegions(d[i].x, regions)) {
              s += ' ' + xValue(d[i]) + ' ' + yValue(d[i]);
          }
          // Draw with region // TODO: Fix for horizotal charts
          else {
              xp = $$.getScale(d[i - 1].x + xOffset, d[i].x + xOffset, $$.isTimeSeries());
              yp = $$.getScale(d[i - 1].value, d[i].value);
              dx = x(d[i].x) - x(d[i - 1].x);
              dy = y(d[i].value) - y(d[i - 1].value);
              dd = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
              diff = 2 / dd;
              diffx2 = diff * 2;
              for (j = diff; j <= 1; j += diffx2) {
                  s += sWithRegion(d[i - 1], d[i], j, diff);
              }
          }
          prev = d[i].x;
      }
      return s;
  };
  ChartInternal.prototype.updateArea = function (durationForExit) {
      var $$ = this, d3 = $$.d3;
      var mainArea = $$.main
          .selectAll('.' + CLASS.areas)
          .selectAll('.' + CLASS.area)
          .data($$.lineData.bind($$));
      var mainAreaEnter = mainArea
          .enter()
          .append('path')
          .attr('class', $$.classArea.bind($$))
          .style('fill', $$.color)
          .style('opacity', function () {
          $$.orgAreaOpacity = +d3.select(this).style('opacity');
          return 0;
      });
      $$.mainArea = mainAreaEnter
          .merge(mainArea)
          .style('opacity', $$.orgAreaOpacity);
      mainArea
          .exit()
          .transition()
          .duration(durationForExit)
          .style('opacity', 0);
  };
  ChartInternal.prototype.redrawArea = function (drawArea, withTransition, transition) {
      return [
          (withTransition ? this.mainArea.transition(transition) : this.mainArea)
              .attr('d', drawArea)
              .style('fill', this.color)
              .style('opacity', this.orgAreaOpacity)
      ];
  };
  ChartInternal.prototype.generateDrawArea = function (areaIndices, isSub) {
      var $$ = this, config = $$.config, area = $$.d3.area(), getPoints = $$.generateGetAreaPoints(areaIndices, isSub), yScaleGetter = isSub ? $$.getSubYScale : $$.getYScale, xValue = function (d) {
          return (isSub ? $$.subxx : $$.xx).call($$, d);
      }, value0 = function (d, i) {
          return config.data_groups.length > 0
              ? getPoints(d, i)[0][1]
              : yScaleGetter.call($$, d.id)($$.getAreaBaseValue(d.id));
      }, value1 = function (d, i) {
          return config.data_groups.length > 0
              ? getPoints(d, i)[1][1]
              : yScaleGetter.call($$, d.id)(d.value);
      };
      area = config.axis_rotated
          ? area
              .x0(value0)
              .x1(value1)
              .y(xValue)
          : area
              .x(xValue)
              .y0(config.area_above ? 0 : value0)
              .y1(value1);
      if (!config.line_connectNull) {
          area = area.defined(function (d) {
              return d.value !== null;
          });
      }
      return function (d) {
          var values = config.line_connectNull
              ? $$.filterRemoveNull(d.values)
              : d.values, x0 = 0, y0 = 0, path;
          if ($$.isAreaType(d)) {
              if ($$.isStepType(d)) {
                  values = $$.convertValuesToStep(values);
              }
              path = area.curve($$.getInterpolate(d))(values);
          }
          else {
              if (values[0]) {
                  x0 = $$.x(values[0].x);
                  y0 = $$.getYScale(d.id)(values[0].value);
              }
              path = config.axis_rotated ? 'M ' + y0 + ' ' + x0 : 'M ' + x0 + ' ' + y0;
          }
          return path ? path : 'M 0 0';
      };
  };
  ChartInternal.prototype.getAreaBaseValue = function () {
      return 0;
  };
  ChartInternal.prototype.generateGetAreaPoints = function (areaIndices, isSub) {
      // partial duplication of generateGetBarPoints
      var $$ = this, config = $$.config, areaTargetsNum = areaIndices.__max__ + 1, x = $$.getShapeX(0, areaTargetsNum, areaIndices, !!isSub), y = $$.getShapeY(!!isSub), areaOffset = $$.getShapeOffset($$.isAreaType, areaIndices, !!isSub), yScale = isSub ? $$.getSubYScale : $$.getYScale;
      return function (d, i) {
          var y0 = yScale.call($$, d.id)(0), offset = areaOffset(d, i) || y0, // offset is for stacked area chart
          posX = x(d), posY = y(d);
          // fix posY not to overflow opposite quadrant
          if (config.axis_rotated) {
              if ((0 < d.value && posY < y0) || (d.value < 0 && y0 < posY)) {
                  posY = y0;
              }
          }
          // 1 point that marks the area position
          return [
              [posX, offset],
              [posX, posY - (y0 - offset)],
              [posX, posY - (y0 - offset)],
              [posX, offset] // needed for compatibility
          ];
      };
  };
  ChartInternal.prototype.updateCircle = function (cx, cy) {
      var $$ = this;
      var mainCircle = $$.main
          .selectAll('.' + CLASS.circles)
          .selectAll('.' + CLASS.circle)
          .data($$.lineOrScatterOrStanfordData.bind($$));
      var mainCircleEnter = mainCircle
          .enter()
          .append('circle')
          .attr('shape-rendering', $$.isStanfordGraphType() ? 'crispEdges' : '')
          .attr('class', $$.classCircle.bind($$))
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', $$.pointR.bind($$))
          .style('color', $$.isStanfordGraphType() ? $$.getStanfordPointColor.bind($$) : $$.color);
      $$.mainCircle = mainCircleEnter
          .merge(mainCircle)
          .style('opacity', $$.isStanfordGraphType() ? 1 : $$.initialOpacityForCircle.bind($$));
      mainCircle.exit().style('opacity', 0);
  };
  ChartInternal.prototype.redrawCircle = function (cx, cy, withTransition, transition) {
      var $$ = this, selectedCircles = $$.main.selectAll('.' + CLASS.selectedCircle);
      return [
          (withTransition ? $$.mainCircle.transition(transition) : $$.mainCircle)
              .style('opacity', this.opacityForCircle.bind($$))
              .style('color', $$.isStanfordGraphType() ? $$.getStanfordPointColor.bind($$) : $$.color)
              .attr('cx', cx)
              .attr('cy', cy),
          (withTransition ? selectedCircles.transition(transition) : selectedCircles)
              .attr('cx', cx)
              .attr('cy', cy)
      ];
  };
  ChartInternal.prototype.circleX = function (d) {
      return d.x || d.x === 0 ? this.x(d.x) : null;
  };
  ChartInternal.prototype.updateCircleY = function () {
      var $$ = this, lineIndices, getPoints;
      if ($$.config.data_groups.length > 0) {
          (lineIndices = $$.getShapeIndices($$.isLineType)),
              (getPoints = $$.generateGetLinePoints(lineIndices));
          $$.circleY = function (d, i) {
              return getPoints(d, i)[0][1];
          };
      }
      else {
          $$.circleY = function (d) {
              return $$.getYScale(d.id)(d.value);
          };
      }
  };
  ChartInternal.prototype.getCircles = function (i, id) {
      var $$ = this;
      return (id
          ? $$.main.selectAll('.' + CLASS.circles + $$.getTargetSelectorSuffix(id))
          : $$.main).selectAll('.' + CLASS.circle + (isValue(i) ? '-' + i : ''));
  };
  ChartInternal.prototype.expandCircles = function (i, id, reset) {
      var $$ = this, r = $$.pointExpandedR.bind($$);
      if (reset) {
          $$.unexpandCircles();
      }
      $$.getCircles(i, id)
          .classed(CLASS.EXPANDED, true)
          .attr('r', r);
  };
  ChartInternal.prototype.unexpandCircles = function (i) {
      var $$ = this, r = $$.pointR.bind($$);
      $$.getCircles(i)
          .filter(function () {
          return $$.d3.select(this).classed(CLASS.EXPANDED);
      })
          .classed(CLASS.EXPANDED, false)
          .attr('r', r);
  };
  ChartInternal.prototype.pointR = function (d) {
      var $$ = this, config = $$.config;
      return $$.isStepType(d)
          ? 0
          : isFunction(config.point_r)
              ? config.point_r(d)
              : config.point_r;
  };
  ChartInternal.prototype.pointExpandedR = function (d) {
      var $$ = this, config = $$.config;
      if (config.point_focus_expand_enabled) {
          return isFunction(config.point_focus_expand_r)
              ? config.point_focus_expand_r(d)
              : config.point_focus_expand_r
                  ? config.point_focus_expand_r
                  : $$.pointR(d) * 1.75;
      }
      else {
          return $$.pointR(d);
      }
  };
  ChartInternal.prototype.pointSelectR = function (d) {
      var $$ = this, config = $$.config;
      return isFunction(config.point_select_r)
          ? config.point_select_r(d)
          : config.point_select_r
              ? config.point_select_r
              : $$.pointR(d) * 4;
  };
  ChartInternal.prototype.isWithinCircle = function (that, r) {
      var d3 = this.d3, mouse = d3.mouse(that), d3_this = d3.select(that), cx = +d3_this.attr('cx'), cy = +d3_this.attr('cy');
      return Math.sqrt(Math.pow(cx - mouse[0], 2) + Math.pow(cy - mouse[1], 2)) < r;
  };
  ChartInternal.prototype.isWithinStep = function (that, y) {
      return Math.abs(y - this.d3.mouse(that)[1]) < 30;
  };

  ChartInternal.prototype.getCurrentWidth = function () {
      var $$ = this, config = $$.config;
      return config.size_width ? config.size_width : $$.getParentWidth();
  };
  ChartInternal.prototype.getCurrentHeight = function () {
      var $$ = this, config = $$.config, h = config.size_height ? config.size_height : $$.getParentHeight();
      return h > 0
          ? h
          : 320 / ($$.hasType('gauge') && !config.gauge_fullCircle ? 2 : 1);
  };
  ChartInternal.prototype.getCurrentPaddingTop = function () {
      var $$ = this, config = $$.config, padding = isValue(config.padding_top) ? config.padding_top : 0;
      if ($$.title && $$.title.node()) {
          padding += $$.getTitlePadding();
      }
      return padding;
  };
  ChartInternal.prototype.getCurrentPaddingBottom = function () {
      var config = this.config;
      return isValue(config.padding_bottom) ? config.padding_bottom : 0;
  };
  ChartInternal.prototype.getCurrentPaddingLeft = function (withoutRecompute) {
      var $$ = this, config = $$.config;
      if (isValue(config.padding_left)) {
          return config.padding_left;
      }
      else if (config.axis_rotated) {
          return !config.axis_x_show || config.axis_x_inner
              ? 1
              : Math.max(ceil10($$.getAxisWidthByAxisId('x', withoutRecompute)), 40);
      }
      else if (!config.axis_y_show || config.axis_y_inner) {
          // && !config.axis_rotated
          return $$.axis.getYAxisLabelPosition().isOuter ? 30 : 1;
      }
      else {
          return ceil10($$.getAxisWidthByAxisId('y', withoutRecompute));
      }
  };
  ChartInternal.prototype.getCurrentPaddingRight = function () {
      var $$ = this, config = $$.config, padding = 0, defaultPadding = 10, legendWidthOnRight = $$.isLegendRight ? $$.getLegendWidth() + 20 : 0;
      if (isValue(config.padding_right)) {
          padding = config.padding_right + 1; // 1 is needed not to hide tick line
      }
      else if (config.axis_rotated) {
          padding = defaultPadding + legendWidthOnRight;
      }
      else if (!config.axis_y2_show || config.axis_y2_inner) {
          // && !config.axis_rotated
          padding =
              2 +
                  legendWidthOnRight +
                  ($$.axis.getY2AxisLabelPosition().isOuter ? 20 : 0);
      }
      else {
          padding = ceil10($$.getAxisWidthByAxisId('y2')) + legendWidthOnRight;
      }
      if ($$.colorScale && $$.colorScale.node()) {
          padding += $$.getColorScalePadding();
      }
      return padding;
  };
  ChartInternal.prototype.getParentRectValue = function (key) {
      var parent = this.selectChart.node(), v;
      while (parent && parent.tagName !== 'BODY') {
          try {
              v = parent.getBoundingClientRect()[key];
          }
          catch (e) {
              if (key === 'width') {
                  // In IE in certain cases getBoundingClientRect
                  // will cause an "unspecified error"
                  v = parent.offsetWidth;
              }
          }
          if (v) {
              break;
          }
          parent = parent.parentNode;
      }
      return v;
  };
  ChartInternal.prototype.getParentWidth = function () {
      return this.getParentRectValue('width');
  };
  ChartInternal.prototype.getParentHeight = function () {
      var h = this.selectChart.style('height');
      return h.indexOf('px') > 0 ? +h.replace('px', '') : 0;
  };
  ChartInternal.prototype.getSvgLeft = function (withoutRecompute) {
      var $$ = this, config = $$.config, hasLeftAxisRect = config.axis_rotated || (!config.axis_rotated && !config.axis_y_inner), leftAxisClass = config.axis_rotated ? CLASS.axisX : CLASS.axisY, leftAxis = $$.main.select('.' + leftAxisClass).node(), svgRect = leftAxis && hasLeftAxisRect
          ? leftAxis.getBoundingClientRect()
          : { right: 0 }, chartRect = $$.selectChart.node().getBoundingClientRect(), hasArc = $$.hasArcType(), svgLeft = svgRect.right -
          chartRect.left -
          (hasArc ? 0 : $$.getCurrentPaddingLeft(withoutRecompute));
      return svgLeft > 0 ? svgLeft : 0;
  };
  ChartInternal.prototype.getAxisWidthByAxisId = function (id, withoutRecompute) {
      var $$ = this, position = $$.axis.getLabelPositionById(id);
      return ($$.axis.getMaxTickWidth(id, withoutRecompute) + (position.isInner ? 20 : 40));
  };
  ChartInternal.prototype.getHorizontalAxisHeight = function (axisId, isSubchart) {
      var $$ = this, config = $$.config, h = 30;
      if (axisId === 'x' && !(isDefined(isSubchart) && isSubchart ? config.subchart_axis_x_show : config.axis_x_show)) {
          return 8;
      }
      if (axisId === 'x' && config.axis_x_height) {
          return config.axis_x_height;
      }
      if (axisId === 'y' && !config.axis_y_show) {
          return config.legend_show && !$$.isLegendRight && !$$.isLegendInset ? 10 : 1;
      }
      if (axisId === 'y2' && !config.axis_y2_show) {
          return $$.rotated_padding_top;
      }
      // Calculate x axis height when tick rotated
      if (axisId === 'x' && !config.axis_rotated && config.axis_x_tick_rotate) {
          h =
              30 +
                  $$.axis.getMaxTickWidth(axisId) *
                      Math.cos((Math.PI * (90 - Math.abs(config.axis_x_tick_rotate))) / 180);
      }
      // Calculate y axis height when tick rotated
      if (axisId === 'y' && config.axis_rotated && config.axis_y_tick_rotate) {
          h =
              30 +
                  $$.axis.getMaxTickWidth(axisId) *
                      Math.cos((Math.PI * (90 - Math.abs(config.axis_y_tick_rotate))) / 180);
      }
      return (h +
          ($$.axis.getLabelPositionById(axisId).isInner ? 0 : 10) +
          (axisId === 'y2' ? -10 : 0));
  };

  ChartInternal.prototype.initBrush = function (scale) {
      var $$ = this, d3 = $$.d3;
      // TODO: dynamically change brushY/brushX according to axis_rotated.
      $$.brush = ($$.config.axis_rotated ? d3.brushY() : d3.brushX())
          .on('brush', function () {
          var event = d3.event.sourceEvent;
          if (event && event.type === 'zoom') {
              return;
          }
          $$.redrawForBrush();
      })
          .on('end', function () {
          var event = d3.event.sourceEvent;
          if (event && event.type === 'zoom') {
              return;
          }
          if ($$.brush.empty() && event && event.type !== 'end') {
              $$.brush.clear();
          }
      });
      $$.brush.updateExtent = function () {
          var range = this.scale.range(), extent;
          if ($$.config.axis_rotated) {
              extent = [
                  [0, range[0]],
                  [$$.width2, range[1]]
              ];
          }
          else {
              extent = [
                  [range[0], 0],
                  [range[1], $$.height2]
              ];
          }
          this.extent(extent);
          return this;
      };
      $$.brush.updateScale = function (scale) {
          this.scale = scale;
          return this;
      };
      $$.brush.update = function (scale) {
          this.updateScale(scale || $$.subX).updateExtent();
          $$.context.select('.' + CLASS.brush).call(this);
      };
      $$.brush.clear = function () {
          $$.context.select('.' + CLASS.brush).call($$.brush.move, null);
      };
      $$.brush.selection = function () {
          return d3.brushSelection($$.context.select('.' + CLASS.brush).node());
      };
      $$.brush.selectionAsValue = function (selectionAsValue, withTransition) {
          var selection, brush;
          if (selectionAsValue) {
              if ($$.context) {
                  selection = [
                      this.scale(selectionAsValue[0]),
                      this.scale(selectionAsValue[1])
                  ];
                  brush = $$.context.select('.' + CLASS.brush);
                  if (withTransition) {
                      brush = brush.transition();
                  }
                  $$.brush.move(brush, selection);
              }
              return [];
          }
          selection = $$.brush.selection() || [0, 0];
          return [this.scale.invert(selection[0]), this.scale.invert(selection[1])];
      };
      $$.brush.empty = function () {
          var selection = $$.brush.selection();
          return !selection || selection[0] === selection[1];
      };
      return $$.brush.updateScale(scale);
  };
  ChartInternal.prototype.initSubchart = function () {
      var $$ = this, config = $$.config, context = ($$.context = $$.svg
          .append('g')
          .attr('transform', $$.getTranslate('context')));
      // set style
      context.style('visibility', 'visible');
      // Define g for chart area
      context
          .append('g')
          .attr('clip-path', $$.clipPathForSubchart)
          .attr('class', CLASS.chart);
      // Define g for bar chart area
      context
          .select('.' + CLASS.chart)
          .append('g')
          .attr('class', CLASS.chartBars);
      // Define g for line chart area
      context
          .select('.' + CLASS.chart)
          .append('g')
          .attr('class', CLASS.chartLines);
      // Add extent rect for Brush
      context
          .append('g')
          .attr('clip-path', $$.clipPath)
          .attr('class', CLASS.brush);
      // ATTENTION: This must be called AFTER chart added
      // Add Axis
      $$.axes.subx = context
          .append('g')
          .attr('class', CLASS.axisX)
          .attr('transform', $$.getTranslate('subx'))
          .attr('clip-path', config.axis_rotated ? '' : $$.clipPathForXAxis)
          .style('visibility', config.subchart_axis_x_show ? 'visible' : 'hidden');
  };
  ChartInternal.prototype.initSubchartBrush = function () {
      var $$ = this;
      // Add extent rect for Brush
      $$.initBrush($$.subX).updateExtent();
      $$.context.select('.' + CLASS.brush).call($$.brush);
  };
  ChartInternal.prototype.updateTargetsForSubchart = function (targets) {
      var $$ = this, context = $$.context, config = $$.config, contextLineEnter, contextLine, contextBarEnter, contextBar, classChartBar = $$.classChartBar.bind($$), classBars = $$.classBars.bind($$), classChartLine = $$.classChartLine.bind($$), classLines = $$.classLines.bind($$), classAreas = $$.classAreas.bind($$);
      //-- Bar --//
      contextBar = context
          .select('.' + CLASS.chartBars)
          .selectAll('.' + CLASS.chartBar)
          .data(targets);
      contextBarEnter = contextBar
          .enter()
          .append('g')
          .style('opacity', 0);
      contextBarEnter.merge(contextBar).attr('class', classChartBar);
      // Bars for each data
      contextBarEnter.append('g').attr('class', classBars);
      //-- Line --//
      contextLine = context
          .select('.' + CLASS.chartLines)
          .selectAll('.' + CLASS.chartLine)
          .data(targets);
      contextLineEnter = contextLine
          .enter()
          .append('g')
          .style('opacity', 0);
      contextLineEnter.merge(contextLine).attr('class', classChartLine);
      // Lines for each data
      contextLineEnter.append('g').attr('class', classLines);
      // Area
      contextLineEnter.append('g').attr('class', classAreas);
      //-- Brush --//
      context
          .selectAll('.' + CLASS.brush + ' rect')
          .attr(config.axis_rotated ? 'width' : 'height', config.axis_rotated ? $$.width2 : $$.height2);
  };
  ChartInternal.prototype.updateBarForSubchart = function (durationForExit) {
      var $$ = this;
      var contextBar = $$.context
          .selectAll('.' + CLASS.bars)
          .selectAll('.' + CLASS.bar)
          .data($$.barData.bind($$));
      var contextBarEnter = contextBar
          .enter()
          .append('path')
          .attr('class', $$.classBar.bind($$))
          .style('stroke', 'none')
          .style('fill', $$.color);
      contextBar
          .exit()
          .transition()
          .duration(durationForExit)
          .style('opacity', 0)
          .remove();
      $$.contextBar = contextBarEnter
          .merge(contextBar)
          .style('opacity', $$.initialOpacity.bind($$));
  };
  ChartInternal.prototype.redrawBarForSubchart = function (drawBarOnSub, withTransition, duration) {
      (withTransition
          ? this.contextBar.transition(Math.random().toString()).duration(duration)
          : this.contextBar)
          .attr('d', drawBarOnSub)
          .style('opacity', 1);
  };
  ChartInternal.prototype.updateLineForSubchart = function (durationForExit) {
      var $$ = this;
      var contextLine = $$.context
          .selectAll('.' + CLASS.lines)
          .selectAll('.' + CLASS.line)
          .data($$.lineData.bind($$));
      var contextLineEnter = contextLine
          .enter()
          .append('path')
          .attr('class', $$.classLine.bind($$))
          .style('stroke', $$.color);
      contextLine
          .exit()
          .transition()
          .duration(durationForExit)
          .style('opacity', 0)
          .remove();
      $$.contextLine = contextLineEnter
          .merge(contextLine)
          .style('opacity', $$.initialOpacity.bind($$));
  };
  ChartInternal.prototype.redrawLineForSubchart = function (drawLineOnSub, withTransition, duration) {
      (withTransition
          ? this.contextLine.transition(Math.random().toString()).duration(duration)
          : this.contextLine)
          .attr('d', drawLineOnSub)
          .style('opacity', 1);
  };
  ChartInternal.prototype.updateAreaForSubchart = function (durationForExit) {
      var $$ = this, d3 = $$.d3;
      var contextArea = $$.context
          .selectAll('.' + CLASS.areas)
          .selectAll('.' + CLASS.area)
          .data($$.lineData.bind($$));
      var contextAreaEnter = contextArea
          .enter()
          .append('path')
          .attr('class', $$.classArea.bind($$))
          .style('fill', $$.color)
          .style('opacity', function () {
          $$.orgAreaOpacity = +d3.select(this).style('opacity');
          return 0;
      });
      contextArea
          .exit()
          .transition()
          .duration(durationForExit)
          .style('opacity', 0)
          .remove();
      $$.contextArea = contextAreaEnter.merge(contextArea).style('opacity', 0);
  };
  ChartInternal.prototype.redrawAreaForSubchart = function (drawAreaOnSub, withTransition, duration) {
      (withTransition
          ? this.contextArea.transition(Math.random().toString()).duration(duration)
          : this.contextArea)
          .attr('d', drawAreaOnSub)
          .style('fill', this.color)
          .style('opacity', this.orgAreaOpacity);
  };
  ChartInternal.prototype.redrawSubchart = function (withSubchart, transitions, duration, durationForExit, areaIndices, barIndices, lineIndices) {
      var $$ = this, d3 = $$.d3, drawAreaOnSub, drawBarOnSub, drawLineOnSub;
      // reflect main chart to extent on subchart if zoomed
      if (d3.event && d3.event.type === 'zoom') {
          $$.brush.selectionAsValue($$.x.orgDomain());
      }
      // update subchart elements if needed
      if (withSubchart) {
          // extent rect
          if (!$$.brush.empty()) {
              $$.brush.selectionAsValue($$.x.orgDomain());
          }
          // setup drawer - MEMO: this must be called after axis updated
          drawAreaOnSub = $$.generateDrawArea(areaIndices, true);
          drawBarOnSub = $$.generateDrawBar(barIndices, true);
          drawLineOnSub = $$.generateDrawLine(lineIndices, true);
          $$.updateBarForSubchart(duration);
          $$.updateLineForSubchart(duration);
          $$.updateAreaForSubchart(duration);
          $$.redrawBarForSubchart(drawBarOnSub, duration, duration);
          $$.redrawLineForSubchart(drawLineOnSub, duration, duration);
          $$.redrawAreaForSubchart(drawAreaOnSub, duration, duration);
      }
  };
  ChartInternal.prototype.redrawForBrush = function () {
      var $$ = this, x = $$.x, d3 = $$.d3, s;
      $$.redraw({
          withTransition: false,
          withY: $$.config.zoom_rescale,
          withSubchart: false,
          withUpdateXDomain: true,
          withEventRect: false,
          withDimension: false
      });
      // update zoom transation binded to event rect
      s = d3.event.selection || $$.brush.scale.range();
      $$.main
          .select('.' + CLASS.eventRect)
          .call($$.zoom.transform, d3.zoomIdentity.scale($$.width / (s[1] - s[0])).translate(-s[0], 0));
      $$.config.subchart_onbrush.call($$.api, x.orgDomain());
  };
  ChartInternal.prototype.transformContext = function (withTransition, transitions) {
      var $$ = this, subXAxis;
      if (transitions && transitions.axisSubX) {
          subXAxis = transitions.axisSubX;
      }
      else {
          subXAxis = $$.context.select('.' + CLASS.axisX);
          if (withTransition) {
              subXAxis = subXAxis.transition();
          }
      }
      $$.context.attr('transform', $$.getTranslate('context'));
      subXAxis.attr('transform', $$.getTranslate('subx'));
  };
  ChartInternal.prototype.getDefaultSelection = function () {
      var $$ = this, config = $$.config, selection = isFunction(config.axis_x_selection)
          ? config.axis_x_selection($$.getXDomain($$.data.targets))
          : config.axis_x_selection;
      if ($$.isTimeSeries()) {
          selection = [$$.parseDate(selection[0]), $$.parseDate(selection[1])];
      }
      return selection;
  };
  ChartInternal.prototype.removeSubchart = function () {
      var $$ = this;
      $$.brush = null;
      $$.context.remove();
      $$.context = null;
  };

  ChartInternal.prototype.initText = function () {
      var $$ = this;
      $$.main
          .select('.' + CLASS.chart)
          .append('g')
          .attr('class', CLASS.chartTexts);
      $$.mainText = $$.d3.selectAll([]);
  };
  ChartInternal.prototype.updateTargetsForText = function (targets) {
      var $$ = this, classChartText = $$.classChartText.bind($$), classTexts = $$.classTexts.bind($$), classFocus = $$.classFocus.bind($$);
      var mainText = $$.main
          .select('.' + CLASS.chartTexts)
          .selectAll('.' + CLASS.chartText)
          .data(targets);
      var mainTextEnter = mainText
          .enter()
          .append('g')
          .attr('class', classChartText)
          .style('opacity', 0)
          .style('pointer-events', 'none');
      mainTextEnter.append('g').attr('class', classTexts);
      mainTextEnter.merge(mainText).attr('class', function (d) {
          return classChartText(d) + classFocus(d);
      });
  };
  ChartInternal.prototype.updateText = function (xForText, yForText, durationForExit) {
      var $$ = this, config = $$.config, barOrLineData = $$.barOrLineData.bind($$), classText = $$.classText.bind($$);
      var mainText = $$.main
          .selectAll('.' + CLASS.texts)
          .selectAll('.' + CLASS.text)
          .data(barOrLineData);
      var mainTextEnter = mainText
          .enter()
          .append('text')
          .attr('class', classText)
          .attr('text-anchor', function (d) {
          return config.axis_rotated ? (d.value < 0 ? 'end' : 'start') : 'middle';
      })
          .style('stroke', 'none')
          .attr('x', xForText)
          .attr('y', yForText)
          .style('fill', function (d) {
          return $$.color(d);
      })
          .style('fill-opacity', 0);
      $$.mainText = mainTextEnter.merge(mainText).text(function (d, i, j) {
          return $$.dataLabelFormat(d.id)(d.value, d.id, i, j);
      });
      mainText
          .exit()
          .transition()
          .duration(durationForExit)
          .style('fill-opacity', 0)
          .remove();
  };
  ChartInternal.prototype.redrawText = function (xForText, yForText, forFlow, withTransition, transition) {
      return [
          (withTransition ? this.mainText.transition(transition) : this.mainText)
              .attr('x', xForText)
              .attr('y', yForText)
              .style('fill', this.color)
              .style('fill-opacity', forFlow ? 0 : this.opacityForText.bind(this))
      ];
  };
  ChartInternal.prototype.getTextRect = function (text, cls, element) {
      var dummy = this.d3
          .select('body')
          .append('div')
          .classed('c3', true), svg = dummy
          .append('svg')
          .style('visibility', 'hidden')
          .style('position', 'fixed')
          .style('top', 0)
          .style('left', 0), font = this.d3.select(element).style('font'), rect;
      svg
          .selectAll('.dummy')
          .data([text])
          .enter()
          .append('text')
          .classed(cls ? cls : '', true)
          .style('font', font)
          .text(text)
          .each(function () {
          rect = getBBox(this);
      });
      dummy.remove();
      return rect;
  };
  ChartInternal.prototype.generateXYForText = function (areaIndices, barIndices, lineIndices, forX) {
      var $$ = this, getAreaPoints = $$.generateGetAreaPoints(areaIndices, false), getBarPoints = $$.generateGetBarPoints(barIndices, false), getLinePoints = $$.generateGetLinePoints(lineIndices, false), getter = forX ? $$.getXForText : $$.getYForText;
      return function (d, i) {
          var getPoints = $$.isAreaType(d)
              ? getAreaPoints
              : $$.isBarType(d)
                  ? getBarPoints
                  : getLinePoints;
          return getter.call($$, getPoints(d, i), d, this);
      };
  };
  ChartInternal.prototype.getXForText = function (points, d, textElement) {
      var $$ = this, box = getBBox(textElement), xPos, padding;
      if ($$.config.axis_rotated) {
          padding = $$.isBarType(d) ? 4 : 6;
          xPos = points[2][1] + padding * (d.value < 0 ? -1 : 1);
      }
      else {
          xPos = $$.hasType('bar') ? (points[2][0] + points[0][0]) / 2 : points[0][0];
      }
      // show labels regardless of the domain if value is null
      if (d.value === null) {
          if (xPos > $$.width) {
              xPos = $$.width - box.width;
          }
          else if (xPos < 0) {
              xPos = 4;
          }
      }
      return xPos;
  };
  ChartInternal.prototype.getYForText = function (points, d, textElement) {
      var $$ = this, box = getBBox(textElement), yPos;
      if ($$.config.axis_rotated) {
          yPos = (points[0][0] + points[2][0] + box.height * 0.6) / 2;
      }
      else {
          yPos = points[2][1];
          if (d.value < 0 || (d.value === 0 && !$$.hasPositiveValue)) {
              yPos += box.height;
              if ($$.isBarType(d) && $$.isSafari()) {
                  yPos -= 3;
              }
              else if (!$$.isBarType(d) && $$.isChrome()) {
                  yPos += 3;
              }
          }
          else {
              yPos += $$.isBarType(d) ? -3 : -6;
          }
      }
      // show labels regardless of the domain if value is null
      if (d.value === null && !$$.config.axis_rotated) {
          if (yPos < box.height) {
              yPos = box.height;
          }
          else if (yPos > this.height) {
              yPos = this.height - 4;
          }
      }
      return yPos;
  };

  ChartInternal.prototype.initTitle = function () {
      var $$ = this;
      $$.title = $$.svg
          .append('text')
          .text($$.config.title_text)
          .attr('class', $$.CLASS.title);
  };
  ChartInternal.prototype.redrawTitle = function () {
      var $$ = this;
      $$.title.attr('x', $$.xForTitle.bind($$)).attr('y', $$.yForTitle.bind($$));
  };
  ChartInternal.prototype.xForTitle = function () {
      var $$ = this, config = $$.config, position = config.title_position || 'left', x;
      if (position.indexOf('right') >= 0) {
          x =
              $$.currentWidth -
                  $$.getTextRect($$.title.node().textContent, $$.CLASS.title, $$.title.node()).width -
                  config.title_padding.right;
      }
      else if (position.indexOf('center') >= 0) {
          x = Math.max(($$.currentWidth -
              $$.getTextRect($$.title.node().textContent, $$.CLASS.title, $$.title.node()).width) /
              2, 0);
      }
      else {
          // left
          x = config.title_padding.left;
      }
      return x;
  };
  ChartInternal.prototype.yForTitle = function () {
      var $$ = this;
      return ($$.config.title_padding.top +
          $$.getTextRect($$.title.node().textContent, $$.CLASS.title, $$.title.node())
              .height);
  };
  ChartInternal.prototype.getTitlePadding = function () {
      var $$ = this;
      return $$.yForTitle() + $$.config.title_padding.bottom;
  };

  function powerOfTen(d) {
      return d / Math.pow(10, Math.ceil(Math.log(d) / Math.LN10 - 1e-12)) === 1;
  }
  ChartInternal.prototype.drawColorScale = function () {
      var $$ = this, d3 = $$.d3, config = $$.config, target = $$.data.targets[0], barWidth, barHeight, axis, points, legendAxis, axisScale, inverseScale, height;
      barWidth = !isNaN(config.stanford_scaleWidth)
          ? config.stanford_scaleWidth
          : 20;
      barHeight = 5;
      if (barHeight < 0 || barWidth < 0) {
          throw Error("Colorscale's barheight and barwidth must be greater than 0.");
      }
      height =
          $$.height - config.stanford_padding.bottom - config.stanford_padding.top;
      points = d3.range(config.stanford_padding.bottom, height, barHeight);
      inverseScale = d3
          .scaleSequential(target.colors)
          .domain([points[points.length - 1], points[0]]);
      if ($$.colorScale) {
          $$.colorScale.remove();
      }
      $$.colorScale = $$.svg
          .append('g')
          .attr('width', 50)
          .attr('height', height)
          .attr('class', CLASS.colorScale);
      $$.colorScale
          .append('g')
          .attr('transform', "translate(0, " + config.stanford_padding.top + ")")
          .selectAll('bars')
          .data(points)
          .enter()
          .append('rect')
          .attr('y', function (d, i) { return i * barHeight; })
          .attr('x', 0)
          .attr('width', barWidth)
          .attr('height', barHeight)
          .attr('fill', function (d) {
          return inverseScale(d);
      });
      // Legend Axis
      axisScale = d3
          .scaleLog()
          .domain([target.minEpochs, target.maxEpochs])
          .range([
          points[0] +
              config.stanford_padding.top +
              points[points.length - 1] +
              barHeight -
              1,
          points[0] + config.stanford_padding.top
      ]);
      legendAxis = d3.axisRight(axisScale);
      if (config.stanford_scaleFormat === 'pow10') {
          legendAxis.tickValues([1, 10, 100, 1000, 10000, 100000, 1000000, 10000000]);
      }
      else if (isFunction(config.stanford_scaleFormat)) {
          legendAxis.tickFormat(config.stanford_scaleFormat);
      }
      else {
          legendAxis.tickFormat(d3.format('d'));
      }
      if (isFunction(config.stanford_scaleValues)) {
          legendAxis.tickValues(config.stanford_scaleValues(target.minEpochs, target.maxEpochs));
      }
      // Draw Axis
      axis = $$.colorScale
          .append('g')
          .attr('class', 'legend axis')
          .attr('transform', "translate(" + barWidth + ",0)")
          .call(legendAxis);
      if (config.stanford_scaleFormat === 'pow10') {
          axis
              .selectAll('.tick text')
              .text(null)
              .filter(powerOfTen)
              .text(10)
              .append('tspan')
              .attr('dy', '-.7em') // https://bl.ocks.org/mbostock/6738229
              .text(function (d) {
              return Math.round(Math.log(d) / Math.LN10);
          });
      }
      $$.colorScale.attr('transform', "translate(" + ($$.currentWidth - $$.xForColorScale()) + ", 0)");
  };
  ChartInternal.prototype.xForColorScale = function () {
      var $$ = this;
      return $$.config.stanford_padding.right + getBBox($$.colorScale.node()).width;
  };
  ChartInternal.prototype.getColorScalePadding = function () {
      var $$ = this;
      return $$.xForColorScale() + $$.config.stanford_padding.left + 20;
  };

  ChartInternal.prototype.isStanfordGraphType = function () {
      var $$ = this;
      return $$.config.data_type === 'stanford';
  };
  ChartInternal.prototype.initStanfordData = function () {
      var $$ = this, d3 = $$.d3, config = $$.config, target = $$.data.targets[0], epochs, maxEpochs, minEpochs;
      // Make larger values appear on top
      target.values.sort(compareEpochs);
      // Get array of epochs
      epochs = target.values.map(function (a) { return a.epochs; });
      minEpochs = !isNaN(config.stanford_scaleMin)
          ? config.stanford_scaleMin
          : d3.min(epochs);
      maxEpochs = !isNaN(config.stanford_scaleMax)
          ? config.stanford_scaleMax
          : d3.max(epochs);
      if (minEpochs > maxEpochs) {
          throw Error('Number of minEpochs has to be smaller than maxEpochs');
      }
      target.colors = isFunction(config.stanford_colors)
          ? config.stanford_colors
          : d3.interpolateHslLong(d3.hsl(250, 1, 0.5), d3.hsl(0, 1, 0.5));
      target.colorscale = d3
          .scaleSequentialLog(target.colors)
          .domain([minEpochs, maxEpochs]);
      target.minEpochs = minEpochs;
      target.maxEpochs = maxEpochs;
  };
  ChartInternal.prototype.getStanfordPointColor = function (d) {
      var $$ = this, target = $$.data.targets[0];
      return target.colorscale(d.epochs);
  };
  // http://jsfiddle.net/Xotic750/KtzLq/
  ChartInternal.prototype.getCentroid = function (points) {
      var area = getRegionArea(points);
      var x = 0, y = 0, i, j, f, point1, point2;
      for (i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
          point1 = points[i];
          point2 = points[j];
          f = point1.x * point2.y - point2.x * point1.y;
          x += (point1.x + point2.x) * f;
          y += (point1.y + point2.y) * f;
      }
      f = area * 6;
      return {
          x: x / f,
          y: y / f
      };
  };
  ChartInternal.prototype.getStanfordTooltipTitle = function (d) {
      var $$ = this, labelX = $$.axis.getLabelText('x'), labelY = $$.axis.getLabelText('y');
      return "\n      <tr><th>" + (labelX ? sanitise(labelX) : 'x') + "</th><th class='value'>" + d.x + "</th></tr>\n      <tr><th>" + (labelY ? sanitise(labelY) : 'y') + "</th><th class='value'>" + d.value + "</th></tr>\n    ";
  };
  ChartInternal.prototype.countEpochsInRegion = function (region) {
      var $$ = this, target = $$.data.targets[0], total, count;
      total = target.values.reduce(function (accumulator, currentValue) { return accumulator + Number(currentValue.epochs); }, 0);
      count = target.values.reduce(function (accumulator, currentValue) {
          if (pointInRegion(currentValue, region)) {
              return accumulator + Number(currentValue.epochs);
          }
          return accumulator;
      }, 0);
      return {
          value: count,
          percentage: count !== 0 ? ((count / total) * 100).toFixed(1) : 0
      };
  };
  var getRegionArea = function (points) {
      // thanks to: https://stackoverflow.com/questions/16282330/find-centerpoint-of-polygon-in-javascript
      var area = 0, i, j, point1, point2;
      for (i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
          point1 = points[i];
          point2 = points[j];
          area += point1.x * point2.y;
          area -= point1.y * point2.x;
      }
      area /= 2;
      return area;
  };
  var pointInRegion = function (point, region) {
      // thanks to: http://bl.ocks.org/bycoffe/5575904
      // ray-casting algorithm based on
      // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
      var xi, yi, yj, xj, intersect, x = point.x, y = point.value, inside = false;
      for (var i = 0, j = region.length - 1; i < region.length; j = i++) {
          xi = region[i].x;
          yi = region[i].y;
          xj = region[j].x;
          yj = region[j].y;
          intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
          if (intersect) {
              inside = !inside;
          }
      }
      return inside;
  };
  var compareEpochs = function (a, b) {
      if (a.epochs < b.epochs) {
          return -1;
      }
      if (a.epochs > b.epochs) {
          return 1;
      }
      return 0;
  };

  ChartInternal.prototype.initStanfordElements = function () {
      var $$ = this;
      // Avoid blocking eventRect
      $$.stanfordElements = $$.main
          .select('.' + CLASS.chart)
          .append('g')
          .attr('class', CLASS.stanfordElements);
      $$.stanfordElements.append('g').attr('class', CLASS.stanfordLines);
      $$.stanfordElements.append('g').attr('class', CLASS.stanfordTexts);
      $$.stanfordElements.append('g').attr('class', CLASS.stanfordRegions);
  };
  ChartInternal.prototype.updateStanfordElements = function (duration) {
      var $$ = this, main = $$.main, config = $$.config, stanfordLine, stanfordLineEnter, stanfordRegion, stanfordRegionEnter, stanfordText, stanfordTextEnter, xvCustom = $$.xvCustom.bind($$), yvCustom = $$.yvCustom.bind($$), countPointsInRegion = $$.countEpochsInRegion.bind($$);
      // Stanford-Lines
      stanfordLine = main
          .select('.' + CLASS.stanfordLines)
          .style('shape-rendering', 'geometricprecision')
          .selectAll('.' + CLASS.stanfordLine)
          .data(config.stanford_lines);
      // enter
      stanfordLineEnter = stanfordLine
          .enter()
          .append('g')
          .attr('class', function (d) {
          return CLASS.stanfordLine + (d['class'] ? ' ' + d['class'] : '');
      });
      stanfordLineEnter
          .append('line')
          .attr('x1', function (d) {
          return config.axis_rotated ? yvCustom(d, 'value_y1') : xvCustom(d, 'value_x1');
      })
          .attr('x2', function (d) {
          return config.axis_rotated ? yvCustom(d, 'value_y2') : xvCustom(d, 'value_x2');
      })
          .attr('y1', function (d) {
          return config.axis_rotated ? xvCustom(d, 'value_x1') : yvCustom(d, 'value_y1');
      })
          .attr('y2', function (d) {
          return config.axis_rotated ? xvCustom(d, 'value_x2') : yvCustom(d, 'value_y2');
      })
          .style('opacity', 0);
      // update
      $$.stanfordLines = stanfordLineEnter.merge(stanfordLine);
      $$.stanfordLines
          .select('line')
          .transition()
          .duration(duration)
          .attr('x1', function (d) {
          return config.axis_rotated ? yvCustom(d, 'value_y1') : xvCustom(d, 'value_x1');
      })
          .attr('x2', function (d) {
          return config.axis_rotated ? yvCustom(d, 'value_y2') : xvCustom(d, 'value_x2');
      })
          .attr('y1', function (d) {
          return config.axis_rotated ? xvCustom(d, 'value_x1') : yvCustom(d, 'value_y1');
      })
          .attr('y2', function (d) {
          return config.axis_rotated ? xvCustom(d, 'value_x2') : yvCustom(d, 'value_y2');
      })
          .style('opacity', 1);
      // exit
      stanfordLine
          .exit()
          .transition()
          .duration(duration)
          .style('opacity', 0)
          .remove();
      // Stanford-Text
      stanfordText = main
          .select('.' + CLASS.stanfordTexts)
          .selectAll('.' + CLASS.stanfordText)
          .data(config.stanford_texts);
      // enter
      stanfordTextEnter = stanfordText
          .enter()
          .append('g')
          .attr('class', function (d) {
          return CLASS.stanfordText + (d['class'] ? ' ' + d['class'] : '');
      });
      stanfordTextEnter
          .append('text')
          .attr('x', function (d) { return (config.axis_rotated ? yvCustom(d, 'y') : xvCustom(d, 'x')); })
          .attr('y', function (d) { return (config.axis_rotated ? xvCustom(d, 'x') : yvCustom(d, 'y')); })
          .style('opacity', 0);
      // update
      $$.stanfordTexts = stanfordTextEnter.merge(stanfordText);
      $$.stanfordTexts
          .select('text')
          .transition()
          .duration(duration)
          .attr('x', function (d) { return (config.axis_rotated ? yvCustom(d, 'y') : xvCustom(d, 'x')); })
          .attr('y', function (d) { return (config.axis_rotated ? xvCustom(d, 'x') : yvCustom(d, 'y')); })
          .text(function (d) {
          return d.content;
      })
          .style('opacity', 1);
      // exit
      stanfordText
          .exit()
          .transition()
          .duration(duration)
          .style('opacity', 0)
          .remove();
      // Stanford-Regions
      stanfordRegion = main
          .select('.' + CLASS.stanfordRegions)
          .selectAll('.' + CLASS.stanfordRegion)
          .data(config.stanford_regions);
      // enter
      stanfordRegionEnter = stanfordRegion
          .enter()
          .append('g')
          .attr('class', function (d) {
          return CLASS.stanfordRegion + (d['class'] ? ' ' + d['class'] : '');
      });
      stanfordRegionEnter
          .append('polygon')
          .attr('points', function (d) {
          return d.points
              .map(function (value) {
              return [
                  config.axis_rotated ? yvCustom(value, 'y') : xvCustom(value, 'x'),
                  config.axis_rotated ? xvCustom(value, 'x') : yvCustom(value, 'y')
              ].join(',');
          })
              .join(' ');
      })
          .style('opacity', 0);
      stanfordRegionEnter
          .append('text')
          .attr('x', function (d) { return $$.getCentroid(d.points).x; })
          .attr('y', function (d) { return $$.getCentroid(d.points).y; })
          .style('opacity', 0);
      // update
      $$.stanfordRegions = stanfordRegionEnter.merge(stanfordRegion);
      $$.stanfordRegions
          .select('polygon')
          .transition()
          .duration(duration)
          .attr('points', function (d) {
          return d.points
              .map(function (value) {
              return [
                  config.axis_rotated ? yvCustom(value, 'y') : xvCustom(value, 'x'),
                  config.axis_rotated ? xvCustom(value, 'x') : yvCustom(value, 'y')
              ].join(',');
          })
              .join(' ');
      })
          .style('opacity', function (d) {
          return d.opacity ? d.opacity : 0.2;
      });
      $$.stanfordRegions
          .select('text')
          .transition()
          .duration(duration)
          .attr('x', function (d) {
          return config.axis_rotated
              ? yvCustom($$.getCentroid(d.points), 'y')
              : xvCustom($$.getCentroid(d.points), 'x');
      })
          .attr('y', function (d) {
          return config.axis_rotated
              ? xvCustom($$.getCentroid(d.points), 'x')
              : yvCustom($$.getCentroid(d.points), 'y');
      })
          .text(function (d) {
          if (d.text) {
              var value, percentage, temp;
              if ($$.isStanfordGraphType()) {
                  temp = countPointsInRegion(d.points);
                  value = temp.value;
                  percentage = temp.percentage;
              }
              return d.text(value, percentage);
          }
          return '';
      })
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style('opacity', 1);
      // exit
      stanfordRegion
          .exit()
          .transition()
          .duration(duration)
          .style('opacity', 0)
          .remove();
  };

  ChartInternal.prototype.initTooltip = function () {
      var $$ = this, config = $$.config, i;
      $$.tooltip = $$.selectChart
          .style('position', 'relative')
          .append('div')
          .attr('class', CLASS.tooltipContainer)
          .style('position', 'absolute')
          .style('pointer-events', 'none')
          .style('display', 'none');
      // Show tooltip if needed
      if (config.tooltip_init_show) {
          if ($$.isTimeSeries() && isString(config.tooltip_init_x)) {
              config.tooltip_init_x = $$.parseDate(config.tooltip_init_x);
              for (i = 0; i < $$.data.targets[0].values.length; i++) {
                  if ($$.data.targets[0].values[i].x - config.tooltip_init_x === 0) {
                      break;
                  }
              }
              config.tooltip_init_x = i;
          }
          $$.tooltip.html(config.tooltip_contents.call($$, $$.data.targets.map(function (d) {
              return $$.addName(d.values[config.tooltip_init_x]);
          }), $$.axis.getXAxisTickFormat(), $$.getYFormat($$.hasArcType()), $$.color));
          $$.tooltip
              .style('top', config.tooltip_init_position.top)
              .style('left', config.tooltip_init_position.left)
              .style('display', 'block');
      }
  };
  ChartInternal.prototype.getTooltipSortFunction = function () {
      var $$ = this, config = $$.config;
      if (config.data_groups.length === 0 || config.tooltip_order !== undefined) {
          // if data are not grouped or if an order is specified
          // for the tooltip values we sort them by their values
          var order = config.tooltip_order;
          if (order === undefined) {
              order = config.data_order;
          }
          var valueOf = function (obj) {
              return obj ? obj.value : null;
          };
          // if data are not grouped, we sort them by their value
          if (isString(order) && order.toLowerCase() === 'asc') {
              return function (a, b) {
                  return valueOf(a) - valueOf(b);
              };
          }
          else if (isString(order) && order.toLowerCase() === 'desc') {
              return function (a, b) {
                  return valueOf(b) - valueOf(a);
              };
          }
          else if (isFunction(order)) {
              // if the function is from data_order we need
              // to wrap the returned function in order to format
              // the sorted value to the expected format
              var sortFunction = order;
              if (config.tooltip_order === undefined) {
                  sortFunction = function (a, b) {
                      return order(a
                          ? {
                              id: a.id,
                              values: [a]
                          }
                          : null, b
                          ? {
                              id: b.id,
                              values: [b]
                          }
                          : null);
                  };
              }
              return sortFunction;
          }
          else if (isArray(order)) {
              return function (a, b) {
                  return order.indexOf(a.id) - order.indexOf(b.id);
              };
          }
      }
      else {
          // if data are grouped, we follow the order of grouped targets
          var ids = $$.orderTargets($$.data.targets).map(function (i) {
              return i.id;
          });
          // if it was either asc or desc we need to invert the order
          // returned by orderTargets
          if ($$.isOrderAsc() || $$.isOrderDesc()) {
              ids = ids.reverse();
          }
          return function (a, b) {
              return ids.indexOf(a.id) - ids.indexOf(b.id);
          };
      }
  };
  ChartInternal.prototype.getTooltipContent = function (d, defaultTitleFormat, defaultValueFormat, color) {
      var $$ = this, config = $$.config, titleFormat = config.tooltip_format_title || defaultTitleFormat, nameFormat = config.tooltip_format_name ||
          function (name) {
              return name;
          }, text, i, title, value, name, bgcolor;
      var valueFormat = config.tooltip_format_value;
      if (!valueFormat) {
          valueFormat = $$.isTargetNormalized(d.id)
              ? function (v, ratio) { return (ratio * 100).toFixed(2) + "%"; }
              : defaultValueFormat;
      }
      var tooltipSortFunction = this.getTooltipSortFunction();
      if (tooltipSortFunction) {
          d.sort(tooltipSortFunction);
      }
      for (i = 0; i < d.length; i++) {
          if (!(d[i] && (d[i].value || d[i].value === 0))) {
              continue;
          }
          if ($$.isStanfordGraphType()) {
              // Custom tooltip for stanford plots
              if (!text) {
                  title = $$.getStanfordTooltipTitle(d[i]);
                  text = "<table class='" + $$.CLASS.tooltip + "'>" + title;
              }
              bgcolor = $$.getStanfordPointColor(d[i]);
              name = sanitise(config.data_epochs); // Epochs key name
              value = d[i].epochs;
          }
          else {
              // Regular tooltip
              if (!text) {
                  title = sanitise(titleFormat ? titleFormat(d[i].x, d[i].index) : d[i].x);
                  text =
                      "<table class='" +
                          $$.CLASS.tooltip +
                          "'>" +
                          (title || title === 0
                              ? "<tr><th colspan='2'>" + title + '</th></tr>'
                              : '');
              }
              value = sanitise(valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index, d));
              if (value !== undefined) {
                  // Skip elements when their name is set to null
                  if (d[i].name === null) {
                      continue;
                  }
                  name = sanitise(nameFormat(d[i].name, d[i].ratio, d[i].id, d[i].index));
                  bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
              }
          }
          if (value !== undefined) {
              text +=
                  "<tr class='" +
                      $$.CLASS.tooltipName +
                      '-' +
                      $$.getTargetSelectorSuffix(d[i].id) +
                      "'>";
              text +=
                  "<td class='name'><span style='background-color:" +
                      bgcolor +
                      "'></span>" +
                      name +
                      '</td>';
              text += "<td class='value'>" + value + '</td>';
              text += '</tr>';
          }
      }
      return text + '</table>';
  };
  ChartInternal.prototype.tooltipPosition = function (dataToShow, tWidth, tHeight, element) {
      var $$ = this, config = $$.config, d3 = $$.d3;
      var svgLeft, tooltipLeft, tooltipRight, tooltipTop, chartRight;
      var forArc = $$.hasArcType(), mouse = d3.mouse(element);
      // Determin tooltip position
      if (forArc) {
          tooltipLeft =
              ($$.width - ($$.isLegendRight ? $$.getLegendWidth() : 0)) / 2 + mouse[0];
          tooltipTop =
              ($$.hasType('gauge') ? $$.height : $$.height / 2) + mouse[1] + 20;
      }
      else {
          svgLeft = $$.getSvgLeft(true);
          if (config.axis_rotated) {
              tooltipLeft = svgLeft + mouse[0] + 100;
              tooltipRight = tooltipLeft + tWidth;
              chartRight = $$.currentWidth - $$.getCurrentPaddingRight();
              tooltipTop = $$.x(dataToShow[0].x) + 20;
          }
          else {
              tooltipLeft =
                  svgLeft + $$.getCurrentPaddingLeft(true) + $$.x(dataToShow[0].x) + 20;
              tooltipRight = tooltipLeft + tWidth;
              chartRight = svgLeft + $$.currentWidth - $$.getCurrentPaddingRight();
              tooltipTop = mouse[1] + 15;
          }
          if (tooltipRight > chartRight) {
              // 20 is needed for Firefox to keep tooltip width
              tooltipLeft -= tooltipRight - chartRight + 20;
          }
          if (tooltipTop + tHeight > $$.currentHeight) {
              tooltipTop -= tHeight + 30;
          }
      }
      if (tooltipTop < 0) {
          tooltipTop = 0;
      }
      return {
          top: tooltipTop,
          left: tooltipLeft
      };
  };
  ChartInternal.prototype.showTooltip = function (selectedData, element) {
      var $$ = this, config = $$.config;
      var tWidth, tHeight, position;
      var forArc = $$.hasArcType(), dataToShow = selectedData.filter(function (d) {
          return d && isValue(d.value);
      }), positionFunction = config.tooltip_position || ChartInternal.prototype.tooltipPosition;
      if (dataToShow.length === 0 || !config.tooltip_show) {
          $$.hideTooltip();
          return;
      }
      $$.tooltip
          .html(config.tooltip_contents.call($$, selectedData, $$.axis.getXAxisTickFormat(), $$.getYFormat(forArc), $$.color))
          .style('display', 'block');
      // Get tooltip dimensions
      tWidth = $$.tooltip.property('offsetWidth');
      tHeight = $$.tooltip.property('offsetHeight');
      position = positionFunction.call(this, dataToShow, tWidth, tHeight, element);
      // Set tooltip
      $$.tooltip
          .style('top', position.top + 'px')
          .style('left', position.left + 'px');
  };
  ChartInternal.prototype.hideTooltip = function () {
      this.tooltip.style('display', 'none');
  };

  ChartInternal.prototype.setTargetType = function (targetIds, type) {
      var $$ = this, config = $$.config;
      $$.mapToTargetIds(targetIds).forEach(function (id) {
          $$.withoutFadeIn[id] = type === config.data_types[id];
          config.data_types[id] = type;
      });
      if (!targetIds) {
          config.data_type = type;
      }
  };
  ChartInternal.prototype.hasType = function (type, targets) {
      var $$ = this, types = $$.config.data_types, has = false;
      targets = targets || $$.data.targets;
      if (targets && targets.length) {
          targets.forEach(function (target) {
              var t = types[target.id];
              if ((t && t.indexOf(type) >= 0) || (!t && type === 'line')) {
                  has = true;
              }
          });
      }
      else if (Object.keys(types).length) {
          Object.keys(types).forEach(function (id) {
              if (types[id] === type) {
                  has = true;
              }
          });
      }
      else {
          has = $$.config.data_type === type;
      }
      return has;
  };
  ChartInternal.prototype.hasArcType = function (targets) {
      return (this.hasType('pie', targets) ||
          this.hasType('donut', targets) ||
          this.hasType('gauge', targets));
  };
  ChartInternal.prototype.isLineType = function (d) {
      var config = this.config, id = isString(d) ? d : d.id;
      return (!config.data_types[id] ||
          ['line', 'spline', 'area', 'area-spline', 'step', 'area-step'].indexOf(config.data_types[id]) >= 0);
  };
  ChartInternal.prototype.isStepType = function (d) {
      var id = isString(d) ? d : d.id;
      return ['step', 'area-step'].indexOf(this.config.data_types[id]) >= 0;
  };
  ChartInternal.prototype.isSplineType = function (d) {
      var id = isString(d) ? d : d.id;
      return ['spline', 'area-spline'].indexOf(this.config.data_types[id]) >= 0;
  };
  ChartInternal.prototype.isAreaType = function (d) {
      var id = isString(d) ? d : d.id;
      return (['area', 'area-spline', 'area-step'].indexOf(this.config.data_types[id]) >=
          0);
  };
  ChartInternal.prototype.isBarType = function (d) {
      var id = isString(d) ? d : d.id;
      return this.config.data_types[id] === 'bar';
  };
  ChartInternal.prototype.isScatterType = function (d) {
      var id = isString(d) ? d : d.id;
      return this.config.data_types[id] === 'scatter';
  };
  ChartInternal.prototype.isStanfordType = function (d) {
      var id = isString(d) ? d : d.id;
      return this.config.data_types[id] === 'stanford';
  };
  ChartInternal.prototype.isPieType = function (d) {
      var id = isString(d) ? d : d.id;
      return this.config.data_types[id] === 'pie';
  };
  ChartInternal.prototype.isGaugeType = function (d) {
      var id = isString(d) ? d : d.id;
      return this.config.data_types[id] === 'gauge';
  };
  ChartInternal.prototype.isDonutType = function (d) {
      var id = isString(d) ? d : d.id;
      return this.config.data_types[id] === 'donut';
  };
  ChartInternal.prototype.isArcType = function (d) {
      return this.isPieType(d) || this.isDonutType(d) || this.isGaugeType(d);
  };
  ChartInternal.prototype.lineData = function (d) {
      return this.isLineType(d) ? [d] : [];
  };
  ChartInternal.prototype.arcData = function (d) {
      return this.isArcType(d.data) ? [d] : [];
  };
  /* not used
   function scatterData(d) {
   return isScatterType(d) ? d.values : [];
   }
   */
  ChartInternal.prototype.barData = function (d) {
      return this.isBarType(d) ? d.values : [];
  };
  ChartInternal.prototype.lineOrScatterOrStanfordData = function (d) {
      return this.isLineType(d) || this.isScatterType(d) || this.isStanfordType(d)
          ? d.values
          : [];
  };
  ChartInternal.prototype.barOrLineData = function (d) {
      return this.isBarType(d) || this.isLineType(d) ? d.values : [];
  };

  ChartInternal.prototype.isSafari = function () {
      var ua = window.navigator.userAgent;
      return ua.indexOf('Safari') >= 0 && ua.indexOf('Chrome') < 0;
  };
  ChartInternal.prototype.isChrome = function () {
      var ua = window.navigator.userAgent;
      return ua.indexOf('Chrome') >= 0;
  };

  ChartInternal.prototype.initZoom = function () {
      var $$ = this, d3 = $$.d3, config = $$.config, startEvent;
      $$.zoom = d3
          .zoom()
          .on('start', function () {
          if (config.zoom_type !== 'scroll') {
              return;
          }
          var e = d3.event.sourceEvent;
          if (e && e.type === 'brush') {
              return;
          }
          startEvent = e;
          config.zoom_onzoomstart.call($$.api, e);
      })
          .on('zoom', function () {
          if (config.zoom_type !== 'scroll') {
              return;
          }
          var e = d3.event.sourceEvent;
          if (e && e.type === 'brush') {
              return;
          }
          $$.redrawForZoom();
          config.zoom_onzoom.call($$.api, $$.x.orgDomain());
      })
          .on('end', function () {
          if (config.zoom_type !== 'scroll') {
              return;
          }
          var e = d3.event.sourceEvent;
          if (e && e.type === 'brush') {
              return;
          }
          // if click, do nothing. otherwise, click interaction will be canceled.
          if (e &&
              startEvent.clientX === e.clientX &&
              startEvent.clientY === e.clientY) {
              return;
          }
          config.zoom_onzoomend.call($$.api, $$.x.orgDomain());
      });
      $$.zoom.updateDomain = function () {
          if (d3.event && d3.event.transform) {
              if (config.axis_rotated && config.zoom_type === 'scroll' && d3.event.sourceEvent.type === 'mousemove') {
                  // we're moving the mouse in a rotated chart with zoom = "scroll", so we need rescaleY (i.e. vertical)
                  $$.x.domain(d3.event.transform.rescaleY($$.subX).domain());
              }
              else {
                  $$.x.domain(d3.event.transform.rescaleX($$.subX).domain());
              }
          }
          return this;
      };
      $$.zoom.updateExtent = function () {
          this.scaleExtent([1, Infinity])
              .translateExtent([
              [0, 0],
              [$$.width, $$.height]
          ])
              .extent([
              [0, 0],
              [$$.width, $$.height]
          ]);
          return this;
      };
      $$.zoom.update = function () {
          return this.updateExtent().updateDomain();
      };
      return $$.zoom.updateExtent();
  };
  ChartInternal.prototype.zoomTransform = function (range) {
      var $$ = this, s = [$$.x(range[0]), $$.x(range[1])];
      return $$.d3.zoomIdentity.scale($$.width / (s[1] - s[0])).translate(-s[0], 0);
  };
  ChartInternal.prototype.initDragZoom = function () {
      var $$ = this;
      var d3 = $$.d3;
      var config = $$.config;
      var context = ($$.context = $$.svg);
      var brushXPos = $$.margin.left + 20.5;
      var brushYPos = $$.margin.top + 0.5;
      if (!(config.zoom_type === 'drag' && config.zoom_enabled)) {
          return;
      }
      var getZoomedDomain = function (selection) {
          return selection && selection.map(function (x) { return $$.x.invert(x); });
      };
      var brush = ($$.dragZoomBrush = d3
          .brushX()
          .on('start', function () {
          $$.api.unzoom();
          $$.svg.select('.' + CLASS.dragZoom).classed('disabled', false);
          config.zoom_onzoomstart.call($$.api, d3.event.sourceEvent);
      })
          .on('brush', function () {
          config.zoom_onzoom.call($$.api, getZoomedDomain(d3.event.selection));
      })
          .on('end', function () {
          if (d3.event.selection == null) {
              return;
          }
          var zoomedDomain = getZoomedDomain(d3.event.selection);
          if (!config.zoom_disableDefaultBehavior) {
              $$.api.zoom(zoomedDomain);
          }
          $$.svg.select('.' + CLASS.dragZoom).classed('disabled', true);
          config.zoom_onzoomend.call($$.api, zoomedDomain);
      }));
      context
          .append('g')
          .classed(CLASS.dragZoom, true)
          .attr('clip-path', $$.clipPath)
          .attr('transform', 'translate(' + brushXPos + ',' + brushYPos + ')')
          .call(brush);
  };
  ChartInternal.prototype.getZoomDomain = function () {
      var $$ = this, config = $$.config, d3 = $$.d3, min = d3.min([$$.orgXDomain[0], config.zoom_x_min]), max = d3.max([$$.orgXDomain[1], config.zoom_x_max]);
      return [min, max];
  };
  ChartInternal.prototype.redrawForZoom = function () {
      var $$ = this, d3 = $$.d3, config = $$.config, zoom = $$.zoom, x = $$.x;
      if (!config.zoom_enabled) {
          return;
      }
      if ($$.filterTargetsToShow($$.data.targets).length === 0) {
          return;
      }
      zoom.update();
      if (config.zoom_disableDefaultBehavior) {
          return;
      }
      if ($$.isCategorized() && x.orgDomain()[0] === $$.orgXDomain[0]) {
          x.domain([$$.orgXDomain[0] - 1e-10, x.orgDomain()[1]]);
      }
      $$.redraw({
          withTransition: false,
          withY: config.zoom_rescale,
          withSubchart: false,
          withEventRect: false,
          withDimension: false
      });
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'mousemove') {
          $$.cancelClick = true;
      }
  };

  return c3;

})));
