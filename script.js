//You can edit ALL of the code here
const rootElem = document.getElementById("root");
const searchEpisodesBox = document.querySelector("#searchEpisode");
const select = document.getElementById("select");
const allEpisodes = [];
function setup() {
  // const allEpisodes = getAllEpisodes();
  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } else {
        throw new Error(
          `Encountered something unexpected: ${response.status} ${response.statusText}`
        );
      }
    })
    .then((data) => {
      // do whatever you want with the JSON response 
      // debugger;
      // data.forEach((episode)=>allEpisodes.push(episode));
      allEpisodes.push(...data);
      makePageForEpisodes(allEpisodes);
      searchEpisodesBox.addEventListener("keyup", searchEpisodes);
      createEpisodeSelector(allEpisodes);
    })
    .catch((error) => {
      // Handle the error
      console.log(error);
    });
}

function searchEpisodes() {
  let filteredEpisodes = allEpisodes.filter(filterEpisodes);
  makePageForEpisodes(filteredEpisodes);
}

function filterEpisodes(episode) {
  if (
    episode.name.toLowerCase().includes(searchEpisodesBox.value.toLowerCase())
  ) {
    return true;
  } else {
    return false;
  }
}

function makePageForEpisodes(episodeList) {
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  episodeList.forEach(createCard);
}

function createCard(episode) {
  let card = document.createElement("div");
  card.setAttribute("id", episode.id);
  rootElem.appendChild(card);
  card.className = "card-item";
  let cardTitle = document.createElement("h2");
  if (episode.season < 10) {
    episode.season = "0" + episode.season;
  }
  if (episode.number < 10) {
    episode.number = "0" + episode.number;
  }
  cardTitle.innerText =
    episode.name + " - " + "S" + episode.season + "E" + episode.number;
  card.appendChild(cardTitle);
  let cardImg = document.createElement("img");
  cardImg.src = episode.image.medium;
  card.appendChild(cardImg);
  let cardEpisodeSummary = document.createElement("span");
  cardEpisodeSummary.innerHTML = episode.summary;
  card.appendChild(cardEpisodeSummary);
}

function createEpisodeSelector(arr) {
  for (let i = 0; i < arr.length; i++) {
    let option = document.createElement("option");
    option.value = arr[i].val;
    option.text =
      "S" + arr[i].season + "E" + arr[i].number + " - " + arr[i].name;
    select.appendChild(option);
    option.setAttribute("value", arr[i].id);
    select.onchange = handleChosenEpisode;
  }
}

function handleChosenEpisode(event) {
  let opts = event.target.selectedOptions;
  if (opts.length !== 1) {
   return;
  }
  let id = opts[0].value;
  document.location.assign(`#${id}`);
  console.log("yes");
}

window.onload = setup;
