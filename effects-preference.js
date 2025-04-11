// Effects preference utility - applies user's preference across all pages
(function () {
  // Check if reduced effects preference is set
  const reducedEffects = localStorage.getItem("reducedEffects") === "true";

  // Set global flag that other scripts can check
  window.reducedEffects = reducedEffects;

  // Function to apply reduced effects
  function applyReducedEffects() {
    if (document.body && reducedEffects) {
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
  }

  // Create the toggle button
  function createToggleButton() {
    // Check if the toggle already exists (to prevent duplicates)
    if (document.querySelector(".effects-toggle")) {
      return;
    }

    // Add a toggle button in the corner for users to change their preference
    const toggleContainer = document.createElement("div");
    toggleContainer.className = "effects-toggle";
    toggleContainer.style.position = "fixed";
    toggleContainer.style.bottom = "20px";
    toggleContainer.style.right = "20px";
    toggleContainer.style.zIndex = "10000"; // Ensure it's above everything else
    toggleContainer.style.backgroundColor = "rgba(26, 39, 179, 0.8)";
    toggleContainer.style.padding = "10px 15px";
    toggleContainer.style.borderRadius = "6px";
    toggleContainer.style.fontSize = "14px";
    toggleContainer.style.fontWeight = "bold";
    toggleContainer.style.color = "#fff";
    toggleContainer.style.cursor = "pointer";
    toggleContainer.style.transition = "all 0.3s ease";
    toggleContainer.style.opacity = "0.9"; // Make it more visible
    toggleContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.5)";
    toggleContainer.style.border = "1px solid rgba(255, 255, 255, 0.3)";
    toggleContainer.style.textShadow = "0 1px 2px rgba(0, 0, 0, 0.5)";
    toggleContainer.style.userSelect = "none"; // Prevent text selection
    toggleContainer.textContent = reducedEffects
      ? "Enable Full Effects"
      : "Enable Reduced Effects";

    // Show fully on hover with enhanced effects
    toggleContainer.addEventListener("mouseenter", () => {
      toggleContainer.style.opacity = "1";
      toggleContainer.style.transform = "translateY(-3px)";
      toggleContainer.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.6)";
      toggleContainer.style.backgroundColor = "rgba(26, 39, 179, 0.95)";
      toggleContainer.style.border = "1px solid rgba(255, 255, 255, 0.5)";
    });

    toggleContainer.addEventListener("mouseleave", () => {
      toggleContainer.style.opacity = "0.9";
      toggleContainer.style.transform = "translateY(0)";
      toggleContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.5)";
      toggleContainer.style.backgroundColor = "rgba(26, 39, 179, 0.8)";
      toggleContainer.style.border = "1px solid rgba(255, 255, 255, 0.3)";
    });

    // Toggle effects when clicked
    toggleContainer.addEventListener("click", () => {
      const currentSetting = localStorage.getItem("reducedEffects") === "true";
      const newSetting = !currentSetting;

      // Save new preference
      localStorage.setItem("reducedEffects", newSetting.toString());

      // Show feedback before reload
      toggleContainer.style.backgroundColor = "rgba(108, 19, 163, 0.9)";
      toggleContainer.textContent = "Applying changes...";

      // Reload page to apply changes after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 300);
    });

    // Add to document
    document.body.appendChild(toggleContainer);

    // Log to console for debugging
    console.log("Effects toggle button added to the page");
  }

  // Function to initialize everything when DOM is ready
  function init() {
    if (document.body) {
      // Apply reduced effects immediately if needed
      applyReducedEffects();

      // Create toggle button with a delay to ensure other elements are loaded
      setTimeout(() => {
        createToggleButton();
      }, 1000); // Reduced delay for better user experience

      // Add a backup check in case the first attempt fails
      setTimeout(() => {
        if (!document.querySelector(".effects-toggle")) {
          console.log("Retry adding effects toggle button");
          createToggleButton();
        }
      }, 3000);
    } else {
      // If body isn't ready yet, try again in a moment
      setTimeout(init, 100);
    }
  }

  // Start initialization based on document readiness
  if (document.readyState === "loading") {
    // Document still loading, wait for DOMContentLoaded
    document.addEventListener("DOMContentLoaded", init);
  } else if (
    document.readyState === "interactive" ||
    document.readyState === "complete"
  ) {
    // Document already loaded, run init directly
    init();
  }

  // Add a fallback initialization for any edge cases
  window.addEventListener("load", () => {
    if (!document.querySelector(".effects-toggle")) {
      console.log("Fallback: Adding effects toggle button after window load");
      createToggleButton();
    }
  });
})();
