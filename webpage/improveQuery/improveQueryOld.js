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
if(!sessionData.queryData){
    sessionData.queryData = {};
    updateSessionData(sessionData);
}
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
    getMatches();
}

function getMatches(){
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
    })
}
function fillMatches(data){
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
        var matchesArr = [];
        Object.keys(matches).forEach(function(m){
            matchesArr.push(""+m+" : " + matches[m]);
        })
        d3.select("#matches").selectAll("li").data(matchesArr).enter()
        .append("li").text(function(d){
            console.log(d);
            console.log("here");
            // return(d[0] + " : " +d[1]);
            return(d);
        });
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
