// Enhanced glitch effects for the splash page - optimized for all devices
document.addEventListener("DOMContentLoaded", function () {
    // Only run on splash page
    if (window.location.pathname.includes("Pages/")) return;

    // Create transition container if it doesn't exist
    createTransitionContainer();

    // Immediately pause any automatic redirect until user selects preferences
    pauseRedirect();

    // Show warning first, then start effects after user acknowledgment
    showEffectsWarning();

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

    setTimeout(() => {
        // Apply random effect
        randomEffect();

        // Add scanlines occasionally - more visible on mobile
        const glitchEffect = document.querySelector(".glitch-effect");
        if (glitchEffect && Math.random() > (mobile ? 0.5 : 0.7)) {
            glitchEffect.style.opacity = mobile ? "0.7" : "0.6";
        }

        setTimeout(() => {
            // Reset to normal
            logo.style.textShadow = "0 0 15px rgba(26, 39, 179, 0.7)";
            logo.style.transform = "skew(0)";
            logo.style.letterSpacing = "2px";
            logo.style.filter = "none";
            if (glitchEffect) {
                glitchEffect.style.opacity = "0.3";
            }

            // Continue with random glitches
            randomGlitch();
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

        setTimeout(flicker, Math.random() * flickerDelay);
    }

    flicker();
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
        }, 700);
    }

    // Navigate after a longer delay to ensure transition completes
    if (href) {
        // Use a longer transition time to ensure effects complete
        const transitionTime = reduced ? 1500 : 2000;

        // Show a message that we're about to redirect
        setTimeout(() => {
            if (glitchTextElement) {
                glitchTextElement.textContent = "REDIRECTING";
                glitchTextElement.setAttribute("data-text", "REDIRECTING");
            }
        }, transitionTime - 800);

        // Navigate after the full transition completes
        setTimeout(() => {
            // Reset transition flag right before redirecting
            window.transitionActive = false;

            // Ensure the URL is correct before redirecting
            console.log("Redirecting to:", href);

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
        }, transitionTime);
    }
}

// Show warning about intense visual effects
function showEffectsWarning() {
    // Check if user has already acknowledged the warning
    const warningAcknowledged = localStorage.getItem(
        "effectsWarningAcknowledged"
    );

    // If already acknowledged, start effects immediately
    if (warningAcknowledged === "true") {
        startEffects();
        resumeRedirect();
        return;
    }

    // Create warning overlay
    const warningOverlay = document.createElement("div");
    warningOverlay.className = "effects-warning-overlay";
    warningOverlay.style.position = "fixed";
    warningOverlay.style.top = "0";
    warningOverlay.style.left = "0";
    warningOverlay.style.width = "100%";
    warningOverlay.style.height = "100%";
    warningOverlay.style.display = "flex";
    warningOverlay.style.flexDirection = "column";
    warningOverlay.style.alignItems = "center";
    warningOverlay.style.justifyContent = "center";
    warningOverlay.style.padding = "20px";
    warningOverlay.style.textAlign = "center";
    warningOverlay.style.backgroundColor = "rgba(10, 10, 15, 0.95)";
    warningOverlay.style.zIndex = "9999";

    // Add scanlines to the warning overlay
    const scanlines = document.createElement("div");
    scanlines.style.position = "absolute";
    scanlines.style.top = "0";
    scanlines.style.left = "0";
    scanlines.style.width = "100%";
    scanlines.style.height = "100%";
    scanlines.style.backgroundImage =
        "linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.05) 50%, transparent 50%)";
    scanlines.style.backgroundSize = "100% 2px";
    scanlines.style.pointerEvents = "none";
    scanlines.style.zIndex = "1";
    warningOverlay.appendChild(scanlines);

    // Create warning content
    const warningContent = document.createElement("div");
    warningContent.className = "warning-content";
    warningContent.style.position = "relative";
    warningContent.style.zIndex = "2";

    // Style the warning content
    warningContent.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    warningContent.style.padding = "30px";
    warningContent.style.borderRadius = "8px";
    warningContent.style.maxWidth = "600px";
    warningContent.style.border = "1px solid rgba(255, 255, 255, 0.1)";
    warningContent.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)";

    // Warning title with glitch effect
    const warningTitle = document.createElement("h2");
    warningTitle.className = "warning-title";
    warningTitle.innerHTML =
        "WARNING: <span style='color:#ff3333;'>INTENSE</span> VISUAL EFFECTS";
    warningTitle.style.fontSize = "28px";
    warningTitle.style.marginBottom = "20px";
    warningTitle.style.letterSpacing = "1px";
    warningContent.appendChild(warningTitle);

    // Add a subtle glitch animation to the title
    const glitchAnimation = document.createElement("style");
    glitchAnimation.textContent = `
    @keyframes textGlitch {
      0% { text-shadow: 1px 0 0 red, -1px 0 0 blue; }
      1% { text-shadow: 1px 0 0 red, -1px 0 0 blue; }
      2% { text-shadow: 2px 0 0 red, -1px 0 0 blue; }
      3% { text-shadow: -1px 0 0 red, 1px 0 0 blue; }
      4% { text-shadow: -1px 0 0 red, 1px 0 0 blue; }
      5% { text-shadow: 0.5px 0 0 red, -0.5px 0 0 blue; }
      6% { text-shadow: -1px 0 0 red, 1px 0 0 blue; }
      7% { text-shadow: 1px 0 0 red, -1px 0 0 blue; }
      8% { text-shadow: 1px 0 0 red, -1px 0 0 blue; }
      9% { text-shadow: 1px 0 0 red, -1px 0 0 blue; }
      10% { text-shadow: 1px 0 0 red, -1px 0 0 blue; }
      11% { text-shadow: 0.5px 0 0 red, -0.5px 0 0 blue; }
      12% { text-shadow: 0.5px 0 0 red, -0.5px 0 0 blue; }
      20% { text-shadow: 0.5px 0 0 red, -0.5px 0 0 blue; }
      40% { text-shadow: 0.5px 0 0 red, -0.5px 0 0 blue; }
      60% { text-shadow: 0.5px 0 0 red, -0.5px 0 0 blue; }
      70% { text-shadow: 0.5px 0 0 red, -0.5px 0 0 blue; }
      80% { text-shadow: 0.5px 0 0 red, -0.5px 0 0 blue; }
      90% { text-shadow: 1px 0 0 red, -1px 0 0 blue; }
      100% { text-shadow: 1px 0 0 red, -1px 0 0 blue; }
    }
    .warning-title {
      animation: textGlitch 3s infinite linear alternate-reverse;
    }
  `;
    document.head.appendChild(glitchAnimation);

    // Warning text
    const warningText = document.createElement("p");
    warningText.className = "warning-text";
    warningText.innerHTML =
        "This site contains <span style='color:#ff3333;'>flashing lights</span>, <span style='color:#ff3333;'>screen shake effects</span>, and <span style='color:#ff3333;'>rapid color changes</span> that may potentially trigger seizures for people with photosensitive epilepsy.<br><br>These effects are part of the horror experience but can be adjusted to your comfort level.<br><br><span style='color:#aaaaaa;font-style:italic;'>Viewer discretion is advised.</span>";
    warningText.style.fontSize = "16px";
    warningText.style.lineHeight = "1.6";
    warningText.style.marginBottom = "20px";
    warningContent.appendChild(warningText);

    // Buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "warning-buttons";

    // Style the buttons container
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.gap = "20px";
    buttonsContainer.style.marginTop = "30px";

    // Continue button
    const continueButton = document.createElement("button");
    continueButton.className = "continue-button";
    continueButton.textContent = "ENTER THE NIGHTMARE";

    // Style the continue button
    continueButton.style.padding = "12px 24px";
    continueButton.style.backgroundColor = "rgba(26, 39, 179, 0.8)";
    continueButton.style.color = "#ffffff";
    continueButton.style.border = "1px solid rgba(108, 19, 163, 0.7)";
    continueButton.style.borderRadius = "4px";
    continueButton.style.fontSize = "16px";
    continueButton.style.fontWeight = "bold";
    continueButton.style.cursor = "pointer";
    continueButton.style.transition = "all 0.3s ease";

    // Add a subtle hover effect
    continueButton.onmouseover = function () {
        this.style.transform = "translateY(-2px)";
        this.style.boxShadow =
            "0 0 15px rgba(108, 19, 163, 0.7), 0 0 30px rgba(26, 39, 179, 0.5)";
        this.style.backgroundColor = "rgba(26, 39, 179, 1)";
    };
    continueButton.onmouseout = function () {
        this.style.transform = "";
        this.style.boxShadow = "";
        this.style.backgroundColor = "rgba(26, 39, 179, 0.8)";
    };

    // Reduced effects button
    const reducedButton = document.createElement("button");
    reducedButton.className = "reduced-button";
    reducedButton.textContent = "REDUCED EFFECTS";

    // Style the reduced effects button
    reducedButton.style.padding = "12px 24px";
    reducedButton.style.backgroundColor = "rgba(60, 60, 70, 0.8)";
    reducedButton.style.color = "#ffffff";
    reducedButton.style.border = "1px solid rgba(255, 255, 255, 0.2)";
    reducedButton.style.borderRadius = "4px";
    reducedButton.style.fontSize = "16px";
    reducedButton.style.fontWeight = "bold";
    reducedButton.style.cursor = "pointer";
    reducedButton.style.transition = "all 0.3s ease";

    // Add a subtle hover effect
    reducedButton.onmouseover = function () {
        this.style.transform = "translateY(-2px)";
        this.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.2)";
        this.style.backgroundColor = "rgba(80, 80, 90, 0.9)";
    };
    reducedButton.onmouseout = function () {
        this.style.transform = "";
        this.style.boxShadow = "";
        this.style.backgroundColor = "rgba(60, 60, 70, 0.8)";
    };

    // Add event listeners
    continueButton.addEventListener("click", function () {
        // Save preference
        localStorage.setItem("effectsWarningAcknowledged", "true");
        localStorage.setItem("reducedEffects", "false");

        // Remove warning
        document.body.removeChild(warningOverlay);

        // Start effects
        startEffects();

        // Resume the redirect
        resumeRedirect();
    });

    reducedButton.addEventListener("click", function () {
        // Save preference
        localStorage.setItem("effectsWarningAcknowledged", "true");
        localStorage.setItem("reducedEffects", "true");

        // Remove warning
        document.body.removeChild(warningOverlay);

        // Start effects with reduced intensity
        startEffects(true);

        // Resume the redirect
        resumeRedirect();
    });

    // Add buttons to container
    buttonsContainer.appendChild(reducedButton);
    buttonsContainer.appendChild(continueButton);
    warningContent.appendChild(buttonsContainer);

    // Add content to overlay
    warningOverlay.appendChild(warningContent);

    // Add to body
    document.body.appendChild(warningOverlay);

    // Pause any animations or effects until user makes a choice
    document.body.classList.add("effects-paused");
}

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
}

// Resume the automatic redirect
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

    // Make the redirect message visible
    const redirectMessage = document.querySelector(".redirect-message");
    if (redirectMessage) {
        redirectMessage.style.opacity = "0";
        setTimeout(() => {
            redirectMessage.style.opacity = "1";
        }, 6000); // Show message after 6 seconds (matches CSS animation timing)
    }

    // Set up a manual redirect with our transition effect
    if (window.originalMetaRefresh) {
        // Extract the URL and ensure it's properly formatted
        let url = window.originalMetaRefresh.split(";")[1].trim();

        // Check if the URL starts with "url=" and remove it if present
        if (url.startsWith("url=")) {
            url = url.substring(4);
        }

        // Ensure we're using the correct path
        if (url === "Pages/index.html") {
            console.log("Redirecting to main page");
        }

        // We won't set an automatic redirect timer here
        // Instead, we'll rely on the user clicking the "Enter Now" button
        // or the manual transition setup in setupManualTransition()
    }
}

// Start all effects with optional reduced intensity
function startEffects(reducedIntensity = false) {
    // Set global reduced effects flag
    window.reducedEffects = reducedIntensity;

    // Remove the paused class
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
