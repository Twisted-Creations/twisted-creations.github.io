// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functions
  initMobileMenu();
  initBackToTop();
  initImageLightbox();
  initDevlogFilter();
  addCurrentYearToFooter();
  initSmoothBackgroundScaling();

  // Show content after a short delay to ensure background is loaded
  setTimeout(() => {
    document.body.classList.add("content-loaded");
  }, 100);
});

/**
 * Mobile Navigation Menu Toggle
 * Creates a hamburger menu for mobile devices
 */
function initMobileMenu() {
  // Create mobile menu button
  const header = document.querySelector(".header-container");
  const nav = document.querySelector(".nav-links");

  if (!header || !nav) return;

  const mobileMenuBtn = document.createElement("button");
  mobileMenuBtn.classList.add("mobile-menu-btn");
  mobileMenuBtn.setAttribute("aria-label", "Toggle navigation menu");
  mobileMenuBtn.innerHTML = "<span></span><span></span><span></span>";

  // Insert button before the nav
  header.insertBefore(mobileMenuBtn, nav);

  // Add mobile class to nav
  nav.classList.add("desktop-nav");

  // Toggle menu on button click
  mobileMenuBtn.addEventListener("click", function () {
    nav.classList.toggle("show");
    mobileMenuBtn.classList.toggle("active");
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    if (!header.contains(event.target) && nav.classList.contains("show")) {
      nav.classList.remove("show");
      mobileMenuBtn.classList.remove("active");
    }
  });
}

/**
 * Back to Top Button
 * Adds a button that appears when scrolling down and scrolls to top when clicked
 */
function initBackToTop() {
  // Create back to top button
  const backToTopBtn = document.createElement("button");
  backToTopBtn.classList.add("back-to-top");
  backToTopBtn.setAttribute("aria-label", "Back to top");
  backToTopBtn.innerHTML = "↑";
  document.body.appendChild(backToTopBtn);

  // Show/hide button based on scroll position
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  // Scroll to top when clicked
  backToTopBtn.addEventListener("click", function () {
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
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  // Close lightbox with escape key
  document.addEventListener("keydown", function (event) {
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

  if (filterButtons.length === 0 || devlogEntries.length === 0) return;

  // Add click event to filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Get selected category
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
 * Smooth Background Image Scaling
 * Provides a smoother experience when resizing the background image
 */
function initSmoothBackgroundScaling() {
  // Determine the correct background image path based on current page location
  let bgImagePath;

  // More robust path detection using document.location
  const pathSegments = document.location.pathname.split("/");
  const isInSubfolder = pathSegments.includes("Pages");

  // Check if we're in a development environment (localhost or file://)
  const isDev =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.protocol === "file:";

  if (isInSubfolder) {
    // We're in a subpage
    bgImagePath = "../Images/Base-Image.png";
  } else {
    // We're at the root
    bgImagePath = "./Images/Base-Image.png";
  }

  // Verify the path is correct by checking if we're on GitHub Pages
  if (window.location.hostname.includes("github.io")) {
    // For GitHub Pages, we might need to adjust paths based on repository name
    const repoName = "twisted-creations.github.io";
    const repoPath = pathSegments.indexOf(repoName);

    if (repoPath !== -1 && !isInSubfolder) {
      // We're at the root of the GitHub Pages site
      bgImagePath = `./${repoName}/Images/Base-Image.png`;
    }
  }

  // Create a background container element
  const bgContainer = document.createElement("div");
  bgContainer.classList.add("background-container");
  bgContainer.setAttribute("aria-hidden", "true"); // Hide from screen readers

  // Insert the background container as the first child of the body
  document.body.insertBefore(bgContainer, document.body.firstChild);

  // Function to determine optimal image size based on screen dimensions and device capabilities
  function getOptimalImageSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;

    // Check if the device is likely a low-power device
    const isLowPowerDevice = () => {
      // Check for low-end device indicators
      const isLowEnd =
        // Low memory (if available in browser)
        (navigator.deviceMemory && navigator.deviceMemory < 4) ||
        // Low number of logical processors
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
        // Mobile device
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      return isLowEnd;
    };

    // Scaling factor based on device capabilities
    let scaleFactor = 1.2; // Default scaling factor

    // Reduce quality for low-power devices
    if (isLowPowerDevice()) {
      scaleFactor = 1.0; // Lower scaling factor for low-power devices
    }

    // Calculate optimal size based on device capabilities
    // We'll use a slightly larger image than needed to prevent pixelation
    // but not too large to avoid performance issues
    const optimalWidth = Math.ceil(width * pixelRatio * scaleFactor);
    const optimalHeight = Math.ceil(height * pixelRatio * scaleFactor);

    return { width: optimalWidth, height: optimalHeight };
  }

  // Preload the background image with error handling
  function preloadImage(src, onSuccess, onError) {
    const img = new Image();

    img.onload = function () {
      if (typeof onSuccess === "function") {
        onSuccess(img);
      }
    };

    img.onerror = function () {
      console.warn(`Failed to load image: ${src}`);
      if (typeof onError === "function") {
        onError();
      }
    };

    // Set crossOrigin to anonymous for CORS-enabled servers
    img.crossOrigin = "anonymous";

    // Set src after setting up event handlers
    img.src = src;

    return img;
  }

  // Function to update background image
  function updateBackgroundImage() {
    // Get current background if it exists
    const currentBg = bgContainer.querySelector(".active-bg");

    // Get optimal image size
    const size = getOptimalImageSize();

    // Create a loading indicator if this is the first load
    if (!currentBg && !bgContainer.querySelector(".loading-indicator")) {
      const loadingIndicator = document.createElement("div");
      loadingIndicator.classList.add("loading-indicator");
      bgContainer.appendChild(loadingIndicator);
    }

    // Preload the image before showing it
    preloadImage(
      bgImagePath,
      // Success callback
      (img) => {
        // Create new background element
        const newBg = document.createElement("div");
        newBg.classList.add("bg-image");

        // Set initial opacity to 0 for smooth transition
        newBg.style.opacity = "0";

        // Apply background image with optimal sizing
        newBg.style.backgroundImage = `url(${bgImagePath})`;
        newBg.style.backgroundSize = "cover";
        newBg.style.backgroundPosition = "center center";

        // Add blur filter initially for smoother appearance
        newBg.style.filter = "blur(5px)";

        // Add to container
        bgContainer.appendChild(newBg);

        // Remove any loading indicator
        const loadingIndicator =
          bgContainer.querySelector(".loading-indicator");
        if (loadingIndicator) {
          bgContainer.removeChild(loadingIndicator);
        }

        // Force browser to process the new element before transition
        setTimeout(() => {
          // Remove blur and fade in new background
          newBg.style.filter = "blur(0)";
          newBg.style.opacity = "1";
          newBg.classList.add("active-bg");

          // If there was a previous background, fade it out and remove
          if (currentBg) {
            currentBg.style.opacity = "0";
            currentBg.classList.remove("active-bg");

            // Remove old background after transition completes
            setTimeout(() => {
              if (bgContainer.contains(currentBg)) {
                bgContainer.removeChild(currentBg);
              }
            }, 500); // Match this with the CSS transition duration
          }
        }, 50);
      },
      // Error callback - use a solid color fallback if image fails to load
      () => {
        // Create fallback background
        const fallbackBg = document.createElement("div");
        fallbackBg.classList.add("bg-image", "fallback-bg");

        // Set initial opacity to 0 for smooth transition
        fallbackBg.style.opacity = "0";

        // Apply a gradient background as fallback
        fallbackBg.style.background =
          "linear-gradient(to bottom, #1a1a1a, #2c2c2c)";

        // Add to container
        bgContainer.appendChild(fallbackBg);

        // Remove any loading indicator
        const loadingIndicator =
          bgContainer.querySelector(".loading-indicator");
        if (loadingIndicator) {
          bgContainer.removeChild(loadingIndicator);
        }

        // Force browser to process the new element before transition
        setTimeout(() => {
          fallbackBg.style.opacity = "1";
          fallbackBg.classList.add("active-bg");

          // If there was a previous background, fade it out and remove
          if (currentBg) {
            currentBg.style.opacity = "0";
            currentBg.classList.remove("active-bg");

            // Remove old background after transition completes
            setTimeout(() => {
              if (bgContainer.contains(currentBg)) {
                bgContainer.removeChild(currentBg);
              }
            }, 500);
          }
        }, 50);
      }
    );
  }

  // Initial background setup
  updateBackgroundImage();

  // Handler function for resize events
  const handleResize = function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateBackgroundImage, 200);
  };

  // Handler for orientation change
  const handleOrientationChange = function () {
    updateBackgroundImage();
  };

  // Update background on resize, but use debounce to prevent too many updates
  let resizeTimer;
  window.addEventListener("resize", handleResize);

  // Update background when device orientation changes
  window.addEventListener("orientationchange", handleOrientationChange);

  // Clean up function to remove event listeners when page unloads
  // This prevents memory leaks
  const cleanup = function () {
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("orientationchange", handleOrientationChange);
  };

  // Add cleanup on page unload
  window.addEventListener("unload", cleanup);

  // Return cleanup function for potential manual cleanup
  return cleanup;
}
