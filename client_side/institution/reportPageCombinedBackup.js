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
var myColorSet = 
['#8c510a',
'#bf812d',
'#dfc27d',
'#f6e8c3',
'#c7eae5',
'#80cdc1',
'#35978f',
'#01665e',
'#d53e4f',
'#f46d43',
'#fdae61',
'#fee08b',
'#ffffbf',
'#e6f598',
'#abdda4',
'#66c2a5',
'#3288bd',
'#d8daeb',
'#b2abd2',
'#8073ac',
'#542788']

//var column = 0;
var sessionData = JSON.parse(localStorage.getItem("sessionData"));

var annotations = {};

annotations.my_rate_text1 = "Activity vs Year - Top Organizations";
annotations.my_rate_text2 = "Activity vs Year - Top Organizations";

annotations.my_accel_text = "Acceleration - Top Organizations";
annotations.my_accel_topN_text = "Acceleration - Top Organizations";

annotations.my_vol_text = "Volume - Top Organizations";
annotations.my_vol_topN_text = "Volume - Top Organizations";

annotations.my_bullseye_text = "Bullseye - Top Organizations";
annotations.my_bullseye_topN_text = "Bullseye - Top Organizations";

annotations.my_table_text = "Table";
annotations.my_rate_text = "Activity vs Year";


for(var i = 0; i < sessionData.topics.length; i++){
	annotations["my_rate"+String(i)+"-0_text"] = "Activity vs Year in Topic: " + sessionData.topics[i].label + " - Top Organizations";
}

if(!sessionData.repData){
	sessionData.repData = {};
}
if(!sessionData.repData.annot){
	sessionData.repData.annot = JSON.parse(JSON.stringify(annotations));
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
var numTopics = 0;
if(sessionData.topics){
   for(var i in sessionData.topics){
      numTopics += 1;
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

$(".form-control").focusout(function(){
	saveAnnotations();
	console.log("saving");
})

var ajaxResults = [];
//
// reportTopN==0 is for selected organizations
// reportTopN==1 is for "top N" organizations
for (var reportTopN = 0; reportTopN<1; reportTopN++) {
 sessionData["reportTopN"]=reportTopN;
 for (var reportControl = 0; reportControl<numTopics+1; reportControl++) {
  sessionData["reportControl"]=reportControl;
  var ajaxData = JSON.parse(JSON.stringify(sessionData));
//  delete ajaxData.repData;
//  delete ajaxData.institutions;
//  delete ajaxData.researchers;
//  ajaxData.mainQuery = "";
//  ajaxData.topics = [];
//  ajaxData.institutions = [];
//  delete ajaxData.searchName;
//  delete ajaxData.vizData;
  var asyncResult = $.ajax({
	url: config.dataURL+"/report/reportPageTopicCombined.sjs",
	dataType: 'json',
	async: true,
	type: 'GET',
	xhrFields: { withCredentials: true },
	crossDomain: true,
	data: JSON.stringify(ajaxData),
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
			allBubble.nameID = thisRow[13];
			allBubble.accel = +(thisRow[14].toPrecision(2));
//			allBubble.accel = thisRow[14];
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
				thisData = thisRow[15]
				for (year in thisData) {
					dataPacket.push([+year,thisData[year]]);
				}
				allRates[thisTopN].push({
         		 name:allBubble.name ,
         		 data: dataPacket,
					 color: myColorSet[nameInd%20]
//					 color: Highcharts.Color(Highcharts.getOptions().colors[nameInd%10]).setOpacity(0.5).get('rgba')
         	})
			} else {
				dataPacket = [];
				thisData = thisRow[15]
				for (year in thisData) {
					dataPacket.push([+year,thisData[year]]);
				}
				rateData[thisTopN][allBubble.iq - 1].push({
//				allRates_t0.push({
         		 name:allBubble.name ,
         		 data: dataPacket,
					 color: myColorSet[nameInd%20]
//					 color: Highcharts.Color(Highcharts.getOptions().colors[nameInd%10]).setOpacity(0.5).get('rgba')

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
				thisBubble.nameID = thisRow[13];
				thisBubble.accel = thisRow[14];
				thisBubble.dtype = 0;
				bubbleData.push(thisBubble);
				if (thisBubble.iq > 0) {
				thisBullseye = [];
				thisBullseye.push(thisBubble.iq-1);
				thisBullseye.push('Pubmed');
				thisBullseye.push(thisBubble.name);
				thisBullseye.push(thisBubble.number);
				thisBullseye.push(thisBubble.nameID);
//				thisBullseye.push(Highcharts.getOptions().colors[nameInd%10]);
				thisBullseye.push(myColorSet[nameInd%20]);
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
				thisBubble.nameID = thisRow[13];
				thisBubble.accel = thisRow[14];
				thisBubble.dtype = 1;
				bubbleData.push(thisBubble);
				if (thisBubble.iq > 0) {
				thisBullseye = [];
				thisBullseye.push(thisBubble.iq-1);
				thisBullseye.push('Patents');
				thisBullseye.push(thisBubble.name);
				thisBullseye.push(thisBubble.number);
				thisBullseye.push(thisBubble.nameID);
//				thisBullseye.push(Highcharts.getOptions().colors[nameInd%10]);
				thisBullseye.push(myColorSet[nameInd%20]);
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
				thisBubble.nameID = thisRow[13];
				thisBubble.accel = thisRow[14];
				thisBubble.dtype = 2;
				bubbleData.push(thisBubble);
				if (thisBubble.iq > 0) {
				thisBullseye = [];
				thisBullseye.push(thisBubble.iq-1);
				thisBullseye.push('Clinical Trials');
				thisBullseye.push(thisBubble.name);
				thisBullseye.push(thisBubble.number);
				thisBullseye.push(thisBubble.nameID);
//				thisBullseye.push(Highcharts.getOptions().colors[nameInd%10]);
				thisBullseye.push(myColorSet[nameInd%20]);
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
				thisBubble.nameID = thisRow[13];
				thisBubble.accel = thisRow[14];
				thisBubble.dtype = 3;
				bubbleData.push(thisBubble);
				if (thisBubble.iq > 0) {
				thisBullseye = [];
				thisBullseye.push(thisBubble.iq-1);
				thisBullseye.push('Grants');
				thisBullseye.push(thisBubble.name);
				thisBullseye.push(thisBubble.number);
				thisBullseye.push(thisBubble.nameID);
//				thisBullseye.push(Highcharts.getOptions().colors[nameInd%10]);
				thisBullseye.push(myColorSet[nameInd%20]);
 				bullseyeData[thisTopN].push(thisBullseye);
				}
				id += 1;
			}

		}
		if (thisTopic == 0) {
			my_rate(thisTopN);
		} else {
			var column = thisTopN;
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
var bd = "";
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
//		my_chartAccel(1);
//		my_chartVol(0);
//		my_chartVol(1);
		console.log("calling bullseyeData");
		console.log("*********");
		console.log(bullseyeData);
		bd = JSON.stringify(bullseyeData[0]);
		myBullsEye(0,bullseyeData[0]);
//		myBullsEye(1,bullseyeData[1]);
		console.log("calling myTable");
		myTable();
});

function myTable() {
	$("#table-spinner").remove();
	$(document).ready(function() {
   	 $('#resultsTable').DataTable( {
      	  data: fullDataSet,
	  order: [[ 2, 'asc' ],  [11, 'asc']],
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
            	{ title: "Funding$", render: $.fn.dataTable.render.number(',','.',0.,'$') },
                { title: "FDA"},
                { title: "Rank"}
      	  ],
			  columnDefs: [
				  {
						"render": function(data,type,row)
							{
			return '<a onclick="clickFDA(this,event)" id="'+row[12]+'" href="#">'+data+'</a>'
							},
						targets: 10
					},
			   	{
						"render": function(data,type,row)
							{
//			return '<a onclick="clickFDA(this,event)" id="'+row[12]+'" href="#">'+capitalize(data)+"..."+'</a>'
			return '<a onclick="clickInst(this,event)" id="'+data+'" href="#">'+capitalize(data)+"..."+'</a>'
							},
						targets: 0
					},
			   	{
						"render": function(data,type,row)
							{
								//return data;
								var topLabel = "ALL";
								if (data > 0) topLabel = sessionData.topics[data-1].label;
								return topLabel;
							},
						targets: 2
					},
                                {
                                                "render": function(data,type,row)
                                                        {
                                                                //return data;
                                                                return data+1;
                                                        },
                                                targets: 11
                                        },

				],
				dom: 'l<"toolbar">Bfrtip',
		        buttons: [
		            'copy', 'csv', 'excel', 'pdf', 'print'
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
//		events: {
//                    load: function (event) {
//                        $(".highcharts-legend").appendTo("#legendContainer");
//                        $(".highcharts-legend").removeAttr('transform');                        
//                    },
//                    redraw: function(){
//                        $(".highcharts-legend").removeAttr('transform');
//                    }
//                },
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
            	align: 'right',
            	verticalAlign: 'top',
            	x: -80,
            	y: 20,
					title: {text: 'Organizations'},
            	floating: false,
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
		   		width: 400,
		   		height: 400,
					itemStyle: { width: 200 },
            	layout: 'vertical',
            	align: 'right',
           	verticalAlign: 'middle',
            	x: -80,
            	y: 10,
					title: {text: 'Organizations'},
            	floating: false,
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

	//toggle annotations
//	toggleAnnotations();
	$(".spinner").remove();
	$(".annot-button").removeClass("disabled");
	var numRates = sessionData.topics.length;
        var numPlots = 0;
        for(var rateIndex = 0; rateIndex < numRates; rateIndex++){
           if (rateData[0][rateIndex].length > 0) numPlots += 1;
	}
//	$("#subrates-well").css("height",String(450 * sessionData.topics.length) + "px");
//	$("#subrates-well").css("height",String(460 * numPlots) + "px");

	buildRates2();
})

$("#drop1a").on("click",function(){
	console.log("clicked");
})
function buildRates2(){
	var numRates = sessionData.topics.length;
	for(var column = 0; column <1; column++){
		for(var rateIndex = 0; rateIndex < numRates; rateIndex++){
                        if (rateData[column][rateIndex].length > 0) {
			var row = d3.select("#rates-col"+String(column)).append("div").attr("class","row");
//			var col = row.append("div").attr("class","col-xs-12");
//			var panelGroup = col.append("div").attr("class","panel-group");
			var panelGroup = row.append("div").attr("class","panel-group");
			var panel = panelGroup.append("div").attr("class","panel panel-info")
				.append("div").attr("class","panel-body");
			var viz = panel.append("div").attr("class","row")
				.append("div").attr("class","rep-viz").attr("id","my_rate"+String(rateIndex)+"-"+String(column));

			addRateWithLegend(rateIndex,column);

			var noteRow = panel.append("div").attr("class","form-group row annotation");
			noteRow.append("label").attr("for","my_rate"+String(rateIndex)+"-"+String(column)).text("Figure 2."+String(rateIndex+1)+"-"+String(column));
			noteRow.append("textarea").attr("class","form-control").attr("id","my_rate"+String(rateIndex)+"-"+String(column)+"_text").style("width","80%").style("margin-left","10%");
		        }
		}
	}
	$("#my_rate_text1").val(sessionData.repData.annot.my_rate_text1);
	$("#my_rate_text2").val(sessionData.repData.annot.my_rate_text2);
	for(var i = 0; i < sessionData.topics.length; i++){
			$("#my_rate"+String(i)+"-0_text").val(sessionData.repData.annot["my_rate"+String(i)+"-0_text"]);
	}
	$("#my_accel_text").val(sessionData.repData.annot.my_accel_text);
	$("#my_accel_topN_text").val(sessionData.repData.annot.my_accel_topN_text);

	$("#my_vol_text").val(sessionData.repData.annot.my_vol_text);
	$("#my_vol_topN_text").val(sessionData.repData.annot.my_vol_topN_text);

	$("#my_bullseye_text").val(sessionData.repData.annot.my_bullseye_text);
	$("#my_bullseye_topN_text").val(sessionData.repData.annot.my_bullseye_topN_text);

	$("#my_table_text").val(sessionData.repData.annot.my_table_text);
	$("textarea").height( $("textarea")[0].scrollHeight );

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
			addRateWithoutLegend(topicNum,column);
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
		$("#my_rate_text1").val(sessionData.repData.annot.my_rate_text1);
		$("#my_rate_text2").val(sessionData.repData.annot.my_rate_text2);
		var j = 0;
		for(var i = 0; i < sessionData.topics.length; i++){
			$("#my_rate"+String(i)+"-"+String(j)+"_text").val(sessionData.repData.annot["my_rate"+String(i)+"-"+String(j)+"_text"]);
		}
		$("#my_accel_text").val(sessionData.repData.annot.my_accel_text);
		$("#my_accel_topN_text").val(sessionData.repData.annot.my_accel_topN_text);

		$("#my_vol_text").val(sessionData.repData.annot.my_vol_text);
		$("#my_vol_topN_text").val(sessionData.repData.annot.my_vol_topN_text);

		$("#my_bullseye_text").val(sessionData.repData.annot.my_bullseye_text);
		$("#my_bullseye_topN_text").val(sessionData.repData.annot.my_bullseye_topN_text);

		$("#my_table_text").val(sessionData.repData.annot.my_table_text);
}
function addRateWithoutLegend(idx,col){
	var addTitle = " Top Organizations, Topic: ";
	if (col == 1) addTitle = " Top Organizations, Topic: ";
	$('#my_rate'+String(rateIndex)).highcharts({
		legend: {
        enabled: false
    	},
		title: {
			text: 'Activity Vs Year-' + addTitle + sessionData.topics[idx].label
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
	var addTitle = " Top Organizations, Topic: "
	if (col == 1) addTitle = ", Top Organizations, Topic: "
	$('#my_rate'+String(idx)+"-"+String(col)).highcharts({
		title: {
			text: 'Activity Vs Year-' + addTitle + sessionData.topics[idx].label,
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
			// width: 500,
//      	 	height: "70%",
//			 marginTop: 100
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
            align: 'right',
            verticalAlign: 'top',
            x: -80,
            y: 20,
				title: {text: 'Organizations'},
            floating: false,
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
//                dataLabels: {
//                   enabled: true,
//                   x:40,
//                   formatter:function() {
//                      return this.point.name;
//                   },
//                   style:{color:"black"}
//                },
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
//      if (accelVals_t[thisTopN][itop].length > 0)
         series.push({
                   name: itop.toString() + ": "+sessionData.topics[idx].label,
                   data: accelVals_t[thisTopN][itop],
                   grouping: false,
                   pointPadding: 0,
                   groupPadding: 0,
//                   dataLabels: {
//                      enabled: true,
//                      x:40,
//                      formatter:function() {
//                         return this.point.name;
//                      },
//                      style:{color:"black"}
//                   },
                   marker: {
                      fillColor: {
                         radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                         stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, myColorSet[(itop+1)%20]]
//                            [1, Highcharts.Color(Highcharts.getOptions().colors[(itop+1)%10]).setOpacity(0.5).get('rgba')]
                         ]
                      }
                   }
                });

   }
//
// Now actually make the chart
   var chartLink = '#accel';
   var chartTitle = 'Acceleration: Top Organizations';
   var chartSubTitle = 'Acceleration = Volume(last 3 years) / Volume(previous 3 years)';
   if (thisTopN == 1) {
      $("#accel_topN_spinner").remove();
      chartLink = '#accel_topN';
      chartTitle = 'Acceleration: Top Organizations';
      chartSubTitle = 'Acceleration = Volume(last 3 years) / Volume(previous 3 years)';
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
      subtitle: {
         text: chartSubTitle
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
//                dataLabels: {
//                   enabled: true,
//                   x:40,
//                   formatter:function() {
//                      return this.point.name;
//                   },
//                   style:{color:"black"}
//                },
                marker: {
                   fillColor: {
                      radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                      stops: [
                               [0, 'rgba(255,255,255,0.5)'],
//                            [1, myColorSet[nameInd%20]]
                               [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
                             ]
                   }
                }
               });

   for (itop=0; itop<sessionData.topics.length ; itop++) {
      var idx = sessionData.topics[itop].index;
      series.push({
                   name: itop.toString() + ": "+sessionData.topics[idx].label,
                   data: volVals_t[thisTopN][itop],
                   grouping: false,
                   pointPadding: 0,
                   groupPadding: 0,
//                   dataLabels: {
//                      enabled: true,
//                      x:40,
//                      formatter:function() {
//                         return this.point.name;
//                      },
//                      style:{color:"black"}
//                   },
                   marker: {
                      fillColor: {
                         radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                         stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, myColorSet[(itop+1)%20]]
//                            [1, Highcharts.Color(Highcharts.getOptions().colors[(itop+1)%10]).setOpacity(0.5).get('rgba')]
                         ]
                      }
                   }
                });

   }
//
// Now actually make the chart
        var chartLink = '#vol';
        var chartTitle = 'Total Volume: Top Organizations'
        if (thisTopN == 1) {
                $("#vol_topN_spinner").remove();
                chartLink = '#vol_topN';
                chartTitle = 'Total Volume: Top Organizations'
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

   var chartLink = "bullseye_topN";
   var chartData = "bullseyeData_topN";
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

    function showBullseyeTable() {
      var html = '<table class=datatable>'
                   + '<tr><th>Topic ID</th><th>Topic</th></tr>';
      for(var i = 0; i < sessionData.topics.length; i++){
         html += '<tr><td class=field>' + i.toString() + '</td><td class=value>' + sessionData.topics[i].label + '</td></tr>'
      }
      html += '</table>';
      var elem = document.getElementById('bullseye_topN_table');
      elem.innerHTML = html;
    }
    showBullseyeTable();


    function showData(point) {
        var data = point.data;
        var elem = document.getElementById('bullseyeData_topN');
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
//    var slices = [topic1,topic2,topic3,topic4,topic5,topic6];
var slices = [];
for(var i = 0; i < sessionData.topics.length; i++){
//   slices.push(sessionData.topics[i].label);
   slices.push(i.toString());
}
    var bullseye;
	 if (thisTopN == 0) {
			$("#bullseye_topN_spinner").remove();

	 bullseye = Raphael('bullseye_topN', 640, 600).bullseye({
        'slices': slices,
        'rings' : ['Clinical Trials','Patents','Grants','Pubs'],
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
        'rings' : ['Clinical Trials','Patents','Grants','Pubs'],
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
	 var numTopics = sessionData.topics.length;
	 if(numTopics > 0){
		 
	 }
    for (var i = 0; i < data.length; i++) {
    	var topIdx = data[i][0]+1;
    	if(numTopics == 1){
    		upper_bound = 355;
    		lower_bound = 0;
    	} else if(numTopics > 1){
    		upper_bound = ((360 / numTopics) * topIdx);
    		lower_bound = (360 / numTopics) * (topIdx - 1);
    	}
    	
//        switch(data[i][0]) {
//            case 0:
//                lower_bound = 5;
//                upper_bound = 60;
//                break;
//            case 1:
//                lower_bound = 60;
//                upper_bound = 120;
//                break;
//            case 2:
//                lower_bound = 120;
//                upper_bound = 180;
//                break;
//            case 3:
//                lower_bound = 180;
//                upper_bound = 240;
//                break;
//            case 4:
//                lower_bound = 240;
//                upper_bound = 300;
//                break;
//            case 5:
//                lower_bound = 300;
//                upper_bound = 355;
//                break;
//        }
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
		sessionData.repData.annot["my_rate"+String(i)+"-0_text"] = $("#my_rate"+String(i)+"-0_text").val();
	}
	sessionData.repData.annot.my_vol_text = $("#my_vol_text").val();
	sessionData.repData.annot.my_vol_topN_text = $("#my_vol_topN_text").val();

	sessionData.repData.annot.my_accel_text = $("#my_accel_text").val();
	sessionData.repData.annot.my_accel_topN_text = $("#my_accel_topN_text").val();


	sessionData.repData.annot.my_bullseye_text = $("#my_bullseye_text").val();
	sessionData.repData.annot.my_bullseye_topN_text = $("#my_bullseye_topN_text").val();

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

		$("#my_rate_text1").val(sessionData.repData.annot.my_rate_text1);
		$("#my_rate_text2").val(sessionData.repData.annot.my_rate_text2);
		var j = 0;
		for(var i = 0; i < sessionData.topics.length; i++){
			$("#my_rate"+String(i)+"-0_text").val(sessionData.repData.annot["my_rate"+String(i)+"-0_text"]);
		}
		$("#my_accel_text").val(sessionData.repData.annot.my_accel_text);
		$("#my_accel_topN_text").val(sessionData.repData.annot.my_accel_topN_text);

		$("#my_vol_text").val(sessionData.repData.annot.my_vol_text);
		$("#my_vol_topN_text").val(sessionData.repData.annot.my_vol_topN_text);

		$("#my_bullseye_text").val(sessionData.repData.annot.my_bullseye_text);
		$("#my_bullseye_topN_text").val(sessionData.repData.annot.my_bullseye_topN_text);

		$("#my_table_text").val(sessionData.repData.annot.my_table_text);
}
