var dataReturned = "";
var countryData = ""
var InstitutionNames = "";
var InstitutionValues = "";
var ResearcherNames = "";
var ResearcherValues = "";
var docNames = "";
var docValues = "";
var yearNames = "";
var yearValues = "";
var selectedCountry = "";

var sessionData = JSON.parse(localStorage.getItem("sessionData"));
if(!sessionData.vizData){
	sessionData.vizData = {};
	sessionData.vizData.start_year = sessionData.start_year;
	sessionData.vizData.end_year = sessionData.end_year;
	updateSessionData(sessionData);
}



$(document).ready(function($) {
    $(".table-row").click(function() {
        window.document.location = $(this).data("href");
    });
});
//buildTopicTable();
function buildTopicTable(){
	var topics = [];
	for(var i =0; i < 10; i++){
		var topStr = "topic"+String(i);
		var labStr = "label"+String(i);
		if(sessionData[topStr]){
			topics.push({label: sessionData[labStr], topic: sessionData[topStr]});
		}
	}
	d3.select("#queryTopicsBody").selectAll("tr").data(topics).enter().append("tr")
	.style("cursor","pointer")
	.attr("class",function(d){
		var ret = "";
		if(sessionData.vizData.topicQuery == d.topic){
			ret = "selected-topic";
		} else{
			ret = "not-selected-topic";
		}
		return(ret);
	}).style("background",function(d){
		var ret = "white";
		if(sessionData.vizData.topicQuery == d.topic){
			ret = "silver";
		}
		return(ret);
	})
	.on("mouseover",function(){
		d3.select(this).style("background","gray");
	})
	.on("mouseout",function(d){
		if($(this).hasClass("selected-topic")){
			d3.select(this).style("background","blue");
		}else{
			d3.select(this).style("background","white");
		}
	})
	.on("click",function(d){
		console.log(sessionData.vizData.topicQuery);
		console.log(d.topic);
		console.log(sessionData.vizData.topicQuery == d.topic);
		if(sessionData.vizData.topicQuery == d.topic){
			console.log("removing selected topic");
			delete sessionData.vizData.topicQuery;
			updateSessionData(sessionData);
			window.location.href = "vizDemo2.html";
		} else{
			console.log("adding topicQuery");
			$(this).addClass("selected-topic");
			sessionData.vizData["topicQuery"] = d.topic;
			updateSessionData(sessionData);
			window.location.href = "vizDemo2.html";
		}
	})
	.selectAll("td").data(function(d){
		return([d.label,d.topic]);
	}).enter().append("td").text(function(d){
		return(d);
	})


}

function getSearchParameters() {
      var prmstr = window.location.search.substr(1);
      return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

var this_qry = sessionData.mainQuery;
var main_qry = sessionData.mainQuery;
var instName = sessionData.institution;
var resName = sessionData.researcher;
var docType = sessionData.docType;
var yearMin = sessionData.start_year;
var yearmax = sessionData.end_year;
var selectedCountry = sessionData.selectedCountry;
var topics = {};
for(var i = 0; i < 99; i++){
	var topStr = "topic"+String(i);
	var labStr = "label"+String(i);
	var tmpObj = {};
	if(sessionData.topStr){
		tmpObj.topic = sessionData[topStr];
		if(sessionData.labStr){
			tmpObj.label = sessionData[labStr];
		}
		topics[topStr] = tmpObj;
	}
}

var ajaxParams = JSON.parse(JSON.stringify(sessionData));
if(ajaxParams.repData) delete ajaxParams.repData;
$.ajax({
	url: config.dataURL+"/newViz/viz_facetsSingle.sjs",
	type: "GET",
	xhrFields: { withCredentials: true },
    crossDomain: true,
//    data: JSON.stringify(sessionData),
    data: JSON.stringify(ajaxParams),
	dataType: 'json',
	success: function(retdata){
		console.log("complete");
		countryData = retdata.main.countryList;
		InstitutionNames = retdata.main.InstitutionNames;
		InstitutionValues = retdata.main.InstitutionValues;
		ResearcherNames = retdata.main.ResearcherNames;
		ResearcherValues = retdata.main.ResearcherValues
		yearNames = retdata.main.yearNames;
		yearValues = retdata.main.yearValues
		docNames = retdata.main.docNames;
		docValues = retdata.main.docValues;
		totalFiltered = retdata.main.docValues;
		$("#num-docs").text("Number of Documents Returned by Search: " + String(retdata.estimate));
		my_chart();

	},
	error: function(){
		console.log("Error vizFacet");
	}
});



function my_chart() {
    $('#chartDocs').highcharts({
		chart: {
            type: 'column'
        },
		title: {
			useHTML: true,
			text: 'Document Sources ' + '<a href = "#" id = "docType-reset">Reset</a>'
		},
		xAxis: {
            categories: docNames
        },
		plotOptions: {
   		  series: {
         		cursor: 'pointer',
         		point: {
            		 events: {
               		  click: function (ev) {
               			  			var thisType = ev.point.category;
               			  			//make only this type active
               			  			for(var i in sessionData.docTypes){
               			  				if(sessionData.docTypes[i].value != thisType){
               			  					sessionData.docTypes[i].active = false;
               			  				} else{
               			  					sessionData.docTypes[i].active = true;
               			  				}
               			  			}
               			  			updateSessionData(sessionData);
									location.href = 'vizDemo2.html';
               		  }
            		 }
         		}
   		  }
		 },
		 series: [{
            name: 'document',
            data: docValues
        }]
	});

    $('#chartYears').highcharts({
		chart: {
			type: 'column',
			zoomType: 'x',
			events: {
   			selection: function (event) {
					var text,
					label;
					if (event.xAxis) {
						yearMinVal = event.xAxis[0].min;
						yearMaxVal = event.xAxis[0].max;
						var yearmin = yearNames[Math.round(yearMinVal)];
						var yearmax = yearNames[Math.round(yearMaxVal)];
						sessionData.start_year = yearmin;
						sessionData.end_year= yearmax;
						updateSessionData(sessionData);
						location.href = 'vizDemo2.html';
					}
   			}
			},
        },
		title: {
			useHTML: true,
			text: 'Time Evolution ' + '<a id = "year-reset" href="#">Reset</a>'
		},
		xAxis: {
            categories: yearNames
        },
		 series: [{
            name: 'document',
            data: yearValues
        }]
	});
    $('#chartInst').highcharts({
		chart: {
			height: 600,
			type: 'bar'
		},
		title: {
			useHTML: true,
			text: 'Top Organizations ' + '<a id = "institution-reset" href="#">Reset</a>'
		},
		tooltip: {
    backgroundColor: '#FCFFC5',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 3
},
		xAxis: {
            categories: InstitutionNames,
           labels: {
               style: {width: 50},
               useHTML: true,
        	   formatter: function() {
                	var inst = this.value.toLowerCase();
                    return '<a onClick = "clickInst(this,event)" href = "#" id="'+inst+'">'+this.value +'</a>';
                }
            }       },
		plotOptions: {
   		  series: {
         		cursor: 'pointer',
         		point: {
            		 events: {
               		  click: function (ev) {
               			  var thisInst = '"' + ev.point.category + '"';
               			  //set all institutions to inactive
               			  for(var i=0; i<sessionData.institutionsAdded.length; i++){
               				  sessionData.institutionsAdded[i].active = false;
               			  }
               			  //add this inst to sessionData
               			  var currIndex = sessionData.institutionsAdded.length;
               			  sessionData.institutionsAdded.push({label:thisInst,value:thisInst,index:currIndex,active:true})
               			  updateSessionData(sessionData);
               			  location.href = 'vizDemo2.html';
               		  }
            		 }
         		}
   		  }
		 },
		 series: [{
            name: 'Total',
            data: InstitutionValues,
				grouping: false,
				pointPadding: 0,
				groupPadding: 0
        }]
	});

    $('#chartRes').highcharts({
		chart: {
			height: 600,
			type: 'bar'
		},
		title: {
			useHTML: true,
			text: 'Top Experts ' + '<a id = "researcher-reset" href="#">Reset</a>'
//			text: 'Top Experts '
		},
		xAxis: {
            categories: ResearcherNames,
            labels:{
            	useHTML: true,
            	formatter: function(){
            		var res = this.value.slice(0,this.value.indexOf("/")).toLowerCase();
            		return '<a onClick = "clickRes(this,event)" href="#" id="'+res+'">'+this.value+'</a>';
            	}
            }
        },
		plotOptions: {
   		  series: {
         		cursor: 'pointer',
         		point: {
            		 events: {
               		  click: function (ev) {
               			  var thisResFull = ev.point.category;
               			  var thisRes = thisResFull.slice(0,thisResFull.indexOf("/")).toLowerCase();
               			  for(var i in sessionData.researchersAdded){
               				  sessionData.researchersAdded[i].active = false;
               			  }
               			  sessionData.researchersAdded.push({label:thisRes,value:thisRes,index:sessionData.researchersAdded.length,active:true});
               			  updateSessionData(sessionData);
               			  location.href = 'vizDemo2.html';
               		  }
            		 }
         		}
   		  },
		 },
		series: [
			{
				name: 'Total',
				data: ResearcherValues,
				grouping: false,
				pointPadding: 0,
				groupPadding: 0
			}
		]
	});

    // Initiate the chart
    $('#mapContainer').highcharts('Map', {

//			chart: {
//				events: {
//				  load: function () {
//				  this.mapZoom(0.5, 100, 100);
//				  }
//				}
//			},
		title: {
			useHTML: true,
			text: 'Documents By Country ' + '<a id = "map-reset" href="#">Reset</a>'
		},
        mapNavigation: {
            enabled: true,
            enableDoubleClickZoomTo: true
        },
       colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },
		plotOptions:{
        	series:{
            	point:{
                	events:{
                    	click: function(e){
								selectedCountry = this.code;
								sessionData.selectedCountry = selectedCountry;
								updateSessionData(sessionData);
								location.href = 'vizDemo2.html';
                        }
                    }
                }
            }
        },

        series: [{
            data: countryData,
            mapData: Highcharts.maps['custom/world'],
            joinBy: ['iso-a3', 'code'],
				name: "Documents",
				//allowPointSelect: true,
            cursor: 'pointer',
//            events: {
//                click: function (e) {
//                    e.point.zoomTo();
 //               }
//            }
			}]
    });


    $("#reset-button").click(function(){
    	resetDocType();
    	resetYear();
    	resetInst();
    	resetRes();
    	resetMap();
    	resetTopic();
    });
    $("#docType-reset").click(function(){
    	resetDocType();
    });
    $("#year-reset").click(function(){
    	resetYear();
    });
    $("#institution-reset").click(function(){
    	resetInst();
    });
    $("#researcher-reset").click(function(){
    	resetRes();
    });
    $("#map-reset").click(function(){
    	resetMap();
    });


};

function resetTopic(){
	for(var i in sessionData.topics){
		sessionData.topics[i].active = true;
	}
	updateSessionData(sessionData);
	window.location.href = "vizDemo2.html";
}

function resetMap(){
	sessionData.selectedCountry = "";
	updateSessionData(sessionData);
	window.location.href = "vizDemo2.html";
}

function resetRes(){
	var tmpRes = [];
	for(var i in sessionData.researchersAdded){
		sessionData.researchersAdded[i].active = false;
	}
	updateSessionData(sessionData);
	window.location.href = "vizDemo2.html";
}


function resetInst(){
	for(var i in sessionData.institutionsAdded){
		sessionData.institutionsAdded[i].active = false;
	}
	updateSessionData(sessionData);
	window.location.href = "vizDemo2.html";
}


function resetYear(){
	sessionData.start_year = 1980;
	sessionData.end_year = 2017;
	updateSessionData(sessionData);
	window.location.href = "vizDemo2.html";
}

function resetDocType(){
	for(var i in sessionData.docTypes){
		sessionData.docTypes[i].active = true;
	}
	updateSessionData(sessionData);
	window.location.href = "vizDemo2.html";
}
