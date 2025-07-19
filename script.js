const imageFolder = 'images/';
const images = ['graffiti1.png', 'graffiti2.png', 'graffiti3.png']; // Add all your image names here
let currentImage = null;
let lastUpdate = Date.now();
let scrollX = 0;
let scrollInterval = null;

// Start camera
const video = document.getElementById('camera');
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then(stream => {
    video.srcObject = stream;
    video.play();
  })
  .catch(err => {
    console.error("Camera access error:", err);
  });

// Detect motion
window.addEventListener('load', () => {
  const img = document.createElement('img');
  img.src = 'images/graffiti1.png'; // change to a valid image you tested
  img.className = 'graffiti-image';

  document.getElementById('overlay').appendChild(img);
  console.log('Image appended:', img.src);
});

// Show random graffiti image
function showNewGraffiti() {
  clearOverlay();

  const img = document.createElement('img');
  img.className = 'graffiti-image';
  const random = Math.floor(Math.random() * images.length);
  img.src = `${imageFolder}${images[random]}`;
  img.onload = () => {
    scrollX = 0;
    scrollInterval = setInterval(() => scrollGraffiti(img), 50);
  };

  document.getElementById('overlay').appendChild(img);
  currentImage = img;

  // Reset after 10 seconds
  setTimeout(() => {
    clearOverlay();
  }, 10000);
}

// Scroll image horizontally
function scrollGraffiti(img) {
  scrollX -= 2; // scroll speed
  img.style.transform = `translate(${scrollX}px, -50%)`;

  if (Math.abs(scrollX) > img.width - window.innerWidth) {
    scrollX = 0; // Loop scroll
  }
}

function clearOverlay() {
  clearInterval(scrollInterval);
  const overlay = document.getElementById('overlay');
  overlay.innerHTML = '';
  currentImage = null;
}
