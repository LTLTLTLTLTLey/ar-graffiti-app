const images = ['graffiti1.png', 'graffiti2.png'];
const imageFolder = 'images/';
let currentImage = null;
let scrollX = 0;
let scrollInterval = null;

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

// Show random graffiti image and start scrolling
function showRandomGraffiti() {
  clearOverlay();

  const randomIndex = Math.floor(Math.random() * images.length);
  const img = document.createElement('img');
  img.src = `${imageFolder}${images[randomIndex]}`;
  img.className = 'graffiti-image';

  img.onload = () => {
    // Start off-screen on the left so the image scrolls from left to right
    scrollX = -img.width;
    img.style.transform = `translate(${scrollX}px, -50%)`;
    scrollInterval = setInterval(() => scrollImage(img), 30);
  };

  document.getElementById('overlay').appendChild(img);
  currentImage = img;

  // Auto-clear after 10 seconds
  setTimeout(() => {
    clearOverlay();
  }, 10000);
}

// Scroll image horizontally from left to right
function scrollImage(img) {
  scrollX += 2;
  img.style.transform = `translate(${scrollX}px, -50%)`;

  if (scrollX >= window.innerWidth) {
    scrollX = -img.width;
  }
}

// Clear graffiti overlay
function clearOverlay() {
  clearInterval(scrollInterval);
  const overlay = document.getElementById('overlay');
  overlay.innerHTML = '';
  currentImage = null;
}
