// save_booking.js
function saveBookingToDatabase() {
  const bookingDetails = JSON.parse(localStorage.getItem("bookingDetails"));
  if (!bookingDetails || !bookingDetails.referenceId) {
    console.error("Missing booking details or reference ID");
    return;
  }
  fetch("saveBooking.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      movieId: bookingDetails.movie_id,
      cinemaId: bookingDetails.cinema_id,
      hallId: bookingDetails.hall_number,
      showtimeId: bookingDetails.runtime,
      referenceId: bookingDetails.referenceId,
      paymentMethod: bookingDetails.paymentDetails?.method,
      cardNumber: bookingDetails.paymentDetails?.cardNumber,
      userName: bookingDetails.paymentDetails?.name,
      userEmail: bookingDetails.paymentDetails?.email,
      totalPrice: bookingDetails.totalPrice,
      seats: bookingDetails.seats,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Booking saved successfully:", data.message);
      } else {
        console.error("Failed to save booking:", data.error);
      }
    })
    .catch((error) => console.error("Error in request:", error));
}
