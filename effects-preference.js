// Effects preference utility - applies user's preference across all pages
(function () {
  // Check if reduced effects preference is set
  const reducedEffects = localStorage.getItem("reducedEffects") === "true";

  // Set global flag that other scripts can check
  window.reducedEffects = reducedEffects;

  // Apply reduced effects class to body if needed
  if (reducedEffects) {
    document.body.classList.add("reduced-effects");

    // Add CSS to handle reduced effects
    const reducedEffectsStyle = document.createElement("style");
    reducedEffectsStyle.textContent = `
      /* Reduced effects mode - applied site-wide */
      .reduced-effects .glitch-effect,
      .reduced-effects .tracking-lines {
        opacity: 0.15 !important; /* Reduce scanline intensity */
      }
      
      .reduced-effects .page-transition {
        transition: opacity 0.5s ease !important; /* Smoother transitions */
      }
      
      /* Reduce animation intensities */
      .reduced-effects .glitch-text {
        animation-duration: 0.8s !important; /* Slower glitch animations */
      }
      
      /* Disable screen shake */
      .reduced-effects .glitch-slice {
        animation: none !important;
      }
      
      /* Reduce flashing effects */
      .reduced-effects .flicker-overlay {
        opacity: 0.05 !important;
      }
      
      /* Reduce color intensity */
      .reduced-effects .glitch-rgb {
        opacity: 0.5 !important;
      }
    `;
    document.head.appendChild(reducedEffectsStyle);
  }

  // Add a toggle button in the corner for users to change their preference
  const toggleContainer = document.createElement("div");
  toggleContainer.className = "effects-toggle";
  toggleContainer.style.position = "fixed";
  toggleContainer.style.bottom = "10px";
  toggleContainer.style.right = "10px";
  toggleContainer.style.zIndex = "9999";
  toggleContainer.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  toggleContainer.style.padding = "5px 10px";
  toggleContainer.style.borderRadius = "4px";
  toggleContainer.style.fontSize = "12px";
  toggleContainer.style.color = "#fff";
  toggleContainer.style.cursor = "pointer";
  toggleContainer.style.transition = "opacity 0.3s ease";
  toggleContainer.style.opacity = "0.5";
  toggleContainer.textContent = reducedEffects
    ? "Enable Full Effects"
    : "Enable Reduced Effects";

  // Show fully on hover
  toggleContainer.addEventListener("mouseenter", () => {
    toggleContainer.style.opacity = "1";
  });

  toggleContainer.addEventListener("mouseleave", () => {
    toggleContainer.style.opacity = "0.5";
  });

  // Toggle effects when clicked
  toggleContainer.addEventListener("click", () => {
    const currentSetting = localStorage.getItem("reducedEffects") === "true";
    const newSetting = !currentSetting;

    // Save new preference
    localStorage.setItem("reducedEffects", newSetting.toString());

    // Reload page to apply changes
    window.location.reload();
  });

  // Add to document after a short delay
  setTimeout(() => {
    document.body.appendChild(toggleContainer);
  }, 2000);
})();
