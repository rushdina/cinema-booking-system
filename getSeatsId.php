<?php
// getSeatsId.php
header("Content-Type: application/json");
ini_set('display_errors', 0); 
ini_set('log_errors', 1);
error_log("Entered getSeatIds.php"); 

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "cinestar";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (empty($data['seats']) || empty($data['cinema_id']) || empty($data['hall_id'])) {
    echo json_encode(["success" => false, "error" => "Invalid input data"]);
    $conn->close();
    exit;
}
$cinemaId = $data['cinema_id'];
$hallId = $data['hall_id'];
$seats = $data['seats']; 
$seatIds = [];
foreach ($seats as $seat) {
    $seatRow = $seat; 
    $query = "SELECT seat_id, seat_row FROM seats WHERE cinema_id = ? AND hall_id = ? AND seat_row = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iis", $cinemaId, $hallId, $seatRow);
    $stmt->execute();
    $stmt->bind_result($seatId, $seatRow);
    while ($stmt->fetch()) {
        $seatIds[] = ['seat_id' => $seatId, 'seat_row' => $seatRow];
    }
    $stmt->close();
}

$conn->close();
echo json_encode(["success" => true, "seatIds" => $seatIds]);
?>
