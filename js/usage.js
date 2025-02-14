// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
    .select('#usage-graph')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

var chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

// Step 3:
// Import data from the donuts.csv file
// =================================
d3.json('http://localhost:5000/trips_raw', function(error, tripsData) {
    if (error) throw error;

    // Step 4: Parse the data
    // Format the data and convert to numerical and date values
    // =================================
    // Create a function to parse date and time
    var parseTime = d3.timeParse('%d-%b');

    // Format the data
    var user_type_obj = tripsData.user_type;
    var trip_duration_obj = tripsData.trip_duration;
    var start_timestamp_obj = tripsData.start_timestamp;

    var d = [];
    var i = 0;
    for (var i in user_type_obj) {
        d[i] = {
            user_type: user_type_obj[i],
            trip_duration: trip_duration_obj[i],
            start_timestamp: start_timestamp_obj[i]
        };
    }
//console.log(d)
    // Step 5: Create Scales
    //= ============================================
    var xTimeScale = d3
        .scaleLinear()
        .domain(d3.extent(d, d => d.start_timestamp))
        .range([0, width]);

    var yLinearScale1 = d3
        .scaleLinear()
        .domain([0, d3.max(d, d => d.trip_duration)])
        .range([height, 0]);

    // var yLinearScale2 = d3
    //     .scaleLinear()
    //     .domain([0, d3.max(tripsData, d => d.user_type)])
    //     .range([height, 0]);

    // Step 6: Create Axes
    // =============================================
    var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat('%d-%b'));
    var leftAxis = d3.axisLeft(yLinearScale1);
    //var rightAxis = d3.axisRight(yLinearScale2);

    // Step 7: Append the axes to the chartGroup
    // ==============================================
    // Add bottomAxis
    chartGroup
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    // Add leftAxis to the left side of the display
    chartGroup.append('g').call(leftAxis);

    // Add rightAxis to the right side of the display
    // chartGroup
    //     .append('g')
    //     .attr('transform', `translate(${width}, 0)`)
    //     .call(rightAxis);

    // Step 8: Set up two line generators and append two SVG paths
    // ==============================================
    // Line generators for each line
    var line1 = d3
        .line()
        .x(d => xTimeScale(d.start_timestamp))
        .y(d => yLinearScale1(d.trip_duration));

    // var line2 = d3
    //     .line()
    //     .x(d => xTimeScale(d.date))
    //     .y(d => yLinearScale2(d.evening));

    // Append a path for line1
    chartGroup
        .append('path')
        .data([d])
        .attr('d', line1)
        .classed('line green', true);

        alert("done");
    // Append a path for line2
    // chartGroup
    //     .append('path')
    //     .data([tripsData])
    //     .attr('d', line2)
    //     .classed('line orange', true);
});
