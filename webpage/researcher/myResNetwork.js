var dataReturned = "";
var countryData = ""
var InstitutionNames = "";
var InstitutionValues = "";
var ResearcherNames = "";
var ResearcherValues = "";
var docNames = "";
var docValues = "";
var yearNames;
var yearValues;
var yearNamesOne;
var yearValuesOne;
var momNames;
var momValues;
var momNamesOne ;
var momValuesOne;
var oTable;

var selectedCountry = "";

var sessionData = JSON.parse(localStorage.getItem("sessionData"));
if(!sessionData.vizData){
	sessionData.vizData = {};
	sessionData.vizData.start_year = sessionData.start_year;
	sessionData.vizData.end_year = sessionData.end_year;
	updateSessionData(sessionData);
}

var allNodes = null;
var allEles = null;
var lastHighlighted = null;
var lastUnhighlighted = null;

var layout;
var sublayout;
var layoutname = 'concentric2';

var animTime = 500;
var easing = 'linear';

var isZoomed = false;


var this_qry = sessionData.mainQuery;
var main_qry = sessionData.mainQuery;
var instName = sessionData.intitution;
var resName = sessionData.researcher;
var thisResName = sessionData.resData.resName.toLowerCase();
var docType = sessionData.docType;
var yearMin = sessionData.start_year;
var yearMax = sessionData.end_year;
var selectedCountry = sessionData.selectedCountry;
var topics = {};
for(var i = 0; i < 99; i++){
	var topStr = "topic"+String(i);
	var labStr = "label"+String(i);
	var tmpObj = {};
	if(sessionData.topStr){
		tmpObj.topic = sessionData[topStr];
		if(sessionData.labStr){
			tmpObj.label = sessionData[labStr];
		}
		topics[topStr] = tmpObj;
	}
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
function capitalize(tstring) {
	return tstring.replace(/(?:^|\s|,)\S/g, function(a) { return a.toUpperCase(); });
};

var infoTemplate = Handlebars.compile([
	'<p class="ac-name">{{id}}</p>',
	'<p class="ac-node-type"><i class="fa fa-info-circle"></i> {{type}} {{#if Type}}({{Type}}){{/if}}</p>'
].join(''));


//
// Query to get data for a specific institution
var ajaxParams = JSON.parse(JSON.stringify(sessionData));
if(ajaxParams.repData) delete ajaxParams.repData;
var myData = $.ajax({
	url:config.dataURL+'/researcher/resNetworkL2.sjs',
	type: 'GET',
	xhrFields: { withCredentials: true },
	data: JSON.stringify(ajaxParams),
	crossDomain: true,
	dataType: 'json'
});
console.log(myData);
//
// Query to get layout info
var myStyle = fetch('cy-style.json', {mode: 'no-cors'})
.then(function(res) {
	return res.json()
});
Promise.all([myStyle,myData])
.then(function(dataArray) {
	var cy = window.cy = cytoscape({
		container: document.getElementById('cy'),
		style: dataArray[0],
		ready: function(){}
	});
	cy.panzoom({
		// options here...
	});

//
// Iterate over data returned
	networkData = dataArray[1];
	instNodes = networkData['institutionNodes'];
	resNodes = networkData['researcherNodes'];
	edges = networkData['edges'];
//

// Find min and max
	var minVal = 10000.0;
	var maxVal = 0.0;
	for(instKey in instNodes){
		var val = parseInt(instNodes[instKey]);
		if (val < minVal) minVal = val;
		if (val > maxVal) maxVal = val;
	}
	for(instKey in resNodes){
		if (instKey.trim() != thisResName) {
			var val = parseInt(resNodes[instKey]);
			if (val < minVal) minVal = val;
			if (val > maxVal) maxVal = val;
		}
	}
//
// Add all of the institution nodes
	var myMin = 5.0;
	var myMax = 60.0;
	for(instKey in instNodes){
		var val = parseInt(instNodes[instKey]);
//		console.log(instKey + val);
		if(minVal==maxVal){
			val = 30.0;
		}
		else{
			val = ((myMax - myMin)*(val - minVal)/(maxVal-minVal)) + myMin;
		}
		cy.add({
			data: { id: instKey, weight: parseInt(val), type: "inst"},
			position: {x: 1,y: 1},
			type: "inst"});
	}
//
// Add nodes for researchers
	for(resKey in resNodes){
		var val = resNodes[resKey];
		if(minVal==maxVal){
			val = 30.0;
		}
		else{
			val = ((myMax - myMin)*(val - minVal)/(maxVal-minVal)) + myMin;
		}
		var weight = val;
		if (resKey.trim() != thisResName) {
//			console.log(instKey);
			cy.add({
				data: { id: resKey, weight: val, type: "res"},
				position: {x: 1,y: 1},
				type: "res"
			});
		} else {
			cy.add({
				data: { id: resKey, weight: parseInt(val), type: "main"},
				position: {x: 1,y: 1},
				type: "main"});
		}
	}
//
// Add edges
	for(var i=0; i<edges.length; i++){
		thisEdge = edges[i];
		var source = thisEdge['a'];
		weight = thisEdge['weight'];
		cy.add({
			data: {
				id: thisEdge['a']+thisEdge['b'],
				source: thisEdge['a'],
				target: thisEdge['b'],
				weight: weight
			}
		});
		console.log(weight);
	}

	allNodes = cy.nodes();

	// Causes qtips to only show up after the mouse hovers over a node for half a second
	var hoverTimeout;
	var hoverDelay = 500;
	var hoverElt = cy.collection(); // empty set so no null checks needed

	cy.on('mouseover', 'node', function(evt){
		hoverElt = this;
		clearTimeout( hoverTimeout );
		hoverTimeout = setTimeout(function(){hoverElt.trigger('hover');},
						hoverDelay);
	})
	.on('mouseout', 'node', function(){
		clearTimeout( hoverTimeout );
		hoverElt.trigger('hovercancel');
	});

	cy.nodes().forEach(function(n){
		var g = n.data('id');
		var weight = n.data('weight');
		n.qtip({
			content: {
				text: (n.data('type')=='inst')? 'Institution: ' + capitalize(g): 'Researcher: ' + capitalize(g),
			},
			position: {
				my: 'top center',
				at: 'bottom center'
			},
			show: {
				event: 'hover',
			},
			hide: {
				event: 'hovercancel',
			},
			style: {
				classes: 'qtip-bootstrap',
				tip: {
					width: 16,
					height: 8
				}
			}
		});
	});
	mainNode = cy.getElementById(thisResName);
// Making default concentric layout
	layout = cy.layout({
		name: 'concentric',
		padding: cy.nodes().size()>5?10:200,
		fit: true,
		minNodeSpacing: 1,
		avoidOverlap: false,
//		spacingFactor: 0.5,
		boundingBox: {
			x1: -1,
			x2: 1,
			y1: -1,
			y2: 1
		},
		animate: true,
		animationDuration: animTime,
		animationEasing: easing,
		concentric: function( node ){
			var max = node.closedNeighborhood().max(function(e){
				if(e.isEdge()){
							return e.data('weight');
				}
			});
			if (node.data('type') == 'main') {
				return 11;
			} else {
				var val =  parseInt(10*(node.edgesWith(mainNode).data('weight')||0)/max.value);
				return val;
			}
		},
		levelWidth: function(  ){
			return 1;
		}
	});
	layout.run();

	cy.on('click', function(e){
		var sel = e.target;
		if(sel!==cy && sel.isNode()){
			showInfo(sel);
			selection(sel);
		}
		else{
			showInfo(mainNode);
			reset();
		}
	});

	//Populates Researcher Collaborator table
	var resTableData = [];
	var firstRow = [];
	firstRow.push(capitalize(mainNode.data('id')));
	firstRow.push(capitalize('Main'));
	firstRow.push('N/A');
	resTableData.push(firstRow);
	mainNode.openNeighborhood().nodes("[type='inst']").sort(function(a,b){
		return b.edgesWith(mainNode).data('weight')-a.edgesWith(mainNode).data('weight');
	}).forEach(function(node){
		var row = [];
		row.push(capitalize(node.data('id')));
		row.push('Institution');
		row.push(node.edgesWith(mainNode).data('weight'));
		resTableData.push(row);
	});
	mainNode.openNeighborhood().nodes("[type='res']").sort(function(a,b){
		return b.edgesWith(mainNode).data('weight')-a.edgesWith(mainNode).data('weight');
	}).forEach(function(node){
		var row = [];
		row.push(capitalize(node.data('id')));
		row.push('Researcher');
		row.push(node.edgesWith(mainNode).data('weight'));
		resTableData.push(row);
	});
	resTable = $('#networkInfoTable').DataTable({
		"data" : resTableData,
		"order": [],
		"pageLength": 10,
		"lengthChange": false,
//		"scrollY": '80vh',
//		"scrollX": '60wh',
		"scrollCollapse": true,
		"columnDefs": [
			{
				"render": function ( data, type, row ) {
					var odata = data;
//					linkData = data.toLowerCase();
					if(row[1]=='Institution'){
						return '<a onclick="clickInst(this,event)" id="'+odata+'" href="#">'+data+'</a>';
					}
					else{
						return '<a onclick="clickRes(this,event)" id="'+odata+'" href="#">'+data+'</a>';
					}
				},
				"targets": 0
			},
		],
	});
	// and finally, clear the loading animation
	var loading = document.getElementById('loading');
	loading.classList.add('loaded');
// cytoscape panzooom
	// the default values of each option are outlined below:

})
.then(function() {
	FastClick.attach( document.body );
});

/*----------------------------------------------------------------------------------------*/
//To save image
$("#save-as-png").click(function(evt){
	var pngContent = cy.png();

	// see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
	function b64toBlob(b64Data, contentType, sliceSize) {
		contentType = contentType || '';
		sliceSize = sliceSize || 512;

		var byteCharacters = atob(b64Data);
		var byteArrays = [];

		for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			var slice = byteCharacters.slice(offset, offset + sliceSize);

			var byteNumbers = new Array(slice.length);
			for (var i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			var byteArray = new Uint8Array(byteNumbers);

			byteArrays.push(byteArray);
		}

		var blob = new Blob(byteArrays, {type: contentType});
		return blob;
	}

	// this is to remove the beginning of the pngContent: data:img/png;base64,
	var b64data = pngContent.substr(pngContent.indexOf(",") + 1);

	saveAs(b64toBlob(b64data, "image/png"), "network.png");
	return false;

});

/*----------------------------------------------------------------------------------------*/
//For searchbox
$('#search').typeahead({
	minLength: 1,
	highlight: true,
},
{
	name: 'search-dataset',
	display: 'id',
	source: function( query, cb ){
		function matches( str, q ){
			str = (str || '').toLowerCase();
			q = (q || '').toLowerCase();

			return str.match( q );
		}
		var fields = ['id', 'type'];

		function anyFieldMatches( n ){
			for( var i = 0; i < fields.length; i++ ){
				var f = fields[i];
				if( matches( n.data(f), query ) ){
					return true;
				}
			}
			return false;
		}
		function getData(n){
			var data = n.data();

			return data;
		}

		function sortByName(n1, n2){
			if( n1.data('id') < n2.data('id') ){
				return -1;
			} else if( n1.data('id') > n2.data('id') ){
				return 1;
			}

			return 0;
		}
		var res = allNodes.stdFilter( anyFieldMatches ).sort( sortByName ).map( getData );
		cb( res );
	},
	templates: {
		suggestion: infoTemplate
	}
}).on('typeahead:selected', function(e, entry, dataset){
	var n = cy.getElementById(entry.id);

	cy.batch(function(){
		allNodes.unselect();
		n.select();
		showInfo(n);
		selection(n);
	})
});

/*----------------------------------------------------------------------------------------*/
//For highlighting selected nodes and their connections
function selection(sel){

	if(isZoomed){
		sublayout.stop();
		isZoomed=false;
	}
	var nbhd = sel.closedNeighborhood();
	var others = cy.elements().not( nbhd );
	cy.elements().removeClass('semitransp');
	cy.elements().removeClass('highlight');
	others.addClass('semitransp');
	nbhd.addClass('highlight');
	// Fits the network window to the current selection
	var fit= function(){
		console.log('fit');
		console.log(nbhd.size());
		cy.animation({
			fit: {
				eles: nbhd,
				padding: 10
			},
			easing: easing,
			duration: animTime
		}).play().promise();
	}
	// Gets the neighborhood of a selected node
	var pullNbhd = function(){
		console.log("pull");
		layout.stop();
		var pos = sel.position();
		console.log(pos.x);
		if(layoutname == 'concentric1'){
			sublayout = nbhd.makeLayout({
				name: 'concentric',
				fit: false,
				animate: true,
				animationDuration: animTime,
				animationEasing: easing,
				avoidOverlap: false,
				boundingBox: {
					x1: -1,
					x2: 1,
					y1: -1,
					y2: 1
				},
				concentric: function( node ){
					if (node.same(sel)) {
						return 4;
					}
					if (node.data('type') == 'inst') {
						return 2;
					}
					if (node.data('type') == 'res' || node.data('type') == 'main') {
						return 1;
					}
				},
				levelWidth: function(){ return 1; },
			});
		} else if(layoutname == 'concentric2'){
			sublayout = nbhd.makeLayout({
				name: 'concentric',
				fit: false,
				animate: true,
				animationDuration: animTime,
				animationEasing: easing,
				avoidOverlap: true,
				boundingBox: {
					x1: -1,
					x2: 1,
					y1: -1,
					y2: 1
				},
				concentric: function( ele ){
					var max = nbhd.max(function(e){
						if(e.isEdge()){
							return e.data('weight');
						}
					});
					if( ele.same( sel ) ){
						console.log("max= "+max.value);
						return 6;
					} else{
						var val = parseInt(5*ele.edgesWith(sel).data('weight')/max.value);
						return val;
					}
				},
				levelWidth: function(){ return 1; },
			});
		}
		var promise = cy.promiseOn('layoutstop');
		sublayout.run();
		isZoomed = true;
		return promise;
	};
	return Promise.resolve()
	 .then( pullNbhd )
	 .then( fit )
}
/*----------------------------------------------------------------------------------------*/
//For the layout toggle buttons
$("#concentric1").click(function(evt){
	layout.stop();
	allNodes.unselect();
	$(this).addClass('active');
	$("#concentric2").removeClass('active');
	layout = cy.layout({
		name: 'concentric',
		padding: cy.nodes().size()>5?10:200,
		fit: true,
		minNodeSpacing: 0,
//		spacingFactor: 0.5,
		avoidOverlap: false,
		boundingBox: {
			x1: -1,
			x2: 1,
			y1: -1,
			y2: 1
		},
		animate: true,
		animationDuration: animTime,
		animationEasing: easing,
		concentric: function( node ){
			if (node.data('type') == 'main') {
				return 4;
			}
			if (node.data('type') == 'inst') {
				return 2;
			}
			if (node.data('type') == 'res') {
				return 1;
			}
		},
		levelWidth: function(  ){
			return 1;
		}
	});
	reset();
	layoutname = 'concentric1';
	return false;
});

$("#concentric2").click(function(evt){
	layout.stop();
	allNodes.unselect();
	$(this).addClass('active');
	$("#concentric1").removeClass('active');
	layout = cy.layout({
		name: 'concentric',
		padding: cy.nodes().size()>5?10:200,
		fit: true,
		minNodeSpacing: 1,
		avoidOverlap: false,
		//spacingFactor: 0.5,
		boundingBox: {
			x1: -1,
			x2: 1,
			y1: -1,
			y2: 1
		},
		animate: true,
		animationDuration: animTime,
		animationEasing: easing,
		concentric: function( node ){
			var max = node.closedNeighborhood().max(function(e){
				if(e.isEdge()){
							return e.data('weight');
				}
			});
			if (node.data('type') == 'main') {
				return 11;
			} else {
				var val =  parseInt(10*(node.edgesWith(mainNode).data('weight')||0)/max.value);
				return val;
			}
		},
		levelWidth: function(  ){
			return 1;
		}
	});
	reset();
	layoutname = 'concentric2';
	return false;
});

/*----------------------------------------------------------------------------------------*/
// Resets the network
function reset(){
	if(isZoomed){
		sublayout.stop();
		isZoomed=false;
	}
	cy.batch(function(){
		console.log("reset");
		cy.elements().removeClass('semitransp');
		cy.elements().removeClass('highlight');
	});
	layout.run();
	cy.animation({
		fit: {
			eles: cy.elements(),
			padding: 20
		},
		easing: easing,
		duration: animTime
	}).play();
};
/*----------------------------------------------------------------------------------------*/
//Populates Researcher Collaborator table with information for selected node
function showInfo(sel) {
	var g = (sel.data('type') == 'res')?"Selection (Researcher)":"Selection (Institution)";
	var resTableData = [];
	var firstRow = [];
	firstRow.push(capitalize(sel.data('id')));
	firstRow.push(capitalize(g));
	firstRow.push('N/A');
	resTableData.push(firstRow);
	sel.openNeighborhood().nodes("[type='inst']").sort(function(a,b){
		return b.edgesWith(sel).data('weight')-a.edgesWith(sel).data('weight');
	}).forEach(function(node){
		var row = [];
		row.push(capitalize(node.data('id')));
		row.push('Institution');
		row.push(node.edgesWith(sel).data('weight'));
		resTableData.push(row);
	});
	sel.openNeighborhood().nodes("[type!='inst']").sort(function(a,b){
		return b.edgesWith(sel).data('weight')-a.edgesWith(sel).data('weight');
	}).forEach(function(node){
		var row = [];
		row.push(capitalize(node.data('id')));
		row.push('Researcher');
		row.push(node.edgesWith(sel).data('weight'));
		resTableData.push(row);
	});
	resTable = $('#networkInfoTable').DataTable({
		"destroy" : true,
		"data" : resTableData,
		"order": [],
		"pageLength": 10,
		"lengthChange": false,
//		"scrollY": '80vh',
//		"scrollX": '60wh',
		"scrollCollapse": true,
		"columnDefs": [
 			{
				"render": function ( data, type, row ) {
					var odata = data;
					if(row[1]=='Institution' || row[1]=='Selection (Institution)'){
						return '<a onclick="clickInst(this,event)" id="'+odata+'" href="#">'+data+'</a>';
					}
					else{
						return '<a onclick="clickRes(this,event)" id="'+odata+'" href="#">'+data+'</a>';
					}
				},
				"targets": 0
			},
		],
	});
}

// Creates guide
$("#guide").qtip({
	content: {
		text: "The graph shows main institution, the top ten institutions and researchers that collaborate with it, and the top ten institutions and researchers that collaborate with those institutions.<br>Blue squares - institutions<br>Purple triangles - researchers<br>Red circle - main institution<br><br>The size of an object corresponds to the total number of documents that that object has collaborated on with any institution in the top ten. Clicking on an object shows a subgraph of its links within this graph.<br><br>Weight ordered: Distance from central object represents the relation between an object and central object. The closer an object is to the center, the more documents that object shares with that selection.<br><br>Type ordered: Researchers are placed in an outer circle, institutions are placed in a middle circle, and the main node (or a selected node) is placed at the center. The thickness of a line represents the relation between the objects that line connects",
		title: {
			text: "Guide",
			button: true
		}
	},
	position: {
		container: $('#info'),
		at: 'bottom center',
		my: 'top center'
	},
	show: {
		event: 'click'
	},
	hide: {
		fixed: true,
		event: 'unfocus'
	},
	style: {
		width: 'auto',
		classes: 'qtip-tipped',
		tip: false
	}
});
