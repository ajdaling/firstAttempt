catType = 0;   // 0: gramts; 1: patents; 2: ieee
fiterTopic = "none";
filterTopicNum = 0;
filterSubTopic = "none";
var authorMatch = "ALL";
var $yearMin;
var instMatch = "ALL";
var instTable;
var resetTable = 1;

function setResetVal(val) {
//   console.log("resetval");
//   console.log(val);
   resetTable = val;
}

function masterProcessFile(authorList,instList) {

var checkedAuthorNames = [];
var checkedInstNames = [];
var checkedDocTypes = [];
var checkedCountries = [];
var checkedTopics = [];


if (authorList != "ALL") {
   authorMatch = authorList.replace(/%20/g,' ');
   authorMatch = authorMatch.replace(/%27/g,"'");
}   


if (instList != "ALL") {
   instMatch = instList.replace(/%20/g,' ');
}   

yadcf_data_0= ["Publication","Patent","Grant"];

instTable = $('#auth-master-table').DataTable({
   dom: 'BT<"top"if>rt<"bottom"lp><"clear">',
   buttons: [
   'colvis',
   'csv',
   'pdf',
   'print'
   ],
   "bProcessing": true,
   "bAutoWidth": false,
   "bFilter":     false,
   "pagingType": "simple_numbers",
   "iDisplayLength": 25,
//   "aoColumnDefs": [
//        { "bVisible": false, "aTargets": [7,8,9] }
//    ],
   "aLengthMenu": [[25, 50, 100, 1000], [25, 50, 100, 1000]],
   "aaSorting":[[2,'desc'],[0,'desc'],[3,'asc']],
   "orderClasses": false,
   "deferRender": true,
   "serverSide": true,
   "bJQueryUI": true,
   "ajax": {
      "url": "./server_processing_docsNew.php",
      "data": function ( d ) {
               d.titleAbstractSearch = $('#titleAbstractSearch').val();
               d.resetTable = resetTable;;

//
// Loop over each checked author and append to the author search box
               d.authorSearch = $('#authorSearch').val();
	       checkedAuthorNames.length = 0;
               $("input[name='authcheck_list[]']:checked").each(function(i) {
                  //console.log($(this).val());
                  $(this).prop('checked',false);
                  d.authorSearch = d.authorSearch.concat(' \"');
                  d.authorSearch = d.authorSearch.concat(this.value);
                  d.authorSearch = d.authorSearch.concat('\" ');
		  checkedAuthorNames.push(this.value);
//                  console.log(d.authorSearch);
               });
//
// Loop over each checked inst and append to the inst search box
               d.instSearch = $('#instSearch').val();
	       checkedInstNames.length = 0;
               $("input[name='instcheck_list[]']:checked").each(function(i) {
                  //console.log($(this).val());
                  $(this).prop('checked',false);
                  d.instSearch = d.instSearch.concat(' \"');
                  d.instSearch = d.instSearch.concat(this.value);
                  d.instSearch = d.instSearch.concat('\" ');
		  checkedInstNames.push(this.value);
//                  console.log(d.instSearch);
               });

//
// Loop over each checked docType and append to the docType search box
               d.docSearch = $('#docSearch').val();
               d.docSearch = d.docSearch.replace(/"/g,'')
	       checkedDocTypes.length = 0;
               $("input[name='doccheck_list[]']:checked").each(function(i) {
                  //console.log($(this).val());
                  $(this).prop('checked',false);
                  //d.docSearch = d.docSearch.concat(' \"');
                  d.docSearch = d.docSearch.concat(this.value);
                  d.docSearch = d.docSearch.concat(';');
		  checkedDocTypes.push(this.value);
//                  console.log(d.docSearch);
               });

//
// Loop over each checked country and append to the country search box
               d.countrySearch = $('#countrySearch').val();
               d.countrySearch = d.countrySearch.replace(/"/g,'')
               d.countrySearch = d.countrySearch.concat(';');
	       checkedCountries.length = 0;
               $("input[name='countrycheck_list[]']:checked").each(function(i) {
                  //console.log($(this).val());
                  $(this).prop('checked',false);
                  //d.countrySearch = d.countrySearch.concat(' \"');
                  d.countrySearch = d.countrySearch.concat(this.value);
                  d.countrySearch = d.countrySearch.concat(';');
		  checkedCountries.push(this.value);
//                  console.log(d.countrySearch);
               });

//
// Loop over each checked topic and append to the topic search box
               d.topicSearch = $('#topicSearch').val();
               d.topicSearch = d.topicSearch.replace(/"/g,'')
               checkedTopics.length = 0;
               $("input[name='topiccheck_list[]']:checked").each(function(i) {
                  //console.log($(this).val());
                  $(this).prop('checked',false);
                  //d.topicSearch = d.topicSearch.concat(' \"');
                  d.topicSearch = d.topicSearch.concat(this.value);
                  d.topicSearch = d.topicSearch.concat(';');
//                  console.log(d.topicSearch);
		  checkedTopics.push(this.value);
               });
//
// Get max/min year
                d.yearRange = $('#range').val();

            }},
//
// Tis sets values on the page upon return from the server side code
	"fnDrawCallback": function(oSettings) {
         var jsonResp = $.parseJSON(oSettings.jqXHR.responseText);
//         console.log("year values ");
         $yearMax = 2020;
         $yearMin = 1990;
         if (!jsonResp.iYearData[0]) {
         } else {
           $yearMax = jsonResp.iYearData[0];
         }
	 if (!jsonResp.iYearData[1]) {
	 } else {
	    $yearMin = jsonResp.iYearData[1];
	 }
//	 console.log($yearMax);
//	 console.log($yearMin);
         $("#yearMax").text($yearMax);
         $("#yearMin").text($yearMin);
//	 $("#yearMax").text(jsonResp.iYearData[0]);   
//       $("#yearMin").text(jsonResp.iYearData[1]);   
//   console.log("authorMatch");
//   console.log(authorMatch);

//
// Loop over possible returned top 10 authors
	      $i=0;   
//
// First hide them all (because we might not have 10)
   	   $('#authcheck_hidden1').addClass('myhidden');
   	   $('#authcheck_hidden2').addClass('myhidden');
   	   $('#authcheck_hidden3').addClass('myhidden');
   	   $('#authcheck_hidden4').addClass('myhidden');
   	   $('#authcheck_hidden5').addClass('myhidden');
   	   $('#authcheck_hidden6').addClass('myhidden');
   	   $('#authcheck_hidden7').addClass('myhidden');
   	   $('#authcheck_hidden8').addClass('myhidden');
   	   $('#authcheck_hidden9').addClass('myhidden');
   	   $('#authcheck_hidden10').addClass('myhidden');
//
// Now loop over the returned ones and set the labels and unhide them
   	   $.each(jsonResp.iAuthorData, function(key, value) { 
     		   //console.log(key);
   		   //console.log(value);
// key is the key
// value is the value
	         if (value > 0) {

			checked = false;
			for (var ic=0, tot=checkedAuthorNames.length; (ic<tot) && (!checked); ic++) {
                           if (key == checkedAuthorNames[ic]) {
				checked = true;
			   }
			}
         		switch($i) {
         		  case 0: 
         		   $("#authcheck_list1").attr("value",key);
         		   $("#authcheck_lab1").html(key+" ("+value+")");
           		   $('#authcheck_hidden1').removeClass('myhidden');
			   if (checked) $("#authcheck_list1").prop('checked',true);
         		   break;
                           case 1:
                            $("#authcheck_list2").attr("value",key);
                            $("#authcheck_lab2").html(key+" ("+value+")");
                            $('#authcheck_hidden2').removeClass('myhidden');
 			    if (checked) $("#authcheck_list2").prop('checked',true);
                            break;
                           case 2:
                            $("#authcheck_list3").attr("value",key);
                            $("#authcheck_lab3").html(key+" ("+value+")");
                            $('#authcheck_hidden3').removeClass('myhidden');
 			    if (checked) $("#authcheck_list3").prop('checked',true);
                            break;
                           case 3:
                            $("#authcheck_list4").attr("value",key);
                            $("#authcheck_lab4").html(key+" ("+value+")");
                            $('#authcheck_hidden4').removeClass('myhidden');
 			    if (checked) $("#authcheck_list4").prop('checked',true);
                            break;
                           case 4:
                            $("#authcheck_list5").attr("value",key);
                            $("#authcheck_lab5").html(key+" ("+value+")");
                            $('#authcheck_hidden5').removeClass('myhidden');
 			    if (checked) $("#authcheck_list5").prop('checked',true);
                            break;
                           case 5:
                            $("#authcheck_list6").attr("value",key);
                            $("#authcheck_lab6").html(key+" ("+value+")");
                            $('#authcheck_hidden6').removeClass('myhidden');
 			    if (checked) $("#authcheck_list6").prop('checked',true);
                            break;
                           case 6:
                            $("#authcheck_list7").attr("value",key);
                            $("#authcheck_lab7").html(key+" ("+value+")");
                            $('#authcheck_hidden7').removeClass('myhidden');
 			    if (checked) $("#authcheck_list7").prop('checked',true);
                            break;
                           case 7:
                            $("#authcheck_list8").attr("value",key);
                            $("#authcheck_lab8").html(key+" ("+value+")");
                            $('#authcheck_hidden8').removeClass('myhidden');
 			    if (checked) $("#authcheck_list8").prop('checked',true);
                            break;
                           case 8:
                            $("#authcheck_list9").attr("value",key);
                            $("#authcheck_lab9").html(key+" ("+value+")");
                            $('#authcheck_hidden9').removeClass('myhidden');
 			    if (checked) $("#authcheck_list9").prop('checked',true);
                            break;
                           case 9:
                            $("#authcheck_list10").attr("value",key);
                            $("#authcheck_lab10").html(key+" ("+value+")");
                            $('#authcheck_hidden10').removeClass('myhidden');
 			    if (checked) $("#authcheck_list10").prop('checked',true);
                            break;
         		}
		      }
		      $i = $i+1;
	      });
//
// Loop over possible returned top 10 institutions
	      $i=0;   
//
// First hide them all (because we might not have 10)
   	   $('#instcheck_hidden1').addClass('myhidden');
   	   $('#instcheck_hidden2').addClass('myhidden');
   	   $('#instcheck_hidden3').addClass('myhidden');
   	   $('#instcheck_hidden4').addClass('myhidden');
   	   $('#instcheck_hidden5').addClass('myhidden');
   	   $('#instcheck_hidden6').addClass('myhidden');
   	   $('#instcheck_hidden7').addClass('myhidden');
   	   $('#instcheck_hidden8').addClass('myhidden');
   	   $('#instcheck_hidden9').addClass('myhidden');
   	   $('#instcheck_hidden10').addClass('myhidden');
//
// Now loop over the returned ones and set the labels and unhide them
   	   $.each(jsonResp.iInstData, function(key, value) { 
     		   //console.log(key);
   		   //console.log(value);
// key is the key
// value is the value
	         if (value > 0) {
                        checked = false;
                        for (var ic=0, tot=checkedInstNames.length; (ic<tot) && (!checked); ic++) {
                           if (key == checkedInstNames[ic]) {
                                checked = true;
                           }
                        }
         		switch($i) {
         		  case 0: 
         		    $("#instcheck_list1").attr("value",key);
         		    $("#instcheck_lab1").html(key+" ("+value+")");
           		    $('#instcheck_hidden1').removeClass('myhidden');
			    if (checked) $("#instcheck_list1").prop('checked',true);
         		   break;
                           case 1:
                            $("#instcheck_list2").attr("value",key);
                            $("#instcheck_lab2").html(key+" ("+value+")");
                            $('#instcheck_hidden2').removeClass('myhidden');
                            if (checked) $("#instcheck_list2").prop('checked',true);
                            break;
                           case 2:
                            $("#instcheck_list3").attr("value",key);
                            $("#instcheck_lab3").html(key+" ("+value+")");
                            $('#instcheck_hidden3').removeClass('myhidden');
                            if (checked) $("#instcheck_list3").prop('checked',true);
                            break;
                           case 3:
                            $("#instcheck_list4").attr("value",key);
                            $("#instcheck_lab4").html(key+" ("+value+")");
                            $('#instcheck_hidden4').removeClass('myhidden');
                            if (checked) $("#instcheck_list4").prop('checked',true);
                            break;
                           case 4:
                            $("#instcheck_list5").attr("value",key);
                            $("#instcheck_lab5").html(key+" ("+value+")");
                            $('#instcheck_hidden5').removeClass('myhidden');
                            if (checked) $("#instcheck_list5").prop('checked',true);
                            break;
                           case 5:
                            $("#instcheck_list6").attr("value",key);
                            $("#instcheck_lab6").html(key+" ("+value+")");
                            $('#instcheck_hidden6').removeClass('myhidden');
                            if (checked) $("#instcheck_list6").prop('checked',true);
                            break;
                           case 6:
                            $("#instcheck_list7").attr("value",key);
                            $("#instcheck_lab7").html(key+" ("+value+")");
                            $('#instcheck_hidden7').removeClass('myhidden');
                            if (checked) $("#instcheck_list7").prop('checked',true);
                            break;
                           case 7:
                            $("#instcheck_list8").attr("value",key);
                            $("#instcheck_lab8").html(key+" ("+value+")");
                            $('#instcheck_hidden8').removeClass('myhidden');
                            if (checked) $("#instcheck_list8").prop('checked',true);
                            break;
                           case 8:
                            $("#instcheck_list9").attr("value",key);
                            $("#instcheck_lab9").html(key+" ("+value+")");
                            $('#instcheck_hidden9').removeClass('myhidden');
                            if (checked) $("#instcheck_list9").prop('checked',true);
                            break;
                           case 9:
                            $("#instcheck_list10").attr("value",key);
                            $("#instcheck_lab10").html(key+" ("+value+")");
                            $('#instcheck_hidden10').removeClass('myhidden');
                            if (checked) $("#instcheck_list10").prop('checked',true);
                            break;
         		}
		      }
		      $i = $i+1;
         });

//
// Loop over possible returned docTypes
	    $i=0;   
//
// First hide them all (because we might not have 10)
   	   $('#doccheck_hidden1').addClass('myhidden');
   	   $('#doccheck_hidden2').addClass('myhidden');
   	   $('#doccheck_hidden3').addClass('myhidden');
   	   $('#doccheck_hidden4').addClass('myhidden');
   	   $('#doccheck_hidden5').addClass('myhidden');
   	   $('#doccheck_hidden6').addClass('myhidden');
   	   $('#doccheck_hidden7').addClass('myhidden');
   	   $('#doccheck_hidden8').addClass('myhidden');
   	   $('#doccheck_hidden9').addClass('myhidden');
   	   $('#doccheck_hidden10').addClass('myhidden');
//
// Now loop over the returned ones and set the labels and unhide them
   	   $.each(jsonResp.iDocData, function(key, value) { 
     		   //console.log(key);
   		   //console.log(value);
// key is the key
// value is the value
	         if (value > 0) {
                        checked = false;
                        for (var ic=0, tot=checkedDocTypes.length; (ic<tot) && (!checked); ic++) {
                           if (key == checkedDocTypes[ic]) {
                                checked = true;
                           }
                        }
         		switch($i) {
         		  case 0: 
         		    $("#doccheck_list1").attr("value",key);
         		    $("#doccheck_lab1").html(key+" ("+value+")");
           		    $('#doccheck_hidden1').removeClass('myhidden');
                            if (checked) $("#doccheck_list1").prop('checked',true);
         		   break;
                           case 1:
                            $("#doccheck_list2").attr("value",key);
                            $("#doccheck_lab2").html(key+" ("+value+")");
                            $('#doccheck_hidden2').removeClass('myhidden');
                            if (checked) $("#doccheck_list2").prop('checked',true);
                             break;
                           case 2:
                            $("#doccheck_list3").attr("value",key);
                            $("#doccheck_lab3").html(key+" ("+value+")");
                            $('#doccheck_hidden3').removeClass('myhidden');
                            if (checked) $("#doccheck_list3").prop('checked',true);
                             break;
                           case 3:
                            $("#doccheck_list4").attr("value",key);
                            $("#doccheck_lab4").html(key+" ("+value+")");
                            $('#doccheck_hidden4').removeClass('myhidden');
                            if (checked) $("#doccheck_list4").prop('checked',true);
                             break;
                           case 4:
                            $("#doccheck_list5").attr("value",key);
                            $("#doccheck_lab5").html(key+" ("+value+")");
                            $('#doccheck_hidden5').removeClass('myhidden');
                             if (checked) $("#doccheck_lis51").prop('checked',true);
                            break;
                           case 5:
                            $("#doccheck_list6").attr("value",key);
                            $("#doccheck_lab6").html(key+" ("+value+")");
                            $('#doccheck_hidden6').removeClass('myhidden');
                            if (checked) $("#doccheck_list6").prop('checked',true);
                             break;
                           case 6:
                            $("#doccheck_list7").attr("value",key);
                            $("#doccheck_lab7").html(key+" ("+value+")");
                            $('#doccheck_hidden7').removeClass('myhidden');
                            if (checked) $("#doccheck_list7").prop('checked',true);
                            break;
                           case 7:
                            $("#doccheck_list8").attr("value",key);
                            $("#doccheck_lab8").html(key+" ("+value+")");
                            $('#doccheck_hidden8').removeClass('myhidden');
                            if (checked) $("#doccheck_list8").prop('checked',true);
                            break;
                           case 8:
                            $("#doccheck_list9").attr("value",key);
                            $("#doccheck_lab9").html(key+" ("+value+")");
                            $('#doccheck_hidden9').removeClass('myhidden');
                            if (checked) $("#doccheck_list9").prop('checked',true);
                            break;
                           case 9:
                            $("#doccheck_list10").attr("value",key);
                            $("#doccheck_lab10").html(key+" ("+value+")");
                            $('#doccheck_hidden10').removeClass('myhidden');
                            if (checked) $("#doccheck_list10").prop('checked',true);
                            break;
         		}
		      }
		      $i = $i+1;
         });
//
// Loop over possible returned top 10 countries
	      $i=0;   
//
// First hide them all (because we might not have 10)
   	   $('#countrycheck_hidden1').addClass('myhidden');
   	   $('#countrycheck_hidden2').addClass('myhidden');
   	   $('#countrycheck_hidden3').addClass('myhidden');
   	   $('#countrycheck_hidden4').addClass('myhidden');
   	   $('#countrycheck_hidden5').addClass('myhidden');
   	   $('#countrycheck_hidden6').addClass('myhidden');
   	   $('#countrycheck_hidden7').addClass('myhidden');
   	   $('#countrycheck_hidden8').addClass('myhidden');
   	   $('#countrycheck_hidden9').addClass('myhidden');
   	   $('#countrycheck_hidden10').addClass('myhidden');
//
// Now loop over the returned ones and set the labels and unhide them
   	   $.each(jsonResp.iCountryData, function(key, value) { 
     		   //console.log(key);
   		   //console.log(value);
// key is the key
// value is the value
	         if (value > 0) {
                        checked = false;
                        for (var ic=0, tot=checkedCountries.length; (ic<tot) && (!checked); ic++) {
                           if (key == checkedCountries[ic]) {
                                checked = true;
                           }
                        }
         		switch($i) {
         		  case 0: 
         		   $("#countrycheck_list1").attr("value",key);
         		   $("#countrycheck_lab1").html(key+" ("+value+")");
           		   $('#countrycheck_hidden1').removeClass('myhidden');
                            if (checked) $("#countrycheck_list1").prop('checked',true);
         		   break;
                           case 1:
                            $("#countrycheck_list2").attr("value",key);
                            $("#countrycheck_lab2").html(key+" ("+value+")");
                            $('#countrycheck_hidden2').removeClass('myhidden');
                            if (checked) $("#countrycheck_list2").prop('checked',true);
                            break;
                           case 2:
                            $("#countrycheck_list3").attr("value",key);
                            $("#countrycheck_lab3").html(key+" ("+value+")");
                            $('#countrycheck_hidden3').removeClass('myhidden');
                            if (checked) $("#countrycheck_list3").prop('checked',true);
                            break;
                           case 3:
                            $("#countrycheck_list4").attr("value",key);
                            $("#countrycheck_lab4").html(key+" ("+value+")");
                            $('#countrycheck_hidden4').removeClass('myhidden');
                            if (checked) $("#countrycheck_list4").prop('checked',true);
                            break;
                           case 4:
                            $("#countrycheck_list5").attr("value",key);
                            $("#countrycheck_lab5").html(key+" ("+value+")");
                            $('#countrycheck_hidden5').removeClass('myhidden');
                            if (checked) $("#countrycheck_list5").prop('checked',true);
                            break;
                           case 5:
                            $("#countrycheck_list6").attr("value",key);
                            $("#countrycheck_lab6").html(key+" ("+value+")");
                            $('#countrycheck_hidden6').removeClass('myhidden');
                            if (checked) $("#countrycheck_list6").prop('checked',true);
                            break;
                           case 6:
                            $("#countrycheck_list7").attr("value",key);
                            $("#countrycheck_lab7").html(key+" ("+value+")");
                            $('#countrycheck_hidden7').removeClass('myhidden');
                            if (checked) $("#countrycheck_list7").prop('checked',true);
                            break;
                           case 7:
                            $("#countrycheck_list8").attr("value",key);
                            $("#countrycheck_lab8").html(key+" ("+value+")");
                            $('#countrycheck_hidden8').removeClass('myhidden');
                            if (checked) $("#countrycheck_list8").prop('checked',true);
                            break;
                           case 8:
                            $("#countrycheck_list9").attr("value",key);
                            $("#countrycheck_lab9").html(key+" ("+value+")");
                            $('#countrycheck_hidden9').removeClass('myhidden');
                            if (checked) $("#countrycheck_list9").prop('checked',true);
                            break;
                           case 9:
                            $("#countrycheck_list10").attr("value",key);
                            $("#countrycheck_lab10").html(key+" ("+value+")");
                            $('#countrycheck_hidden10').removeClass('myhidden');
                            if (checked) $("#countrycheck_list10").prop('checked',true);
                            break;
         		}
		      }
		      $i = $i+1;
         });
//
// Loop over possible returned top 10 topics
	      $i=0;   
//
// First hide them all (because we might not have 10)
   	   $('#topiccheck_hidden1').addClass('myhidden');
   	   $('#topiccheck_hidden2').addClass('myhidden');
   	   $('#topiccheck_hidden3').addClass('myhidden');
   	   $('#topiccheck_hidden4').addClass('myhidden');
   	   $('#topiccheck_hidden5').addClass('myhidden');
   	   $('#topiccheck_hidden6').addClass('myhidden');
   	   $('#topiccheck_hidden7').addClass('myhidden');
   	   $('#topiccheck_hidden8').addClass('myhidden');
   	   $('#topiccheck_hidden9').addClass('myhidden');
   	   $('#topiccheck_hidden10').addClass('myhidden');
//
// Now loop over the returned ones and set the labels and unhide them
   	   $.each(jsonResp.iTopicData, function(key, value) { 
     		   //console.log(key);
   		   //console.log(value);
// key is the key
// value is the value
	         if (value > 0) {
                        checked = false;
                        for (var ic=0, tot=checkedTopics.length; (ic<tot) && (!checked); ic++) {
                           if (key == checkedTopics[ic]) {
                                checked = true;
                           }
                        }
         		switch($i) {
         		  case 0: 
         		   $("#topiccheck_list1").attr("value",key);
         		   $("#topiccheck_lab1").html(key+" ("+value+")");
           		   $('#topiccheck_hidden1').removeClass('myhidden');
                            if (checked) $("#topiccheck_list1").prop('checked',true);
         		   break;
                           case 1:
                            $("#topiccheck_list2").attr("value",key);
                            $("#topiccheck_lab2").html(key+" ("+value+")");
                            $('#topiccheck_hidden2').removeClass('myhidden');
                            if (checked) $("#topiccheck_list2").prop('checked',true);
                            break;
                           case 2:
                            $("#topiccheck_list3").attr("value",key);
                            $("#topiccheck_lab3").html(key+" ("+value+")");
                            $('#topiccheck_hidden3').removeClass('myhidden');
                            if (checked) $("#topiccheck_list3").prop('checked',true);
                            break;
                           case 3:
                            $("#topiccheck_list4").attr("value",key);
                            $("#topiccheck_lab4").html(key+" ("+value+")");
                            $('#topiccheck_hidden4').removeClass('myhidden');
                            if (checked) $("#topiccheck_list4").prop('checked',true);
                            break;
                           case 4:
                            $("#topiccheck_list5").attr("value",key);
                            $("#topiccheck_lab5").html(key+" ("+value+")");
                            $('#topiccheck_hidden5').removeClass('myhidden');
                            if (checked) $("#topiccheck_list5").prop('checked',true);
                            break;
                           case 5:
                            $("#topiccheck_list6").attr("value",key);
                            $("#topiccheck_lab6").html(key+" ("+value+")");
                            $('#topiccheck_hidden6').removeClass('myhidden');
                            if (checked) $("#topiccheck_list6").prop('checked',true);
                            break;
                           case 6:
                            $("#topiccheck_list7").attr("value",key);
                            $("#topiccheck_lab7").html(key+" ("+value+")");
                            $('#topiccheck_hidden7').removeClass('myhidden');
                            if (checked) $("#topiccheck_list7").prop('checked',true);
                            break;
                           case 7:
                            $("#topiccheck_list8").attr("value",key);
                            $("#topiccheck_lab8").html(key+" ("+value+")");
                            $('#topiccheck_hidden8').removeClass('myhidden');
                            if (checked) $("#topiccheck_list8").prop('checked',true);
                            break;
                           case 8:
                            $("#topiccheck_list9").attr("value",key);
                            $("#topiccheck_lab9").html(key+" ("+value+")");
                            $('#topiccheck_hidden9').removeClass('myhidden');
                            if (checked) $("#topiccheck_list9").prop('checked',true);
                            break;
                           case 9:
                            $("#topiccheck_list10").attr("value",key);
                            $("#topiccheck_lab10").html(key+" ("+value+")");
                            $('#topiccheck_hidden10').removeClass('myhidden');
                            if (checked) $("#topiccheck_list10").prop('checked',true);
                            break;
         		}
		      }
		      $i = $i+1;
         });
	    
//
// Set the max/min
//           $yearMin = jsonResp.iYearData[1];
//           $yearMax = jsonResp.iYearData[0];
         $yearMax = 2020;
         $yearMin = 1990;
         if (!jsonResp.iYearData[0]) {
         } else {
           $yearMax = jsonResp.iYearData[0];
         }
         if (!jsonResp.iYearData[1]) {
         } else {
            $yearMin = jsonResp.iYearData[1];
         }
//         console.log("yearmin,max");
//         console.log($yearMax);
//         console.log($yearMin);

           if ($yearMin == $yearMax) $yearMax = parseInt($yearMin) + 1;
           $("#range").data("ionRangeSlider").update({min: $yearMin});
           $("#range").data("ionRangeSlider").update({from: $yearMin});
           $("#range").data("ionRangeSlider").update({max: $yearMax});
           $("#range").data("ionRangeSlider").update({to: $yearMax});
   },
   "columnDefs": [
               {
                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function ( data, type, row ) {
                    str1 = row[11];
                    str1 = str1.replace(/;/ig," ");
                    str1 = str1.replace(/,/ig," ");

                  if (data == "Grant") {
		    str2 = row[12];
		    str2 = str2.replace(/;/ig," ");
		    str2 = str2.replace(/,/ig," ");
		    //str = "test";
                    return data +' ('+ str1+'/' + str2 +')';
//                    return data +' ('+ row[11]+'/' + str +')';
                  } else {
                    return data +' ('+ str1+')';
                  }
                },
                "targets": 0
                },            
               {
                 // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function ( data, type, row ) {
                  return '<a href="' + row[13] + '" target="_blank">' + data + '</a>';
                },
                "targets": 3
                },
               {
                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function ( data, type, row ) {
                  return '<a href="instData.php?instName=' + data + '" target="_blank">' + data + '</a>';
                  //  dataEscaped = data.replace(/&/g,';AND;');
                  //  dataEscaped = dataEscaped.replace(';amp;',';');
                  //  return '<a href="instData.php?instName=' + dataEscaped + '">' + data + '</a>';
                },
                "targets": 5
                },
               {
                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function ( data, type, row ) {
		    if (data == 0) {
			return data;
		    } else {
                       ind = row[15];
                       return '<a href="docSimilarData.php?unifiedIndex=' + ind + '" target="_blank">' + data + '</a>';
		   }
                },
                "targets": 10
                },
               {
                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function ( data, type, row ) {
                  if (row[0] == "Grant") {
                    return "$" + data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  } else {
                    return '';
                  }
                },
                "targets": 9
                },            
                {
//        { "bVisible": false, "aTargets": [7,8,9] }
                "targets": [ 7, 8,9, 11, 12, 13 ],
//                "targets": [ 7,8,9,10, 11, 12, 13 ],
                "visible": false,
                "searchable": true
               }
        ]
});

yadcf.init(instTable,
[
        ],
        {   externally_triggered: true}
);


//instTable.DataTable ({
//buttons: [ {
//        extend: 'columnToggle',
//        columns: 1
//    } ]
// } );

   console.log(authorMatch);
//   if (authorMatch != "ALL") {
//      console.log("filtering table");
//      console.log(authorMatch);
//      instTable.fnFilter(authorMatch,4,true);
//   }

//   if (instMatch != "ALL") {
//      console.log("filtering table");
//      console.log(instMatch);
//      instTable.fnFilter(instMatch,5,true);
//   }

}

        $('a.toggle-vis').on( 'click', function (e) {
               	e.preventDefault();

               	// Get the column API object
                var column = instTable.api().column( $(this).attr('data-column') );
//                var column = instTable.api().column(0);
		//console.log("toggle");

                // Toggle the visibility
               	//column.visible( ! column.visible() );
        } );


//new $.fn.dataTable.Buttons( instTable, {
//    buttons: [
//        {
//            extend: 'columnToggle',
//            columns: ':gt(4)'
//        }
//    ]
//} );
