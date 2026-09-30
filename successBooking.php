<?php
// successBooking.php
$bookingDetails = [
    "bookingId" => "0FR9XGRLTF",
    "movieTitle" => "The Wild Robot",
    "movieId" => 3,
    "cinemaId" => 1,
    "hallId" => 2,
    "totalPrice" => 43.50,
    "seats" => ["E-5", "E-6", "E-7"],
    "location" => "Cinestar Arc",
    "date" => "2024-11-15",
    "time" => "5:15PM",
    "runtime" => "102min",
    "language" => "Eng",
    "img" => "media/movie3.jpg",
    "userEmail" => "Testuser@localhost" 
];

$bookingDetailsJSON = json_encode($bookingDetails);

// Prepare email content
$to = "Testuser@localhost"; 
$subject = 'Your CINESTAR Booking Confirmation';
$headers = "From: CINESTAR <cinestar@localhost>\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

$message = "
    <html>
    <head>
        <title>CINESTAR Booking Confirmation</title>
    </head>
    <body>
        <h1>Thank you for your booking!</h1>
        <p>Here are your booking details:</p>
        <ul>
            <li><strong>Booking ID:</strong> {$bookingDetails['bookingId']}</li>
            <li><strong>Movie Title:</strong> {$bookingDetails['movieTitle']}</li>
            <li><strong>Location:</strong> {$bookingDetails['location']}</li>
            <li><strong>Date:</strong> {$bookingDetails['date']}</li>
            <li><strong>Time:</strong> {$bookingDetails['time']}</li>
            <li><strong>Seats:</strong> " . implode(', ', $bookingDetails['seats']) . "</li>
            <li><strong>Total Price:</strong> $${bookingDetails['totalPrice']}</li>
        </ul>
        <p><img src='https://localhost/{$bookingDetails['img']}' alt='Movie Poster' style='max-width:300px;'></p>
        <p>Enjoy your movie!</p>
        <footer>
            <p>&copy; 2024 CINESTAR. All rights reserved.</p>
        </footer>
    </body>
    </html>";

// Send email
if (mail($to, $subject, $message, $headers)) {
    echo "Email sent successfully!";
} else {
    echo "Failed to send email.";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&display=swap" rel="stylesheet">

    <link rel="icon" type="image/x-icon" href="media/favicon.ico">

    <title>Success Booking</title>
    <script src="success_booking.js" defer></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body, html {
            font-family: 'League Spartan', sans-serif;
            background-color: #1e1e1e;
            color: #fff;
            overflow-x: hidden;
            scroll-behavior: smooth;
        }

        .header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
        }

        .navbar {
            background-color: #101720;
            padding: 15px 0;
        }

        .navbar-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 0 60px;
            margin: 0 auto;
        }

        .logo img {
            height: 50px;
            width: auto;
        }

        .menu {
            list-style-type: none;
            display: flex;
            gap: 40px;
        }

        .menu li a {
            color: #ffffff;
            text-decoration: none;
            font-size: 18px;
            letter-spacing: 1px;
            font-weight: 500;
            text-transform: uppercase;
            transition: color 0.3s ease;
        }

        .menu li a:hover,
        .menu li a.active {
            color: #ffc107;
        }

        .menu-toggle {
            display: none;
        }

        @media (max-width: 928px) {
            .menu {
                gap: 12px;
            }
        }

        @media (max-width: 785px) {
            .navbar-content {
                flex-direction: column;
            }

            .menu {
                flex-direction: column;
                gap: 15px;
                display: none;
                text-align: center;
            }

            .menu li a {
                font-size: 18px;
            }

            .menu-toggle {
                display: inline-block;
                cursor: pointer;
                color: #ffffff;
                font-size: 24px;
                padding: 5px 0;
            }
            .menu.show {
                display: flex;
            }
        }

        .confirmation-container {
            max-width: 1100px;
            background-color: #333;
            padding: 40px;
            margin: 120px auto 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            color: #fff;
            text-align: center;
        }

        .confirmation-container h2 {
            font-size: 2rem;
            font-weight: 500;
            color: #ffcc00;
            margin-bottom: 20px;
        }

        .confirmation-container p {
            font-size: 18px;
            line-height: 1.6;
            color: #ccc;
            margin-bottom: 30px;
        }

        .details-section p {
        font-size: 16px;
        line-height: 1.8;
        margin: 8px 0;
        color:#000;
        }

        .ticket-details {
            display: flex;
            align-items: flex-start;
            background-color: #e0e0e0;
            color: #333;
            padding: 20px;
            border-radius: 10px;
            text-align: left;
        }

        .movie-image {
            width: 200px;
            height: auto;
            border-radius: 5px;
            margin-right: 20px;
        }

        .details-section {
            flex: 1;
            color: #000;
            margin-top: 10px; 
        }

        .details-section p {
            font-size: 16px; 
            line-height: 1.8;
            margin: 8px 0;
        }

        .details-section strong {
            font-weight: bold;
            color: #000;
        }
        
        .booking-info {
            flex: 1.7; 
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center; 
            border-left: 2px solid rgba(51, 51, 51, 0.5);
            padding-left: 30px;
            margin-top: 50px;
            height: 100%;
        }

        .booking-info .booking-id {
            font-size: 1.8rem;
            font-weight: bold;
            color: #000;
            margin-bottom: 10px;
        }

        .booking-info #reference-id {
            font-size: 2.2rem;
            font-weight: bold;
            color: #000;
            margin-bottom: 10px;
        }

        .booking-info .price {
            font-size: 1.6rem;
            color: #000;
        }

        .action-button {
            background-color: #ffcc00;
            color: #333;
            padding: 15px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            display: inline-block;
            margin-top: 30px;
            transition: background-color 0.3s ease;
        }

        .action-button:hover {
            background-color: #9d6004;
            color: #fff;
        }

        footer {
            text-align: center;
            padding: 20px;
            margin-top: 40px;
            background-color: #101720;
            color: #ccc;
            font-size: 14px;
        }

        @media (max-width: 1020px) {
            .ticket-details {
                flex-direction: column;
                text-align: center;
            }

            .movie-image {
                margin: 0 auto 20px;
            }

            .booking-info {
                border-left: none;
                border-top: 2px solid rgba(51, 51, 51, 0.5);
                padding-left: 0;
                padding-top: 20px;
            }
        }
    </style>
</head>
<body>
<header class="header">
    <nav class="navbar">
        <div class="navbar-content">
            <div class="logo">
                <img src="media/logo.png" alt="Cinestar Logo">
            </div>
            <div class="menu-toggle" onclick="toggleMenu()">☰</div>
            <ul class="menu">
                <li><a href="index.html">HOME</a></li>
                <li><a href="index.html#movies" id="moviesLink" class="active">MOVIES</a></li>
                <li><a href="about.html">ABOUT</a></li>
                <li><a href="contact.html">CONTACT</a></li>
                <li><a href="check_booking.html">CHECK BOOKING</a></li>
            </ul>
        </div>
    </nav>
</header>

<main class="confirmation-container">
    <h2>Your e-Ticket</h2>
    <p>Your ticket purchase completed successfully.<br>E-tickets have been sent to your email address.</p>

    <div class="ticket-details">
        <img id="movie-image" src="media/default_movie.jpg" alt="Movie Image" class="movie-image">
        <div class="details-section">
            <p><strong>Movie:</strong> <span id="movie-title">The Paradise Of Thorns</span></p>
            <p><strong>Running Time:</strong> <span id="running-time">131 minutes</span></p>
            <p><strong>Location:</strong> <span id="location">Cinestar Arc</span></p>
            <p><strong>Cinema Hall:</strong> <span id="hall-number">1</span></p>
            <p><strong>Date:</strong> <span id="date">2024-11-10</span></p>
            <p><strong>Showtime:</strong> <span id="time">14:20</span></p>
            <p><strong>Seat Row:</strong> <span id="seat-numbers">D2</span></p>
            <p><strong>Language:</strong> <span id="language">Thai (Sub: English, Chinese)</span></p>
        </div>
        <div class="booking-info">
            <p class="booking-id">Booking ID</p>
            <p id="reference-id">E9MPA08454</p>
            <p class="price">Total Price: $<span id="total-price">14.50</span></p>
        </div>
    </div>
</main>

<div style="text-align: center;">
    <a href="index.html#movies" class="action-button">Back to Home</a>
</div>

<footer>
    <p>&copy; 2024 CINESTAR. All rights reserved.</p>
</footer>

<script>
    document.addEventListener("DOMContentLoaded", () => {
        const moviesLink = document.querySelector(".menu li a[href='#movies']");
        const currentHash = window.location.hash;

        if (currentHash === "#movies") {
            moviesLink.classList.add("active");
        }
    });

    function toggleMenu() {
        const menu = document.querySelector('.menu');
        menu.classList.toggle('show');
    }
</script>
</body>
</html>
