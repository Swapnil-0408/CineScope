const watchLater=
JSON.parse(localStorage.getItem("watchLater"));
const container = document.querySelector("#watchLaterContainer");
if(watchLater.length===0){
  container.innerHTML = `
    <div class="empty-state">
        <h2>❤️ Your Watch Later is Empty</h2>
        <p>Looks like you haven't saved any movies yet.</p>
        <a href="index.html" class="browse-btn">
            🎬 Browse Movies
        </a>
    </div>
`; 
}
else{
watchLater.forEach(function(movie){
let card = `
<div class="movie-card">
    <img
        class="poster"
src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        alt="${movie.title}"
    >
    <div class="movie-info">
        <h3>${movie.title}</h3>
        <p class="rating">
            ⭐ ${movie.vote_average.toFixed(1)} / 10
        </p>
        <button class="removeBtn"
        data-id="${movie.id}"
        >
            🗑 Remove
        </button>
    </div>
</div>
`;
container.innerHTML += card;
});
const removebuttons=document.querySelectorAll(".removeBtn");
removebuttons.forEach(function(button){
button.addEventListener("click",function(){
const movieId=button.dataset.id;
console.log(movieId);
let updatewatchLater=watchLater.filter(function(movie){
return movie.id != movieId;
});
console.log(updatewatchLater);
localStorage.setItem(
  "watchLater",
  JSON.stringify(updatewatchLater)
);
location.reload();
});
});
}