// payment.js
document.addEventListener("DOMContentLoaded", () => {
  const confirmationPrompt = document.getElementById("confirmation-prompt");
  const paynowDetails = document.getElementById("paynow-details");
  const mastercardDetails = document.getElementById("mastercard-details");
  const resetButton = document.getElementById("reset-button");
  const confirmButton = document.getElementById("confirm-button");
  const paymentMethodRadios = document.getElementsByName("payment-method");

  if (confirmationPrompt) {
    confirmationPrompt.style.display = "block";
  }

  if (confirmButton) {
    confirmButton.disabled = true;
  }

  const bookingDetails = JSON.parse(localStorage.getItem("bookingDetails"));
  console.log("Loaded booking details:", bookingDetails);
  if (bookingDetails) {
    document.getElementById("movie-title").textContent =
      bookingDetails.movieTitle;
    document.getElementById("movie-image").src = bookingDetails.img;
    document.getElementById("cinema-location").textContent =
      bookingDetails.location;
    document.getElementById("selected-date").textContent = bookingDetails.date;
    document.getElementById("selected-time").textContent = bookingDetails.time;
    document.getElementById("seat-numbers").textContent = bookingDetails.seats
      .map((seat) => seat.seat_row)
      .join(", ");
    document.getElementById("ticket-price").textContent =
      bookingDetails.ticketType === "Standard" ? "14.50" : "10.00";
    document.getElementById("total-price").textContent =
      bookingDetails.totalPrice;
    document.getElementById("movie-language").textContent =
      bookingDetails.language || "N/A";
    document.getElementById("movie-runtime").textContent =
      bookingDetails.runtime || "N/A";
    document.getElementById("hall-number").textContent =
      bookingDetails.hall_number || "N/A";
    console.log("Movie ID:", bookingDetails.movie_id);
    console.log("Cinema ID:", bookingDetails.cinema_id);
  }

  const phoneRegex = /^\d{4} \d{4}$/;
  const alphaRegex = /^[A-Za-z\s]+$/;

  [
    "paynow-email",
    "mastercard-email",
    "paynow-phone",
    "paynow-name",
    "mastercard-name",
    "cardholder-name",
  ].forEach((inputId) => {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.createElement("p");
    errorElement.id = `${inputId}-error`;
    errorElement.className = "error-message";
    inputElement.parentNode.insertBefore(
      errorElement,
      inputElement.nextSibling,
    );
  });

  function restrictToNumbers(event) {
    event.target.value = event.target.value.replace(/\D/g, "");
  }

  function validateAlpha(inputId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(`${inputId}-error`);

    if (!error) return;

    if (input.value.trim() === "") {
      error.textContent = "Name is required.";
      return false;
    }

    if (!alphaRegex.test(input.value.trim())) {
      error.textContent = "Name should contain only alphabets.";
      return false;
    }
    error.textContent = "";
    return true;
  }

  function validateEmail(inputId) {
    const emailInput = document.getElementById(inputId);
    const emailError = document.getElementById(`${inputId}-error`);
    const allowedDomainsRegex = /^[^\s@]+@localhost$/;

    if (!emailError) return;

    if (emailInput.value === "") {
      emailError.textContent = "Email is required.";
      return false;
    } else if (!emailInput.value.includes("@")) {
      emailError.textContent = "Email must contain '@'.";
      return false;
    } else if (!allowedDomainsRegex.test(emailInput.value)) {
      emailError.textContent =
        "Please enter a valid email with the domain 'localhost'.";
      return false;
    }

    emailError.textContent = "";
    return true;
  }

  function togglePaymentDetails(detailsId) {
    document.querySelectorAll(".payment-details").forEach((detail) => {
      detail.classList.remove("active");
    });
    document.getElementById(detailsId).classList.add("active");
  }

  function validatePhone(inputId) {
    const phoneInput = document.getElementById(inputId);
    const phoneError = document.getElementById(`${inputId}-error`);

    if (!phoneError) return;

    if (phoneInput.value.trim() === "") {
      phoneError.textContent = "Phone number is required.";
      return false;
    } else if (!phoneRegex.test(phoneInput.value)) {
      phoneError.textContent = "Phone number must be 8 numbers: eg., 8765 4321";
      return false;
    }

    phoneError.textContent = "";
    return true;
  }

  function validateCardNumber() {
    const cardNumberInput = document.getElementById("card-number");

    let cardError = document.getElementById("card-number-error");
    if (!cardError) {
      cardError = document.createElement("p");
      cardError.id = "card-number-error";
      cardError.className = "error-message";
      cardNumberInput.parentNode.insertBefore(
        cardError,
        cardNumberInput.nextSibling,
      );
    }

    if (cardNumberInput.value.trim() === "") {
      cardError.textContent = "Card number is required.";
      return false;
    }

    const cardNumber = cardNumberInput.value.replace(/\s/g, "");
    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
      cardError.textContent = "Card number must be 16 digits.";
      return false;
    }

    cardError.textContent = "";
    return true;
  }

  function validateExpiryDate() {
    const expiryDateInput = document.getElementById("expiry-date");

    let expiryError = document.getElementById("expiry-date-error");
    if (!expiryError) {
      expiryError = document.createElement("p");
      expiryError.id = "expiry-date-error";
      expiryError.className = "error-message";
      expiryDateInput.parentNode.insertBefore(
        expiryError,
        expiryDateInput.nextSibling,
      );
    }
    if (expiryDateInput.value.trim() === "") {
      expiryError.textContent = "Expiry date is required.";
      return false;
    }

    const expiryValue = expiryDateInput.value.split("/");

    if (expiryValue.length !== 2) {
      expiryError.textContent = "Expiry date must be in MM/YY format.";
      return false;
    }

    const month = parseInt(expiryValue[0], 10);
    const year = parseInt(expiryValue[1], 10);

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12 || year < 24) {
      expiryError.textContent =
        "Invalid expiry date. Month should be 01-12 and year 2024 or later.";
      return false;
    }

    expiryError.textContent = "";
    return true;
  }

  function validateCVV() {
    const cvvInput = document.getElementById("cvv");

    let cvvError = document.getElementById("cvv-error");
    if (!cvvError) {
      cvvError = document.createElement("p");
      cvvError.id = "cvv-error";
      cvvError.className = "error-message";
      cvvInput.parentNode.insertBefore(cvvError, cvvInput.nextSibling);
    }

    if (cvvInput.value.trim() === "") {
      cvvError.textContent = "CVV is required.";
      return false;
    }

    if (cvvInput.value.length !== 3 || isNaN(cvvInput.value)) {
      cvvError.textContent = "CVV must be a 3-digit number.";
      return false;
    }

    cvvError.textContent = "";
    return true;
  }

  function checkFormCompletion() {
    let isFormComplete = false;
    const selectedMethod = Array.from(paymentMethodRadios).find(
      (radio) => radio.checked,
    )?.value;

    if (selectedMethod === "paynow") {
      isFormComplete =
        validateEmail("paynow-email") &&
        validatePhone("paynow-phone") &&
        validateAlpha("paynow-name") &&
        document.getElementById("paynow-name").value.trim() !== "";
    } else if (selectedMethod === "mastercard") {
      isFormComplete =
        validateEmail("mastercard-email") &&
        validateAlpha("mastercard-name") &&
        validateAlpha("cardholder-name") &&
        document.getElementById("mastercard-name").value.trim() !== "" &&
        document.getElementById("card-number").value.trim().length === 19 &&
        validateExpiryDate() &&
        document.getElementById("cvv").value.trim().length === 3 &&
        document.getElementById("cardholder-name").value.trim() !== "";
    }

    confirmButton.disabled = !isFormComplete;
    console.log("Confirm Button Enabled:", !confirmButton.disabled);
  }

  [
    "paynow-email",
    "mastercard-email",
    "paynow-name",
    "mastercard-name",
    "cardholder-name",
  ].forEach((inputId) => {
    const inputElement = document.getElementById(inputId);
    inputElement.addEventListener("input", () => {
      if (inputId.includes("name")) {
        validateAlpha(inputId);
      } else {
        validateEmail(inputId);
      }
      checkFormCompletion();
    });
  });

  const phoneInput = document.getElementById("paynow-phone");
  phoneInput.addEventListener("input", (event) => {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4) + " " + value.slice(4, 8);
    event.target.value = value;
    validatePhone("paynow-phone");
    checkFormCompletion();
  });

  const cardNumberInput = document.getElementById("card-number");
  cardNumberInput.addEventListener("input", (event) => {
    let value = event.target.value.replace(/\D/g, "");
    event.target.value = value.match(/.{1,4}/g)?.join(" ") || value;
    validateCardNumber();
    checkFormCompletion();
  });

  const cvvInput = document.getElementById("cvv");
  cvvInput.addEventListener("input", (event) => {
    restrictToNumbers(event);
    validateCVV();
    checkFormCompletion();
  });

  const expiryDateInput = document.getElementById("expiry-date");
  expiryDateInput.addEventListener("input", (event) => {
    let value = event.target.value.replace(/\D/g, "");
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2, 4);
    event.target.value = value;
    validateExpiryDate();
    checkFormCompletion();
  });

  paymentMethodRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (radio.value === "paynow") {
        paynowDetails.style.display = "block";
        mastercardDetails.style.display = "none";
        validateAlpha("paynow-name");
        validatePhone("paynow-phone");
      } else if (radio.value === "mastercard") {
        paynowDetails.style.display = "none";
        mastercardDetails.style.display = "block";
        validateAlpha("mastercard-name");
        validateAlpha("cardholder-name");
        validateCardNumber();
        validateExpiryDate();
        validateCVV();
      }
      checkFormCompletion();
    });
  });

  resetButton.addEventListener("click", () => {
    document
      .querySelectorAll(".payment-details input")
      .forEach((input) => (input.value = ""));
    paymentMethodRadios.forEach((radio) => (radio.checked = false));
    paynowDetails.style.display = "none";
    mastercardDetails.style.display = "none";
    confirmButton.disabled = true;
    console.log("Form reset. Confirm button disabled.");
  });

  confirmButton.addEventListener("click", () => {
    if (!confirmButton.disabled) {
      const selectedMethod = Array.from(paymentMethodRadios).find(
        (radio) => radio.checked,
      )?.value;

      if (selectedMethod === "paynow") {
        bookingDetails.paymentDetails = {
          method: "PayNow",
          name: document.getElementById("paynow-name").value,
          email: document.getElementById("paynow-email").value,
          phone: document.getElementById("paynow-phone").value,
        };
      } else if (selectedMethod === "mastercard") {
        bookingDetails.paymentDetails = {
          method: "MasterCard",
          name: document.getElementById("mastercard-name").value,
          email: document.getElementById("mastercard-email").value,
          cardNumber: document.getElementById("card-number").value,
          expiryDate: document.getElementById("expiry-date").value,
          cvv: document.getElementById("cvv").value,
          cardholderName: document.getElementById("cardholder-name").value,
        };
      }

      localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
      alert("Booking confirmed! Redirecting to confirmation page.");
      window.location.href = "successBooking.php";
    } else {
      console.log("Confirm button is disabled, check validations.");
    }
  });
});
