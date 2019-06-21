function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(data => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var metaDataSample = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metaDataSample.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    console.log(Object.entries(data));
    Object.entries(data).forEach(([key, value]) => {metaDataSample
      .append("p").text(`${key}: ${value}`)
    });
    
    // Bonus: build the Gauge chart here: 
    buildGauge(data.WFREQ);
    console.log(data.WFREQ);
  });
    
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(data => {
    // console.log(data);
    // @TODO: Build a Bubble Chart using the sample data
    var otu_ids = data.otu_ids;
    var sample_values = data.sample_values;
    var otu_labels = data.otu_labels;

    // Bubble chart code below
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      type: 'scatter',
      text: otu_labels,
      marker: {size: sample_values, color: otu_ids}
    };

    var BubbleData = [trace1];

    var Bubble_layout = {
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        title: "Sample Value"
      },
      title: "<b> Belly Button Bubble Chart </b>",
      width: 1000
    };

    Plotly.newPlot("bubble", BubbleData, Bubble_layout, {responsive: true});

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var top_otu_ids = data.otu_ids.slice(0,10);
    var top_sample_values = data.sample_values.slice(0,10);
    var top_otu_labels = data.otu_labels.slice(0,10);

    // console.log(top_otu_ids);
    // console.log(top_sample_values);
    // console.log(top_otu_labels);

    // Pie Chart code below

    var trace2 = {
      values: top_sample_values,
      labels: top_otu_ids,
      type: "pie",
      textposition: "inside",
      hovertext: top_otu_labels
    };

    var PieData = [trace2];

    var Pie_layout = {
      title: "<b> Belly Button Pie Chart </b>"
    };

    Plotly.newPlot("pie", PieData, Pie_layout, {responsive: true});

  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
