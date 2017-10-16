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
//init();


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


function init(){
	docURL = sessionData.docData.docURL;
	$("#doc-link").attr("href",docURL);
	delete sessionData.docData.docURL;
	updateSessionData(sessionData);
	docURI = sessionData.docData.docURI;
	dtParams = {name:"uri",value: docURI};
	ajaxParams = {uri:docURI};

	d3.select("#doc-link").attr("href",docURL);

	getDocInfo();
	addTopicNavs();
	createListeners();
	drawDataTable(getFacets);
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
//        fillBrief(JSON.parse(data));
//        fillSelectedDocTable(JSON.parse(data), openTitle);
        fillDocInfo(JSON.parse(data));
      }
    })
  });
}

function openTitle() {
  $("#collapse-sd-0").collapse("show");
}

function fillBrief(data) {
  var dat = ["Title: " + data.title.toUpperCase(),
    //"Abstract: " + data.abstract.toUpperCase(),
    "Year: " + data.year
  ];
  d3.select("#brief").selectAll("li").data(dat).enter().append("li").text(function(d) {
    return (d);
  })
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
		d3.select("#doc-inst-list").selectAll("li").data(insts).enter()
		.append("li").text(function(d){return(d);});
	}

	if(data.researcher.length > 0){
		d3.select("#doc-res-list").selectAll("li").data(data.researcher)
		.enter().append("li").text(function(d){
			return(d.researcherName);
		});
	}
	if(data.meshterms){
		d3.select("#doc-mesh-list").selectAll("li").data(data.meshterms)
		.enter().append("li").text(function(d){
			return(d)
		});
	}
}

function fillSelectedDocTable(data, cb) {


  var tableData = [];
  console.log(data);
  tableData.push(["Title", [data.title]]);
  tableData.push(["Document Source", [data.docOrigin]]);
  tableData.push(["Year", [data.year]]);
  var instArr = [];
  if (Array.isArray(data.institution)) {
    for (var i in data.institution) {
      if (instArr.indexOf(data.institution[i].Institution_Name.toUpperCase()) == -1) {
        instArr.push(data.institution[i].Institution_Name.toUpperCase());
      }
    }
  } else {
    instArr.push(data.institution.Institution_Name.toUpperCase());
  }
  tableData.push(["Organizations", instArr]);

  tableData.push(["Abstract", [formatField(data.abstract)]]);
  var meshterms = [];
  for (var i in data.meshterms) {
    meshterms.push([data.meshterms[i]])
  }
  tableData.push(["MeSH Terms", meshterms]);
  var resArr = [];
  for (var i in data.researcher) {
    resArr.push(data.researcher[i].researcherName.toUpperCase());
  }
  tableData.push(["Experts", resArr]);


  var panels = d3.select("#accordion").selectAll("div").data(tableData).enter()
    .append("div").attr("class", "panel panel-default");
  var panelTitles = panels.append("div").attr("class", "panel-heading text-center")
    .append("h4").attr("class", "panel-title")
    .append("a").attr("data-toggle", "collapse").attr("data-parent", "#accordion")
    .attr("href", function(d, i) {
      return ("#collapse-sd-" + String(i));
    }).text(function(d) {
      return (d[0]);
    })

  var panelBodies = panels.append("div").attr("id", function(d, i) {
      return ("collapse-sd-" + String(i));
    }).attr("class", function(d) {
      if (d == 0) {
        return ("panel-collapse collapse in");
      } else {
        return ("panel-collapse collapse in");
      }
    })
    .append("div").attr("class", "panel-body")
    .append("ul").style("list-style-type", "none").attr("id", function(d) {
      return ("ul-" + d[0]);
    }).selectAll("li").data(function(d) {
      return (d[1]);
    }).enter()
    .append("li")
    .append("a").style("color", function(d) {
      console.log($(this).parent().parent().attr("id"));
      if ($(this).parent().parent().attr("id") == "ul-Institutions") {
        return ("blue");
      } else {
        return ("black");
      }
    })
    .attr("href", function(d) {
      return ("#");
    })
    .text(function(d) {
      return (d);
    });
  $("#ul-Institutions>li>a").click(function(d) {
    console.log(d);
    clickInst(this);
  })
  //	$(".collapse").collapse("hide");

  cb();
}

function drawDataTable(dt_callback) {

  $(function() {
    //		if(oTable != undefined){
    //			oTable.fnClearTable();
    //			oTable.fnDraw();//reset
    //		}
    if (!drewTable) {
      drewTable = true;
      oTable = $('#example').DataTable({
        serverSide: true,
        paging : false,
        info: false,
        "iDisplayLength": 50,
        ajax: {
          type: "GET",
          crossDomain: true,
          xhrFields: {
            withCredentials: true,
          },
          url: config.dataURL + "/docIndex/docIndexDatatable.sjs",
          data: {
            params: JSON.stringify(sessionData)
          },

        },

        "scrollY": '60vh',
        "scrollX": '60wh',
        "scrollCollapse": true,
        "columnDefs": [
            {
            "bVisible": false,
            "aTargets": [2, 4]
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
              return '<a onclick = "clickDoc(this,event)" class = "' + row[7] + '" id = "' + row[6] + '" href="#" target="_blank">' + data + '</a>';
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


  });
  $("div.card__title").html('<b>Similar Documents:</b><br> ');
  dt_callback(createFacetTables);
}

function reQuery(requery_callback) {
  var idx = 1;
  for (var facet_type in queryFacets) {
    for (var i in queryFacets[facet_type]) {
      sessionData["facet" + String(idx) + "_type"] = facet_type;
      sessionData["facet" + String(idx) + "_value"] = queryFacets[facet_type][i];
      idx++;
    }
  }
  requery_callback();
}

function reDraw() {
  drawDataTable(getFacets);
}

//getDistinctiveTerms();
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
	      url: config.dataURL + "/docIndex/distinctiveTerms.sjs",
	      data: JSON.stringify(ajaxParams),
	      dataType: 'json',
	      success: function(data) {
	    	  console.log(data);
	      }
	    })
	  })
	}

function getFacets(callback2) {
  var ret_facets;
  var ajaxParams = JSON.parse(JSON.stringify(sessionData));
  if(ajaxParams.repData) delete ajaxParams.repData;
  $(document).ready(function() {
    $.ajax({
      type: "GET",
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      url: config.dataURL + "/docIndex/docFacet.sjs",
      data: JSON.stringify(ajaxParams),
      dataType: 'json',
      success: function(data) {
        ret_facets = data.facets;
        results = data.facets;
        callback2(ret_facets);
      }
    })
  })
}

function createFacetTables(facets) {
  //	if(first){
  createYearFacetTable(facets);
  createInstitutionFacetTable(facets);
  createDocOriginFacetTable(facets);
  //		getClusters(createClusterFacetTable);
  first = false;
  //	} else{

  //	}
}

function createYearFacetTable(facets) {
  var yearFacetTableRows;
  var yearFacetTableCells;

  var yearFacetTableRows = d3.select('#yearFacetTable')
    .selectAll("tr")
    .data(function() {
      var ret_arr = [];
      for (var yr in facets.year) {
        var temp_arr = [];
        temp_arr.push(yr);
        temp_arr.push(facets.year[yr]);
        ret_arr.push(temp_arr);
      }
      ret_arr.sort(function(a, b) {
        return (b[1] - a[1]);
      });
      return (ret_arr);
    });

  //Enter
  yearFacetTableRows.enter().append('tr')
    .selectAll("td").data(function(d) {
      return (d);
    }).enter().append("td").text(function(d) {
      return (d);
    });

  //Exit
  yearFacetTableRows.exit().remove();

  var yearFacetTableCells = yearFacetTableRows.selectAll("td")
    .data(function(d) {
      return (d);
    }).text(function(d) {
      return (d);
    });


  yearFacetTableCells.exit().remove();

  if (first) {
    //		yearFaceTableRows.click(function(d){
    $(document).on("click", "#yearFacetTable > tr", function(d) {
      //		$("#yearFacetTable > tr").click(function(d){
      var yr = $(this).closest('tr').find('td:nth-child(1)').text();
      var docs = $(this).closest('tr').find('td:nth-child(2)').text();
      if ($(this).hasClass('active')) {
        delete queryFacets.year[yr];
      } else {
        queryFacets.year.push(yr);
      }
      $(this).toggleClass("active");
    })
  }


}

function createInstitutionFacetTable(facets) {
  var institutionFacetTableRows;
  var institutionFacetTableCells;

  var institutionFacetTableRows = d3.select('#institutionFacetTable')
    .selectAll("tr")
    .data(function() {
      var ret_arr = [];
      for (var inst in facets.Institution_Name) {
        var temp_arr = [];
        temp_arr.push(inst);
        temp_arr.push(facets.Institution_Name[inst]);
        ret_arr.push(temp_arr);
      }
      ret_arr.sort(function(a, b) {
        return (b[1] - a[1]);
      });
      return (ret_arr);
    });

  //Enter
  institutionFacetTableRows.enter().append('tr')
    .selectAll("td").data(function(d) {
      return (d);
    }).enter().append("td").text(function(d) {
      return (d);
    });

  //Exit
  institutionFacetTableRows.exit().remove();

  var institutionFacetTableCells = institutionFacetTableRows.selectAll("td")
    .data(function(d) {
      return (d);
    }).text(function(d) {
      return (d);
    });


  institutionFacetTableCells.exit().remove();

  if (first) {
    $(document).on("click", "#institutionFacetTable > tr", function(d) {
      //		$("#institutionFacetTable > tr").click(function(d){
      var inst = $(this).closest('tr').find('td:nth-child(1)').text();
      var docs = $(this).closest('tr').find('td:nth-child(2)').text();
      if ($(this).hasClass('active')) {
        delete queryFacets.Institution_Name[inst];
      } else {
        queryFacets.Institution_Name.push(inst);
      }
      $(this).toggleClass("active");
    })
  }
}

function createDocOriginFacetTable(facets) {
  var docOriginFacetTableRows;
  var docOriginFacetTableCells;

  var docOriginFacetTableRows = d3.select('#docOriginFacetTable')
    .selectAll("tr")
    .data(function() {
      var ret_arr = [];
      for (var orgn in facets.docOrigin) {
        var temp_arr = [];
        temp_arr.push(orgn);
        temp_arr.push(facets.docOrigin[orgn]);
        ret_arr.push(temp_arr);
      }
      ret_arr.sort(function(a, b) {
        return (b[1] - a[1]);
      });
      return (ret_arr);
    });

  //Enter
  docOriginFacetTableRows.enter().append('tr')
    .selectAll("td").data(function(d) {
      return (d);
    }).enter().append("td").text(function(d) {
      return (d);
    });

  //Exit
  docOriginFacetTableRows.exit().remove();

  var docOriginFacetTableCells = docOriginFacetTableRows.selectAll("td")
    .data(function(d) {
      return (d);
    }).text(function(d) {
      return (d);
    });


  docOriginFacetTableCells.exit().remove();

  if (first) {
    //		$("#docOriginFacetTable > tr").click(function(d){
    $(document).on("click", "#docOriginFacetTable > tr", function(d) {
      var orgn = $(this).closest('tr').find('td:nth-child(1)').text();
      var docs = $(this).closest('tr').find('td:nth-child(2)').text();
      if ($(this).hasClass('active')) {
        delete queryFacets.docOrigin[orgn];
      } else {
        queryFacets.docOrigin.push(orgn);
      }
      $(this).toggleClass("active");
    })
  }


}

//
//var all_clusters;
//
//function getClusters(table_cb) {
//  $.ajax({
//    type: "GET",
//    url: config.dataURL + "/cluster.sjs",
//    data: sessionData,
//    success: function(data) {
//      all_clusters = JSON.parse(JSON.stringify(data));
//      table_cb(data);
//    },
//  });
//}

//function createClusterFacetTable(clusters) {
//  var clusterFacetTableRows;
//  var clusterFacetTableCells;
//
//  var clusterFacetTableRows = d3.select('#clusterFacetTable')
//    .selectAll("tr")
//    .data(function() {
//      var ret_arr = [];
//      for (var idx in clusters.clusters) {
//        var temp_arr = [];
//        temp_arr.push(clusters.clusters[idx].label);
//        temp_arr.push(clusters.clusters[idx].nodes.length);
//        ret_arr.push(temp_arr);
//      }
//      ret_arr.sort(function(a, b) {
//        return (b[1] - a[1]);
//      });
//      return (ret_arr);
//    });
//
//  //Enter
//  clusterFacetTableRows.enter().append('tr')
//    .selectAll("td").data(function(d) {
//      return (d);
//    }).enter().append("td").text(function(d) {
//      return (d);
//    });
//
//  //Exit
//  clusterFacetTableRows.exit().remove();
//
//  var clusterFacetTableCells = clusterFacetTableRows.selectAll("td")
//    .data(function(d) {
//      return (d);
//    }).text(function(d) {
//      return (d);
//    });
//
//
//  clusterFacetTableCells.exit().remove();
//
//  if (first) {
//    $(document).on("click", "#clusterFacetTable > tr", function(d) {
//      var clstr = $(this).closest('tr').find('td:nth-child(1)').text();
//      var docs = $(this).closest('tr').find('td:nth-child(2)').text();
//      $(this).toggleClass("active");
//    })
//  }
//
//
//}


function createListeners() {


  //	$(document).on("click","#clear_button",function(){
  $("#clear_button").click(function() {
    sessionData.topicQuery = "none";
    for (var param in sessionData) {
      if (param.includes("facet")) {
        delete sessionData[param];
      }
    }
    sessionData["topicQuery"] = "";
    $('tbody > tr.active').toggleClass('active');
    $('#topicsNav > li.active').toggleClass('active');
    //addTopicNavs();
    queryFacets = {
      "year": [],
      "Institution_Name": [],
      "docOrigin": []
    };
    reQuery(reDraw);
  })
}

function addTopicNavs() {
  d3.select("#topicNavs").selectAll("li,btn,a").remove();

  //get array of topics
  for (var i = 0; i < 50; i++) {
    var top_str = "topic" + String(i);
    if (sessionData.hasOwnProperty(top_str)) {
      var tempObj = {};
      tempObj["name"] = top_str;
      tempObj["value"] = sessionData[top_str];
      topics.push(tempObj);
    }
  }
  //create topic nav buttons
  var topicNavs = d3.select("#topicsNav").selectAll("li").data(topics).enter()
    .append("li").attr("data-toggle", "tab")
    .attr("font-size", "large")
    .append("a").attr("href", "#").attr("class", "btn btn-primary topicNav")
    .attr("font-size-adjust", "200%");


  topicNavs.append("span").attr("class", "nav-icon")
    .append("i").attr("class", "fa fa-gear");

  topicNavs.text(function(d) {
    return (d.name + " : " + d.value);
  });

  topicNavs.on("click", function(d) {
    sessionData["topicQuery"] = d.value;
    updateSessionData(sessionData);
    reQuery(reDraw);
  });
}
