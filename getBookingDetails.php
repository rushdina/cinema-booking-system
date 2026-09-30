<!-- getBookingDetails.php -->

<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json");
ob_start();

$servername = "localhost";
$username = "root";  
$password = "";      
$dbname = "cinestar";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    ob_end_flush(); 
    exit;
}
function convertTo24Hour($time) {
    $time = str_replace([" AM", " PM"], "", $time);
    return date("H:i", strtotime($time));
}

$title = isset($_GET['title']) ? $conn->real_escape_string($_GET['title']) : '';
$cinema = isset($_GET['cinema']) ? $conn->real_escape_string($_GET['cinema']) : '';
$date = isset($_GET['date']) ? $conn->real_escape_string($_GET['date']) : '';
$time = isset($_GET['time']) ? convertTo24Hour($conn->real_escape_string($_GET['time'])) : '';

if (empty($title) || empty($cinema) || empty($date) || empty($time)) {
    echo json_encode(["error" => "Missing parameters: title, cinema, date, or time"]);
    ob_end_flush();
    exit;
}
$query = "
    SELECT m.movie_id, m.title, m.image_path AS img, m.synopsis, m.language, m.runtime, 
           c.cinema_id, c.name AS cinema_name, h.hall_number, s.date, s.time, 
           s.standard_price, s.student_price
    FROM movies m
    JOIN showtimes s ON m.movie_id = s.movie_id
    JOIN cinemas c ON s.cinema_id = c.cinema_id
    JOIN halls h ON h.cinema_id = c.cinema_id AND h.hall_id = s.hall_id
    WHERE m.title = '$title' AND c.name = '$cinema' AND s.date = '$date' AND s.time LIKE '$time%'
    LIMIT 1";
$result = $conn->query($query);
if (!$result) {
    echo json_encode(["error" => "Database query error: " . $conn->error]);
    ob_end_flush();
    exit;
}
if ($result->num_rows === 0) {
    echo json_encode(["error" => "No matching records found for the provided movie details."]);
    ob_end_flush();
    exit;
}
$bookingDetails = $result->fetch_assoc();
$unavailableSeatsQuery = "
    SELECT seat_row 
    FROM seats 
    WHERE cinema_id = ? AND hall_id = ? AND status = 'unavailable'";
$unavailableSeatsStmt = $conn->prepare($unavailableSeatsQuery);
$unavailableSeatsStmt->bind_param("ii", $bookingDetails['cinema_id'], $bookingDetails['hall_number']);
$unavailableSeatsStmt->execute();
$unavailableSeatsStmt->bind_result($seatRow);
$bookedSeats = [];
while ($unavailableSeatsStmt->fetch()) {
    $bookedSeats[] = $seatRow;
}
$unavailableSeatsStmt->close();
$bookingDetails['bookedSeats'] = $bookedSeats;
echo json_encode($bookingDetails);
ob_end_flush();
$conn->close();
?>
