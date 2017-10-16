var sessionData = JSON.parse(localStorage.getItem("sessionData"));
var oTable;
var first = true;
var results;
var drewTable = false;
var topicEstimates = {};

if(!sessionData.mainFacets){
	sessionData.mainFacets = [];
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function capitalize(tstring) {
    return tstring.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};


init();




function set_first_to_false(){
	first = false;
}

function init(){
	getTopicEstimates();
	createListeners();
	drawDataTable(getFacets);
}

function drawDataTable(dt_callback){
		if(oTable != undefined){
//			oTable.fnClearTable();
//			oTable.fnDraw();//reset
		}
		$("#dt-panel").append("<table id = 'dt1'></div><thead><tr><th>Year</th><th>Source</th><th>Organizations</th><th>Experts</th><th>Title</th></tr></thead><tfoot><tr><th>Year</th><th>Source</th><th>Organizations</th><th>Experts</th><th>Title</th></tr></tfoot></table>")
		oTable = $("#dt1").DataTable({
		processing: true,
		serverSide: true,
		ajax: {
		      type: "GET",
		      crossDomain: true,
		      xhrFields: {
		    	  withCredentials: true,
		      },
		      url: config.dataURL+"/docMaster/datatablesSimple.sjs",
		      data: {params: JSON.stringify(sessionData)},

		},
	    "scrollY": '60vh',
	    "scrollX": true,
			"order": [[ 0, "desc" ]],
	    "scrollCollapse": true,
	    "columnDefs": [
		 {
			 "render": function ( data, type, row ) {
				 data = data.replace(";","");
				 data = data.replace(",","");
				 var odata = data;
				 //data = data.toLowerCase();
				 data = capitalize(data);
                 return '<a onclick="clickInst(this,event)" id="'+odata+'" href="#">'+data.substr(0,50)+"..."+'</a>';
			 },
			 "targets": 2
		 },
	    {
	    	targets: 4,
	    	render: function(data,type,row){
	    		return '<a onclick = "clickDoc(this,event)" class = "'+row[5]+'" id = "'+row[6]+'" href="#" target="_blank">' + data + '</a>';
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
	    	    ret_str = ret_str.substr(0,60) + "...";
	    		return(ret_str);
	    	}
	    },
	    {
	    	targets: [4],
	    	width: "35%"
	    },
	    ],
	    dom: '<"toolbar">Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
	  });
	  $("div.card__title").html('<b>Document Results</b>');
//	}

	dt_callback(createFacetTables);
}

function reQuery(requery_callback){
	console.log("Requerying");
	var newYears = $("#year-slider").val().split(",");
	sessionData.start_year = String(newYears[0]);
	sessionData.end_year = String(newYears[1]);
	updateSessionData(sessionData);
	oTable.destroy();
	d3.select("#dt1").remove();
	requery_callback();
}

function reDraw(){
	drawDataTable(getFacets);
}

function getFacets(callback2){
	var ret_facets;
    $.ajax({
      type: "GET",
      
      crossDomain: true,
      xhrFields: {
    	  withCredentials: true,
      },
      url: config.dataURL+"/docMaster/facetSimple.sjs",
      data: JSON.stringify(sessionData),

      success: function(data){
        ret_facets = data.facets;
        results = data.facets;
    	callback2(ret_facets);
      }
    })
}

function createFacetTables(facets){
	console.log("creating facet tables");
	//create listener for inst links in datatable, put here because it's directly after datatable finished loading
	$(".instName").click(function(){
		if(!sessionData.instData){
			sessionData.instData = {};
			sessionData.instData.start_year = sessionData.start_year;
			sessionData.instData.end_year = sessionData.end_year;
		}
		sessionData.instData.compName = this.id;
		updateSessionData(sessionData);
		window.location.href = config.institutionLink;
	});

		getTopicEstimates();
		createInstitutionFacetTable(facets);
		createDocOriginFacetTable(facets);
		createMeshFacetTable(facets);
		createResFacetTable(facets);
//		getClusters(createClusterFacetTable);
		first = false;
}

//function createYearSlider(facets){
//	
//	$("#year-label").text( function(){
//		var est = 0;
//		for(var i = sessionData.start_year; i <= sessionData.end_year; i++){
//			if(facets.year[i]){
//				est += facets.year[i];
//			}
//		}
//		var str = String(sessionData.start_year) + " - " + String(sessionData.end_year) + " : " + String(est) + " Documents";
//		return(str);
//	});
//	var yearSlider = $("#year-slider").slider({ 
//		min: 1980, 
//		max: 2017, 
//		value: [parseInt(sessionData.start_year), parseInt(sessionData.end_year)], 
//		focus: true,
//		tooltip_position: 'right',
//		});
//	
//	yearSlider.on("slide",function(val){
//		$("#year-label").text(function(){
//			var ret = "";
//			var startyr = val.value[0];
//			var endyr = val.value[1];
//			//sessionData.start_year = startyr;
//			//sessionData.end_year = endyr;
//			//updateSessionData(sessionData);
//			var res = 0;
//			for(var i = startyr; i <= endyr; i++){
//				if(facets.year[i]){
//					res += facets.year[i];
//				}
//			}
//			ret = String(val.value[0]) + " - " + String(val.value[1] + " : " + String(res) + " Documents");
//			return(ret);
//		})
//	})
//	
//}


function createInstitutionFacetTable(facets){
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

//	if(first){
//		$(document).on("click","#institutionFacetTable > tr",function(d){
////		$("#institutionFacetTable > tr").click(function(d){
//			var inst = $(this).closest('tr').find('td:nth-child(1)').text();
//			var docs = $(this).closest('tr').find('td:nth-child(2)').text();
//			if($(this).hasClass('active')){
//				for(var i in sessionData.mainFacets){
//					if(sessionData.mainFacets[i].value == "institution"){
//						delete[sessionData.mainFacets[i]];
//					}
//				}
//			} else{
//				sessionData.mainFacets.push({"type":"institution","value":inst})
//			}
//			$(this).toggleClass("active");
//		})
//	}
}
function createDocOriginFacetTable(facets){
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

//	if(first){
////		$("#docOriginFacetTable > tr").click(function(d){
//		$(document).on("click","#docOriginFacetTable > tr",function(d){
//			var orgn = $(this).closest('tr').find('td:nth-child(1)').text();
//			var docs = $(this).closest('tr').find('td:nth-child(2)').text();
//			if($(this).hasClass('active')){
//				for(var i in sessionData.mainFacets){
//					if(sessionData.mainFacets[i].value == orgn){
//						delete[sessionData.mainFacets[i]];
//					}
//				}
//			} else{
//				sessionData.mainFacets.push({"type":"docOrigin","value":orgn})
//			}
//			$(this).toggleClass("active");
//		})
//	}
}

function createMeshFacetTable(facets){
	var meshFacetTableRows;
	var meshFacetTableCells;

	var meshFacetTableRows = d3.select('#meshFacetTable')
	.selectAll("tr")
	.data(function(){
		var ret_arr = [];
		for(var mesh in facets.meshterms){
			var temp_arr = [];
			temp_arr.push(mesh);
			temp_arr.push(facets.meshterms[mesh]);
			ret_arr.push(temp_arr);
		}
		ret_arr.sort(function(a,b){
			return(b[1] - a[1]);
		});
		return(ret_arr);
	});

	//Enter
	meshFacetTableRows.enter().append('tr')
	.selectAll("td").data(function(d){
		return(d);
	}).enter().append("td").text(function(d){
		return(d);
	});

	//Exit
	meshFacetTableRows.exit().remove();

	var meshFacetTableCells = meshFacetTableRows.selectAll("td")
	.data(function(d){
		return(d);
	}).text(function(d){
		return(d);
	});


	meshFacetTableCells.exit().remove();

//	if(first){
//		$(document).on("click","#meshFacetTable > tr",function(d){
//			var mesh = $(this).closest('tr').find('td:nth-child(1)').text();
//			var docs = $(this).closest('tr').find('td:nth-child(2)').text();
//			if($(this).hasClass('active')){
//				for(var i in sessionData.mainFacets){
//					if(sessionData.mainFacets[i].value == mesh){
//						delete[sessionData.mainFacets[i]];
//					}
//				}
//			} else{
//				sessionData.mainFacets.push({"type":"mesh","value":mesh})
//			}
//			$(this).toggleClass("active");
//		})
//	}
}

function createResFacetTable(facets){
	var resFacetTableRows;
	var resFacetTableCells;

	var resFacetTableRows = d3.select('#resFacetTable')
	.selectAll("tr")
	.data(function(){
		var ret_arr = [];
		for(var res in facets.researcherName){
			var temp_arr = [];
			temp_arr.push(res);
			temp_arr.push(facets.researcherName[res]);
			ret_arr.push(temp_arr);
		}
		ret_arr.sort(function(a,b){
			return(b[1] - a[1]);
		});
		return(ret_arr);
	});

	//Enter
	resFacetTableRows.enter().append('tr')
	.selectAll("td").data(function(d){
		return(d);
	}).enter().append("td").text(function(d){
		return(d);
	});

	//Exit
	resFacetTableRows.exit().remove();

	var resFacetTableCells = resFacetTableRows.selectAll("td")
	.data(function(d){
		return(d);
	}).text(function(d){
		return(d);
	});


	resFacetTableCells.exit().remove();

//	if(first){
//		$(document).on("click","#meshFacetTable > tr",function(d){
//			var mesh = $(this).closest('tr').find('td:nth-child(1)').text();
//			var docs = $(this).closest('tr').find('td:nth-child(2)').text();
//			if($(this).hasClass('active')){
//				for(var i in sessionData.mainFacets){
//					if(sessionData.mainFacets[i].value == mesh){
//						delete[sessionData.mainFacets[i]];
//					}
//				}
//			} else{
//				sessionData.mainFacets.push({"type":"mesh","value":mesh})
//			}
//			$(this).toggleClass("active");
//		})
//	}
}

function createListeners(){
	
	$("#vis_btn").click(function(){
		document.location.href = config.visualizationLink;
	});

	$("#rep_btn").click(function(){
		document.location.href = config.reportLink;
	});


	$("#save_btn").off("click").on("click",function(event){
		event.preventDefault();

		/*var dt = new Date();
		var utcDate = dt.toUTCString();


*/

		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!

		var yyyy = today.getFullYear();
		if(dd<10){
		    dd='0'+dd;
		}
		if(mm<10){
		    mm='0'+mm;
		}
		var today = dd+'/'+mm+'/'+yyyy;


var date = new Date();
// Hours part from the timestamp
var hours = date.getHours();
// Minutes part from the timestamp
var minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
var seconds = "0" + date.getSeconds();

// Will display time in 10:30:23 format
var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

var searchName = prompt("Please enter a name for your search:", today + "(" + formattedTime + ")");


		if (searchName == null || searchName == "") {
       searchName = today + " (" + formattedTime + ")";
    }

		sessionData.searchName = searchName;
		sessionData.sessionID = Math.ceil(Math.random()*1000000);

		$.ajax({
			url: config.dataURL+"/sessions/saveSessionRequest.sjs",
			type: "GET",
			xhrFields: { withCredentials: true },
			contentType: "application/json",
		    crossDomain: true,
		    data: JSON.stringify(sessionData),
			success: function(retdata){

				alert("saved");
			},
			error: function() {
				alert("error");
			}
		});
	});


	$("#refine_button").click(function(){
		reQuery(reDraw);
		//$('tbody > tr.active').removeClass('active');
	})

	$("#clear_button").click(function(){
		sessionData.topicQuery = "none";
		for(var param in sessionData){
			if(param.includes("facet")){
				delete sessionData[param];
			}
		}
		sessionData.start_year = "2000";
		sessionData.end_year = "2017";
		 $('#year-slider').slider('setValue', [2000,2017]);
		sessionData["topicQuery"] = "";
		$('tbody > tr.active').toggleClass('active');
		sessionData.mainFacets = [];
		updateSessionData(sessionData);
		reQuery(reDraw);
	})
}

function addTopicTable(){
	d3.select("#topicFacetTable").selectAll("tr").remove();
	
	var rows = d3.select("#topicFacetTable").selectAll("tr").data(function(){
		var ret = [];
		for(var i in topicEstimates){
			var tmp = [];
			tmp.push(topicEstimates[i].label);
			tmp.push(topicEstimates[i].estimate);
//			ret.push({"label":topicEstimates[i].label, "estimate":topicEstimates[i].estimate});
			ret.push(tmp);
		}
		return(ret);
	});
	
	//enter
	rows.enter().append("tr")
	.style("cursor","pointer")
//	.on("click",function(d){
//		if($(this).hasClass("active")){
//			delete sessionData.topicQuery;
//			reQuery(reDraw);
//		} else{
//			$("#topicFacetTable .active").removeClass("active");
//			sessionData["topicQuery"] = topicEstimates[d[0]].topic;
//			reQuery(reDraw);
//		}
//		$(this).toggleClass("active");
//	})
	.selectAll("td").data(function(d){
		return(d);
	}).enter().append("td").text(function(d){
		return(d);
	})
	
	//exit
	rows.exit().remove();
	
	var topicFacetCells = rows.selectAll("td")
	.data(function(d){
		return(d);
	}).text(function(d){
		return(d);
	});
	topicFacetCells.exit().remove();
}

function getTopicEstimates(){
	var topics = [];
	var tmpData = JSON.parse(JSON.stringify(sessionData));
	tmpData.topics = topicEstimates;
	if(sessionData.topics){
		$.ajax({
		      method : "GET",
		      crossDomain: true,
		      //contentType: "application/json; charset=UTF-8",
		      xhrFields: {
		    	  withCredentials: true,
		      },
//		      dataType: 'text',
		      url: config.dataURL+"/docMaster/getTopicEstimatesSimple.sjs",
		      data: JSON.stringify(sessionData),
//		      data: sessionData,
		      success: function(data){
		    	  console.log("GOT TOPIC ESTIMATES");
		    	  console.log(data);
		    	  console.log("*********");
		    	  topicEstimates = data;
		    	  addTopicTable();
		      },
		});
	}
	
}
