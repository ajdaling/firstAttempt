$("#submit").on("click",function(){
	parse();
})
$("#unparse").on("click",function(){
	unparseQ();
})
function parse(){
	console.log("parsing");
	var str = $("#mainQuery").val();
	console.log(str);
	var output = rdp(str);
	console.log(output);
	$("#output").text(JSON.stringify(output, null, 2));
	buildQB(output);
}

function buildQB(rules){
	d3.select("#qw-body").selectAll("div").remove();
	d3.select("#qw-body").append("div").attr("class","row").append("div").attr("class","row").attr("id","qbMain");
	qb1 = $("#qbMain").queryBuilder({
		rules: rules,
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

function unparseQ(){
	var queryObj = $("#qbMain").queryBuilder("getRules");
	var unparsed = unparse(queryObj);
	console.log(unparsed);
	$("#output").text(unparsed);
}
