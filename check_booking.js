// check_booking.js
document.addEventListener("DOMContentLoaded", () => {
  validateName();
  validateEmail();
  validateBookingID();

  document.getElementById("name").addEventListener("input", validateName);
  document.getElementById("email").addEventListener("input", validateEmail);
  document
    .getElementById("booking-id")
    .addEventListener("input", validateBookingID);
});

function resetForm() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("booking-id").value = "";
  clearErrors();
}

function validateName() {
  const nameInput = document.getElementById("name");
  let nameError = document.getElementById("name-error");
  if (!nameError) {
    nameError = document.createElement("p");
    nameError.id = "name-error";
    nameError.className = "error-message";
    nameInput.parentNode.insertBefore(nameError, nameInput.nextSibling);
  }
  if (nameInput.value.trim() === "") {
    nameError.textContent = "Name is required.";
    return false;
  }
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(nameInput.value)) {
    nameError.textContent = "Name should contain only alphabets and spaces.";
    return false;
  }
  nameError.textContent = "";
  return true;
}
function validateEmail() {
  const emailInput = document.getElementById("email");
  let emailError = document.getElementById("email-error");
  if (!emailError) {
    emailError = document.createElement("p");
    emailError.id = "email-error";
    emailError.className = "error-message";
    emailInput.parentNode.insertBefore(emailError, emailInput.nextSibling);
  }
  if (emailInput.value.trim() === "") {
    emailError.textContent = "Email is required.";
    return false;
  }
  const emailRegex = /^[^\s@]+@localhost$/;
  if (!emailRegex.test(emailInput.value)) {
    emailError.textContent =
      "Please enter a valid email with the domain 'localhost'.";
    return false;
  }
  emailError.textContent = "";
  return true;
}

function validateBookingID() {
  const bookingIdInput = document.getElementById("booking-id");
  let bookingIdError = document.getElementById("booking-id-error");
  if (!bookingIdError) {
    bookingIdError = document.createElement("p");
    bookingIdError.id = "booking-id-error";
    bookingIdError.className = "error-message";
    bookingIdInput.parentNode.insertBefore(
      bookingIdError,
      bookingIdInput.nextSibling,
    );
  }
  if (bookingIdInput.value.trim() === "") {
    bookingIdError.textContent = "Booking ID is required.";
    return false;
  }
  const bookingIdRegex = /^[A-Za-z0-9]+$/;
  if (!bookingIdRegex.test(bookingIdInput.value)) {
    bookingIdError.textContent =
      "Booking ID should contain only alphanumeric characters.";
    return false;
  }
  bookingIdError.textContent = "";
  return true;
}
function clearErrors() {
  ["name-error", "email-error", "booking-id-error"].forEach((id) => {
    const errorElement = document.getElementById(id);
    if (errorElement) errorElement.remove();
  });
}
function submitBookingCheck() {
  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isBookingIDValid = validateBookingID();
  if (!isNameValid || !isEmailValid || !isBookingIDValid) {
    return;
  }
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const bookingId = document.getElementById("booking-id").value;
  fetch("checkBooking.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, bookingId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        showErrorPopup("Sorry, we are unable to find your booking.");
      } else {
        showBookingPopup(data);
      }
    })
    .catch((error) => console.error("Error:", error));
}
function showErrorPopup(message) {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `
        <div class="popup-content">
            <p>${message}</p>
            <button class="popup-close-btn" onclick="closePopup()">OK</button>
        </div>
    `;
  document.body.appendChild(popup);
}
function showBookingPopup(data) {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `
    <div class="popup-content">
        <img src="${data.img}" alt="Movie Image" class="movie-image">
        
        <!-- Wrapper for details and booking info -->
        <div class="content-wrapper">
            <!-- Movie Details Section -->
            <div class="details-section">
                <h3>${data.title}</h3>
                <span class="label">Running Time:</span><span class="value">${data.runtime} minutes</span>
                <span class="label">Location:</span><span class="value">${data.cinema_name}</span>
                <span class="label">Cinema Hall:</span><span class="value">${data.hall_number}</span>
                <span class="label">Date:</span><span class="value">${data.date}</span>
                <span class="label">Showtime:</span><span class="value">${data.time}</span>
                <span class="label">Seat Row:</span><span class="value">${data.seat_rows.join(", ")}</span>
                <span class="label">Language:</span><span class="value">${data.language}</span>
            </div>

            <!-- Booking Info Section -->
            <div class="booking-info">
                <p class="booking-id">Booking ID</p>
                <p id="reference-id">${data.booking_id}</p>
                <p class="price">$${data.total_price}</p>
            </div>
        </div>

        <div style="text-align: center;">
            <button class="popup-close-btn" onclick="closePopup()">Close</button>
        </div>
    </div>
    `;
  document.body.appendChild(popup);
}
function closePopup() {
  const popup = document.querySelector(".popup");
  if (popup) popup.remove();
}
