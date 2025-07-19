const images = ['graffiti1.png']; // Only one image for now
const imageFolder = 'images/';
let currentImage = null;
let scrollX = 0;
let scrollInterval = null;
let lastUpdate = Date.now();

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

function requestMotionAccess() {
  if (typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function") {
    // iOS only
    DeviceMotionEvent.requestPermission()
      .then(response => {
        if (response === "granted") {
          console.log("✅ Motion access granted (iOS)");
          window.addEventListener("devicemotion", handleMotion);
        } else {
          alert("Motion access denied.");
        }
      })
      .catch(err => {
        console.error("Motion access error:", err);
        alert("Error requesting motion access.");
      });
  } else {
    // Android / Desktop — skip permission
    console.log("📱 No motion permission needed — attaching listener");
    window.addEventListener("devicemotion", handleMotion);
  }
}


// Trigger permission request on first touch
window.addEventListener("click", requestMotionAccess, { once: true });

// Also allow tap to trigger graffiti
window.addEventListener('click', () => {
  showGraffiti();
});

// Motion logic
function handleMotion(event) {
  const now = Date.now();
  const accel = event.accelerationIncludingGravity;

  if ((accel.x > 2 || accel.y > 2 || accel.z > 2) && now - lastUpdate > 1000) {
    lastUpdate = now;
    showGraffiti();
  }
}

// Show graffiti image
function showGraffiti() {
  clearOverlay();

  const img = document.createElement('img');
  img.className = 'graffiti-image';
  img.src = `${imageFolder}${images[0]}`;

  console.log("🖼️ Loading image:", img.src);

  img.onload = () => {
    scrollX = 0;
    scrollInterval = setInterval(() => scrollImage(img), 30);
  };

  document.getElementById('overlay').appendChild(img);
  currentImage = img;

  // Clear after 10 seconds
  setTimeout(() => {
    clearOverlay();
  }, 10000);
}

// Scroll the image to the left
function scrollImage(img) {
  scrollX -= 2;
  img.style.transform = `translate(${scrollX}px, -50%)`;

  const maxScroll = img.width - window.innerWidth;
  if (Math.abs(scrollX) >= maxScroll) {
    scrollX = 0;
  }
}

// Remove the image
function clearOverlay() {
  clearInterval(scrollInterval);
  const overlay = document.getElementById('overlay');
  overlay.innerHTML = '';
  currentImage = null;
}
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
          alert("❌ Motion access denied. Go to Settings > Safari > Clear Data.");
        }
      })
      .catch(err => {
        console.error("Motion access error:", err);
        alert("❌ Error requesting motion access.");
      });
  } else {
    console.log("No requestPermission function. Attaching directly.");
    window.addEventListener("devicemotion", handleMotion);
  }
}

window.addEventListener("touchstart", () => {
  requestMotionAccess();
}, { once: true });

function handleMotion(event) {
  console.log("📱 Motion detected!", event.acceleration);
}
