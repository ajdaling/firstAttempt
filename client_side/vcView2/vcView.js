var oTable;
var oTable2;
var instDocsTable;
$("#mainQuery").val(sessionData.mainQuery);
$("#submit").on("click",function(){
	console.log("clicked");
	sessionData.mainQuery = $("#mainQuery").val();
	updateSessionData(sessionData);
//	getSmallCoData();
	makeInstAggsCharts();
});
function getSmallCoData(){
	console.log("getting raw output");
	var ajaxData = {};
	ajaxData.mainQuery = sessionData.mainQuery;

	$.ajax({
	  xhrFields: {
	    withCredentials: true
	  },
	  crossDomain: true,
	  type: "GET",
	  url: config.dataURL + "/vcView/allStartups.sjs",
	  data: JSON.stringify(sessionData),
	  success: function(data) {
	    console.log(data);
	    
//	    makeStartupTable(data.data);
//	    drawStartupEmpCatChart(data.aggs.employeeCat.buckets);
//	    drawStartupSourceChart(data.aggs.docOrigin.buckets);
//	    drawStartupInstChart(data.aggs.institution.buckets);
//	    drawStartupExpChart(data.aggs.researcher.buckets);
	  },
	  error:function(){
	    alert("error");
	  }
	});
}


function makeInstDocsTable(inst){
	
	if(instDocsTable){
		instDocsTable.destroy();
		d3.select("#instDocsTable").remove();
//		d3.select("#inst-docs-table-cont").selectAll("div","table","tr","th").remove();
	}
	d3.selectAll("table").remove();
	var args = {"mainQuery":sessionData.mainQuery,"institution":inst}
	$.ajax({
		  xhrFields: {
		    withCredentials: true
		  },
		  crossDomain: true,
		  type: "GET",
		  url: config.dataURL + "/vcView/getInstDocs.sjs",
		  data: JSON.stringify(args),
		  success: function(data) {
		    console.log(data);
		    drawInstDocsTable(data);
		  },
		  error:function(){
		    alert("error");
		  }
		});
}
//drawDataTable();
function drawInstDocsTable(data){
	console.log("drawing inst docs datatable");
	var theads = "";
	theads+="<th>Organization</th>";
	theads+="<th>IP Orgs</th>"
	theads+="<th>Experts</th>";
	theads+="<th>Year</th>";
	theads+="<th>Document Source</th>",
	theads+="<th>Title</th>";
	theads+="<th>Abstract</th>";
//	theads+="<th>Employee Count</th>";
//	theads+="<th>Employee Category</th>";
//	theads+="<th>Total Funding</th>";
//	theads+="<th>Patents</th>";
//	theads+="<th>NIH</th>";
//	theads+="<th>NSF</th>";
//	theads+="<th>Pubmed</th>";
//	theads+="<th>Clinical Trials</th>";
	$("#inst-docs-table-cont").append("<table id = 'instDocsTable'></div><thead><tr>"+theads+"</tr></thead><tfoot><tr>"+theads+"</tr></tfoot></table>")

	instDocsTable = $("#instDocsTable").DataTable({
		data:data,
	    "scrollY": '60vh',
	    "scrollX": false,
		"order": [[ 0, "desc" ]],
	    "scrollCollapse": true,
	    dom: 'l<"toolbar">Bfrtip',
	    buttons: [
	    	'colvis','copy', 'csv', 'excel', 'pdf', 'print'
	    	]
	});
}

function makeInstAggsCharts(){
	var args = {mainQuery:sessionData.mainQuery};
	$.ajax({
		  xhrFields: {
		    withCredentials: true
		  },
		  crossDomain: true,
		  type: "GET",
		  url: config.dataURL + "/vcView/instAggsFunding.sjs",
		  data: JSON.stringify(args),
		  success: function(data) {
		    console.log(data);
		    drawInstAggsFunding(data);
		  },
		  error:function(){
		    alert("error");
		  }
		});
	
	$.ajax({
		  xhrFields: {
		    withCredentials: true
		  },
		  crossDomain: true,
		  type: "GET",
		  url: config.dataURL + "/vcView/instAggsIP.sjs",
		  data: JSON.stringify(args),
		  success: function(data) {
		    console.log(data);
		    drawInstAggsIP(data.aggs.institution.buckets);
		  },
		  error:function(){
		    alert("error");
		  }
		});
}
function drawInstAggsIP(data){
	var instNames = [];
	var values = [];
	data.forEach(function(i){
		instNames.push(i.key);
		values.push(i.doc_count);
	});
	
    $('#fund-viz-left').highcharts({
		chart: {
			height: 600,
			type: 'bar'
		},
		title: {
			useHTML: true,
			text: 'Top Organizations by IP ' + '<a id = "institution-reset" href="#">Reset</a>'
		},
		tooltip: {
    backgroundColor: '#FCFFC5',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 3
},
		xAxis: {
            categories: instNames,
           labels: {
               style: {width: 100},
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
               			  makeInstDocsTable(thisInst);
               		  }
            		 }
         		}
   		  }
		 },
		 series: [{
            name: 'Total',
            data: values,
				grouping: false,
				pointPadding: 0,
				groupPadding: 0
        }]
	});
}

function drawInstAggsFunding(data){
	var instNames = [];
	var values = [];
	data.forEach(function(i){
		instNames.push(i.key);
		values.push(i.value);
	});
	
    $('#fund-viz-right').highcharts({
		chart: {
			height: 600,
			type: 'bar'
		},
		title: {
			useHTML: true,
			text: 'Top Organizations by Funding ' + '<a id = "institution-reset" href="#">Reset</a>'
		},
		tooltip: {
    backgroundColor: '#FCFFC5',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 3
},
		xAxis: {
            categories: instNames,
           labels: {
               style: {width: 100},
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
               			  makeInstDocsTable(thisInst);
               		  }
            		 }
         		}
   		  }
		 },
		 series: [{
            name: 'Total',
            data: values,
				grouping: false,
				pointPadding: 0,
				groupPadding: 0
        }]
	});
}


function makeStartupTable(data){
	
	if(oTable){
		oTable.destroy();
		d3.select("#dt1").remove();
		d3.select("#dt-well").selectAll("div","table","tr","th").remove();
	}
	d3.selectAll("table").remove();
	drawStartupTable(data);
}
//drawDataTable();
function drawStartupTable(data){
	console.log("drawing startup datatable");
	var theads = "";
	theads+="<th>Organization</th>";
	theads += "<th>Experts</th>";
	theads+="<th>Title</th>";
	theads+="<th>Description</th>";
	theads+="<th>Employee Count</th>";
//	theads+="<th>Employee Category</th>";
	theads+="<th>Total Funding</th>";
//	theads+="<th>Patents</th>";
//	theads+="<th>NIH</th>";
//	theads+="<th>NSF</th>";
//	theads+="<th>Pubmed</th>";
//	theads+="<th>Clinical Trials</th>";
	$("#startup-dt").append("<table id = 'dt1'></div><thead><tr>"+theads+"</tr></thead><tfoot><tr>"+theads+"</tr></tfoot></table>")

	oTable = $("#dt1").DataTable({
//	"lengthMenu": [[10, 25, 50, 100], [10, 25, 50, 100]],
		data:data,
//	processing: true,
//	serverSide: true,
//	ajax: {
//	      type: "GET",
//	      crossDomain: true,
//	      xhrFields: {
//	    	  withCredentials: true,
//	      },
//	      url: config.dataURL+"/vcView/vc1.sjs",
//	      data: {params: JSON.stringify(sessionData)},
//
//	},
    "scrollY": '60vh',
    "scrollX": false,
	"order": [[ 0, "desc" ]],
    "scrollCollapse": true,
//    "columnDefs": [
//	{
//        "bVisible": false,
//        "aTargets": [6]
//      },
//	 {
//		 "render": function ( data, type, row ) {
////			 data = data.replace(";","");
////			 data = data.replace(",","");
//			 var odata = data;
//			 //data = data.toLowerCase();
//			 data = capitalize(data);
//             return '<a onclick="clickInst(this,event)" id="'+odata+'" href="#">'+data.substr(0,50)+"..."+'</a>';
//		 },
//		 "targets": 3
//	 },
//    {
//    	targets: 5,
//		width: "40%",
//    	render: function(data,type,row){
//    		return '<a onclick = "clickDoc(this,event)" class = "'+row[8]+'" id = "'+row[7]+'" href="#" target="_blank">' + data + '</a>';
//    	}
//    },
//	{
//		targets: 6,
//		width: "40%",
//	},
//    {
//    	targets: [4],
//    	render: function(data){
//    	    var ret_str = "";
//    	    for(var i in data){
//    	    	ret_str += '<a onclick="clickRes(this,event)" id="'+ data[i] +'" href="#">'+data[i]+'</a>'
//    	    }
//    		return(ret_str);
//    	},
//    },
//    ],
    dom: 'l<"toolbar">Bfrtip',
    buttons: [
        'colvis','copy', 'csv', 'excel', 'pdf', 'print'
    ]
  });
  $("div.card__title").html('<b>Document Results</b>');
//}

}
function drawDataTable2(){
	console.log("drawing datatable2");
	var theads = "";
	theads+="<th>Organization</th>";
	theads+="<th>Title</th>";
	theads+="<th>Description</th>";
	theads+="<th>Employee Count</th>";
	theads+="<th>Employee Category</th>";
	theads+="<th>Patents</th>";
	theads+="<th>NIH</th>";
	theads+="<th>NSF</th>";
	theads+="<th>Pubmed</th>";
	theads+="<th>Clinical Trials</th>";
	$("#dt-well-2").append("<table id = 'dt2'></div><thead><tr>"+theads+"</tr></thead><tfoot><tr>"+theads+"</tr></tfoot></table>")

	oTable = $("#dt2").DataTable({
	"lengthMenu": [[10, 25, 50, 100], [10, 25, 50, 100]],
	processing: true,
	serverSide: true,
	ajax: {
	      type: "GET",
	      crossDomain: true,
	      xhrFields: {
	    	  withCredentials: true,
	      },
	      url: config.dataURL+"/vcView/vcdt2.sjs",
	      data: {params: JSON.stringify(sessionData)},

	},
    "scrollY": '60vh',
    "scrollX": false,
	"order": [[ 0, "desc" ]],
    "scrollCollapse": true,
//    "columnDefs": [
//	{
//        "bVisible": false,
//        "aTargets": [6]
//      },
//	 {
//		 "render": function ( data, type, row ) {
////			 data = data.replace(";","");
////			 data = data.replace(",","");
//			 var odata = data;
//			 //data = data.toLowerCase();
//			 data = capitalize(data);
//             return '<a onclick="clickInst(this,event)" id="'+odata+'" href="#">'+data.substr(0,50)+"..."+'</a>';
//		 },
//		 "targets": 3
//	 },
//    {
//    	targets: 5,
//		width: "40%",
//    	render: function(data,type,row){
//    		return '<a onclick = "clickDoc(this,event)" class = "'+row[8]+'" id = "'+row[7]+'" href="#" target="_blank">' + data + '</a>';
//    	}
//    },
//	{
//		targets: 6,
//		width: "40%",
//	},
//    {
//    	targets: [4],
//    	render: function(data){
//    	    var ret_str = "";
//    	    for(var i in data){
//    	    	ret_str += '<a onclick="clickRes(this,event)" id="'+ data[i] +'" href="#">'+data[i]+'</a>'
//    	    }
//    		return(ret_str);
//    	},
//    },
//    ],
    dom: 'l<"toolbar">Bfrtip',
    buttons: [
        'colvis','copy', 'csv', 'excel', 'pdf', 'print'
    ]
  });
  $("div.card__title").html('<b>Document Results</b>');
//}

}

function drawStartupExpChart(data){
	var resNames = [];
	var values = [];
	data.forEach(function(i){
		resNames.push(i.key);
		values.push(i.doc_count);
	});
	
    $('#startup-viz-1-2').highcharts({
		chart: {
			height: 600,
			type: 'bar'
		},
		title: {
			useHTML: true,
			text: 'Top Experts in Startups ' + '<a id = "experts-reset" href="#">Reset</a>'
		},
		tooltip: {
    backgroundColor: '#FCFFC5',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 3
},
		xAxis: {
            categories: resNames,
           labels: {
               style: {width: 50},
               useHTML: true,
        	   formatter: function() {
                	var inst = this.value.toLowerCase();
                    return '<a onClick = "clickRes(this,event)" href = "#" id="'+inst+'">'+this.value +'</a>';
                }
            }       },
		plotOptions: {
   		  series: {
         		cursor: 'pointer',
         		point: {
            		 events: {
//               		  click: function (ev) {
//               			  var thisInst = '"' + ev.point.category + '"';
//               			  //set all institutions to inactive
//               			  for(var i=0; i<sessionData.institutionsAdded.length; i++){
//               				  sessionData.institutionsAdded[i].active = false;
//               			  }
//               			  //add this inst to sessionData
//               			  var currIndex = sessionData.institutionsAdded.length;
//               			  sessionData.institutionsAdded.push({label:thisInst,value:thisInst,index:currIndex,active:true})
//               			  updateSessionData(sessionData);
//               			  location.href = 'vizDemo2.html';
//               		  }
            		 }
         		}
   		  }
		 },
		 series: [{
            name: 'Total',
            data: values,
				grouping: false,
				pointPadding: 0,
				groupPadding: 0
        }]
	});
}

function drawStartupInstChart(data){
	var instNames = [];
	var values = [];
	data.forEach(function(i){
		instNames.push(i.key);
		values.push(i.doc_count);
	});
	
    $('#startup-viz-1-1').highcharts({
		chart: {
			height: 600,
			type: 'bar'
		},
		title: {
			useHTML: true,
			text: 'Top Startups ' + '<a id = "institution-reset" href="#">Reset</a>'
		},
		tooltip: {
    backgroundColor: '#FCFFC5',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 3
},
		xAxis: {
            categories: instNames,
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
//               		  click: function (ev) {
//               			  var thisInst = '"' + ev.point.category + '"';
//               			  //set all institutions to inactive
//               			  for(var i=0; i<sessionData.institutionsAdded.length; i++){
//               				  sessionData.institutionsAdded[i].active = false;
//               			  }
//               			  //add this inst to sessionData
//               			  var currIndex = sessionData.institutionsAdded.length;
//               			  sessionData.institutionsAdded.push({label:thisInst,value:thisInst,index:currIndex,active:true})
//               			  updateSessionData(sessionData);
//               			  location.href = 'vizDemo2.html';
//               		  }
            		 }
         		}
   		  }
		 },
		 series: [{
            name: 'Total',
            data: values,
				grouping: false,
				pointPadding: 0,
				groupPadding: 0
        }]
	});
}
function drawStartupSourceChart(data){
	var sourceMap = {
			0:"Unknown",
			1:"1-10",
			2:"11-50",
			3:"51-200",
			4:'51-200',
			5:"101-250",
			6:"201-500",
			7:"251-500"
	}
	var srcCats = [];
	var srcVals = [];
	data.forEach(function(src){
		srcCats.push(src.key);
		srcVals.push(src.doc_count);
	});
	$('#startup-viz-2-1').highcharts({
		chart: {
	        type: 'column'
	    },
		title: {
			useHTML: true,
			text: 'Document Source ' + '<a href = "#" id = "source-reset">Reset</a>'
		},
		xAxis: {
	        categories: srcCats
	    },
		plotOptions: {
			  series: {
	     		cursor: 'pointer',
//	     		point: {
//	        		 events: {
//	           		  click: function (ev) {
//	           			  			var thisType = ev.point.category;
//	           			  			//make only this type active
//	           			  			for(var i in sessionData.docTypes){
//	           			  				if(sessionData.docTypes[i].value != thisType){
//	           			  					sessionData.docTypes[i].active = false;
//	           			  				} else{
//	           			  					sessionData.docTypes[i].active = true;
//	           			  				}
//	           			  			}
//	           			  			updateSessionData(sessionData);
//									location.href = 'vizDemo2.html';
//	           		  }
//	        		 }
//	     		}
			  }
		 },
		 series: [{
	        name: 'Number of Documents',
	        data: srcVals
	    }]
	});
}

function drawStartupEmpCatChart(data){
	var catMap = {
			0:"Unknown",
			1:"1-10",
			2:"11-50",
			3:"51-200",
			4:'51-200',
			5:"101-250",
			6:"201-500",
			7:"251-500"
	}
	var empCats = [];
	var empVals = [];
	data.forEach(function(cat){
		empCats.push(catMap[cat.key]);
		empVals.push(cat.doc_count);
	});
	$('#startup-viz-2-2').highcharts({
		chart: {
	        type: 'column'
	    },
		title: {
			useHTML: true,
			text: 'Employee Categories ' + '<a href = "#" id = "empCat-reset">Reset</a>'
		},
		xAxis: {
	        categories: empCats
	    },
		plotOptions: {
			  series: {
	     		cursor: 'pointer',
//	     		point: {
//	        		 events: {
//	           		  click: function (ev) {
//	           			  			var thisType = ev.point.category;
//	           			  			//make only this type active
//	           			  			for(var i in sessionData.docTypes){
//	           			  				if(sessionData.docTypes[i].value != thisType){
//	           			  					sessionData.docTypes[i].active = false;
//	           			  				} else{
//	           			  					sessionData.docTypes[i].active = true;
//	           			  				}
//	           			  			}
//	           			  			updateSessionData(sessionData);
//									location.href = 'vizDemo2.html';
//	           		  }
//	        		 }
//	     		}
			  }
		 },
		 series: [{
	        name: 'Number of Documents',
	        data: empVals
	    }]
	});
}
