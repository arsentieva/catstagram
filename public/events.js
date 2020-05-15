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
commentsDiv.addEventListener("click", handleDelete);

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
  clearError();
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
  //clear the main div container from its content
  // this way when we get all the comments we do not have to
  //figure out which one is new and which are old
  commentsDiv.innerHTML = "";
  data.comments.forEach((comment, index) => {
    //create a div
    let containerDiv = document.createElement("div");
    containerDiv.className = "comment-container";

    //store the comment in a <p> tag
    let p = document.createElement("p");
    p.appendChild(document.createTextNode(comment));

    //add a button next to the comment
    const deleteButton = document.createElement("button");
    deleteButton.appendChild(document.createTextNode("Delete"));
    deleteButton.className = "delete-button";
    deleteButton.setAttribute("id", index);

    // append to the parent div
    containerDiv.appendChild(p);
    containerDiv.appendChild(deleteButton);
    commentsDiv.appendChild(containerDiv);
  });
}

function handleDelete(event) {
  console.log("was invoked");
  if (event.target.tagName !== "BUTTON") return;

  fetch(`/kitten/comments/${event.target.id}`, { method: "DELETE" })
    .then(handleResponse)
    .then((data) => handleComments(data))
    .catch(handleError);
}

function startLoader() {
  loaderDiv.innerHTML = "Loading...";
}
function stopLoader() {
  loaderDiv.innerHTML = "";
}

const clearError = () => {
  document.querySelector(".error").innerHTML = "";
};
