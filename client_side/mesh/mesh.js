var sessionData = getSessionData();
getFacets();

if(sessionData.mainQuery){
	$("#mainQuery").val(sessionData.mainQuery);
	getEstimate();
}
$("#mainQuery").on("change",function(){
	console.log("changed");
	sessionData.mainQuery = $("#mainQuery").val();
	updateSessionData(sessionData);
	getEstimate();
})
$("#refresh-btn").on("click",function(){
	getFacets();
})
function getFacets() {
	var allMesh;
	  var ajaxParams = JSON.parse(JSON.stringify(sessionData));
	  if(ajaxParams.repData) delete ajaxParams.repData;
	    $.ajax({
	      type: "GET",
	      xhrFields: {
	        withCredentials: true
	      },
	      crossDomain: true,
	      url: config.dataURL + "/mesh/allMesh.sjs",
	      data: JSON.stringify(ajaxParams),
	      dataType: 'json',
	      success: function(data) {
	    	  console.log(data);
	    	  allMesh = data.facets.meshterms;
	    	  console.log(allMesh);
	    	  createAllMeshList(allMesh);
	      }
	    })
	}

function createAllMeshList(allMesh){
	d3.select("#all-mesh-list").selectAll("li").remove();
	var meshArr = [];
	Object.keys(allMesh).forEach(function(key){
		var tmp = ""+key+" : " +allMesh[key];
		meshArr.push(tmp);
	});
	console.log(meshArr);
	
	d3.select("#all-mesh-list").selectAll("li").data(meshArr).enter()
	.append("li").text(function(d){
		return(d);
	});
}

function getEstimate(){
	console.log("estimating");
	var ajaxParams = JSON.parse(JSON.stringify(sessionData));
	if (ajaxParams.repData) delete ajaxParams.repData;
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