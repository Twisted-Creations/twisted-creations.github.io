console.log("update-year.js loaded");

// Function to update the year in the footer
function updateFooterYear() {
	console.log("updateFooterYear function called");
	const yearElements = document.querySelectorAll(".current-year");
	console.log("Found year elements:", yearElements.length);
	const currentYear = new Date().getFullYear();
	console.log("Current year:", currentYear);

	yearElements.forEach((element) => {
		element.textContent = currentYear;
		console.log("Updated year element:", element);
	});
}

// Call the function when the DOM is loaded
document.addEventListener("DOMContentLoaded", updateFooterYear);

// Also call the function when the window is fully loaded
window.addEventListener("load", updateFooterYear);

// Call the function immediately in case the DOM is already loaded
if (
	document.readyState === "complete" ||
	document.readyState === "interactive"
) {
	console.log("Document already loaded, calling updateFooterYear immediately");
	setTimeout(updateFooterYear, 1);
}
