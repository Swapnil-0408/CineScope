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
function displayMovies(movies){
  const movieGrid=document.querySelector("#movieGrid");
  for(let i =0;i<movies.length;i++)
        {
         let card=`
         <div class="movie-card" data-id="${movies[i].id}">
         <img
         class="poster"
         src="https://image.tmdb.org/t/p/w500${movies[i].poster_path}">
         <h3>${movies[i].title}</h3>
         <p>⭐${movies[i].vote_average.toFixed(1)}</p>
         <p>📅 ${movies[i].release_date}</p>
         </div>
         `;
         movieGrid.innerHTML+=card;
        }
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