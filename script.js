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

  img.onload = () => {
    // Start at the rightmost edge so the image scrolls from right to left
    scrollX = window.innerWidth - img.width;
    scrollInterval = setInterval(() => scrollImage(img), 30);
  };

  document.getElementById("overlay").appendChild(img);
  currentImage = img;

  // Auto-clear after 10 seconds
 // setTimeout(() => {
 //   clearOverlay();
 // }, 10000);
}

// Scroll image horizontally
function scrollImage(img) {␊
  scrollX += 2;
  img.style.transform = `translate(${scrollX}px, -50%)`;␊
␊
  const maxScroll = img.width - window.innerWidth;␊
  if (scrollX >= 0) {
    scrollX = -maxScroll;
  }␊
}␊

// Clear graffiti overlay
function clearOverlay() {
  clearInterval(scrollInterval);
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = '';
  currentImage = null;
}
