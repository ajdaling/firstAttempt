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

function getSearchParameters() {
      var prmstr = window.location.search.substr(1);
      return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}
var pars = getSearchParameters();
var this_qry = decodeURI(pars.this_qry);
var main_qry = decodeURI(pars.main_qry);
var instName = pars.instName;
var thisCompName = pars.thisCompName
var resName = pars.resName;
var docType = pars.docType;
var yearMin = pars.yearMin;
var yearMax = pars.yearMax;
var selectedCountry = pars.selectedCountry;
var topic1 = decodeURI(pars.topic1);
var topic2 = decodeURI(pars.topic2);
var topic3 = decodeURI(pars.topic3);
var topic4 = decodeURI(pars.topic4);
var topic5 = decodeURI(pars.topic5);
var topic6 = decodeURI(pars.topic6);
var topic7 = decodeURI(pars.topic7);
var topic8 = decodeURI(pars.topic8);

topic_url = "&topic1="+decodeURI(topic1);
topic_url += "&topic2="+decodeURI(topic2);
topic_url += "&topic3="+decodeURI(topic3);
topic_url += "&topic4="+decodeURI(topic4);
topic_url += "&topic5="+decodeURI(topic5);
topic_url += "&topic6="+decodeURI(topic6);
topic_url += "&topic7="+decodeURI(topic7);
topic_url += "&topic8="+decodeURI(topic8);


original_url = "&main_qry="+decodeURI(main_qry);
original_url += "&instName="+instName;
original_url += "&resName="+resName;
original_url += "&docType="+docType;
original_url += "&yearMin="+yearMin;
original_url += "&yearMax="+yearMax;
original_url += "&selectedCountry="+selectedCountry;
original_url += topic_url
//if (!instName) instName = "";
console.log("instName = "+instName);
console.log("resName = "+resName);

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function capitalize(tstring) {
    return tstring.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};


function getSearchParameters() {
      var prmstr = window.location.search.substr(1);
      return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}
var pars = getSearchParameters()

var dataSet = [];

//
// Code for plotting charts
$.ajax({
//	url: "http://"+config.host+":"+config.port+"/instVsAll_rates.sjs?thisCompName="+thisCompName+"&this_qry="+this_qry+"&main_qry="+main_qry+"&instName="+instName+"&resName="+resName+"&docType="+docType+"&yearMin="+yearMin+"&yearMax="+yearMax+"&selectedCountry="+selectedCountry,
   url: "http://localhost:8931/reportPage.sjs?this_qry=(neurology%20OR%20neurosurgery)&main_qry=(neurology%20OR%20neurosurgery)&topic1=cell%20OR%20immun*&topic2=tissue&topic3=gene&topic4=acellular%20OR%20molecular&instName=mayo;harvard&resName=&docType=&yearMin=2000&yearMax=2017&selectedCountry=&topN=10",	type: "GET",
	dataType: 'json',
	success: function(retdata){
		console.log("complete");
		//console.log(retdata);
		dataSet = retdata.dataRows;
//		console.log(dataSet);
		myTable();
//		my_chart(parsed_response);

	}
//	error: function() {
//		alert("error");
//	}
});


function myTable() {

	$(document).ready(function() {
		console.log("HERE");
		console.log(dataSet);
   	 $('#resultsTable').DataTable( {
      	  data: dataSet,
      	  columns: [
            	{ title: "Name" },
            	{ title: "Topic" },
            	{ title: "Peak Year" },
            	{ title: "Pubs" },
            	{ title: "Patents" },
            	{ title: "VC" },
            	{ title: "CTrials" },
            	{ title: "Grants" },
            	{ title: "Grant$" }
      	  ]
   	 } );
	} );
}
