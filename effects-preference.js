// Effects preference utility - applies user's preference across all pages
(() => {
	// Check if the reduced effects preference is set
	const reducedEffects = localStorage.getItem("reducedEffects") === "true";

	// Set a global flag that other scripts can check
	window.reducedEffects = reducedEffects;

	// Create a stylesheet for reduced effects instead of inline styles
	function createReducedEffectsStylesheet() {
		// Check if the stylesheet already exists
		if (document.getElementById("reduced-effects-stylesheet")) {
			return;
		}

		const reducedEffectsStyle = document.createElement("style");
		reducedEffectsStyle.id = "reduced-effects-stylesheet";
		reducedEffectsStyle.textContent = `
          /* Reduced effects mode - applied site-wide */
          .reduced-effects .page-transition {
            transition: opacity 0.5s ease !important; /* Smoother transitions */
          }

          /* Disable animations */
          .reduced-effects .tracking-lines,
          .reduced-effects .flicker-overlay,
          .reduced-effects .glitch-effect {
            display: none !important;
          }

          /* Disable animation effects */
          .reduced-effects .splash-background {
            animation: none !important;
            filter: blur(2px) brightness(0.5) !important;
          }

          /* Reduce animation intensities */
          .reduced-effects img {
            transition: transform 0.3s ease !important;
          }

          /* Reduce hover effects */
          .reduced-effects .content-box:hover {
            transform: translateY(-3px) !important;
          }

          /* Simplify loading bar */
          .reduced-effects .loading-bar {
            animation-duration: 9s !important;
            animation-timing-function: linear !important;
          }
        `;
		document.head.appendChild(reducedEffectsStyle);
	}

	// Function to apply reduced effects
	function applyReducedEffects() {
		if (document.body && reducedEffects) {
			document.body.classList.add("reduced-effects");
			createReducedEffectsStylesheet();
		}
	}

	// Create the toggle button with CSS classes instead of inline styles
	function createToggleButton() {
		// Check if the toggle already exists (to prevent duplicates)
		if (document.querySelector(".effects-toggle")) {
			return;
		}

		// Create a stylesheet for the toggle button if it doesn't exist
		if (!document.getElementById("effects-toggle-styles")) {
			const toggleStyles = document.createElement("style");
			toggleStyles.id = "effects-toggle-styles";
			toggleStyles.textContent = `
                .effects-toggle {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 10000;
                    padding: 12px 18px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: bold;
                    color: #fff;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    opacity: 0.95;
                    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.6);
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
                    user-select: none;
                }
                
                .effects-toggle.reduced {
                    background-color: rgba(60, 60, 70, 0.9);
                    border: 1px solid rgba(100, 100, 120, 0.5);
                }
                
                .effects-toggle.full {
                    background-color: rgba(26, 39, 179, 0.9);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                
                .effects-toggle:hover {
                    opacity: 1;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.6);
                }
                
                .effects-toggle.reduced:hover {
                    background-color: rgba(80, 80, 90, 0.95);
                    border: 1px solid rgba(120, 120, 140, 0.6);
                }
                
                .effects-toggle.full:hover {
                    background-color: rgba(26, 39, 179, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                }
                
                .effects-toggle.applying {
                    background-color: rgba(108, 19, 163, 0.9);
                    border: 1px solid rgba(150, 100, 200, 0.5);
                }
                
                @media screen and (prefers-reduced-motion: reduce) {
                    .effects-toggle {
                        transition: none;
                    }
                }
            `;
			document.head.appendChild(toggleStyles);
		}

		// Add a toggle button in the corner for users to change their preference
		const toggleContainer = document.createElement("div");
		toggleContainer.className = `effects-toggle ${
			reducedEffects ? "reduced" : "full"
		}`;

		// Add an icon to make it more visible
		const currentMode = reducedEffects ? "🔅" : "✨";
		toggleContainer.textContent = reducedEffects
			? `${currentMode} Switch to Full Effects`
			: `${currentMode} Switch to Reduced Effects`;

		// Toggle effects when clicked
		toggleContainer.addEventListener("click", () => {
			const currentSetting = localStorage.getItem("reducedEffects") === "true";
			const newSetting = !currentSetting;

			// Save new preference
			localStorage.setItem("reducedEffects", newSetting.toString());
			localStorage.setItem("effectsPreferenceUpdated", Date.now().toString());

			// Show feedback before reload
			toggleContainer.className = "effects-toggle applying";

			// Update text with the appropriate icon
			const newMode = newSetting ? "🔅" : "✨";
			toggleContainer.textContent = `${newMode} Applying changes...`;

			// Clear service worker cache if available
			if ("serviceWorker" in navigator && "caches" in window) {
				caches
					.keys()
					.then((cacheNames) => {
						return Promise.all(
							cacheNames
								.filter((cacheName) => cacheName.includes("twisted-creations"))
								.map((cacheName) => caches.delete(cacheName)),
						);
					})
					.catch((error) => {
						console.log("Cache clearing failed:", error);
					});
			}

			// Reload the page to apply changes after a short delay
			setTimeout(() => {
				window.location.reload(true); // Force reload from server
			}, 500);
		});

		// Add to document
		document.body.appendChild(toggleContainer);
	}

	// Function to initialize everything when DOM is ready
	function init() {
		if (document.body) {
			// Apply reduced effects immediately if needed
			applyReducedEffects();

			// Create a toggle button with a delay to ensure other elements are loaded
			setTimeout(createToggleButton, 1000);

			// Add a backup check in case the first attempt fails
			setTimeout(() => {
				if (!document.querySelector(".effects-toggle")) {
					createToggleButton();
				}
			}, 3000);
		} else {
			// If the body isn't ready yet, try again in a moment
			setTimeout(init, 100);
		}
	}

	// Initialize based on document readiness
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		// Document already loaded, run init directly
		init();
	}

	// Add a fallback initialization for any edge cases
	window.addEventListener("load", () => {
		if (!document.querySelector(".effects-toggle")) {
			createToggleButton();
		}
	});
})();
