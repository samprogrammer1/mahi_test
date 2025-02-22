let highestZ = 1;

class Paper {
  holdingPaper = false;
  rotating = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  offsetX = 0;
  offsetY = 0;
  tapStartTime = 0;
  isDragging = false;

  init(paper) {
    paper.style.transition = "transform 0.3s ease-out"; // Smooth slide animation

    const startMove = (e, isTouch = false) => {
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;

      this.tapStartTime = Date.now(); // Store tap start time
      this.isDragging = false;

      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;

      this.mouseTouchX = clientX;
      this.mouseTouchY = clientY;
      this.prevMouseX = clientX;
      this.prevMouseY = clientY;

      const rect = paper.getBoundingClientRect();
      this.offsetX = this.mouseTouchX - rect.left;
      this.offsetY = this.mouseTouchY - rect.top;
    };

    const move = (e, isTouch = false) => {
      if (!this.holdingPaper) return;

      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;

      this.mouseX = clientX;
      this.mouseY = clientY;

      if (!this.rotating) {
        this.currentPaperX = this.mouseX - this.offsetX;
        this.currentPaperY = this.mouseY - this.offsetY;
      }

      // If movement is detected, enable smooth sliding
      if (Math.hypot(this.mouseX - this.mouseTouchX, this.mouseY - this.mouseTouchY) > 5) {
        this.isDragging = true;
        paper.style.transition = "transform 0.1s ease-out"; // Faster transition for sliding
      }

      paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
    };

    const stopMove = (e, isTouch = false) => {
      this.holdingPaper = false;
      this.rotating = false;

      const tapDuration = Date.now() - this.tapStartTime;
      const movedDistance = Math.hypot(this.mouseX - this.mouseTouchX, this.mouseY - this.mouseTouchY);

      if (tapDuration < 200 && movedDistance < 5) {
        // If tapped, fade out and remove
        paper.style.transition = "transform 0.3s ease-in-out, opacity 0.3s ease-in-out";
        paper.style.transform += " scale(0.8)";
        paper.style.opacity = "0";

        setTimeout(() => paper.remove(), 300);
      }
    };

    // Mouse Events
    paper.addEventListener("mousedown", (e) => startMove(e, false));
    document.addEventListener("mousemove", (e) => move(e, false));
    window.addEventListener("mouseup", (e) => stopMove(e, false));

    // Touch Events for Mobile
    paper.addEventListener("touchstart", (e) => startMove(e, true), { passive: false });
    document.addEventListener("touchmove", (e) => move(e, true), { passive: false });
    window.addEventListener("touchend", (e) => stopMove(e, true));
  }
}

const papers = document.querySelectorAll(".paper");

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});