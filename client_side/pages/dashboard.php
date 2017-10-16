<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>SuperH Index</title>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>


    <link href="savedSearch.css" rel="stylesheet">
    
    <!-- plugins for header -->
    <link href="/client_side/vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="/client_side/vendor/metisMenu/metisMenu.min.css" rel="stylesheet">
    <link href="../dist/css/sb-admin-2.css" rel="stylesheet">
	<script src="/client_side/vendor/metisMenu/metisMenu.min.js"></script>
    <script src="/client_side/dist/js/sb-admin-2.js"></script>




</head>

<body>

    <div id="wrapper">

        <!-- Navigation -->
        <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="">SuperH Data Tool</a>
            </div>
            <!-- /.navbar-header -->

			<ul class="nav navbar-top-links navbar-left">
                <li class="dropdown">
                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                        <i class="fa">View</i> <i class="fa fa-caret-down"></i>
                    </a>
                    <ul class="dropdown-menu dropdown-user">
                        <li><a id = "home-link" href="/client_side/pages/dashboard.php"><i class="fa"></i> Home </a></li>
                        <li><a id = "newSearch-link" href="/client_side/newSearch/newSearch.html"><i class="fa"></i> New Search </a></li>
                        <li><a id = "docMaster-link" href="/client_side/pages/dashboard.php"><i class="fa"></i> Search Results </a></li>
                        <li><a id = "visualize-link" href="/client_side/pages/dashboard.php"><i class="fa"></i> Visualize </a></li>
                        <li><a id = "report-link" href="/client_side/pages/dashboard.php"><i class="fa"></i> Home </a></li>
                        </li>
                    </ul>
                </li>
            </ul>
            <ul class="nav navbar-top-links navbar-right">
                <li class="dropdown">
                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                        <i class="fa fa-user fa-fw"></i> <i class="fa fa-caret-down"></i>
                    </a>
                    <ul class="dropdown-menu dropdown-user">
                        <li><a href="/client_side/pages/profile.html"><i class="fa fa-user fa-fw"></i> User Profile</a>
                        </li>
                        <li><a href="#"><i class="fa fa-gear fa-fw"></i> Settings</a>
                        </li>
                        <li class="divider"></li>
                        <li><a href="/client_side/pages/login.html"><i class="fa fa-sign-out fa-fw"></i> Logout</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>

        <!-- Page Content -->
        <div id="page-wrapper">
            <div class="container-fluid">
              <div class="row">
                  <div class="col-lg-8">
                      <div class="jumbotron">
                          <h1>Welcome to your dashboard!</h1>
                          <h1>Under Construction</h1>
                          <p><a class="btn btn-primary btn-lg" role="button">Learn more</a>
                          </p>
                      </div>
                  </div>
                  <!-- /.col-lg-12 -->

                  <div class="col-lg-4">
                    <div class="panel-body">
                        <!-- Nav tabs -->
                        <ul class="nav nav-pills">
                            <li><a href="#messages-pills" data-toggle="tab">News</a>
                            </li>
                            <li><a href="#settings-pills" data-toggle="tab">Updates</a>
                            </li>
                        </ul>

                        <!-- Tab panes -->
<!--                         <div class="tab-content"> -->
<!--                             <div class="tab-pane fade" id="home-pills"> -->
<!--                                 <h4>Home Tab</h4> -->
<!--                                 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> -->
<!--                             </div> -->
<!--                             <div class="tab-pane fade" id="profile-pills"> -->
<!--                                 <h4>Profile Tab</h4> -->
<!--                                 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> -->
<!--                             </div> -->
<!--                             <div class="tab-pane fade in active" id="messages-pills"> -->
<!--                                 <h4>News Tab</h4> -->
<!--                                 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> -->
<!--                             </div> -->
<!--                             <div class="tab-pane fade" id="settings-pills"> -->
<!--                                 <h4>Updates Tab</h4> -->
<!--                                 <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> -->
<!--                             </div> -->
<!--                         </div> -->
                    </div>
                    <!-- /.panel-body -->
                  </div>
                  <!-- /.col-lg-4 -->
              </div>
              <!-- /.row -->
              <div class="row">
                  <div class="col-lg-12">
                      <div class="panel panel-default">
                          <div class="panel-heading">
                              Saved Searches
                          </div>


                          <script>
                          var tmp = {};
$(document).ready(function(){
                          $("#searchTable").on("click", 'tr', function(event){
                          //  alert("Search Name Field = " + $(this).children('td:eq(0)').text() + " and Main term = " + $(this).children('td:eq(1)').text());

                            tmp.title = $(this).children('td:eq(1)').text();
                            tmp.institution = $(this).children('td:eq(2)').text();
                            tmp.researcher = $(this).children('td:eq(3)').text();
                            tmp.start_year = $(this).children('td:eq(4)').text();
                            tmp.end_year = $(this).children('td:eq(5)').text();
                            tmp.label1 = $(this).children('td:eq(6)').text();
                            tmp.label2 = $(this).children('td:eq(7)').text();
                            tmp.label3 = $(this).children('td:eq(8)').text();
                            tmp.label4 = $(this).children('td:eq(9)').text();
                            tmp.label5 = $(this).children('td:eq(10)').text();
                            tmp.label6 = $(this).children('td:eq(11)').text();
                            tmp.label7 = $(this).children('td:eq(12)').text();
                            tmp.label8 = $(this).children('td:eq(13)').text();
                            tmp.topic1 = $(this).children('td:eq(14)').text();
                            tmp.topic2 = $(this).children('td:eq(15)').text();
                            tmp.topic3 = $(this).children('td:eq(16)').text();
                            tmp.topic4 = $(this).children('td:eq(17)').text();
                            tmp.topic5 = $(this).children('td:eq(18)').text();
                            tmp.topic6 = $(this).children('td:eq(19)').text();
                            tmp.topic7 = $(this).children('td:eq(20)').text();
                            tmp.topic8 = $(this).children('td:eq(21)').text();
localStorage.setItem("reportData",JSON.stringify(tmp));

                                  //  var searchNameField = $(this).children('td:eq(0)').text();

                                  });
});


                          function loadSearch() {





                            alert(searchNameField);


                            localStorage.setItem("reportData",JSON.stringify(tmp));

                          }
                          </script>


                          <!-- /.panel-heading -->
                          <div class="panel-body">
                              <div class="table-responsive" id="savedSearches">
                                  <table class="table table-hover">
                                      <thead>
                                          <tr id="header-row">
                                              <th>Search Name</th>
                                              <th>Main Term</th>
                                              <th>Institution</th>
                                              <th>Researcher</th>
                                              <th>Topic 1</th>
                                              <th>Topic 2</th>
                                              <th>Topic 3</th>
                                              <th>Topic 4</th>
                                          </tr>
                                      </thead>
                                      <tbody id="searchTable">

                                          <?php

                                          //DB cconnection info
                                          $dbname = 'facet';
                                          $dbuser = 'rathomas17';
                                          $dbpass = 'revolt99';
                                          $dbhost = 'localhost';

                $connect = mysql_connect("127.0.0.1","rathomas17", "revolt99");
                if (!$connect) {
                    die(mysql_error());
                }


                                // Create connection
                              /*  $conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
                                if ($conn->connect_error) {
                                    die("Connection failed: " . $conn->connect_error);
                                }
*/
                mysql_select_db("facet");
                $results = mysql_query("SELECT * FROM searches");
                while($row = mysql_fetch_array($results)) {
                ?>
                    <tr onclick="document.location='../../client_side/web_new/search_page/report_query.html'" style="cursor:hand">

                      <!--<tr onclick="loadSearch();document.location='../../client_side/web_new/search_page/report_query.html'" style="cursor:hand">-->
                        <td><?php echo $row['searchName']?></td>
                        <td><?php echo $row['mainQuery']?></td>
                        <td><?php echo $row['institutionName']?></td>
                        <td><?php echo $row['researcherName']?></td>
                        <td style="display:none;"><?php echo $row['yearMin']?></td>
                        <td style="display:none;"><?php echo $row['yearMax']?></td>
                        <td><?php echo $row['topic1Label']?></td>
                        <td><?php echo $row['topic2Label']?></td>
                        <td><?php echo $row['topic3Label']?></td>
                        <td><?php echo $row['topic4Label']?></td>
                        <td style="display:none;"><?php echo $row['topic5Label']?></td>
                        <td style="display:none;"><?php echo $row['topic6Label']?></td>
                        <td style="display:none;"><?php echo $row['topic7Label']?></td>
                        <td style="display:none;"><?php echo $row['topic8Label']?></td>
                        <td style="display:none;"><?php echo $row['topic1']?></td>
                        <td style="display:none;"><?php echo $row['topic2']?></td>
                        <td style="display:none;"><?php echo $row['topic3']?></td>
                        <td style="display:none;"><?php echo $row['topic4']?></td>
                        <td style="display:none;"><?php echo $row['topic5']?></td>
                        <td style="display:none;"><?php echo $row['topic6']?></td>
                        <td style="display:none;"><?php echo $row['topic7']?></td>
                        <td style="display:none;"><?php echo $row['topic8']?></td>
                    </tr>

                <?php
                }

                ?>
                                      </tbody>
                                  </table>
                              </div>
                              <!-- /.table-responsive -->
                          </div>
                          <!-- /.panel-body -->
                      </div>
                      <!-- /.panel -->
                  </div>
                  <!-- /.col-lg-6 -->
                </div>
                <!-- /.row -->
                <a href="/../client_side/web_new/search_page/report_query.html" type="button" class="btn btn-outline btn-primary btn-lg btn-block">New Search</a>
            </div>
            <!-- /.container-fluid -->
        </div>
        <!-- /#page-wrapper -->

    </div>
    <!-- /#wrapper -->



</body>

</html>
