<?php
require_once("../models/config.php");
require_once('sdb_functions.php');
// Request method: GET
$ajax = checkRequestMode("get");
//echo __FILE__;
if (!securePage(__FILE__)){
    apiReturnError($ajax);
}

setReferralPage(getAbsoluteDocumentPath(__FILE__));
require_once("../projectsDB/projectdb_config.php");

$thisWhere = "";

if (isset($_SESSION["docWhere"])){
        $thisWhere = $_SESSION["docWhere"];
        //echo "in session proj ".$projVal."<br>";
}


$projVal = 0;
if(isset($_GET['proj'])){
        $projVal = intval($_GET['proj']);
} elseif (isset($_SESSION["currentProject"])){
        $projVal = $_SESSION["currentProject"];
}
if ($projVal>$_SESSION["maxProjects"]) $projVal =  0;
//global $currentProject;
$currentProject = htmlspecialchars($projVal);
$_SESSION["currentProject"] = $currentProject;
$projectInfo = $_SESSION['projectInfo'];

$table = $projectInfo[$currentProject]['docTable'];
//
// Get the last update date for this project
$sel = 'SELECT lastDate from sh_projectDB where docTable like "'.$projectInfo[$currentProject]['docTable'].'"';
$rows = sdb_select($sel);
$numRows = count($rows);
   //
   // If there are no rows then go to index page
$lastDate = "2015-Nov-1";
if($numRows > 0) {
   $row = $rows[0];
   $lastDate = $row['lastDate'];
}

//echo '<pre>';
//echo "docTable: ".$table."<br>";
//echo "where: ".$thisWhere."<br>";
//echo '</pre>';
//
// Set memory limit for this script
ini_set('memory_limit','512M');


//$cols = " unifiedIndex,topicN,topicDesc,topicScore,State,latitude,CountryCode,
//Title,Doctype,BeginDate,InstitutionFixedNew,Addr,year(BeginDate) as year,
//longitude,AuthorsFixedNew,AwardAmount,PDFLink,
//ArticleCitationCount,OriginName ";
$cols = " unifiedIndex,topicN,topicDesc,topicScore,State,CountryCode,
Title,Doctype,BeginDate,InstitutionFixedNew,Addr,year(BeginDate) as year,
AuthorsFixedNew,AwardAmount,PDFLink,
ArticleCitationCount,OriginName,AuthorsRankSum,AuthorsRankMax,InstitutionRankSum,InstitutionRankMax ";
$thisWhere = "";
$sel = 'SELECT '.$cols.' from '.$table;
//
// Did we pass the string via a sel string?
$selI = "";
$userWhere = "";
if(isset($_GET['inst'])) {
	$selI = "match(InstitutionFixedNew) against('".$_GET['inst']."' in boolean mode)";
//	echo "selI: ".$selI."<br>";
	$userWhere = $selI;
}
$selT = "";
if(isset($_GET['topic'])) {
        $selT = "topicDesc like ".$_GET['topic'];
//        echo "selT: ".$selT."<br>";
	if (strlen($userWhere) > 0) {
	   $userWhere = $userWhere." AND ".$selT;
	} else {
	   $userWhere = $selT;
	}
}
$selC = "";
if(isset($_GET['country'])) {
        $selC = "Country like ".$_GET['country'];
//        echo "selC: ".$selC."<br>";
        if (strlen($userWhere) > 0) {
           $userWhere = $userWhere." AND ".$selC;
        } else {
           $userWhere = $selC;
        }
}
//if (strlen($userWhere) > 0) echo "userWhere: ".$userWhere."<br>";

//&& !empty($_GET['userSel'])){
//$userSel = $_GET['userSel'];
//if(strlen($userSel) > 0) {
//   $userSel=mysql_real_escape_string($userSel);
//   echo "userSel: ".$userSel."<br>";
//}
//}
//
if (strlen($userWhere) > 0) {
	$thisWhere = $userWhere;
	$sel = 'SELECT '.$cols.' from '.$table.' where '.$thisWhere;
} else if (isset($_SESSION["docWhere"]) && !empty($_SESSION["docWhere"])){
        $thisWhere = $_SESSION["docWhere"];
        $sel = 'SELECT '.$cols.' from '.$table.' where '.$thisWhere;
        //echo "in session proj ".$projVal."<br>";
	//echo $thisWhere."<br>";
}
//echo "sel:   ".$sel."<br>";
//echo "mysel: ".$mysel."<br>";

//$rows = sdb_select($sel);
$dbResult = sdb_query($sel);

//echo "$dbResult ".$dbResult."<br>";
$results = array();
$id = 0;
//while($row = mysql_fetch_array($dbResult))
while ($row = mysqli_fetch_assoc($dbResult))
{
//   echo $row['unifiedIndex']."<br>";
//   echo $row['topicN']."<br>";
//   echo $row['topicDesc']."<br>";
//   echo $row['topicScore']."<br>";
//   echo $row['topicN']."<br>";
   $topicNs = explode(";",rtrim($row['topicN'],'; '));
//   echo count($topicNs)."<br>";
   $topicDescs = explode(";",rtrim($row['topicDesc'],'; '));
   $topicScores = explode(";",rtrim($row['topicScore'],'; '));
   $imax = 0;
   $topicScoreMax = 0.0;
   for ($i=0; $i<count($topicNs); ++$i) {
      $topicN = rtrim($topicNs[$i]);
      $topicStage = "Topic".$topicN;
      $topicDesc = "Topic".$topicN.": ".$topicDescs[$i];
      $topicScore = $topicScores[$i];
      if ($topicScore > $topicScoreMax) {
         $topicScoreMax = $topicScore;
         $imax = $i;
      }
   }
      $topicN = trim($topicNs[$imax]);
      $topicStage = "Topic".$topicN;
      $topicDesc = "Topic".$topicN.": ".trim($topicDescs[$imax]);
      $topicScore = $topicScores[$imax];
      //echo "Topic ".$topicDesc."<br>";
      $subTopicCategory = 0;
      if ($row['Doctype'] == "Grant") {
         $subTopicCategory = 0;
      } else if ($row['Doctype'] == "Patent") {
         $subTopicCategory	= 1;
      } else if ($row['Doctype'] == "Publication") {
         $subTopicCategory	= 2;
      }

      $results[] = array(
      'State' => htmlspecialchars(utf8_encode($row['State'])),
      'Score' => 1.0,
//      'Latitude' => $row['latitude'],
      'id' => $id,
      'CountryCode' => htmlspecialchars(utf8_encode($row['CountryCode'])),
//      'title' => utf8_encode($row['Title']),
      'subTopicPhrase' => $row['Doctype'],
      'TopicNum' => $topicN,
      'event_date' => $row['BeginDate'],
//      'Institution' => htmlspecialchars(utf8_encode($row['InstitutionFixedNew'])),
      'Institution' => $row['InstitutionFixedNew'],
      'superID' => $id,
      'Address' => utf8_encode($row['Addr']),
      'event_year' => $row['year'],
//      'Longitude' => $row['longitude'],
      'authors' => htmlspecialchars(utf8_encode($row['AuthorsFixedNew'])),
      'stage' => $topicStage,
      'AwardAmount' => $row['AwardAmount'],
      'Weight' => 1.0,
      'AuthorRankMax' => $row['AuthorsRankMax'],
      'AuthorRankSum' => $row['AuthorsRankSum'],
      'InstitutionRankMax' => $row['InstitutionRankMax'],
      'InstitutionRankSum' => $row['InstitutionRankSum'],
//      'url' => "temp",
      'url' => htmlspecialchars(utf8_encode($row['PDFLink'])),
      'subTopicCategory' => $subTopicCategory,
      'ArticleCitationCount' => $row['ArticleCitationCount'],
      'Topic' => $topicDesc,
      'Program' => htmlspecialchars(utf8_encode($row['OriginName'])),
      'CombinedYearScore' => 1.0
     );
      //     echo "ID: ".$id." index ".$row['unifiedIndex']."<br>";
//      echo json_encode($results[$id])."<br>";
//
// REH
//     $id = $id + 1;     
//   }
    $id = $id + 1;
}


//echo "docTable: ".$table."<br>";
//echo "select:   ".$sel."<br>";

//$json_data =  gzcompress(json_encode($results));
$json_data = json_encode($results);
//echo "json_data ".$json_data."<br>";

//$data = implode("", file("bigfile.txt"));
//$gzdata = gzencode($json_data, 9);
//$fp = fopen("bigfile.txt.gz", "wb");
//fwrite($fp, $gzdata);
//fclose($fp);
//echo "zipped file <br>";

//$json_data =  json_encode($results);
//echo "json_data ".$json_data."<br>";
//$_SESSION["json_data"] = $json_data;

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
<meta property="og:image"
content="http://link/test.png">
<title>Visualization Report</title>



<link rel="stylesheet" href="stylesheets/reset.css">

<link type="text/css" href="lib/dc.css" rel="stylesheet"/>
<link type="text/css" rel="stylesheet" href="lib/colorbrewer.css"/>
  <style>
    #holder {
      width:850px;
      margin:20px auto;
    }
    #holder>div {
      padding:30px 0;
      clear:both;
    }
    .map {
      width:600px;
      height:400px;
    }
    .pie {
      margin-left:30px;
    }
  </style>
<link rel="stylesheet" href="myChart.css">


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
<script src="lib/jszip.min.js"></script>
<script src="javascript/moment.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.5.3/d3.min.js"></script>
<script src="lib/d3/queue.min.js"></script>
<script src="lib/crossfilter/js/crossfilter.min.js"></script>
<script src="lib/colorbrewer.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/topojson/1.6.9/topojson.min.js"></script>
<script src="datamaps.usa.js"></script>
<script src="lib/pako.js"></script>
<script src="lib/dc.js"></script>
<!-- <script src="d3-tip.js"></script> -->

<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/r/bs-3.3.5/jq-2.1.4,jszip-2.5.0,pdfmake-0.1.18,dt-1.10.9,b-1.0.3,b-colvis-1.0.3,b-flash-1.0.3,b-html5-1.0.3,b-print-1.0.3,cr-1.2.0,fh-3.0.0,kt-2.0.0,r-1.0.7,rr-1.0.0,sc-1.3.0,se-1.0.1/datatables.min.css"/>
<script type="text/javascript" src="https://cdn.datatables.net/r/bs-3.3.5/jq-2.1.4,jszip-2.5.0,pdfmake-0.1.18,dt-1.10.9,b-1.0.3,b-colvis-1.0.3,b-flash-1.0.3,b-html5-1.0.3,b-print-1.0.3,cr-1.2.0,fh-3.0.0,kt-2.0.0,r-1.0.7,rr-1.0.0,sc-1.3.0,se-1.0.1/datatables.min.js"></script>

<script type="text/javascript" src="yadcf-master/jquery.dataTables.yadcf.min.js"></script>
<link rel="stylesheet" href="yadcf-master/jquery.dataTables.yadcf.css">


<script>
$('.navbar-lower').affix({
  offset: {top: 50}
});

</script>

  <style>


div.tooltip {
  position: absolute;
  text-align: center;
  padding: 2px;
  font: 13px sans-serif;
  background-color: #FFF;
/*  background: lightsteelblue; */
  border: 1px solid #CCC;
  border-radius: 8px;
  box-shadow: 1px 1px 5px #CCC;
  
/*   pointer-events: none;      This line needs to be removed  */
}




.dataTables_info{
   width:25%;
   min-width:20px;
}
select {
  width: 100px; 
}

.form-text{
    padding:15px 0;
}
.dataTables_info{
width:25%;
min-width:20px;
}
.list-inline {
  padding-left: 0;
  list-style: none;
}


li.key {
  border-top-width: 15px;
  border-top-style: solid;
  font-size: .75em;
  width: 20%;
  padding-left: 0;
  padding-right: 0;
}
.list-inline>li {
 display: inline-block;
 padding-right: 0px;
 padding-left: 0px;
 text-align: left;
}

select {
width: 100px;
}

.container-fluid {
    padding: 10px;
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
//           echo "<li><a href=\"".parse_url($_SERVER["REQUEST_URI"],PHP_URL_PATH)."?proj=$projNum\">$proj[projectName]</a></li>";
           echo "<li><a href=\"docMaster.php?proj=$projNum\">$proj[projectName]</a></li>";
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

<div class="container">
<div class="row"> 

   <div class="col-lg-3"> 
      <a href="javascript:dc.filterAll('topics');dc.redrawAll('topics');RefreshMap();"><button type="button" class="btn btn-small btn-primary">Reset All Filters</button></a>

      <div class="dc-data-count" id="target-data-count">
        <span class="filter-count"></span> selected out of <span class="total-count"></span> records 
      </div>
   </div>
 
   <div class="col-lg-9"> 
      <div id="logo">
         <div align="center">
            <h3><span class='headerTitle'>  </span></h3>
            <h4>Prepared by: <span class='reportAuthor'> report author </span> on <?php echo $lastDate?></span>.</h4>
         </div>
      </div>
   </div>

</div>
</div>




<!--  -->
<!-- This row contains the sidebar chart and the chart vs time -->
<div class="container">
<div class="row"> 

   <div class="col-lg-3"> 
      <div id="subtop-chart"> 
      <strong>DocType</strong> <span><a id="popover_subtopics" data-delay2000 data-title="Document Type" 
data-html="true" data-toggle="popover" data-placement="right" data-trigger="hover" 
data-content="Documents are classified as patent, grant, or publication."
 class="popover-link"> <i class="icon-info-sign"></i></a>
</span> 
(click to select/deselect)
      <a class="reset" href="javascript:subtopChart.filterAll('topics');dc.redrawAll('topics');RefreshMap();" style="display: none;">reset</a>
      <div class="clearfix"></div>
      </div>      
   </div>      

   <div class="col-lg-3"> 
      <div id="org-chart"> 
      <strong>Topics</strong> <span><a id="popover_topics" data-delay2000 data-title="Topics" 
data-html="true" data-toggle="popover" data-placement="right" data-trigger="hover" 
data-content="Documents are categorized by <strong>topic</strong> area.  A document can be assigned into
more than one topical area.  The documents are limited to those with the highest search score in each topical area."
 class="popover-link"> <i class="icon-info-sign"></i></a>
</span> 
(click to select/deselect)
      <a class="reset" href="javascript:orgChart.filterAll('topics');dc.redrawAll('topics');RefreshMap();" style="display: none;">reset</a>
      <div class="clearfix"></div>
      </div>      
   </div>      

   <div class="col-lg-6"> 
      <div id="dc-line-year">
         <center><strong>Topics vs Time</strong> 
         <span><a id="popover_top200VsTime" data-delay2000 data-title="Top Topics Vs Year" 
         data-html="true" data-toggle="popover" data-placement="right" data-trigger="hover" 
         data-content="The plot shows the top number of documents vs year broken down by topic.  The documents are limited
         to those with the highest search score over all of the years shown."
         class="popover-link"> <i class="icon-info-sign"></i></a>
         </span>
         (Drag the mouse to select a subset of years)
         <a class="reset" href="javascript:yearChart.filterAll('topics');dc.redrawAll('topics');RefreshMap();" style="display: none;">reset</a>
         </center>
         <div class="clearfix"></div>
      </div>

   </div>
 
</div><!--row -->
</div><!--/container -->
<hr><div class="container"><div class="row"><div class="col-lg-5"><div id="top-chart">
      <strong>Top Institutions</strong>
      <a class="reset" href="javascript:topChart.filterAll('topics');dc.redrawAll('topics');RefreshMap();" style="display: none;">reset</a>
        <a href=instMaster.php> <button type="button" class="btn btn-default">Detail ALL Institutions</button></a>
      <div class="clearfix"></div>
      </div>      
   </div>      

   <div class="col-lg-5"> 
<center>

      <div id="top-author-chart">
      <strong>Top Individuals</strong> 
<span><a id="popover_topindiv" data-delay2000 data-title="Ranking Top Individuals" 
data-html="true" data-toggle="popover" data-placement="right" data-trigger="hover" 
data-content="Individual groups are ranked based on their summed superH index of the 
institutions they are associated with. The superH Index is a proprietary algorithm which 
uses a variety of data to assess the importance of the researcher group in this area."
class="popover-link"> <i class="icon-info-sign"></i></a>
</span>
      (click to select/deselect)
      <a class="reset" href="javascript:topAuthorChart.filterAll('topics');dc.redrawAll('topics');RefreshMap();" style="display: none;">reset</a>
        <a href=authorMaster.php><button type="button" class="btn btn-default"> Detail ALL Authors</button></a>
      <div class="clearfix"></div>
      </div>      
   </div>      
</center>



</div><!--row -->
</div><!--/container -->
<hr>

<hr>
<div class="container">
<div class="row"> 
            <h3><span>Geographic Location of Content  </span></h3>

   <div class="col-lg-8"> 
      <div class="newmap1" style="width: 1100px; height: 500px;">
         <div id="newmap">
         </div>
      </div>
   </div><!--/span6 -->

</div><!--row -->
</div><!--/container -->

 
<script src="topicsFromDoc.js"></script>

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
console.log("here in topicsFromDoc.php");
var topicNum = getUrlVars()["topicNum"];
var docType = getUrlVars()["docType"];
// setFileName("data/master.json","data/topicsNames.csv","data/subTopicsNames.csv","data/pubsPatsGrantsVsYear.csv","Highest Rated Content Involving Hybrid/Electric in Aerospace Applications",1,topicNum,docType);
var vizdire = <?php echo json_encode ($projectInfo[$currentProject]['topicVizDir']); ?>;
var vizdir = "data/" + vizdire + "/";
// console.log(vizdir);
var ptitle = <?php echo json_encode ($projectInfo[$currentProject]['projectName']); ?>;
var ptitle = "Content Involving " + ptitle;
// console.log(ptitle);
// vizdir = "data/test";
// ptitle = "this";
// var mfile = vizdir.concat("master.json");
//var mfile = vizdir.concat("master.zip");
//var mfile = vizdir.concat("bigfile.txt.gz");
var mfile = "bigfile.txt.gz";
var tfile = vizdir.concat("topicsNames.csv");
var sfile = vizdir.concat("subTopicsNames.csv");
var pfile = vizdir.concat("pubsPatsGrantsVsYear.csv");
// console.log(vizdir);

// var json_data = decodeURIComponent("<?php //echo $json_data; ?>");
var json_data = <?php echo $json_data; ?>;
console.log("calling setDataAndFileName");
//setDataAndFileName(mfile,tfile,sfile,pfile,ptitle,1,topicNum,docType);
setDataAndFileName(json_data,tfile,sfile,pfile,ptitle,1,topicNum,docType);
</script>

</html>
