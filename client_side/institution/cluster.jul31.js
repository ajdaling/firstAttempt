var dataReturned = "";
var countryData = "";
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
var momNamesOne;
var momValuesOne;


var yearChart;
var weightChart;


var topics = [];
var topicYear = [];


var wordNum = 0;
var topicNum = 0;

topics[topicNum] = [];

for (i = 0; i < 10; i++) {
  topics[topicNum][i] = [];
  topics[topicNum][i][0] = "n/a";
  topics[topicNum][i][1] = 0;

  topicYear[i] = [];
  for (j = 0; j < 13; j++) {
    topicYear[i][j] = 0;
  }
}

var instList;
var wordList;
var yearList;

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null
}

var docNum = getURLParameter('docNum');
var abs = getURLParameter('abstract');
var title = getURLParameter('title');
var mesh = getURLParameter('meshterms');
var features = getURLParameter('features');
var percent = getURLParameter('percent');

console.log('abstract is');
console.log(abs);

if(docNum > 15000) {
	docNum=15000;
}

sessionData.clusterData={};
sessionData.clusterData.numDocs=docNum;
sessionData.clusterData.title=title;
sessionData.clusterData.mesh=mesh;
sessionData.clusterData.abs=abs;
sessionData.clusterData.features=features;
sessionData.clusterData.percent=percent;


$.ajax({

    //url: config.dataURL+"/institution/instVsAll_rates.sjs",

	crossDomain: true,
    xhrFields: {
  	  withCredentials: true,
    },
	url: "https://marklogic.superhindex.com:8501/cluster/clusterRequest.sjs",
    type: "GET",
    data:JSON.stringify(sessionData),
    timeout: 200000,
    async: false,
    success: function(retdata){
		var test3 = JSON.parse(retdata[1]);
		var second = retdata[1];
		instList = test3.instDict;
		wordList = test3.wordDict;
		yearList = test3.yearDict;
		clusteryear(yearList);
		clusterword(wordList);
		myTable();
    },
    error: function() {
    	alert("error");
    }
});

function clusteryear(year) {
  for (i = 0; i < year.length; i++) {
    //console.log(data[i

    if (year[i].Topic < 10 && year[i].Year > 2004) {
      //console.log("Topic = "+data[i].Topic);
      //	console.log("Number = "+data[i].Number);
      //	console.log("Year = " + data[i].Year +" normalized to: " +(data[i].Year - 2005));
      topicYear[year[i].Topic][year[i].Year - 2005] = year[i].Number;
      //yearChart.series[data[i].Topic].data[data[i].Year - 2005].update(data[i].Number);
		if(year[i].Topic < 10 && year[i].Year > 2000){
		    topicYear[year[i].Topic][year[i].Year - 2000] = year[i].Number;
		}
    }

  }
}

function clusterword(mydata) {
console.log("loading wieght chart");
	for(k = 0; k < mydata.length; k++){
		topics[topicNum][wordNum][0] = mydata[k].word;
		topics[topicNum][wordNum][1] = mydata[k].weight;
		wordNum++;
		if(wordNum === 10){
			wordNum = 0;
			topicNum++;
			topics[topicNum] = [];
			for(i = 0; i < 10; i++){
				topics[topicNum][i] = [];
				topics[topicNum][i][0] = "n/a";
				topics[topicNum][i][1] = 0;
			}
		}
	}
	drawWeightChart();
	drawYearChart();
	var oPlus = 1;
	for(o = 0; o < topics[0].length; o++){
		document.getElementById('mySelect').innerHTML += "<option value=\""+o+"\">Topic " + oPlus ;
		oPlus++;
	}
  console.log("loading wieght chart");
  console.log(mydata);
  for (k = 0; k < mydata.length; k++) {
    //console.log(data[i


    //console.log("Topic = "+data[i].Topic);
    //	console.log("Number = "+data[i].Number);
    //	console.log("Year = " + data[i].Year +" normalized to: " +(data[i].Year - 2005));

    //topic[ TOPIC NUMBER ][ WORDNUM ][ WORD/WEIGHT ]
    //           0-9         0-9       0 or 1
    //   data[i].Topic    (wordNUM)  	.word / .weight

    //console.log("Topic = " +  mydata[i].Topic);
    //console.log("Word = " + mydata[i].word);
    //console.log("Weight = " + mydata[i].weight);
    //weightChart.series[0].data[data[i].Topic].update(data[i].weight);

    console.log("topics[" + topicNum + "][" + wordNum + "][0] = " + mydata[k].word);
    console.log("topics[" + topicNum + "][" + wordNum + "][1] = " + mydata[k].weight);


    topics[topicNum][wordNum][0] = mydata[k].word;
    topics[topicNum][wordNum][1] = mydata[k].weight;

    //topic0Words[wordNum] = data[i].word;
    //topic0Weights[wordNum] = data[i].weight;


    //weightChart.series[0].data[data[i].Topic].update(data[i].weight);
    wordNum++;
    //yearChart.series[data[i].Topic].data[data[i].Year - 2005].update(data[i].Number);


    //}else if(data[i].Topic < 10){
    //weightChart.series[0].data[data[i].Topic].update(data[i].weight);
    //}


    if (wordNum === 10) {
      //console.log("wordNum = " + wordNum );
      wordNum = 0;
      //console.log("now...wordNum = " + wordNum );
      //console.log("topicNum = " + topicNum );
      topicNum++;
      //console.log("now...topicNum = " + topicNum );
      //console.log("creating a new matrix at topic[" + topicNum + "]");
      topics[topicNum] = [];
      //console.log("created topic[" + topicNum + "] succesfully!");
      //console.log("entering for loop");
      for (i = 0; i < 10; i++) {
        //console.log("creating a new matrix at topic[" + topicNum + "][" + i + "]");
        topics[topicNum][i] = [];
        //console.log("created topic[" + topicNum + "][" + i + "] successfully!");
        topics[topicNum][i][0] = "n/a";
        topics[topicNum][i][1] = 0;
      }
    }
  }
  console.log("loaded weight chart");
  console.log("building options list");

  drawWeightChart();
  drawYearChart();

  var oPlus = 1;
  for (o = 0; o < topics[0].length; o++) {
    document.getElementById('mySelect').innerHTML += "<option value=\"" + o + "\">Topic " + oPlus;
    oPlus++;
  }
  //   return topic;
}

function drawYearChart() {

	yearChart = Highcharts.chart('yearBar', {

		title: {
				text: 'Topics by Year'
		},
		subtitle: {
				text: 'Source: Super-H'
		},
		yAxis: {

				title: {
						text: 'Documents'
				}
		},
		xAxis: {
				categories: [
						'2000',
						'2001',
						'2002',
						'2003',
						'2004',
						'2005',
						'2006',
						'2007',
						'2008',
						'2009',
						'2010',
						'2011',
						'2012',
						'2013',
						'2014',
						'2015',
						'2016',
						'2017'
				],
				crosshair: true
		},
		legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle'
		},
		plotOptions: {
				series: {
						pointStart: 2000
				}
		},
		series: [{
				name: 'Topic 1',
				data: topicYear[0]

		}, {
				name: 'Topic 2',
				data: topicYear[1]

		}, {
				name: 'Topic 3',
				data: topicYear[2]

		}, {
				name: 'Topic 4',
				data: topicYear[3]

		}, {
				name: 'Topic 5',
				data: topicYear[4]

		}, {
				name: 'Topic 6',
				data: topicYear[5]

		}, {
				name: 'Topic 7',
				data: topicYear[6]

		}, {
				name: 'Topic 8',
				data: topicYear[7]

		}, {
				name: 'Topic 9',
				data: topicYear[8]

		}, {
				name: 'Topic 10',
				data: topicYear[9]

		}]

	});

}


function drawWeightChart() {

  weightChart = Highcharts.chart('wordWeight', {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Topic 1'
      //weightChart.setTitle({text: "New Title"});
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }
    },
    series: [{
      name: 'Weight',
      colorByPoint: true,
      data: [{
        name: topics[0][0][0], //weightChart.series[0].data[0].update("newName")
        y: topics[0][0][1]
        //weightChart.series[0].data[0].update(int)
        //  sliced: true,
        //  selected: true
      }, {
        name: topics[0][1][0],
        //weightChart.series[0].data[1].update("newName")
        y: topics[0][1][1]
        //weightChart.series[0].data[1].update(int)
      }, {
        name: topics[0][2][0],
        y: topics[0][2][1]
      }, {
        name: topics[0][3][0],
        y: topics[0][3][1]
      }, {
        name: topics[0][4][0],
        y: topics[0][4][1]
      }, {
        name: topics[0][5][0],
        y: topics[0][5][1]
      }, {
        name: topics[0][6][0],
        y: topics[0][6][1]
      }, {
        name: topics[0][7][0],
        y: topics[0][7][1]
      }, {
        name: topics[0][8][0],
        y: topics[0][8][1]
      }, {
        name: topics[0][9][0],
        y: topics[0][9][1]
      }]
    }]
  });








}

function myFunction() {

  var x = document.getElementById("mySelect").value;
  //document.getElementById("demo").innerHTML = "You selected: " + x;

  //name: topic[0][0][0],
  //y: 		topic[0][0][1]
  console.log("Changed... x = " + x);
  console.log(topics);



  //HIDE OTHER LINES IN yearChart
  drawYearChart();
  for (i = 0; i < topicYear.length; i++) {

    if (i != x) {
      yearChart.series[i].hide();
      console.log("removing yearChart.series[" + i + "]");
    }
  }


  var i = 0;
  for (m = 0; m < 10; m++) { 
    console.log("Changing data[" + m + "] name to + " + topic[x][i][0]);

    weightChart.series[0].data[m].name = topic[x][i][0];
    console.log("success!");
    console.log("Changing data[" + m + "] value to + " + topic[x][i][1]);
    weightChart.series[0].data[m].update(topic[x][i][1]); 
    console.log("Changing data[" + m + "] name to + " + topics[x][i][0]);

    weightChart.series[0].data[m].name = topics[x][i][0];
    console.log("success!");
    console.log("Changing data[" + m + "] value to + " + topics[x][i][1]);
    weightChart.series[0].data[m].update(topics[x][i][1]); 
    console.log("success!");
    i++;
  }
  x++;
  weightChart.setTitle({
    text: "Topic " + x
  });
}


//topic[0].push(["hello", 5]);

//var topicWordsAndWeights = [new Array(10), new Array(10), new Array(10)];

var oTable;
var drewTable = false;

var selectedCountry = "";

var sessionData = JSON.parse(localStorage.getItem("sessionData"));
if (!sessionData.vizData) {
  sessionData.vizData = {};
  sessionData.vizData.start_year = sessionData.start_year;
  sessionData.vizData.end_year = sessionData.end_year;
  updateSessionData(sessionData);
}


$(document).ready(function() {

  // Build the chart
  drawWeightChart();
  drawYearChart();
});
/*
yearChart = Highcharts.chart('yearBar', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Topics by Year'
    },
    subtitle: {
        text: 'Source: Super-H'
    },
    xAxis: {
        categories: [
						'2005',
            '2006',
            '2007',
            '2008',
            '2009',
            '2010',
            '2011',
            '2012',
            '2013',
            '2014',
            '2015',
            '2016',
            '2017'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Documents'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Topic 1',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }, {
        name: 'Topic 2',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }, {
        name: 'Topic 3',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }, {
        name: 'Topic 4',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }, {
        name: 'Topic 5',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }, {
        name: 'Topic 6',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }, {
        name: 'Topic 7',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }, {
        name: 'Topic 8',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }, {
        name: 'Topic 9',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }, {
        name: 'Topic 10',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }]
});
*/


var test_table;
var test_table1;
var test1 = "hello";
var test2 = "500";
test_table = [{
  "Topics": "1"
}, {
  "Top Words": "hello,please,test"
}, {
  "Number of Documents": "50"
}, {
  "Top Investigators": "OSU"
}];
test_table1 = [
  ["1", "hello,please,test", test2, "OSU"]
];

var table_data = [];
var top_words = [];
var doc_nb = 0;
var top_inst;

for (var i = 0; i < 10; i++) {

  top_words[0] = topics[i][0][0];
  top_words[1] = topics[i][1][0];
  top_words[2] = topics[i][2][0];

  for (var j = 0; j < 12; j++) {
    doc_nb = doc_nb + topicYear[i][j];
  }

  table_data[i] = [i + 1, top_words[0] + ", " + top_words[1] + ", " + top_words[2], doc_nb];

    top_words[0]=topics[i][0][0];
    top_words[1]=topics[i][1][0];
    top_words[2]=topics[i][2][0];
    top_words[3]=topics[i][3][0];
    top_words[4]=topics[i][4][0];
    top_words[5]=topics[i][5][0];
    top_words[6]=topics[i][6][0];
    top_words[7]=topics[i][7][0];
    top_words[8]=topics[i][8][0];
    top_words[9]=topics[i][9][0];
    
    
    for (var j = 0; j<12; j++) {
	doc_nb = doc_nb + topicYear[i][j];
    }
	
    table_data[i]=[i+1,doc_nb,top_words[0]+", "+top_words[1]+", "+top_words[2]+ ", " +top_words[3] +", " +top_words[4]+ ", "+ top_words[5] + ", " + top_words[6] + ", " + top_words[7] + ", " + top_words[8] + ", " + top_words[9]];
    doc_nb=0;
		   
    
}

console.log("table is:");
console.log(table_data);

function myTable() {

    $(document).ready(function() {
	$('#topicTable').DataTable( {
	    data: table_data,
	    columns: [
		{title: "Topic Number"},
		{title: "Documents (since 2000)"},
		{title: "Associated Words"},

	    ],
	});
  });
}


console.log("compName "+sessionData);
//$("#inst-title").text("Selected Institution: " + sessionData.instData.compName.toUpperCase());
var this_qry = sessionData.mainQuery;
var main_qry = sessionData.mainQuery;
var instName = sessionData.intitution;
var resName = sessionData.researcher;
//var thisCompName = sessionData.instData.compName;
var docType = sessionData.docType;
var yearMin = sessionData.start_year;
var yearMax = sessionData.end_year;
var selectedCountry = sessionData.selectedCountry;
//var topics = {};
for (var i = 0; i < 99; i++) {
  var topStr = "topic" + String(i);
  var labStr = "label" + String(i);
  var tmpObj = {};
  if (sessionData.topStr) {
    tmpObj.topic = sessionData[topStr];
    if (sessionData.labStr) {
      tmpObj.label = sessionData[labStr];
    }
    //topics[topStr] = tmpObj;
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalize(tstring) {
  return tstring.replace(/(?:^|\s)\S/g, function(a) {
    return a.toUpperCase();
  });
};

createTable();


function createTable(callback) {
  console.log("creating dt");
  if (!drewTable) {
    drewTable = true;
    oTable = $('#doc-subset-table').DataTable({
      serverSide: true,
      ajax: {
        type: "GET",
        crossDomain: true,
        xhrFields: {
          withCredentials: true,
        },
        url: "https://" + config.host + ":" + config.port + "/docMaster/datatables.sjs",
        data: sessionData,

      },

      "scrollY": '60vh',
      "scrollX": false,
      "scrollCollapse": true,
      "order": [
        [0, "desc"]
      ],
      "columnDefs": [

        {
          "render": function(data, type, row) {
            data = data.replace(";", "");
            data = data.replace(",", "");
            var odata = data;
            data = data.toLowerCase();
            return '<a onclick="clickInst(this)" id="' + odata + '" href="#">' + data + '</a>';
          },
          "targets": 2
        },
        {
          targets: 4,
          render: function(data, type, row) {
            console.log(row[5]);
            return '<a onclick = "clickDoc(this)" class = "' + row[5] + '" id = "' + row[6] + '" href="#" target="_blank">' + data + '</a>';
          }
        },

      ]
    });
  }
}
var dataReturned = "";

 $.ajax({
        url: config.dataURL+"/institution/inst_info2.sjs",
//        url: "https://"+config.host+":"+config.port+"/institution/inst_info2.sjs",
//	 	url: "http://"+config.host+":"+config.port+"/test.sjs",
        type: "GET",
    	xhrFields: { withCredentials: true },
    	data: JSON.stringify(sessionData),
		  dataType: 'json',
        success: function(retdata){

		   	console.log("complete");
            console.log(retdata);
				//console.log(retdata["instName"]);
				numTotal = retdata["total"];
				numPubmed = retdata["numPubmed"];
				numPatent = retdata["numPatent"];
				numNsf = retdata["numNsf"];
				var numNih = retdata["numNih"];
				console.log("numNih " +numNih);
				numCTrials = retdata["numCTrials"];
				numTotal = retdata["total"];
				if (numPubmed === undefined) numPubmed = 0;
				if (numPatent === undefined) numPatent = 0;
				if (numNsf === undefined) numNsf = 0;
				if (numCTrials === undefined) numCTrials = 0;
				if (numNih === undefined) numNih = 0;


				//console.log(Object.getOwnPropertyNames(instData));
				var x = document.getElementById("inst_summary_data").rows[2].cells;
				x[1].innerHTML = numTotal
				x = document.getElementById("inst_summary_data").rows[3].cells;
				x[1].innerHTML = numPubmed;
				x = document.getElementById("inst_summary_data").rows[4].cells;
				x[1].innerHTML = numPatent;
				x = document.getElementById("inst_summary_data").rows[5].cells;
				x[1].innerHTML = numNih;
				x = document.getElementById("inst_summary_data").rows[6].cells;
				x[1].innerHTML = numNsf;
				x = document.getElementById("inst_summary_data").rows[7].cells;
				x[1].innerHTML = numCTrials;
        }
		  //error: function() {
		  // alert("error");
		  //}
		});
//document.getElementById("title").innerHTML = "Detailed Data for Institution: "+capitalize(decodeURI(pars.thisCompName));



//
// Code for plotting charts
$.ajax({

//	url: "https://"+config.host+":"+config.port+"/institution/instVsAll_rates.sjs",
        url: config.dataURL+"/institution/instVsAll_rates.sjs",
	type: "GET",
	xhrFields: { withCredentials: true },
	data: JSON.stringify(sessionData),
	dataType: 'json',
	success: function(retdata){
		console.log("complete");
		console.log(retdata);
		yearNames = retdata.main.yearNames;
		yearValues = retdata.main.yearValues;
		yearNamesOne = retdata.oneInst.yearNames;
		yearValuesOne = retdata.oneInst.yearValues;
		momNames = retdata.main.momentumKeys;
		momValues = retdata.main.momentumVals;
		momNamesOne = retdata.oneInst.momentumKeys;
		momValuesOne = retdata.oneInst.momentumVals;
//		console.log(Institution_Name,retdata.InstitutionNames,retdata,InstitutionValues);
		my_chart();
//		my_chart(parsed_response);

	}
//	error: function() {
//		alert("error");
//	}
});
