var log = (typeof console !== "undefined") ? console.log : function () {alert(Array.prototype.slice.apply(arguments).join(", "));};

Raphael.fn.g.formchart = function (x, y, width, height, values, opts) {
    opts = opts || {};
    var chart = this.set(),
        bars = this.set(),
		border,
		borderAttrs = {stroke: "#000", fill: "#000", "fill-opacity": 0},
		roundLabels,
		teamLabels,
        paper = this,
        colors = opts.colors || this.g.colors,
		isSimple = Raphael.is(values[0], 'array'),
        teamlen = values.length,
		roundlen = (isSimple ? values[0] : values[0].results).length,
		roundW = width / (roundlen - 1),
		teamH = height / (teamlen / 2),
		lossH = teamH * .15,
		X,
		Y = y,
		maxY = [],
		bar,
		colorIndex = 0,
		fin = function () {
			//console.log(this);
//			this.flag = paper.g.popup(this.data.x, this.data.y, this.data.name || "(name)").insertBefore(this);
		},
		fout = function () {
//			this.flag.animate({opacity: 0}, 300, function () {this.remove();});
		};

	// Loop through the teams and build their path objects
	for (var t = 0; t < teamlen; t++) {
		X = x;
		// Top and bottom co-ordinates are built separately then joined later
		var pathT = ['M', x],
			pathB = [],
			team = values[t],
			teamName = !isSimple && team.name || 'Team ' + (t + 1),
			teamResults = isSimple ? team : team.results,
			teamColor = !isSimple && team.color || colors[colorIndex];
		// Work out top/bottom position of path at each round
		for (var r = 0; r < roundlen; r++) {
			var cellV = teamResults[r],
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
		pathT = pathT.concat(pathB.reverse(), 'z');
		bar = this.path(pathT).attr({stroke: teamColor, fill: teamColor});//.hover(fin, fout);
		bar.data = {
//			x: x,
//			y: cellY,
			name: teamName,
			results: teamResults
		}
		bars[t] = bar;
		// Get the next colour
		colorIndex++;
		if (!colors[colorIndex]) {
			colorIndex = 0;
		}
	}
	// Check if any paths go outside the defined bounds of the grid
	// This can happen if there is an odd number of teams
	Y = Math.max.apply(Math, maxY);
//	log(Y);
	if (Y > y + height) {
		var scaleY = height / (Y - y);
		log(scaleY, y, Y, y + height)
		for (t = 0; t < teamlen; t++) {
			bars[t].scale(1, scaleY, x, y);
		}
	}

	// Add border
	if (opts.border !== false) {
		if (Raphael.is(opts.border, 'string')) {
			borderAttrs.stroke = opts.border;
		} else if (Raphael.is(opts.border, 'object')) {
			borderAttrs = opts.border;
		}
		border = this.rect(x, y, width, height).attr(borderAttrs);
	}

	// Event handling functions copied from g.bar.js
	chart.hover = function (fin, fout) {
		bars.hover(fin, fout);
		return this;
	};
	chart.click = function (f) {
		bars.click(f);
		return this;
	};
	chart.each = function (f) {
		if (!Raphael.is(f, "function")) {
			return this;
		}
		for (var i = bars.length; i--;) {
			f.call(bars[i]);
		}
		return this;
	};
	chart.push(bars, border);
	chart.bars = bars;
	chart.border = border;

	return chart;
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
