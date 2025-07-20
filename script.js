video.srcObject = stream;
    video.play();
    console.log("✅ Camera started");
  })
  .catch(err => {
    console.error("❌ Camera error:", err);
  });

const enterButton = document.getElementById("enterButton");

enterButton.addEventListener("click", () => {
  enterButton.style.display = "none";
  showRandomGraffiti();
  window.addEventListener("click", showRandomGraffiti);
});

// Show random graffiti image and start scrolling
function showRandomGraffiti() {
  clearOverlay();

  const randomIndex = Math.floor(Math.random() * images.length);
  const img = document.createElement("img");
  img.src = `${imageFolder}${images[randomIndex]}`;
  img.className = "graffiti-image";


  document.getElementById("overlay").appendChild(img);
  currentImage = img;

  // Auto-clear after 10 seconds
 // setTimeout(() => {
 //   clearOverlay();
 // }, 10000);
}



// Clear graffiti overlay
function clearOverlay() {
  clearInterval(scrollInterval);
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = '';
  currentImage = null;
}
