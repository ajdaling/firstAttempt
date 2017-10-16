var dataReturned = "";
var countryData = ""
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
var rowIndex = 1;
var returnedData;
//var column = 0;

var annotations = {};

annotations.my_rate_text1 = "Activity vs Year - Selected Organizations";
annotations.my_rate_text2 = "Activity vs Year - Top Organizations";

annotations.my_accel_text = "Acceleration - Selected Organizations";
annotations.my_accel_topN_text = "Acceleration - Top Organizations";

annotations.my_vol_text = "Volume - Selected Organizations";
annotations.my_vol_topN_text = "Volume - Top Organizations";

annotations.my_bullseye_text = "Bullseye - Selected Organizations";
annotations.my_bullseye_topN_text = "Bullseye - Top Organizations";

annotations.my_table_text = "Table";
annotations.my_rate_text = "Activity vs Year";


for(var i = 0; i < sessionData.topics.length; i++){
	for(var j = 0; j < 2; j++){
		if( j == 0){
			annotations["my_rate"+String(i)+"-"+String(j)+"_text"] = "Activity vs Year in Topic: " + sessionData.topics[i].label + " - Selected Organizations";
		}else{
			annotations["my_rate"+String(i)+"-"+String(j)+"_text"] = "Activity vs Year in Topic: " + sessionData.topics[i].label + " - Top Organizations";
		}
	}
}

var sessionData = JSON.parse(localStorage.getItem("sessionData"));
if(!sessionData.repData){
	sessionData.repData = {};
}
if(!sessionData.repData.annot){
	sessionData.repData.annot = JSON.parse(JSON.stringify(annotations));
	updateSessionData(sessionData);
}else{
	//TODO remove this if block when old saved sessions are deleted
	if(!sessionData.repData.annot.my_accel_topN_text){
		console.log("You have an old version of saved sessions.");
		delete sessionData.repData.annot;
		sessionData.repData.annot = annotations;
		updateSessionData(sessionData);
	} else{
		//do nothing

	}
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
var numTopics = 0;
if(sessionData.topics){
   for(var i in sessionData.topics){
      numTopics += 1;
      var idx = sessionData.topics[i].index;
      if(idx == 0) topic1 = sessionData.topics[idx].value;
      if(idx == 1) topic2 = sessionData.topics[idx].value;
      if(idx == 2) topic3 = sessionData.topics[idx].value;
      if(idx == 3) topic4 = sessionData.topics[idx].value;
      if(idx == 4) topic5 = sessionData.topics[idx].value;
      if(idx == 5) topic6 = sessionData.topics[idx].value;
      if(idx == 6) topic7 = sessionData.topics[idx].value;
      if(idx == 7) topic8 = sessionData.topics[idx].value;
   }
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function capitalize(tstring) {
	if(tstring){
	    return tstring.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
	}
	else{
		return("");
	}
};


var dataSet = [];

var allBubbleData = [];
var bubbleData = [];
var bullseyeData = [];
bullseyeData[0] = new Array(0);
bullseyeData[1] = new Array(0);

var accelVals = [];
accelVals[0] = new Array(0);
accelVals[1] = new Array(0);

var accelVals_t = [];
accelVals_t[0] = new Array(0);
accelVals_t[1] = new Array(0);
for (i=0; i<numTopics; i++) {
	accelVals_t[0][i] = new Array(0);
	accelVals_t[1][i] = new Array(0);
}

var volVals = [];
volVals[0] = new Array(0);
volVals[1] = new Array(0);

var volVals_t = [];
volVals_t[0] = new Array(0);
volVals_t[1] = new Array(0);
for (i=0; i<numTopics; i++) {
	volVals_t[0][i] = new Array(0);
	volVals_t[1][i] = new Array(0);
}

var InstitutionNames = [];
InstitutionNames[0] = new Array(0);
InstitutionNames[1] = new Array(0);


var allRates = [];
allRates[0] = new Array(0);
allRates[1] = new Array(0);

var rateData = [];
rateData[0] = new Array(0);
rateData[1] = new Array(0);
for (i=0; i<numTopics; i++) {
	rateData[0][i] = new Array(0);
	rateData[1][i] = new Array(0);
}
var fullDataSet = []
//
// Code for plotting charts
console.log(sessionData);

console.log(sessionData);

$(".form-control").focusout(function(){
	saveAnnotations();
	console.log("saving");
})

var ajaxResults = [];
for (var reportTopN = 0; reportTopN<2; reportTopN++) {
 sessionData["reportTopN"]=reportTopN;
 for (var reportControl = 0; reportControl<numTopics+1; reportControl++) {
  sessionData["reportControl"]=reportControl;
  var asyncResult = $.ajax({
	url: config.dataURL+"/report/reportPageTopic.sjs",
	dataType: 'json',
	async: true,
	type: 'get',
	xhrFields: { withCredentials: true },
	crossDomain: true,
	data: JSON.stringify(sessionData),
	success: function(retdata){
		console.log(retdata);
		dataSet = retdata.dataRows;
		//console.log(dataSet);
		var id = 0;
		var thisTopic = retdata.topic + 1;
		var thisTopN = retdata.topN;
		for (i=0; i<dataSet.length; i++) {
			thisRow = dataSet[i];
			fullDataSet.push(thisRow);
//
// All docs
			allBubble = {};
			allBubble.id = id;
			console.log(thisRow[0]);
			if(thisRow[0] != null){
				allBubble.name = capitalize(thisRow[0]);
			} else{
				allBubble.name = "";
			}
			allBubble.sel = thisRow[1];
			allBubble.iq = thisRow[2];
			thisTopic = thisRow[2];
			allBubble.peakYear = thisRow[3];
			allBubble.number = thisRow[4]+thisRow[5]+thisRow[6]+thisRow[7]+thisRow[8];
			allBubble.nameID = thisRow[12];
			allBubble.accel = +(thisRow[13].toPrecision(2));
//			allBubble.accel = thisRow[13];
			console.log("accel "+allBubble.accel);
			allBubble.dtype = 0;
			var nameFound = false;
			var nameInd = -1;
			for (iname=0; iname<InstitutionNames[thisTopN].length; iname++) {
				if (allBubble.name == InstitutionNames[thisTopN][iname]) {
					nameFound = true;
					nameInd = iname;
				}
			}
			if (!nameFound) nameInd = InstitutionNames[thisTopN].length;
			var thisName = "ALL";
			if (allBubble.iq > 0) {
				thisName = allBubble.iq;
			}

			if (allBubble.iq == 0) {
				dataPacket = [];
				thisData = thisRow[14]
				for (year in thisData) {
					dataPacket.push([+year,thisData[year]]);
				}
				console.log("thistopN "+thisTopN);
				allRates[thisTopN].push({
         		 name:allBubble.name ,
         		 data: dataPacket,
					 color: Highcharts.Color(Highcharts.getOptions().colors[nameInd]).setOpacity(0.5).get('rgba')
         	})
			} else {
				dataPacket = [];
				thisData = thisRow[14]
				for (year in thisData) {
					dataPacket.push([+year,thisData[year]]);
				}
				rateData[thisTopN][allBubble.iq - 1].push({
//				allRates_t0.push({
         		 name:allBubble.name ,
         		 data: dataPacket,
					 color: Highcharts.Color(Highcharts.getOptions().colors[nameInd]).setOpacity(0.5).get('rgba')

         	})
			}

			if (nameFound) {
				if (allBubble.iq == 0) {
					accelVals[thisTopN].push({x:nameInd,y:allBubble.accel,z:allBubble.number,name:thisName});
				} else {
					accelVals_t[thisTopN][allBubble.iq - 1].push({x:nameInd,y:allBubble.accel,z:allBubble.number,name:thisName});
				}
				if (allBubble.iq == 0) {
					volVals[thisTopN].push({x:nameInd,y:allBubble.number,z:allBubble.accel,name:thisName});
				} else {
					volVals_t[thisTopN][allBubble.iq-1].push({x:nameInd,y:allBubble.number,z:allBubble.accel,name:thisName});
				}
			} else {
				if (allBubble.iq == 0) {
					accelVals[thisTopN].push({x:InstitutionNames[thisTopN].length,y:allBubble.accel,z:allBubble.number,name:thisName});
				} else {
					accelVals_t[thisTopN][allBubble.iq - 1].push({x:InstitutionNames[thisTopN].length,y:allBubble.accel,z:allBubble.number,name:thisName});
				}
				if (allBubble.iq == 0) {
					volVals[thisTopN].push({x:InstitutionNames[thisTopN].length,y:allBubble.number,z:allBubble.accel,name:thisName});
				} else {
					volVals_t[thisTopN][allBubble.iq-1].push({x:InstitutionNames[thisTopN].length,y:allBubble.number,z:allBubble.accel,name:thisName});
				}
				InstitutionNames[thisTopN].push(allBubble.name);
			}
			allBubbleData.push(allBubble);
//
			if (thisRow[4]>0) {
				thisBubble = {};
				thisBubble.id = id;
				thisBubble.name = capitalize(thisRow[0]);
				thisBubble.sel = thisRow[1];
				thisBubble.iq = thisRow[2];
				thisBubble.peakYear = thisRow[3];
				thisBubble.number = thisRow[4];
				thisBubble.nameID = thisRow[12];
				thisBubble.accel = thisRow[13];
				thisBubble.dtype = 0;
				bubbleData.push(thisBubble);
				if (thisBubble.iq > 0) {
				thisBullseye = [];
				thisBullseye.push(thisBubble.iq-1);
				thisBullseye.push('Pubmed');
				thisBullseye.push(thisBubble.name);
				thisBullseye.push(thisBubble.number);
				thisBullseye.push(thisBubble.nameID);
				thisBullseye.push(Highcharts.getOptions().colors[nameInd]);
 				bullseyeData[thisTopN].push(thisBullseye);
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
				thisBubble.nameID = thisRow[12];
				thisBubble.accel = thisRow[13];
				thisBubble.dtype = 1;
				bubbleData.push(thisBubble);
				if (thisBubble.iq > 0) {
				thisBullseye = [];
				thisBullseye.push(thisBubble.iq-1);
				thisBullseye.push('Patents');
				thisBullseye.push(thisBubble.name);
				thisBullseye.push(thisBubble.number);
				thisBullseye.push(thisBubble.nameID);
				thisBullseye.push(Highcharts.getOptions().colors[nameInd]);
 				bullseyeData[thisTopN].push(thisBullseye);
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
				thisBubble.nameID = thisRow[12];
				thisBubble.accel = thisRow[13];
				thisBubble.dtype = 2;
				bubbleData.push(thisBubble);
				if (thisBubble.iq > 0) {
				thisBullseye = [];
				thisBullseye.push(thisBubble.iq-1);
				thisBullseye.push('Clinical Trials');
				thisBullseye.push(thisBubble.name);
				thisBullseye.push(thisBubble.number);
				thisBullseye.push(thisBubble.nameID);
				thisBullseye.push(Highcharts.getOptions().colors[nameInd]);
 				bullseyeData[thisTopN].push(thisBullseye);
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
				thisBubble.nameID = thisRow[12];
				thisBubble.accel = thisRow[13];
				thisBubble.dtype = 3;
				bubbleData.push(thisBubble);
				if (thisBubble.iq > 0) {
				thisBullseye = [];
				thisBullseye.push(thisBubble.iq-1);
				thisBullseye.push('Grants');
				thisBullseye.push(thisBubble.name);
				thisBullseye.push(thisBubble.number);
				thisBullseye.push(thisBubble.nameID);
				thisBullseye.push(Highcharts.getOptions().colors[nameInd]);
 				bullseyeData[thisTopN].push(thisBullseye);
				}
				id += 1;
			}

		}
		if (thisTopic == 0) {
			my_rate(thisTopN);
		} else {
			var column = thisTopN;
			//console.log("*******@@@@@@",column);
			//buildRates(thisTopic-1,column);

			if(column == 1) column = 0;
		}
	}


// error: function() {
//	console.log("session data");
	//console.log(sessionData);
//	 alert("error");
// }
	})
	.fail(
	function() {
	//	 alert("error");
	 }
	)
	;
	ajaxResults.push(asyncResult);
 }
}


//
// Execute these when all of the ajax calls are done
$.when.apply(this,ajaxResults).done(function() {
//		my_rate_t0();
//		my_rate_t1();
//		my_rate_t2();
//		my_rate_t3();
//		my_rate_t4();
//		my_rate_t5();
		my_chartAccel(0);
		my_chartAccel(1);
		my_chartVol(0);
		my_chartVol(1);
		myBullsEye(0,bullseyeData[0]);
		myBullsEye(1,bullseyeData[1]);
		myTable();
});

function myTable() {
	$("#table-spinner").remove();
	$(document).ready(function() {
   	 $('#resultsTable').DataTable( {
      	  data: fullDataSet,
	  order: [[ 2, 'asc' ], [ 1, 'asc' ], [11, 'asc']],
      	  columns: [
            	{ title: "Name"},
            	{ title: "Type" },
            	{ title: "Topic" },
            	{ title: "Peak Year" },
            	{ title: "Pubs" },
            	{ title: "Patents" },
            	{ title: "VC" },
            	{ title: "CTrials" },
            	{ title: "Grants" },
            	{ title: "Grant$", render: $.fn.dataTable.render.number(',','.',0.,'$') },
                { title: "FDA"},
                { title: "Rank"}
      	  ],
			  columnDefs: [
			   	{
						"render": function(data,type,row)
							{
								return '<a onclick="clickInst(this)" id="'+data+'" href="#">'+capitalize(data)+"..."+'</a>'
							},
						targets: 0
					}
				],
   			'iDisplayLength': 200
		     	 } );
	} );
}
function my_rate(col) {
	if (col == 0) {
		$("#my_rate_spinner").remove();
		$('#my_rate').highcharts({
			title: {
				text: 'Activity Vs Year: Selected Organizations'
			},
       tooltip: {
            formatter: function() {
                x =this;
                var t = this.series.name;
                t += '<br/> Year: ' + this.point.x + ',';
                t += '<br/> Num Docs: ' + this.point.y + ',';
                return t;
            }
        },
			chart:{
      		 type:'scatter'
   		},
   		plotOptions:{
      		 scatter:{
         		  lineWidth:2
      		 }
   		},
   		series: allRates[0],
			legend: {
		   		width: 200,
					itemStyle: { width: 180 },
            	layout: 'vertical',
            	align: 'left',
            	verticalAlign: 'top',
            	x: 80,
            	y: 20,
					title: {text: 'Organizations'},
            	floating: true,
					draggable: true,
					zIndex: 20,
            	borderWidth: 1,
            	backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            	shadow: true
      	  },
		});
	} else {
		$("#my_rateTopN_spinner").remove();
		$('#my_rateTopN').highcharts({
			title: {
				text: 'Activity Vs Year: Top Organizations'
			},
       tooltip: {
            formatter: function() {
                x =this;
                var t = this.series.name;
                t += '<br/> Year: ' + this.point.x + ',';
                t += '<br/> Num Docs: ' + this.point.y + ',';
                return t;
            }
        },
			chart:{
      		 type:'scatter'
   		},
   		plotOptions:{
      		 scatter:{
         		  lineWidth:2
      		 }
   		},
   		series: allRates[1],
			legend: {
		   		width: 200,
					itemStyle: { width: 180 },
            	layout: 'vertical',
            	align: 'left',
            	verticalAlign: 'top',
            	x: 80,
            	y: 10,
					title: {text: 'Organizations'},
            	floating: true,
					draggable: true,
					zIndex: 20,
            	borderWidth: 1,
            	backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            	shadow: true
      	  },
		});
	}
}
$(document).ajaxStop(function(){
	$(".spinner").remove();
	$(".annot-button").removeClass("disabled");
	$("#subrates-well").css("height",String(450 * sessionData.topics.length) + "px");

	buildRates2();
})

$("#drop1a").on("click",function(){
	console.log("clicked");
})
function buildRates2(){
	var numRates = sessionData.topics.length;
	for(var column = 0; column <= 1; column++){
		for(var rateIndex = 0; rateIndex < numRates; rateIndex++){
			var row = d3.select("#rates-col"+String(column)).append("div").attr("class","row");
			var col = row.append("div").attr("class","col-xs-12");
			var panelGroup = col.append("div").attr("class","panel-group");
			var panel = panelGroup.append("div").attr("class","panel panel-info")
				.append("div").attr("class","panel-body");
			var viz = panel.append("div").attr("class","row")
				.append("div").attr("class","rep-viz").attr("id","my_rate"+String(rateIndex)+"-"+String(column));

			addRateWithLegend(rateIndex,column);

			var noteRow = panel.append("div").attr("class","form-group row annotation hide");
			noteRow.append("label").attr("for","my_rate"+String(rateIndex)+"-"+String(column)).text("Figure 2."+String(rateIndex+1)+"-"+String(column));
			noteRow.append("textarea").attr("class","form-control").attr("id","my_rate"+String(rateIndex)+"-"+String(column)+"_text").style("width","80%").style("margin-left","10%");
		}
	}
}

function buildRates(topicNum,column){
	var numRates = sessionData.topics.length;
//	var rowIndex = 1;
//	for(var rateIndex = 0; rateIndex < numRates; rateIndex++){
		rateIndex = topicNum;
//		if(column == 0){
		if(true){
			//update hieght of well
//			$("#subrates-well").css("height",String(500 * rowIndex) + "px");
			//create new row every second
			d3.select("#subrates-well").append("div").attr("class","row").attr("id","subrate-row"+String(rowIndex));
			var col = d3.select("#subrate-row"+String(rowIndex)).append("div").attr("class","col-xs-6");

			//append panel group
			var panelGroup = col.append("div").attr("class","panel-group");
			var panel = panelGroup.append("div").attr("class","panel panel-info")
				.append("div").attr("class","panel-body");
			var viz = panel.append("div").attr("class","row")
				.append("div").attr("class","rep-viz").attr("id","my_rate"+String(rateIndex)+"-"+String(column));
			console.log("adding rate " + topicNum + " " + column);
			addRateWithLegend(topicNum,column);
			var noteRow = panel.append("div").attr("class","form-group row annotation hide");
			noteRow.append("label").attr("for","my_rate"+String(rateIndex)+"-"+String(column)).text("Figure 2."+String(rateIndex+1)+"-"+String(column));
			noteRow.append("textarea").attr("class","form-control").attr("id","my_rate"+String(rateIndex)+"-"+String(column)+"_text").style("width","80%").style("margin-left","10%");
			if(column == 1) rowIndex++;
		} else {
			//create right
//			d3.select("#subrates-well").append("div").attr("class","row").attr("id","subrate-row"+String(rowIndex));
//			var col = d3.select("#subrate-row"+String(rowIndex)).append("div").attr("class","col-xs-6");
//			//append panel group
//			var panelGroup = col.append("div").attr("class","panel-group");
//			var panel = panelGroup.append("div").attr("class","row")
//				.append("div").attr("class","panel panel-info")
//				.append("div").attr("class","panel-body");
//			panel.append("div").attr("class","rep-viz").attr("id","my_rate"+String(rateIndex));
//			addRateWithLegend(topicNum,column);
//			var noteRow = panel.append("div").attr("class","form-group row annotation hide");
//			noteRow.append("label").attr("for","my_rate"+String(rateIndex)).text("Figure 2."+String(rateIndex+1));
//			noteRow.append("input").attr("class","form-control input-lg").attr("id","my_rate"+String(rateIndex)+"_text").style("width","80%").style("margin-left","10%");
//			if(column == 1) rowIndex++;
		}
//	}
}
function addRateWithoutLegend(idx,col){
	var addTitle = " Selected Organizations, Topic: ";
	if (col == 1) addTitle = " Top Organizations, Topic: ";
	$('#my_rate'+String(rateIndex)).highcharts({
		legend: {
        enabled: false
    	},
		title: {
			text: 'Docs Vs Year-' + addTitle + sessionData.topics[idx].label
		},
   	chart:{
			// width: 300,
   		height: "70%",
      	 type:'scatter'
   	},
   	plotOptions:{
      	 scatter:{
         	  lineWidth:2
      	 }
   	},
//   	series: allRates_t0
   	series: rateData[col][idx]
	});
}
function addRateWithLegend(idx,col){
	var addTitle = " Selected Organizations, Topic: "
	if (col == 1) addTitle = ", Top Organizations, Topic: "
	console.log("adding rate: index: " + idx + " column " + col);
	$('#my_rate'+String(idx)+"-"+String(col)).highcharts({
		title: {
			text: 'Docs Vs Year-' + addTitle + sessionData.topics[idx].label,
		},
       tooltip: {
            formatter: function() {
                x =this;
                var t = this.series.name;
                t += '<br/> Year: ' + this.point.x + ',';
                t += '<br/> Num Docs: ' + this.point.y + ',';
                return t;
            }
        },
   	chart:{
      	 type:'scatter',
			// width: 500,
      	 	height: "70%",
			 marginTop: 100
   	},
   	plotOptions:{
			scatter:{
			  lineWidth:2
			}
   	},
        legend: {
		   	width: 200,
				itemStyle: { width: 180 },
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 80,
            y: 20,
				title: {text: 'Organizations'},
            floating: true,
				draggable: true,
				zIndex: 20,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
		     	series: rateData[col][idx]
	});

}


function my_chartAccel(thisTopN) {
//
// Make the series data
   var series = [];
   series.push({
                name: 'All Topics',
                data: accelVals[thisTopN],
                grouping: false,
                pointPadding: 0,
                groupPadding: 0,
                dataLabels: {
                   enabled: true,
                   x:40,
                   formatter:function() {
                      return this.point.name;
                   },
                   style:{color:"black"}
                },
                marker: {
                   fillColor: {
                      radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                      stops: [
                               [0, 'rgba(255,255,255,0.5)'],
                               [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
                             ]
                   }
                }
               });


   for (itop=0; itop<sessionData.topics.length ; itop++) {
      var idx = sessionData.topics[itop].index;
      series.push({
                   name: itop.toString() + ": "+sessionData.topics[idx].label,
                   data: accelVals_t[thisTopN][itop+1],
                   grouping: false,
                   pointPadding: 0,
                   groupPadding: 0,
                   dataLabels: {
                      enabled: true,
                      x:40,
                      formatter:function() {
                         return this.point.name;
                      },
                      style:{color:"black"}
                   },
                   marker: {
                      fillColor: {
                         radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                         stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[itop+1]).setOpacity(0.5).get('rgba')]
                         ]
                      }
                   }
                });

   }
//
// Now actually make the chart
   var chartLink = '#accel';
   var chartTitle = 'Acceleration: Selected Organizations'
   if (thisTopN == 1) {
      $("#accel_topN_spinner").remove();
      chartLink = '#accel_topN';
      chartTitle = 'Acceleration: Top N Organizations'
   } else{
      $("#accel_spinner").remove();
   }
   
   var chart = $(chartLink).highcharts({
      tooltip: {
            formatter: function() {
                x =this;
                var t = this.series.name;
                t += '<br/> Topic: ' + this.point.x + ',';
                t += '<br/> Accleration: ' + this.point.y + ',';
                t += '<br/> Number Docs: ' + this.point.z;
                return t;
            }
      },
      chart: {
               height: 600,
               type: 'bubble',
               plotBorderWidth: 1,
               zoomType: 'xy'
             },
      title: {
               useHTML: true,
               text: chartTitle
             },
      xAxis: {
              categories: InstitutionNames[thisTopN]
             },
      yAxis: {
         startOnTick: false,
         endOnTick: false
      },
      plotOptions: {
         series: {
                   cursor: 'pointer',
                   point: {
                      events: {
                          click: function (ev) {
                                  sessionData.vizData.researcher = ev.point.category;
                                  updateSessionData(sessionData);
                                  location.href = 'vizDemo2.html';
                          }
                      }
                   }
                 }
      },
      series: series
   });

}

///////////////////////

function my_chartVol(thisTopN) {
//
// Make the series data
   var series = [];
   series.push({
                name: 'All Topics',
                data: volVals[thisTopN],
                grouping: false,
                pointPadding: 0,
                groupPadding: 0,
                dataLabels: {
                   enabled: true,
                   x:40,
                   formatter:function() {
                      return this.point.name;
                   },
                   style:{color:"black"}
                },
                marker: {
                   fillColor: {
                      radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                      stops: [
                               [0, 'rgba(255,255,255,0.5)'],
                               [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
                             ]
                   }
                }
               });


   for (itop=0; itop<sessionData.topics.length ; itop++) {
      var idx = sessionData.topics[itop].index;
      series.push({
                   name: itop.toString() + ": "+sessionData.topics[idx].label,
                   data: volVals_t[thisTopN][itop+1],
                   grouping: false,
                   pointPadding: 0,
                   groupPadding: 0,
                   dataLabels: {
                      enabled: true,
                      x:40,
                      formatter:function() {
                         return this.point.name;
                      },
                      style:{color:"black"}
                   },
                   marker: {
                      fillColor: {
                         radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                         stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[itop+1]).setOpacity(0.5).get('rgba')]
                         ]
                      }
                   }
                });

   }
//
// Now actually make the chart
        var chartLink = '#vol';
        var chartTitle = 'Total Volume: Selected Organizations'
        if (thisTopN == 1) {
                $("#vol_topN_spinner").remove();
                chartLink = '#vol_topN';
                chartTitle = 'Total Volume: Top N Organizations'
        } else{
                $("#vol_spinner").remove();
        }

    var chart = $(chartLink).highcharts({
       tooltip: {
            formatter: function() {
                x =this;
                var t = this.series.name;
                t += '<br/> Topic: ' + this.point.x + ',';
                t += '<br/> Number Docs: ' + this.point.y + ',';
                t += '<br/> Accleration: ' + this.point.z;
                return t;
            }
	},
      chart: {
               height: 600,
               type: 'bubble',
               plotBorderWidth: 1,
               zoomType: 'xy'
             },
      title: {
               useHTML: true,
               text: chartTitle
             },
      xAxis: {
              categories: InstitutionNames[thisTopN]
             },
      yAxis: {
         startOnTick: false,
         endOnTick: false
      },
      plotOptions: {
         series: {
                   cursor: 'pointer',
                   point: {
                      events: {
                          click: function (ev) {
                                  sessionData.vizData.researcher = ev.point.category;
                                  updateSessionData(sessionData);
                                  location.href = 'vizDemo2.html';
                          }
                      }
                   }
                 }
      },
      series: series
   });

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




function myBullsEye(thisTopN,data) {

   var chartLink = "bullseye";
   var chartData = "bullseyeData";
	if (thisTopN == 1) {
		chartLink = "bullseye_topN";
		chartData = "bullseyeData_topN";
	}
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function showData(point) {
        var data = point.data;
        var elem = document.getElementById('bullseyeData');
        var html = '<table class=datatable>'
                   + '<tr><th colspan=2>Data</th></tr>'
                   + '<tr><td class=field>Organization: </td><td class=value>' + data[2] + '</td></tr>'
                   + '<tr><td class=field>Topic: </td><td class=value>' + slices[data[0]] + '</td></tr>'
                   + '<tr><td class=field>Doc  Source: </td><td class=value>' + data[1] + '</td></tr>'
                   + '<tr><td class=field>Documents: </td><td class=value>' + data[3] + '</td></tr>'
                   + '<tr><td class=field>Name ID" </td><td class=value>' + data[4] + '</td></tr>'
                   + '</table>';


        elem.innerHTML = html;
    }
    function showData_topN(point) {
        var data = point.data;
        var elem = document.getElementById('bullseyeData_topN');
        var html = '<table class=datatable>'
                   + '<tr><th colspan=2>Data</th></tr>'
                   + '<tr><td class=field>Organizations: </td><td class=value>' + data[2] + '</td></tr>'
                   + '<tr><td class=field>Topic: </td><td class=value>' + slices[data[0]] + '</td></tr>'
                   + '<tr><td class=field>Doc  Source: </td><td class=value>' + data[1] + '</td></tr>'
                   + '<tr><td class=field>Documents: </td><td class=value>' + data[3] + '</td></tr>'
                   + '<tr><td class=field>Name ID" </td><td class=value>' + data[4] + '</td></tr>'
                   + '</table>';


        elem.innerHTML = html;
    }

//    var slices = ['Cell-based Therapies', 'Tissue-based Engineering', 'Gene-based Therapies', 'Acellular Therapies'];
    var slices = [topic1,topic2,topic3,topic4,topic5,topic6];
//     var theaters = {
//        1: 'Cell-based Therapies',
//        2: 'Tissue-based Engineering',
//        3: 'Gene-based Therapies',
//        4: 'Acellular Therapies'
//    };
    var theaters = {
        1: topic1,
        2: topic2,
        3: topic3,
        4: topic4,
        5: topic5,
        6: topic6
    };
    var bullseye;
	 if (thisTopN == 0) {
			$("#bullseye_spinner").remove();

	 	bullseye = Raphael('bullseye', 640, 600).bullseye({
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
	 } else {
			$("#bullseye_topN_spinner").remove();

	 	bullseye = Raphael('bullseye_topN', 640, 600).bullseye({
        'slices': slices,
        'rings' : ['Clinical Trials','Patents','Pubs','Grants'],
        'startDegree': 0,
        'allowDrag': false,
        'onMouseOver': showData_topN,
        'onPointClick': showData_topN,
        'onSliceClick': function(sliceIdx) {
            alert("You've clicked on " + slices[sliceIdx]);
        }
    	});
	 }
    var baseYear = 1940;
    //http://history1900s.about.com/od/worldwarii/a/wwiibattles.htm

    var angle;
    var upper_bound, lower_bound;
	 var ring;
    for (var i = 0; i < data.length; i++) {
        switch(data[i][0]) {
            case 0:
                lower_bound = 5;
                upper_bound = 60;
                break;
            case 1:
                lower_bound = 60;
                upper_bound = 120;
                break;
            case 2:
                lower_bound = 120;
                upper_bound = 180;
                break;
            case 3:
                lower_bound = 180;
                upper_bound = 240;
                break;
            case 4:
                lower_bound = 240;
                upper_bound = 300;
                break;
            case 5:
                lower_bound = 300;
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
//            pointFill: fillColor2(data[i][4]),
            pointFill: data[i][5],
            pointSize: radiusScale(size/10),
            distance: .5
        });

        point.data = data[i];
    }

}

function saveAnnotations(){
	sessionData.repData.annot.my_rate_text1 = $("#my_rate_text1").val();
	sessionData.repData.annot.my_rate_text2 = $("#my_rate_text2").val();
	for(var i = 0; i < sessionData.topics.length; i++){ //row
		for(var j = 0; j < 2; j++){//column
			sessionData.repData.annot["my_rate"+String(i)+"-"+String(j)+"_text"] = $("#my_rate"+String(i)+"-"+String(j)+"_text").val();
		}
	}
	sessionData.repData.annot.my_vol_text = $("#my_vol_text").val();
	sessionData.repData.annot.my_vol_topN_text = $("#my_vol_topN_text").val();

	sessionData.repData.annot.my_accel_text = $("#my_accel_text").val();
	sessionData.repData.annot.my_accel_topN_text = $("#my_accel_topN_text").val();


	sessionData.repData.annot.my_bullseye_text = $("#my_bullseye_text").val();
	sessionData.repData.annot.my_bullseye_text = $("#my_bullseye_topN_text").val();

	sessionData.repData.annot.my_table_text = $("#my_table_text").val();
	updateSessionData(sessionData);
	//saveSession();
}

function resetAnnotations(){
	sessionData.repData.annot = JSON.parse(JSON.stringify(annotations));
	updateSessionData(sessionData);
	toggleAnnotations();
	toggleAnnotations();
}

function toggleAnnotations()
{
	$(".annotation").toggleClass("hide");
		if($(".annotation").hasClass("hide")){
			$("#subrates-well").css("height",String(parseInt($("#subrates-well").css("height"))-(100*sessionData.topics.length)) + "px");
		} else{
			$("#subrates-well").css("height",String(parseInt($("#subrates-well").css("height"))+(100*sessionData.topics.length)) + "px");

		}
		$("#my_rate_text1").val(sessionData.repData.annot.my_rate_text1);
		$("#my_rate_text2").val(sessionData.repData.annot.my_rate_text2);
		for(var i = 0; i < sessionData.topics.length; i++){
			for(var j = 0; j < 2; j++){
				$("#my_rate"+String(i)+"-"+String(j)+"_text").val(sessionData.repData.annot["my_rate"+String(i)+"-"+String(j)+"_text"]);
			}
		}
		$("#my_accel_text").val(sessionData.repData.annot.my_accel_text);
		$("#my_accel_topN_text").val(sessionData.repData.annot.my_accel_topN_text);

		$("#my_vol_text").val(sessionData.repData.annot.my_vol_text);
		$("#my_vol_topN_text").val(sessionData.repData.annot.my_vol_topN_text);

		$("#my_bullseye_text").val(sessionData.repData.annot.my_bullseye_text);
		$("#my_bullseye_topN_text").val(sessionData.repData.annot.my_bullseye_topN_text);

		$("#my_table_text").val(sessionData.repData.annot.my_table_text);
}
