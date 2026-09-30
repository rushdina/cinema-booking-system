// success_booking.js
document.addEventListener("DOMContentLoaded", () => {
  let bookingDetails = JSON.parse(localStorage.getItem("bookingDetails"));
  console.log("Loaded booking details:", bookingDetails);

  if (!bookingDetails.referenceId) {
    generateUniqueReferenceId()
      .then((uniqueReferenceId) => {
        bookingDetails.referenceId = uniqueReferenceId;
        localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
        displayBookingDetails(bookingDetails);
        saveBookingToDatabase(bookingDetails);
      })
      .catch((error) => {
        console.error("Error generating unique reference ID:", error);
        alert(
          "An error occurred while generating your booking reference. Please try again.",
        );
      });
  } else {
    displayBookingDetails(bookingDetails);
    saveBookingToDatabase(bookingDetails);
  }
});

async function generateUniqueReferenceId() {
  let isUnique = false;
  let referenceId;

  while (!isUnique) {
    referenceId = Math.random().toString(36).substr(2, 10).toUpperCase();
    isUnique = await checkReferenceIdUnique(referenceId);
  }

  return referenceId;
}

async function checkReferenceIdUnique(referenceId) {
  try {
    const response = await fetch("checkReferenceID.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referenceId }),
    });
    const data = await response.json();
    return data.isUnique;
  } catch (error) {
    console.error("Error checking reference ID uniqueness:", error);
    return false;
  }
}

function displayBookingDetails(bookingDetails) {
  if (bookingDetails) {
    if (document.getElementById("movie-title")) {
      document.getElementById("movie-title").textContent =
        bookingDetails.movieTitle;
    }
    if (document.getElementById("movie-image")) {
      document.getElementById("movie-image").src = bookingDetails.img;
    }
    if (document.getElementById("location")) {
      document.getElementById("location").textContent = bookingDetails.location;
    }
    if (document.getElementById("date")) {
      document.getElementById("date").textContent = bookingDetails.date;
    }
    if (document.getElementById("time")) {
      document.getElementById("time").textContent = bookingDetails.time;
    }
    if (document.getElementById("seat-numbers")) {
      document.getElementById("seat-numbers").textContent = bookingDetails.seats
        .map((seat) => seat.seat_row)
        .join(", ");
    }
    if (document.getElementById("ticket-price")) {
      document.getElementById("ticket-price").textContent =
        bookingDetails.ticketPrice;
    }
    if (document.getElementById("total-price")) {
      document.getElementById("total-price").textContent = parseFloat(
        bookingDetails.totalPrice,
      ).toFixed(2);
    }
    if (document.getElementById("running-time")) {
      document.getElementById("running-time").textContent =
        bookingDetails.runtime;
    }
    if (document.getElementById("language")) {
      document.getElementById("language").textContent = bookingDetails.language;
    }
    if (document.getElementById("hall-number")) {
      document.getElementById("hall-number").textContent =
        bookingDetails.hall_number;
    }
    if (document.getElementById("reference-id")) {
      document.getElementById("reference-id").textContent =
        bookingDetails.referenceId;
    }
  } else {
    alert("Booking details not found. Returning to home page.");
    window.location.href = "index.html#movies";
  }
}
function saveBookingToDatabase(bookingDetails) {
  console.log("Sending data to saveBooking.php:", bookingDetails);

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
      bookingDate: new Date().toISOString().slice(0, 10),
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
