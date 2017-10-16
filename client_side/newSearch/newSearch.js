var max_topic_index = 0;
var  max_inst_index = 0;
var start_year = 1980;
var end_year = 2017;
var num_rows = 0;
var num_inst_rows = 0;
var num_res_rows = 0;
var sessionData = getSessionData();

//var found_SBIR = false;
//for(var i in sessionData.docTypes){
//	if(sessionData.docTypes[i].value == "SBIR"){
//		found_SBIR = true;
//	}
//}
//if(!found_SBIR){
//	sessionData.docTypes.push({active:true,label:"SBIR",value:"SBIR",index:String(sessionData.docTypes.length)});
//	updateSessionData(sessionData);
//	console.log("added sbir");
//	console.log(sessionData);
//}
	console.log("config.dataURL: ",config.dataURL);

createYearSlider();
createDocOriginList();
createListeners(); //create event listeners
createMeshList();
createMeshListener();

function createDocOriginList(){
	
	console.log(sessionData.docTypes);
	var lis = d3.select("#docOrigin-list").selectAll("li").data(sessionData.docTypes).enter()
	.append("li");

	lis.append("input").attr("type","checkbox").attr("value",function(d){
		return(d.value);
	}).attr("id",function(d){
		return(d.value+String(d.index));
	})
	.attr("checked",function(d){
		console.log(d);
		console.log(sessionData);
		if(sessionData.docTypes[d.index].active){
			return("checked");
		} else{
			return(null);
		}
	})
	.on("click",function(d){
		if(!sessionData.docTypes[d.index].active){
			//add
			sessionData.docTypes[d.index].active = true;
			//make sure it's clicked
			$(this).attr("checked",true);
		} else{
			//remove
			sessionData.docTypes[d.index].active = false;
			//make sure it's unchecked
			$(this).attr("checked",false);
		}
		updateSessionData(sessionData);
	})

	lis.append("label").text(function(d){
		return(d.label);
	}).attr("for",function(d){
		return(d.value+String(d.index));
	});

}

function createMeshList(){
	var lis = d3.select("#mesh-list").selectAll("li").data(sessionData.meshList).enter()
	.append("li").on("mouseenter",function(){
		//hover highlight
		$(this).css("background","gray")
	}).on("mouseleave",function(){
		//reset hover highlight
		$(this).css("background","transparent");
	});

	lis.append("input").attr("type","checkbox")
	.attr("value",function(d){
		return(d.label);
	}).attr("checked",function(d){
		console.log(d);
		if(sessionData.meshList[d.index].active){
			return("checked");
		} else {
			return(null);
		}
	})
	.attr("id",function(d){
		return(d.label.replace(/ /g,"")+String(d.index));
	})
	.on("click",function(d){
		if(!sessionData.meshList[d.index].active){
			sessionData.meshList[d.index].active = true;
			$(this).attr("checked",true);
		} else{
			sessionData.meshList[d.index].active = false;
			$(this).attr("checked",false);
		}
		updateSessionData(sessionData);
	});

	lis.append("label").text(function(d){
		return(d.label);
	}).attr("for",function(d){
		return(d.label.replace(/ /g,"")+String(d.index));
	});

	lis.append("i").attr("class","fa fa-times fa-1")
	.style("top","0px")
	.style("left", "5px")
	.style("height","20px")
	.style("width","20px")
	.on("click",function(d){
		console.log("removing");
		event.preventDefault();
		//clicked inside meshList, remove from list and sessionData
		$(this).parent().remove(); //remove from meshList
		//remove from session Data
		sessionData.meshList.splice(d.index,1);
		//reindex
		for(var i in sessionData.meshList){
			sessionData.meshList[i].index = i;
		}
		updateSessionData(sessionData);
	})

}

function createMeshListener(){
	$("#mesh-search-button")
	.on("click",function(){
		$("#mesh-suggestion").show();
		var div = $("#mesh-search");
		var str = (div).val();
		//remove any old list items
		d3.select("#mesh-suggestion").selectAll("li").remove();
		//get suggestions from server
		$.ajax({
			type: "GET",
			xhrFields: { withCredentials: true },
		    crossDomain: true,
			url: config.dataURL+"/docMaster/getMeshSuggestions.sjs",
			data: JSON.stringify({"meshterm":str + "*",meshList:sessionData.meshList,username:sessionData.username}),
			success: function(data){
				//add li suggestions
				suggestions = data;
				//remove any suggestions that are already in sessionData, should never be called if sjs works correctly
				sessionData.meshList.forEach(function(obj){
					for(var i in suggestions){
						if(obj.label == suggestions[i]){
							console.log("found in suggestions, removing");
							//remove from suggestions
							suggestions.splice(i,1);
							break;
						}
					}
				});
				var sug = d3.select("#mesh-suggestion").selectAll("li").data(suggestions);

				sug.enter().append("li")
				.text(function(d){
					return(d);
				}).on("mouseenter",function(){
					//hover highlight
					$(this).css("background","gray")
				}).on("mouseleave",function(){
					//reset hover highlight
					$(this).css("background","silver");
				}).on("mousedown",function(d){
					event.preventDefault();
					//add to meshList
					sessionData.meshList.push({label:d,index:sessionData.meshList.length,active:true});
					updateSessionData(sessionData);
					createMeshList();
					//clear search box
					$(div).val("");
					//remove from mesh list
					$(this).remove();

				});
			},
			error: function(data){
				console.log("get suggestions failed");
			}
		});
	})
		.focusout(function(){
			//destroy the suggestion box
		$("#mesh-suggestion").hide();
	})
}

function fillForm(){
	if(sessionData != undefined){
		//populate field from report query

		if(sessionData.mainQuery){
			document.getElementById("mainQuery").value = sessionData.mainQuery;
		}
		if(sessionData.institutions){
			for(var i in sessionData.institutions){
				var idx = sessionData.institutions[i].index;
				if(idx == 0){
					document.getElementById("inst-label0").value = sessionData.institutions[idx].label;
					document.getElementById("inst-value0").value = sessionData.institutions[idx].value;
				} else{
					addInst(idx,fillInst);
				}
			}
		}
		if(sessionData.topics){
			for(var i in sessionData.topics){
				var idx = sessionData.topics[i].index;
				if(idx == 0){
					document.getElementById("topic-value"+String(idx)).value = sessionData.topics[idx].value;
					document.getElementById("topic-label"+String(idx)).value = sessionData.topics[idx].label;
				} else{
					addTopic(idx,fillTopic);
				}
			}
		}
		if(sessionData.researchers){
			for(var i in sessionData.researchers){
				var idx = sessionData.reserchers[i].index;
				if(idx == 0){
					document.getElementById("res-value"+String(idx)).value = sessionData.researchers[idx].value;
					document.getElementById("res-label"+String(idx)).value = sessionData.researchers[idx].label;
				} else{
					addRes(idx,Res);
				}
			}
		}
	}
	getEstimate();
}

$("#mainQuery").focusin(function(){
	console.log("here");
	$(this).css("height","200px");
}).focusout(function(){
	$(this).css("height","70px");
})

function addTopic(idx,cb){
	$(".add-topic-button").click();
	cb(idx);
}

function addInst(idx,cb){
	$(".add-inst-button").click();
	cb(idx);
}
function addRes(idx,cb){
	$(".add-res-button").click();
	cb(idx);
}

function fillTopic(idx){
	document.getElementById("topic-value"+String(idx)).value = sessionData.topics[idx].value;
	document.getElementById("topic-label"+String(idx)).value = sessionData.topics[idx].label;
}

function fillInst(idx){
	document.getElementById("inst-label"+String(idx)).value = sessionData.institutions[idx].label;
	document.getElementById("inst-value"+String(idx)).value = sessionData.institutions[idx].value;
}
function fillRes(idx){
	document.getElementById("res-label"+String(idx)).value = sessionData.researchers[idx].label;
	document.getElementById("res-value"+String(idx)).value = sessionData.researchers[idx].value;
}

function createYearSlider(){
	$("#year-label").text( function(){
		var str = String(sessionData.start_year) + " - " + String(sessionData.end_year);
		return(str);
	});
	var yearSlider = $("#year-slider").slider({
		min: 1980,
		max: 2017,
		value: [parseInt(sessionData.start_year), parseInt(sessionData.end_year)],
		focus: true,
		tooltip_position: 'right',
		});

	yearSlider.on("slide",function(val){
		$("#year-label").text(function(){
			var ret = "";
			var startyr = val.value[0];
			var endyr = val.value[1];
			sessionData.start_year = startyr;
			sessionData.end_year = endyr;
			updateSessionData(sessionData);
			var res = 0;
			ret = String(val.value[0]) + " - " + String(val.value[1]);
			return(ret);
		})
	})
}


function clearFields(){
	console.log("clearing fields");
	var username = sessionData.username;
	tsessionData = [];
	tsessionData.username = username;
	tsessionData.docTypes = oDocTypes;
	updateSessionData(tsessionData);
	console.log(tsessionData);
	window.location.href = window.location.href;
//	$(".form-control").val("");
//	document.getElementById('start_year').value = 1980;
//	document.getElementById('end_year').value = 2017;
//	$(".remove-inst-button").click();
//	$(".remove-topic-button").click();
//	$(".remove-res-button").click();
//	$("#mesh-list li").remove();
}

var suggestions;

function createListeners(){
//	createSuggestionListener(0);
	$("#qb-main-query-link").on("click",function(){
		console.log("clicked");

		$("#qb-main-modal").modal("show");
		var str = $("#mainQuery").val();
		console.log(str);
		var startRules;
		if(str !== ""){
	        startRules = rdp(str);
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
		console.log(startRules);
		d3.select("#qb-main-qb").selectAll("div").remove();
		d3.select("#qb-main-qb").append("div").attr("class","row").append("div").attr("class","row").attr("id","qb-main");
		qb1 = $("#qb-main").queryBuilder({
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
						operators: ['in']
					}
				]

			});
	});

	$("#topics").on("click",".fa-sitemap",function(){
		var roID = $(this).parent().parent().attr("id");
		var topicN = roID.replace("topic-row","");
		$("#topic-modal").modal("show");
		var str = $("#topic-value"+topicN).val();
		var startRules;
		if(str !== ""){
	        startRules = rdp(str);
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
		d3.select("#topic-qb-row").selectAll("div").remove();
		d3.select("#topic-qb-row").append("div").attr("class","row").append("div").attr("class","row").attr("id","topic-qb");
		$("#topic-qb").queryBuilder({
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
						operators: ['in']
					}
				]

			});
			$("#topic-qb-submit").unbind();
			$("#topic-qb-submit").on("click",function(){
				console.log("submitting to topic " + topicN);
				var topicQ = $("#topic-qb").queryBuilder("getRules");
				var str = unparse(topicQ);
				$("#topic-value"+topicN).val(str);
				$("#topic-modal").modal("toggle");
			});

	});

	$("#qb-main-submit").on("click",function(){
		console.log("clicked");
		var qObj = $("#qb-main").queryBuilder("getRules");
		console.log(qObj);
		var qText = unparse(qObj);
		sessionData.mainQuery = qText;
		updateSessionData(sessionData);
		console.log("here*****");
		$("#mainQuery").val(qText);
		$("#qb-main-modal").modal("hide");
	})

//	$("#submit1").on("click",function(){
	$("#submit1").on("click",function(event){
		handleSubmit(event);
	})


	$(document).on("focusout",":input",function(){
		console.log("getting estimate");
		serialize();
		getEstimate();
	});

	$(document).ready(function(){
		$("#clear-button").on("click",function(){
			// event.preventDefault();
			if(sessionData){
				var newSessionData = {};
				newSessionData.username = sessionData.username;
				updateSessionData(newSessionData);
				sessionData = newSessionData;
			}
			clearFields();
		})
	})

	$("#estimate-btn").on("click",function(){
		console.log("clicked");
		serialize();
		getEstimate();
	})

}


function serialize(){
	sessionData["mainQuery"] = document.getElementById('mainQuery').value;
	sessionData.topics = [];
	sessionData.institutions = [];
	sessionData.researchers = [];
	sessionData.numResearchers = 0;
	sessionData.numInstitutions = 0;
	sessionData.numTopics = 0;
	var instStr = "";
	for(var i = 0; i < 50; i++){
		if(document.getElementById('topic-row'+String(i))!=null){
			var topStr = "topic-value"+String(i);
			var labStr = "topic-label"+String(i);
			var top = document.getElementById(topStr).value;
			var lab = document.getElementById(labStr).value;
			var idx = sessionData.topics.length;
			if(top){
				sessionData.topics.push({value:top,label:lab,index:idx,active:false});
			}
		}
		if(document.getElementById("inst-row"+String(i))!=null){
			var instObj = {};
			if(document.getElementById("inst-value"+String(i)).value){
				instObj.label = document.getElementById("inst-label"+String(i)).value;
				instObj.value = document.getElementById("inst-value"+String(i)).value;
				instObj.active = true;
				instObj.index = sessionData.institutions.length;
				sessionData.institutions.push(instObj);
			}
		}
		if(document.getElementById("res-row"+String(i))!=null){
			var resObj = {};
			if(document.getElementById("res-value"+String(i)).value){
				resObj.label = document.getElementById("res-label"+String(i)).value;
				resObj.value = document.getElementById("res-value"+String(i)).value;
				resObj.index = sessionData.researchers.length;
				resObj.active = true;
				sessionData.researchers.push(resObj);
			}
		}
	}
	updateSessionData(sessionData);
}

function getEstimate(){
	console.log("estimating");
	var ajaxParams = JSON.parse(JSON.stringify(sessionData));
	if (ajaxParams.repData) delete ajaxParams.repData;
	console.log("config.dataURL: ",config.dataURL);
	$.ajax({
		type: "GET",
//		dataType: "application/json",
		crossDomain: true,
	      xhrFields: {
	    	  withCredentials: true,
	      },
		url: config.dataURL+"/lib/getEstimate.sjs",
		data: JSON.stringify(ajaxParams),
		success: function(data){
			console.log(data);
			$("#results-text").text(data + " documents");
		}
	})
}

//function handleSubmit(){
function handleSubmit(event){
	event.preventDefault();
	serialize();
	window.location = config.docMasterLink;
}

//script for dynamic fields for topics and labels
$(document).ready(function() {
    // The maximum number of options
    var MAX_OPTIONS = 50;
    $('#queryForm')
        // Add button click handler
        .on('click', '.add-topic-button', function() {
        	console.log("adding topic");
			num_rows++;
            var $template = $('#topic-template'),
                $clone    = $template
                                .clone()
                                .removeClass('hide')
                                .removeAttr('id')
								.attr('id','topic-row'+String(num_rows));
                $clone.insertAfter($("#topic-row" + String(num_rows-1)));
                $clone.find('[name="topic[]"]').attr("id","topic-value"+String(num_rows));
				$clone.find('[name="label[]"]').attr("id","topic-label"+String(num_rows));
				var kids = $("#row"+String(num_rows)).children();
        })
        .on("click",".add-inst-button",function(){
        	console.log("adding inst");
        	num_inst_rows++;
            var $template = $('#inst-template'),
                $clone    = $template
                                .clone()
                                .removeClass('hide')
                                .removeAttr('id')
								.attr('id','inst-row'+String(num_inst_rows));
                $clone.insertAfter($("#inst-row" + String(num_inst_rows-1)));
                $clone.find('[name="inst-value[]"]').attr("id","inst-value"+String(num_inst_rows));
				$clone.find('[name="inst-label[]"]').attr("id","inst-label"+String(num_inst_rows));
				var kids = $("#inst-row"+String(num_inst_rows)).children();
//				createSuggestionListener(num_inst_rows)
        })
        .on("click",".add-res-button",function(){
        	console.log("adding res");
        	num_res_rows++;
            var $template = $('#res-template'),
                $clone    = $template
                                .clone()
                                .removeClass('hide')
                                .removeAttr('id')
								.attr('id','res-row'+String(num_res_rows));
                $clone.insertAfter($("#res-row" + String(num_res_rows-1)));
                $clone.find('[name="res-value[]"]').attr("id","res-value"+String(num_res_rows));
				$clone.find('[name="res-label[]"]').attr("id","res-label"+String(num_res_rows));
				var kids = $("#res-row"+String(num_res_rows)).children();
//				createSuggestionListener(num_res_rows)
        })

        // Remove button click handler
        .on('click', '.remove-topic-button', function() {
            var $row    = $(this).parents('.form-group'),
                $option = $row.find('[name="topic[]"]');

            // Remove element containing the option
            $row.remove();
        })
        .on('click', '.remove-inst-button', function() {
            var $row    = $(this).parents('.form-group'),
                $option = $row.find('[name="inst-value[]"]');

            // Remove element containing the option
            $row.remove();
        })
	    .on('click', '.remove-res-button', function() {
	        var $row    = $(this).parents('.form-group'),
	            $option = $row.find('[name="res-value[]"]');

	        // Remove element containing the option
	        $row.remove();
	    });
        fillForm();
});
