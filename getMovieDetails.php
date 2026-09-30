<!-- getMovieDetails.php -->

<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "cinestar";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$title = isset($_GET['title']) ? $conn->real_escape_string($_GET['title']) : '';

if (!$title) {
    echo json_encode(["error" => "Movie title not provided"]);
    exit;
}

$movieQuery = "
    SELECT movies.movie_id, movies.title, movies.image_path AS img, movies.synopsis, 
           movies.starring AS movie_cast, movies.director, movies.genre, 
           movies.language, movies.age_rating AS rating, movies.runtime, 
           movies.release_date
    FROM movies 
    WHERE movies.title = '$title' 
    LIMIT 1";

$movieResult = $conn->query($movieQuery);
if ($movieResult->num_rows > 0) {
    $movie = $movieResult->fetch_assoc();
    $today = date('Y-m-d');
    $cutoffDate = date('Y-m-d', strtotime('+5 days'));
    $showtimesQuery = "
        SELECT c.name AS cinema_name, s.date, s.time
        FROM showtimes s
        JOIN cinemas c ON s.cinema_id = c.cinema_id
        WHERE s.movie_id = " . $movie['movie_id'] . " AND s.date BETWEEN '$today' AND '$cutoffDate'
        ORDER BY c.name, s.date, s.time";
    $showtimesResult = $conn->query($showtimesQuery);
    $showtimes = [];
    while ($row = $showtimesResult->fetch_assoc()) {
        $cinema = $row['cinema_name'];
        $date = $row['date'];
        $time = date("g:i A", strtotime($row['time']));
        if (!isset($showtimes[$cinema])) {
            $showtimes[$cinema] = [];
        }
        if (!isset($showtimes[$cinema][$date])) {
            $showtimes[$cinema][$date] = [];
        }
        $showtimes[$cinema][$date][] = $time;
    }
    $movie['showtimes'] = $showtimes;
    echo json_encode($movie);
} else {
    echo json_encode(["error" => "Movie not found"]);
}
$conn->close();
?>
