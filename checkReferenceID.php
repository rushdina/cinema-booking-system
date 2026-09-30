<?php
// checkReferenceID.php
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "cinestar";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}
$data = json_decode(file_get_contents("php://input"), true);
$referenceID = $data['referenceId'];
$query = "SELECT COUNT(*) as count FROM bookings WHERE reference_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $referenceID);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();
$stmt->close();
$conn->close();
echo json_encode(["isUnique" => $count == 0]); 
?>
