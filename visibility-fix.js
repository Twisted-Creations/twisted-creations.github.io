// Visibility fix script - ensures content is always visible and fixes mobile layout issues
(() => {
	// Immediately make content visible
	if (document.body) {
		document.body.classList.add("content-loaded");
		document.body.style.opacity = "1";
	}

	// Helper function to check if we're on mobile
	const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

	// Helper function to check if we're on Firefox
	const isFirefox = () =>
		navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

	// Fix mobile menu styling without duplicating event handlers from script.js
	const fixMobileMenu = () => {
		if (!isMobile()) return;

		// Ensure mobile menu button is properly displayed
		const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
		if (mobileMenuBtn) {
			mobileMenuBtn.style.display = "flex";
			mobileMenuBtn.style.zIndex = "10000"; // Extremely high z-index to ensure it's above everything
			mobileMenuBtn.style.position = "fixed"; // Ensure it's fixed position
			mobileMenuBtn.style.top = "20px"; // Position at the top
			mobileMenuBtn.style.right = "20px"; // Position at the right

			// Firefox-specific fixes
			if (isFirefox()) {
				mobileMenuBtn.style.zIndex = "100000"; // Even higher z-index for Firefox
				mobileMenuBtn.style.transform = "translateZ(0)"; // Force hardware acceleration
				mobileMenuBtn.style.willChange = "transform"; // Hint for browser optimization

				// Make button more visible on Firefox
				mobileMenuBtn.style.backgroundColor = "rgba(26, 39, 179, 0.9)";
				mobileMenuBtn.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.5)";
			}
		}

		// Ensure nav links are properly styled for mobile
		const navLinks = document.querySelector(".nav-links");
		if (navLinks) {
			navLinks.style.zIndex = "999"; // Ensure it's properly layered

			// Make sure the nav links are properly positioned
			navLinks.style.position = "fixed";
			navLinks.style.top = "0";

			// Fix for mobile menu display issue - ensure it's visible when "show" class is present
			if (navLinks.classList.contains("show")) {
				navLinks.style.right = "0";
				navLinks.style.display = "flex";
			} else {
				navLinks.style.right = "-100%";
				// Don't set display: none here to allow transitions to work
			}

			navLinks.style.width = "75%";
			navLinks.style.height = "100vh";

			// Ensure background and other properties are set for visibility
			navLinks.style.backgroundColor = "rgba(26, 26, 36, 0.95)";
			navLinks.style.backdropFilter = "blur(8px)";
			navLinks.style.WebkitBackdropFilter = "blur(8px)";
			navLinks.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.3)";
			navLinks.style.borderLeft = "1px solid rgba(42, 62, 177, 0.3)";
			navLinks.style.transition = "right 0.4s cubic-bezier(0.23, 1, 0.32, 1)";

			// Ensure the menu is always on top of everything
			navLinks.style.zIndex = "9999"; // Very high z-index to ensure it's above everything

			// Firefox-specific fixes
			if (isFirefox()) {
				// Firefox sometimes has issues with fixed positioning and z-index
				navLinks.style.position = "absolute";
				navLinks.style.zIndex = "99999"; // Even higher z-index for Firefox

				// Force hardware acceleration to fix rendering issues in Firefox
				navLinks.style.transform = "translateZ(0)";
				navLinks.style.willChange = "right";

				// Increase opacity to ensure visibility
				navLinks.style.backgroundColor = "rgba(26, 26, 36, 0.98)";
			}
		}
	};

	// Ensure content is visible when DOM is ready
	document.addEventListener("DOMContentLoaded", () => {
		document.body.classList.add("content-loaded");
		document.body.style.opacity = "1";

		// Check if we came from a transition
		if (sessionStorage.getItem("fromTransition") === "true") {
			// Clear the flag
			sessionStorage.removeItem("fromTransition");
			// Double-check visibility
			setTimeout(() => {
				document.body.classList.add("content-loaded");
				document.body.style.opacity = "1";
			}, 100);
		}

		// Fix mobile menu issues
		fixMobileMenu();

		// Add event listener to mobile menu button if it exists
		const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
		const navLinks = document.querySelector(".nav-links");

		if (
			mobileMenuBtn &&
			navLinks &&
			!mobileMenuBtn.hasAttribute("data-visibility-fix-processed")
		) {
			// Mark as processed to avoid duplicate listeners
			mobileMenuBtn.setAttribute("data-visibility-fix-processed", "true");

			// Add click event listener to toggle menu visibility
			mobileMenuBtn.addEventListener("click", () => {
				// Toggle the show class
				navLinks.classList.toggle("show");
				mobileMenuBtn.classList.toggle("active");

				// Apply styles based on current state
				if (navLinks.classList.contains("show")) {
					navLinks.style.right = "0";
					navLinks.style.display = "flex";

					// Firefox-specific fix
					if (isFirefox()) {
						// Force repaint to ensure menu is visible
						void navLinks.offsetWidth;
						navLinks.style.opacity = "1";
						navLinks.style.visibility = "visible";
					}
				} else {
					// When closing, we delay hiding to allow transition
					setTimeout(() => {
						if (!navLinks.classList.contains("show")) {
							navLinks.style.right = "-100%";

							// Firefox-specific fix
							if (isFirefox()) {
								// Delay hiding until transition completes
								setTimeout(() => {
									if (!navLinks.classList.contains("show")) {
										navLinks.style.opacity = "0.98";
									}
								}, 400);
							}
						}
					}, 50);
				}
			});
		}
	});

	// Final fallback to ensure content is always visible
	window.addEventListener("load", () => {
		document.body.classList.add("content-loaded");
		document.body.style.opacity = "1";

		// Additional check for mobile layout on load
		if (isMobile()) {
			// Fix any layout issues that might occur on mobile
			const headerContainer = document.querySelector(".header-container");
			if (headerContainer) {
				headerContainer.style.width = "98%";
			}

			const contentBoxes = document.querySelectorAll(".content-box");
			contentBoxes.forEach((box) => {
				box.style.width = "95%";
				box.style.maxWidth = "100%";
			});

			// Fix mobile menu again after full load
			fixMobileMenu();
		}
	});

	// Handle orientation changes
	window.addEventListener("orientationchange", () => {
		// Short delay to allow orientation change to complete
		setTimeout(() => {
			// Force visibility after orientation change
			document.body.classList.add("content-loaded");
			document.body.style.opacity = "1";

			// Apply mobile fixes if needed
			if (isMobile()) {
				const headerContainer = document.querySelector(".header-container");
				if (headerContainer) {
					headerContainer.style.width = "98%";
				}

				const contentBoxes = document.querySelectorAll(".content-box");
				contentBoxes.forEach((box) => {
					box.style.width = "95%";
					box.style.maxWidth = "100%";
				});

				// Fix mobile menu after orientation change
				fixMobileMenu();
			}
		}, 300);
	});

	// Also handle resize events for when browser window is resized
	window.addEventListener("resize", () => {
		// Use debounce to prevent excessive function calls
		clearTimeout(window.resizeTimer);
		window.resizeTimer = setTimeout(() => {
			fixMobileMenu();
		}, 250);
	});
})();
