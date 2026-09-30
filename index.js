// index.js
const movieList = document.getElementById("movie-list");
const nowShowingBtn = document.getElementById("nowShowingBtn");
const comingSoonBtn = document.getElementById("comingSoonBtn");

let nowShowingMovies = [];
let comingSoonMovies = [];

fetch("getMovies.php")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    nowShowingMovies = data.nowShowingMovies;
    comingSoonMovies = data.comingSoonMovies;
    displayMovies(nowShowingMovies);
    nowShowingBtn.classList.add("active");
  })
  .catch((error) => console.error("Error fetching movies:", error));

nowShowingBtn.addEventListener("click", () => displayMovies(nowShowingMovies));
comingSoonBtn.addEventListener("click", () => displayMovies(comingSoonMovies));

function displayMovies(movies) {
  movieList.innerHTML = "";
  movies.forEach((movie) => {
    const movieItem = document.createElement("div");
    movieItem.classList.add("movie-item");
    movieItem.innerHTML = `
            <img src="${movie.img}" alt="${movie.title}">
            <h3 style="font-size: 20px; font-weight: 500;">${movie.title}</h3>
            <div style="display: flex; justify-content: space-between; padding: 0 10px; max-width: 1400px;">
                <span style="width: 33%; padding-bottom: 8px;">${movie.runtime}</span>
                <span style="width: 66%; padding-bottom: 8px; text-align: right; padding-right: 8px;">${movie.genre}</span>
            </div>
            <button onclick="showMovieDetails('${movie.title}')">Book Tickets</button>
        `;
    movieList.appendChild(movieItem);
  });
  if (movies === nowShowingMovies) {
    nowShowingBtn.classList.add("active");
    comingSoonBtn.classList.remove("active");
  } else {
    comingSoonBtn.classList.add("active");
    nowShowingBtn.classList.remove("active");
  }
}
function showMovieDetails(movieTitle) {
  window.location.href = `movie_details.html?title=${encodeURIComponent(movieTitle)}`;
}
let slideIndex = 0;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}
function showSlides(n) {
  let slides = document.getElementsByClassName("slide");
  if (n >= slides.length) {
    slideIndex = 0;
  }
  if (n < 0) {
    slideIndex = slides.length - 1;
  }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex].style.display = "block";
}
setInterval(() => {
  plusSlides(1);
}, 10000);
