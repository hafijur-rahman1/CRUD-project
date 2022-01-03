const formElm = document.querySelector("form");
const inputElm = document.querySelector(".add-input");
const submitBtnElm = document.querySelector(".submit-button");
const listTweet = document.querySelector(".tweet-list");
const filterElm = document.querySelector("#filter");

//session data store
let tweetStore = [];

let updateTweetId;
formElm.addEventListener("submit", (e) => {
  e.preventDefault();
  const time = timeLine();
  const name = gettingInput();
  const isError = inputValidate(name);

  if (!isError) {
    const id = tweetStore.length;
    const tweet = {
      id: id,
      name: name,
      time: time,
    };
    //add to session store
    tweetStore.push(tweet);
    //add to UI
    addToUi(id, name, time);
    //local storage
    addItemToLocalStore(tweet);

    resetInput();
  } else {
    alert`tweet length must be in 10`;
  }
});
//********delete item (event delegation)********
listTweet.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const id = getId(e.target);

    //delete from UI
    removeFromUI(id);
    //delete from session storage
    removeFromSessonStore(id);
    //remove from local storage
    removeTweetFromLocalStorage(id);
  } else if (e.target.classList.contains("edit")) {
    // console.log(`edit click`);
    //pick item id
    updateTweetId = getId(e.target);

    //find the item
    const foundTweet = tweetStore.find((tweet) => tweet.id === updateTweetId);

    //populate item data to ui
    populateUIinEditState(foundTweet);
    //show update btn
    if (!document.querySelector(".update-button")) {
      showUpdateBtn();
    }
  }
});
//update to ui(after update)
formElm.addEventListener("click", (e) => {
  if (e.target.classList.contains("update-button")) {
    //pick data from the input fild
    const name = gettingInput();
    const time = timeLine();

    //validate input
    const isError = inputValidate(name);
    if (isError) {
      alert`tweet length must be in 10`;
      return;
    }

    //update to ui + local storage
    tweetStore = tweetStore.map((tweet) => {
      if (tweet.id === updateTweetId) {
        return {
          id: tweet.id,
          name,
          time,
        };
      } else {
        return tweet;
      }
    });
    console.log(tweetStore);
    //reset input
    resetInput();
    //show submit btn
    submitBtnElm.style.display = "block";

    //update data from user
    showAllTweetToUI(tweetStore);
    //hide update btn
    document.querySelector(".update-button").remove();

    //update localstorage
    updateTweetTolocalStorage();
  }
});

//******* */ filter element*******
filterElm.addEventListener("keyup", (e) => {
  const filterValue = e.target.value;
  const result = tweetStore.filter((item) => item.name.includes(filterValue));

  // show item to UI
  showAllTweetToUI(result);
});

function showAllTweetToUI(items) {
  listTweet.innerHTML = "";
  items.forEach((item) => {
    const listElm = `<li class='list-tweer-group tweet-${item.id} mb-3'>
              ${item.name}  - <small>${item.time}</small> <button class="btn btn-danger delete">Delete</button> <button class="btn btn-warning edit">edit</button>
              
            </li>`;
    listTweet.insertAdjacentHTML("afterbegin", listElm);
  });
}

//edit funcntion
function populateUIinEditState(tweet) {
  inputElm.value = tweet.name;
}
function showUpdateBtn() {
  const elm = ` <button type="button" class="form-control btn btn-warning mt-2 update-button">Update</button>`;
  //hide submit btn
  submitBtnElm.style.display = "none";
  formElm.insertAdjacentHTML("beforeend", elm);
}
function updateTweetTolocalStorage() {
  if (localStorage.getItem("myTweets")) {
    localStorage.setItem("myTweets", JSON.stringify(tweetStore));
  }
}

function removeTweetFromLocalStorage(id) {
  // console.log();
  const tweetStore = JSON.parse(localStorage.getItem("myTweets"));
  const afterRemove = updateAfterRemove(tweetStore, id);
  localStorage.setItem("myTweets", JSON.stringify(afterRemove));
}

function addItemToLocalStore(item) {
  let tweets;
  if (localStorage.getItem("myTweets")) {
    tweets = JSON.parse(localStorage.getItem("myTweets"));
    tweets.push(item);
    localStorage.setItem("myTweets", JSON.stringify(tweets));
  } else {
    tweets = [];
    tweets.push(item);
    localStorage.setItem("myTweets", JSON.stringify(tweets));
  }
}

function updateAfterRemove(tweetStore, id) {
  return tweetStore.filter((tweet) => tweet.id !== id);
}

function removeFromSessonStore(id) {
  const afterDelete = updateAfterRemove(tweetStore, id);
  tweetStore = afterDelete;
}

function removeFromUI(id) {
  document.querySelector(`.tweet-${id}`).remove();
}

function getId(eliment) {
  const listElm = eliment.parentElement;
  return Number(listElm.classList[1].split("-")[1]);
}

function inputValidate(input) {
  isError = false;
  if (!input || input.length < 10) {
    isError = true;
  }
  return isError;
}

function gettingInput() {
  return (input = inputElm.value);
}

function addToUi(id, name, time) {
  const listElm = `<li class='list-tweer-group tweet-${id} mb-3'>
              ${name} - <small>${time}</small><button class="btn btn-danger delete">Delete</button> <button class="btn btn-warning edit">edit</button>
             
            </li>`;
  listTweet.insertAdjacentHTML("afterbegin", listElm);
}

function resetInput() {
  inputElm.value = "";
}
//time function
function timeLine() {
  let day = new Date();

  let time = day.toLocaleString(undefined, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return time;
}

// ******************DOM loaded********
document.addEventListener("DOMContentLoaded", (e) => {
  if (localStorage.getItem("myTweets")) {
    tweetStore = JSON.parse(localStorage.getItem("myTweets"));
    //show to UI
    showAllTweetToUI(tweetStore);
  }
});
