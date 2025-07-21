const images = ['graffiti1.png', 'graffiti2.png'];
const imageFolder = 'images/';
let currentImage = null;
let scrollX = 0;
let scrollInterval = null;
let isPaused = false;

// Setup camera
const video = document.getElementById('camera');

navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  .then(stream => {
    video.srcObject = stream;
    video.play();
    console.log('✅ Camera started');
  })
  .catch(err => {
    console.error('❌ Camera error:', err);
  });

const enterButton = document.getElementById('enterButton');

enterButton.addEventListener('click', () => {
  enterButton.style.display = 'none';
  showRandomGraffiti();
  window.addEventListener('click', showRandomGraffiti);
});

// Pause scrolling while the user is holding the screen
window.addEventListener('pointerdown', pauseScrolling);
window.addEventListener('pointerup', resumeScrolling);

function showRandomGraffiti() {
  clearOverlay();

  const randomIndex = Math.floor(Math.random() * images.length);
  const img = document.createElement('img');
  img.src = `${imageFolder}${images[randomIndex]}`;
  img.className = 'graffiti-image';

  img.onload = () => {
    document.body.appendChild(img);
    currentImage = img;

    // Start just outside the left edge of the screen
    scrollX = -img.width;  // right edge of image is just off-screen left
    img.style.transform = `translate(${scrollX}px, -50%)`;

    scrollInterval = setInterval(() => scrollImage(img), 30);
  };
}

function scrollImage(img) {
  scrollX += 2; // move right
  img.style.transform = `translate(${scrollX}px, -50%)`;

  // Stop scrolling when the image fully exits on the right
  if (scrollX > window.innerWidth) {
    clearInterval(scrollInterval);
    img.remove();
  }
}

function pauseScrolling() {
  if (!isPaused && scrollInterval) {
    clearInterval(scrollInterval);
    isPaused = true;
  }
}

function resumeScrolling() {
  if (isPaused && currentImage) {
    scrollInterval = setInterval(() => scrollImage(currentImage), 30);
    isPaused = false;
  }
}


// Clear graffiti overlay
function clearOverlay() {
  clearInterval(scrollInterval);
  const overlay = document.getElementById('overlay');
  overlay.innerHTML = '';
  currentImage = null;
}
