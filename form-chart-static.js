var log = (typeof console !== "undefined") ? console.log : function () {alert(Array.prototype.slice.apply(arguments).join(", "));};

Raphael.fn.g.formchart = function (x, y, width, height, values, opts) {
    opts = opts || {};
    var chart = this.set(),
        bars = this.set(),
//        covers = this.set(),
//        covers2 = this.set(),
        paper = this,
        colors = opts.colors || this.g.colors,
        teamlen = values.length,
		roundlen = values[0].length,
		roundW = width / (roundlen - 1),
		teamH = height / (teamlen / 2),
		lossH = teamH * .15,
		X,
		Y = y,
		maxY = [],
		bar,
		colour = 0;
//	log("height / teamlen = teamH: %f / %f = %f, width / (roundlen - 1) = roundW: %f / %f = %f, Y: %f",
//		height, teamlen, teamH,
//		width, (roundlen - 1), roundW,
//		Y
//	);
	for (var t = 0; t < teamlen; t++) {
		X = x;
		var pathT = ['M', x],
			pathB = [];
		for (var r = 0; r < roundlen; r++) {
			var cellV = values[t][r],
				cellH = cellV ? cellV === 1 ? teamH / 2 : teamH - lossH : lossH,
				cellY = (maxY[r] || Y);// + (teamH - cellH) / 2;
			if (cellV === undefined) {
				continue;
			}
			if (r) {
				pathT.push(X, cellY);
			} else {
				pathT.push(cellY, 'L');
			}
			pathB.push(cellY + cellH, X);

			X += roundW;
			maxY[r] = cellY + cellH;
		}
		pathT = pathT.concat(pathB.reverse());
		pathT.push('z');
		bars[t] = this.path(pathT.join(' ')).attr({stroke: colors[colour], fill: colors[colour]});
//		log("Colour: %f, maxY: %o", colour, maxY);
		colour += 1;
		if (!colors[colour]) {
			colour = 0;
		}
	}
};

Raphael.fn.grid = function (x, y, colour) {
	var grid = this.set(),
		attrs = {stroke: colour || '#CCC'},
		path;
	y = y || x;
	for (var i = 0; i < this.width; i += x) {
		path = this.path(['M', i, 0, 'V', this.height].join(' '));
		grid.push(path);
	}
	for (var j = 0; j < this.height; j += y) {
		path = this.path(['M', 0, j, 'H', this.width].join(' '));
		grid.push(path);
	}
	grid.attr(attrs);
	return grid;
};
