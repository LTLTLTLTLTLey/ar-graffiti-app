let graffitiData = [];
let currentIndex = 0;
let lastUpdate = Date.now();

// Load your JSON dataset
fetch('graffitiData.json')
  .then(res => res.json())
  .then(data => {
    graffitiData = data;
    initCamera();
    initMotionDetection();
  })
  .catch(err => {
    console.error("Failed to load dataset:", err);
  });

// Initialize rear camera
function initCamera() {
  const video = document.getElementById('camera');
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      video.srcObject = stream;
      video.play(); // Ensure playback starts
    })
    .catch(err => {
      console.error("Camera access denied:", err);
    });
}

// Enable motion detection
function initMotionDetection() {
  window.addEventListener('devicemotion', handleMotion);
}

// Detect physical movement
function handleMotion(event) {
  const now = Date.now();
  const accel = event.accelerationIncludingGravity;

  if ((accel.x > 3 || accel.y > 3 || accel.z > 3) && now - lastUpdate > 1000) {
    lastUpdate = now;
    evolveGraffiti();
  }
}

// Display one graffiti symbol from the dataset
function evolveGraffiti() {
  if (currentIndex >= graffitiData.length) return;

  const data = graffitiData[currentIndex++];

  // 🧪 Debug line — shows in browser console
  console.log("Motion triggered: showing graffiti", data.symbol);

  const el = document.createElement('div');
  el.className = 'graffiti-layer';
  el.innerText = data.symbol || "🚚";
  el.style.color = data.color || 'white';
  el.style.top = `${Math.random() * 80 + 10}%`;
  el.style.left = `${Math.random() * 80 + 10}%`;

  document.getElementById('overlay').appendChild(el);
}
