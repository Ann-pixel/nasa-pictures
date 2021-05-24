// alert("Baaaaaaaaaaaaa! Youre on! 🎇");
const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

const apiKey = "DEMO_KEY";
const count = 10;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function createDOMNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);

  currentArray.forEach((result) => {
    const card = document.createElement("div");
    card.classList.add("card");
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View full image";
    link.target = "_blank";
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "NASA Picture of the day.";
    image.loading = "lazy";
    image.classList.add("card-img-top");
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    saveText.textContent =
      page === "results" ? "Add to Favorites" : "Remove Favorites";
    saveText.setAttribute("onClick", `removeFavorite('${result.url}')`);
    const cardText = document.createElement("p");
    cardText.textContent = result.explanation;
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    const date = document.createElement("strong");
    date.textContent = result.date;
    const copyright = document.createElement("span");
    copyright.textContent = result.copyright ? ` ${result.copyright}` : "";

    //append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}
function updateDom(page) {
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
}

function saveFavorite(itemUrl) {
  // loop through array to select fave

  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;

      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    updateDom("favorites");
  }
}
async function getNasaPictures() {
  try {
    const res = await fetch(apiUrl);
    resultsArray = await res.json();

    updateDom("favorites");
  } catch (err) {
    console.log(err);
  }
}
getNasaPictures();
