let graffitiData = [];
let currentIndex = 0;
let lastUpdate = Date.now();

// Load dataset
fetch('graffitiData.json')
  .then(res => res.json())
  .then(data => {
    graffitiData = data;
    initCamera();
    initMotionDetection();
  });
  .catch(err => console.error("Error loading dataset:", err));

// Activate rear camera
function initCamera() {
  const video = document.getElementById('camera');
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      console.error("Camera access denied:", err);
    });
}

// Listen for motion
function initMotionDetection() {
  window.addEventListener('devicemotion', handleMotion);
}

// Handle physical movement
function handleMotion(event) {
  const now = Date.now();
  const accel = event.accelerationIncludingGravity;

  if ((accel.x > 3 || accel.y > 3 || accel.z > 3) && now - lastUpdate > 1000) {
    lastUpdate = now;
    evolveGraffiti();
  }
}

// Display next graffiti layer
function evolveGraffiti() {
  if (currentIndex >= graffitiData.length) return;

  const data = graffitiData[currentIndex++];
  const el = document.createElement('div');
  el.className = 'graffiti-layer';
  el.innerText = data.symbol || "🚚";

  // Styling from data
  el.style.color = data.color || 'white';
  el.style.top = `${Math.random() * 80 + 10}%`;
  el.style.left = `${Math.random() * 80 + 10}%`;

  document.getElementById('overlay').appendChild(el);
}
