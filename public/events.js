/*
!!!you'll be setting up event listeners and implementing AJAX requests using the Fetch API.
*/

let upVoteBtn = document.querySelector("#upvote");
let downVoteBtn = document.querySelector("#downvote");
let newPicBtn = document.querySelector("#new-pic");
let loaderDiv = document.querySelector(".loader");
let image = document.querySelector(".cat-pic");
let input = document.querySelector(".user-comment");
let form = document.querySelector(".comment-form");
let commentsDiv = document.querySelector(".comments");

window.addEventListener("DOMContentLoaded", fetchImage);
newPicBtn.addEventListener("click", fetchImage);
upVoteBtn.addEventListener("click", upVote);
downVoteBtn.addEventListener("click", downVote);
form.addEventListener("submit", handleSubmit);

function fetchImage() {
  startLoader();
  fetch("http://localhost:3000/kitten/image")
    .then(handleResponse)
    .then((data) => {
      image.src = data.src;
    })
    .catch(handleError);
}

function upVote() {
  fetch("/kitten/upvote", { method: "PATCH" })
    .then(handleResponse)
    .then(handleScore)
    .catch(handleError);
}
function downVote() {
  fetch("/kitten/downvote", { method: "PATCH" })
    .then(handleResponse)
    .then(handleScore) //TODO to keep the counter
    .catch(handleError);
}

function handleSubmit() {
  let comment = input.value;
  debugger;
  event.preventDefault();
  fetch("/kitten/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment }),
  })
    .then(handleResponse)
    .then((data) => {
      form.reset(); // this clears out the inputs it the form
      handleComments(data);
    })
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
function handleComments(data) {
  debugger;
  let comments = data.comments;
  let comment = comments[comments.length - 1];
  //   comments.forEach((comment) => {
  //create a div
  let div = document.createElement("div");
  //add the comment to NodeTextContent
  let commentContainer = document.createTextNode(`${comment}`);
  //append the comment
  div.appendChild(commentContainer);
  //append to the parent div
  commentsDiv.appendChild(div);
  //   });
}
function startLoader() {
  loaderDiv.innerHTML = "Loading...";
}
function stopLoader() {
  loaderDiv.innerHTML = "";
}
