// Visibility fix script - ensures content is always visible
(() => {
	// Immediately make content visible
	if (document.body) {
		document.body.classList.add("content-loaded");
		document.body.style.opacity = "1";
	}

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
	});

	// Final fallback to ensure content is always visible
	window.addEventListener("load", () => {
		document.body.classList.add("content-loaded");
		document.body.style.opacity = "1";
	});
})();
