// Background image fix script with mobile optimizations
document.addEventListener("DOMContentLoaded", () => {
	console.log("Background fix script loaded");

	// Helper function to check if we're on mobile
	const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

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

			// Insert the background container as the first child of the body
			document.body.insertBefore(bgContainer, document.body.firstChild);

			// Create the background image element
			const bgElement = document.createElement("div");
			bgElement.classList.add("bg-image", "active-bg");

			// Set the background image
			bgElement.style.backgroundImage = "url('../Images/Base-Image.png')";
			bgElement.style.backgroundSize = "cover";

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
			}

			bgElement.style.opacity = "0";

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
});
