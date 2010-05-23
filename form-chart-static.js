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
		colour = 0,
		fin = function () {
			console.log(this);
			//this.flag = paper.g.popup(this.bar.x, this.bar.y, this.bar.value || "0").insertBefore(this);
		},
		fout = function () {
			//this.flag.animate({opacity: 0}, 300, function () {this.remove();});
		};
	// Loop through the teams and build their path objects
	for (var t = 0; t < teamlen; t++) {
		X = x;
		// Top and bottom co-ordinates are built separately then joined later
		var pathT = ['M', x],
			pathB = [];
		// Work out top/bottom position of path at each round
		for (var r = 0; r < roundlen; r++) {
			var cellV = values[t][r],
				cellH = cellV ? cellV === 1 ? teamH / 2 : teamH - lossH : lossH,
				cellY = (maxY[r] || Y);
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
		// Finalise the path and create object
		pathT = pathT.concat(pathB.reverse());
		pathT.push('z');
		bars[t] = this.path(pathT.join(' ')).attr({stroke: colors[colour], fill: colors[colour]}).hover(fin, fout);

		// Get the next colour
		colour++;
		if (!colors[colour]) {
			colour = 0;
		}
	}
	// Check if any paths go outside the defined bounds of the grid
	// This can happen if there is an odd number of teams
	Y = Math.max.apply(Math, maxY);
	log(Y)
	if (Y > y + height) {
		var scaleY = height / (Y - y);
		log(scaleY, y, Y, y + height)
		for (t = 0; t < teamlen; t++) {
			bars[t].scale(1, scaleY, x, y);
		}
	}

	return bars;
};

Raphael.fn.grid = function (x, y, colour) {
	var attrs = {stroke: colour || '#CCC'},
		path = [];
	y = y || x;
	for (var i = 0; i < this.width; i += x) {
		path.push('M', i, 0, 'V', this.height);
	}
	for (var j = 0; j < this.height; j += y) {
		path.push('M', 0, j, 'H', this.width);
	}
	return this.path(path.join(',')).attr(attrs);
};
