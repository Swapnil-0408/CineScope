const button = document.querySelector("button");
const searchInput = document.querySelector("#searchInput");
function searchMovies(){
  if(searchInput.value.trim()==="")
  {
    console.log("please enter a movie.");
  }
  else{
    console.log("searching for"+searchInput.value);
  }
}
button.addEventListener("click",searchMovies);
searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
      searchMovies();
    }
});