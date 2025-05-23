// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", () => {
	// Initialize page transitions first to ensure it's available
	initPageTransitions();

	// Initialize all other functions
	initMobileMenu();
	initBackToTop();
	initImageLightbox();

	// Special handling for the devlog page
	if (document.getElementById("devlog-entries")) {
		setTimeout(() => {
			initDevlogFilter();
		}, 100); // Small delay to ensure DOM is fully processed
	}

	addCurrentYearToFooter();
	initSmoothBackgroundScaling();

	// Show content immediately to prevent invisible content issues
	document.body.classList.add("content-loaded");
});

// Add a fallback to ensure content is always visible
window.addEventListener("load", () => {
	// Double-check that content-loaded class is applied
	if (!document.body.classList.contains("content-loaded")) {
		document.body.classList.add("content-loaded");
	}
});

/**
 * Page Transition Effect
 * Creates a smooth, professional transition effect when navigating between pages
 */
function initPageTransitions() {
	// Create the transition elements if they don't exist
	if (!document.querySelector(".page-transition")) {
		// Create the main container
		const transitionContainer = document.createElement("div");
		transitionContainer.className = "page-transition";

		// Create a subtle gradient overlay
		const overlay = document.createElement("div");
		overlay.className = "glitch-overlay";
		overlay.style.background =
			"radial-gradient(circle, rgba(26, 39, 179, 0.08) 0%, rgba(0, 0, 0, 0.6) 100%)";
		overlay.style.opacity = "0.7";
		transitionContainer.appendChild(overlay);

		// Create subtle scanlines for texture
		const scanlines = document.createElement("div");
		scanlines.className = "glitch-scanlines";
		scanlines.style.opacity = "0.08";
		scanlines.style.backgroundSize = "100% 6px";
		transitionContainer.appendChild(scanlines);

		// Create a subtle color layer
		const colorLayer = document.createElement("div");
		colorLayer.className = "glitch-rgb";
		colorLayer.style.background =
			"linear-gradient(135deg, rgba(26, 39, 179, 0.04), rgba(108, 19, 163, 0.04))";
		colorLayer.style.opacity = "0.2";
		transitionContainer.appendChild(colorLayer);

		// Create a container for the loading text to ensure proper centering
		// Using flexbox for perfect centering
		const textContainer = document.createElement("div");
		textContainer.className = "glitch-text-container";

		// Create a wrapper for the loading text to ensure it stays centered
		const textWrapper = document.createElement("div");
		textWrapper.style.textAlign = "center";
		textWrapper.style.width = "100%";

		// Create loading text with a professional effect
		const glitchText = document.createElement("div");
		glitchText.className = "glitch-text";
		glitchText.textContent = "LOADING";
		// Set data-text attribute for pseudo-element content
		glitchText.setAttribute("data-text", "LOADING");

		// Add loading line span
		const loadingLine = document.createElement("span");
		glitchText.appendChild(loadingLine);

		// Add text to wrapper, wrapper to container, then container to transition
		textWrapper.appendChild(glitchText);
		textContainer.appendChild(textWrapper);
		transitionContainer.appendChild(textContainer);

		// Add a loading bar container
		const loadingBarContainer = document.createElement("div");
		loadingBarContainer.className = "loading-bar-container";
		loadingBarContainer.style.position = "absolute";
		loadingBarContainer.style.bottom = "30%";
		loadingBarContainer.style.left = "50%";
		loadingBarContainer.style.transform = "translateX(-50%)";
		loadingBarContainer.style.width = "280px";
		loadingBarContainer.style.height = "3px";
		loadingBarContainer.style.backgroundColor = "rgba(240, 240, 245, 0.08)";
		loadingBarContainer.style.borderRadius = "3px";
		loadingBarContainer.style.overflow = "hidden";

		// Add a loading bar
		const loadingBar = document.createElement("div");
		loadingBar.className = "loading-bar";
		loadingBar.style.height = "100%";
		loadingBar.style.width = "0";
		loadingBar.style.background = "linear-gradient(90deg, #1a27b3, #6c13a3)";
		loadingBar.style.borderRadius = "3px";
		loadingBar.style.animation =
			"loading 0.7s cubic-bezier(0.19, 1, 0.22, 1) forwards";

		loadingBarContainer.appendChild(loadingBar);
		transitionContainer.appendChild(loadingBarContainer);

		// Force an update of the transition size
		setTimeout(() => {
			updateTransitionSize();
		}, 0);

		// Add to document
		document.body.appendChild(transitionContainer);

		// Add keyframes for loading animation if not already present
		if (!document.getElementById("loading-keyframes")) {
			const style = document.createElement("style");
			style.id = "loading-keyframes";
			style.textContent = `
                @keyframes loading {
                    0% { width: 0; }
                    30% { width: 40%; }
                    60% { width: 75%; }
                    100% { width: 100%; }
                }
            `;
			document.head.appendChild(style);
		}
	}

	// Verify the transition container exists
	const transitionCheck = document.querySelector(".page-transition");

	// Ensure the transition container is properly sized for the viewport
	function updateTransitionSize() {
		const transition = document.querySelector(".page-transition");
		if (transition) {
			transition.style.width = `${window.innerWidth}px`;
			transition.style.height = `${window.innerHeight}px`;
		}
	}

	// Update on resize
	window.addEventListener("resize", updateTransitionSize);

	// Get all internal links with a more comprehensive selector
	// This will catch all links that have an href attribute
	const allLinks = document.querySelectorAll("a[href]");

	// Filter to only include internal links
	const internalLinks = Array.from(allLinks).filter((link) => {
		const href = link.getAttribute("href");
		if (!href || href.trim() === "") return false;

		// Check if it's an external link or special protocol
		if (href.startsWith("#")) return false;
		if (href.startsWith("javascript:")) return false;
		if (href.startsWith("data:")) return false;
		if (href.startsWith("vbscript:")) return false;
		if (href.startsWith("mailto:")) return false;
		if (href.startsWith("tel:")) return false;
		if (href.startsWith("http://")) return false;
		if (href.startsWith("https://")) return false;

		return true;
	});

	// Add click event listeners to all internal links

	for (const link of internalLinks) {
		const href = link.getAttribute("href");

		// Skip links that open in new tabs or have already been processed
		if (
			link.getAttribute("target") === "_blank" ||
			link.hasAttribute("data-transition-processed") ||
			href?.startsWith("#") ||
			(href &&
				(href.startsWith("javascript:") ||
					href.startsWith("data:") ||
					href.startsWith("vbscript:"))) ||
			href?.startsWith("mailto:") ||
			href?.startsWith("tel:") ||
			href?.startsWith("http")
		) {
			continue;
		}

		// Mark as processed to avoid duplicate listeners
		link.setAttribute("data-transition-processed", "true");

		// Use a single event handler for both click and touchend events
		const handleNavigation = function (e) {
			// Don't handle if modifier keys are pressed (a user might want to open in a new tab)
			if (e.ctrlKey || e.metaKey || e.shiftKey) {
				return;
			}

			const href = this.getAttribute("href");

			// Don't handle if href is missing or hash links (same-page navigation)
			if (!href || href.startsWith("#")) {
				return;
			}

			// Prevent default navigation and stop propagation
			e.preventDefault();
			e.stopPropagation();

			// Get the transition element
			let transition = document.querySelector(".page-transition");

			if (!transition) {
				// Create a transition element if it doesn't exist
				initPageTransitions();
				// Try to get it again
				transition = document.querySelector(".page-transition");
				if (!transition) {
					console.error("Failed to create transition element");
					window.location.href = href;
					return;
				}

				// Make sure the transition element is properly sized
				transition.style.width = `${window.innerWidth}px`;
				transition.style.height = `${window.innerHeight}px`;
			}

			// Generate random loading text-professional options
			const glitchTexts = [
				"LOADING",
				"PLEASE WAIT",
				"REDIRECTING",
				"NAVIGATING",
				"PROCESSING",
				"PREPARING",
				"LOADING PAGE",
				"ALMOST THERE",
				"JUST A MOMENT",
			];
			const randomText =
				glitchTexts[Math.floor(Math.random() * glitchTexts.length)];
			const glitchTextElement = document.querySelector(".glitch-text");
			if (glitchTextElement) {
				glitchTextElement.textContent = randomText;
				glitchTextElement.setAttribute("data-text", randomText);
			}

			// Prevent scrolling during transition
			document.body.style.overflow = "hidden";

			// Force a browser reflow to ensure all styles are applied immediately
			void transition.offsetWidth;

			// Show the transition
			transition.classList.add("active");
			console.log("Activated transition - transition element:", transition);

			// Force immediate update of glitch text styles - reuse the existing element
			if (glitchTextElement) {
				// Force a style recalculation
				void glitchTextElement.offsetHeight;

				// Apply a tiny transform to trigger hardware acceleration
				if (!glitchTextElement.style.transform.includes("!important")) {
					glitchTextElement.style.transform = "translateZ(0)";
				}

				// Force animation to restart
				glitchTextElement.style.animationName = "none";
				void glitchTextElement.offsetHeight;
				glitchTextElement.style.animationName = "";
			}

			// Determine if we're on mobile with a simplified check
			const isMobile =
				window.innerWidth <= 768 ||
				/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(
					navigator.userAgent,
				);

			// Check if reduced effects mode is enabled
			const reducedEffects =
				window.reducedEffects === true ||
				document.body.classList.contains("reduced-effects");

			// Add transition effects, respecting reduced effects setting
			if (reducedEffects) {
				// Minimal effects for reduced mode
				document.body.style.filter = "brightness(0.98)";
				// Add a reduced-effects class if not already present
				if (!document.body.classList.contains("reduced-effects")) {
					document.body.classList.add("reduced-effects");
				}
			} else {
				// Normal effects based on a device - more subtle brightness change
				document.body.style.filter = isMobile
					? "brightness(0.95)"
					: "brightness(0.92)";
			}

			// Navigate after a delay - faster and more responsive
			const navigationDelay = reducedEffects ? 250 : isMobile ? 450 : 550;

			setTimeout(() => {
				window.location.href = href;
			}, navigationDelay);
		};

		// Add event listeners for both click and touchend
		link.addEventListener("click", handleNavigation, { passive: false });
		link.addEventListener("touchend", handleNavigation, { passive: false });
	}
}

/**
 * Mobile Navigation Menu Toggle
 * Creates a hamburger menu for mobile devices
 */
function initMobileMenu() {
	// Create mobile menu button
	const header = document.querySelector(".header-container");
	const nav = document.querySelector(".nav-links");

	if (!header || !nav) return;

	// Check if mobile menu button already exists
	let mobileMenuBtn = document.querySelector(".mobile-menu-btn");

	// Create button only if it doesn't exist
	if (!mobileMenuBtn) {
		mobileMenuBtn = document.createElement("button");
		mobileMenuBtn.classList.add("mobile-menu-btn");
		mobileMenuBtn.setAttribute("aria-label", "Toggle navigation menu");
		mobileMenuBtn.innerHTML = "<span></span><span></span><span></span>";

		// Insert button before the nav
		header.insertBefore(mobileMenuBtn, nav);
	}

	// Add mobile class to nav
	nav.classList.add("desktop-nav");

	// Remove existing event listeners (to prevent duplicates)
	const newMobileMenuBtn = mobileMenuBtn.cloneNode(true);
	if (mobileMenuBtn.parentNode) {
		mobileMenuBtn.parentNode.replaceChild(newMobileMenuBtn, mobileMenuBtn);
	}
	mobileMenuBtn = newMobileMenuBtn;

	// Toggle menu on button click
	mobileMenuBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		nav.classList.toggle("show");
		mobileMenuBtn.classList.toggle("active");
	});

	// Add touch event for better mobile support
	mobileMenuBtn.addEventListener(
		"touchend",
		(e) => {
			e.preventDefault(); // Prevent ghost clicks
			e.stopPropagation();
			nav.classList.toggle("show");
			mobileMenuBtn.classList.toggle("active");
		},
		{ passive: false },
	);

	// Close the menu when clicking outside
	document.addEventListener("click", (event) => {
		if (!header.contains(event.target) && nav.classList.contains("show")) {
			nav.classList.remove("show");
			mobileMenuBtn.classList.remove("active");
		}
	});
}

/**
 * Back to Top Button
 * Adds a button that appears when scrolling down and scrolls to the top when clicked
 */
function initBackToTop() {
	// Create back to top button
	const backToTopBtn = document.createElement("button");
	backToTopBtn.classList.add("back-to-top");
	backToTopBtn.setAttribute("aria-label", "Back to top");
	backToTopBtn.innerHTML = "↑";
	document.body.appendChild(backToTopBtn);

	// Show/hide button based on scroll position
	window.addEventListener(
		"scroll",
		throttle(() => {
			if (window.pageYOffset > 300) {
				backToTopBtn.classList.add("show");
			} else {
				backToTopBtn.classList.remove("show");
			}
		}, 100),
		{ passive: true },
	);

	// Scroll to top when clicked
	backToTopBtn.addEventListener("click", () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	});
}

/**
 * Image Lightbox
 * Creates a lightbox effect for images when clicked
 */
function initImageLightbox() {
	// Get all images in content boxes
	const images = document.querySelectorAll(".content-box img");

	if (images.length === 0) return;

	// Create lightbox elements
	const lightbox = document.createElement("div");
	lightbox.classList.add("lightbox");

	const lightboxImg = document.createElement("img");
	lightbox.appendChild(lightboxImg);

	const closeBtn = document.createElement("button");
	closeBtn.classList.add("lightbox-close");
	closeBtn.innerHTML = "×";
	lightbox.appendChild(closeBtn);

	document.body.appendChild(lightbox);

	// Add click event to images
	images.forEach((img) => {
		// Make images appear clickable
		img.style.cursor = "pointer";

		img.addEventListener("click", function () {
			// Set the image source
			lightboxImg.src = this.src;

			// Show the lightbox (this triggers the container transition)
			lightbox.classList.add("show");

			// Prevent scrolling
			document.body.style.overflow = "hidden";
		});
	});

	// Close lightbox when clicking close button or outside the image
	closeBtn.addEventListener("click", closeLightbox);
	lightbox.addEventListener("click", (event) => {
		if (event.target === lightbox) {
			closeLightbox();
		}
	});

	// Close the lightbox with an escape key
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && lightbox.classList.contains("show")) {
			closeLightbox();
		}
	});

	function closeLightbox() {
		lightbox.classList.remove("show");
		document.body.style.overflow = ""; // Restore scrolling
	}
}

/**
 * Add current year to footer
 * Automatically updates the year in copyright notices
 */
function addCurrentYearToFooter() {
	const yearElements = document.querySelectorAll(".current-year");
	const currentYear = new Date().getFullYear();

	yearElements.forEach((element) => {
		element.textContent = currentYear;
	});
}

/**
 * Devlog Category Filter
 * Filters devlog entries by category
 */
function initDevlogFilter() {
	const filterButtons = document.querySelectorAll(".filter-btn");
	const devlogEntries = document.querySelectorAll(".devlog-entry");

	console.log(
		"Devlog Filter Init - Buttons:",
		filterButtons.length,
		"Entries:",
		devlogEntries.length,
	);

	// Log each entry for debugging
	devlogEntries.forEach((entry, index) => {
		console.log(
			`Entry ${index}:`,
			entry.querySelector("h3").textContent,
			"Category:",
			entry.getAttribute("data-category"),
		);
	});

	if (filterButtons.length === 0 || devlogEntries.length === 0) {
		console.log("No filter buttons or entries found");
		return;
	}

	// Make sure all entries are visible by default
	devlogEntries.forEach((entry) => {
		entry.classList.remove("hidden");
		entry.style.opacity = "1";
	});

	// Force "All Updates" to be active by default
	filterButtons.forEach((btn) => btn.classList.remove("active"));
	const allButton = document.querySelector('.filter-btn[data-category="all"]');
	if (allButton) {
		allButton.classList.add("active");
	}

	// Add click event to filter buttons
	filterButtons.forEach((button) => {
		button.addEventListener("click", function () {
			// Remove the active class from all buttons
			filterButtons.forEach((btn) => btn.classList.remove("active"));

			// Add an active class to clicked button
			this.classList.add("active");

			// Get a selected category
			const selectedCategory = this.getAttribute("data-category");

			// Filter entries
			devlogEntries.forEach((entry) => {
				if (
					selectedCategory === "all" ||
					entry.getAttribute("data-category") === selectedCategory
				) {
					entry.classList.remove("hidden");
					// Add a subtle animation for appearing entries
					entry.style.opacity = "0";
					setTimeout(() => {
						entry.style.opacity = "1";
					}, 50);
				} else {
					entry.classList.add("hidden");
				}
			});
		});
	});
}

/**
 * Ultra-Smooth Background Image Scaling
 * Provides an almost imperceptible background resizing experience
 */
function initSmoothBackgroundScaling() {
	// Determine the correct background image path based on the current page location
	let bgImagePath;

	// More robust path detection using document.location
	const pathSegments = document.location.pathname.split("/");
	const isInSubfolder = pathSegments.includes("Pages");

	// Check if we're in a development environment (localhost or file://)
	if (isInSubfolder) {
		// We're in a subpage
		bgImagePath = "../Images/Base-Image.png";
	} else {
		// We're at the root
		bgImagePath = "./Images/Base-Image.png";
	}

	// Log the path for debugging
	console.log("Background image path:", bgImagePath);
	console.log("Path segments:", pathSegments);
	console.log("Is in subfolder:", isInSubfolder);

	// Verify the path is correct by checking if we're on GitHub Pages
	if (
		window.location.hostname === "github.io" ||
		window.location.hostname.endsWith(".github.io")
	) {
		// For GitHub Pages, we might need to adjust paths based on the repository name
		const repoName = "twisted-creations.github.io";
		const repoPath = pathSegments.indexOf(repoName);

		if (repoPath !== -1 && !isInSubfolder) {
			// We're at the root of the GitHub Pages site
			bgImagePath = `./${repoName}/Images/Base-Image.png`;
		}
	}

	// Check if a background container already exists
	let bgContainer = document.querySelector(".background-container");

	// If it doesn't exist, create it
	if (!bgContainer) {
		bgContainer = document.createElement("div");
		bgContainer.classList.add("background-container");
		bgContainer.setAttribute("aria-hidden", "true"); // Hide from screen readers

		// Insert the background container as the first child of the body
		document.body.insertBefore(bgContainer, document.body.firstChild);
		console.log("Background container created");
	} else {
		console.log("Background container already exists");
	}

	// Preload the background image with error handling
	function preloadImage(src, onSuccess, onError) {
		console.log("Attempting to preload image:", src);
		const img = new Image();

		img.onload = () => {
			console.log("Image loaded successfully:", src);
			if (typeof onSuccess === "function") {
				onSuccess(img);
			}
		};

		img.onerror = (e) => {
			console.error(`Failed to load image: ${src}`, e);
			// Try an alternative path if the image fails to load
			const altSrc = src.replace(/^\.\.\//, "./").replace(/^\.\//, "../");
			console.log("Trying alternative path:", altSrc);

			const altImg = new Image();
			altImg.onload = () => {
				console.log("Alternative image loaded successfully:", altSrc);
				if (typeof onSuccess === "function") {
					onSuccess(altImg);
				}
			};

			altImg.onerror = () => {
				console.error(`Failed to load alternative image: ${altSrc}`);
				if (typeof onError === "function") {
					onError();
				}
			};

			altImg.src = altSrc;
		};

		// Set src after setting up event handlers
		img.src = src;

		return img;
	}

	// Create a single persistent background element that we'll transform
	let bgElement = null;
	let isFirstLoad = true;

	// Track resize state
	let resizeTimeout = null;
	let isResizing = false;
	let initialWidth = window.innerWidth;
	let initialHeight = window.innerHeight;

	// Function to create or update the background image
	function setupBackgroundImage() {
		console.log("Setting up background image");

		// Create a loading indicator if this is the first load
		if (isFirstLoad && !bgContainer.querySelector(".loading-indicator")) {
			const loadingIndicator = document.createElement("div");
			loadingIndicator.classList.add("loading-indicator");
			bgContainer.appendChild(loadingIndicator);
			console.log("Loading indicator added");
		}

		// Check if we're in Pages directory and adjust path if needed
		if (document.location.pathname.includes("/Pages/")) {
			bgImagePath = "../Images/Base-Image.png";
			console.log("Adjusted path for Pages directory:", bgImagePath);
		}

		// Preload the image before showing it
		preloadImage(
			bgImagePath,
			// Success callback
			() => {
				if (isFirstLoad) {
					// First time setup - create the background element
					bgElement = document.createElement("div");
					bgElement.classList.add("bg-image", "active-bg");

					// Set initial styles
					bgElement.style.opacity = "0";
					bgElement.style.backgroundImage = `url(${bgImagePath})`;
					bgElement.style.backgroundSize = "cover";
					bgElement.style.backgroundPosition = "center center";

					// Use an extremely slow transition for transform to make it imperceptible
					bgElement.style.transition =
						"opacity 0.5s ease-in-out, transform 8s cubic-bezier(0.1, 0.1, 0.25, 1)";

					// Add to container
					bgContainer.appendChild(bgElement);

					// Remove any loading indicator
					const loadingIndicator =
						bgContainer.querySelector(".loading-indicator");
					if (loadingIndicator) {
						bgContainer.removeChild(loadingIndicator);
					}

					// Force the browser to process the new element before transition
					setTimeout(() => {
						bgElement.style.opacity = "1";
						isFirstLoad = false;
					}, 50);
				}
			},
			// Error callback - use a solid color fallback if the image fails to load
			() => {
				if (isFirstLoad) {
					// Create a fallback background
					bgElement = document.createElement("div");
					bgElement.classList.add("bg-image", "fallback-bg", "active-bg");

					// Set initial opacity to 0 for a smooth transition
					bgElement.style.opacity = "0";

					// Apply a gradient background as fallback
					bgElement.style.background =
						"linear-gradient(to bottom, #1a1a1a, #2c2c2c)";

					// Add to container
					bgContainer.appendChild(bgElement);

					// Remove any loading indicator
					const loadingIndicator =
						bgContainer.querySelector(".loading-indicator");
					if (loadingIndicator) {
						bgContainer.removeChild(loadingIndicator);
					}

					// Force the browser to process the new element before transition
					setTimeout(() => {
						bgElement.style.opacity = "1";
						isFirstLoad = false;
					}, 50);
				}
			},
		);
	}

	// Initial background setup
	setupBackgroundImage();

	// Calculate the scale factor needed to ensure the background covers the viewport
	function calculateOptimalScale() {
		if (!bgElement) return 1;

		// Get current viewport dimensions
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		// Calculate the ratio of current size to initial size
		const widthRatio = viewportWidth / initialWidth;
		const heightRatio = viewportHeight / initialHeight;

		// Use the larger ratio to ensure the image always covers the viewport
		// Add a small buffer (1.01) to prevent any potential gaps
		return Math.max(widthRatio, heightRatio) * 1.01;
	}

	// Throttle function to limit how often a function can be called
	function throttle(callback, limit) {
		let waiting = false;
		return function () {
			if (!waiting) {
				callback.apply(this, arguments);
				waiting = true;
				setTimeout(() => {
					waiting = false;
				}, limit);
			}
		};
	}

	// Ultra-smooth resize handler with imperceptible visual changes
	const handleResize = throttle(() => {
		if (!bgElement || isFirstLoad) return;

		// Don't start a new resize operation if one is already in progress
		if (isResizing) return;

		// Mark that we're in a resize operation
		isResizing = true;

		// Calculate the optimal scale to cover the viewport
		const scale = calculateOptimalScale();

		// Only apply significant changes to avoid tiny adjustments,
		// This prevents constant micro-animations
		if (Math.abs(scale - 1) > 0.02) {
			// Apply the scale transformation extremely subtly
			bgElement.style.transform = `scale(${scale})`;
		}

		// Clear any existing timeout
		if (resizeTimeout) {
			clearTimeout(resizeTimeout);
		}

		// Set a much longer timeout to mark the end of resizing
		// This ensures we don't reset too quickly, allowing for a very gradual transition
		resizeTimeout = setTimeout(() => {
			isResizing = false;

			// Update the initial dimensions to the new viewport size
			// This helps prevent cumulative scaling issues
			initialWidth = window.innerWidth;
			initialHeight = window.innerHeight;

			// Reset the transform to identity after we've updated our reference dimensions,
			// The very slow transition will make this completely imperceptible
			bgElement.style.transform = "scale(1)";
		}, 1000); // Wait a full second after resize stops before resetting
	}, 100); // Throttle more aggressively to reduce update frequency

	// Handle orientation changes specially
	const handleOrientationChange = () => {
		if (!bgElement) return;

		// For orientation changes, we want to reset our reference dimensions immediately
		initialWidth = window.innerWidth;
		initialHeight = window.innerHeight;

		// Apply a very subtle fade effect
		bgElement.style.opacity = "0.95";

		// Restore full opacity after the orientation change is complete
		setTimeout(() => {
			bgElement.style.opacity = "1";
		}, 300);
	};

	// Add event listeners
	window.addEventListener("resize", handleResize, { passive: true });
	window.addEventListener("orientationchange", handleOrientationChange);

	// Cleanup function to remove event listeners when the page unloads
	const cleanup = () => {
		window.removeEventListener("resize", handleResize);
		window.removeEventListener("orientationchange", handleOrientationChange);
	};

	// Add cleanup on the page unloaded
	window.addEventListener("unload", cleanup);

	// Return cleanup function for potential manual cleanup
	return cleanup;
}
