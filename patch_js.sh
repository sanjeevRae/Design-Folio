#!/bin/bash
sed -i '/initParallax();/a \
  \
  // ---- Swipe Indicator Fade ----\
  function initSwipeIndicator() {\
    const indicator = document.querySelector(".swipe-up-indicator");\
    if (!indicator) return;\
    window.addEventListener("scroll", function() {\
      if (window.scrollY > 50) {\
        indicator.style.opacity = "0";\
        indicator.style.pointerEvents = "none";\
      } else {\
        indicator.style.opacity = "1";\
      }\
    });\
  }\
  initSwipeIndicator();\
' js/main.js
