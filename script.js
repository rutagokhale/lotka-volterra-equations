var a = 0.5;
var b = 0.05;
var c = 0.5;
var d = 0.05;

var deltaT = 0.1;

var initX = 35;
var initY = 50;

var population = [];
var maximumPopulation = 100;

// x --> prey population
//y --> predator population


var dxdt = function (x, y) {
    return x * (a - b * y);
}

var dydt = function (x, y) {
    return y * (d * x - c);
}

var lv = function () {
    var x = initX;
    var y = initY;

    for (var i = 0; i < 1000; i++) {

        population[i] = {
            preyPop: x,
            predatorPop: y,
            ts: i
        };

        x = x + deltaT * dxdt(x, y);
        y = y + deltaT * dydt(x, y);
    }
}

var maxPop = function () {
    var pops = [];

    pops[0] = d3.max(population, function (population) {
        return population.preyPop;
    });

    pops[1] = d3.max(population, function (population) {
        return population.predatorPop;
    });

    return Math.ceil(d3.max(pops) / 10) * 10;
}

//D3 ELEMENTS

d3.selectAll("input.sliders").on("input", function () {
    update(+this.value, this.id);
})

function update(val, id) {
    var sliderId = "#value-" + id[id.length-1];

    if (id[id.length-1] === "a" || id[id.length-1] === "c") {
        d3.select(sliderId).text(val / 10);
        window[id[id.length-1]] = val / 10;
    };

    if (id[id.length-1] === "b" || id[id.length-1] === "d") {
        d3.select(sliderId).text(val / 100);
        window[id[id.length-1]] = val / 100;

    };

    d3.select("#" + id).property("value", val);
}


function drawGraphs() {

    d3.select("#visualisation").selectAll("path").remove();
    d3.select("#visualisation").selectAll(".axis").remove();
    d3.select("#visualisation").selectAll(".grid").remove();
    d3.select("#visualisation").selectAll(".axestext").remove();
    d3.select("#visualisation").selectAll(".legend").remove();

    lv();
    maximumPopulation = maxPop();

    var xScale = d3.scaleLinear()
        .domain([0, 1000])
        .range([padding, width - padding]);

    var yScale = d3.scaleLinear()
        .domain([0, maximumPopulation])
        .range([height - padding, padding]);

    var xAxis = d3.axisBottom(xScale)
        .ticks(10);

    var yAxis = d3.axisLeft(yScale)
        .ticks(maximumPopulation / 10);

    function xGrid() {
        return d3.axisBottom(xScale);
    }

    function yGrid() {
        return d3.axisLeft(yScale);
    }

    var preyLine = d3.line()
        .x(function (d) {
            return xScale(d.ts);
        })
        .y(function (d) {
            return yScale(d.preyPop);
        });

    var predatorLine = d3.line()
        .x(function (d) {
            return xScale(d.ts);
        })
        .y(function (d) {
            return yScale(d.predatorPop);
        });

    //DISPLAY

    ///////////////////////////////////////




    vis.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

    vis.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis);

    vis.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xGrid()
            .tickSize(-(height - (2 * padding)))
            .tickFormat("")
        );

    vis.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + padding + ", 0)")
        .call(yGrid()
            .tickSize(-(width - (2 * padding)))
            .tickFormat("")
        );

    vis.append("text")
            .attr("class", "axestext")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (width / 2) + ", " + (height - padding / 3) + ")")
            .text("TIME");

    vis.append("text")
            .attr("class", "axestext")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (padding / 3) + ", " + (height / 2) + ")rotate(-90)")
            .text("POPULATION");

    vis.append("text")
            .attr("class", "legend")
            .attr("transform", "translate(" + padding * 3 + ", " + padding / 2 + ")")
            .text("Rabbit Population")
            .style("fill", "#99aeb5");

    vis.append("text")
            .attr("class", "legend")
            .attr("transform", "translate(" + padding * 7 + ", " + padding / 2 + ")")
            .text("Fox Population")
            .style("fill", "#ef6713");

    var preyGraph = vis.append("path")
            .data([population])
            .attr("class", "line")
            .attr("d", preyLine)
            .attr("stroke", "#99aeb5")
            .attr("stroke-width", 4)
            .attr("fill", "none");

    var preyGraphLen = preyGraph.node().getTotalLength();

    var predatorGraph = vis.append("path")
            .data([population])
            .attr("class", "line")
            .attr("d", predatorLine)
            .attr("stroke", "#ef6713")
            .attr("stroke-width", 4)
            .attr("fill", "none");

    var predatorGraphLen = predatorGraph.node().getTotalLength();


    preyGraph
        .attr("stroke-dasharray", preyGraphLen + " " + preyGraphLen)
        .attr("stroke-dashoffset", preyGraphLen)
        .transition()
            .duration(4000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

    predatorGraph
        .attr("stroke-dasharray", predatorGraphLen + " " + predatorGraphLen)
        .attr("stroke-dashoffset", predatorGraphLen)
        .transition()
            .duration(4000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

}


lv();
maximumPopulation = maxPop();
console.log(maximumPopulation);

var width = 960;
var height = 640;
var padding = 80;

var xScale = d3.scaleLinear()
    .domain([0, 1000])
    .range([padding, width - padding]);

var yScale = d3.scaleLinear()
    .domain([0, maximumPopulation])
    .range([height - padding, padding]);

var xAxis = d3.axisBottom(xScale)
    .ticks(10);

var yAxis = d3.axisLeft(yScale)
    .ticks(maximumPopulation / 10);

function xGrid() {
    return d3.axisBottom(xScale);
}

function yGrid() {
    return d3.axisLeft(yScale);
}

var preyLine = d3.line()
    .x(function (d) {
        return xScale(d.ts);
    })
    .y(function (d) {
        return yScale(d.preyPop);
    });

var predatorLine = d3.line()
    .x(function (d) {
        return xScale(d.ts);
    })
    .y(function (d) {
        return yScale(d.predatorPop);
    });


//DISPLAY

var vis = d3.select("#visualisation")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g")
        .attr("transform", "translate(0, 0)");

vis.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

vis.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis);

vis.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xGrid()
        .tickSize(-(height - (2 * padding)))
        .tickFormat("")
    );

vis.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(" + padding + ", 0)")
    .call(yGrid()
        .tickSize(-(width - (2 * padding)))
        .tickFormat("")
    );

vis.append("text")
        .attr("class", "axestext")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (width / 2) + ", " + (height - padding / 3) + ")")
        .text("TIME");

vis.append("text")
        .attr("class", "axestext")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (padding / 3) + ", " + (height / 2) + ")rotate(-90)")
        .text("POPULATION");

vis.append("text")
        .attr("class", "legend")
        .attr("transform", "translate(" + padding * 3 + ", " + padding / 2 + ")")
        .text("Rabbit Population")
        .style("fill", "#99aeb5");

vis.append("text")
        .attr("class", "legend")
        .attr("transform", "translate(" + padding * 7 + ", " + padding / 2 + ")")
        .text("Fox Population")
        .style("fill", "#ef6713");

vis.append("path")
        .data([population])
        .attr("class", "line")
        .attr("d", preyLine)
        .attr("stroke", "#99aeb5")
        .attr("stroke-width", 4)
        .attr("fill", "none");

vis.append("path")
        .data([population])
        .attr("class", "line")
        .attr("d", predatorLine)
        .attr("stroke", "#ef6713")
        .attr("stroke-width", 4)
        .attr("fill", "none");
