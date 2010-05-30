Experimental
===
(This is just for personal reference at the moment)

Usage
---

	var chart = r.g.formchart(chartX:float, chartY:float, chartWidth:float, chartHeight:float, teams:array, options:object(optional));

### Teams
#### Syntax 1
	teams = [results1:array, results2:array, ...];

#### Syntax 2
	teams = [team1:object, team2:object, ...];

#### Results
	results = [0,0,2,2,1,0,...]; // (0 = Loss, 1 = Draw, 2 = Win)

#### Team Object
	teamObj = {
		results: resultsArray, // required
		name: "Team 1", // string - optional
		color: "#000" // string - optional - any valid Raphael color string, will override default colour options (see below)
	};


### Options
	options = {
		colors: ["red", "hsb(1,2,3)", ...] // array - optional - colours to use for the chart bars
	};
