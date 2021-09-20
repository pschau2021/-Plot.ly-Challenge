// Declare initial function.
function init() {
    // Populate dropdown options with all the individual ID's of the study subjects.
    d3.json("samples.json").then(function(data) {
        d3.select("#selDataset").selectAll("option")
            .data(data.names)
            .enter()
            .append("option")
            .html((d) => 
                `<option>${d}</option>`)
            // Create initial plot using the first study subject's ID.
            id = data.names[0];
            buildPlot(id);
    });
};

// Declare handler function to run when the dropdown value is changed.
function optionChanged(id) {
    buildPlot(id)
};

// Declare plotting function
function buildPlot(id){
    d3.json("samples.json").then(function(data) {
        // Get the index from the selected subject and use it to call the metadata and sample data from the JSON object.
        var index = data.names.indexOf(id);
        var meta = data.metadata[index];
        var sample = data.samples[index];
    
        // Collect information from the OTU samples found in the selected subject.
        var otuIds = sample.otu_ids;
        var otuLabels = sample.otu_labels;
        var sampleValues = sample.sample_values;
    
        // Collect metadata from the selected subject and save in an array
        var entries = Object.entries(meta);
        
        // Declare trace for the bar chart
        // X: Top 10 OTU sample values found in the selected subject.
        // Y: Top 10 OTU ID
        // Label: OTU labels
        var barTrace = {
            x: sampleValues.slice(0,10).reverse(),
            y: otuIds.slice(0,10).reverse().map(otuId => "OTU " + otuId),
            text: otuLabels.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h'
        };

        // Declare trace for the bubble chart
        // X: OTU sample values found in the selected subject.
        // Y: OTU ID
        // Label: OTU labels
        var bubTrace = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            // Format markers' size and color accordingly to the sample value of each OTU.
            marker: {
                size: sampleValues.map(value => value * 0.75),
                color: otuIds
            }
        };

        // Declare trace for the gauge chart
        // Value: Get 'wfreq' (washing frequency) from the metadata.
        // Rante: [null, 9]
        var gaugeTrace = {
                value: meta.wfreq,
                title: { text: "Belly Button Wahshing Frequency<br>Scrubs per Week" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: {visible: true, range: [null, 9], tickmode: "linear", nticks: 10},
                    steps: [
                        { range: [0,1], color: "rgb(247, 243, 236)"},
                        { range: [1,2], color: "rgb(243, 241, 229)"},
                        { range: [2,3], color: "rgb(233, 231, 202)"},
                        { range: [3,4], color: "rgb(229, 233, 177)"},
                        { range: [4,5], color: "rgb(213, 229, 149)"},
                        { range: [5,6], color: "rgb(184, 205, 139)"},
                        { range: [6,7], color: "rgb(135, 193, 128)"},
                        { range: [7,8], color: "rgb(133, 189, 139)"},
                        { range: [8,9], color: "rgb(128, 182, 134)"},
                    ]
                }
            };

        // Declare bar chart layout (axes titles)
        var barLayout = {
            xaxis: {
                title:{
                    text: "Sample values"
                }
            },
            yaxis: {
                title:{
                    text: "OTU ID"
                }
            }
        };
        // Declare bubble chart layout (axes titles)
        var bubLayout = {
            xaxis: {
                title:{
                    text: "OTU ID"
                }
            },
            yaxis: {
                title:{
                    text: "Sample values"
                }
            }
        };

        // Declare gauge chart layout
        var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };

        // Plot traces in the DOM 
        var barData = [barTrace];
        var bubData = [bubTrace];
        var gaugeData = [gaugeTrace];
        
        Plotly.newPlot("bar", barData, barLayout);
        Plotly.newPlot("bubble", bubData, bubLayout);
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
         
        // Empty metadata box
        d3.select("#sample-metadata").html("")
        // Populate the box with the selected subjects' metadata
        d3.select("#sample-metadata").selectAll("p")
            .data(entries)
            .enter()
            .append("p")
            .html((d) => 
                `<p>${d[0]}: ${d[1]}</p>`)
    });
};

// Run initial function when the program starts
init();
