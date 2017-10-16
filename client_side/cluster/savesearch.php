<?php
//
//DB cconnection info
$dbname = 'facet';
$dbuser = 'rathomas17';
$dbpass = 'revolt99';
$dbhost = '127.0.0.1';

// Create connection
$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//
// Grab data to insert
$username = $_POST['name'];
$searchName = $_POST['searchName'];
$mainQuery = $_POST['mainQuery'];
$institutionName= $_POST['institutionName'];
$researcherName = $_POST['researcherName'];
$yearMin = $_POST['yearMin'];
$yearMax = $_POST['yearMax'];
$topic1 = $_POST['topic1'];
$topic2 = $_POST['topic2'];
$topic3 = $_POST['topic3'];
$topic4 = $_POST['topic4'];
$topic5 = $_POST['topic5'];
$topic6 = $_POST['topic6'];
$topic7 = $_POST['topic7'];
$topic8 = $_POST['topic8'];

//
// Fomrm insert atatement
$sql = "
    INSERT INTO facet.searches (username, searchName, mainQuery, institutionName,
      researcherName, yearMin, yearMax, topic1, topic2, topic3, topic4, topic5, topic6, topic7, topic8) VALUES ('$username', '$searchName',
      '$mainQuery', '$institutionName', '$researcherName',
      '$yearMin', '$yearMax', '$topic1', '$topic2', '$topic3', '$topic4', '$topic5', '$topic6', '$topic7', '$topic8');";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

?>
