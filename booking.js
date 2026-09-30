// booking.js
document.addEventListener("DOMContentLoaded", () => {
  function convertTo24Hour(timeStr) {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    if (modifier === "PM" && hours !== "12") {
      hours = String(parseInt(hours, 10) + 12);
    } else if (modifier === "AM" && hours === "12") {
      hours = "00";
    }
    return `${hours}:${minutes}`;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const movieTitle = urlParams.get("title");
  const location = urlParams.get("cinema");
  const date = urlParams.get("date");
  const time = convertTo24Hour(urlParams.get("time"));

  console.log("Movie Title:", movieTitle);
  console.log("Cinema:", location);
  console.log("Date:", date);
  console.log("Converted Time:", time);

  document.getElementById("movie-title").textContent = movieTitle;
  document.getElementById("selected-location").textContent = location;
  document.getElementById("selected-date").textContent = date;
  document.getElementById("selected-time").textContent = time;

  fetch(
    `getBookingDetails.php?title=${encodeURIComponent(movieTitle)}&cinema=${encodeURIComponent(location)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`,
  )
    .then((response) => response.text())
    .then((text) => {
      console.log("Response Text:", text);
      try {
        const data = JSON.parse(text);
        if (data.error) {
          console.error("Error fetching booking details:", data.error);
          alert(data.error);
          return;
        }
        document.getElementById("movie-image").src = data.img;
        document.getElementById("movie-title").textContent = data.title;

        const standardPrice = parseFloat(data.standard_price) || 14.5;
        const studentPrice = parseFloat(data.student_price) || 10.0;
        let ticketPrice = null;

        const selectedPriceDisplay = document.getElementById(
          "selected-price-value",
        );
        const totalPriceDisplay = document.getElementById("total-price-value");
        const selectedSeats = new Set();

        document
          .querySelectorAll('input[name="ticket-type"]')
          .forEach((radio) => {
            radio.addEventListener("change", () => {
              ticketPrice =
                radio.value === "standard" ? standardPrice : studentPrice;
              selectedPriceDisplay.textContent = ticketPrice.toFixed(2);
              updateTotalPrice();
            });
          });

        const seatGrid = document.getElementById("seat-grid");
        const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        const bookedSeats = new Set(data.bookedSeats);
        rows.forEach((rowLabel) => {
          for (let col = 1; col <= 10; col++) {
            const seat = document.createElement("div");
            const seatKey = `${rowLabel}${col}`;
            seat.classList.add("seat");
            seat.textContent = seatKey;
            if (bookedSeats.has(seatKey)) {
              seat.classList.add("unavailable");
            } else {
              seat.dataset.status = "available";
              seat.addEventListener("click", () => {
                seat.classList.toggle("selected");
                if (selectedSeats.has(seatKey)) {
                  selectedSeats.delete(seatKey);
                } else {
                  selectedSeats.add(seatKey);
                }
                updateTotalPrice();
              });
            }
            seatGrid.appendChild(seat);
          }
        });
        function updateTotalPrice() {
          if (ticketPrice !== null) {
            const totalSeats = selectedSeats.size;
            const totalPrice = totalSeats * ticketPrice;
            totalPriceDisplay.textContent = totalPrice.toFixed(2);
          } else {
            totalPriceDisplay.textContent = "0.00";
          }
        }
        document
          .getElementById("proceed-payment")
          .addEventListener("click", () => {
            if (!ticketPrice || selectedSeats.size === 0) {
              alert("Please select a ticket type and at least one seat.");
              return;
            }
            const seatRows = Array.from(selectedSeats);
            fetch("getSeatsId.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                seats: seatRows,
                cinema_id: data.cinema_id,
                hall_id: data.hall_number,
              }),
            })
              .then((response) => response.json())
              .then((result) => {
                if (!result.success) {
                  console.error("Failed to fetch seat IDs:", result.error);
                  return;
                }
                const seatsWithIds = result.seatIds.map((seat) => ({
                  seat_id: seat.seat_id,
                  seat_row: seat.seat_row,
                }));
                const bookingDetails = {
                  movieTitle: data.title,
                  movie_id: data.movie_id,
                  cinema_id: data.cinema_id,
                  img: data.img,
                  location,
                  date,
                  time,
                  seats: seatsWithIds,
                  ticketType:
                    ticketPrice === standardPrice ? "Standard" : "Student",
                  ticketPrice: ticketPrice.toFixed(2),
                  totalPrice: totalPriceDisplay.textContent,
                  language: data.language,
                  runtime: data.runtime,
                  hall_number: data.hall_number,
                };
                localStorage.setItem(
                  "bookingDetails",
                  JSON.stringify(bookingDetails),
                );
                alert("Proceeding to payment!");
                window.location.href = "payment.html";
              })
              .catch((error) =>
                console.error("Error fetching seat IDs:", error),
              );
          });
      } catch (error) {
        console.error("JSON parsing error:", error);
        alert(
          "There was an issue processing the booking details. Please try again.",
        );
      }
    })
    .catch((error) => console.error("Error fetching booking details:", error));
});
