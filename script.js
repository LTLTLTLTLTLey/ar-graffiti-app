const images = ['graffiti1.png', 'graffiti2.png', 'graffiti3.png']; // make sure these exist
const imageFolder = 'images/';
let currentImage = null;
let scrollX = 0;
let scrollInterval = null;

// Setup camera
const video = document.getElementById('camera');

navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then(stream => {
    video.srcObject = stream;
    video.play();
    console.log("✅ Camera started");
  })
  .catch(err => {
    console.error("❌ Camera error:", err);
  });

// Request motion access (iOS-specific)
function requestMotionAccess() {
  if (
    typeof DeviceMotionEvent !== 'undefined' &&
    typeof DeviceMotionEvent.requestPermission === 'function'
  ) {
    DeviceMotionEvent.requestPermission()
      .then(response => {
        console.log("Motion permission response:", response);
        if (response === 'granted') {
          alert("✅ Motion access granted!");
          window.addEventListener("devicemotion", handleMotion);
        } else {
          alert("❌ Motion access denied.");
        }
      })
      .catch(err => {
        console.error("Motion access error:", err);
        alert("❌ Error requesting motion access.");
      });
  } else {
    console.log("No requestPermission needed. Attaching listener.");
    window.addEventListener("devicemotion", handleMotion);
  }
}

// Trigger permission request on first user touch
window.addEventListener("touchstart", requestMotionAccess, { once: true });

// Tap also triggers graffiti
window.addEventListener("click", () => {
  showRandomGraffiti();
});

// Handle motion to trigger graffiti
function handleMotion(event) {
  const accel = event.accelerationIncludingGravity;
  if (accel && Math.abs(accel.x) > 2) {
    console.log("📱 Motion triggered");
    showRandomGraffiti();
  }
}

// Show random graffiti image and start scrolling
function showRandomGraffiti() {
  clearOverlay();

  const randomIndex = Math.floor(Math.random() * images.length);
  const img = document.createElement("img");
  img.src = `${imageFolder}${images[randomIndex]}`;
  img.className = "graffiti-image";

  img.onload = () => {
    scrollX = 0;
    scrollInterval = setInterval(() => scrollImage(img), 30);
  };

  document.getElementById("overlay").appendChild(img);
  currentImage = img;

  // Auto-clear after 10 seconds
  setTimeout(() => {
    clearOverlay();
  }, 10000);
}

// Scroll image horizontally
function scrollImage(img) {
  scrollX -= 2;
  img.style.transform = `translate(${scrollX}px, -50%)`;

  const maxScroll = img.width - window.innerWidth;
  if (Math.abs(scrollX) >= maxScroll) {
    scrollX = 0;
  }
}

// Clear graffiti overlay
function clearOverlay() {
  clearInterval(scrollInterval);
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = '';
  currentImage = null;
}
