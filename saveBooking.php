<?php
// saveBooking.php
header("Content-Type: application/json");
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'php_error.log');
error_log("Starting saveBooking.php");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "cinestar";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    error_log("Database connection error: " . $conn->connect_error);
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}
error_log("Database connected successfully"); 

$data = json_decode(file_get_contents("php://input"), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log("JSON decode error: " . json_last_error_msg());
    echo json_encode(["success" => false, "error" => "Invalid JSON input"]);
    exit;
}
error_log("JSON input decoded successfully");

$requiredFields = ['movieId', 'cinemaId', 'hallId', 'showtimeId', 'referenceId', 'totalPrice', 'seats'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        error_log("Missing or invalid field: $field");
        echo json_encode(["success" => false, "error" => "Missing or invalid field: $field"]);
        $conn->close();
        exit;
    }
}
error_log("Required fields validated successfully"); 
$movieId = $data['movieId'];
$cinemaId = $data['cinemaId'];
$hallId = $data['hallId'];
$showtimeId = $data['showtimeId'];
$referenceId = $data['referenceId'];
$totalPrice = $data['totalPrice'];
$paymentMethod = $data['paymentMethod'];
$cardNumber = $data['cardNumber'] ?? null;
$userName = $data['userName'];
$userEmail = $data['userEmail'];
$seats = $data['seats'];
$conn->begin_transaction();
error_log("Transaction started"); 
try {
    $bookingQuery = "INSERT INTO bookings (movie_id, cinema_id, hall_id, showtime_id, reference_id, payment_method, card_number, user_name, user_email, total_price, booking_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    $stmt = $conn->prepare($bookingQuery);
    $stmt->bind_param("iiissssssd", $movieId, $cinemaId, $hallId, $showtimeId, $referenceId, $paymentMethod, $cardNumber, $userName, $userEmail, $totalPrice);

    if (!$stmt->execute()) {
        throw new Exception("Failed to insert booking: " . $stmt->error);
    }
    error_log("Booking data inserted successfully with reference ID: $referenceId");

    $seatInsertQuery = "INSERT INTO booking_seats (reference_id, seat_id, hall_id, cinema_id) VALUES (?, ?, ?, ?)";
    $seatStmt = $conn->prepare($seatInsertQuery);
    foreach ($seats as $seat) {
        $seat_id = $seat['seat_id'];
        $checkQuery = "SELECT COUNT(*) FROM booking_seats WHERE reference_id = ? AND cinema_id = ? AND hall_id = ? AND seat_id = ?";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->bind_param("siii", $referenceId, $cinemaId, $hallId, $seat_id);
        $checkStmt->execute();
        $checkStmt->bind_result($count);
        $checkStmt->fetch();
        $checkStmt->close();
        if ($count == 0) {
            $seatStmt->bind_param("siii", $referenceId, $seat_id, $hallId, $cinemaId);
            if (!$seatStmt->execute()) {
                throw new Exception("Failed to insert seat ID $seat_id: " . $seatStmt->error);
            }
            error_log("Seat ID $seat_id inserted successfully");
            $updateSeatStatusQuery = "UPDATE seats SET status = 'unavailable' WHERE seat_id = ? AND hall_id = ? AND cinema_id = ?";
            $updateSeatStmt = $conn->prepare($updateSeatStatusQuery);
            $updateSeatStmt->bind_param("iii", $seat_id, $hallId, $cinemaId);
            
            if (!$updateSeatStmt->execute()) {
                throw new Exception("Failed to update seat status for seat ID $seat_id: " . $updateSeatStmt->error);
            }
            error_log("Seat ID $seat_id marked as unavailable"); 
        } else {
            error_log("Duplicate seat entry detected for seat ID $seat_id"); 
            $errors[] = "Duplicate entry for seat ID $seat_id";
        }
    }
    if (empty($errors)) {
        $conn->commit();
        error_log("Transaction committed successfully"); 
        echo json_encode(["success" => true, "message" => "Booking and seats saved successfully."]);
    } else {
        throw new Exception(implode(", ", $errors));
    }
} catch (Exception $e) {
    $conn->rollback(); 
    error_log("Transaction rolled back due to error: " . $e->getMessage()); 
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
$seatStmt->close();
$stmt->close();
$conn->close();
error_log("Database connection closed");
?>
