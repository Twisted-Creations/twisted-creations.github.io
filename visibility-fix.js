// Visibility fix script - ensures content is always visible and fixes mobile layout issues
(() => {
	// Immediately make content visible
	if (document.body) {
		document.body.classList.add("content-loaded");
		document.body.style.opacity = "1";
	}

	// Helper function to check if we're on mobile
	const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

	// Fix mobile menu styling without duplicating event handlers from script.js
	const fixMobileMenu = () => {
		if (!isMobile()) return;

		// Ensure mobile menu button is properly displayed
		const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
		if (mobileMenuBtn) {
			mobileMenuBtn.style.display = "flex";
			mobileMenuBtn.style.zIndex = "1000"; // Ensure it's above other elements
		}

		// Ensure nav links are properly styled for mobile
		const navLinks = document.querySelector(".nav-links");
		if (navLinks) {
			navLinks.style.zIndex = "999"; // Ensure it's properly layered

			// Make sure the nav links are properly positioned
			navLinks.style.position = "fixed";
			navLinks.style.top = "0";
			navLinks.style.right = navLinks.classList.contains("show")
				? "0"
				: "-100%";
			navLinks.style.width = "75%";
			navLinks.style.height = "100vh";

			// Update display property based on current state
			if (navLinks.classList.contains("show")) {
				navLinks.style.display = "flex";
			}

			// We don't add event listeners or replace the button here
			// as they're handled in script.js's initMobileMenu function
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
