// Enhanced professional effects for the splash page - optimized for all devices
document.addEventListener("DOMContentLoaded", function () {
  // Only run on the splash page
  if (window.location.pathname.includes("Pages/")) {
    return;
  }

  // Create a transition container if it doesn't exist
  createTransitionContainer();

  // Get the user's effects preference
  const reducedEffects = localStorage.getItem("reducedEffects") === "true";

  // Start effects based on user preference
  startEffects(reducedEffects);

  // Start the redirect timer
  resumeRedirect();

  // Add event listener to clean up animations when the page is about to unload
  window.addEventListener("beforeunload", function () {
    // Stop all animations and effects before page unloaded
    if (typeof stopAllSplashEffects === "function") {
      stopAllSplashEffects();
    } else {
      // Fallback if the function isn't available yet
      const animationElements = document.querySelectorAll(
        ".particle-container, .subtle-glow"
      );
      animationElements.forEach((element) => {
        if (element && element.parentNode) {
          element.style.opacity = "0";
        }
      });

      // Clear any intervals
      if (window.effectsInterval) {
        clearInterval(window.effectsInterval);
        window.effectsInterval = null;
      }

      // Add class to stop animations
      document.body.classList.add("stop-animations");
    }
  });
});

// Determine if we're on mobile
function isMobileDevice() {
  return (
    window.innerWidth <= 768 ||
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(navigator.userAgent)
  );
}

// Add a subtle glow effect to the logo
function addLogoGlow() {
  const logo = document.querySelector(".splash-logo h1");
  if (!logo) return; // Safety check

  // Check if reduced effects are enabled
  if (
    window.reducedEffects === true ||
    document.body.classList.contains("reduced-effects")
  ) {
    // For reduced effects, add a subtle static glow
    logo.style.textShadow = "0 0 10px rgba(42, 71, 179, 0.5)";
    return;
  }

  // Create a subtle pulsing glow effect
  function pulseGlow() {
    // Don't animate if effects are paused
    if (document.body.classList.contains("effects-paused")) {
      return;
    }

    const intensity = Math.sin(Date.now() / 1000) * 0.2 + 0.8; // Value between 0.6 and 1.0
    const glowSize = 10 + intensity * 5; // Between 10 px and 15 px
    const glowOpacity = 0.5 + intensity * 0.3; // Between 0.5 and 0.8

    logo.style.textShadow = `0 0 ${glowSize}px rgba(42, 71, 179, ${glowOpacity})`;

    // Request next frame
    window.logoGlowFrame = requestAnimationFrame(pulseGlow);
  }

  // Start the glow animation
  pulseGlow();
}

// Add a subtle particle effect in the background
function addParticleEffect() {
  // Check if reduced effects are enabled
  if (
    window.reducedEffects === true ||
    document.body.classList.contains("reduced-effects")
  ) {
    return;
  }

  const container = document.querySelector(".splash-container");
  if (!container) return; // Safety check

  // Check if a particle container already exists
  if (document.querySelector(".particle-container")) return;

  // Create particle container
  const particleContainer = document.createElement("div");
  particleContainer.className = "particle-container";
  particleContainer.style.position = "absolute";
  particleContainer.style.top = "0";
  particleContainer.style.left = "0";
  particleContainer.style.width = "100%";
  particleContainer.style.height = "100%";
  particleContainer.style.zIndex = "1";
  particleContainer.style.pointerEvents = "none";
  particleContainer.style.overflow = "hidden";
  container.appendChild(particleContainer);

  // Determine the number of particles based on a device
  const mobile = isMobileDevice();
  const particleCount = mobile ? 15 : 30;

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    createParticle(particleContainer);
  }

  // Add keyframes for particle animation if they don't exist
  if (!document.getElementById("particle-keyframes")) {
    const style = document.createElement("style");
    style.id = "particle-keyframes";
    style.textContent = `
            @keyframes float-up {
                0% { transform: translateY(100%) translateX(0); opacity: 0; }
                10% { opacity: 0.7; }
                90% { opacity: 0.5; }
                100% { transform: translateY(-100%) translateX(var(--x-drift)); opacity: 0; }
            }
        `;
    document.head.appendChild(style);
  }
}

// Create a single particle
function createParticle(container) {
  const particle = document.createElement("div");

  // Random properties
  const size = Math.random() * 4 + 2; // 2-6px
  const xPos = Math.random() * 100; // 0-100%
  const duration = Math.random() * 10 + 10; // 10-20s
  const delay = Math.random() * 5; // 0-5s
  const xDrift = Math.random() * 100 - 50 + "px"; // -50px to +50px drift

  // Set particle styles
  particle.style.position = "absolute";
  particle.style.bottom = "-10px";
  particle.style.left = xPos + "%";
  particle.style.width = size + "px";
  particle.style.height = size + "px";
  particle.style.borderRadius = "50%";
  particle.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
  particle.style.boxShadow = "0 0 " + size / 2 + "px rgba(255, 255, 255, 0.5)";
  particle.style.opacity = "0";
  particle.style.setProperty("--x-drift", xDrift);
  particle.style.animation = `float-up ${duration}s linear ${delay}s infinite`;

  container.appendChild(particle);
  return particle;
}

// Add subtle background gradient movement
function addGradientMovement() {
  // Check if reduced effects are enabled
  if (
    window.reducedEffects === true ||
    document.body.classList.contains("reduced-effects")
  ) {
    return;
  }

  const background = document.querySelector(".splash-background");
  if (!background) return; // Safety check

  // Create a subtle moving gradient overlay
  const gradientOverlay = document.createElement("div");
  gradientOverlay.className = "gradient-overlay";
  gradientOverlay.style.position = "absolute";
  gradientOverlay.style.top = "0";
  gradientOverlay.style.left = "0";
  gradientOverlay.style.width = "100%";
  gradientOverlay.style.height = "100%";
  gradientOverlay.style.background =
    "radial-gradient(circle at 50% 50%, rgba(42, 71, 179, 0.1), transparent 70%)";
  gradientOverlay.style.zIndex = "0";
  gradientOverlay.style.opacity = "0";
  gradientOverlay.style.pointerEvents = "none";

  // Add to container
  const container = document.querySelector(".splash-container");
  if (container) {
    container.appendChild(gradientOverlay);
  }

  // Animate the gradient position
  let angle = 0;

  function moveGradient() {
    // Don't animate if effects are paused
    if (document.body.classList.contains("effects-paused")) {
      return;
    }

    angle += 0.2;
    const radius = 10; // How far the gradient moves
    const x = 50 + Math.sin((angle * Math.PI) / 180) * radius;
    const y = 50 + Math.cos((angle * Math.PI) / 180) * radius;

    gradientOverlay.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(42, 71, 179, 0.15), transparent 70%)`;

    // Request next frame
    window.gradientFrame = requestAnimationFrame(moveGradient);
  }

  // Start the gradient animation
  moveGradient();
}

// Update transition container to use unified styles - matching the main site transitions
function createTransitionContainer() {
  // Create the transition elements if they don't exist
  if (!document.querySelector(".page-transition")) {
    // Create the main container
    const transitionContainer = document.createElement("div");
    transitionContainer.className = "page-transition";

    // Create a subtle gradient overlay - same as main site
    const overlay = document.createElement("div");
    overlay.className = "glitch-overlay";
    overlay.style.background =
      "radial-gradient(circle, rgba(26, 39, 179, 0.1) 0%, rgba(0, 0, 0, 0.7) 100%)";
    overlay.style.opacity = "0.8";
    overlay.style.animation = "none";
    transitionContainer.appendChild(overlay);

    // Create subtle scanlines for texture - same as main site
    const scanlines = document.createElement("div");
    scanlines.className = "glitch-scanlines";
    scanlines.style.opacity = "0.1";
    scanlines.style.backgroundSize = "100% 4px";
    transitionContainer.appendChild(scanlines);

    // Create a subtle color layer - same as main site
    const colorLayer = document.createElement("div");
    colorLayer.className = "glitch-rgb";
    colorLayer.style.background =
      "linear-gradient(135deg, rgba(26, 39, 179, 0.05), rgba(108, 19, 163, 0.05))";
    colorLayer.style.opacity = "0.3";
    colorLayer.style.animation = "none";
    transitionContainer.appendChild(colorLayer);

    // Create a container for the glitch text to ensure proper centering - same as main site
    // Using flexbox for perfect centering
    const textContainer = document.createElement("div");
    textContainer.className = "glitch-text-container";

    // Create a wrapper for the glitch text to ensure it stays centered - same as main site
    const textWrapper = document.createElement("div");
    textWrapper.style.textAlign = "center";
    textWrapper.style.width = "100%";

    // Create glitch text with an enhanced effect - same as main site
    const glitchText = document.createElement("div");
    glitchText.className = "glitch-text";
    glitchText.textContent = "LOADING";
    // Set data-text attribute for pseudo-element content
    glitchText.setAttribute("data-text", "LOADING");

    // Add text to wrapper, wrapper to container, then container to transition
    textWrapper.appendChild(glitchText);
    textContainer.appendChild(textWrapper);
    transitionContainer.appendChild(textContainer);

    // Add a loading bar container - same as main site
    const loadingBarContainer = document.createElement("div");
    loadingBarContainer.className = "loading-bar-container";
    loadingBarContainer.style.position = "absolute";
    loadingBarContainer.style.bottom = "30%";
    loadingBarContainer.style.left = "50%";
    loadingBarContainer.style.transform = "translateX(-50%)";
    loadingBarContainer.style.width = "280px";
    loadingBarContainer.style.height = "4px";
    loadingBarContainer.style.backgroundColor = "rgba(240, 240, 245, 0.1)";
    loadingBarContainer.style.borderRadius = "2px";
    loadingBarContainer.style.overflow = "hidden";

    // Add a loading bar - same as main site
    const loadingBar = document.createElement("div");
    loadingBar.className = "loading-bar";
    loadingBar.style.height = "100%";
    loadingBar.style.width = "0";
    loadingBar.style.background = "linear-gradient(90deg, #1a27b3, #6c13a3)";
    loadingBar.style.borderRadius = "2px";
    loadingBar.style.animation = "loading 0.8s ease-in-out forwards";

    loadingBarContainer.appendChild(loadingBar);
    transitionContainer.appendChild(loadingBarContainer);

    // Force an update of the transition size
    setTimeout(() => {
      updateTransitionSize();
    }, 0);

    // Add to document
    document.body.appendChild(transitionContainer);

    // Add keyframes for loading animation if not already present
    if (!document.getElementById("loading-keyframes")) {
      const style = document.createElement("style");
      style.id = "loading-keyframes";
      style.textContent = `
        @keyframes loading {
          0% { width: 0; }
          20% { width: 20%; }
          50% { width: 60%; }
          80% { width: 85%; }
          100% { width: 100%; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Ensure the transition container is properly sized for the viewport
  function updateTransitionSize() {
    const transition = document.querySelector(".page-transition");
    if (transition) {
      transition.style.width = window.innerWidth + "px";
      transition.style.height = window.innerHeight + "px";
    }
  }

  // Update on resize
  window.addEventListener("resize", updateTransitionSize);
}

// Set up an automatic transition that triggers before the meta-refresh
// Setup manual transition for the Enter button
function setupManualTransition() {
  const enterButton = document.getElementById("enter-button");
  if (!enterButton) return;

  enterButton.addEventListener("click", function (e) {
    e.preventDefault();

    const href = this.getAttribute("href");
    triggerTransition(href);
  });
}

// Call this function when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Only run on the splash page
  if (!window.location.pathname.includes("Pages/")) {
    setupManualTransition();
  }
});

// Function to completely stop all splash page animations and effects
// Made global so it can be called from anywhere
function stopAllSplashEffects() {
  // 1. Remove all animation elements
  const animationElements = document.querySelectorAll(
    ".particle-container, .gradient-overlay, .subtle-glow"
  );
  animationElements.forEach((element) => {
    if (element && element.parentNode) {
      element.style.opacity = "0";
      // Try to completely remove the element if possible
      try {
        element.parentNode.removeChild(element);
      } catch (e) {
        // Fallback if removal fails
        element.style.display = "none";
      }
    }
  });

  // 2. Clear any animation frames
  if (window.logoGlowFrame) {
    cancelAnimationFrame(window.logoGlowFrame);
    window.logoGlowFrame = null;
  }

  if (window.gradientFrame) {
    cancelAnimationFrame(window.gradientFrame);
    window.gradientFrame = null;
  }

  // 3. Reset any animated elements to their original state
  const logo = document.querySelector(".splash-logo h1");
  if (logo) {
    logo.style.textShadow = "";
    logo.style.transform = "";
    logo.style.letterSpacing = "";
    logo.style.filter = "";
  }

  // 4. Stop any CSS animations by adding a class that forces animations to none
  document.body.classList.add("stop-animations");

  // 5. Add style to force to stop all animations
  if (!document.getElementById("stop-animations-style")) {
    const stopAnimationsStyle = document.createElement("style");
    stopAnimationsStyle.id = "stop-animations-style";
    stopAnimationsStyle.textContent = `
      .stop-animations * {
        animation: none !important;
        -webkit-animation: none !important;
        transition: none !important;
        -webkit-transition: none !important;
      }
    `;
    document.head.appendChild(stopAnimationsStyle);
  }
}

// Trigger the transition effect - using the same approach as the main site
function triggerTransition(href) {
  // Check if transition is already active to prevent overlapping animations
  if (window.transitionActive === true) {
    console.log("Transition already active, skipping duplicate");
    return;
  }

  // Set flag to prevent multiple transitions
  window.transitionActive = true;

  // Get the transition element
  let transition = document.querySelector(".page-transition");

  if (!transition) {
    // Create a transition element if it doesn't exist
    createTransitionContainer();
    // Try to get it again
    transition = document.querySelector(".page-transition");
    if (!transition) {
      window.location.href = href;
      return;
    }
  }

  // Prepare for transition by gradually reducing animations
  // instead of stopping them abruptly
  const animationElements = document.querySelectorAll(
    ".particle-container, .gradient-overlay, .subtle-glow"
  );

  // Fade out animations gradually
  animationElements.forEach((element) => {
    if (element && element.style) {
      // Apply a transition to the opacity
      element.style.transition = "opacity 0.3s ease-out";
      element.style.opacity = "0"; // Set to 0 for complete fade-out
    }
  });

  // Generate random loading text - same options as main site
  const glitchTexts = [
    "LOADING",
    "PLEASE WAIT",
    "REDIRECTING",
    "NAVIGATING",
    "PROCESSING",
    "PREPARING",
    "LOADING PAGE",
    "ALMOST THERE",
    "JUST A MOMENT",
  ];
  const randomText =
    glitchTexts[Math.floor(Math.random() * glitchTexts.length)];

  // Update glitch text
  const glitchTextElement = document.querySelector(".glitch-text");
  if (glitchTextElement) {
    glitchTextElement.textContent = randomText;
    glitchTextElement.setAttribute("data-text", randomText);
  }

  // Prevent scrolling during transition
  document.body.style.overflow = "hidden";

  // Force a browser reflow to ensure all styles are applied immediately
  void transition.offsetWidth;

  // Show the transition
  transition.classList.add("active");
  console.log("Activated transition");

  // Force immediate update of glitch text styles - reuse the existing element
  if (glitchTextElement) {
    // Force a style recalculation
    void glitchTextElement.offsetHeight;

    // Apply a tiny transform to trigger hardware acceleration
    if (!glitchTextElement.style.transform.includes("!important")) {
      glitchTextElement.style.transform = "translateZ(0)";
    }

    // Force animation to restart
    glitchTextElement.style.animationName = "none";
    void glitchTextElement.offsetHeight;
    glitchTextElement.style.animationName = "";
  }

  // Determine if we're on mobile with a simplified check
  const isMobile =
    window.innerWidth <= 768 ||
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(navigator.userAgent);

  // Check if reduced effects mode is enabled
  const reducedEffects =
    window.reducedEffects === true ||
    document.body.classList.contains("reduced-effects");

  // Add transition effects, respecting reduced effects setting
  if (reducedEffects) {
    // Minimal effects for reduced mode
    document.body.style.filter = "brightness(0.98)";
    // Add a reduced-effects class if not already present
    if (!document.body.classList.contains("reduced-effects")) {
      document.body.classList.add("reduced-effects");
    }
  } else {
    // Normal effects based on a device
    document.body.style.filter = isMobile
      ? "brightness(0.9)"
      : "brightness(0.85)";
  }

  // Navigate after a delay - adjusting based on device and effects mode
  const navigationDelay = reducedEffects ? 300 : isMobile ? 600 : 800;

  setTimeout(() => {
    window.location.href = href;
  }, navigationDelay);
}

// Note: The effect warning has been moved to a separate page (effects-preferences.html)

// Resume the automatic redirect and animations
function resumeRedirect() {
  // Remove the paused class
  document.body.classList.remove("effects-paused");

  // Get the loading bar element
  const loadingBar = document.querySelector(".loading-bar");

  // Reset and restart the loading bar animation
  if (loadingBar) {
    // Reset the loading bar to 0%
    loadingBar.style.width = "0%";

    // Set a fixed duration for the animation (9 seconds)
    loadingBar.style.animationDuration = "9s";

    // Force a reflow to restart the animation
    void loadingBar.offsetWidth;

    // Start the animation
    loadingBar.style.animationPlayState = "running";
  }

  // Make the redirect message visible only after loading bar animation completes
  const redirectMessage = document.querySelector(".redirect-message");

  if (redirectMessage && loadingBar) {
    // Hide the redirect message initially
    redirectMessage.style.opacity = "0";

    // Add an event listener for the end of the loading bar animation
    loadingBar.addEventListener("animationend", () => {
      // Show the redirect message when loading animation completes
      redirectMessage.style.opacity = "1";
    });
  }
}

// Start all effects with optional reduced intensity
function startEffects(reducedIntensity = false) {
  // Set global reduced effects flag
  window.reducedEffects = reducedIntensity;

  // Remove the paused class to allow animations
  document.body.classList.remove("effects-paused");

  // Add reduced-effects class to body if needed
  if (reducedIntensity) {
    document.body.classList.add("reduced-effects");
  }

  // Create the transition container first to ensure it's available
  // This ensures we use the same transition effect as the main site
  createTransitionContainer();

  // Start visual effects with a slight delay
  setTimeout(() => {
    // Add a logo glow effect (works in both modes but is more subtle in reduced mode)
    addLogoGlow();

    // Only add enhanced effects if not in reduced mode
    if (!reducedIntensity) {
      // Add particle effects
      addParticleEffect();

      // Add gradient movement
      addGradientMovement();
    }

    // Always set up transitions
    setupManualTransition();
  }, 1000);
}
