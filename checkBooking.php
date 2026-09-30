<?php
// checkBooking.php
header("Content-Type: application/json");
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'php_error.log'); 
error_log("checkBooking.php started"); 

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "cinestar";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    error_log("Database connection error: " . $conn->connect_error);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log("JSON decode error: " . json_last_error_msg());
    echo json_encode(["error" => "Invalid JSON input"]);
    exit;
}

$name = $data['name'];
$email = $data['email'];
$bookingId = $data['bookingId'];
$query = "
    SELECT 
        b.reference_id AS booking_id, b.total_price, b.movie_id,
        m.title AS movie_title, m.runtime, m.language,
        c.name AS cinema_name,
        h.hall_number,
        s.date, s.time,
        (SELECT GROUP_CONCAT(DISTINCT se.seat_row ORDER BY se.seat_row)
         FROM booking_seats bs
         JOIN seats se ON bs.seat_id = se.seat_id
         WHERE bs.reference_id = b.reference_id) AS seat_rows
    FROM bookings b
    JOIN movies m ON b.movie_id = m.movie_id
    JOIN cinemas c ON b.cinema_id = c.cinema_id
    JOIN halls h ON b.hall_id = h.hall_id
    JOIN showtimes s ON b.showtime_id = s.showtime_id
    WHERE b.user_name = ? AND b.user_email = ? AND b.reference_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("sss", $name, $email, $bookingId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $booking = $result->fetch_assoc();
    $movieNumber = $booking['movie_id'];
    $imagePath = "media/movie" . $movieNumber . ".jpg";
    echo json_encode([
        "title" => $booking['movie_title'],
        "runtime" => $booking['runtime'],
        "cinema_name" => $booking['cinema_name'],
        "hall_number" => $booking['hall_number'],
        "date" => $booking['date'],
        "time" => $booking['time'],
        "seat_rows" => explode(",", $booking['seat_rows']), 
        "language" => $booking['language'],
        "booking_id" => $booking['booking_id'],
        "total_price" => $booking['total_price'],
        "img" => $imagePath  
    ]);
} else {
    echo json_encode(["error" => true]);
}

$stmt->close();
$conn->close();
?>
