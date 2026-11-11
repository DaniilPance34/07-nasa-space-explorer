// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

const gallery = document.getElementById("gallery");

async function getSpaceImages() {
    const startDate = startInput.value;
    const endDate = endInput.value;

    gallery.textContent = "Loading space photos...";
    gallery.classList.add("loading");

   const url = `https://science.nasa.gov/wp-json/wp/v2/apod-basic?start_date=${startDate}&end_date=${endDate}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch NASA data");
        }

        const data = await response.json();
        gallery.classList.remove("loading");

        console.log(data);

// Clear the old gallery
gallery.innerHTML = "";

// Go through each NASA entry
data.forEach(function(photo) {

    // Create a container for the photo
    const card = document.createElement("div");
    card.className = "space-card";

    // Only display image entries
    if (photo.media_type === "image") {

        const image = document.createElement("img");
        image.src = photo.hdurl || photo.url;
        image.alt = photo.title;

        const title = document.createElement("h3");
        title.textContent = photo.title;

        const date = document.createElement("p");
        date.textContent = photo.date;

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(date);

        gallery.appendChild(card);

        card.style.cursor = "pointer";

        card.addEventListener("click", function() {
            openModal(photo);
        });
    }
    else if (photo.media_type === "video") {
        const videoLink = document.createElement("a");

        videoLink.href = photo.permalink || photo.url;
        videoLink.target = "_blank";
        videoLink.rel = "noopener noreferrer";
        videoLink.textContent = "▶ Watch NASA Video";

        const title = document.createElement("h3");
        title.textContent = photo.title;

        const date = document.createElement("p");
        date.textContent = photo.date;

        card.appendChild(videoLink);
        card.appendChild(title);
        card.appendChild(date);

        gallery.appendChild(card);
    }
});
        
   } catch (error) {
    console.error(error);
    gallery.classList.remove("loading");

    if (!navigator.onLine) {
        gallery.textContent =
            "You are offline. Connect to the internet or try a previously loaded date range.";
    } else {
        gallery.textContent =
            "Error loading space photos. Please try again.";
    }
}
}

document.querySelector(".filters button")
    .addEventListener("click", getSpaceImages);


    // Find modal elements
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalExplanation = document.getElementById("modalExplanation");
const closeButton = document.getElementById("closeModal");

// Open modal with NASA photo information
function openModal(photo) {
    modalImage.src = photo.hdurl || photo.url;
    modalImage.alt = photo.title;
    modalTitle.textContent = photo.title;
    modalDate.textContent = photo.date;
    const temp = document.createElement("div");
    temp.innerHTML = photo.explanation || "";

    modalExplanation.textContent = temp.textContent;

    modal.hidden = false;
}

// Close modal
function closeModal() {
    modal.hidden = true;
}

closeButton.addEventListener("click", closeModal);

// Close when clicking outside the popup
modal.addEventListener("click", function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

// Close when pressing Escape
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

const spaceFacts = [
    "The Sun is about 4.6 billion years old.",
    "One day on Venus is longer than one year on Venus.",
    "Jupiter is the largest planet in our Solar System.",
    "Light from the Sun takes about 8 minutes to reach Earth.",
    "Neptune has some of the fastest winds in the Solar System."
];

const randomIndex = Math.floor(Math.random() * spaceFacts.length);

document.getElementById("spaceFact").textContent =
    "🚀 Did You Know? " + spaceFacts[randomIndex];