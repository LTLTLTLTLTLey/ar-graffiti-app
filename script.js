// List of image filenames
const images = ['graffiti1.png', 'graffiti2.png', 'graffiti3.png']; // update as needed
const imageFolder = 'images/';

let currentImage = null;
let scrollX = 0;
let scrollInterval = null;
let lastUpdate = Date.now();

// Call this on first touch
function requestMotionPermission() {
  if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === "granted") {
          console.log("✅ Motion permission granted");
          window.addEventListener("devicemotion", handleMotion);
        } else {
          alert("Please enable motion access in your browser settings.");
        }
      })
      .catch(err => {
        console.error("Motion permission error:", err);
      });
  } else {
    // Older iOS versions or Android
    console.log("📱 No motion permission API — attaching motion listener directly.");
    window.addEventListener("devicemotion", handleMotion);
  }
}

// Call this on first touch
window.addEventListener("touchstart", () => {
  requestMotionPermission();
}, { once: true });
 
// Activate camera
const video = document.getElementById('camera');
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then(stream => {
    video.srcObject = stream;
    video.play();
    console.log("Camera stream started");
  })
  .catch(err => {
    console.error("Camera access error:", err);
  });

// Listen for motion
window.addEventListener('devicemotion', (event) => {
  const now = Date.now();
  const accel = event.accelerationIncludingGravity;

  if ((accel.x > 2 || accel.y > 2 || accel.z > 2) && now - lastUpdate > 1000) {
    lastUpdate = now;
    showRandomGraffiti();
  }
});

// Also trigger on tap (useful for debugging)
window.addEventListener('click', () => {
  showRandomGraffiti();
});

// Show a random graffiti image and scroll it
function showRandomGraffiti() {
  clearOverlay();

  const img = document.createElement('img');
  img.className = 'graffiti-image';

  const randomIndex = Math.floor(Math.random() * images.length);
  img.src = `${imageFolder}${images[randomIndex]}`;

  img.onload = () => {
    scrollX = 0;
    scrollInterval = setInterval(() => scrollGraffiti(img), 30);
  };

  document.getElementById('overlay').appendChild(img);
  currentImage = img;

  // Clear image after 10 seconds
  setTimeout(() => {
    clearOverlay();
  }, 10000);
}

// Scroll image horizontally
function scrollGraffiti(img) {
  scrollX -= 2; // scroll speed
  img.style.transform = `translate(${scrollX}px, -50%)`;

  const maxScroll = img.width - window.innerWidth;
  if (Math.abs(scrollX) >= maxScroll) {
    scrollX = 0; // loop back to start
  }
}

// Remove current image and stop scrolling
function clearOverlay() {
  clearInterval(scrollInterval);
  const overlay = document.getElementById('overlay');
  overlay.innerHTML = '';
  currentImage = null;
}
