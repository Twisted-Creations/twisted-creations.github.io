// Enhanced glitch effects for the splash page - optimized for all devices
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded");

  // Only run on splash page
  if (window.location.pathname.includes("Pages/")) {
    console.log("Not on splash page, skipping effects");
    return;
  }

  console.log("On splash page, initializing effects");

  // Create transition container if it doesn't exist
  createTransitionContainer();

  // Get the user's effects preference
  const reducedEffects = localStorage.getItem("reducedEffects") === "true";
  console.log("Using reduced effects:", reducedEffects);

  // Start effects based on user preference
  startEffects(reducedEffects);

  // Start the redirect timer
  resumeRedirect();

  // Add event listener to clean up animations when page is about to unload
  window.addEventListener("beforeunload", function () {
    // Stop all animations and effects before page unload
    if (typeof stopAllSplashEffects === "function") {
      stopAllSplashEffects();
    } else {
      // Fallback if the function isn't available yet
      const animationElements = document.querySelectorAll(
        ".glitch-effect, .tracking-lines, .flicker-overlay"
      );
      animationElements.forEach((element) => {
        if (element && element.parentNode) {
          element.style.opacity = "0";
        }
      });

      // Clear any intervals
      if (window.glitchInterval) {
        clearInterval(window.glitchInterval);
        window.glitchInterval = null;
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
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    (window.matchMedia && window.matchMedia("(max-width: 768px)").matches)
  );
}

// Add more intense glitch effects to the splash page - optimized for mobile
function randomGlitch() {
  const logo = document.querySelector(".splash-logo h1");
  if (!logo) return; // Safety check

  const mobile = isMobileDevice();
  const reduced = window.reducedEffects === true;

  // Adjust timing based on device and reduced effects setting
  const glitchDuration = Math.random() * 100 + 50;
  const glitchDelay = reduced
    ? Math.random() * 4000 + 2000 // Less frequent for reduced effects
    : mobile
    ? Math.random() * 1500 + 500
    : Math.random() * 3000 + 1000;

  // Random glitch effects - more intense on mobile
  const glitchEffects = [
    // Effect 1: Color shift - works well on mobile
    () => {
      logo.style.textShadow = "2px 0 #ff00ea, -2px 0 #00eaff";
      logo.style.transform = "skew(1deg)";
    },
    // Effect 2: Shake - reduced intensity for mobile
    () => {
      const intensity = mobile ? 3 : 6;
      const shakeX = Math.random() * intensity - intensity / 2;
      const shakeY = Math.random() * intensity - intensity / 2;
      logo.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
    },
    // Effect 3: Split - more visible on mobile
    () => {
      logo.style.textShadow = mobile
        ? "-2px 0 #ff00ea, 2px 0 #00eaff"
        : "-3px 0 #ff00ea, 3px 0 #00eaff";
      logo.style.letterSpacing = mobile ? "2px" : "3px";
    },
    // Effect 4: Flash - good for mobile
    () => {
      logo.style.filter = "brightness(1.5) contrast(1.2)";
      logo.style.textShadow = "0 0 8px #fff";
    },
  ];

  // Choose a random effect - bias toward more mobile-friendly effects on small screens
  // and milder effects when reduced effects is enabled
  let effectIndex = Math.floor(Math.random() * glitchEffects.length);

  if (reduced) {
    // For reduced effects, only use the mildest effects (0 and 3)
    // and make them even less frequent
    if (Math.random() > 0.3) {
      effectIndex = Math.random() > 0.5 ? 0 : 3;
    }
  } else if (mobile && Math.random() > 0.5) {
    // On mobile, prefer effects 0 and 3 which work better on small screens
    effectIndex = Math.random() > 0.5 ? 0 : 3;
  }

  const randomEffect = glitchEffects[effectIndex];

  // Store the timeout so we can clear it if needed
  window.glitchTimeout = setTimeout(() => {
    // Apply random effect
    randomEffect();

    // Add scanlines occasionally - more visible on mobile
    const glitchEffect = document.querySelector(".glitch-effect");
    if (glitchEffect && Math.random() > (mobile ? 0.5 : 0.7)) {
      glitchEffect.style.opacity = mobile ? "0.7" : "0.6";
    }

    // Store the reset timeout so we can clear it if needed
    window.glitchResetTimeout = setTimeout(() => {
      // Reset to normal
      logo.style.textShadow = "0 0 15px rgba(26, 39, 179, 0.7)";
      logo.style.transform = "skew(0)";
      logo.style.letterSpacing = "2px";
      logo.style.filter = "none";
      if (glitchEffect) {
        glitchEffect.style.opacity = "0.3";
      }

      // Only continue with random glitches if not paused
      if (!document.body.classList.contains("effects-paused")) {
        randomGlitch();
      }
    }, glitchDuration);
  }, glitchDelay);
}

// Add VHS tracking lines effect
function addTrackingLines() {
  const container = document.querySelector(".splash-container");
  if (!container) return; // Safety check

  // Check if tracking lines already exist
  if (document.querySelector(".tracking-lines")) return;

  const trackingLines = document.createElement("div");
  trackingLines.className = "tracking-lines";
  trackingLines.style.position = "absolute";
  trackingLines.style.top = "0";
  trackingLines.style.left = "0";
  trackingLines.style.width = "100%";
  trackingLines.style.height = "100%";
  trackingLines.style.background =
    "linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 51%, transparent 100%)";
  trackingLines.style.backgroundSize = "100% 8px";
  trackingLines.style.animation = "trackingLines 10s linear infinite";
  trackingLines.style.zIndex = "3";
  trackingLines.style.opacity = "0.2";
  trackingLines.style.pointerEvents = "none";
  container.appendChild(trackingLines);

  // Add keyframes for tracking lines if they don't exist
  if (!document.getElementById("tracking-lines-keyframes")) {
    const style = document.createElement("style");
    style.id = "tracking-lines-keyframes";
    style.textContent = `
      @keyframes trackingLines {
        0% { background-position: 0 0; }
        100% { background-position: 0 100%; }
      }
    `;
    document.head.appendChild(style);
  }
}

// Random screen flicker effect
function addScreenFlicker() {
  const container = document.querySelector(".splash-container");
  if (!container) return; // Safety check

  // Check if flicker overlay already exists
  if (document.querySelector(".flicker-overlay")) return;

  const flickerOverlay = document.createElement("div");
  flickerOverlay.className = "flicker-overlay";
  flickerOverlay.style.position = "absolute";
  flickerOverlay.style.top = "0";
  flickerOverlay.style.left = "0";
  flickerOverlay.style.width = "100%";
  flickerOverlay.style.height = "100%";
  flickerOverlay.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
  flickerOverlay.style.zIndex = "4";
  flickerOverlay.style.pointerEvents = "none";
  flickerOverlay.style.opacity = "0";
  container.appendChild(flickerOverlay);

  // Random flicker function - adjusted based on device and reduced effects setting
  function flicker() {
    // Don't flicker if effects are paused
    if (document.body.classList.contains("effects-paused")) {
      return;
    }

    const mobile = isMobileDevice();
    const reduced = window.reducedEffects === true;

    // Determine flicker probability and intensity based on settings
    const flickerProbability = reduced
      ? 0.95 // Very rare flickers in reduced mode
      : mobile
      ? 0.8
      : 0.9;

    const flickerIntensity = reduced
      ? 0.1 // Very subtle flickers in reduced mode
      : mobile
      ? 0.3
      : 0.2;

    const flickerDelay = reduced
      ? 2000 // Longer delays between flickers in reduced mode
      : mobile
      ? 800
      : 1000;

    if (Math.random() > flickerProbability) {
      flickerOverlay.style.opacity = Math.random() * flickerIntensity;
      setTimeout(() => {
        flickerOverlay.style.opacity = "0";
      }, Math.random() * 100);
    }

    // Store the timeout so we can clear it if needed
    window.flickerTimeout = setTimeout(flicker, Math.random() * flickerDelay);
  }

  // Only start flickering if effects are not paused
  if (!document.body.classList.contains("effects-paused")) {
    flicker();
  }
}

// Create transition container for page transitions
function createTransitionContainer() {
  // Create the transition elements if they don't exist
  if (!document.querySelector(".page-transition")) {
    // Create main container
    const transitionContainer = document.createElement("div");
    transitionContainer.className = "page-transition";

    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "glitch-overlay";
    transitionContainer.appendChild(overlay);

    // Create scanlines
    const scanlines = document.createElement("div");
    scanlines.className = "glitch-scanlines";
    transitionContainer.appendChild(scanlines);

    // Create RGB shift layer
    const rgbLayer = document.createElement("div");
    rgbLayer.className = "glitch-rgb";
    transitionContainer.appendChild(rgbLayer);

    // Create horizontal glitch slices
    for (let i = 0; i < 3; i++) {
      const slice = document.createElement("div");
      slice.className = "glitch-slice";
      slice.style.top = i * 33.33 + "%";
      transitionContainer.appendChild(slice);
    }

    // Create glitch text
    const glitchText = document.createElement("div");
    glitchText.className = "glitch-text";
    glitchText.textContent = "LOADING";
    glitchText.setAttribute("data-text", "LOADING");
    transitionContainer.appendChild(glitchText);

    // Add to document
    document.body.appendChild(transitionContainer);
  }
}

// Setup automatic transition that triggers before the meta refresh
function setupAutoTransition() {
  // Get the meta refresh tag
  const metaRefresh = document.querySelector('meta[http-equiv="refresh"]');
  if (!metaRefresh) return;

  // Parse the content to get the delay
  const content = metaRefresh.getAttribute("content");
  const match = content.match(/^(\d+);/);

  if (match && match[1]) {
    const refreshDelay = parseInt(match[1], 10);

    // Extract the URL and ensure it's properly formatted
    let url = content.split(";")[1].trim();

    // Check if the URL starts with "url=" and remove it if present
    if (url.startsWith("url=")) {
      url = url.substring(4);
    }

    // Remove the original meta refresh to prevent it from triggering
    metaRefresh.removeAttribute("content");

    // Trigger transition 2 seconds before the original refresh time
    // and handle the redirect manually
    if (refreshDelay > 2) {
      setTimeout(() => {
        // Trigger the transition with the URL to redirect to
        triggerTransition(url);
      }, (refreshDelay - 2) * 1000);
    } else {
      // If the delay is too short, just trigger immediately
      setTimeout(() => {
        triggerTransition(url);
      }, 500);
    }
  }
}

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

// Function to completely stop all splash page animations and effects
// Made global so it can be called from anywhere
function stopAllSplashEffects() {
  console.log("Stopping all splash effects before transition");

  // 1. Remove all animation elements
  const animationElements = document.querySelectorAll(
    ".glitch-effect, .tracking-lines, .flicker-overlay"
  );
  animationElements.forEach((element) => {
    if (element && element.parentNode) {
      element.style.opacity = "0";
      // Try to completely remove the element if possible
      try {
        element.parentNode.removeChild(element);
      } catch (e) {
        console.log("Could not remove element, setting opacity to 0");
      }
    }
  });

  // 2. Clear any intervals or timeouts
  if (window.glitchInterval) {
    clearInterval(window.glitchInterval);
    window.glitchInterval = null;
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

  // 5. Add style to force stop all animations
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

// Trigger the transition effect
function triggerTransition(href) {
  // Check if transition is already active to prevent overlapping animations
  if (window.transitionActive === true) {
    console.log("Transition already active, skipping duplicate");
    return;
  }

  // Set flag to prevent multiple transitions
  window.transitionActive = true;

  const transition = document.querySelector(".page-transition");
  if (!transition) return;

  // Stop ALL splash page animations and effects
  stopAllSplashEffects();

  // Generate random glitch text
  const glitchTexts = [
    "LOADING",
    "ERROR",
    "BETRAYED",
    "FEAR",
    "DARKNESS",
    "TWISTED",
    "HELP US",
    "ABANDONED",
    "VOID",
    "UNKNOWN",
  ];
  const randomText =
    glitchTexts[Math.floor(Math.random() * glitchTexts.length)];
  const glitchTextElement = document.querySelector(".glitch-text");
  if (glitchTextElement) {
    glitchTextElement.textContent = randomText;
    glitchTextElement.setAttribute("data-text", randomText);
  }

  // Show transition
  transition.style.visibility = "visible";
  transition.style.opacity = "1";
  transition.classList.add("active");

  // Prevent scrolling
  document.body.style.overflow = "hidden";

  // Add glitch effects - reduced if needed
  const reduced = window.reducedEffects === true;

  // Apply milder filter for reduced effects
  document.body.style.filter = reduced
    ? "hue-rotate(45deg) contrast(1.2)"
    : "hue-rotate(90deg) contrast(1.5)";

  // Add random screen shake for desktop (unless reduced effects)
  if (!isMobileDevice() && !reduced) {
    const shakeIntensity = 5; // pixels
    const shakeInterval = setInterval(() => {
      const randomX =
        Math.floor(Math.random() * shakeIntensity) - shakeIntensity / 2;
      const randomY =
        Math.floor(Math.random() * shakeIntensity) - shakeIntensity / 2;
      transition.style.transform = `translate(${randomX}px, ${randomY}px)`;
    }, 50);

    // Clear interval after transition
    setTimeout(() => {
      clearInterval(shakeInterval);
    }, 1000);
  }

  // Set transition time based on device and reduced effects
  const transitionTime = reduced ? 1500 : isMobileDevice() ? 2000 : 2500;

  // Redirect after transition completes
  setTimeout(() => {
    // Redirect to the specified URL
    if (href) {
      // If the URL is relative, make sure it's correct
      if (href && !href.startsWith("http")) {
        // Make sure we're using the correct path
        if (href === "Pages/index.html" || href === "/Pages/index.html") {
          window.location.href = "Pages/index.html";
        } else {
          window.location.href = href;
        }
      } else {
        window.location.href = href;
      }
    }
  }, transitionTime);
}

// Note: The effects warning has been moved to a separate page (effects-preferences.html)

// Pause the automatic redirect
function pauseRedirect() {
  // Store the original meta refresh tag
  const metaRefresh = document.querySelector('meta[http-equiv="refresh"]');
  if (metaRefresh) {
    // Save the original content for later
    window.originalMetaRefresh = metaRefresh.getAttribute("content");
    // Remove the redirect
    metaRefresh.removeAttribute("content");
  }

  // Pause any animations
  document.body.classList.add("effects-paused");

  // Hide the loading bar animation
  const loadingBar = document.querySelector(".loading-bar");
  if (loadingBar) {
    loadingBar.style.animationPlayState = "paused";
    loadingBar.style.width = "0%"; // Reset to beginning
  }

  // Hide the redirect message
  const redirectMessage = document.querySelector(".redirect-message");
  if (redirectMessage) {
    redirectMessage.style.opacity = "0";
  }

  // Stop all animation intervals if they exist
  if (window.glitchInterval) {
    clearInterval(window.glitchInterval);
    window.glitchInterval = null;
  }

  // Clear any pending animation timeouts
  if (window.glitchTimeout) {
    clearTimeout(window.glitchTimeout);
    window.glitchTimeout = null;
  }

  if (window.flickerTimeout) {
    clearTimeout(window.flickerTimeout);
    window.flickerTimeout = null;
  }
}

// Resume the automatic redirect and all animations
function resumeRedirect() {
  console.log("Resuming redirect and animations");

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
  // We already have loadingBar defined above, so we don't need to declare it again

  if (redirectMessage && loadingBar) {
    // Hide the redirect message initially
    redirectMessage.style.opacity = "0";

    // Add an event listener for the end of the loading bar animation
    loadingBar.addEventListener("animationend", () => {
      // Show the redirect message when loading animation completes
      redirectMessage.style.opacity = "1";
    });
  }

  // Start all visual effects
  randomGlitch();
  addScreenFlicker();
}

// Start all effects with optional reduced intensity
function startEffects(reducedIntensity = false) {
  // Set global reduced effects flag
  window.reducedEffects = reducedIntensity;

  // Remove the paused class to allow animations
  document.body.classList.remove("effects-paused");

  // Start visual effects with a slight delay
  setTimeout(() => {
    randomGlitch();
    addTrackingLines();
    addScreenFlicker();

    // Only set up transitions after preferences are selected
    setupManualTransition();
  }, 1000);
}
