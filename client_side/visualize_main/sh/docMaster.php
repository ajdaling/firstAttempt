<?php
require_once("../models/config.php");
// Request method: GET
$ajax = checkRequestMode("get");
//echo __FILE__;
if (!securePage(__FILE__)){
    apiReturnError($ajax);
}

setReferralPage(getAbsoluteDocumentPath(__FILE__));
require_once("../projectsDB/projectdb_config.php");
$projVal = 0;
if(isset($_GET['proj'])){
	$projVal = intval($_GET['proj']);
//	echo "in get proj";
} elseif (isset($_SESSION["currentProject"])){
	$projVal = $_SESSION["currentProject"];
//	echo "in session proj ".$projVal."<br>";
} else {
  //echo "proj neither ";
}
if ($projVal>$_SESSION["maxProjects"]) $projVal =  0;
//global $currentProject;
$currentProject = htmlspecialchars($projVal);
$_SESSION["currentProject"] = $currentProject;
$_SESSION["cProject"] = $currentProject;
//echo "<br> sessioncurrentProject Num (2): ".$_SESSION["currentProject"]."<br>";
$projectInfo = $_SESSION['projectInfo'];
//echo var_dump($projectInfo[$currentProject]['docTable']);
//echo "<br>currentProject Num: ".$currentProject."<br>";
//$projectInfo = $GLOBALS['projectInfo'];
//global $projectInfo;
//echo "prinfo ".$projectInfo[$currentProject]['docTable']."<br>";
//echo "prinfo ".$projectInfo[$currentProject]['projectName']."<br>";
//echo '<pre>';
//var_dump($_SESSION);
//echo '</pre>';

?>
<!DOCTYPE html>
<html lang="en">
<head><meta name="author" content="superH">
<meta name="description" content="Data Visualization">
<meta property="og:title" content="Sample Report">
<meta property="og:type" content="website">
<meta property="og:description" content="Data Visualization">
<meta property="og:url"
content="http://www.superhindex.com">
<meta property="og:image" content="http://link/test.png">
<title>Visualization Report</title>

<link rel="stylesheet" href="lib/bs_panel.css">

<style>

body{
  padding-top: 50px;
}

.divide-nav{
  height: 50px;
  background-color: #428bca;
}

.divide-text{
    color:#fff;
    line-height: 20px;
    font-size:20px;
    padding: 15px 0;
}
//div{
//    word-wrap:break-word;
////    word-break:break-all;
//}
.affix {
  top: 50px;
  width:100%;
}

.filler{
  min-height: 2000px;
}

.navbar-form {
   padding-left: 0;
}

.navbar-collapse{
   padding-left:0; 
}

.navbar {
   margin-bottom:0; 
}

.dropdown-menu li.active > a,
.dropdown-menu li.active > a:hover,
.dropdown-menu li.active > a:focus

</style>

</head>

<body>

<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/r/bs-3.3.5/jq-2.1.4,jszip-2.5.0,pdfmake-0.1.18,dt-1.10.9,b-1.0.3,b-colvis-1.0.3,b-flash-1.0.3,b-html5-1.0.3,b-print-1.0.3,cr-1.2.0,fh-3.0.0,kt-2.0.0,r-1.0.7,rr-1.0.0,sc-1.3.0,se-1.0.1/datatables.min.css"/>
<script type="text/javascript" src="https://cdn.datatables.net/r/bs-3.3.5/jq-2.1.4,jszip-2.5.0,pdfmake-0.1.18,dt-1.10.9,b-1.0.3,b-colvis-1.0.3,b-flash-1.0.3,b-html5-1.0.3,b-print-1.0.3,cr-1.2.0,fh-3.0.0,kt-2.0.0,r-1.0.7,rr-1.0.0,sc-1.3.0,se-1.0.1/datatables.min.js"></script>

<script type="text/javascript" src="yadcf-master/jquery.dataTables.yadcf.min.js"></script>
<link rel="stylesheet" href="yadcf-master/jquery.dataTables.yadcf.css">

<link rel="stylesheet" href="ion.rangeSlider-master/css/ion.rangeSlider.css">
<link rel="stylesheet" href="ion.rangeSlider-master/css/ion.rangeSlider.skinNice.css">
<script type="text/javascript" src="ion.rangeSlider-master/js/ion.rangeSlider.min.js"></script>


<script>
$(function(){
var $dateSlider = $("#range");

//function makeSlider() {
  console.log("in makeslider");  
  $dateSlider.ionRangeSlider({
            hide_min_max: true,
            keyboard: true,
            min: 2000,
            max: 2016,
            from: 2000,
            to: 2016,
            type: 'int',
            step: 1,
            prefix: "",
            grid: true
        });
});

$('.navbar-lower').affix({
  offset: {top: 50}
});

</script>

<script>

//$(function(){
// $("#divNewNotifications").on('click', 'li a', function(){
//  console.log("here drop");
//    $("#dropdownMenu1:first-child").text($(this).text());
//      $("#dropdownMenu1:first-child").val($(this).text());
////window.location.reload();
//   });
//});


</script>



<style>
.form-text{
    padding:15px 0;
}
.dataTables_info{
width:25%;
min-width:20px;
}
select {
width: 100px; 
}

.container-fluid {
    padding: 20px;
}
.yadcf-filter {
        width: 100%;
}

.yadcf-filter-wrapper {
        width: 100%;
}
.myhidden 
{
    display: none;
}

hr { 
    display: block;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    margin-left: auto;
    margin-right: auto;
    border-style: inset;
    border-width: 1px;
} 

</style>



<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">	
  
	<div class="navbar-header">
        <div class="navbar-header"><a class="navbar-brand" href="http://www.superHindex.com" target="_blank" style="display:inline-block;padding:0px"><img src="images/superHsmall.png" style="height: 44px; width:auto;"></a></div>
		<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
		<span class="sr-only">Toggle navigation</span>
		<span class="icon-bar"></span>
		<span class="icon-bar"></span>
		<span class="icon-bar"></span>
		</button>
	</div>
	
	<div class="collapse navbar-collapse">
		<ul class="nav navbar-nav pull-right">
                        <li> <a href="mailto:superHindex@gmail.com" style="display:inline-block;padding:0px;"><img src="images/mail-icon.png" style="height: 28px; width:35px;"></a>  </li>
                        <li> <a href="http://facebook.com/superHindex" target="_blank" style="display:inline-block;padding:0px;"><img src="images/facebooklogo.png" style="height: 32px; width:32px;"></a>  </li>
			<li> <a href="http://twitter.com/superHindex" target="_blank" style="display:inline-block;padding:0px;"><img src="images/twitter-bird-dark-bgs.png" style="height: 36px; width: 36px;"></a>   </li>
		</ul>
   
	</div>
</div>
<div class="navbar navbar-inverse navbar-static-top  second-navbar" role="navigation">	
	<div class="navbar-header">
		<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
		<span class="sr-only">Toggle navigation</span>
		<span class="icon-bar"></span>
		<span class="icon-bar"></span>
		<span class="icon-bar"></span>
		</button>
	</div>
	
	<div class="collapse navbar-collapse">
		
<div class="btn-group">
  <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
    Dataset 
    <span class="caret"></span>
  </button>
  <ul ID="divNewNotifications" class="dropdown-menu">
    <?php
        $projNum = 0;
        foreach ($projectInfo as $proj) {
	   echo "<li><a href=\"".parse_url($_SERVER["REQUEST_URI"],PHP_URL_PATH)."?proj=$projNum\">$proj[projectName]</a></li>";
//	   echo "<li><a href=\"https://www.superhindex.com/Accounts/templateTest/index.php?proj=$projNum\">$proj[projectName]</a></li>";
//	   echo "<li><a href=\"#\" data-value=\"$proj[projectName]\">$proj[projectName]</a></li>";
////	   echo "<li><a>$proj[projectName]</a></li>";
//	   echo "<li onclick=\"mydrop($proj[projectName]);\"> $proj[projectName]</li>";
//	   echo "<li onclick=\"mydrop($proj[projectName]);\"> $proj[projectName]</li>";
           $projNum = $projNum + 1;
	}
    ?>
  </ul>
</div>
<?php include 'navBar.php';?>
		
	</div>
</div>

<!--  -->
<!-- This row has the reset button/number selected data points, and the main title -->
<!-- <button type="button" class="btn btn-primary" onclick=filter1()>Date Filter</button> -->
<div class="container-fluid">
<div class="row"> 


   <div class="col-lg-12 id=myHead"> 
	<?php
           echo "<h1 id=\"pull-left\">Project: ".$projectInfo[$currentProject]['projectName']."</h1>";
	?>
        <h1 id="researcherName pull-left">Documents Viewer: </h1>
   </div>
 

</div>
</div>

<!--  -->
<!-- This row contains the sidebar chart and the chart vs time -->
<div class="container-fluid">
<div class="row"> 

   <div class="col-lg-2 ">            
      <div class="row btn-group" role="group" aria-label="...">
        <a href="topicsFromDoc.php" class="btn btn-info" role="button">Visualize Current Selection</a>
      </div>
      <hr>
      <div>
         <div class="row"\ id="externaly_triggered_wrapper-controls">
            <div>
               <input type="button" id="my-filt" onclick="setResetVal(0);yadcf.exFilterExternallyTriggered(instTable);" value="Filter" class="some_btn general_btn">
               <input type="button" onclick="setResetVal(1);yadcf.exFilterExternallyTriggered(instTable);" value="Reset" class="some_btn general_btn">
            </div>
         </div>

      </div>
      <hr>
      <div> 
         <span>
            <div class="row control-group input-large">
            <label for="usr">Title/Abstract Search:</label>
            <input type="text" style="height:30px;" class="form-control input-large" placeholder='"term1" "term2"' id="titleAbstractSearch">
            </div>
         </span>
      </div>
      <hr>
      <div>
         <span>
            <div class="row form-group">
               <label for="usr1">Author(s) Search:</label>
               <input type="text" style="height:30px;" class="form-control"  placeholder='"a1" "a2"' id="authorSearch">
               <label class="heading">Top Authors:</label><br>
               <div id="authcheck_hidden1" class="myhidden"> <input type="checkbox" id="authcheck_list1" name="authcheck_list[]" value="a1"><label id="authcheck_lab1"></label><br/></div>
               <div id="authcheck_hidden2" class="myhidden"> <input type="checkbox" id="authcheck_list2" name="authcheck_list[]" value="a1"><label id="authcheck_lab2"></label><br/></div>
               <div id="authcheck_hidden3" class="myhidden"> <input type="checkbox" id="authcheck_list3" name="authcheck_list[]" value="a1"><label id="authcheck_lab3"></label><br/></div>
               <div id="authcheck_hidden4" class="myhidden"> <input type="checkbox" id="authcheck_list4" name="authcheck_list[]" value="a1"><label id="authcheck_lab4"></label><br/></div>
               <div id="authcheck_hidden5" class="myhidden"> <input type="checkbox" id="authcheck_list5" name="authcheck_list[]" value="a1"><label id="authcheck_lab5"></label><br/></div>
               <div id="authcheck_hidden6" class="myhidden"> <input type="checkbox" id="authcheck_list6" name="authcheck_list[]" value="a1"><label id="authcheck_lab6"></label><br/></div>
               <div id="authcheck_hidden7" class="myhidden"> <input type="checkbox" id="authcheck_list7" name="authcheck_list[]" value="a1"><label id="authcheck_lab7"></label><br/></div>
               <div id="authcheck_hidden8" class="myhidden"> <input type="checkbox" id="authcheck_list8" name="authcheck_list[]" value="a1"><label id="authcheck_lab8"></label><br/></div>
               <div id="authcheck_hidden9" class="myhidden"> <input type="checkbox" id="authcheck_list9" name="authcheck_list[]" value="a1"><label id="authcheck_lab9"></label><br/></div>
               <div id="authcheck_hidden10" class="myhidden"> <input type="checkbox" id="authcheck_list10" name="authcheck_list[]" value="a1"><label id="authcheck_lab10"></label><br/></div>
            </div>
         </span>
      </div>
      <hr>

      <div>
         <span>
            <div class="row form-group">
               <label for="usr1">Institutions(s) Search:</label>
               <input type="text" style="height:30px;" class="form-control"  placeholder='"i1" "i2"' id="instSearch">
               <label class="heading">Top Institutions:</label><br>
               <div id="instcheck_hidden1" class="myhidden"> <input type="checkbox" id="instcheck_list1" name="instcheck_list[]" value="a1"><label id="instcheck_lab1"></label><br/></div>
               <div id="instcheck_hidden2" class="myhidden"> <input type="checkbox" id="instcheck_list2" name="instcheck_list[]" value="a1"><label id="instcheck_lab2"></label><br/></div>
               <div id="instcheck_hidden3" class="myhidden"> <input type="checkbox" id="instcheck_list3" name="instcheck_list[]" value="a1"><label id="instcheck_lab3"></label><br/></div>
               <div id="instcheck_hidden4" class="myhidden"> <input type="checkbox" id="instcheck_list4" name="instcheck_list[]" value="a1"><label id="instcheck_lab4"></label><br/></div>
               <div id="instcheck_hidden5" class="myhidden"> <input type="checkbox" id="instcheck_list5" name="instcheck_list[]" value="a1"><label id="instcheck_lab5"></label><br/></div>
               <div id="instcheck_hidden6" class="myhidden"> <input type="checkbox" id="instcheck_list6" name="instcheck_list[]" value="a1"><label id="instcheck_lab6"></label><br/></div>
               <div id="instcheck_hidden7" class="myhidden"> <input type="checkbox" id="instcheck_list7" name="instcheck_list[]" value="a1"><label id="instcheck_lab7"></label><br/></div>
               <div id="instcheck_hidden8" class="myhidden"> <input type="checkbox" id="instcheck_list8" name="instcheck_list[]" value="a1"><label id="instcheck_lab8"></label><br/></div>
               <div id="instcheck_hidden9" class="myhidden"> <input type="checkbox" id="instcheck_list9" name="instcheck_list[]" value="a1"><label id="instcheck_lab9"></label><br/></div>
               <div id="instcheck_hidden10" class="myhidden"> <input type="checkbox" id="instcheck_list10" name="instcheck_list[]" value="a1"><label id="instcheck_lab10"></label><br/></div>
            </div>
         </span>
      </div>

      <hr>
      <div>
         <span>
            <div class="row form-group">
               <label for="usr1">DocType(s) Search:</label>
               <input type="text" style="height:30px;" class="form-control"  placeholder='doc1;doc2;...' id="docSearch">
               <label class="heading">DocTypes:</label><br>
               <div id="doccheck_hidden1" class="myhidden"> <input type="checkbox" id="doccheck_list1" name="doccheck_list[]" value="a1"><label id="doccheck_lab1"></label><br/></div>
               <div id="doccheck_hidden2" class="myhidden"> <input type="checkbox" id="doccheck_list2" name="doccheck_list[]" value="a1"><label id="doccheck_lab2"></label><br/></div>
               <div id="doccheck_hidden3" class="myhidden"> <input type="checkbox" id="doccheck_list3" name="doccheck_list[]" value="a1"><label id="doccheck_lab3"></label><br/></div>
               <div id="doccheck_hidden4" class="myhidden"> <input type="checkbox" id="doccheck_list4" name="doccheck_list[]" value="a1"><label id="doccheck_lab4"></label><br/></div>
               <div id="doccheck_hidden5" class="myhidden"> <input type="checkbox" id="doccheck_list5" name="doccheck_list[]" value="a1"><label id="doccheck_lab5"></label><br/></div>          
            </div>
         </span>
      </div>
      <hr>

      <div>
         <span>
            <div class="row form-group">
               <label for="usr1">Countries(s) Search:</label>
               <input type="text" style="height:30px;" class="form-control"  placeholder='country1;country2;...'  id="countrySearch">
               <label class="heading">Top Countries:</label><br>
               <div id="countrycheck_hidden1" class="myhidden"> <input type="checkbox" id="countrycheck_list1" name="countrycheck_list[]" value="a1"><label id="countrycheck_lab1"></label><br/></div>
               <div id="countrycheck_hidden2" class="myhidden"> <input type="checkbox" id="countrycheck_list2" name="countrycheck_list[]" value="a1"><label id="countrycheck_lab2"></label><br/></div>
               <div id="countrycheck_hidden3" class="myhidden"> <input type="checkbox" id="countrycheck_list3" name="countrycheck_list[]" value="a1"><label id="countrycheck_lab3"></label><br/></div>
               <div id="countrycheck_hidden4" class="myhidden"> <input type="checkbox" id="countrycheck_list4" name="countrycheck_list[]" value="a1"><label id="countrycheck_lab4"></label><br/></div>
               <div id="countrycheck_hidden5" class="myhidden"> <input type="checkbox" id="countrycheck_list5" name="countrycheck_list[]" value="a1"><label id="countrycheck_lab5"></label><br/></div>
               <div id="countrycheck_hidden6" class="myhidden"> <input type="checkbox" id="countrycheck_list6" name="countrycheck_list[]" value="a1"><label id="countrycheck_lab6"></label><br/></div>
               <div id="countrycheck_hidden7" class="myhidden"> <input type="checkbox" id="countrycheck_list7" name="countrycheck_list[]" value="a1"><label id="countrycheck_lab7"></label><br/></div>
               <div id="countrycheck_hidden8" class="myhidden"> <input type="checkbox" id="countrycheck_list8" name="countrycheck_list[]" value="a1"><label id="countrycheck_lab8"></label><br/></div>
               <div id="countrycheck_hidden9" class="myhidden"> <input type="checkbox" id="countrycheck_list9" name="countrycheck_list[]" value="a1"><label id="countrycheck_lab9"></label><br/></div>
               <div id="countrycheck_hidden10" class="myhidden"> <input type="checkbox" id="countrycheck_list10" name="countrycheck_list[]" value="a1"><label id="countrycheck_lab10"></label><br/></div>
            </div>
         </span>
      </div>
      <hr>

      <div>
         <span>
            <div class="row form-group">
               <label for="usr1">Topics(s) Search:</label>
               <input type="text" style="height:30px;" class="form-control"  placeholder='topic1;topic2;...' id="topicSearch">
               <label class="heading">Top Topics:</label><br>
               <div id="topiccheck_hidden1" class="myhidden"> <input type="checkbox" id="topiccheck_list1" name="topiccheck_list[]" value="a1"><label id="topiccheck_lab1"></label><br/></div>
               <div id="topiccheck_hidden2" class="myhidden"> <input type="checkbox" id="topiccheck_list2" name="topiccheck_list[]" value="a1"><label id="topiccheck_lab2"></label><br/></div>
               <div id="topiccheck_hidden3" class="myhidden"> <input type="checkbox" id="topiccheck_list3" name="topiccheck_list[]" value="a1"><label id="topiccheck_lab3"></label><br/></div>
               <div id="topiccheck_hidden4" class="myhidden"> <input type="checkbox" id="topiccheck_list4" name="topiccheck_list[]" value="a1"><label id="topiccheck_lab4"></label><br/></div>
               <div id="topiccheck_hidden5" class="myhidden"> <input type="checkbox" id="topiccheck_list5" name="topiccheck_list[]" value="a1"><label id="topiccheck_lab5"></label><br/></div>
               <div id="topiccheck_hidden6" class="myhidden"> <input type="checkbox" id="topiccheck_list6" name="topiccheck_list[]" value="a1"><label id="topiccheck_lab6"></label><br/></div>
               <div id="topiccheck_hidden7" class="myhidden"> <input type="checkbox" id="topiccheck_list7" name="topiccheck_list[]" value="a1"><label id="topiccheck_lab7"></label><br/></div>
               <div id="topiccheck_hidden8" class="myhidden"> <input type="checkbox" id="topiccheck_list8" name="topiccheck_list[]" value="a1"><label id="topiccheck_lab8"></label><br/></div>
               <div id="topiccheck_hidden9" class="myhidden"> <input type="checkbox" id="topiccheck_list9" name="topiccheck_list[]" value="a1"><label id="topiccheck_lab9"></label><br/></div>
               <div id="topiccheck_hidden10" class="myhidden"> <input type="checkbox" id="topiccheck_list10" name="topiccheck_list[]" value="a1"><label id="topiccheck_lab10"></label><br/></div>
            </div>
         </span>
      </div>

      <hr>
 
      <div>
         <span>
            <div class="row" >
               <span><label for="usr">Document Year Range</label></span>
               <span><input type="text" id="range" value="" /></span>
            </div>
         </span>
      </div>
   </div>

   <div class="col-lg-10">            

         <div class="panel panel-primary">
         <div class="panel-heading"><strong>Document Information  </strong></div>
         <table id="auth-master-table" class="display table-bordered table-hover table-condensed dt-right">
             <thead>
             <tr class="header">
                 <th rowspan="2">Type</th>
                 <th rowspan="2">Topics</th>
                 <th rowspan="2">Date</th>
                 <th rowspan="2">Title</th>
                 <th rowspan="2">Authors</th>
                 <th rowspan="2">Institution</th>
                 <th rowspan="2">Country</th>
                 <th colspan="2">Citations</th>
                 <th rowspan="2">Award</th>
                 <th rowspan="2">Similar</th>
             </tr>
             <tr class="header">
                 <th>Pubs</th>
                 <th>Patents</th>
             </tr>
             </thead>
         </table>
         </div>
         </div>
   </div><!--span10 -->


</div><!--row -->
</div><!--/container- -->
 
<script src="docMasterNew.js"></script>

</body>

<script>
function getUrlVars() {
   var vars = {};
   var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
   function(m,key,value) {
   vars[key] = value;
   });
   return vars;
}
function setGetParameter(paramName, paramValue)
{
    var url = window.location.href;
    if (url.indexOf(paramName + "=") >= 0)
    {
        var prefix = url.substring(0, url.indexOf(paramName));
        var suffix = url.substring(url.indexOf(paramName));
        suffix = suffix.substring(suffix.indexOf("=") + 1);
        suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
        url = prefix + paramName + "=" + paramValue + suffix;
    }
    else
    {
    if (url.indexOf("?") < 0)
        url += "?" + paramName + "=" + paramValue;
    else
        url += "&" + paramName + "=" + paramValue;
    }
    window.location.href = url;
}

var authorList = getUrlVars()["authors"];
if (authorList == undefined) authorList = "ALL";
var instList = getUrlVars()["inst"];
if (instList == undefined) instList = "ALL";
console.log(authorList);

masterProcessFile(authorList,instList);

</script>

</html>
