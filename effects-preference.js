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
      .reduced-effects .page-transition {
        transition: opacity 0.5s ease !important; /* Smoother transitions */
      }

      /* Reduce animation intensities */
      .reduced-effects img {
        transition: transform 0.3s ease !important;
      }

      /* Reduce hover effects */
      .reduced-effects .content-box:hover {
        transform: translateY(-3px) !important;
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
  toggleContainer.style.backgroundColor = "rgba(26, 39, 179, 0.8)";
  toggleContainer.style.padding = "8px 12px";
  toggleContainer.style.borderRadius = "4px";
  toggleContainer.style.fontSize = "14px";
  toggleContainer.style.color = "#fff";
  toggleContainer.style.cursor = "pointer";
  toggleContainer.style.transition = "all 0.3s ease";
  toggleContainer.style.opacity = "0.7";
  toggleContainer.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
  toggleContainer.style.border = "1px solid rgba(255, 255, 255, 0.2)";
  toggleContainer.textContent = reducedEffects
    ? "Enable Full Effects"
    : "Enable Reduced Effects";

  // Show fully on hover with enhanced effects
  toggleContainer.addEventListener("mouseenter", () => {
    toggleContainer.style.opacity = "1";
    toggleContainer.style.transform = "translateY(-2px)";
    toggleContainer.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)";
    toggleContainer.style.backgroundColor = "rgba(26, 39, 179, 0.9)";
  });

  toggleContainer.addEventListener("mouseleave", () => {
    toggleContainer.style.opacity = "0.7";
    toggleContainer.style.transform = "translateY(0)";
    toggleContainer.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
    toggleContainer.style.backgroundColor = "rgba(26, 39, 179, 0.8)";
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
