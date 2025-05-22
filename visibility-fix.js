// Visibility fix script - ensures content is always visible and fixes mobile layout issues
(() => {
	// Immediately make content visible
	if (document.body) {
		document.body.classList.add("content-loaded");
		document.body.style.opacity = "1";
	}

	// Helper function to check if we're on mobile
	const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

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

		// Fix mobile menu issues if on mobile
		if (isMobile()) {
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
			}
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
			}
		}, 300);
	});
})();
