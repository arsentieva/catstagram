/*
!!!you'll be setting up event listeners and implementing AJAX requests using the Fetch API.
*/

let upVoteBtn = document.querySelector("#upvote");
let downVoteBtn = document.querySelector("#downvote");
let newPicBtn = document.querySelector("#new-pic");
let loaderDiv = document.querySelector(".loader");
let image = document.querySelector(".cat-pic");
let input = document.querySelector(".user-comment");

window.addEventListener("DOMContentLoaded", fetchImage);
newPicBtn.addEventListener("click", fetchImage);
upVoteBtn.addEventListener("click", upVote);
downVoteBtn.addEventListener("click", downVote);

function fetchImage() {
  startLoader();
  fetch("http://localhost:3000/kitten/image")
    .then(handleResponse)
    .then((data) => {
      console.log(data);
      image.src = data.src;
    })
    .catch(handleError);
}

function upVote() {
  fetch("/kitten/upvote", { method: "PATCH" })
    .then(handleResponse)
    .then(handleScore(true))
    .catch(handleError);
}
function downVote() {
  fetch("/kitten/downvote", { method: "PATCH" })
    .then(handleResponse)
    .then(handleScore(false)) //TODO to keep the counter
    .catch(handleError);
}

function handleScore(data) {
  let { score } = data;
  document.querySelector(".score").innerHTML = score;
}

function handleResponse(res) {
  stopLoader();
  if (!res.ok) {
    throw Error(res.statusText);
  }
  return res.json();
}

function handleError(error) {
  if (error.json) {
    error
      .json()
      .then(
        (data) =>
          (document.querySelector(
            ".error"
          ).innerHTML = `Error occured: ${errorJSON.message}`)
      );
  }
  alert(`Something went wrong! Please Try again!`);
}

function startLoader() {
  loaderDiv.innerHTML = "Loading...";
}
function stopLoader() {
  loaderDiv.innerHTML = "";
}
