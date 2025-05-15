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

// Create a transition container for page transitions
function createTransitionContainer() {
    // Create the transition elements if they don't exist
    if (!document.querySelector(".page-transition")) {
        // Create the main container
        const transitionContainer = document.createElement("div");
        transitionContainer.className = "page-transition splash-transition";

        // Create overlay with gradient
        const overlay = document.createElement("div");
        overlay.className = "transition-overlay";
        transitionContainer.appendChild(overlay);

        // Create glitch text container
        const glitchTextContainer = document.createElement("div");
        glitchTextContainer.className = "glitch-text-container";
        transitionContainer.appendChild(glitchTextContainer);

        // Create glitch text
        const glitchText = document.createElement("div");
        glitchText.className = "glitch-text";
        glitchText.textContent = "LOADING";
        glitchText.setAttribute("data-text", "LOADING");
        glitchTextContainer.appendChild(glitchText);

        // Create loading text
        const loadingText = document.createElement("div");
        loadingText.className = "loading-text";
        loadingText.textContent = "LOADING";
        transitionContainer.appendChild(loadingText);

        // Create a loading spinner
        const spinner = document.createElement("div");
        spinner.className = "loading-spinner";
        transitionContainer.appendChild(spinner);

        // Create scanlines
        const scanlines = document.createElement("div");
        scanlines.className = "glitch-scanlines";
        transitionContainer.appendChild(scanlines);

        // Add to document
        document.body.appendChild(transitionContainer);
    }
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

    // Generate random loading text
    const glitchTexts = [
        "LOADING",
        "PLEASE WAIT",
        "REDIRECTING",
        "NAVIGATING",
        "PROCESSING",
        "CONNECTING",
        "PREPARING",
        "LOADING PAGE",
        "ALMOST THERE",
        "ONE MOMENT",
    ];
    const randomText = glitchTexts[Math.floor(Math.random() * glitchTexts.length)];

    // Update loading text
    const loadingTextElement = document.querySelector(".loading-text");
    if (loadingTextElement) {
        loadingTextElement.textContent = randomText;
    }

    // Update glitch text
    const glitchTextElement = document.querySelector(".glitch-text");
    if (glitchTextElement) {
        glitchTextElement.textContent = randomText;
        glitchTextElement.setAttribute("data-text", randomText);
    }

    // Prevent scrolling
    document.body.style.overflow = "hidden";

    // Apply filters with transition to darken and blur the background
    document.body.style.transition = "filter 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)";
    document.body.style.filter = "brightness(0.8)";

    // Apply blur to background elements only, not text
    const backgroundElements = document.querySelectorAll('.splash-container, .splash-background, .vignette');
    backgroundElements.forEach(element => {
        if (element && element.style) {
            element.style.transition = "filter 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)";
            element.style.filter = "blur(5px)";
        }
    });

    // Set transition time based on device and reduced effects
    const reduced = window.reducedEffects === true;
    const transitionTime = reduced ? 1200 : 1800; // Slightly longer for smoother experience

    // Short delay before showing transition to allow other effects to start fading
    setTimeout(() => {
        // Show transition using the active class (which handles visibility and opacity via CSS)
        transition.classList.add("active");

        // After transition is fully visible, stop remaining animations
        setTimeout(() => {
            stopAllSplashEffects();
        }, 300); // Match this with the CSS transition time
    }, 50);

    // Redirect after transition completed
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
