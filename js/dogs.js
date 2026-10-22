const form = document.querySelector(".form");
const message = document.querySelector(".message");
const apiKey =
  "live_jv5WhTXAVToB3PMHmwz5ErDUqIsRHB2h49SoICyaZvEeVH0TCi6zdXErGihqYeLL";

form.addEventListener("submit", onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const dataObject = Object.fromEntries(data.entries());

  console.log(dataObject);
  apiCall(dataObject.breedName, dataObject.temperament);
  form.reset();
}

function apiCall(breedName, temperament) {
  let url;

  // If the user typed a name, search for it. If not, get all breeds.
  if (breedName) {
    url = `https://api.thedogapi.com/v1/breeds/search?q=${breedName}&api_key=${apiKey}`;
  } else {
    url = `https://api.thedogapi.com/v1/breeds?api_key=${apiKey}`;
  }

  console.log("Fetching:", url);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // show the data in the console
      showData(data, temperament);
    })
    .catch((error) => {
      console.log("Something went wrong:", error);
      message.textContent = "Something went wrong. Please try again.";
    });
} // ✅ apiCall ends here, after the fetch

// Show the dogs on the screen
function showData(data, temperament) {
  const dogsDiv = document.getElementById("dogs");
  dogsDiv.innerHTML = ""; // clear old results first

  let count = 0;

  for (let i = 0; i < data.length; i++) {
    const dog = data[i];
    const dogTemperament = dog.temperament || "";

    // Skip dogs that don't match the chosen temperament
    if (temperament && !dogTemperament.includes(temperament)) {
      continue;
    }
    console.log("Dog", dog);
    // if dog.image.url have value make it dog.image.url
    // else make it the placeholder;
    const image = dog.image.url
      ? dog.image.url
      : "https://placehold.co/300x200?text=No+Image";

    dogsDiv.innerHTML += `
      <div class="card">
        <img src="${image}" alt="${dog.name}" onerror="this.src='https://placehold.co/300x200?text=No+Image'">
        <h3>${dog.name}</h3>
        <p><strong>Temperament:</strong> ${dogTemperament}</p>
        <p><strong>Life span:</strong> ${dog.life_span}</p>
        <p><strong>Weight:</strong> ${dog.weight.imperial} lb</p>
      </div>
    `;
    count++;
  }

  if (count === 0) {
    message.textContent = "No breeds found. Try another name or temperament.";
  } else {
    message.textContent = `Found ${count} breed(s).`;
  }
}
