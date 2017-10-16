var effect = "slide";
var levels = ["Basic","Friendly","Advanced"];
var qwLevel = "Friendly";
var qwModes = {
	CI:{key:"CI",value:"Competetive Intelligence and Strategy",active:true},
	RD:{key:"RD",value:"Research and Development",active:true},
	MA:{key:"MA",value:"Merger and Acquisition",active:true},
	IP:{key:"IP",value:"Intellectual Property",active:true}
};
var options = {direction:"left"}
var progress = 1;
var qwFirst = true;

$("#qw-btn").on("click",function(){
	if(qwFirst){
		$("#qw-modal").modal("show");
		qwFirst = false;
		startQueryWizard();
	}else{
		resumeQueryWizard();
	}
})


$.ajax({
	type: "GET",
	xhrFields: { withCredentials: true },
    crossDomain: true,
	url: config.dataURL+"/lib/post.sjs",
	data: JSON.stringify(sessionData),
	success: function(data){
		$("#res").text(data);
	},
	error: function(data){
		alert("get username failed.");
	}
});



function startQueryWizard(){
	$("#qw-title").text("Step 1: Start Your Query");
	$("#qw-advance").on("click",function(){
		//remove buttons
		d3.select("#qw-footer").selectAll("button").remove();
		//create back button
		d3.select("#qw-footer").append("button").attr("id","qw-back")
		.attr("type","button")
		.attr("class","btn btn-danger pull-left")
		.text("Back");
		
		//create advance button
		d3.select("#qw-footer").append("button").attr("id","qw-advance")
		.attr("type","button")
		.attr("class","btn btn-success pull-right")
		.text("Next");
		
		//get query level (radios)
		var levelRes = $("#level-form").serialize().split("=");
		qwLevel = levelRes[1];
		
		//get modes (checkboxes)
		var modeRes = $("#mode-form").serialize().split("&");
		//set all modes to false
		Object.keys(qwModes).forEach(function(key){
			qwModes[key].active = false;
		});
		//get checked modes and set active to true
		for(var i in modeRes){
			var mod = modeRes[i].split("=")[1];
			qwModes[mod].active=true;
		}
		//show level buttons
		$("#qw-level-group").toggle();
		qwAdvance("mainQuery","start");
	})
	$(".qw-level-button").on("click",function(){
		$(this).addClass("active").siblings().removeClass("active");
		qwLevel = $(this).text();
	})
	
	var btnRow = d3.select("#qw-body").append("div").attr("class","row");
	
}

function resumeQueryWizard(){
	$("#qw-modal").modal("show");
}

function qwProgressBar(){
	$("#qw-progress").css("width",String(progress)+"%").attr("aria-valuenow",String(progress)).text(String(progress)+"%");
}

function qwAdvance(step,previous){
	switch(step){
	case "mainQuery":
		console.log("main Query");
		//create button listeners
		$("#qw-back").on('click',function(){
			startQueryWizard();
		});
		qwMainQuery();
		break;
	case "inst":
		qwInst();
	default:
		console.log("default");
	}
	
}
function qwInst(){
	
}
function qwMainQuery(){
	//change heading
	qwTitle("Step 2. Main Query Terms");
	//update progress bar
	progress = 10;
	qwProgressBar();
	//create listeners
	$(".qw-level-button").on("click",function(){
		console.log("recreating body");
		createBody();
	});
	
	
	
	createBody();
	
	function createBody(){
		switch(qwLevel){
		case "Friendly":
			createMainBodyFriendly();
			break;
		case "Basic":
			createMainBodyBasic();
			break;
		case "Advanced":
			createMainBodyAdvanced();
			break;
		}
	}
	
	function createMainBodyBasic(){
		//basic
		//clear body content
		d3.select("#qw-body").selectAll("div").remove();
		//create content
		d3.select("#qw-body").append("div").attr("class","row").append("h3").text("Here, you will add the 'main query' conditions. These conditions apply to words or phrases that can exist anywhere in the document. A sample set of conditions is provided.")
		var row1 = d3.select("#qw-body").append("div").attr("class","row");
		var yearCol = row1.append("div").attr("class","col-lg-6");
		var yearWell = yearCol.append("div").attr("class","well");
		yearWell.append("div").attr("class","row").append("h4").text("Select the range of years you would like to include in your search.");
		yearWell.append("div").attr("class","row").style("text-align","center").append("input").attr("id","qw-year-slider").attr("type","text");
		yearWell.append("div").attr("class","row").append("h5").attr("id","qw-year-label");
		createQWYearSlider();
		
		var docTypeCol = row1.append("div").attr("class","col-lg-6");
		var docTypeWell = docTypeCol.append("div").attr("class"," well");
		var dtRow = docTypeWell.append("div").attr("class","row");
		dtRow.append("h4").text("Select the sources of data you would like to include");
		dtRow.append("ul").attr("id","qw-docOrigin-list")
//		.attr("class","columns")
//		.attr("data-columns","2")
		.style("-webkit-columns","3")
		.style("-moz-columns","3")
		.style("columns","3");
		createQWDocOriginList();
	}
	function createMainBodyAdvanced(){
		//advanced
		//clear body content
		d3.select("#qw-body").selectAll("div").remove();
		//create content
		d3.select("#qw-body").append("div").attr("class","row").append("h3").text("Here, you will add the 'main query' conditions. These conditions apply to words or phrases that can exist anywhere in the document. A sample set of conditions is provided.")
		var row1 = d3.select("#qw-body").append("div").attr("class","row");
		var yearCol = row1.append("div").attr("class","col-lg-6");
		var yearWell = yearCol.append("div").attr("class","well");
		yearWell.append("div").attr("class","row").append("h4").text("Select the range of years you would like to include in your search.");
		yearWell.append("div").attr("class","row").style("text-align","center").append("input").attr("id","qw-year-slider").attr("type","text");
		yearWell.append("div").attr("class","row").append("h5").attr("id","qw-year-label");
		createQWYearSlider();
		
		var docTypeCol = row1.append("div").attr("class","col-lg-6");
		var docTypeWell = docTypeCol.append("div").attr("class"," well");
		var dtRow = docTypeWell.append("div").attr("class","row");
		dtRow.append("h4").text("Select the sources of data you would like to include");
		dtRow.append("ul").attr("id","qw-docOrigin-list")
//		.attr("class","columns")
//		.attr("data-columns","2")
		.style("-webkit-columns","3")
		.style("-moz-columns","3")
		.style("columns","3");
		createQWDocOriginList();
		
		var textRow = d3.select("#qw-body").append("div").attr("class","row");
		textRow.append("h4").text("Enter the search terms. Click the help button for instructions.");
		textRow.append("textarea").attr("id","mainQueryTextarea")
		.style("width","100%")
		.attr("placeholder",'("stem cell" AND regen* AND -(embryo*)) OR (surgery AND robot*)');
	}
	
	function createMainBodyFriendly(){
		//clear body content
		d3.select("#qw-body").selectAll("div").remove();
		//create content
		d3.select("#qw-body").append("div").attr("class","row").append("h3").text("Here, you will add the 'main query' conditions. These conditions apply to words or phrases that can exist anywhere in the document. A sample set of conditions is provided.")
		var row1 = d3.select("#qw-body").append("div").attr("class","row");
		var yearCol = row1.append("div").attr("class","col-lg-6");
		var yearWell = yearCol.append("div").attr("class","well");
		yearWell.append("div").attr("class","row").append("h4").text("Select the range of years you would like to include in your search.");
		yearWell.append("div").attr("class","row").style("text-align","center").append("input").attr("id","qw-year-slider").attr("type","text");
		yearWell.append("div").attr("class","row").append("h5").attr("id","qw-year-label");
		createQWYearSlider();
		
		var docTypeCol = row1.append("div").attr("class","col-lg-6");
		var docTypeWell = docTypeCol.append("div").attr("class"," well");
		var dtRow = docTypeWell.append("div").attr("class","row");
		dtRow.append("h4").text("Select the sources of data you would like to include");
		dtRow.append("ul").attr("id","qw-docOrigin-list")
//		.attr("class","columns")
//		.attr("data-columns","2")
		.style("-webkit-columns","3")
		.style("-moz-columns","3")
		.style("columns","3");
		createQWDocOriginList();
		
		d3.select("#qw-body").append("div").attr("class","row").append("div").attr("class","row").attr("id","qbMain");
		
		var startRules = {
				condition: 'OR',
				rules:[
					{
						condition: 'AND',
						rules:[
							{
								id: 'mainQuery',
								operator: "in",
								value: "stem cell"
							},
							{
								id: 'mainQuery',
								operator: "in",
								value: "regen*"
							},
							{
								id: 'mainQuery',
								operator: "not_in",
								value: "embryo*"
							},
							]
					},
					{
						condition: 'AND',
						rules:[
							{
								id: 'mainQuery',
								operator: 'in',
								value: 'surgery',
							},
							{
								id: 'mainQuery',
								operator: 'in',
								value: 'robot*',
							}
						]
					}
				]
				
		}
		
		$("#qbMain").queryBuilder({
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
	}//end createMainFriendly
	
	
	
}//end createMainBody

function createQWDocOriginList(){
	var lis = d3.select("#qw-docOrigin-list").selectAll("li").data(sessionData.docTypes).enter()
	.append("li");
	
	lis.append("input").attr("type","checkbox").attr("value",function(d){
		return(d.value);
	}).attr("id",function(d){
		return(d.value+String(d.index));
	})
	.attr("checked",function(d){
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
function createQWYearSlider(){
	$("#qw-year-label").text( function(){
		var str = String(sessionData.start_year) + " - " + String(sessionData.end_year);
		return(str);
	});
	var yearSlider = $("#qw-year-slider").slider({ 
		min: 1980, 
		max: 2017, 
		value: [parseInt(sessionData.start_year), parseInt(sessionData.end_year)], 
		focus: true,
		tooltip_position: 'right',
		});

	yearSlider.on("slide",function(){
		$("#qw-year-label").text(function(){
			var yearVals = $("#qw-year-slider").val().split(",");
			var startyr = yearVals[0];
			var endyr = yearVals[1];
			sessionData.start_year = startyr;
			sessionData.end_year = endyr;
			updateSessionData(sessionData);
			ret = String(startyr) + " - " + String(endyr);
			return(ret);
		})
	})
}

function qwTitle(title){
	$("#qw-title").text(title);
}