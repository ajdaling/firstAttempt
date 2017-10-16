

//var config.port = CONFIG.config.port;
//var config.host = CONFIG.config.host;
var saveSearchURL = "../../app_layout/pages/dashboard.php";
var docIndexURL = "../docIndex/docIndex.html";
var instList_url = "../institution/institutionsList.html";
var visualize_url = "../newviz/vizDemo2.html";
var sForm = localStorage.getItem("sForm");
var reportDataStr = localStorage.getItem("reportData");
var reportData = JSON.parse(reportDataStr);
reportData.docIndexURL = docIndexURL;
var reportDataClone = JSON.parse(JSON.stringify(reportDataStr));
var oTable;
var queryFacets = {"year":[],"Institution_Name":[], "docOrigin":[]};
var first = true;
var topics = [];
init();
var results;

var full_url_arguments = "?this_qry="+reportData.title+"&main_qry="+reportData.title+"&instName="+reportData.institution+"&resName="+reportData.researcher+"&docType=&selectedCountry=&yearMin="+reportData.start_year+"&yearMax="+reportData.end_year;
if (reportData.topic1 != null) full_url_arguments += "&topic1="+reportData.topic1;
if (reportData.topic2 != null) full_url_arguments += "&topic2="+reportData.topic2;
if (reportData.topic3 != null) full_url_arguments += "&topic3="+reportData.topic3;
if (reportData.topic4 != null) full_url_arguments += "&topic4="+reportData.topic4;
if (reportData.topic5 != null) full_url_arguments += "&topic5="+reportData.topic5;
if (reportData.topic6 != null) full_url_arguments += "&topic6="+reportData.topic6;
if (reportData.topic7 != null) full_url_arguments += "&topic7="+reportData.topic7;
if (reportData.topic8 != null) full_url_arguments += "&topic8="+reportData.topic8;



console.log("in docMaster.js; config.host: ",config.host);
console.log("reportData: ");
console.log(reportData);
function set_first_to_false(){
	console.log("setting first to false");
	first = false;
}

function init(){
	addTopicNavs();
	createListeners();
	drawDataTable(getFacets);

}

function drawDataTable(dt_callback){
	console.log("drawing data table");
	$(function(){
		console.log("Querying for Datatable");
//		if(oTable != undefined){
//			oTable.fnClearTable().fnDraw(); //reset
//		}
		if(oTable != undefined){
			oTable.fnClearTable();
			oTable.fnDraw();//reset
		}
		oTable = $('#example').dataTable({
		 "bDestroy": true,
	    "bProcessing": true,
	    "bServerSide": true,
	    "sAjaxSource": "http://" + config.host + ":"+config.port+"/datatables.sjs",
	    "fnServerParams": function(aoData){
			console.log(reportData);

	    	for(var key in reportData){
	    		var retObj = {};
	    		retObj["name"] = key;
	    		retObj["value"] = reportData[key];
	    		aoData.push(retObj);
	    	}
	     },

	    "scrollY": '60vh',
	    "scrollX": false,
	    "scrollCollapse": true,
	    "columnDefs": [
		 {
			 "render": function ( data, type, row ) {
				 data = data.replace(";","");
				 data = data.replace(",","");
				 data = data.toLowerCase();
                 return '<a href="../institution/instData.html'+full_url_arguments+'&thisCompName=' + data + '" target="_blank">' + data.toUpperCase() + '</a>';
			 },
			 "targets": 2
		 },
	    {
	    	targets: 4,
	    	render: function(data,type,row){
	    		return '<a href="' + row[5] + '" target="_blank">' + data + '</a>';
	    	}
	    },
	    {
	    	targets: [0,1,2],
	    	width: "15%"
	    },
	    {
	    	targets: [3],
	    	render: function(data){
	    		var ret_str = String(data);
	    		ret_str = ret_str.replace(/;/g," ");
	    	    ret_str = ret_str.replace(/,\s*([a-z])/g, function(d,e) { return ", "+e.toUpperCase() + "." });

	    		return(ret_str);
	    	}
	    },
	    {
	    	targets: [4],
	    	width: "35%"
	    },
	    {
	        targets: [ 2, 3, 4 ],
	        render: function ( data, type, row ) {
	            return data.substr( 0, 60 ) + "...";
	        }
	    },
	    ],
	    dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
	  });
	});
	dt_callback(createFacetTables);
}

function reQuery(requery_callback){
	var idx = 1;
	console.log("Requerying: ");
	for(var facet_type in queryFacets){
		for(var i in queryFacets[facet_type]){
			reportData["facet" + String(idx) + "_type"] = facet_type;
			reportData["facet" +String(idx) + "_value"] = queryFacets[facet_type][i];
			idx++;
		}
	}
	console.log(reportData);
	requery_callback();
}

function reDraw(){
	drawDataTable(getFacets);
}

function getFacets(callback2){
	console.log("querying for facets");
	console.log(reportData);
	var ret_facets;
	$(document).ready(function(){
	    $.ajax({
	      type: "GET",
	      url: "http://"+config.host+":"+config.port+"/facet.sjs",
	      data: reportData,
	      success: function(data){
	        ret_facets = data.facets;
	        results = data.facets;
	    	callback2(ret_facets);
	      }
	    })
	})
}

function createFacetTables(facets){
	console.log("creating facet tables");
//	if(first){
		createYearFacetTable(facets);
		createInstitutionFacetTable(facets);
		createDocOriginFacetTable(facets);
//		getClusters(createClusterFacetTable);
		first = false;
//	} else{

//	}
}

function createYearFacetTable(facets){
	console.log("creating year facet tables ");
	var yearFacetTableRows;
	var yearFacetTableCells;

	var yearFacetTableRows = d3.select('#yearFacetTable')
	.selectAll("tr")
	.data(function(){
		var ret_arr = [];
		for(var yr in facets.year){
			var temp_arr = [];
			temp_arr.push(yr);
			temp_arr.push(facets.year[yr]);
			ret_arr.push(temp_arr);
		}
		ret_arr.sort(function(a,b){
			return(b[1] - a[1]);
		});
		return(ret_arr);
	});

	//Enter
	yearFacetTableRows.enter().append('tr')
	.selectAll("td").data(function(d){
		return(d);
	}).enter().append("td").text(function(d){
		return(d);
	});

	//Exit
	yearFacetTableRows.exit().remove();

	var yearFacetTableCells = yearFacetTableRows.selectAll("td")
	.data(function(d){
		return(d);
	}).text(function(d){
		return(d);
	});


	yearFacetTableCells.exit().remove();

	if(first){
//		yearFaceTableRows.click(function(d){
		$(document).on("click","#yearFacetTable > tr",function(d){
//		$("#yearFacetTable > tr").click(function(d){
			var yr = $(this).closest('tr').find('td:nth-child(1)').text();
			var docs = $(this).closest('tr').find('td:nth-child(2)').text();
			if($(this).hasClass('active')){
				delete queryFacets.year[yr];
			} else{
				queryFacets.year.push(yr);
			}
			$(this).toggleClass("active");
		})
	}


}
function createInstitutionFacetTable(facets){
	console.log("creating institution facet tables ");
	var institutionFacetTableRows;
	var institutionFacetTableCells;

	var institutionFacetTableRows = d3.select('#institutionFacetTable')
	.selectAll("tr")
	.data(function(){
		var ret_arr = [];
		for(var inst in facets.Institution_Name){
			var temp_arr = [];
			temp_arr.push(inst);
			temp_arr.push(facets.Institution_Name[inst]);
			ret_arr.push(temp_arr);
		}
		ret_arr.sort(function(a,b){
			return(b[1] - a[1]);
		});
		return(ret_arr);
	});

	//Enter
	institutionFacetTableRows.enter().append('tr')
	.selectAll("td").data(function(d){
		return(d);
	}).enter().append("td").text(function(d){
		return(d);
	});

	//Exit
	institutionFacetTableRows.exit().remove();

	var institutionFacetTableCells = institutionFacetTableRows.selectAll("td")
	.data(function(d){
		return(d);
	}).text(function(d){
		return(d);
	});


	institutionFacetTableCells.exit().remove();

	if(first){
		$(document).on("click","#institutionFacetTable > tr",function(d){
//		$("#institutionFacetTable > tr").click(function(d){
			var inst = $(this).closest('tr').find('td:nth-child(1)').text();
			var docs = $(this).closest('tr').find('td:nth-child(2)').text();
			if($(this).hasClass('active')){
				delete queryFacets.Institution_Name[inst];
			} else{
				queryFacets.Institution_Name.push(inst);
			}
			$(this).toggleClass("active");
		})
	}
}
function createDocOriginFacetTable(facets){
	console.log("creating docOrigin facet tables ");
	var docOriginFacetTableRows;
	var docOriginFacetTableCells;

	var docOriginFacetTableRows = d3.select('#docOriginFacetTable')
	.selectAll("tr")
	.data(function(){
		var ret_arr = [];
		for(var orgn in facets.docOrigin){
			var temp_arr = [];
			temp_arr.push(orgn);
			temp_arr.push(facets.docOrigin[orgn]);
			ret_arr.push(temp_arr);
		}
		ret_arr.sort(function(a,b){
			return(b[1] - a[1]);
		});
		return(ret_arr);
	});

	//Enter
	docOriginFacetTableRows.enter().append('tr')
	.selectAll("td").data(function(d){
		return(d);
	}).enter().append("td").text(function(d){
		return(d);
	});

	//Exit
	docOriginFacetTableRows.exit().remove();

	var docOriginFacetTableCells = docOriginFacetTableRows.selectAll("td")
	.data(function(d){
		return(d);
	}).text(function(d){
		return(d);
	});


	docOriginFacetTableCells.exit().remove();

	if(first){
//		$("#docOriginFacetTable > tr").click(function(d){
		$(document).on("click","#docOriginFacetTable > tr",function(d){
			var orgn = $(this).closest('tr').find('td:nth-child(1)').text();
			var docs = $(this).closest('tr').find('td:nth-child(2)').text();
			if($(this).hasClass('active')){
				delete queryFacets.docOrigin[orgn];
			} else{
				queryFacets.docOrigin.push(orgn);
			}
			$(this).toggleClass("active");
		})
	}


}


var all_clusters;
function getClusters(table_cb){
	$.ajax({
	      type: "GET",
	      url: "http://"+config.host+":"+config.port+"/cluster/cluster.sjs",
	      data: reportData,
	      success: function(data){
	    	  all_clusters = JSON.parse(JSON.stringify(data));
	    	  table_cb(data);
	      },
	});
}

function createClusterFacetTable(clusters){
	console.log("creating cluster facet tables ");
	var clusterFacetTableRows;
	var clusterFacetTableCells;

	var clusterFacetTableRows = d3.select('#clusterFacetTable')
	.selectAll("tr")
	.data(function(){
		var ret_arr = [];
		for(var idx in clusters.clusters){
			var temp_arr = [];
			temp_arr.push(clusters.clusters[idx].label);
			temp_arr.push(clusters.clusters[idx].nodes.length);
			ret_arr.push(temp_arr);
		}
		ret_arr.sort(function(a,b){
			return(b[1] - a[1]);
		});
		return(ret_arr);
	});

	//Enter
	clusterFacetTableRows.enter().append('tr')
	.selectAll("td").data(function(d){
		return(d);
	}).enter().append("td").text(function(d){
		return(d);
	});

	//Exit
	clusterFacetTableRows.exit().remove();

	var clusterFacetTableCells = clusterFacetTableRows.selectAll("td")
	.data(function(d){
		return(d);
	}).text(function(d){
		return(d);
	});


	clusterFacetTableCells.exit().remove();

	if(first){
		$(document).on("click","#clusterFacetTable > tr",function(d){
			var clstr = $(this).closest('tr').find('td:nth-child(1)').text();
			var docs = $(this).closest('tr').find('td:nth-child(2)').text();
			if($(this).hasClass('active')){
				//delete queryFacets.docOrigin[orgn];
				//console.log("just deleted "+orgn);
			} else{
				//queryFacets.docOrigin.push(orgn);
				//console.log("just added "+orgn);
			}
			$(this).toggleClass("active");
		})
	}


}


function createListeners(){
	$("#vis_btn").click(function(){

//	http://localhost:9000/newviz/vizDemo2.html?main_qry=(traumatic%20AND%20injury)%20OR%20brain
//	&instName=&resName=&docType=&yearMin=&yearMax=&selectedCountry=
		console.log("reportData");
		console.log(reportData);
		localStorage.setItem("reportData",JSON.stringify(reportData));
		full_url = visualize_url+"?this_qry="+reportData.title+"&main_qry="+reportData.title+"&instName="+reportData.institution+"&resName="+reportData.researcher+"&docType=&selectedCountry=&yearMin="+reportData.start_year+"&yearMax="+reportData.end_year;
		if (reportData.topic1 != null) full_url += "&topic1="+reportData.topic1;
		if (reportData.topic2 != null) full_url += "&topic2="+reportData.topic2;
		if (reportData.topic3 != null) full_url += "&topic3="+reportData.topic3;
		if (reportData.topic4 != null) full_url += "&topic4="+reportData.topic4;
		if (reportData.topic5 != null) full_url += "&topic5="+reportData.topic5;
		if (reportData.topic6 != null) full_url += "&topic6="+reportData.topic6;
		if (reportData.topic7 != null) full_url += "&topic7="+reportData.topic7;
		if (reportData.topic8 != null) full_url += "&topic8="+reportData.topic8;
		console.log("full_url "+full_url);
		var win = window.open(full_url);





		  // win.reportData = reportData;
	});




//send data to savesearch.php
$("#save_btn").click(function(){



	localStorage.setItem("reportData",JSON.stringify(reportData));


	var username = "Ryan";
	var searchName = prompt("Please name your search:", Date());
/*
	alert("This search has been saved: \n "
	+ " Username = " + username + "\n"
	+ " Search Name = " + searchName + "\n"
	+ " Main Query = " + reportData.title + "\n"
	+ " Institution Name = " + reportData.institution + "\n"
	+ " Researcher = " + reportData.researcher + "\n"
	+ " Start Year = " + reportData.start_year + "\n"
	+ " End Year = " + reportData.end_year + "\n"
	+ " Topic 1 = " + reportData.topic1 + "\n"
	+ " Topic 2 = " + reportData.topic2 + "\n"
	+ " Topic 3 = " + reportData.topic3 + "\n"
	+ " Topic 4 = " + reportData.topic4 + "\n"
	+ " Topic 5 = " + reportData.topic5 + "\n"
	+ " Topic 6 = " + reportData.topic6 + "\n"
	+ " Topic 7 = " + reportData.topic7 + "\n"
	+ " Topic 8 = " + reportData.topic8 + "\n")

*/
	 $.ajax({
	  type: "POST",
	  url: "savesearch.php",
	  data: { username: username, searchName: searchName, mainQuery: reportData.title, institutionName: reportData.institution, researcherName: reportData.researcher,
	   	yearMin: reportData.start_year, yearMax: reportData.end_year,
			topic1: reportData.topic1, topic2: reportData.topic2, topic3: reportData.topic3, topic4: reportData.topic4, topic5: reportData.topic5, topic6: reportData.topic6, topic7: reportData.topic7, topic8: reportData.topic8 }
		});
});

//	$(document).on("click","#refine_button",function(){
	$("#refine_button").click(function(){
		reQuery(reDraw);
		$('tbody > tr.active').removeClass('active');
	})

//	$(document).on("click","#clear_button",function(){
	$("#clear_button").click(function(){
		console.log("clicked clear");
		reportData.topicQuery = "none";
		for(var param in reportData){
			if(param.includes("facet")){
				delete reportData[param];
			}
		}
		reportData["topicQuery"] = "";
		$('tbody > tr.active').toggleClass('active');
		$('#topicsNav > li.active').toggleClass('active');
		//addTopicNavs();
		queryFacets = {"year":[],"Institution_Name":[], "docOrigin":[]};
		reQuery(reDraw);
	})
}
function addTopicNavs(){
	d3.select("#topicNavs").selectAll("li,btn,a").remove();

	//get array of topics
	for(var i = 0; i < 50; i++){
		var top_str = "topic"+String(i);
		if(reportData.hasOwnProperty(top_str)){
			var tempObj = {};
			tempObj["name"] = top_str;
			tempObj["value"] = reportData[top_str];
			topics.push(tempObj);
		}
	}
	//create topic nav buttons
	var topicNavs = d3.select("#topicsNav").selectAll("li").data(topics).enter()
	.append("li").attr("data-toggle","tab")
	.attr("font-size","large")
	.append("a").attr("href","#").attr("class","btn btn-primary topicNav")
	.attr("font-size-adjust","200%")
	;


	topicNavs.append("span").attr("class","nav-icon")
	.append("i").attr("class","fa fa-gear");

	topicNavs.text(function(d){
		console.log(d);
		return(d.name + " : " + d.value);
	});

	topicNavs.on("click",function(d){
		reportData["topicQuery"] = d.value;
		console.log("updated topicQuery");
		console.log(reportData);
		console.log("redrawing with topic");
		reQuery(reDraw);
	});
}
