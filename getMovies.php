<?php
// getMovies.php

header("Content-Type: application/json");

$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "cinestar";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$nowShowingSql = "SELECT title, image_path AS img, runtime, genre, synopsis FROM movies WHERE status = 'Now_showing'";
$nowShowingResult = $conn->query($nowShowingSql);
$nowShowingMovies = [];
while ($row = $nowShowingResult->fetch_assoc()) {
    $nowShowingMovies[] = $row;
}

$comingSoonSql = "SELECT title, image_path AS img, runtime, genre, synopsis FROM movies WHERE status = 'Coming_soon'";
$comingSoonResult = $conn->query($comingSoonSql);
$comingSoonMovies = [];
while ($row = $comingSoonResult->fetch_assoc()) {
    $comingSoonMovies[] = $row;
}

$response = ["nowShowingMovies" => $nowShowingMovies, "comingSoonMovies" => $comingSoonMovies];
echo json_encode($response);

$conn->close();
?>
