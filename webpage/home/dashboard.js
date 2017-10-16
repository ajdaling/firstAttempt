var sessionData;

$(document).ready(function(){
	init();
});

function init(){
	$("#welcome-text").text("Welcome back, " + sessionData.username + "!");
	d3.select("#updates-text").selectAll("li").data(updates).enter().append("li").text(function(d){
		return(d);
	});

	createListeners();
	sessionData = JSON.parse(window.localStorage.getItem("sessionData"));
	getUsername();
	getSessions();
}

function deleteSession(id){
	var del = confirm("Delete " + id + "?");
	if(del){
		$.ajax({
			type: "GET",
			xhrFields: { withCredentials: true },
			crossDomain: true,
			url: config.dataURL+"/sessions/deleteSessionRequest.sjs",
			data: JSON.stringify({"username":sessionData.username, "id":id}),
			success: function(data){
				window.location.href = window.location.href;
			},
			error: function(data){
				alert("Error deleting " + sessionData.sessionID);
			}
		});
	}else{
		alert("Deletion of " + id + " canceled.");
	}

}
function getSessions(){
	$.ajax({
		type: "GET",
		xhrFields: { withCredentials: true },
		crossDomain: true,
		url: config.dataURL+"/sessions/getSessionsRequest.sjs",
		data: JSON.stringify({"username":sessionData.username}),
		success: function(data){
			var ret = [];
			if(Array.isArray(data)){
				ret = data;
			} else{
				ret.push(data);
			}

			// var day, month, year;
			//   var date = ret.match("[0-9]{2}(\-)[0-9]{2}[\-][0-9]{4}");
			//   if(date) {
			//       var dateSplit = date[0].split("-");
			//       day = dateSplit[0];
			//       month = dateSplit[1];
			//       year = dateSplit[2];
			//   }
			//   var hours, minutes, seconds;
			//   var time = ret.match("[0-9]{1,2}(:)[0-9]{1,2}(:)[0-9]{1,2}(:)");
			//   if(time){
			//   	var timeSplit = time[0].split(":");
			//   	hours = timeSplit[0];
			//   	minutes = timeSplit[1];
			//   	seconds = timeSplit[2];
			//   }
			//   var fullDate = new Date(year,month,day,hours,minutes,seconds,0);

			var sortedRet = [];
			var index = 0;

			while(ret.length > 0){
				var max = 0;
				while(index < ret.length){
					//console.log("ret[max].timestamp = " + ret[max].timestamp);
					//ret[max].timestamp = 2017-08-18 T  1  9:40:02.288Z
					//                     0123456789 10 11
					var maxDate = parseInt(ret[max].timestamp.substr(0,4) + ret[max].timestamp.substr(5,2) + ret[max].timestamp.substr(8,2) + ret[max].timestamp.substr(11,2) + ret[max].timestamp.substr(14,2) + ret[max].timestamp.substr(17,2));

					//console.log("maxDate = " + maxDate);

					var testDate = parseInt(ret[index].timestamp.substr(0,4) + ret[index].timestamp.substr(5,2) + ret[index].timestamp.substr(8,2) + ret[index].timestamp.substr(11,2) + ret[index].timestamp.substr(14,2) + ret[index].timestamp.substr(17,2));

					//console.log("testDate = " + testDate);
					if(maxDate < testDate){
						//console.log("maxDate < testDate");
						max = index;
					}else{
						//console.log("maxDate > testDate");
					}
					index++;
				}
				sortedRet.push(ret[max]);
				//console.log("max = " + ret[max]);
				ret.splice(max, 1);
				index = 0;
			}
			// console.log(ret[0].timestamp);
			// console.log(ret[1].timestamp);
			// console.log(ret[2].timestamp);
			//
			// var retTemp = [];
			//
			// for(i = 0; i < ret.length; i++){
			//
			//
			// retTemp.push(ret[i]);
			//
			// }
			//
			// console.log("retTemp = " + retTemp);
			// console.log("retTemp[0] = " + retTemp[0]);
			// console.log("ret = " + ret);



			//console.log("sortedRet[0].timestamp = " + sortedRet[0].timestamp);
			//console.log("sortedRet[1].timestamp = " + sortedRet[1].timestamp);
			//console.log("sortedRet[2].timestamp = " + sortedRet[2].timestamp);
			createSessionsPanel(sortedRet);
		},
		error: function(data){
			alert("error1");
		}
	});
}


$("#queryForm").on("submit",function(e){
	e.preventDefault();
	sessionData.mainQuery = $("#mainQuery").val();
	updateSessionData(sessionData);
	window.location.href = config.docMasterLink;
})
function createSessionsPanel(data){
	if(config.settings.currentSession){
		$("#resume-btn").removeAttr("disabled");
		$("#resume-btn").on("click",function(d){
			for(var i in data){
				if(d.sessionID == settings.currentSession){
					sessionData = JSON.parse(JSON.stringify(d));
					updateSessionData(sessionData);
					var redirect;
					if(sessionData.currentPage){
						redirect = sessionData.currentPage;
					} else{
						redirect = config.newSearchLink;
					}
					window.location.href=redirect;
				}
			}
		});
	}

	var sessionStack = d3.select("#dash-stack").selectAll("li").data(data).enter()
	.append("li")
	.attr("class",function(d,i){
		if(i==0){
			return("active");
		}else{
			return(null);
		}
	})
	.append("a")
	//	.attr("href",function(d,i){
	//		return("#session"+i);
	//	})
	.on("click",function(d,i){
		createSessionTabContent(i);
	})
	.attr("data-toggle","pill")
	.text(function(d){
		if(d.sessionID){
			var nam1 = d.sessionID;
			var nam2 = nam1;
			var hasDate = nam1.indexOf("(") !== -1;
			if(hasDate){
				nam2 = nam1.substring(0,nam1.indexOf("("));
			}
			return(nam2);
		} else{
			return("no title");
		}
	});
	createSessionTabContent(0);

	function createSessionTabContent(idx){
		//buttons
		$("#resume-session-btn").unbind();
		$("#resume-session-btn").on("click",function(){
			sessionData = JSON.parse(JSON.stringify(data[idx]));
			updateSessionData(sessionData);
			window.location.href = config.docMasterLink;
		});
		$("#edit-session-btn").unbind();
		$("#edit-session-btn").on("click",function(){
			sessionData = JSON.parse(JSON.stringify(data[idx]));
			updateSessionData(sessionData);
			window.location.href = config.newSearchLink;
		});
		$("#delete-session-btn").unbind();
		$("#delete-session-btn").on("click",function(){
			deleteSession(data[idx].sessionID);
		});

		d3.select("#session-tab-content").selectAll("div").remove();

		var sessionTabs = d3.select("#session-tab-content").append("div")
		.attr("id",function(d,i){
			return("session"+i);
		}).attr("class",function(d,i){
			if(i==0){
				return("tab-pane fade in active");
			}else{
				return('tab-pane fade');
			}
		});

		sessionTabs.append("div").attr("class","row").append("h4").text(function(d){
			return(data[idx].sessionID);
		}).attr("id","session-tab-title");

		var tabData = [
			{key: "Main Query", value: "mainQuery", data: data[idx].mainQuery},
			{key: "Topics", value: "topics", data: data[idx].topics},
			{key: "Organizations",value: "inst", data: [data[idx].institutions, data[idx].institutionsAdded]},
			{key: "Experts", value: "res", data: [data[idx].researchers, data[idx].researchersAdded]},
			{key: "MeSH Terms",value: "mesh", data: data[idx].meshList},
			{key: "Document Sources", value: "docType", data: data[idx].docTypes},
		];

		var sessionDataTabsUL = sessionTabs.append("div").attr("class","row")
		.append("ul").attr("class","nav nav-tabs nav-justified");
		var sessionDataTabs = sessionDataTabsUL.selectAll("li").data(tabData);
		sessionDataTabs.enter()
		.append("li").attr("class",function(d,i){
			if(i==0){
				return("active");
			}else{
				return(null);
			}
		}).append("a")
		.attr("href",function(d,i){
			return("#session-pane-"+d.value);
		})
		.text(function(d) {return(d.key);})
		.attr("data-toggle","tab");

		var sessionPanesContainer = sessionTabs.append("div").attr("class","row")
		.append("div").attr("class","tab-content");

		var sessionPanes = sessionPanesContainer.selectAll("div").data(tabData).enter()
		.append("div").attr("class",function(d,i){
			if(i == 0){
				return("tab-pane fade in active");
			}else{
				return("tab-pane fade");
			}
		}).attr("id",function(d,i){
			return("session-pane-"+d.value);
		});

		//main Query
		d3.select("#session-pane-mainQuery").append("p").text(data[idx].mainQuery);

		//topics
		if(data[idx].topics.length > 0){
			var topicTable = d3.select("#session-pane-topics")
			//			.append("div").attr("class","col-md-12")
			.append("table").attr("class","table-striped table-hover");
			topicTable.append("thead").append("tr").selectAll("th")
			.data(["Topic Label","Query Logic", "Active"]).enter()
			.append("th")
			.text(function(d){
				return(d);
			});

			topicTable.append("tbody").selectAll("th").data(function(d){
				return(d.data);
			}).enter().append("tr")
			.selectAll("td").data(function(d){
				return([d.label,d.value,d.active]);
			}).enter()
			.append("td").text(function(d){
				return(d);
			});
		} else{
			d3.select("#session-pane-topics").append("h4").text("No Topics");
		}



		//inst
		var instLeftCol = d3.select("#session-pane-inst")
		.append("div").attr("class","col-md-6");

		instLeftCol.append("h4")
		.text("Organization Groups");

		var instRightCol = d3.select("#session-pane-inst")
		.append("div").attr("class","col-md-6");

		instRightCol.append("h4")
		.text("Selected Organizations");

		if(data[idx].institutions.length > 0){
			var instGroupTable = instLeftCol.append("table").attr("class","table-striped");
			instGroupTable.append("thead").append("tr").selectAll("th")
			.data(["Group Label","Query Logic","Active"])
			.enter().append("th").text(function(d){
				return(d);
			});
			instGroupTable.append("tbody").selectAll("tr")
			.data(function(d){
				return(d.data[0]);
			}).enter().append("tr")
			.selectAll("td").data(function(d){
				return([d.label,d.value,d.active]);
			}).enter().append("td").text(function(d){
				return(d);
			});
		} else{
			instLeftCol.append("h4").text("No Organization Groups");
		}

		if(data[idx].institutionsAdded){
			if(data[idx].institutionsAdded.length > 0){
				var instTable = instRightCol.append("table");
				instTable.append("thead").append("tr").selectAll("th")
				.data(["Organization","Active"])
				.enter().append("th").text(function(d){
					return(d);
				});
				instTable.append("tbody").selectAll("tr")
				.data(function(d){
					return(d.data[1]);
				}).enter().append("tr")
				.selectAll("td").data(function(d){
					return([d.value,d.active]);
				}).enter().append("td").text(function(d){
					return(d);
				});
			}
			else{
				instRightCol.append("h4").text("No Organizations");
			}
		} else{
			instRightCol.append("h4").text("No Organizations");
		}

		//res
		var resLeftCol = d3.select("#session-pane-res")
		.append("div").attr("class","col-md-6");
		var resRightCol = d3.select("#session-pane-res")
		.append("div").attr("class","col-md-6");

		resLeftCol.append("h4")
		.text("Expert Groups");
		resRightCol.append("h4")
		.text("Selected Experts");

		if(data[idx].researchers.length > 0){
			var resGroupTable = resLeftCol.append("table");
			resGroupTable.append("thead").append("tr").selectAll("th")
			.data(["Group Label","Query Logic","Active"])
			.enter().append("th").text(function(d){
				return(d);
			});
			resGroupTable.append("tbody").selectAll("tr")
			.data(function(d){
				return(d.data[0]);
			}).enter().append("tr")
			.selectAll("td").data(function(d){
				return([d.label,d.value,d.active]);
			}).enter().append("td").text(function(d){
				return(d);
			});
		}else{
			resLeftCol.append("h4").text("No Expert Groups");
		}
		if(data[idx].researchersAdded){
			if(data[idx].researchersAdded.length > 0){
				var resTable = resRightCol.append("table");
				resTable.append("thead").append("tr").selectAll("th")
				.data(["Expert","Active"])
				.enter().append("th").text(function(d){
					return(d);
				});
				resTable.append("tbody").selectAll("tr")
				.data(function(d){
					return(d.data[1]);
				}).enter().append("tr")
				.selectAll("td").data(function(d){
					return([d.value,d.active]);
				}).enter().append("td").text(function(d){
					return(d);
				});
			}else{
				resRightCol.append("h4").text("No Experts");
			}
		} else{
			resRightCol.append("h4").text("No Experts");
		}


		//nesh
		if(data[idx].meshList.length > 0){
			var meshTable = d3.select("#session-pane-mesh").append("table");
			topicTable.append("thead").append("tr").selectAll("th")
			.data(["MeSH Term", "Active"]).enter()
			.append("th")
			.text(function(d){
				return(d);
			});

			meshTable.append("tbody").selectAll("th").data(function(d){
				return(d.data);
			}).enter().append("tr")
			.selectAll("td").data(function(d){
				return([d.label,d.active]);
			}).enter()
			.append("td").text(function(d){
				return(d);
			});
		} else{
			d3.select("#session-pane-mesh").append("h4").text("No MeSH Terms");
		}

		//docType
		var typeTable = d3.select("#session-pane-docType").append("table");
		typeTable.append("thead").append("tr").selectAll("th")
		.data(["Document Source", "Active"]).enter()
		.append("th")
		.text(function(d){
			return(d);
		});

		typeTable.append("tbody").selectAll("th").data(function(d){
			return(d.data);
		}).enter().append("tr")
		.selectAll("td").data(function(d){
			return([d.label,d.active]);
		}).enter()
		.append("td").text(function(d){
			return(d);
		});

	}
}

//	var buttonRow = sessionPanelBodies.append("div").attr("class","row").style("margin-top","-55px");
//	var sessionButtons = buttonRow.append("div").attr("class","btn btn-success btn-small sessionButton").text("Resume");
//	sessionButtons.on("click",function(d){
//		sessionData = JSON.parse(JSON.stringify(d));
//		updateSessionData(sessionData);
//		var redirect;
//		if(sessionData.currentPage){
//			redirect = sessionData.currentPage;
//		} else{
//			redirect = config.newSearchLink;
//		}
//		window.location.href=redirect;
//	})
//
//	var deleteButton = buttonRow.append("div").attr("class","btn btn-danger btn-small sessionButton").attr("style","float:right").attr("id","temp").text("Delete");
//	deleteButton.on("click",function(d){
//		console.log("clicked to delete");
//		console.log(d.sessionID);
//		deleteSession(d.sessionID);
//	})
//
//	//first panel body row
//	var row1 = sessionPanelBodies.append("div").attr("class","row");
//
//	var mainCol = row1.append("div").attr("class","col-lg-12 well");
//	//first column
//	var mainTable = mainCol.append("table").attr("class","table-hover").style("width","100%").style("margin-top","-5px");
//
//	mainTable.append("tbody")
//	.selectAll("tr").data(function(d){
//		var arr = [];
//		arr.push(["Title: ",d.searchName]);
//		arr.push(["Year Range: ",String(d.start_year) + " - " + String(d.end_year)]);
//		arr.push(["Main Query: ", d.mainQuery]);
//		arr.push(["TimeStamp: ", d.timestamp]);
//		return(arr);
//	}).enter().append("tr").selectAll("td").data(function(d){
//		return(d);
//	}).enter().append("td").text(function(d){
//		return(d);
//	});
//
//	var row2 = sessionPanelBodies.append("div").attr("class","row").style("background-color", "#fff");
//
//	//topics table
//	var col1 = row2.append("div").attr("class","col-xs-6 well pull-left");
//	var topicTable = col1.append("table").attr("class","table-hover").style("width","100%");
//	//thead
//	topicTable.append("thead").attr("class","thead-inverse").append("tr").selectAll("td").data(function(){
//		return(["Topic Label","Topics"]);
//	}).enter().append("td").text(function(d){
//		return(d);
//	})
//	//tbody
//	topicTable.append("tbody").selectAll("tr").data(function(d){
//		var ret = [];
//		for(var i in d.topics){
//			ret.push([d.topics[i].label,d.topics[i].topic]);
//		}
//		return(ret);
//	}).enter().append("tr").selectAll("td").data(function(d){
//		return(d);
//	}).enter().append("td").text(function(d){
//		return(d);
//	})
//
//	//inst table
//	var col2 = row2.append("div").attr("class","col-xs-6 well pull-right");
//	var instTable = col2.append("table").attr("class","table-hover").style("width","100%");
//	//thead
//	instTable.append("thead").attr("class","thead-inverse").append("tr").selectAll("td").data(function(){
//		return(["Instution Group Name","Institutions"]);
//	}).enter().append("td").text(function(d){
//		return(d);
//	})
//	//tbody
//	instTable.append("tbody").selectAll("tr").data(function(d){
//		var ret = [];
//		for(var i in d.institutions){
//			ret.push([ d.institutions[i].label , d.institutions[i].value]);
//		}
//		return(ret);
//	}).enter().append("tr").selectAll("td").data(function(d){
//		return(d);
//	}).enter().append("td").text(function(d){
//		return(d);
//	})
//
//}

//function createSessionsPanel2(data){
//
//	var sessionPanels = d3.select("#sessions-accordion").selectAll("div").data(function(){
//
//		console.log(data2);
//		var data2 = JSON.parse(JSON.stringify(data));
//		delete data2.institutions;
//		delete data2.numTopics;
//		delete data2.numInst;
//		return(data2);
//		}).enter()
//		.append("div").attr("class","panel panel-default");
//
//	sessionPanels.append("div").attr("class","panel-heading")
//		.append("h4").attr("class","panel-title")
//		.append("a").attr("data-toggle","collapse").attr("aria-expanded",false).attr("data-parent","#sessions-accordion").attr("href",function(d,i){
//			return("#collapse"+String(i));
//		}).text(function(d,i){
//			if(d.searchName){
//				return(d.searchName);
//			} else{
//				return("no title");
//			}
//		});
//
//	var sessionPanelBodies = sessionPanels.append("div").attr("class","panel-collapse collapse in").attr("id",function(d,i){
//		return("collapse"+String(i));
//	}).append("div").attr("class","panel-body");
//
//	var sessionButtons = sessionPanelBodies.append("div").attr("class","btn btn-success btn-small sessionButton").text("Resume");
//	sessionButtons.on("click",function(d){
//		sessionData = JSON.parse(JSON.stringify(d));
//		updateSessionData(sessionData);
//		var redirect;
//		if(sessionData.currentPage){
//			redirect = sessionData.currentPage;
//		} else{
//			redirect = config.newSearchLink;
//		}
//		window.location.href=redirect;
//	})
//
//	var deleteButton = sessionPanelBodies.append("div").attr("class","btn btn-danger btn-small sessionButton").attr("style","float:right").attr("id","temp").text("Delete");
//	deleteButton.on("click",function(d){
////		alert("deleting: " + sessionData.sessionID);
//		console.log(d);
//		deleteSession(d.sessionID);
//	})
//
//	sessionPanelBodies.append("table").attr("class","table").append("tbody")
//	.selectAll("tr").data(function(d){
//		var retArr = [];
//		var obj = JSON.parse(JSON.stringify(d));
//		for(var key in obj){
//			var tmpArr = [];
//			tmpArr.push(key);
//			tmpArr.push(d[key]);
//			retArr.push(tmpArr);
//		}
//
//		return(retArr);
//	}).enter().append("tr").selectAll("td").data(function(d){
//		if(d[0] == "username"){
//			d[1] = "";
//		}
//		if(d[0] == "mainQuery"){
//			d[0] = "Main Query";
//		}
//		if(d[0] == "institution"){
//			d[0] = "Institution";
//
//			if(d[1].charAt(d[1].length - 1) == ';'){
//				d[1] = d[1].substring(0, d[1].length - 1);
//var newInst = "";
//				for (i = 0; i <= d[1].length; i++) {
//    			if(d[1].charAt(i) == ';'){
//						newInst += ", ";
//					}else{
//						newInst += d[1].charAt(i);
//					}
//				}
//
//				d[1] = newInst;
//			}
//
//		}
//		if(d[0] == "institutions") d[1] = "";
//		if(d[0] == "researcher"){
//			d[0] = "Researcher";
//		}
//		if(d[0] == "topicQuery"){
//			d[0] = "Topic Query";
//		}
//		if(d[0].substring(0, 5) == "label"){
//			var topicNum = d[0].substring(5, d[0].length);
//			d[0] = "Topic #" + topicNum;
//
//		}
//
//		if(d[0] == "start_year"){
//			d[0] = "Start Year";
//		}
//		if(d[0] == "end_year"){
//			d[0] = "End Year";
//		}
//		if(d[0].substring(0, 5) == "topic"){
//			d[1] = "";
//		}
//
//		if(d[0] == "searchName"){
//			d[1] = "";
//		}
//
//		if(d[0] == "vizData"){
//			d[1] = "";
//		}
//		if(d[0] == "instData"){
//			d[1] = "";
//		}
//
//		if(d[0].substring(d[0].length - 5, d[0].length)  == "value" && d[0].substring(0, 5) ==  "facet"){
//
//			var facetNum = d[0].substring(5, 6);
//			d[0] = "Facet #" + facetNum;
//
//		}
//
//		if(d[0].substring(d[0].length - 4, d[0].length)  == "type" && d[0].substring(0, 5) ==  "facet"){
//d[1] = "";
//		}
//
//
//
//		if(d[1] !== ""  && d[0] !== "repData" && d[0] !== "sessionID"
//	/* && d[0].substring(0, 5) != "topic" && d[0].substring(d[0].length - 4, d[0].length) != "type"*/
//){
//			return(d);
//		}else{
//			return(d[1]);
//		}
//
//
//	}).enter().append("td").text(function(d){
//		return(d);
//	});
//
//}

$("#menu-toggle").click(function(e) {
	e.preventDefault();
	$("#wrapper").toggleClass("active");
});

function createListeners(){
	$("#close-jumbo").on("click",function(){
		$("#jumbo-dash").remove();
	});
	$("#close-version-row").on("click",function(){
		$("#version-row").remove();
	})
}
