const API_KEY = "45c2abfbde6d83b917cee0c666f1bfcc";

const URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
searchBtn.addEventListener("click",function(){
const query=searchInput.value.trim();
if(query===""){
  alert("Please enter a movie name.");
  return;
}
searchMovie(query);
});
searchInput.addEventListener("keydown",function(event){
  if(event.key==="Enter"){
    searchBtn.click();
  }
});
const hiddenGemBtn = document.getElementById("hiddenGemBtn");
hiddenGemBtn.addEventListener("click", hiddenGems);
async function hiddenGems() {
  const response=await fetch(URL);
  const data=await response.json();
  const movies=data.results;
  const hiddenMovies = movies.filter(movie=>{
    return movie.vote_average>=7.5&& movie.popularity<100;
  });
  displayMovies(hiddenMovies);
}
const runtimeFilter=document.getElementById("runtimeFilter");
runtimeFilter.addEventListener("change",runtimeMovies);
async function runtimeMovies(){
 const selectedRuntime=runtimeFilter.value;
 console.log(selectedRuntime);
 const response = await fetch(URL);
const data = await response.json();
const movies = data.results;
const movieDetails= await Promise.all(
  movies.map(async(movie)=>
  {
    const response=await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`
    );
    return await response.json();
  })
);
let filteredMovies = [];
if (selectedRuntime === "short") {
    filteredMovies = movieDetails.filter(movie => movie.runtime < 90);
}
else if (selectedRuntime === "medium") {
    filteredMovies = movieDetails.filter(movie =>
        movie.runtime >= 90 && movie.runtime <= 120
    );
}
else if (selectedRuntime === "long") {
    filteredMovies = movieDetails.filter(movie => movie.runtime > 120);
}
if (filteredMovies.length === 0) {
    document.querySelector("#movieGrid").innerHTML =
        "<h2>No movies found for this runtime ⏱️</h2>";
    return;
}
displayMovies(filteredMovies);
}
const surpriseBtn = document.getElementById("surpriseBtn");
surpriseBtn.addEventListener("click", surpriseMovie);
async function surpriseMovie() {
  const randomPage=Math.floor(Math.random()*50+1);
  const response = await fetch(`${URL}&page=${randomPage}`);
  const data = await response.json();
  const movies = data.results;
  const randomIndex = Math.floor(Math.random() * movies.length);
  const randomMovie = movies[randomIndex];
  getMovieDetails(randomMovie.id);
  console.log(randomMovie);
}
function displayMovies(movies){
  const movieGrid=document.querySelector("#movieGrid");
  let cardsHTML="";
  for(let i =0;i<movies.length;i++)
        {
         cardsHTML+=`
         <div class="movie-card" data-id="${movies[i].id}">
         <img
         class="poster"
         src="https://image.tmdb.org/t/p/w500${movies[i].poster_path}">
         <h3>${movies[i].title}</h3>
         <p>⭐${movies[i].vote_average.toFixed(1)}</p>
         <p>📅 ${movies[i].release_date}</p>
         </div>
         `;}
         movieGrid.innerHTML=cardsHTML;
  const cards = document.querySelectorAll(".movie-card");
    cards.forEach(card=>{
    card.addEventListener("click",()=>{     getMovieDetails(card.dataset.id);
      });
  });
}
fetch(URL)
    .then(response => response.json())
    .then(data => {
        const movies=data.results;
        displayMovies(movies);
        });
    function searchMovie(query){
      const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;
      fetch(searchURL)
      .then(response=>response.json())
      .then(data=> {
        const movies=data.results;
        const movieGrid = document.querySelector("#movieGrid");
        movieGrid.innerHTML = "";
        if (movies.length === 0) {

    movieGrid.innerHTML = `
        <h2>No movies found 😔</h2>
    `;

    return;
}
        displayMovies(movies);
      });
    }
    function getMovieDetails(movieId){
      const detailsURL =
`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;
fetch(detailsURL)
.then(response=>response.json())
.then(data=>{
  console.log(data);
  const modalBody = document.querySelector("#modalBody");
  const genreText=data.genres.map(genre=>genre.name).join("•");
  console.log(genreText);
  let runtimetext;
  if(data.runtime===0){
    runtimetext="Not Available";
  }else{
    runtimetext=data.runtime+"min";
  }
  let posterURL;

if (data.poster_path === null) {
    posterURL = "images/no-poster.png";
} else {
    posterURL = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
}
let overviewText;
if(data.overview===""|| data.overview===null){
  overviewText="overview not available.";
}else{
  overviewText=data.overview;
}
 modalBody.innerHTML = `
<div class="movie-details">

    <div class="left">

        <img
            src="${posterURL}"
            class="modal-poster">

    </div>

    <div class="right">

        <h2>${data.title}</h2>

        <p class="rating">
            ⭐ ${data.vote_average.toFixed(1)} / 10
        </p>

        <p class="release-date">
            📅 ${data.release_date}
        </p>

        <p class="runtime">
            ⏱ ${runtimetext}
        </p>

        <p class="genres">
            🎭 ${genreText}
        </p>

        <p class="overview-heading">
            📖 Overview
        </p>

        <p class="overview">
            ${overviewText}
        </p>
        <button id="watchLaterBtn">
             ❤️ Watch Later
             </button>
             
    </div>

</div>
`;document.querySelector("#watchLaterBtn")
.addEventListener("click",function() {
  let watchLater = localStorage.getItem("watchLater");
  if(watchLater===null){
    watchLater=[];
  }else{
    watchLater=JSON.parse(watchLater);
  }
  let movie={
    id:data.id,
    title:data.title,
    poster_path:data.poster_path,
    vote_average:data.vote_average
  };
  let exists=watchLater.some(function(movieItem){
    return movieItem.id===movie.id;
  });
  if(!exists){
    watchLater.push(movie);
    localStorage.setItem(
      "watchLater",JSON.stringify(watchLater)
    );
    alert("✅ Movie added to Watch Later!");
  }else{
    alert("ℹ️ Movie already exists in Watch Later.");
  }
  });
  openModal();
});
    }
    function openModal(){

    document
        .querySelector("#movieModal")
        .classList.remove("hidden");

}
function closeModal(){

    document
        .querySelector("#movieModal")
        .classList.add("hidden");

}document
    .querySelector("#closeModal")
    .addEventListener("click", closeModal);
const modal=document.querySelector("#movieModal");
modal.addEventListener("click",function(event){
  if(event.target === modal){
        closeModal();
    }
}); 
  document.addEventListener("keydown", function(event){
    if(event.key==="Escape"){
        closeModal();
    }
});