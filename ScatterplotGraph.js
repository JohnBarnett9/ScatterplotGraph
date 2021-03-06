d3.json("cyclist-data.json").then(function(dataset){
	//dimensions of svg canvas
	const width = 1000;
	const height = 500;

	//create svg canvas
	const svg = d3.select("#root")
	.append("svg")
	.attr("width", width)
	.attr("height", height)
	.attr("style", "background-color: white;");

	//data boundaries X Axis
	//-1 to have 1 tick mark to left of 1994
	var minYear = d3.min(dataset, (d) => d['Year']) - 1;

	//+1 to have rightmost tick mark be 2016
	var maxYear = d3.max(dataset, (d) => d['Year']) + 1;


	//data boundaries Y Axis
	var minTime = d3.min(dataset, (d) => d['Time']);

	var maxTime = d3.max(dataset, (d) => d['Time']);

	/*
	parserMS is a function that takes a string as input
	and outputs a time formatted by teh specifier.
	parsedData is an array that contains the times of the dataset
	in specifier format.
	*/
	var specifier = "%M:%S";
	var parserMS = d3.timeParse(specifier);
	var parsedData = dataset.map(function(d){
		return parserMS(d['Time']);
	});

	//scale x data to fit on chart
	const xScale = d3.scaleTime()
	.domain([minYear, maxYear])
	.range([50, width - 50]);

	/*
	scale y data to fit on chart
	extent() outputs the min and max of an array
	*/
	const yScale = d3.scaleTime()
	.domain(d3.extent(parsedData))
	.range([50, height - 50]);


	//position X Axis
	var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
	svg.append("g")
	.attr("transform", "translate(30,"+(height - 60) +")")
	.call(xAxis);

	//position Y Axis
	var yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
	svg.append("g")
	.attr("transform", "translate(80, -10)")
	.call(yAxis);
	
	//X Axis Label
	svg.append("text")
	.attr("x", width / 2)
	.attr("y", height - 20)
	.text("Year");

	/*
	tricky code, translate() moves the axis and origin
	x and y: the text starts at 0,0
	transform:
		slide text 30 to the right
		slide text 300 down
		rotate text counter clockwise around the start of the text
	*/
	svg.append("text")
	.attr("x", 0)
	.attr("y", 0)
	.attr("transform", "translate(30, 300) rotate(-90)")
	.text("Time in Minutes");

	//data points
	svg.selectAll("circle")
	.data(dataset)
	.enter()
	.append("circle")
	.attr("cx", function(d, i){ 
		//transform Year 1994 to a number of pixels
		//+10 refines position of circles
		return xScale(d['Year']) + 10;
	})
	.attr("cy", function(d, i){
		//transform "mm:ss" to a number of pixels
		//-10 refines position of circles
		return yScale(parsedData[i]) - 10;
	})
	.attr("r", 6)
	.attr("fill", function(d){
		if(d['Doping'] === ""){
			return "#ff993e"; //orange
		}
		else{
			return "#4c92c3"; //blue
		}
	})
	.attr("stroke", "black")
	.attr("opacity", ".8")
	.on("mouseover", function(d){
		var tooltipDiv = d3.select("#myTooltip");
		tooltipDiv.transition()
		.duration(1)
		.style("opacity", .8); //semi see through

		var tooltipData = 
		d['Name'] + ": " + d['Nationality']
		+ "\nYear:" + d['Year'] + ", Time: " + d['Time'];
		if (d['Doping'] !== "") {
			//only add doping description if there is one
			//<br> not "\n"
			tooltipData = tooltipData + "<br><br>" + d['Doping'];
		}

		//tooltip appears next to mouse cursor
		tooltipDiv.html(tooltipData)
		.style("left", d3.event.pageX  + "px")
		.style("top", d3.event.pageY  + "px");
	})
	.on("mouseout", function(d){
		var tooltipDiv = d3.select("#myTooltip");
		tooltipDiv.transition()
		.duration(1)
		.style("opacity", 0); //initialize tooltip to be hidden
	});

	//color legend
	svg.append("text")
	.attr("x", 770)
	.attr("y", 300)
	.text("No doping allegations");

	svg.append("circle")
	.attr("cx", 980)
	.attr("cy", 295)
	.attr("r", 6)
	.attr("width", 10)
	.attr("height", 10)
	.attr("fill", "#ff993e")
	.attr("stroke", "black")
	.attr("opacity", ".8");

	svg.append("text")
	.attr("x", 770)
	.attr("y", 330)
	.text("Riders with doping allegations");

	svg.append("circle")
	.attr("cx", 980)
	.attr("cy", 325)
	.attr("r", 6)
	.attr("width", 10)
	.attr("height", 10)
	.attr("fill", "#4c92c3")
	.attr("stroke", "black")
	.attr("opacity", ".8");
	
	//title
	svg.append("text")
	.attr("x", 400)
	.attr("y", 20)
	.text("Doping in Professional Bicycle Racing")
	.style("font-size", "20px");

	svg.append("text")
	.attr("x", 470)
	.attr("y", 40)
	.text("35 Fastest times up Alpe d'Huez")
	.style("font-size", "15px");

	//tooltip being defined
	var toolTipDiv = d3.select("body")
	.append("div")
	.attr("id", "myTooltip")
	.style("opacity", 0);
});
