  // ---- Swipe Indicator Fade ----
  function initSwipeIndicator() {
    const indicator = document.querySelector(".swipe-up-indicator");
    if (!indicator) return;
    const handleScroll = function() {
      if (window.scrollY > 20) {
        indicator.style.opacity = "0";
        indicator.style.pointerEvents = "none";
        window.removeEventListener("scroll", handleScroll);
        setTimeout(() => indicator.remove(), 300);
      }
    };
    window.addEventListener("scroll", handleScroll);
  }
  initSwipeIndicator();
