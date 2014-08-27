//Taken from d3.gantt By Dimitry Kudrayvtsev
//START WORKING HERE -AT
var margin = { //MAY NEED TO ADJUST
    top : 20,
    right : 40,
    bottom : 20,
    left : 150
};
var timeDomainStart = d3.time.day.offset(new Date(),-3);
var timeDomainEnd = d3.time.hour.offset(new Date(),+3);
var timeDomainMode = "fixed";
var tickFormat = "%H:%M";
var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
        .tickSize(8).tickPadding(8);
var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
var x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);
var y = d3.scale.ordinal().rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1); //SET DOMAIN
var timeDomain = 10; //ARBITRARY LENGTH FOR INITIAL TIMELINE, CHOOSE BETTER TIME
var initAxis = function() {
    x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);
    y = d3.scale.ordinal()rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1); //SET DOMAIN
    xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
        .tickSize(8).tickPadding(8);
    yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
    };

//To go with restart(), task_rectangle() insert
/*.on('click', function() { //BREAKS AUTHORING OF RECTANGLES
            $(this).popover('toggle'){
            title: 'New Event',
            placement: 'right',
            content: '<button id="delete">Delete</button>'
            }).parent().delegate('button#delete', 'click', function() {
                //ADD DELETE CODE
            })
        })*/