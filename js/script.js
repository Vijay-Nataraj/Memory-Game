const rootEL = document.getElementById("root");
const gameBoardEl = document.getElementById("game-board");
const resetEl = document.getElementById("reset");

const timer = document.getElementById("timer");
const counts = document.getElementById("moves");
const winner = document.getElementById("cart");

let count = 0;
let seconds = 0;
let minutes = 0;
let timerInterval;
let selectedImages = [];
let isProcessing = false;
let matchCount = 0;

const images = [
  "./public/LionImage.jpeg",
  "./public/LionImage.jpeg",
  "./public/TigerImage.jpeg",
  "./public/TigerImage.jpeg",
  "./public/ElephantImage.jpeg",
  "./public/ElephantImage.jpeg",
  "./public/GiraffeImage.jpg",
  "./public/GiraffeImage.jpg",
  "./public/CheetahImages.jpeg",
  "./public/CheetahImages.jpeg",
  "./public/BearImage.jpeg",
  "./public/BearImage.jpeg",
  "./public/BlackPantherImage.jpg",
  "./public/BlackPantherImage.jpg",
  "./public/WolfImage.jpg",
  "./public/WolfImage.jpg",
];

const defaultImage = "./public/QuestionMark.avif";

// Start the game for the first time
startGame();

function resetGame() {
  count = 0;
  seconds = 0;
  minutes = 0;
  counts.textContent = `${count}`;
  timer.textContent = `${formatTime(minutes, seconds)}`;
  clearInterval(timerInterval);

  matchCount = 0;
  selectedImages = [];
  winner.innerHTML = "";
  winner.style.display = "none";

  // Clear the game board
  gameBoardEl.innerHTML = "";

  startGame();
}

function startGame() {
  const shuffledImages = images.sort(() => 0.5 - Math.random());

  shuffledImages.forEach((image) => {
    const img = document.createElement("img");
    img.src = defaultImage;
    img.className = "box";

    // Add click event listener
    img.addEventListener("click", function () {
      // Prevent clicks if we're already processing a match or the image is disabled
      if (isProcessing || img.classList.contains("disabled")) {
        return; // Exit the function if the image is disabled or processing
      }

      img.src = image; // Flip the image
      img.classList.add("flipBox"); // Optional: Add a flip effect
      selectedImages.push({ imgElement: img, imageSrc: image });

      count++; // Increment the move counter
      counts.textContent = `${count}`; // Update the move count display

      // Disable further clicks on this box immediately
      img.classList.add("disabled"); // Disable the clicked image

      if (selectedImages.length === 2) {
        isProcessing = true; // Set processing flag
        checkForMatch(); // Check for a match
      }
    });

    // Add touchstart event listener for mobile devices
    img.addEventListener("touchstart", function () {
      img.click(); // Trigger the click event on touch
    });

    gameBoardEl.appendChild(img);
  });

  startTimer();
}

function checkForMatch() {
  const [first, second] = selectedImages;

  if (first.imageSrc === second.imageSrc) {
    matchCount++;
    selectedImages.forEach(({ imgElement }) => {
      imgElement.classList.add("disabled"); // Disable further clicks
      imgElement.style.pointerEvents = "none"; // Ensure the image can't be clicked
    });
    selectedImages = []; // Clear selected images

    if (matchCount === 8) {
      clearInterval(timerInterval);
      displayWinner();
    } else {
      isProcessing = false; // Reset processing flag
    }
  } else {
    // If not a match, flip them back after a short delay
    setTimeout(() => {
      selectedImages.forEach(({ imgElement }) => {
        imgElement.src = defaultImage; // Flip back to default image
        imgElement.classList.remove("flipBox");
        imgElement.classList.remove("disabled"); // Re-enable the image for future clicks
      });
      selectedImages = []; // Clear selected images
      isProcessing = false; // Reset processing flag
    }, 1000); // Wait for 1 second before flipping back
  }
}

function displayWinner() {
  winner.style.display = "block";
  const winnerText = winner.appendChild(document.createElement("p"));
  winnerText.textContent = "You won the game!";

  const countText = winner.appendChild(document.createElement("p"));
  countText.textContent = `Total moves: ${count}`;

  const timeText = winner.appendChild(document.createElement("p"));
  timeText.textContent = `Time: ${formatTime(minutes, seconds)}`;
}

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    if (seconds === 60) {
      minutes++;
      seconds = 0; // Reset seconds after a minute
    }
    timer.textContent = `${formatTime(minutes, seconds)}`; // Update timer display
  }, 1000); // Update every second
}

function formatTime(minutes, seconds) {
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`; // Return formatted time
}
