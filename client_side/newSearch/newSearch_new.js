
var res_field = "";
var inst_field = "";
var results_url = config.docMasterLink;
console.log("version3");

var start_year_default = 1980;
var end_year_default = 2017;

var rowIndex = 1;
var rows = [ {id:"1",add:"#addButton1",remove:"#removeButton1"} ];

var num_rows = 1;
var ser;
var filtersList = ["--Select--","Title/Abstract","Topic","Institution","Researcher","MeSH Terms","Document Type"];
var docTypes = ["Patents","PubMed","Grants","NIH"];
function init(){
	createFirstRow();
	createListeners(); //create event listeners

}

function createFirstRow(){
	var row1 = d3.select("#queryForm").append("div").attr("class","form-group row").attr("id","row1");
	
	row1.append("div").attr("class","col-xs-2").append("button").attr("id",rows[0].add).attr("type","button").attr("class","btn btn-default addButton")
	.on("click",function(){
		console.log("adding row " + String(rowIndex+1));
		addRow();
	}).append("i").attr("class","glyphicon glyphicon-plus");
	
//	$("#addButton1").click(function(){
//		console.log("adding row");
//		addRow();
//	})
	
	row1.append("div").attr("class","col-xs-2  pull-left")
		.append("label").text("Year Range: ");
	
	var startYearDropCol = row1.append("div").attr("class","col-xs-2");
	startYearDropCol.append("label").text(' From ').style("padding-right","10px");
	startYearDropCol.append("select").attr("id","start-year-drop").selectAll("option").data(function(){
			var arr = [];
			for(var yr = sessionData.start_year; yr <= sessionData.end_year; yr++){
				arr.push(yr);
			}
			return(arr);
		}).enter().append("option").attr("value",function(d){
			return(d);
		}).text(function(d){
			return(d);
		})
		
	
	var endYearDropCol = row1.append("div").attr("class","col-xs-2");
	endYearDropCol.append("label").text(' To ').style("padding-right","10px");
	endYearDropCol.append("select").attr("id","end-year-drop").selectAll("option").data(function(){
		var arr = [];
		for(var yr = sessionData.start_year; yr <= sessionData.end_year; yr++){
			arr.push(yr);
		}
		return(arr);
	}).enter().append("option").attr("value",function(d){
		return(d);
	}).text(function(d){
		return(d);
	})
	
	$("#start-year-drop").val(sessionData.start_year);
	$("#end-year-drop").val(sessionData.end_year);
	
	
}

function addRow(){
	rowIndex++;
	var thisRow = d3.select("#queryForm").append("div").attr("class","form-group row").attr("id",function(){
			var ret = "row"+String(rowIndex);
			rows.push({id: ret, add:"#addButton"+String(rowIndex),remove:"#removeButton"+String(rowIndex)});
			return(ret);
		});
	
	var buttonRow = thisRow.append("div").attr("class","col-xs-2");
//	buttonRow.append("button").attr("id","#addButton"+String(rowIndex)).attr("type","button").attr("class","btn btn-default addButton")
//	.on("click",function(){
//		console.log("adding row " + String(rowIndex+1));
//		addRow();
//	})
//	.append("i").attr("class","glyphicon glyphicon-plus");
	
	buttonRow.append("button").attr("id","#removeButton"+String(rowIndex)).attr("type","button").attr("class","btn btn-default removeButton")
	.on("click",function(){
		console.log("removing row " + String(rowIndex));
		console.log($(this).parent().parent().remove());
	})
	.append("i").attr("class","glyphicon glyphicon-minus");
	
	thisRow.append("div").attr("class","col-xs-2").append("select").attr("id","filter-drop-"+String(rowIndex))
	.on("change",function(e){
		var val = $(this).val();
		var par = d3.select(this.parentNode.parentNode);
		if(val == "Title/Abstract"){
			par.append("div").attr("class","col-xs-8").append("input").attr("type","text").attr("placeholder","Title/Abstract").attr("size","80").attr("class","mainQuery field"+String(rowIndex));
		} else if(val == "Topic"){
			par.append("input").attr("type","text").attr("size","20").attr("class","topicLabel field"+String(rowIndex)).attr("placeholder","Topic Label");
			par.append("input").attr("type","text").attr("size","50").attr("class","topicValue field"+String(rowIndex)).attr("placeholder","Topic Terms");
		} else if(val == "Institution"){
			par.append("input").attr("type","text").attr("size","20").attr("class","instLabel field"+String(rowIndex)).attr("placeholder","Institution Group Label");
			par.append("input").attr("type","text").attr("size","50").attr("class","instValue field"+String(rowIndex)).attr("placeholder","Institution Group Terms");
		} else if(val == "Researcher"){
			par.append("div").attr("class","col-xs-6").append("input").attr("type","text").attr("size","80").attr("class","res field"+String(rowIndex)).attr("placeholder","Researchers");
		} else if(val == "MeSH Terms"){
			par.append("div").attr("class","col-xs-6").append("input").attr("type","text").attr("size","80").attr("class","mesh field"+String(rowIndex)).attr("placeholder","MeSH Terms");
		} else if(val == "Document Type"){
			par.append("div").attr("class","col-xs-6").append("select").selectAll("option").data(docTypes).enter().append("option").attr('value',function(d){
				return(d);
			}).text(function(d){
				return(d);
			})
		}
	}).selectAll("option").data(filtersList).enter()
	.append("option").attr("value",(function(d){return(d);})).text(function(d){return(d);});
	
	
		
	
	$("#addButton"+String(rowIndex)).on("click",function(){
		console.log("adding");
		addRow();
	});
	
	$("#removeButton"+String(rowIndex)).on("click",function(){
		console.log("removing");
		removeRow(rowIndex);
		rowIndex--;
	})
	
}


function createListeners(){

	$("#clear-button").on("click",function(){
		if(sessionData){
			delete sessionData;
		}
		if(localStorage.sessionData){
			delete localStorage.sessionData;
		}
	})

	//create listener for input changes which updates result estimate
//	$(":input").on('input',function(){
//
//		$.ajax({
//			type: "GET",
//			url: "http://"+config.host+":"+config.port+"/newSearch/get_estimate.sjs",
//			data: $("#queryForm").serialize(),
//			success: function(data){
//				$("#results_div").text("Documents: " + data);
//			}
//		})
//	})

}

function handleSubmit(){
	ret_data["mainQuery"] = document.getElementById('mainQuery').value;
	ret_data["institution"] = document.getElementById('institution').value;
	ret_data["researcher"] = document.getElementById('researcher').value;
	ret_data["start_year"] = document.getElementById('start_year').value;
	ret_data["end_year"] = document.getElementById('end_year').value;

	for(var i = 0; i < 50; i++){
		if(document.getElementById('row'+String(i))!=null){
			ret_data["topic"+String(i)] = document.getElementById('topic'+String(i)).value;
			ret_data["label"+String(i)] = document.getElementById('label'+String(i)).value;
		}
	}
	saveSerializedForm(); //save data so all windows can access it
	console.log("opening window");
	//open new window
	event.preventDefault();
	window.location = results_url;
}


