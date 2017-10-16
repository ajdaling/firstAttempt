<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>SuperH Index</title>



	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

    <link href="/client_side/lib/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

    <!-- MetisMenu CSS -->
    <link href="/lib/metisMenu/metisMenu.min.css" rel="stylesheet">

    <link rel="stylesheet" href="/client_side/home/style.css">

<link rel = "stylesheet" type = "text/css" href="/client_side/home/dashboard.css">

    <link rel="stylesheet" type="text/css" href="https://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
</head>

<body>

<!--BEGIN NAV -->
<div class="row" id="content-row">




	<nav class="navbar navbar-fixed-top" role="banner">
		<div class="container-fluid">


				<a class="navbar-brand" href="http://www.superHindex.com" target="_blank" style="display:"><img src="/client_side/lib/images/superlogo.png" style="color: blue; height: 44px; width:auto;"></a>


				<ul class="nav navbar-nav navbar-right">

<!--
          <li> <a href="mailto:superHindex@gmail.com" style="display:inline-block;padding:0px;"><img src="/client_side/lib/images/mail-icon.png" style="height: 28px; width:35px;"></a>  </li>
					<li> <a href="http://facebook.com/superHindex" target="_blank" style="display:inline-block;padding:0px;"><img src="/client_side/lib/images/facebooklogo.png" style="height: 32px; width:32px;"></a>  </li>
					<li> <a href="http://twitter.com/superHindex" target="_blank" style="display:inline-block;padding:0px;"><img src="/client_side/lib/images/twitter-bird-dark-bgs.png" style="height: 36px; width: 36px;"></a>   </li>

-->

          <li class="dropdown">
              <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                  <i class="fa fa-envelope fa-fw" style="color:#283a75 "></i> <i class="fa fa-caret-down" style="color:#283a75 "></i>
              </a>
              <ul class="dropdown-menu dropdown-messages">
                  <li>
                      <a href="#">
                          <div>
                              <strong>John Smith</strong>
                              <span class="pull-right text-muted">
                                  <em>Yesterday</em>
                              </span>
                          </div>
                          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eleifend...</div>
                      </a>
                  </li>
                  <li class="divider"></li>
                  <li>
                      <a href="#">
                          <div>
                              <strong>John Smith</strong>
                              <span class="pull-right text-muted">
                                  <em>Yesterday</em>
                              </span>
                          </div>
                          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eleifend...</div>
                      </a>
                  </li>
                  <li class="divider"></li>
                  <li>
                      <a href="#">
                          <div>
                              <strong>John Smith</strong>
                              <span class="pull-right text-muted">
                                  <em>Yesterday</em>
                              </span>
                          </div>
                          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eleifend...</div>
                      </a>
                  </li>
                  <li class="divider"></li>
                  <li>
                      <a class="text-center" href="#">
                          <strong>Read All Messages</strong>
                          <i class="fa fa-angle-right"></i>
                      </a>
                  </li>
              </ul>
              <!-- /.dropdown-messages -->
          </li>
          <!-- /.dropdown -->
          <li class="dropdown">
              <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                  <i class="fa fa-tasks fa-fw" style="color:#283a75 "></i> <i class="fa fa-caret-down" style="color:#283a75 "></i>
              </a>
              <ul class="dropdown-menu dropdown-tasks">
                  <li>
                      <a href="#">
                          <div>
                              <p>
                                  <strong>Task 1</strong>
                                  <span class="pull-right text-muted">40% Complete</span>
                              </p>
                              <div class="progress progress-striped active">
                                  <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 40%">
                                      <span class="sr-only">40% Complete (success)</span>
                                  </div>
                              </div>
                          </div>
                      </a>
                  </li>
                  <li class="divider"></li>
                  <li>
                      <a href="#">
                          <div>
                              <p>
                                  <strong>Task 2</strong>
                                  <span class="pull-right text-muted">20% Complete</span>
                              </p>
                              <div class="progress progress-striped active">
                                  <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 20%">
                                      <span class="sr-only">20% Complete</span>
                                  </div>
                              </div>
                          </div>
                      </a>
                  </li>
                  <li class="divider"></li>
                  <li>
                      <a href="#">
                          <div>
                              <p>
                                  <strong>Task 3</strong>
                                  <span class="pull-right text-muted">60% Complete</span>
                              </p>
                              <div class="progress progress-striped active">
                                  <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%">
                                      <span class="sr-only">60% Complete (warning)</span>
                                  </div>
                              </div>
                          </div>
                      </a>
                  </li>
                  <li class="divider"></li>
                  <li>
                      <a href="#">
                          <div>
                              <p>
                                  <strong>Task 4</strong>
                                  <span class="pull-right text-muted">80% Complete</span>
                              </p>
                              <div class="progress progress-striped active">
                                  <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%">
                                      <span class="sr-only">80% Complete (danger)</span>
                                  </div>
                              </div>
                          </div>
                      </a>
                  </li>
                  <li class="divider"></li>
                  <li>
                      <a class="text-center" href="#">
                          <strong>See All Tasks</strong>
                          <i class="fa fa-angle-right"></i>
                      </a>
                  </li>
              </ul>
              <!-- /.dropdown-tasks -->
          </li>
          <!-- /.dropdown -->
          <li class="dropdown">
              <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                  <i class="fa fa-user fa-fw" style="color:#283a75 "></i> <i class="fa fa-caret-down" style="color:#283a75 "></i>
              </a>
              <ul class="dropdown-menu dropdown-user">
                  <li><a href="#"><i class="fa fa-user fa-fw"></i> User Profile</a>
                  </li>
                  <li><a href="#"><i class="fa fa-gear fa-fw"></i> Settings</a>
                  </li>
                  <li class="divider"></li>
                  <li><a href="login.html"><i class="fa fa-sign-out fa-fw"></i> Logout</a>
                  </li>
              </ul>
              <!-- /.dropdown-user -->
          </li>
          <!-- /.dropdown -->

				</ul>

		</div>
	</nav>

</div>

<!-- END NAV -->


	<!--main-->
	<div class="container-fluid">

    <div class="row" id="announcement">
        <div class="col-md-12">
            <div class="jumbotron">
                <h1 style="color: black; margin-top: -20px;">Jumbotron</h1>
                <p style="color: black">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt est vitae ultrices accumsan. Aliquam ornare lacus adipiscing, posuere lectus et, fringilla augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt est vitae ultrices accumsan. Aliquam ornare lacus adipiscing.</p>
                <p><a class="btn btn-primary btn-lg" role="button">Learn more</a>
                </p>
            </div>
        </div>
        <!-- /.col-lg-12 -->
    </div>
    <!-- /.row -->





      <!--SIDE NAV-->

      <nav class="main-menu" id="sidebar">



      <div class="scrollbar" id="style-1">

      <ul>

      <li>
      <a class = "home-link">
      <i class="fa fa-home fa-lg"></i>
      <span class="nav-text">Home</span>
      </a>
      </li>

      <li>
      <a class = "newSearch-link">
      <i class="fa fa-search fa-lg"></i>
      <span class="nav-text">New Search</span>
      </a>
      </li>


      <li>
      <a class = "results-link">
      <i class="fa fa-list fa-lg"></i>
      <span class="nav-text">Search Results</span>
      </a>
      </li>

      <li>
      <a class="visualization-link">
      <i class="fa fa-area-chart fa-lg"></i>
      <span class="nav-text">Visualize</span>
      </a>
      </li>

      <li>
      <a class="report-link">
      <i class="fa fa-paper-plane-o fa-lg"></i>
      <span class="nav-text">Report</span>
      </a>
      </li>


              </nav>

      <!-- END NEW NAV -->


		<!--left
			<div class="col-md-2" id="leftCol">
				<ul class="nav nav-stacked nav-sidebar" id="sidebar" role="navigation">
					<li class="active">
						<a href="#" class = "home-link">Home
							<span class="sr-only">(current)</span>
						</a>
					</li>
					<li><a href="#" class="newSearch-link">New Search</a></li>
					<li><a href="#" class="docMaster-link">Search Results</a></li>
					<li><a href="#" class="visualization-link">Visualizations</a></li>
					<li><a href="#" class="report-link">Report</a></li>
					<li><a href="#" class="login-link">Logout</a></li>
				</ul>
			</div>left-->





				<div class="row" id = "savedSearch-row" style="color:black;"> <!-- saved search row -->
          <div class="col-md-1 ">
          </div>
          <div class="col-md-10 " id="rightCol">
					<!-- Begin  saved search panel -->
					<div class="panel panel-default">
						<div class="panel-heading">Saved Searches</div>
						<!-- Begin panel-body -->
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

											mysql_select_db("facet");
											$results = mysql_query("SELECT * FROM searches");
											while($row = mysql_fetch_array($results)) {
										?>
	                    				<tr onclick="document.location='/client_side/newSearch/newSearch.html'" style="cursor:hand">

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
							<!-- End table-responsive -->
							</div>
						<!-- End panel-body -->
						</div>
	                	<a href="#" type="button" class=" newSearch-link btn btn-outline btn-primary btn-lg btn-block">New Search</a>
					<!-- End panel -->
					</div>
				</div> <!-- /saved search row -->
			</div>
		</div><!--/row-->
	</div><!--/container-->
</body>
	<script src="/client_side/lib/jquery/jquery-3.2.1.js"></script>
	<script src="/config.js"></script>
	<script src="/client_side/lib/d3/js/d3.v3.min.js"></script>
    <script src="/client_side/lib/bootstrap/js/bootstrap.min.js"></script>
	<script src="/client_side/home/dashboard.js"></script>
<!-- 	<script src="/client_side/newSearch/newSearch.js"></script> -->

</html>
