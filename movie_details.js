// movie_details.js
let showtimesData = {};

function getMovieTitleFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("title");
}
function displayMovieDetails(movieTitle) {
  fetch(`getMovieDetails.php?title=${encodeURIComponent(movieTitle)}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched Movie Data:", data);
      if (data.error) {
        document.getElementById("movie-title").textContent = data.error;
      } else {
        const setText = (id, text) => {
          const element = document.getElementById(id);
          if (element) element.textContent = text;
        };
        setText("movie-title", data.title);
        const movieImage = document.getElementById("movie-image");
        if (movieImage) {
          movieImage.src = data.img;
          movieImage.alt = data.title;
        }
        setText("movie-synopsis", data.synopsis);
        setText("movie-cast", data.movie_cast);
        setText("movie-director", data.director);
        setText("movie-genre", data.genre);
        setText("movie-language", data.language);
        setText("movie-rating", data.rating);
        setText("movie-runtime", data.runtime);
        setText("movie-release-date", data.release_date);
        showtimesData = data.showtimes;
      }
    })
    .catch((error) => console.error("Error fetching movie details:", error));
}
function handleTimeSlotClick(cinema, date, time) {
  const movieTitle = getMovieTitleFromURL();
  window.location.href = `booking.html?title=${encodeURIComponent(movieTitle)}&cinema=${encodeURIComponent(cinema)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`;
}
function updateShowtimesTable(cinema) {
  const showtimesBody = document.getElementById("showtimes-body");
  showtimesBody.innerHTML = "";

  if (showtimesData[cinema]) {
    const dates = showtimesData[cinema];
    for (const [date, times] of Object.entries(dates)) {
      const row = document.createElement("tr");
      const dateCell = document.createElement("td");
      dateCell.textContent = date;
      row.appendChild(dateCell);

      const timesCell = document.createElement("td");
      times.forEach((time) => {
        const timeButton = document.createElement("button");
        timeButton.textContent = time;
        timeButton.classList.add("time-slot-button");
        timeButton.onclick = () => handleTimeSlotClick(cinema, date, time);
        timesCell.appendChild(timeButton);
      });
      row.appendChild(timesCell);
      showtimesBody.appendChild(row);
    }
  } else if (cinema) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="2">No showtimes available for this location.</td>`;
    showtimesBody.appendChild(row);
  }
}
window.onload = () => {
  const movieTitle = getMovieTitleFromURL();
  if (movieTitle) {
    displayMovieDetails(movieTitle);
  } else {
    document.getElementById("movie-title").textContent =
      "Movie title not found in URL";
  }
  document
    .getElementById("cinema-select")
    .addEventListener("change", (event) => {
      updateShowtimesTable(event.target.value);
    });
};
