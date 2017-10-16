
//var docTypes = ["PATENT","PUBMED","NIH","NSF","SBIR","CLINICALTRIALS","TRACXN"];
var docTypes = ["PATENT","PUBMED","NIH","NSF","CLINICALTRIALS","TRACXN"];
var createdHud = false;
var createdSettings = false;
var createdSessions = false;

//sidebar listeners
$("#sidebar-settings").on("click",function(){
	toggleSettings();
})
$("#sidebar-filters").on("click",function(){
	toggleHud();
})
$("#sidebar-sessions").on("click",function(){
	toggleSessions();
//	saveSession();
})


function toggleSessions(){
	if(!createdSessions){
		createSessions();
	}
	$("#sessions-modal").modal("show");
//	getSessions();
}

function createSessions(){
	var body = d3.select("#sessions-modal-body");
//	.append("div").attr("class","panel hud-panel").attr("id","sessions-panel")
//	.append("div").attr("class","panel-body");

	$("#sessions-modal-title").text("Save Session");
	
	var content = body.append("div").attr("class","container-fluid");
	createdSessions = true;
	
	var nameForm = content.append("div").attr("class","row")
	.append("div").attr("class","form-group");
	
	nameForm.append("label").attr("for","session-title-input")
	.text("Save As:");
	nameForm.append("input").attr("type","text")
	.attr("value",sessionData.sessionID)
	.attr("class","form-control")
	.attr("id","session-title-input");
	
	var sessionButtons = content.append("div").attr("class","row")
	.attr("text-align","center")
	.append("div").attr("class","btn-group");
	
	sessionButtons.append("button")
	.attr("class","btn btn-danger")
	.attr("id","sessions-cancel-button")
	.text("Cancel")
	.on("click",function(){
		toggleSessions();
	});
	
	sessionButtons.append("button")
	.attr("class","btn btn-success")
	.attr("id","sessions-save-button")
	.text("Save")
	.on("click",function(){
		sessionData.sessionID = $("#session-title-input").val();
		sessionData.searchName =$("#session-title-input").val();
		updateSessionData(sessionData);
		saveSession();
	});
}

function toggleSettings(){
	if(!createdSettings){
		createSettings();
	}
	$("#settings-modal").modal("show");
	getUserSettings();
}

function createSettings(){
	var setBody = d3.select("#settings-modal-body");
//		.append("div").attr("class","panel hud-panel").attr("id","settings-panel")
//		.append("div").attr("class","panel-body");
	
	var setCont = setBody.append("div").attr("class","container-fluid");
	
	setCont.append("h4").text("Data Restrictions");
	setCont.append("ul").attr("id","user-restrictions-list").attr("list-style-type","disc");
	createdSettings = true;
}

function getUserSettings(){
	var ajaxParams = JSON.parse(JSON.stringify(sessionData));
	if(ajaxParams.repData) delete ajaxParams.repData;
	$.ajax({
	      type: "GET",
	      crossDomain: true,
	      xhrFields: {
	    	  withCredentials: true,
	      },
	      url: config.dataURL+"/sessions/getUserSettingsRequest.sjs",
	      data: JSON.stringify(ajaxParams),

	      success: function(data){
	    	  console.log("settings is ");
	    	  console.log(data);
	    	  d3.select("#user-restrictions-list").selectAll("li").data(data.restrictions).enter()
	    	  	.append("li").text(function(d){
	    	  		return(d);
	    	  	});
	      }
	    })
}

function toggleHud(){
	if(!createdHud){
		createHud();
		createHudListeners();
	}
	$("#filters-modal").modal("show");
	getHudFacets();
}

function createHud(){
	createdHud = true;
	d3.select("#filters-modal-title").text("Filters");
	
	var hudBody = d3.select("#filters-modal-body");
//		.append("div").attr("class","panel hud-panel").attr("id","filters-panel")
//		.append("div").attr("class","panel-body");
//	
	var hudCont = hudBody.append("div").attr("class","container-fluid")
	var leftCol = hudCont.append("div").attr("class","col-lg-7 pull-left");
	var rightCol = hudCont.append("div").attr("class","col-lg-4 pull-right")
	
	var leftTabs = leftCol.append("div").attr("class","row").append("ul").attr("class", "nav nav-pills");
	var rightTabs = rightCol.append("div").attr("class","row").append("ul").attr("class","nav nav-pills");
	
	var leftPills = [
		{label: "yearRange",value: "Year Range"},
		{label: "topics",value: "Topics"},
		{label: "instGroups", value: "Organization Groups"},
		{label: "resGroups", value: "Expert Groups"},
		{label: "docTypes", value: "Document Sources"},
	]
	
	var rightPills = [
		{label: "inst",value:"Organizations"},
		{label:"res",value:"Experts"},
		{label:"mesh",value:"MeSH Terms"},
		];
	
	leftTabs.selectAll("li").data(leftPills).enter().append("li")
		.attr("class",function(d){
			if(d.label == "yearRange"){
				return("active");
			}else{
				return(null);
			}
		}).append("a")
		.attr("href",function(d){
			return("#hud-"+d.label);
		}).attr("data-toggle","pill")
		.text(function(d){
			return(d.value);
		});
	
	rightTabs.selectAll("li").data(rightPills).enter().append("li")
		.attr("class",function(d){
			if(d.label == "mesh"){
				return("active");
			}else{
				return(null);
			}
		}).append("a")
		.attr("href",function(d){
			return("#hud-"+d.label);
		}).attr("data-toggle","pill")
		.text(function(d){
			return(d.value);
		});
	
	var leftPillCont = leftCol.append("div").attr("class","row");
	var rightPillCont = rightCol.append("div").attr("class","row");
	
	var leftTabCont = leftPillCont.append("div").attr("class","tab-content");
	var rightTabCont = rightPillCont.append("div").attr("class","tab-content");

	leftTabCont.selectAll("div").data(leftPills).enter().append("div")
	.attr("class",function(d){
		if(d.label == "yearRange"){
			return("tab-pane fade in active");
		}else{
			return("tab-pane fade");
		}
	}).attr("id",function(d){
		return("hud-"+d.label);
	});
	
	rightTabCont.selectAll("div").data(rightPills).enter().append("div")
	.attr("class",function(d){
		if(d.label == "mesh"){
			return("tab-pane fade in active");
		}else{
			return("tab-pane fade");
		}
	}).attr("id",function(d){
		return("hud-"+d.label);
	});
	
	//year slider well
	var yearWell = d3.select("#hud-yearRange").append("div").attr("class","row well").attr("id","filters-slider-well");
	var yearCol = yearWell.append("div").attr("class","col-md-6");
	var scoreCol = yearWell.append("div").attr("class","col-md-6");
	
	yearCol.append("div").attr("class","row").append("h4").text("Year Range");
	yearCol.append("div").attr("class","row").append("input").attr("id","hud-year-slider").attr("type","text");
//	var countryRow = yearWell.append("div").attr("class","row").attr("id","hud-country-row");
//	countryRow.append("div").attr("class","row").append("h5").text("Selected Country");
//	var countryTextRow = countryRow.append("div").attr("class","row").attr("text-align","inline");
//	countryTextRow.append("h5").attr("id","hud-country").text("None");
	
	scoreCol.append("div").attr("class","row").append("h4").text("Minimum Score");
	scoreCol.append("div").attr("class","row").append("input").attr("id","hud-score-slider").attr("type","text");
	var estimateRow = yearWell.append("div").attr("class","row");
	yearCol.append("h5").attr("id","hud-year-label");

	//docType Well
	var docWell = d3.select("#hud-docTypes").append("div")
		.attr("class","row well");
	var docTitRow = docWell.append("div").attr("class","row")
		.attr("class","tab-tit");
	var docTitCol = docTitRow.append("div").attr("class","col-md-8")
		.append("h4").text("Document Sources");
	var docBtns = docTitRow.append('div').attr("class","col-md-4")
		.append("div").attr("class","btn-group").attr("role","group");
	docBtns.append("button").attr("class","btn btn-info")
		.text("Toggle All")
		.on("click",function(){
		var on = sessionData.docTypes[0].active;
		sessionData.docTypes.forEach(function(typ){
			typ.active = !on;
		});
		updateSessionData(sessionData);
		getHudFacets();
	});
	docWell.append("div").attr("class","row")
	.append("div").attr("class","col-md-12")
	.append("ul").attr("id","docOrigin-list").attr("class","columns").style("columns","3");
	
	
	//mesh Column
	var meshWell = d3.select("#hud-mesh").append("div")
		.attr("class","row well");
	var meshTitRow = meshWell.append("div").attr("class","row");
	var meshTitCol = meshTitRow.append("div")
		.attr("class","col-md-6")
		.append("a").attr("href","../mesh/mesh.html").attr("target","_blank").text("MeSH Terms");
	var meshBtns = meshTitRow.append("div").attr("class","col-md-6")
	.append("div").attr("class","btn-group").attr("role","group");
	meshBtns.append("button").attr("class","btn btn-info")
	.text("Toggle All")
	.on("click",function(){
		var on = sessionData.meshList[0].active;
		sessionData.meshList.forEach(function(typ){
			typ.active = !on;
		});
		updateSessionData(sessionData);
		getHudFacets();
	});
	meshBtns.append("button").attr("class","btn btn-danger")
		.text("Delete All")
		.on("click",function(){
			sessionData.meshList = [];
			updateSessionData(sessionData);
			getHudFacets();
		});
		
	meshWell.append("div").attr("class","row").append("ul").attr("id","hud-mesh-list");
	
	
	
	var topicWell = d3.select("#hud-topics").append("div").attr("class","row well");
	var topicTitRow = topicWell.append("div").attr("class","row");
	var topicTitCol = topicTitRow.append("div")
		.attr("class","col-md-6")
		.append("h4").text("Topics");
	var topicBtns = topicTitRow.append("div").attr("class","col-md-6")
	.append("div").attr("class","btn-group").attr("role","group");
	topicBtns.append("button").attr("class","btn btn-info")
	.text("Toggle All")
	.on("click",function(){
		var on = sessionData.topics[0].active;
		sessionData.topics.forEach(function(typ){
			typ.active = !on;
		});
		updateSessionData(sessionData);
		getHudFacets();
	});
	topicBtns.append("button").attr("class","btn btn-danger")
		.text("Delete All")
		.on("click",function(){
			sessionData.topics = [];
			updateSessionData(sessionData);
			getHudFacets();
		});
	topicWell.append("div").attr("class","row").append("ul").attr("id","hud-topics-list")
	.attr("class","columns").style("columns","3");

	var instGroupWell = d3.select("#hud-instGroups").append("div").attr("class","row well");
	
	var instGroupTitRow = instGroupWell.append("div").attr("class","row");
	var instGroupTitCol = instGroupTitRow.append("div")
		.attr("class","col-md-6")
		.append("h4").text("Organizations Groups");
	var instGroupBtns = instGroupTitRow.append("div").attr("class","col-md-6")
	.append("div").attr("class","btn-group").attr("role","group");
	instGroupBtns.append("button").attr("class","btn btn-info")
	.text("Toggle All")
	.on("click",function(){
		var on = sessionData.institutions[0].active;
		sessionData.institutions.forEach(function(typ){
			typ.active = !on;
		});
		updateSessionData(sessionData);
		getHudFacets();
	});
	instGroupBtns.append("button").attr("class","btn btn-danger")
		.text("Delete All")
		.on("click",function(){
			sessionData.institutions = [];
			updateSessionData(sessionData);
			getHudFacets();
		});
	
	instGroupWell.append("div").attr("class","row").append("ul").attr("id","hud-instGroups-list")
	.attr("class","columns").style("columns","3");
	
	//selected insts
	var instWell = d3.select("#hud-inst").append("div").attr("class","row well");
	var instTitRow = instWell.append("div").attr("class","row");
	var instTitCol = instTitRow.append("div")
		.attr("class","col-md-6")
		.append("h4").text("Selected Organizations");
	var instBtns = instTitRow.append("div").attr("class","col-md-6")
	.append("div").attr("class","btn-group").attr("role","group");
	instBtns.append("button").attr("class","btn btn-info")
	.text("Toggle All")
	.on("click",function(){
		var on = sessionData.institutionsAdded[0].active;
		sessionData.institutionsAdded.forEach(function(typ){
			typ.active = !on;
		});
		updateSessionData(sessionData);
		getHudFacets();
	});
	instBtns.append("button").attr("class","btn btn-danger")
		.text("Delete All")
		.on("click",function(){
			sessionData.institutionsAdded = [];
			updateSessionData(sessionData);
			getHudFacets();
		});	
	instWell.append("div").attr("class","row").append("ul").attr("id","hud-inst-list")

	var resGroupWell = d3.select("#hud-resGroups").append("div").attr("class","res well");
	var resGroupTitRow = resGroupWell.append("div").attr("class","row");
	var resGroupTitCol = resGroupTitRow.append("div")
		.attr("class","col-md-6")
		.append("h4").text("Expert Groups");
	var resGroupBtns = resGroupTitRow.append("div").attr("class","col-md-6")
	.append("div").attr("class","btn-group").attr("role","group");
	resGroupBtns.append("button").attr("class","btn btn-info")
	.text("Toggle All")
	.on("click",function(){
		var on = sessionData.researchers[0].active;
		sessionData.researchers.forEach(function(typ){
			typ.active = !on;
		});
		updateSessionData(sessionData);
		getHudFacets();
	});
	resGroupBtns.append("button").attr("class","btn btn-danger")
		.text("Delete All")
		.on("click",function(){
			sessionData.researchers = [];
			updateSessionData(sessionData);
			getHudFacets();
		});	

	resGroupWell.append("div").attr("class","row").append("ul").attr("id","hud-resGroups-list")
	.attr("class","columns").style("columns","3");

	var resWell = d3.select("#hud-res").append("div").attr("class","res well");
	var resTitRow = resWell.append("div").attr("class","row");
	var resTitCol = resTitRow.append("div")
		.attr("class","col-md-6")
		.append("h4").text("Selected Experts");
	var resBtns = resTitRow.append("div").attr("class","col-md-6")
	.append("div").attr("class","btn-group").attr("role","group");
	resBtns.append("button").attr("class","btn btn-info")
	.text("Toggle All")
	.on("click",function(){
		var on = sessionData.researchersAdded[0].active;
		sessionData.researchersAdded.forEach(function(typ){
			typ.active = !on;
		});
		updateSessionData(sessionData);
		getHudFacets();
	});
	resBtns.append("button").attr("class","btn btn-danger")
		.text("Delete All")
		.on("click",function(){
			sessionData.researchersAdded = [];
			updateSessionData(sessionData);
			getHudFacets();
		});
	resWell.append("div").attr("class","row").append("ul").attr("id","hud-res-list");
	
	var hudBtnGroup = d3.select("#filters-modal-footer")
	.append("div").attr("class","btn-group");
	hudBtnGroup.append("button").attr("class","btn btn-lg btn-danger")
		.attr("id","hud-reset-button")
		.text("Reset");
	
	hudBtnGroup.append("button").attr("class","btn btn-lg btn-success")
	.attr("id","hud-submit-button")
	.text("Submit");
	
	hudCont.append("h5").attr("id","hud-estimate");
}

function createHudListeners(){
	//sidebar hud listeners
	$("#hud-reset-button").on("click",function(){
		hudReset();
	})

	$("#hud-submit-button").on("click",function(){
		window.location.href = window.location.href;
	})
}

function hudReset(){
	delete sessionData.selectedCountry;
	sessionData.start_year = 1980;
	sessionData.end_year = 2017;
	for(var i in sessionData.topics){
		sessionData.topics[i].active = false;
	}
	for(var i in sessionData.meshList){
		sessionData.meshList[i].active = true;
	}
	for(var i in sessionData.institutions){
		sessionData.institutions[i].active = true;
	}
	for(var i in sessionData.institutionsAdded){
		sessionData.institutions[i].active = false;
	}
	for(var i in sessionData.researchers){
		sessionData.researchers[i].active = true;
	}
	for(var i in sessionData.researchersAdded){
		sessionData.researchersAdded[i].active = false;
	}
	for(var i in sessionData.docTypes){
		sessionData.docTypes[i].active = true;
	}
	updateSessionData(sessionData);
	window.location.href = window.location.href;
}

function getHudFacets(){
	var ret_facets;
	var ajaxParams = JSON.parse(JSON.stringify(sessionData));
	if(ajaxParams.repData) delete ajaxParams.repData;
	if(ajaxParams.instData) delete ajaxParams.instData;
	if(ajaxParams.vizData) delete ajaxParams.vizData;
    
    //this call gets facets for year, mesh, inst, and res
    $.ajax({
      type: "GET",
      
      crossDomain: true,
      xhrFields: {
    	  withCredentials: true,
      },
      url: config.dataURL+"/filters/facet.sjs",
      data: JSON.stringify(ajaxParams),

      success: function(data){
    	 results = data.facets;
    	 createHudYearSlider(results);
    	 createMeshList(results);
    	 createHudInst(results);
    	 createHudRes(results);
      }
    })
    
    //ajax for topics
    if(sessionData.topics){
		$.ajax({
		      method : "GET",
		      crossDomain: true,
		      xhrFields: {
		    	  withCredentials: true,
		      },
		      url: config.dataURL+"/hud/getTopicEstimates.sjs",
		      data: JSON.stringify(ajaxParams),
		      success: function(results){
		    	  createHudTopics(results);
		      },
		});
	}
    
    //ajax for docTypes
	$.ajax({
	      method : "GET",
	      crossDomain: true,
	      xhrFields: {
	    	  withCredentials: true,
	      },
	      url: config.dataURL+"/filters/getDocTypeEstimates.sjs",
	      data: JSON.stringify(ajaxParams),
	      success: function(results){
	    	  createHudDocTypes(results);
	      },
	});

    //ajax for inst groups
    if(sessionData.institutions.length > 0){
		$.ajax({
		      method : "GET",
		      crossDomain: true,
		      xhrFields: {
		    	  withCredentials: true,
		      },
		      url: config.dataURL+"/filters/getInstEstimates.sjs",
		      data: JSON.stringify(ajaxParams),
		      success: function(results){
		    	  createHudInstGroups(results);
		      },
		});
    }
    
    //ajax for res groups
    if(sessionData.researchers.length > 0){
		$.ajax({
		      method : "GET",
		      crossDomain: true,
		      xhrFields: {
		    	  withCredentials: true,
		      },
		      url: config.dataURL+"/filters/getResEstimates.sjs",
		      data: JSON.stringify(ajaxParams),
		      success: function(results){
		    	  createHudResGroups(results);
		      },
		});
    }
	
}
var firstSlider = true;
function createHudYearSlider(facets){
	
	//add country : TODO: move this somewhere logical
//	d3.select("#hud-country").text(function(){
//		if(sessionData.selectedCountry){
//			return(sessionData.selectedCountry);
//		} else{
//			return("None");
//		}
//	}).append("i").attr("class","fa fa-times").on("click",function(){
//		delete sessionData.selectedCountry;
//		updateSessionData(sessionData);
//		$("#hud-country").text("None");
//	});
	
	$("#hud-year-label").text( function(){
		var est = 0;
		for(var i = sessionData.start_year; i <= sessionData.end_year; i++){
			if(facets.year[i]){
				est += facets.year[i];
			}
		}
		var str = String(sessionData.start_year) + " - " + String(sessionData.end_year) + " : " + String(est) + " Documents";
		return(str);
	});
	
	var startScore = 0;
	if(sessionData.minScore){
		startScore = sessionData.minScore;
	}
	var scoreSlider = $("#hud-score-slider").slider({
		min: 0,
		max: 10000,
		value: parseInt(startScore),
		focus: true,
		tooltip_position: 'right',
	});
	var yearSlider = $("#hud-year-slider").slider({ 
		min: 1980, 
		max: 2017, 
		value: [parseInt(sessionData.start_year), parseInt(sessionData.end_year)], 
		focus: true,
		tooltip_position: 'right',
		});

	scoreSlider.on("slideStop",function(){
		sessionData.minScore = $("#hud-score-slider").val();
		updateSessionData(sessionData);
	});
	
	if(firstSlider){
		firstSlider = false;
		
		
		yearSlider.on("slideStop",function(){
			$("#hud-year-label").text(function(){
				var yearVals = $("#hud-year-slider").val().split(",");
				var startyr = yearVals[0];
				var endyr = yearVals[1];
				sessionData.start_year = startyr;
				sessionData.end_year = endyr;
				updateSessionData(sessionData);
				var res = 0;
				for(var i = startyr; i <= endyr; i++){
					if(facets.year[i]){
						res += facets.year[i];
					}
				}
				ret = String(startyr) + " - " + String(endyr) + " : " + String(res) + " Documents";
				return(ret);
			})
			getHudFacets();
		})
	}
}

function createHudDocTypes(facets){
	console.log(facets);
	console.log(sessionData.docTypes);
	d3.select("#docOrigin-list").selectAll("li").remove();
	
	var lis = d3.select("#docOrigin-list").selectAll("li").data(sessionData.docTypes)
		.enter().append("li");
	
	lis.append("input").attr("type","checkbox")
	.attr("value",function(d){ return(d.label);})
	.attr("checked",function(d){
		if(d.active){return("checked");} else{return(null);}
	})
	.attr("id",function(d){return(d.value+String(d.index));})
	.on("click",function(d){
		if(!d.active){
			//add
			sessionData.docTypes[d.index].active = true;
			//make sure it's clicked
			$(this).attr("checked",true);
		} else{
			//remove
			sessionData.docTypes[d.index].active = false;
			$(this).attr("checked",false);
		}
		updateSessionData(sessionData);
		getHudFacets()
	});
	
	lis.append("label").text(function(d){
		var est = facets.docOrigin[d.label];
		if(est){
			return(d.label + " : " + est);
		} else{
			return(d.label + " : 0");
		}
	}).attr("for",function(d){
		return(d.value+String(d.index));
	});
}

function createMeshList(facets){
	d3.select("#hud-mesh-list").selectAll("li").remove();
	
	var rows = d3.select("#hud-mesh-list").selectAll("li").data(sessionData.meshList);
	var lis = rows.enter()
	.append("li");
	
	lis.append("input").attr("type","checkbox")
	.attr("value",function(d){ return(d.label);})
	.attr("checked",function(d){
		if(d.active){
			return(true);
		} else{
			return(null);
		}
	})
	.attr("id",function(d){return(d.label+String(d.index));})
	.on("click",function(d){
		if(!d.active){
			//add
			sessionData.meshList[d.index].active = true;
			//make sure it's clicked
			$(this).attr("checked",true);
		} else{
			//remove
			sessionData.meshList[d.index].active = false;
			//make sure it's unchecked
			$(this).attr("checked",false);
		}
		updateSessionData(sessionData);
		getHudFacets();
	});
	
	lis.append("label").text(function(d){
		return(d.label + " : " +facets.meshterms[d.label])
	}).attr("for",function(d){
		return(d.label+String(d.index));
	});
	lis.append("a").attr("href","#").append("span").attr("class","glyphicon glyphicon-remove")
	.on("click",function(d){
		//delete from sessionData
		for(var i in sessionData.meshList){
//			console.log(sessionData.topics[i].label);
			var idx = -1;
			if(sessionData.meshList[i].label == d.label){
				idx = i;
				break;
			}
		}
		if(idx != -1){
			delete sessionData.meshList[idx];
		}
		sessionData.meshList = reIndex(sessionData.meshList);
		updateSessionData(sessionData);
		getHudFacets();
	});
}


function createHudTopics(facets){
	d3.select("#hud-topics-list").selectAll("li").remove();
	var rows = d3.select("#hud-topics-list").selectAll("li").data(sessionData.topics);
	var lis = rows.enter().append("li");
	
	lis.append("label").attr("for",function(d){
		return(d.label+String(d.index));
	}).text(function(d){
		return(d.label + " : " + facets.topics[d.label]);
	});
	
	lis.append("input").attr("type","checkbox")
		.attr("id",function(d){
			return(d.label+String(d.index));
		})
		.attr("checked",function(d){
			if(d.active){ 
				return("checked");
			} else{
				return(null);
			}
		}).attr("value",function(d){return(d.label);})
		.on("click",function(d){
			if(!d.active){
			//add
			sessionData.topics[d.index].active = true;
			//make sure it's clicked
			$(this).attr("checked",true);
		} else{
			//remove
			sessionData.topics[d.index].active = false;
			//make sure it's unchecked
			$(this).attr("checked",false);
		}
		updateSessionData(sessionData);
		getHudFacets();
		});
	
	lis.append("a").attr("href","#").append("span").attr("class","glyphicon glyphicon-remove")
	.on("click",function(d){
		//delete from sessionData
		for(var i in sessionData.topics){
//			console.log(sessionData.topics[i].label);
			var idx = -1;
			if(sessionData.topics[i].label == d.label){
				idx = i;
				break;
			}
		}
		if(idx != -1){
			delete sessionData.topics[idx];
		}
		sessionData.topics = reIndex(sessionData.topics);
		updateSessionData(sessionData);
		getHudFacets();
	});
}

function createHudInstGroups(facets){
	//inst groups
	d3.select("#hud-instGroups-list").selectAll("li").remove();
	var rows = d3.select("#hud-instGroups-list").selectAll("li").data(sessionData.institutions);
	var lis = rows.enter().append("li");

	lis.append("input").attr("type","checkbox")
		.attr("id",function(d){
			return(d.label+String(d.index));
		})
		.attr("checked",function(d){
			if(d.active){ 
				return("checked");
			} else{
				return(null);
			}
		}).attr("value",function(d){return(d.label);})
		.on("click",function(d){
			if(!d.active){
			//add
			sessionData.institutions[d.index].active = true;
			//make sure it's clicked
			$(this).attr("checked",true);
		} else{
			//remove
			sessionData.institutions[d.index].active = false;
			//make sure it's unchecked
			$(this).attr("checked",false);
		}
		updateSessionData(sessionData);
		getHudFacets();
		});
	
	lis.append("label").attr("for",function(d){
		return(d.label+String(d.index));
	}).text(function(d){
		var est = facets.Institution_Name[d.label];
		if(!est){
			est = 0;
		}
		return(d.label + " : " + est);
	});
	
	lis.append("a").attr("href","#").append("span").attr("class","glyphicon glyphicon-remove")
	.on("click",function(d){
		//delete from sessionData
		for(var i in sessionData.institutions){
			var idx = -1;
			if(sessionData.institutions[i].label == d.label){
				idx = i;
				break;
			}
		}
		if(idx != -1){
			delete sessionData.institutions[idx];
		}
		sessionData.institutions = reIndex(sessionData.institutions);
		updateSessionData(sessionData);
		getHudFacets();
	});
}

function createHudInst(facets){
	//added insts
	d3.select("#hud-inst-list").selectAll("li").remove();
	var rows = d3.select("#hud-inst-list").selectAll("li").data(sessionData.institutionsAdded);
	var lis2 = rows.enter().append("li");

	lis2.append("input").attr("type","checkbox")
		.attr("id",function(d){
			return(d.label+String(d.index));
		})
		.attr("checked",function(d){
			if(d.active){ 
				return("checked");
			} else{
				return(null);
			}
		}).attr("value",function(d){return(d.label);})
		.on("click",function(d){
			if(!d.active){
			//add
			sessionData.institutionsAdded[d.index].active = true;
			//make sure it's clicked
			$(this).attr("checked",true);
		} else{
			//remove
			sessionData.institutionsAdded[d.index].active = false;
			//make sure it's unchecked
			$(this).attr("checked",false);
		}
		updateSessionData(sessionData);
		getHudFacets();
		});
	
	lis2.append("label").attr("for",function(d){
		return(d.label+String(d.index));
	}).text(function(d){
		var est = facets.Institution_Name[d.label];
		if(!est){
			est = 0;
		}
		return(d.label + " : " + est);
	});
	
	lis2.append("a").attr("href","#").append("span").attr("class","glyphicon glyphicon-remove")
	.on("click",function(d){
		//delete from sessionData
		for(var i in sessionData.institutionsAdded){
//			console.log(sessionData.topics[i].label);
			var idx = -1;
			if(sessionData.institutionsAdded[i].label == d.label){
				idx = i;
				break;
			}
		}
		if(idx != -1){
			delete sessionData.institutionsAdded[idx];
		}
		sessionData.institutionsAdded = reIndex(sessionData.institutionsAdded);
		updateSessionData(sessionData);
		getHudFacets();
	});
}
function createHudResGroups(facets){
	d3.select("#hud-resGroups-list").selectAll("li").remove();
	var rows = d3.select("#hud-resGroups-list").selectAll("li").data(sessionData.researchers);
	var lis = rows.enter().append("li");
	
	lis.append("input").attr("type","checkbox")
		.attr("id",function(d){
			return(d.label+String(d.index));
		})
		.attr("checked",function(d){
			if(d.active){ 
				return("checked");
			} else{
				return(null);
			}
		}).attr("value",function(d){return(d.label);})
		.on("click",function(d){
			if(!d.active){
			//add
			sessionData.researchers[d.index].active = true;
			//make sure it's clicked
			$(this).attr("checked",true);
		} else{
			//remove
			sessionData.researchers[d.index].active = false;
			//make sure it's unchecked
			$(this).attr("checked",false);
		}
		updateSessionData(sessionData);
		getHudFacets();
		});
	
	lis.append("label").attr("for",function(d){
		return(d.label+String(d.index));
	}).text(function(d){
		var est = facets.researcherName[d.label];
		if(!est){
			est = 0;
		}
		return(d.label + " : " + est);
	});
	
	lis.append("a").attr("href","#").append("span").attr("class","glyphicon glyphicon-remove")
	.on("click",function(d){
		//delete from sessionData
		for(var i in sessionData.researchers){
			var idx = -1;
			if(sessionData.researchers[i].label == d.label){
				idx = i;
				break;
			}
		}
		if(idx != -1){
			delete sessionData.researchers[idx];
		}
		sessionData.researchers = reIndex(sessionData.researchers);
		updateSessionData(sessionData);
		getHudFacets();
	});
}
function createHudRes(facets){
	//added reses
	d3.select("#hud-res-list").selectAll("li").remove();
	var rows = d3.select("#hud-res-list").selectAll("li").data(sessionData.researchersAdded);
	var lis2 = rows.enter().append("li");

	lis2.append("input").attr("type","checkbox")
		.attr("id",function(d){
			return(d.label+String(d.index));
		})
		.attr("checked",function(d){
			if(d.active){ 
				return("checked");
			} else{
				return(null);
			}
		}).attr("value",function(d){return(d.label);})
		.on("click",function(d){
			if(!d.active){
			//add
			sessionData.researchersAdded[d.index].active = true;
			//make sure it's clicked
			$(this).attr("checked",true);
		} else{
			//remove
			sessionData.researchersAdded[d.index].active = false;
			//make sure it's unchecked
			$(this).attr("checked",false);
		}
		updateSessionData(sessionData);
		getHudFacets();
		});
	
	lis2.append("label").attr("for",function(d){
		return(d.label+String(d.index));
	}).text(function(d){
		var est = facets.researcherName[d.label];
		if(!est){
			est = 0;
		}
		return(d.label + " : " + est);
	});
	
	lis2.append("a").attr("href","#").append("span").attr("class","glyphicon glyphicon-remove")
	.on("click",function(d){
		//delete from sessionData
		for(var i in sessionData.researchersAdded){
			var idx = -1;
			if(sessionData.researchersAdded[i].label == d.label){
				idx = i;
				break;
			}
		}
		if(idx != -1){
			delete sessionData.researchersAdded[idx];
		}
		sessionData.researchersAdded = reIndex(sessionData.researchersAdded);
		updateSessionData(sessionData);
		getHudFacets();
	});
}


