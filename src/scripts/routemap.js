(function () {
  var canvas = document.getElementById('routemap');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  // A deterministic pseudo-random sequence, so the network is the same on every
  // load and on every device — a decorative stand-in, never a real GPS trace.
  function rng(seed) {
    return function () {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
  }

  function draw() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    var css = getComputedStyle(document.documentElement);
    var tok = function (name) { return css.getPropertyValue(name).trim(); };
    var lineA = tok('--map-line'), lineB = tok('--map-line-2'), water = tok('--map-water');
    var hotA = tok('--map-hot'), hotB = tok('--map-hot-2');

    var rand = rng(20260916);
    var step = Math.max(46, Math.min(96, w / 14));
    ctx.lineCap = 'round';

    // Streets: broken horizontals and verticals, drifting a little off-grid.
    for (var y = -step; y < h + step; y += step) {
      var x = -step;
      while (x < w + step) {
        var run = step * (0.6 + rand() * 2.4);
        if (rand() > 0.24) {
          var drift = (rand() - 0.5) * step * 0.5;
          ctx.beginPath();
          ctx.moveTo(x, y + drift * 0.3);
          ctx.lineTo(x + run, y + drift);
          ctx.strokeStyle = lineA;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        x += run + step * 0.35;
      }
    }
    for (var x2 = -step; x2 < w + step; x2 += step * 1.15) {
      var y2 = -step;
      while (y2 < h + step) {
        var run2 = step * (0.5 + rand() * 2.2);
        if (rand() > 0.3) {
          var drift2 = (rand() - 0.5) * step * 0.45;
          ctx.beginPath();
          ctx.moveTo(x2 + drift2 * 0.3, y2);
          ctx.lineTo(x2 + drift2, y2 + run2);
          ctx.strokeStyle = lineB;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        y2 += run2 + step * 0.4;
      }
    }

    // The lake and the river: two long curves the grid bends around.
    ctx.beginPath();
    ctx.moveTo(w * 0.62, h + 40);
    ctx.bezierCurveTo(w * 0.52, h * 0.72, w * 0.66, h * 0.52, w * 0.58, h * 0.24);
    ctx.strokeStyle = water;
    ctx.lineWidth = Math.max(10, w / 90);
    ctx.stroke();

    // The routes run most often: the only lime in the layer, and still nearly dark.
    var hot = [
      [0.08, 0.78, 0.26, 0.62, 0.44, 0.66, 0.6, 0.44],
      [0.58, 0.44, 0.72, 0.3, 0.86, 0.34, 0.95, 0.2],
      [0.12, 0.3, 0.3, 0.26, 0.42, 0.38, 0.55, 0.3]
    ];
    hot.forEach(function (p, i) {
      ctx.beginPath();
      ctx.moveTo(p[0] * w, p[1] * h);
      ctx.bezierCurveTo(p[2] * w, p[3] * h, p[4] * w, p[5] * h, p[6] * w, p[7] * h);
      ctx.strokeStyle = i === 0 ? hotA : hotB;
      ctx.lineWidth = i === 0 ? 2.5 : 1.6;
      ctx.stroke();
    });
  }

  draw();
  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(draw, 160);
  });

})();
