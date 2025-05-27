// Background image fix script with mobile optimizations
document.addEventListener("DOMContentLoaded", () => {
	console.log("Background fix script loaded");

	// Helper function to check if we're on mobile
	const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

	// Helper function to check if we're on Firefox
	const isFirefox = () =>
		navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

	// Check if we're on a page that needs the background
	if (document.location.pathname.includes("/Pages/")) {
		console.log("On a page in the Pages directory");

		// Check if a background container already exists
		let bgContainer = document.querySelector(".background-container");

		// If it doesn't exist, create it
		if (!bgContainer) {
			console.log("Creating background container");
			bgContainer = document.createElement("div");
			bgContainer.classList.add("background-container");
			bgContainer.setAttribute("aria-hidden", "true"); // Hide from screen readers

			// Ensure the background container doesn't interfere with other elements
			bgContainer.style.zIndex = "-1"; // Keep it behind other content

			// Insert the background container as the first child of the body
			document.body.insertBefore(bgContainer, document.body.firstChild);

			// Create the background image element
			const bgElement = document.createElement("div");
			bgElement.classList.add("bg-image", "active-bg");

			// Set the background image
			bgElement.style.backgroundImage = "url('../Images/Base-Image.png')";
			bgElement.style.backgroundSize = "cover";
			bgElement.style.position = "fixed"; // Ensure it stays fixed

			// Apply different background positioning for mobile vs desktop
			if (isMobile()) {
				// Mobile-optimized background positioning
				bgElement.style.backgroundPosition = "center top";
				// Ensure the background covers the entire screen on mobile
				bgElement.style.width = "140%";
				bgElement.style.height = "140%";
				bgElement.style.top = "-20%";
				bgElement.style.left = "-20%";
			} else {
				// Desktop background positioning
				bgElement.style.backgroundPosition = "center center";
				bgElement.style.width = "120%";
				bgElement.style.height = "120%";
				bgElement.style.top = "-10%";
				bgElement.style.left = "-10%";
			}

			bgElement.style.opacity = "0";
			bgElement.style.zIndex = "-1"; // Keep it behind other content

			// Add the background image to the container
			bgContainer.appendChild(bgElement);

			// Make the background visible after a short delay
			setTimeout(() => {
				bgElement.style.opacity = "1";
			}, 50);

			// Handle orientation changes for mobile devices
			window.addEventListener("orientationchange", () => {
				// Short delay to allow orientation change to complete
				setTimeout(() => {
					if (isMobile()) {
						// Re-apply mobile optimizations after orientation change
						bgElement.style.backgroundPosition = "center top";
						bgElement.style.width = "140%";
						bgElement.style.height = "140%";
						bgElement.style.top = "-20%";
						bgElement.style.left = "-20%";
					} else {
						// Reset to desktop styles
						bgElement.style.backgroundPosition = "center center";
						bgElement.style.width = "120%";
						bgElement.style.height = "120%";
						bgElement.style.top = "-10%";
						bgElement.style.left = "-10%";
					}
				}, 300);
			});

			// Also listen for resize events to handle browser window resizing
			window.addEventListener("resize", () => {
				// Use debounce technique to avoid excessive function calls
				clearTimeout(window.resizeTimer);
				window.resizeTimer = setTimeout(() => {
					if (isMobile()) {
						// Apply mobile optimizations
						bgElement.style.backgroundPosition = "center top";
						bgElement.style.width = "140%";
						bgElement.style.height = "140%";
						bgElement.style.top = "-20%";
						bgElement.style.left = "-20%";
					} else {
						// Reset to desktop styles
						bgElement.style.backgroundPosition = "center center";
						bgElement.style.width = "120%";
						bgElement.style.height = "120%";
						bgElement.style.top = "-10%";
						bgElement.style.left = "-10%";
					}
				}, 250);
			});
		} else {
			console.log("Background container already exists");
		}
	}

	// Ensure mobile menu is working properly
	if (isMobile()) {
		// Check for mobile menu elements
		const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
		const navLinks = document.querySelector(".nav-links");

		if (mobileMenuBtn && navLinks) {
			// Ensure the mobile menu button is visible and properly styled
			mobileMenuBtn.style.display = "flex";
			mobileMenuBtn.classList.add("mobile-menu--fixed"); // declare once in CSS

			// Make sure the nav links have proper z-index
			navLinks.style.zIndex = "9999"; // Very high z-index

			// Firefox-specific fixes
			if (isFirefox()) {
				mobileMenuBtn.style.zIndex = "100000"; // Even higher z-index for Firefox
				navLinks.style.zIndex = "99999"; // Even higher z-index for Firefox

				// Force hardware acceleration
				mobileMenuBtn.style.transform = "translateZ(0)";
				navLinks.style.transform = "translateZ(0)";

				// Make elements more visible
				mobileMenuBtn.style.backgroundColor = "rgba(26, 39, 179, 0.9)";
				navLinks.style.backgroundColor = "rgba(26, 26, 36, 0.98)";
			}

			// Ensure any background elements are behind the menu
			const bgElements = document.querySelectorAll(
				".background-container, .bg-image, .active-bg",
			);
			bgElements.forEach((el) => {
				el.style.zIndex = "-1"; // Keep backgrounds behind content
			});
		}
	}
});
