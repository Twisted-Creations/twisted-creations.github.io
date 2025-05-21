// Background image fix script
document.addEventListener("DOMContentLoaded", () => {
	console.log("Background fix script loaded");

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
			bgElement.style.backgroundPosition = "center center";
			bgElement.style.opacity = "0";

			// Add the background image to the container
			bgContainer.appendChild(bgElement);

			// Make the background visible after a short delay
			setTimeout(() => {
				bgElement.style.opacity = "1";
			}, 50);
		} else {
			console.log("Background container already exists");
		}
	}
});
