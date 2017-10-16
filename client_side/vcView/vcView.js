var oTable;
var oTable2;
$("#mainQuery").val(sessionData.mainQuery);
$("#submit").on("click",function(){
	console.log("clicked");
	sessionData.mainQuery = $("#mainQuery").val();
	console.log(sessionData.mainQuery);
	updateSessionData(sessionData);
//	getRawOutput();
	makeDataTable();
	makeCharts();
});
function getRawOutput(){
	console.log("getting raw output");
	var ajaxData = {};
	ajaxData.mainQuery = sessionData.mainQuery;

	$.ajax({
	  xhrFields: {
	    withCredentials: true
	  },
	  crossDomain: true,
	  type: "GET",
//	  url: config.dataURL + "/vcView/vcdt1.sjs",
	  url: config.dataURL + "/vcView/vcView.sjs",
	  data: JSON.stringify(sessionData),
	  success: function(data) {
	    console.log(data);
	    $("#output").text(data);
	  },
	  error:function(){
	    alert("error");
	  }
	});
}

function makeDataTable(){
	
	if(oTable){
		oTable.destroy();
		d3.select("#dt1").remove();
		d3.select("#dt-well").selectAll("div","table","tr","th").remove();
	}
	if(oTable2){
		oTable2.destroy();
		d3.select("#dt2").remove();
		d3.select("#dt-well-2").selectAll("div","table","tr","th").remove();
	}
	d3.selectAll("table").remove();
	drawDataTable();
	drawDataTable2();
}
//drawDataTable();
function drawDataTable(){
	console.log("drawing datatable");
	var theads = "";
	theads+="<th>Organization</th>";
	theads += "<th>Experts</th>";
	theads+="<th>Title</th>";
	theads+="<th>Description</th>";
	theads+="<th>Employee Count</th>";
	theads+="<th>Employee Category</th>";
	theads+="<th>Patents</th>";
	theads+="<th>NIH</th>";
	theads+="<th>NSF</th>";
	theads+="<th>Pubmed</th>";
	theads+="<th>Clinical Trials</th>";
	$("#dt-well").append("<table id = 'dt1'></div><thead><tr>"+theads+"</tr></thead><tfoot><tr>"+theads+"</tr></tfoot></table>")

	oTable = $("#dt1").DataTable({
	"lengthMenu": [[10, 25, 50, 100], [10, 25, 50, 100]],
	processing: true,
	serverSide: true,
	ajax: {
	      type: "GET",
	      crossDomain: true,
	      xhrFields: {
	    	  withCredentials: true,
	      },
	      url: config.dataURL+"/vcView/vcdt1.sjs",
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

function makeCharts(){
	$.ajax({
		  xhrFields: {
		    withCredentials: true
		  },
		  crossDomain: true,
		  type: "GET",
		  url: config.dataURL + "/vcView/vcEmpCatFacet.sjs",
		  data: JSON.stringify(sessionData),
		  success: function(data) {
		    drawEmpCatChart(JSON.parse(data));
		  },
		  error:function(){
		    alert("error");
		  }
		});
}
function drawEmpCatChart(data){
	catMap = {
			0:"Unknown",
			1:"1-10",
			2:"11-50",
			3:"51-200",
			4:'51-200',
			5:"101-250",
			6:"201-500",
			7:"251-500"
	}
	empCats = [];
	empVals = [];
	data.forEach(function(cat){
		empCats.push(catMap[cat.key]);
		empVals.push(cat.doc_count);
	});
	console.log(empCats);
	console.log(empVals);
	
	$('#viz-left').highcharts({
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
