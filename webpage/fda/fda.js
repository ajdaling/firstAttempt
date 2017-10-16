var sessionData = getSessionData();
var oTable;
var yearNames = [];
for(var i = sessionData.start_year; i <= sessionData.end_year; i++){
	yearNames.push(String(i));
}

init();
function init(){
	createListeners();
	drawDataTable();
	createYearChart();
}


function createListeners(){
	$("#clear-inst-search-btn").on("click",function(){
		$("#inst-search").val("*");
		var instName =  $("#inst-search").val();
		sessionData.fdaData.compName = instName;
		updateSessionData(sessionData);
		reQuery(reDraw);
	});
	$("#inst-search-btn").on("click",function(){
		var instName =  $("#inst-search").val();
		sessionData.fdaData.compName = instName;
		updateSessionData(sessionData);
		reQuery(reDraw);
	});
	$("#inst-search").on("focus",function(){
		$("#suggestions").show();
	})
//	.on("focusout",function(){
//		event.preventDefault();
//		$("#suggestions").hide();
//	})
	$("#hide-sug-btn").on("click",function(){
		$("#suggestions").hide();
	})
	$("#inst-search").on("change",function(){
		var instName =  $("#inst-search").val();
		sessionData.fdaData.compName = instName;
		updateSessionData(sessionData);
		reQuery(reDraw);
	});
	$("#inst-search").on("input",function(){
		var instName =  $("#inst-search").val();
		sessionData.fdaData.compName = instName;
		updateSessionData(sessionData);
		getSuggestions();
	})
//	$("#suggestions-list > li").on("click",function(){
//		
//	})
	if(sessionData.fdaData){
		if(sessionData.fdaData.compName){
			$("#inst-search").val(sessionData.fdaData.compName);
		} else{
			$("#inst-search").val("*");
		}
	}else{
		$("#inst-search").val("*");
	}
	$("#inst-search").text(sessionData.fdaData);
}
function reQuery(requery_callback){
	console.log("Requerying");
	oTable.destroy();
	d3.select("#dt1").remove();
	requery_callback();
}

function reDraw(){
	drawDataTable();
	createYearChart();
}

function getSuggestions(){
	$.ajax({
		  method : "GET",
		  crossDomain: true,
		  xhrFields: {
			  withCredentials: true,
		  },
		  url: config.dataURL+"/fda/fdaSuggestions.sjs",
		  data: JSON.stringify(sessionData),
		  success: function(data){
			  console.log(data);
			  showSuggestions(data.facets.Institution_Name);
		  },
		});
}
function showSuggestions(data){
	var sug = [];
	if(data){
		Object.keys(data).forEach(function(key){
			sug.push(key+" : " + data[key]);
		})
	}
	
	console.log(sug);
	
	var sugList = d3.select("#suggestions-list").selectAll("li").data(sug);
	sugList.enter().append("li").text(function(d){
		return(d);
	}).style("cursor","pointer")
	.style("background-color","white")
	.on("mouseenter",function(){
		d3.select(this).style("background-color","gray");
	}).on("mouseleave",function(){
		d3.select(this).style("background-color","white");
	}).on("click",function(d){
		console.log("clicked");
		event.preventDefault();
		var inst = d.split(":")[0];
		sessionData.fdaData.compName = inst;
		console.log(inst);
		$("#inst-search").val(inst);
		updateSessionData(sessionData);
		$("#suggestions").hide();
		reQuery(reDraw);
	});
	
	sugList.exit().remove();
	
}

function update(){
	drawDataTable();
	createYearChart();
}

function drawDataTable(){
	if(oTable != undefined){
//		oTable.fnClearTable();
//		oTable.fnDraw();//reset
	}
	$("#dt-panel").append("<table id = 'dt1'></div><thead><tr><th>Year</th><th>Organization</th><th>Drug Name</th><th>Status</th></tr></thead><tfoot><tr><th>Year</th><th>Drug Name</th><th>Status</th></tr></tfoot></table>")
	oTable = $("#dt1").DataTable({
//	"lengthMenu": [[10, 25, 50, 100], [10, 25, 50, 100]],
	processing: true,
	serverSide: true,
	ajax: {
	      type: "GET",
	      crossDomain: true,
	      xhrFields: {
	    	  withCredentials: true,
	      },
	      url: config.dataURL+"/fda/fdaDatatable.sjs",
	      data: {params: JSON.stringify(sessionData)},
	},
    "scrollY": '60vh',
    "scrollX": true,
	"order": [[ 0, "desc" ]],
    "scrollCollapse": true,
    "columnDefs": [
    ],
    dom: 'l<"toolbar">Bfrtip',
    buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
    ]
  });
  $("div.card__title").html('<b>Document Results</b>');
//}
  
  $("#dt1 tbody").on("click","tr",function(){
	  $("#dt1 tr").removeClass("active");
	  $(this).addClass('active');
	  var ro = oTable.row(this).data();
	  var URI = ro[4];
	  clickRow(URI);
  });
  
  $("#dt1 tr").on("hover",function(){
	  console.log("hovering");
	  $(this).css("background-color","gray");
  })
  
  $("#dt1 tbody> tr:first").trigger("click");
}

function clickRow(uri){
	$.ajax({
	  method : "GET",
	  crossDomain: true,
	  xhrFields: {
		  withCredentials: true,
	  },
	  url: config.dataURL+"/fda/fda.sjs?uri="+uri,
	  success: function(data){
		  console.log(data);
		  drawTabs(data);
	  },
	});
}

function drawTabs(data){
	
	d3.select("#general-list").selectAll("li").remove();
	var gd = [];
	gd.push("Organization: " + data.institution[0].Institution_Name);
	gd.push("Application Type: " + data.appType);
	gd.push("Year: " + data.year);
	gd.push("DB ID: " + data.docdbID);
	gd.push("Number of Applications: " + data.applications.length);
	gd.push("Number of Products: " + data.numProducts);
	
	d3.select("#general-list").selectAll("li").data(gd).enter()
	.append("li").text(function(d){
		return(d);
	});
	
	d3.select("#prod-table").selectAll("tr").remove();
	var pd = [];
	for(var i in data.products){
		var tmp = [];
		tmp.push(data.products[i].drugName);
		tmp.push(data.products[i].ingredient);
		tmp.push(data.products[i].marketingStatus);
		pd.push(tmp);
	}
	d3.select("#prod-table").selectAll("tr").data(pd).enter()
	.append("tr").selectAll("td").data(function(d){return(d)})
	.enter().append("td").text(function(d){return(d);});
	
	d3.select("#app-list").selectAll("li").remove();
	var ad = []; //application data
	for(var i in data.applications){
		var url = "";
		var tmp = "Year: " + data.applications[i].appYear + " -- Type: " + data.applications[i].appDesc;
		if(data.applications[i].appUrl){
			url = data.applications[i].appUrl;
		}
		d3.select("#app-list").append("li").append("a").text(tmp).attr("href",function(){
			if(url){
				return(url);
			}else{
				return(null);
			}
		}).attr("target","_blank");
	}
	
}


function createYearChart(){
	$.ajax({
		  method : "GET",
		  crossDomain: true,
		  xhrFields: {
			  withCredentials: true,
		  },
		  url: config.dataURL+"/fda/fdaYearChart.sjs",
		  data: JSON.stringify(sessionData),
		  success: function(data){
			  console.log(data);
			  var yrs = data.facets.year;
			  var years = [];
			  var yearVals = [];
			  for(var i=sessionData.start_year; i <= sessionData.end_year; i++){
				  years.push(i);
				  if(yrs[i]){
					  yearVals.push(yrs[i]);
				  } else{
					  yearVals.push(0);
				  }
			  }
			  drawYearChart(years,yearVals);
		  },
		});
}

function drawYearChart(years,yearVals){
	$('#chartYears').highcharts({
		chart: {
			type: 'column',
			zoomType: 'x',
        },
		title: {
			useHTML: true,
			text: 'Time Evolution ' + '<a id = "year-reset" href="#">Reset</a>'
		},
		xAxis: {
            categories: years
        },
		 series: [{
            name: 'document',
            data: yearVals
        }]
	});
}