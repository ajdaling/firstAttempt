var dataReturned = "";
var countryData = ""
var InstitutionNames = "";
var InstitutionValues = "";
var ResearcherNames = "";
var ResearcherValues = "";
var docNames = "";
var docValues = "";
var yearNames;
var yearValues;
var yearNamesOne;
var yearValuesOne;
var momNames;
var momValues;
var momNamesOne ;
var momValuesOne;
var oTable;


var sessionData = JSON.parse(localStorage.getItem("sessionData"));
if(!sessionData.repData){
	sessionData.repData = {};
	sessionData.repData.start_year = sessionData.start_year;
	sessionData.repData.end_year = sessionData.end_year;
	updateSessionData(sessionData);
}
var selectedCountry = "";

var this_qry = sessionData.mainQuery;
var main_qry = sessionData.mainQuery;
var instName = sessionData.intitution;
var resName = sessionData.researcher;
var thisCompName = sessionData.compName;
var docType = sessionData.docType;
var yearMin = sessionData.start_year;
var yearMax = sessionData.end_year;
var selectedCountry = sessionData.selectedCountry;
var topic1 = sessionData.topic1;
var topic2 = sessionData.topic2;
var topic3 = sessionData.topic3;
var topic4 = sessionData.topic4;
var topic5 = sessionData.topic5;
var topic6 = sessionData.topic6;
var topic7 = sessionData.topic7;
var topic8 = sessionData.topic8;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function capitalize(tstring) {
    return tstring.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};


var dataSet = [];

var myBubbleChart = bubbleChart();

var bubbleData = [];
var bullseyeData = [];
//
// Code for plotting charts
$.ajax({
	url: "http://"+config.host+":"+config.port+"/report/reportPage.sjs",
//			text: 'Document Types ' + '<a href="vizDemo2.html?this_qry='+this_qry+'&main_qry='+main_qry+'&instName='+instName+'&resName='+resName+'&docType=&yearMin='+yearMin+'&yearMax='+yearMax+'&selectedCountry='+selectedCountry+topic_url+'">Reset</a>'
//   url: "http://localhost:8931/reportPage.sjs?this_qry=(neurology%20OR%20neurosurgery)&main_qry=(neurology%20OR%20neurosurgery)&topic1=cell%20OR%20immun*&topic2=tissue&topic3=gene&topic4=acellular%20OR%20molecular&instName=mayo;harvard&resName=&docType=&yearMin=2000&yearMax=2017&selectedCountry=&topN=10",	type: "GET",
	dataType: 'json',
	xhrFields: { withCredentials: true },
	crossDomain: true,
	data: JSON.stringify(sessionData),
	success: function(retdata){
		console.log("complete");
		//console.log(retdata);
		dataSet = retdata.dataRows;
//		console.log(dataSet);
		var id = 0;
		for (i=0; i<dataSet.length; i++) {
			thisRow = dataSet[i];
			console.log("dataset "+thisRow[0]);
			if (thisRow[4]>0) {
				thisBubble = {};
				thisBubble.id = id;
				thisBubble.name = capitalize(thisRow[0]);
				thisBubble.sel = thisRow[1];
				thisBubble.iq = thisRow[2];
				thisBubble.peakYear = thisRow[3];
				thisBubble.number = thisRow[4];
				thisBubble.nameID = thisRow[10];
				thisBubble.dtype = 0;
				bubbleData.push(thisBubble);
				if (thisBubble.iq > 0) {
				thisBullseye = [];
				thisBullseye.push(thisBubble.iq-1);
				thisBullseye.push('Pubmed');
				thisBullseye.push(thisBubble.name);
				thisBullseye.push(thisBubble.number);
				thisBullseye.push(thisBubble.nameID);
 				bullseyeData.push(thisBullseye);
				}
				id += 1;
			}

			if (thisRow[5]>0) {
			thisBubble = {};
				thisBubble.id = id;
				thisBubble.name = capitalize(thisRow[0]);
				thisBubble.sel = thisRow[1];
				thisBubble.iq = thisRow[2];
				thisBubble.peakYear = thisRow[3];
				thisBubble.number = thisRow[5];
				thisBubble.nameID = thisRow[10];
				thisBubble.dtype = 1;
				bubbleData.push(thisBubble);
				if (thisBubble.iq > 0) {
				thisBullseye = [];
				thisBullseye.push(thisBubble.iq-1);
				thisBullseye.push('Patents');
				thisBullseye.push(thisBubble.name);
				thisBullseye.push(thisBubble.number);
				thisBullseye.push(thisBubble.nameID);
 				bullseyeData.push(thisBullseye);
				}
				id += 1;
			}

			if (thisRow[7]>0) {
			thisBubble = {};
				thisBubble.id = id;
				thisBubble.name = capitalize(thisRow[0]);
				thisBubble.sel = thisRow[1];
				thisBubble.iq = thisRow[2];
				thisBubble.peakYear = thisRow[3];
				thisBubble.number = thisRow[7];
				thisBubble.nameID = thisRow[10];
				thisBubble.dtype = 2;
				bubbleData.push(thisBubble);
				if (thisBubble.iq > 0) {
				thisBullseye = [];
				thisBullseye.push(thisBubble.iq-1);
				thisBullseye.push('Clinical Trials');
				thisBullseye.push(thisBubble.name);
				thisBullseye.push(thisBubble.number);
				thisBullseye.push(thisBubble.nameID);
 				bullseyeData.push(thisBullseye);
				}
				id += 1;
			}

			if (thisRow[8]>0) {
			thisBubble = {};
				thisBubble.id = id;
				thisBubble.name = capitalize(thisRow[0]);
				thisBubble.sel = thisRow[1];
				thisBubble.iq = thisRow[2];
				thisBubble.peakYear = thisRow[3];
				thisBubble.number = thisRow[8];
				thisBubble.nameID = thisRow[10];
				thisBubble.dtype = 3;
				bubbleData.push(thisBubble);
				if (thisBubble.iq > 0) {
				thisBullseye = [];
				thisBullseye.push(thisBubble.iq-1);
				thisBullseye.push('Grants');
				thisBullseye.push(thisBubble.name);
				thisBullseye.push(thisBubble.number);
				thisBullseye.push(thisBubble.nameID);
 				bullseyeData.push(thisBullseye);
				}
				id += 1;
			}

		}
		myBubbleChart('#vis',bubbleData);
		myBullsEye(bullseyeData);
		myTable();

	}
//	error: function() {
//		alert("error");
//	}
});


function myTable() {

	$(document).ready(function() {
		console.log("HERE");
		console.log(dataSet);
   	 $('#resultsTable').DataTable( {
      	  data: dataSet,
      	  columns: [
            	{ title: "Name" },
            	{ title: "Type" },
            	{ title: "Topic" },
            	{ title: "Peak Year" },
            	{ title: "Pubs" },
            	{ title: "Patents" },
            	{ title: "VC" },
            	{ title: "CTrials" },
            	{ title: "Grants" },
            	{ title: "Grant$" }
      	  ],
   			'iDisplayLength': 200
		     	 } );
	} );
}




/* bubbleChart creation function. Returns a function that will
 * instantiate a new bubble chart given a DOM element to display
 * it in and a dataset to visualize.
 *
 * Organization and style inspired by:
 * https://bost.ocks.org/mike/chart/
 *
 */
function bubbleChart() {
  // Constants for sizing
  var width = 940;
  var height = 400;
  var widthGraph = 800;
  var widthOffset = 0.5*(width-widthGraph);
  widthOffset = 0;
  widthGraph = 800;
  var heightGraph = 450;
  var heightOffset = 0.5*(height-heightGraph);
  console.log("in bubblechart");
  // tooltip for mouseover functionality
  var tooltip = floatingTooltip('gates_tooltip', 240);

  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  var center = { x: width / 2, y: height / 2 };

  var topicCenters = {
 		0: { x: 2*width/12, y: 3*height/8 },
 		1: { x: 4*width/12, y: 3*height/8 },
 		2: { x: 6*width/12, y: 3*height/8 },
 		3: { x: 8*width/12, y: 3*height/8 },
 		4: { x: 10*width/12, y: 3*height/8 }
  };

	var dtypeCenters = {
 		0: { x: 2*width/10, y: 3*height/8 },
 		1: { x: 4*width/10, y: 3*height/8 },
 		2: { x: 6*width/10, y: 3*height/8 },
 		3: { x: 8*width/10, y: 3*height/8 },
	  };

  // X locations of the topic titles.
  var topicsTitleX = {}
  topicsTitleX["ALL"] = 1*width/12;
  topicsTitleX[topic1.substring(0,20)+'...'] = 3*width/12;
  topicsTitleX[topic2.substring(0,20)+'...'] = 6*width/12;
  //topicsTitleX[topic3.substring(0,20)+'...'] = 8*width/12;
  //topicsTitleX[topic4.substring(0,20)+'...'] = 11*width/12;
  // X locations of the year titles.
  var dtypesTitleX = {
    "Pubmed":  			2*width/10,
    "Patents": 			4*width/10,
    "Clinical Trials":  6*width/10,
    "Grants":  			8*width/10
  };

  // Used when setting up force and
  // moving around nodes
  var damper = 0.102;

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var nodes = [];

  // Charge function that is called for each node.
  // Charge is proportional to the diameter of the
  // circle (which is stored in the radius attribute
  // of the circle's associated data.
  // This is done to allow for accurate collision
  // detection with nodes of different sizes.
  // Charge is negative because we want nodes to repel.
  // Dividing by 8 scales down the charge to be
  // appropriate for the visualization dimensions.
  function charge(d) {
    return -Math.pow(d.radius, 2.0) / 8;
  }

  // Here we create a force layout and
  // configure it to use the charge function
  // from above. This also sets some contants
  // to specify how the force layout should behave.
  // More configuration is done below.
  var force = d3.layout.force()
    .size([width, height])
    .charge(charge)
    .gravity(-0.01)
    .friction(0.9);


  // Nice looking colors - no reason to buck the trend
  var fillColor = d3.scale.ordinal()
    .domain(['low', 'medium', 'high'])
    .range(['#d84b2a', '#beccae', '#7aa25c']);

  // Nice looking colors - no reason to buck the trend
  var fillColor2 = d3.scale.linear()
    .domain([0,3,6,9,12,15,18,21,24])
    .range([
"#b2182b",
"#d6604d",
"#f4a582",
"#fddbc7",
"#f7f7f7",
"#d1e5f0",
"#92c5de",
"#4393c3",
"#2166ac"
]);

  // Sizes bubbles based on their area instead of raw radius
  var radiusScale = d3.scale.pow()
    .exponent(0.5)
    .range([2,15]);

  /*
   * This data manipulation function takes the raw data from
   * the CSV file and converts it into an array of node objects.
   * Each node will store data and visualization values to visualize
   * a bubble.
   *
   * rawData is expected to be an array of data objects, read in from
   * one of d3's loading functions like d3.csv.
   *
   * This function returns the new node array, with a node in that
   * array for each element in the rawData input.
   */
  function createNodes(rawData) {
    // Use map() to convert raw data into node data.
    // Checkout http://learnjsdata.com/ for more on
    // working with data.
    console.log("in create nodes");
	 console.log(rawData);
	 var id = 0;
    var myNodes = rawData.map(function (d) {
      console.log("data "+d.name+";"+d.number+";"+d.iq+";"+d.dtype);
      return {
        id: d.id,
        radius: radiusScale(+d.number),
        value: d.number,
        name: d.name,
        nameID: d.nameID,
        org: d.name,
//        group: d.group,
        group: d.dtype,
        topic: d.iq,
        dtype: d.dtype,

        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });

    // sort them to prevent occlusion of smaller nodes.
    myNodes.sort(function (a, b) { return b.value - a.value; });

    return myNodes;
  }

  /*
   * Main entry point to the bubble chart. This function is returned
   * by the parent closure. It prepares the rawData for visualization
   * and adds an svg element to the provided selector and starts the
   * visualization creation process.
   *
   * selector is expected to be a DOM element or CSS selector that
   * points to the parent element of the bubble chart. Inside this
   * element, the code will add the SVG continer for the visualization.
   *
   * rawData is expected to be an array of data objects as provided by
   * a d3 loading function like d3.csv.
   */
  var chart = function chart(selector, rawData) {
    console.log("in chart");
    // Use the max total_amount in the data as the max in the scale's domain
    // note we have to ensure the total_amount is a number by converting it
    // with `+`.
    var maxAmount = d3.max(rawData, function (d) { return +d.number; });
    radiusScale.domain([0, maxAmount]);

    nodes = createNodes(rawData);
    // Set the force's nodes to our newly created nodes array.
    force.nodes(nodes);

    // Create a SVG element inside the provided selector
    // with desired size.
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Bind nodes data to what will become DOM elements to represent them.
    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });

    // Create new circle elements each with class `bubble`.
    // There will be one circle.bubble for each object in the nodes array.
    // Initially, their radius (r attribute) will be 0.
    bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', function (d) { return fillColor2(d.nameID); })
      .attr('stroke', function (d) { return d3.rgb(fillColor2(d.nameID)).darker(); })
      .attr('stroke-width', 2)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);

    // Fancy transition to make bubbles appear, ending with the
    // correct radius
    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    // Set initial layout to single group.
    groupBubbles();
  };

  /*
   * Sets visualization in "single group mode".
   * The topic labels are hidden and the force layout
   * tick function is set to move all nodes to the
   * center of the visualization.
   */
  function groupBubbles() {
    hideTopics();
    hideDtypes();

    force.on('tick', function (e) {
      bubbles.each(moveToCenter(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    });

    force.start();
  }

  /*
   * Helper function for "single group mode".
   * Returns a function that takes the data for a
   * single node and adjusts the position values
   * of that node to move it toward the center of
   * the visualization.
   *
   * Positioning is adjusted by the force layout's
   * alpha parameter which gets smaller and smaller as
   * the force layout runs. This makes the impact of
   * this moving get reduced as each node gets closer to
   * its destination, and so allows other forces like the
   * node's charge force to also impact final location.
   */
  function moveToCenter(alpha) {
    return function (d) {
      d.x = d.x + (center.x - d.x) * damper * alpha;
      d.y = d.y + (center.y - d.y) * damper * alpha;
    };
  }

  /*
   * Sets visualization in "split by topic mode".
   * The topic labels are shown and the force layout
   * tick function is set to move nodes to the
   * topicCenter of their data's topic.
   */
  function splitBubbles() {
    hideDtypes();
    showTopics();

    force.on('tick', function (e) {
      bubbles.each(moveToTopics(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    });

    force.start();
  }

  /*
   * Sets visualization in "split by topic mode".
   * The topic labels are shown and the force layout
   * tick function is set to move nodes to the
   * topicCenter of their data's topic.
   */
  function splitBubblesDtype() {
    hideTopics();
    showDtypes();

    force.on('tick', function (e) {
      bubbles.each(moveToDtypes(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    });

    force.start();
  }

  /*
   * Helper function for "split by topic mode".
   * Returns a function that takes the data for a
   * single node and adjusts the position values
   * of that node to move it the topic center for that
   * node.
   *
   * Positioning is adjusted by the force layout's
   * alpha parameter which gets smaller and smaller as
   * the force layout runs. This makes the impact of
   * this moving get reduced as each node gets closer to
   * its destination, and so allows other forces like the
   * node's charge force to also impact final location.
   */
  function moveToTopics(alpha) {
    return function (d) {
      var target = topicCenters[d.topic];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

  /*
   * Helper function for "split by year mode".
   * Returns a function that takes the data for a
   * single node and adjusts the position values
   * of that node to move it the year center for that
   * node.
   *
   * Positioning is adjusted by the force layout's
   * alpha parameter which gets smaller and smaller as
   * the force layout runs. This makes the impact of
   * this moving get reduced as each node gets closer to
   * its destination, and so allows other forces like the
   * node's charge force to also impact final location.
   */
  function moveToDtypes(alpha) {
    return function (d) {
	   //console.log(d);
      var target = dtypeCenters[d.dtype];
		//console.log(target);
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

  /*
   * Hides Year title displays.
   */
  function hideTopics() {
    svg.selectAll('.topic').remove();
  }

  /*
   * Shows topic title displays.
   */
  function showTopics() {
    // Another way to do this would be to create
    // the topic texts once and then just hide them.
    var topicsData = d3.keys(topicsTitleX);
    var topics = svg.selectAll('.topic')
      .data(topicsData);

    topics.enter().append('text')
      .attr('class', 'topic')
      .attr('x', function (d) { return topicsTitleX[d]; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }
  /*
   * Hides Year title displays.
   */
  function hideDtypes() {
    svg.selectAll('.dtype').remove();
  }
  /*
   * Shows Year title displays.
   */
  function showDtypes() {
    // Another way to do this would be to create
    // the year texts once and then just hide them.
    var dtypesData = d3.keys(dtypesTitleX);
    var dtypes = svg.selectAll('.dtype')
      .data(dtypesData);

    dtypes.enter().append('text')
      .attr('class', 'dtype')
      .attr('x', function (d) { return dtypesTitleX[d]; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d; });
  }


  /*
   * Function called on mouseover to display the
   * details of a bubble in the tooltip.
   */
  function showDetail(d) {
    // change outline to indicate hover state.
    d3.select(this).attr('stroke', 'black');

    var content = '<span class="value">' +
                  d.name +
                  '</span><br/>' +
                  '<span class="name">Dtype: </span><span class="value">' +
                  addCommas(d.dtype) +
                  '</span><br/>' +
                  '<span class="name">topic: </span><span class="value">' +
                  d.topic +
                  '</span><br/>' +
                  '<span class="name">Number: </span><span class="value">' +
                  d.value +
                  '</span>';
    tooltip.showTooltip(content, d3.event);
  }

  /*
   * Hides tooltip
   */
  function hideDetail(d) {
    // reset outline
    d3.select(this)
      .attr('stroke', d3.rgb(fillColor2(d.group)).darker());

    tooltip.hideTooltip();
  }

  /*
   * Externally accessible function (this is attached to the
   * returned chart function). Allows the visualization to toggle
   * between "single group" and "split by topic" modes.
   *
   * displayName is expected to be a string and either 'topic' or 'all'.
   */
  chart.toggleDisplay = function (displayName) {
    if (displayName === 'topic') {
      splitBubbles();
    } else if (displayName === 'dtype') {
      splitBubblesDtype();
    } else {
      groupBubbles();
    }
  };


  // return the chart function from closure.
  return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */


/*
 * Function called once data is loaded from CSV.
 * Calls bubble chart function to display inside #vis div.
 */
//function display(error, data) {
//  if (error) {
//    console.log(error);
//  }
function displayBubbles(data) {
  myBubbleChart('#vis', data);
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');
		console.log("buttonId "+buttonId);

      // Toggle the bubble chart based on
      // the currently clicked button.
      myBubbleChart.toggleDisplay(buttonId);
    });
}

/*
 * Helper function to convert a number into a string
 * and add commas to it to improve presentation.
 */
function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}


// Load the data.
//d3.csv('data/gates_money.csv', display);

// setup the buttons.
setupButtons();




function myBullsEye(data) {
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function showData(point) {
        var data = point.data;
        var elem = document.getElementById('output');
        var html = '<table class=datatable>'
                   + '<tr><th colspan=2>Data</th></tr>'
                   + '<tr><td class=field>Institution: </td><td class=value>' + data[2] + '</td></tr>'
                   + '<tr><td class=field>Topic: </td><td class=value>' + slices[data[0]] + '</td></tr>'
                   + '<tr><td class=field>Doc  Type: </td><td class=value>' + data[1] + '</td></tr>'
                   + '<tr><td class=field>Documents: </td><td class=value>' + data[3] + '</td></tr>'
                   + '<tr><td class=field>Name ID" </td><td class=value>' + data[4] + '</td></tr>'
                   + '</table>';


        elem.innerHTML = html;
    }

//    var slices = ['Cell-based Therapies', 'Tissue-based Engineering', 'Gene-based Therapies', 'Acellular Therapies'];
//     var theaters = {
//        1: 'Cell-based Therapies',
//        2: 'Tissue-based Engineering',
//        3: 'Gene-based Therapies',
//        4: 'Acellular Therapies'
//    };
    var theaters = {
        1: 'Cell-based Therapies',
        2: 'Tissue-based Engineering',
        3: 'Gene-based Therapies',
        4: 'Acellular Therapies'
    };
    var bullseye = Raphael('canvas', 640, 600).bullseye({
        'slices': slices,
        'rings' : ['Clinical Trials','Patents','Pubs','Grants'],
        'startDegree': 0,
        'allowDrag': false,
        'onMouseOver': showData,
        'onPointClick': showData,
        'onSliceClick': function(sliceIdx) {
            alert("You've clicked on " + slices[sliceIdx]);
        }

    });
    var baseYear = 1940;
    //http://history1900s.about.com/od/worldwarii/a/wwiibattles.htm
    var olddata = [
        [0, 'Phase 1', 	'Mayo', 20, 'axis'],
        [1, 'Pubs', 	'Mayo', 3,  'axis'],
        [2, 'Patents', 'Mayo', 10, 'axis'],
        [3, 'Phase 2', 	'Mayo', 20, 'axis'],
        [0, 'Phase 1', 	'University of Pennsylvania', 20, 'axis'],
        [1, 'Pubs', 	'University of Pennsylvania', 3,  'axis'],
        [2, 'Patents', 'University of Pennsylvania', 10, 'axis'],
        [3, 'Phase 2', 	'University of Pennsylvania', 20, 'axis'],
        [0, 'Phase 1', 	'MD Anderson', 20, 'axis'],
        [1, 'Pubs', 	'MD Anderson', 3,  'axis'],
        [2, 'Patents', 'MD Anderson', 10, 'axis'],
        [3, 'Phase 2', 	'MD Anderson', 20, 'axis'],
        [0, 'Phase 1', 	'Harvard', 20, 'axis'],
        [1, 'Pubs', 	'Harvard', 3,  'axis'],
        [2, 'Patents', 'Harvard', 10, 'axis'],
        [3, 'Phase 2', 	'Harvard', 20, 'axis']
    ];


    var angle;
    var upper_bound, lower_bound;
	 var ring;
    for (var i = 0; i < data.length; i++) {
        switch(data[i][0]) {
            case 0:
                lower_bound = 5;
                upper_bound = 90;
                break;
            case 1:
                lower_bound = 90;
                upper_bound = 180;
                break;
            case 2:
                lower_bound = 180;
                upper_bound = 270;
                break;
            case 3:
                lower_bound = 270;
                upper_bound = 355;
                break;
        }
        switch(data[i][1]) {
            case 'Clinical Trials':
                ring = 0;
                break;
            case 'Patents':
                ring = 1;
                break;
            case 'Grants':
                ring = 2;
                break;
            case 'Pubmed':
                ring = 3;
                break;
        }

        angle = rand(lower_bound, upper_bound);

        // show positive angle when you hover over a point
        if (angle < 0) angle += 360;

		  size = data[i][3];


  // Nice looking colors - no reason to buck the trend
  var fillColor2 = d3.scale.linear()
    .domain([0,3,6,9,12,15,18,21,24])
    .range([
"#b2182b",
"#d6604d",
"#f4a582",
"#fddbc7",
"#f7f7f7",
"#d1e5f0",
"#92c5de",
"#4393c3",
"#2166ac"
]);

  // Sizes bubbles based on their area instead of raw radius
  var radiusScale = d3.scale.pow()
    .exponent(0.5)
    .range([2,5]);

        var point = bullseye.addPoint({
            label: " ",
            ring: ring,
            angle: angle * Math.PI / 180,
            pointFill: fillColor2(data[i][4]),
            pointSize: radiusScale(size/10),
            distance: .5
        });

        point.data = data[i];
    }

}
