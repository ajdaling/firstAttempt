var sessionData = getSessionData();
var oTable;
var first = true;
var results;
var drewTable = false;

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
	createListeners();
	drawDataTable(getFacets);
}

function drawDataTable(dt_callback){
		if(oTable != undefined){
//			oTable.fnClearTable();
//			oTable.fnDraw();//reset
		}
		//$("#dt-panel").append("<table id = 'dt1'></div><thead><tr><th>Year</th><th>Source</th><th>Organizations</th><th>Experts</th><th>Title</th></tr></thead><tfoot><tr><th>Year</th><th>Source</th><th>Organizations</th><th>Experts</th><th>Title</th></tr></tfoot></table>")
		$("#dt-panel").append("<table id = 'dt1'></div><thead><tr><th>Score</th><th>Year</th><th>Source</th><th>Organizations</th><th>Experts</th><th>Title</th><th>Abstract</th></tr></thead><tfoot><tr><th>Score</th><th>Year</th><th>Source</th><th>Organizations</th><th>Experts</th><th>Title</th><th>Abstract</th></tr></tfoot></table>")

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
		      url: config.dataURL+"/docMaster/datatables.sjs",
		      data: {params: JSON.stringify(sessionData)},

		},
	    "scrollY": '60vh',
	    "scrollX": false,
		"order": [[ 0, "desc" ]],
	    "scrollCollapse": true,
	    "columnDefs": [
		{
            "bVisible": false,
            "aTargets": [6]
          },
		 {
			 "render": function ( data, type, row ) {
//				 data = data.replace(";","");
//				 data = data.replace(",","");
				 var odata = data;
				 //data = data.toLowerCase();
				 data = capitalize(data);
                 return '<a onclick="clickInst(this,event)" id="'+odata+'" href="#">'+data.substr(0,50)+"..."+'</a>';
			 },
			 "targets": 3
		 },
	    {
	    	targets: 5,
			width: "40%",
	    	render: function(data,type,row){
	    		return '<a onclick = "clickDoc(this,event)" class = "'+row[8]+'" id = "'+row[7]+'" href="#" target="_blank">' + data + '</a>';
	    	}
	    },
		{
			targets: 6,
			width: "40%",
		},
	    {
	    	targets: [4],
	    	render: function(data){
	    	    var ret_str = "";
	    	    for(var i in data){
	    	    	ret_str += '<a onclick="clickRes(this,event)" id="'+ data[i] +'" href="#">'+data[i]+'</a>'
	    	    }
	    		return(ret_str);
	    	},
	    },
	    ],
	    dom: 'l<"toolbar">Bfrtip',
        buttons: [
            'colvis','copy', 'csv', 'excel', 'pdf', 'print'
        ]
	  });
	  $("div.card__title").html('<b>Document Results</b>');
//	}

	dt_callback();
}

function reQuery(requery_callback){
	console.log("Requerying");
	oTable.destroy();
	d3.select("#dt1").remove();
	requery_callback();
}

function reDraw(){
	drawDataTable(getFacets);
}

function getFacets(callback2){
	//ajax for insts, reses, docOrigin, mesh
	var ajaxParams = JSON.parse(JSON.stringify(sessionData));
	if(ajaxParams.repData) delete ajaxParams.repData;
	var ret_facets;
    $.ajax({
      type: "GET",

      crossDomain: true,
      xhrFields: {
    	  withCredentials: true,
      },
      url: config.dataURL+"/filters/facet.sjs",
      data: JSON.stringify(ajaxParams),

      success: function(data){
    	  console.log(data);
        ret_facets = data.facets;
        createResFacetTable(ret_facets);
        createInstitutionFacetTable(ret_facets);
        createMeshFacetTable(ret_facets);
      }
    });

    //ajax for topics
    if(sessionData.topics){
		$.ajax({
		      method : "GET",
		      crossDomain: true,
		      //contentType: "application/json; charset=UTF-8",
		      xhrFields: {
		    	  withCredentials: true,
		      },
//		      dataType: 'text',
		      url: config.dataURL+"/filters/getTopicEstimates.sjs",
		      data: JSON.stringify(ajaxParams),
//		      data: sessionData,
		      success: function(data){
		    	  var topicEstimates = data;
		    	  createTopicFacetTable(topicEstimates);
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
	      success: function(data){
	    	  console.log(data);
	    	  createDocOriginFacetTable(data);
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
		      success: function(data){
		    	  createInstGroupFacetTable(data);
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
		      success: function(data){
		    	  createResGroupFacetTable(data);
		      },
		});
    }
}

function createFacetTables(facets){
	getTopicEstimates();
	createInstitutionFacetTable(facets);
	createDocOriginFacetTable(facets);
	createMeshFacetTable(facets);
	createResFacetTable(facets);
	first = false;
}

function createTopicFacetTable(topicEstimates){
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
	.on("click",function(d){
		//figure out if all topics are active
		var allOn = true;
		for(var i in sessionData.topics){
			if(!sessionData.topics[i].active){
				allOn = false;
				break;
			}
		}
		if(allOn){
			//deactivate all but selected
			sessionData.topics.forEach(function(top){
				if(d[0] !== top.label) top.active = false;
			});
		} else{
			//toggle selected
			for(var i in sessionData.topics){
				if(sessionData.topics[i].label == d[0]){
					sessionData.topics[i].active = !(sessionData.topics[i].active);
					break;
				}
			}
		}
		updateSessionData(sessionData);
		reQuery(reDraw);
	})
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

	//deactivate all rows
	$("#topicFacetTable > tr").removeClass("active");

	//activate row if applicable
	sessionData.topics.forEach(function(top){
		if(top.active){
			$("#topicFacetTable > tr > td").filter(function(){
				return( $(this).text() == top.label);
			}).closest("tr").addClass("active");
		} else{
			$("#topicFacetTable > tr > td").filter(function(){
				return($(this).text() == top.label);
			}).closest("tr").removeClass("active");
		}
	});
}

function createInstitutionFacetTable(facets){
	console.log("creating inst facet table");
	var institutionFacetTableRows = d3.select('#instFacetTable')
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
	.on("click",function(d){
		/*
		 * When a specific inst is clicked:
		 * 1. Check if it is active
		 *   If not active:
		 *   2. Add to sessionData or reactivate
		 *   If active:
		 *   2. Deactivate in sessionData
		 * 3. reQuery
		 * 4. Activate/deactivate correct rows (outside of click listener and after requery)
		 */
		var thisInst = d[0];
		var isActive = $(this).hasClass("active");
		if(!isActive){
			var thisIdx = -1;
			//check if in sessionData already
			for(var i in sessionData.institutionsAdded){
				if(sessionData.institutionsAdded[i].label == thisInst){
					thisIdx = i;
				}
			}
			//1. add to sessionData or reactivate
			if(thisIdx == -1){
				var currIndex = sessionData.institutionsAdded.length;
				sessionData.institutionsAdded.push({label:thisInst,value:thisInst,active:true,index:currIndex});
			} else{
				sessionData.institutionsAdded[thisIdx].active = true;
			}
			updateSessionData(sessionData);
		}
		else{
			//2. deactivate
			for(var i in sessionData.institutionsAdded){
				if(sessionData.institutionsAdded[i].label == thisInst){
					sessionData.institutionsAdded[i].active = false;
					break;
				}
			}
		}
		//3. Requery
		reQuery(reDraw);
	})
	.selectAll("td").data(function(d){
		return(d);
	}).enter().append("td")
	.text(function(d){
		return(d);
	});


	//Exit Rows
	institutionFacetTableRows.exit().remove();

	var institutionFacetTableCells = institutionFacetTableRows.selectAll("td")
	.data(function(d){
		return(d);
	}).text(function(d){
		return(d);
	});
	/*
	 * Exit Cells
	 */
	institutionFacetTableCells.exit().remove();
	/**
	 * 4. Activate applicable rows
	 */
	//deactivate all rows
	$("#instFacetTable > tr").removeClass("active");

	//activate row if applicable
	sessionData.institutionsAdded.forEach(function(thisInst){
		if(thisInst.active){
			$("#instFacetTable > tr > td").filter(function(){
				return( $(this).text() == thisInst.label);
			}).closest("tr").addClass("active");
		} else{
			$("#instFacetTable > tr > td").filter(function(){
				return($(this).text() == thisInst.label);
			}).closest("tr").removeClass("active");
		}
	});
}

function createInstGroupFacetTable(facets){
	console.log("creating inst group facet table");
	console.log("********");
	var institutionFacetTableRows = d3.select('#instGroupFacetTable')
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
		console.log(ret_arr);
		return(ret_arr);
	});

	//Enter
	institutionFacetTableRows.enter().append('tr')
	.on("click",function(d){
		var allOn = true;
		sessionData.institutions.forEach(function(inst){
			if(!inst.active){
				allOn = false;
			}
		});

		var thisInst = d[0];
		var thisIdx = -1;
		for(var i in sessionData.institutions){
			if(sessionData.institutions[i].label == thisInst){
				thisIdx = i;
			}
		}
		if(allOn){
			sessionData.institutions.forEach(function(inst){
				if(inst.label !== thisInst){
					inst.active = false;
				}
			})
		} else{
			if(!($(this).hasClass('active'))){
				sessionData.institutions[thisIdx].active = true;
			} else{
				// 3. set all insts to active
				sessionData.institutions[thisIdx].active = false;
			}
		}
		updateSessionData(sessionData);
		reQuery(reDraw);
	})
	.selectAll("td").data(function(d){
		return(d);
	}).enter().append("td")
	.text(function(d){
		return(d);
	});
	//Exit Rows
	institutionFacetTableRows.exit().remove();
	var institutionFacetTableCells = institutionFacetTableRows.selectAll("td")
	.data(function(d){
		return(d);
	}).text(function(d){
		return(d);
	});
	/*
	 * Exit Cells
	 */
	institutionFacetTableCells.exit().remove();
	/**
	 * Activate applicable rows
	 */
	//deactivate all rows
	$("#instGroupFacetTable > tr").removeClass("active");

	//activate row if applicable
	sessionData.institutions.forEach(function(thisInst){
		if(thisInst.active){
			$("#instGroupFacetTable > tr > td").filter(function(){
				return($(this).text() == thisInst.label);
			}).closest("tr").addClass('active');
		}
	});
}

function createDocOriginFacetTable(facets){
	console.log("Creating doc origin facet table");
	var docOriginFacetTableRows;
	var docOriginFacetTableCells;

	var docOriginFacetTableRows = d3.select('#docOriginFacetTable')
	.selectAll("tr")
	.data(function(){
		var ret_arr = [];
		sessionData.docTypes.forEach(function(typ){
			var orgn = typ.label;
			var docs = 0;
			if(facets.docOrigin[orgn]) docs=facets.docOrigin[orgn];
			ret_arr.push([orgn,docs]);
		});
		ret_arr.sort(function(a,b){
			return(b[1] - a[1]);
		});
		return(ret_arr);
	});

	//Enter
	docOriginFacetTableRows.enter().append('tr')
	.on("click",function(d){
		/** Here, we want to allow for multiple docTypes to be selected.
		 * So,
		 *
		 * -Toggle selected docType in sessionData
		 *
		 *
		 * Final: reQuery(), toggle active rows
		 */
		var allOn = true;
		for(var i in sessionData.docTypes){
			if(!sessionData.docTypes[i].active){
				allOn = false;
				break;
			}
		}
		var thisType = d[0];
		if(allOn){
			sessionData.docTypes.forEach(function(typ){
				if(typ.label !== thisType){
					typ.active = false;
				}
			})
		} else{
			sessionData.docTypes.forEach(function(typ){
				if(typ.label == thisType){
					typ.active = !(typ.active); //toggle
				}
			});
		}
		updateSessionData(sessionData);
		reQuery(reDraw);
	})
	.selectAll("td").data(function(d){
		return(d);
	}).enter().append("td").text(function(d){
		return(d);
	})
	;

	//Exit
	docOriginFacetTableRows.exit().remove();

	var docOriginFacetTableCells = docOriginFacetTableRows.selectAll("td")
	.data(function(d){
		return(d);
	}).text(function(d){
		return(d);
	});


	//toggle all rows
	$("#docOriginFacetTable > tr").removeClass("active");
	sessionData.docTypes.forEach(function(typ){
		if(typ.active){
			var thisType = typ.label;
			$("#docOriginFacetTable > tr > td").filter(function(){
				return($(this).text() == thisType);
			}).closest("tr").addClass("active");
		}
	});
	docOriginFacetTableCells.exit().remove();
}

function createMeshFacetTable(facets){
	console.log("creating mesh facet table");
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
	.on("click",function(d){
		/*
		 * When a specific mesh is clicked:
		 * 1. Check if it is active
		 *   If not active:
		 *   2. Add to sessionData or reactivate
		 *   If active:
		 *   2. Deactivate in sessionData
		 * 3. reQuery
		 * 4. Activate/deactivate correct rows (outside of click listener and after requery)
		 */
		var thisMesh = d[0];
		var isActive = $(this).hasClass("active");
		if(!isActive){
			var thisIdx = -1;
			//check if in sessionData already
			for(var i in sessionData.meshList){
				if(sessionData.meshList[i].label == thisMesh){
					thisIdx = i;
				}
			}
			//1. add to sessionData or reactivate
			if(thisIdx == -1){
				var currIndex = sessionData.meshList.length;
				sessionData.meshList.push({label:thisMesh,value:thisMesh,active:true,index:currIndex});
			} else{
				sessionData.meshList[thisIdx].active = true;
			}
			updateSessionData(sessionData);
		}
		else{
			//2. deactivate
			for(var i in sessionData.meshList){
				if(sessionData.meshList[i].label == thisMesh){
					sessionData.meshList[i].active = false;
					break;
				}
			}
		}
		//3. Requery
		reQuery(reDraw);
	})
	.selectAll("td").data(function(d){
		return(d);
	}).enter().append("td")
	.text(function(d){
		return(d);
	});

	//Exit Rows
	meshFacetTableRows.exit().remove();

	var meshFacetTableCells = meshFacetTableRows.selectAll("td")
	.data(function(d){
		return(d);
	}).text(function(d){
		return(d);
	});
	/*
	 * Exit Cells
	 */
	meshFacetTableCells.exit().remove();
	/**
	 * 4. Activate applicable rows
	 */
	//deactivate all rows
	$("#meshFacetTable > tr").removeClass("active");

	//activate row if applicable
	sessionData.meshList.forEach(function(thisMesh){
		if(thisMesh.active){
			$("#meshFacetTable > tr > td").filter(function(){
				return( $(this).text() == thisMesh.label);
			}).closest("tr").addClass("active");
		} else{
			$("#meshFacetTable > tr > td").filter(function(){
				return($(this).text() == thisMesh.label);
			}).closest("tr").removeClass("active");
		}
	});
}

//function createMeshFacetTable(facets){
//
//	var meshFacetTableRows = d3.select('#meshFacetTable')
//	.selectAll("tr")
//	.data(function(){
//		var ret_arr = [];
//		for(var mesh in facets.meshterms){
//			var temp_arr = [];
//			temp_arr.push(mesh);
//			temp_arr.push(facets.meshterms[mesh]);
//			ret_arr.push(temp_arr);
//		}
//		ret_arr.sort(function(a,b){
//			return(b[1] - a[1]);
//		});
//		return(ret_arr);
//	});
//
//	//Enter
//	meshFacetTableRows.enter().append('tr')
//	.selectAll("td").data(function(d){
//		return(d);
//	}).enter().append("td").text(function(d){
//		return(d);
//	});
//
//	//Exit
//	meshFacetTableRows.exit().remove();
//
//	var meshFacetTableCells = meshFacetTableRows.selectAll("td")
//	.data(function(d){
//		return(d);
//	}).text(function(d){
//		return(d);
//	});
//
//
//	meshFacetTableCells.exit().remove();
//
////	if(first){
////		$(document).on("click","#meshFacetTable > tr",function(d){
////			var mesh = $(this).closest('tr').find('td:nth-child(1)').text();
////			var docs = $(this).closest('tr').find('td:nth-child(2)').text();
////			if($(this).hasClass('active')){
////				for(var i in sessionData.mainFacets){
////					if(sessionData.mainFacets[i].value == mesh){
////						delete[sessionData.mainFacets[i]];
////					}
////				}
////			} else{
////				sessionData.mainFacets.push({"type":"mesh","value":mesh})
////			}
////			$(this).toggleClass("active");
////		})
////	}
//}

function createResFacetTable(facets){
	console.log("creating res facet table");
	var researcherFacetTableRows = d3.select('#resFacetTable')
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
	researcherFacetTableRows.enter().append('tr')
	.on("click",function(d){
		/*
		 * When a specific res is clicked:
		 * 1. Check if it is active
		 *   If not active:
		 *   2. Add to sessionData or reactivate
		 *   If active:
		 *   2. Deactivate in sessionData
		 * 3. reQuery
		 * 4. Activate/deactivate correct rows (outside of click listener and after requery)
		 */
		var thisRes = d[0];
		var isActive = $(this).hasClass("active");
		if(!isActive){
			var thisIdx = -1;
			//check if in sessionData already
			for(var i in sessionData.researchersAdded){
				if(sessionData.researchersAdded[i].label == thisRes){
					thisIdx = i;
				}
			}
			//1. add to sessionData or reactivate
			if(thisIdx == -1){
				var currIndex = sessionData.researchersAdded.length;
				sessionData.researchersAdded.push({label:thisRes,value:thisRes,active:true,index:currIndex});
			} else{
				sessionData.researchersAdded[thisIdx].active = true;
			}
			updateSessionData(sessionData);
		}
		else{
			//2. deactivate
			for(var i in sessionData.researchersAdded){
				if(sessionData.researchersAdded[i].label == thisRes){
					sessionData.researchersAdded[i].active = false;
					break;
				}
			}
		}
		//3. Requery
		reQuery(reDraw);
	})
	.selectAll("td").data(function(d){
		return(d);
	}).enter().append("td")
	.text(function(d){
		return(d);
	});

	//Exit Rows
	researcherFacetTableRows.exit().remove();

	var researcherFacetTableCells = researcherFacetTableRows.selectAll("td")
	.data(function(d){
		return(d);
	}).text(function(d){
		return(d);
	});
	/*
	 * Exit Cells
	 */
	researcherFacetTableCells.exit().remove();
	/**
	 * 4. Activate applicable rows
	 */
	//deactivate all rows
	$("#resFacetTable > tr").removeClass("active");

	//activate row if applicable
	sessionData.researchersAdded.forEach(function(thisRes){
		if(thisRes.active){
			$("#resFacetTable > tr > td").filter(function(){
				return( $(this).text() == thisRes.label);
			}).closest("tr").addClass("active");
		} else{
			$("#resFacetTable > tr > td").filter(function(){
				return($(this).text() == thisRes.label);
			}).closest("tr").removeClass("active");
		}
	});
}

function createResGroupFacetTable(facets){
	console.log("creating res group facet table");
	console.log("********");
	var researcherFacetTableRows = d3.select('#resGroupFacetTable')
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
		console.log(ret_arr);
		return(ret_arr);
	});

	//Enter
	researcherFacetTableRows.enter().append('tr')
	.on("click",function(d){
		var allOn = true;
		for(var i in sessionData.researchers){
			if(!sessionData.researchers[i].active){
				allOn = false;
				break;
			}
		}

		var thisRes = d[0];
		var thisIdx = -1;
		for(var i in sessionData.researchers){
			if(sessionData.researchers[i].label == thisRes){
				thisIdx = i;
			}
		}
		if(allOn){
			sessionData.researchers.forEach(function(res){
				if(res.label !== thisRes){
					res.active = false;
				}
			})
		} else{
			if(!($(this).hasClass('active'))){
				sessionData.researchers[thisIdx].active = true;
			} else{
				sessionData.researchers[thisIdx].active = false;
			}
		}
		updateSessionData(sessionData);
		reQuery(reDraw);
	})
	.selectAll("td").data(function(d){
		return(d);
	}).enter().append("td")
	.text(function(d){
		return(d);
	});
	//Exit Rows
	researcherFacetTableRows.exit().remove();
	var researcherFacetTableCells = researcherFacetTableRows.selectAll("td")
	.data(function(d){
		return(d);
	}).text(function(d){
		return(d);
	});
	/*
	 * Exit Cells
	 */
	researcherFacetTableCells.exit().remove();
	/**
	 * Activate applicable rows
	 */
	//deactivate all rows
	$("#resGroupFacetTable > tr").removeClass("active");

	//activate row if applicable
	sessionData.researchers.forEach(function(thisRes){
		if(thisRes.active){
			$("#resGroupFacetTable > tr > td").filter(function(){
				return($(this).text() == thisRes.label);
			}).closest("tr").addClass('active');
		}
	});
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
		today = mm+'/'+dd+'/'+yyyy;


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


		if (searchName === null || searchName === "") {
       searchName = today + " (" + formattedTime + ")";
    }

		sessionData.searchName = searchName;
		sessionData.sessionID = Math.ceil(Math.random()*1000000);
		sessionData.time = today;
		var ajaxParams = JSON.parse(JSON.stringify(sessionData));
		if(ajaxParams.repData) delete ajaxParams.repData;
		$.ajax({
			url: config.dataURL+"/sessions/saveSessionRequest.sjs",
			type: "GET",
			xhrFields: { withCredentials: true },
			contentType: "application/json",
		    crossDomain: true,
		    data: JSON.stringify(ajaxParams),
			success: function(retdata){
				alert("saved");
			},
			error: function() {
				alert("error");
			}
		});
	});

	$("#toggle-all-btn").on("click",function(){
		//figure out which tab is open
		var el = $("#filter-nav .active").attr("value");
		switch(el){
		case "topicTab":
			if(sessionData.topics.length > 0){
				var on = !sessionData.topics[0].active;
				sessionData.topics.forEach(function(top){
					top.active = on;
				});
			}
			break;
		case "docTypeTab":
			var on = !sessionData.docTypes[0].active;
			sessionData.docTypes.forEach(function(typ){
				typ.active = on;
			});
			break;
		case "instGroupTab":
			if(sessionData.institutions.length > 0){
				var on = !sessionData.institutions[0].active;
				sessionData.institutions.forEach(function(inst){
					inst.active = on;
				});
			}
			break;
		case "resGroupTab":
			if(sessionData.researchers.length > 0){
				var on = !sessionData.researchers[0].active;
				sessionData.researchers.forEach(function(res){
					res.active = on;
				});
			}
		}
		updateSessionData(sessionData);
		reQuery(reDraw);
	})


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
