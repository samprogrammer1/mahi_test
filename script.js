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

  init(paper) {
    const startMove = (e, isTouch = false) => {
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;

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

      paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
    };

    const stopMove = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // Mouse Events
    paper.addEventListener("mousedown", (e) => startMove(e, false));
    document.addEventListener("mousemove", (e) => move(e, false));
    window.addEventListener("mouseup", stopMove);

    // Touch Events for Mobile
    paper.addEventListener("touchstart", (e) => startMove(e, true), { passive: false });
    document.addEventListener("touchmove", (e) => move(e, true), { passive: false });
    window.addEventListener("touchend", stopMove);
  }
}

const papers = document.querySelectorAll(".paper");

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});