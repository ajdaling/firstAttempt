var saveSearchURL = "/../../client_side/home/dashboard.php";
var docIndexURL = "/../../client_side/docIndex/docIndex.html";
var instList_url = "/../../client_side/institution/institutionsList.html";
var visualize_url = "/../../client_side/newviz/vizDemo2.html";
var sForm = localStorage.getItem("sForm");
var sessionData = JSON.parse(localStorage.getItem("sessionData"));
var oTable;
var queryFacets = {
  "year": [],
  "Institution_Name": [],
  "docOrigin": []
};
var first = true;
var topics = [];
var results;
var breifData = {};
var dtparams;
var ajaxParams;
var full_url_arguments;
var docURL;
var docURI;
var first;
var drewTable = false;
init();
var mainDT;
var selectedDT;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalize(tstring) {
  return tstring.replace(/(?:^|\s)\S/g, function(a) {
    return a.toUpperCase();
  });
};


function set_first_to_false() {
  first = false;
}
function runSelected(){
    getDistinctiveTerms();
    getCluster();
}
function createListeners(){
    $("#clear-selected-btn").on("click",function(){
        sessionData.queryData.docs = [];
        updateSessionData(sessionData);
        drawSelectedDT();
        runSelected();
    });
    $("#submit-selected-btn").on("click",function(){
        drawSelectedDT();
        runSelected();
        $('html, body').animate({
            scrollTop: $("#cluster-row").offset().top
        }, 200);
    })
}
function init(){
    if(!sessionData.queryData){
        sessionData.queryData = {};
        updateSessionData(sessionData);
    }
    if(!sessionData.queryData.docs){
        sessionData.queryData.docs = [];
        sessionData.queryData.docs.push(sessionData.docData.docURI);
        updateSessionData(sessionData);
    }
    if(sessionData.queryData.docs.length === 0){
        sessionData.queryData.docs.push(sessionData.docData.docURI);
    }
	docURL = sessionData.docData.docURL;
	$("#doc-link").attr("href",docURL);
	delete sessionData.docData.docURL;
	updateSessionData(sessionData);
	docURI = sessionData.docData.docURI;
	dtParams = {name:"uri",value: docURI};
	ajaxParams = {uri:docURI};

	d3.select("#doc-link").attr("href",docURL);
    createListeners();
	getDocInfo();
    createMainQuery();
    getMatches();
	drawDataTable();
    drawSelectedDT();
    getCluster();
    getDistinctiveTerms();
}


function createMainQuery(){
    $("#mq-submit").on("click",function(){
        if($("#qw-friendly").hasClass("active")){
            var queryObj = $("#main-query-content").queryBuilder("getRules");
        	var unparsed = unparse(queryObj);
        	sessionData.mainQuery = unparsed;
            updateSessionData(sessionData);
            window.location.href = window.location.href;
        } else{
            sessionData.mainQuery = $("#mq").val();
            updateSessionData(sessionData);
            window.location.href = window.location.href;
        }
    });
    $("#mq-clear").on("click",function(){
        sessionData.mainQuery = "";
        updateSessionData(sessionData);
        window.location.href = window.location.href;
    })
    $("#qw-friendly").on("click",function(){
        createMQFriendly();
        $(this).addClass("active");
        $("#qw-advanced").removeClass("active");
    });
    $("#qw-advanced").on("click",function(){
        createMQAdvanced();
        $(this).addClass("active");
        $("#qw-friendly").removeClass("active");
    });
    createMQFriendly();
}

function createMQFriendly(){
    d3.select("#main-query").selectAll("div").remove();
    d3.select("#main-query").append("div").attr("id","main-query-content");
    var startRules = {};
    if(sessionData.mainQuery){
        startRules = rdp(sessionData.mainQuery);
    }else{
        startRules = {
            condition: 'AND',
            rules:[
                {
                    id: 'mainQuery',
                    operator: "in",
                    value: ""
                },
            ]

        };
    }

    $("#main-query-content").queryBuilder({
            rules: startRules,
            allow_empty: true,
            default_filter: 'mainQuery',
            filters:
                [
                    //main query
                    {
                        id: 'mainQuery',
                        label: 'Main Query',
                        type: 'string',
                        operators: ['in', 'not_in']
                    }
                ]

    });
}

function createMQAdvanced(){
    d3.select("#main-query").selectAll("div").remove();
    d3.select("#main-query").append("div").attr("id","main-query-content")
    .append("textarea").attr("id","mq")
    .style("width","100%");

    $("#mq").val(sessionData.mainQuery);
}

function getMatches(){
    if(!sessionData.queryData){
        sessionData.queryData = {};
        updateSessionData(sessionData);
    }
    sessionData.queryData.docURI = sessionData.docData.docURI;
    updateSessionData(sessionData);
    $.ajax({
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        type: "GET",
        url: config.dataURL + "/improveQuery/walk.sjs",
        data: JSON.stringify(sessionData),
        success: function(data) {
          fillMatches(data);
        }
    });
}
function fillMatches(data){
    console.log("walking *******");
    console.log(data);
        var matches = {};
        data.forEach(function(d){
            if(d.wordQuery){
                d.wordQuery.text.forEach(function(word){
                    if(!matches[word]){
                        matches[word] = 1;
                    }else{
                        matches[word] = matches[word]+1;
                    }
                });
            } else if(Array.isArray(d)){
                d.forEach(function(e){
                    if(e.wordQuery){
                        e.wordQuery.text.forEach(function(word){
                            if(!matches[word]){
                                matches[word] = 1;
                            }else{
                                matches[word] = matches[word]+1;
                            }
                        });
                    }
                })
            } else if(d.jsonPropertyWordQuery){
                d.jsonPropertyWordQuery.text.forEach(function(word){
                    if(!matches[word]){
                        matches[word] = 1;
                    }else{
                        matches[word] = matches[word]+1;
                    }
                });
            }
        });
        console.log(matches);
        var cloudArr = [];
        Object.keys(matches).forEach(function(key){
            cloudArr.push({text:key,weight:matches[key]});
        });
        $("#matches-well").empty();
        $("#matches-well").jQCloud("destroy");
        $("#matches-well").jQCloud(cloudArr);
}

function getDistinctiveTerms() {
	  var ajaxParams = JSON.parse(JSON.stringify(sessionData));
	  if(ajaxParams.repData) delete ajaxParams.repData;
	  $(document).ready(function() {
	    $.ajax({
	      type: "GET",
	      xhrFields: {
	        withCredentials: true
	      },
	      crossDomain: true,
	      url: config.dataURL + "/improveQuery/distinctiveTerms.sjs",
	      data: JSON.stringify(ajaxParams),
	      dataType: 'json',
	      success: function(data) {
	    	  console.log(data);
              fillWordCloud(data);
	      }
	    })
	  })
}

function fillWordCloud(data){
    $("#terms-well").empty();
    $("#terms-well").jQCloud("destroy");
    $("#terms-well").jQCloud(data);
}

function getDocInfo() {
  $(document).ready(function() {
    $.ajax({
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      type: "GET",
      url: config.dataURL + "/lib/get_docInfo_by_uri.sjs",
      data: ajaxParams,
      success: function(data) {
        fillDocInfo(JSON.parse(data));
      }
    })
  });
}
function fillDocInfo(data){
	console.log(data);
	$(".doc-title").text(data.title);
	var title, year, source;
	data.title ? title = data.title : title = "No Title";
	data.year ? year = data.year : year = "Unknown";
	data.docOrigin ? source = data.docOrigin : source = "Unknown";
	var docInfo = [
		["Title: ", title],
		["Year: ", year],
		["Source: ", source],
	];
    d3.select("#doc-info-table").selectAll("tr").remove();
	d3.select("#doc-info-table").selectAll("tr").data(docInfo)
	.enter().append("tr").selectAll("td").data(function(d){return(d);})
	.enter().append("td").text(function(d){return(d);});

	if(data.abstract){
		$("#doc-abstract-text").text(data.abstract);
	} else{
		$("#doc-abstract-text").text("No Abstract");
	}
	if(data.institution.length > 0){
		var insts = [];
		data.institution.forEach(function(inst){
			var name = inst.Institution_Name;
			if(insts.indexOf(name) == -1){
				insts.push(name);
			}
		});
        d3.select("#doc-inst-list").selectAll('li').remove();
		d3.select("#doc-inst-list").selectAll("li").data(insts).enter()
		.append("li").text(function(d){return(d);});
	}

	if(data.researcher.length > 0){
        d3.select("#doc-res-list").selectAll("li").remove();
		d3.select("#doc-res-list").selectAll("li").data(data.researcher)
		.enter().append("li").text(function(d){
			return(d.researcherName);
		});
	}
	if(data.meshterms){
        d3.select("#doc-mesh-list").selectAll("li").remove();
		d3.select("#doc-mesh-list").selectAll("li").data(data.meshterms)
		.enter().append("li").text(function(d){
			return(d)
		});
	}
}

function formatField(string, length) {
  var ret_str = string;
  if (ret_str) {
    ret_str = ret_str.replace(/;/g, " ");
    ret_str = ret_str.replace(/,\s*([a-z])/g, function(d, e) {
      return ", " + e.toUpperCase() + "."
    });
    if (length) {
      ret_str = ret_str.substr(0, length) + "...";
    }

  } else {
    return "N/A";
  }
  return (ret_str);
}

function createTableListeners(){
    console.log("here");
    $("#dt2 tr").on("dblclick",function(){
        $(this).addClass("added");
        var ro = mainDT.row(this).data();
        var uri = ro[ro.length-1];
        var found = false;
        if(sessionData.queryData.docs.indexOf(uri) === -1){
            sessionData.queryData.docs.push(uri);
        }
        drawSelectedDT();
    });
    $("#dt2 tr").on("click",function(){
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        var ro = mainDT.row(this).data();
        var uri = ro[ro.length-1];
        sessionData.queryData.docURI = uri;
        sessionData.docData.docURI = uri;
        ajaxParams.uri = uri;
        updateSessionData(sessionData);
        getDocInfo();
        getMatches();
    })

    $("#dt2 tr").hover(function(){
        var ro = mainDT.row(this).data();
        var uri = ro[ro.length-1];
        console.log("hovering");
        // $(this).css("background-color","gray");
    });

    $("#dt3 tr").on("dblclick",function(){
        var ro = mainDT.row(this).data();
        var uri = ro[ro.length-1];
        var docs = [];
        sessionData.queryData.docs.forEach(function(doc){
            if(doc !== uri){
                docs.push(uri);
            }
            sessionData.queryData.docs = docs;
        });
        $("dt2-"+uri).removeClass('added');
        updateSessionData(sessionData);
        drawSelectedDT();
    })
}
function drawDataTable() {
    console.log("here");
    if (!drewTable) {
      drewTable = true;
      $("#dt-panel").append("<table id = 'dt2'></div><thead><tr><th>Score</th><th>Year</th><th>Source</th><th>Organizations</th><th>Experts</th><th>Title</th><th>Abstract</th></tr></thead><tfoot><tr><th>Score</th><th>Year</th><th>Source</th><th>Organizations</th><th>Experts</th><th>Title</th><th>Abstract</th></tr></tfoot></table>")
      mainDT = $('#dt2').DataTable({
        serverSide: true,
        "lengthMenu": [[10, 25, 50, 100], [10, 25, 50, 100]],
        paging : false,
        processing: true,
        serverSide: true,
        info: false,
        "iDisplayLength": 50,
        ajax: {
          type: "GET",
          crossDomain: true,
          xhrFields: {
            withCredentials: true,
          },
          url: config.dataURL + "/improveQuery/improveQueryDT.sjs",
          data: {
            params: JSON.stringify(sessionData)
          },

        },
        createdRow: function(row,data,index){
            $(row).attr("id","dt2-" + data[8]);
        },
        drawCallback:function(){
            for(var i in sessionData.queryData.docs){
                var uri = sessionData.queryData.docs[i];
                if($("#dt2-"+uri)){
                    $("#dt2-"+uri).addClass("added");
                }
            }
            createTableListeners();
        },
        "scrollY": '60vh',
        // "scrollX": '60wh',
        "scrollCollapse": true,
        "columnDefs": [
            {
            "bVisible": false,
            "aTargets": [1,3,4,6]
          },
          {
            "render": function(data, type, row) {
              data = +data;
              return data.toPrecision(3);
            },
            "targets": 0
          },
          {
            "render": function(data, type, row) {
              //					 data = data.replace(";","");
              //					 data = data.replace(",","");
              //					 var odata = data;
              //					 data = capitalize(data);
              thisInstList = data.split(';');
              data = thisInstList[0];
              var odata = data;
              data = capitalize(data);
              return '<a onclick="clickInst(this,event)" id="' + odata + '" href="#">' + data.substring(0, 50) + '</a>';
            },
            "targets": 3
          },
          {
            targets: 5,
            render: function(data, type, row) {
              return '<a onclick = "clickDoc(this,event)" class = "' + row[8] + '" id = "' + row[7] + '" href="#" target="_blank">' + data + '</a>';
            }
          },


          //	    {
          //	    	targets: [1,2,3],
          //	    	width: "15%"
          //	    },
          {
            targets: [4],
            render: function(data) {
            	var displayName = String(data);
            	var ret_str = "";
	    	    for(var i in data){
	    	    	ret_str += '<a onclick="clickRes(this,event)" id="'+ data[i].toLowerCase() +'" href="#">'+data[i].toUpperCase()+'</a>'
	    	    }
	    		return(ret_str);
            }
          },
          //	    {
          //	    	targets: [5],
          //	    	width: "35%"
          //	    },
          {
            targets: [3, 4, 5],
            render: function(data, type, row) {
              return data.substr(0, 60) + "...";
            }
          },
        ],
        dom: 'Bfrtip',
        buttons: [
          'colvis', 'excelHtml5', 'csvHtml5',
          'pdfHtml5', 'print'
        ]
      });
    }
  $("div.card__title").html('<b>Similar Documents:</b><br> ');
}

function drawSelectedDT() {
    if($.fn.DataTable.isDataTable("#dt3")){
        $("#dt3").DataTable().destroy();
        d3.select("#selected-docs-dt").selectAll("div, table").remove();
    }

      $("#selected-docs-dt").append("<table id = 'dt3'></div><thead><tr><th>Year</th><th>Source</th><th>Organizations</th><th>Experts</th><th>Title</th><th>Abstract</th></tr></thead><tfoot><tr><th>Year</th><th>Source</th><th>Organizations</th><th>Experts</th><th>Title</th><th>Abstract</th></tr></tfoot></table>")
      oTable = $('#dt3').DataTable({
        serverSide: true,
        "lengthMenu": [[10, 25, 50, 100], [10, 25, 50, 100]],
        paging : false,
        processing: true,
        serverSide: true,
        info: false,
        "iDisplayLength": 50,
        ajax: {
          type: "GET",
          crossDomain: true,
          xhrFields: {
            withCredentials: true,
          },
          url: config.dataURL + "/improveQuery/improveQuerySelectedDT.sjs",
          data: {
            params: JSON.stringify(sessionData)
          },

        },
        drawCallback:function(){
            createTableListeners();
        },
        createdRow: function(row,data,index){
            $(row).attr("id","dt3-" + data[8]);
        },
        "scrollY": '30vh',
        // "scrollX": '60wh',
        "scrollCollapse": true,
        "columnDefs": [
            {
            "bVisible": false,
            "aTargets": [0,2,3,5]
          },
          {
            "render": function(data, type, row) {
              //					 data = data.replace(";","");
              //					 data = data.replace(",","");
              //					 var odata = data;
              //					 data = capitalize(data);
              thisInstList = data.split(';');
              data = thisInstList[0];
              var odata = data;
              data = capitalize(data);
              return '<a onclick="clickInst(this,event)" id="' + odata + '" href="#">' + data.substring(0, 50) + '</a>';
            },
            "targets": 2
          },
          {
            targets: 4,
            render: function(data, type, row) {
              return '<a onclick = "clickDoc(this,event)" class = "' + row[7] + '" id = "' + row[6] + '" href="#" target="_blank">' + data + '</a>';
            }
          },


          //	    {
          //	    	targets: [1,2,3],
          //	    	width: "15%"
          //	    },
          {
            targets: [3],
            render: function(data) {
            	var displayName = String(data);
            	var ret_str = "";
	    	    for(var i in data){
	    	    	ret_str += '<a onclick="clickRes(this,event)" id="'+ data[i].toLowerCase() +'" href="#">'+data[i].toUpperCase()+'</a>'
	    	    }
	    		return(ret_str);
            }
          },
          //	    {
          //	    	targets: [5],
          //	    	width: "35%"
          //	    },
          {
            targets: [2, 3, 4],
            render: function(data, type, row) {
              return data.substr(0, 60) + "...";
            }
          },
        ],
        dom: 'Bfrtip',
        buttons: [
          'colvis', 'excelHtml5', 'csvHtml5',
          'pdfHtml5', 'print'
        ]
      });
  $("div.card__title").html('<b>Similar Documents:</b><br> ');
}
function getCluster(){
    $.ajax({
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        type: "GET",
        url: config.dataURL + "/improveQuery/cluster.sjs",
        data: JSON.stringify(sessionData),
        success: function(data) {
            console.log(data);
            fillCluster(data);
        }
    });
}
function fillCluster(data){
    console.log(data);
    $("#clusters-text").empty();
    $("#clusters-text").jQCloud("destroy");
    $("#clusters-text").jQCloud(data);
}
