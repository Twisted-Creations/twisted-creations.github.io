// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functions
  initMobileMenu();
  initBackToTop();
  initImageLightbox();
  initDevlogFilter();
  addCurrentYearToFooter();
  initSmoothBackgroundScaling();
  initPageTransitions();

  // Show content after a short delay to ensure background is loaded
  setTimeout(() => {
    document.body.classList.add("content-loaded");
  }, 100);
});

/**
 * Page Transition Glitch Effect
 * Creates a horror-themed glitch effect when navigating between pages
 */
function initPageTransitions() {
  // Create the transition elements if they don't exist
  if (!document.querySelector(".page-transition")) {
    // Create main container
    const transitionContainer = document.createElement("div");
    transitionContainer.className = "page-transition";

    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "glitch-overlay";
    transitionContainer.appendChild(overlay);

    // Create scanlines
    const scanlines = document.createElement("div");
    scanlines.className = "glitch-scanlines";
    transitionContainer.appendChild(scanlines);

    // Create RGB shift layer
    const rgbLayer = document.createElement("div");
    rgbLayer.className = "glitch-rgb";
    transitionContainer.appendChild(rgbLayer);

    // Create horizontal glitch slices
    for (let i = 0; i < 3; i++) {
      const slice = document.createElement("div");
      slice.className = "glitch-slice";
      transitionContainer.appendChild(slice);
    }

    // Create glitch text
    const glitchText = document.createElement("div");
    glitchText.className = "glitch-text";
    glitchText.textContent = "LOADING";
    transitionContainer.appendChild(glitchText);

    // Add to document
    document.body.appendChild(transitionContainer);
  }

  // Get all internal links - more comprehensive selector for mobile compatibility
  const internalLinks = document.querySelectorAll(
    'a[href^="./"], a[href^="/"], a[href^="../"], a[href^="Pages/"], a[href^="index.html"], a:not([href^="http"]):not([href^="mailto"]):not([href^="tel"]):not([href^="javascript"]):not([href^="#"])'
  );

  // Add click event listeners to all internal links
  internalLinks.forEach((link) => {
    // Skip links that open in new tabs or have already been processed
    if (
      link.getAttribute("target") === "_blank" ||
      link.hasAttribute("data-transition-processed")
    ) {
      return;
    }

    // Mark as processed to avoid duplicate listeners
    link.setAttribute("data-transition-processed", "true");

    // Use both click and touchend events for better mobile support
    ["click", "touchend"].forEach((eventType) => {
      link.addEventListener(
        eventType,
        function (e) {
          // Don't handle if modifier keys are pressed (user might want to open in new tab)
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
          const transition = document.querySelector(".page-transition");

          // Generate random glitch text from a horror-themed array
          const glitchTexts = [
            "LOADING",
            "ERROR",
            "CORRUPTED",
            "FEAR",
            "DARKNESS",
            "TWISTED",
            "NIGHTMARE",
            "GLITCH",
            "VOID",
            "UNKNOWN",
          ];
          const randomText =
            glitchTexts[Math.floor(Math.random() * glitchTexts.length)];
          document.querySelector(".glitch-text").textContent = randomText;

          // Prevent scrolling during transition
          document.body.style.overflow = "hidden";

          // Show the transition
          transition.classList.add("active");

          // Determine if we're on mobile
          const isMobile = window.innerWidth <= 768;

          // Add some extra glitchy behavior - simplified on mobile
          setTimeout(() => {
            if (isMobile) {
              // Simpler effect for mobile
              document.body.style.filter = "contrast(1.2)";
            } else {
              document.body.style.filter = "hue-rotate(90deg) contrast(1.5)";
            }
          }, 300);

          // Navigate after a delay - shorter on mobile for better UX
          const navigationDelay = isMobile ? 600 : 800;
          setTimeout(() => {
            window.location.href = href;
          }, navigationDelay);
        },
        { passive: false }
      ); // Important for mobile touch events
    });
  });
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
 * Ultra-Smooth Background Image Scaling
 * Provides an almost imperceptible background resizing experience
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
    // Create a loading indicator if this is the first load
    if (isFirstLoad && !bgContainer.querySelector(".loading-indicator")) {
      const loadingIndicator = document.createElement("div");
      loadingIndicator.classList.add("loading-indicator");
      bgContainer.appendChild(loadingIndicator);
    }

    // Preload the image before showing it
    preloadImage(
      bgImagePath,
      // Success callback
      (img) => {
        if (isFirstLoad) {
          // First time setup - create the background element
          bgElement = document.createElement("div");
          bgElement.classList.add("bg-image", "active-bg");

          // Set initial styles
          bgElement.style.opacity = "0";
          bgElement.style.backgroundImage = `url(${bgImagePath})`;
          bgElement.style.backgroundSize = "cover";
          bgElement.style.backgroundPosition = "center center";

          // Use a very slow transition for transform to make it imperceptible
          bgElement.style.transition =
            "opacity 0.5s ease-in-out, transform 1.5s cubic-bezier(0.1, 0.9, 0.2, 1)";

          // Add to container
          bgContainer.appendChild(bgElement);

          // Remove any loading indicator
          const loadingIndicator =
            bgContainer.querySelector(".loading-indicator");
          if (loadingIndicator) {
            bgContainer.removeChild(loadingIndicator);
          }

          // Force browser to process the new element before transition
          setTimeout(() => {
            bgElement.style.opacity = "1";
            isFirstLoad = false;
          }, 50);
        }
      },
      // Error callback - use a solid color fallback if image fails to load
      () => {
        if (isFirstLoad) {
          // Create fallback background
          bgElement = document.createElement("div");
          bgElement.classList.add("bg-image", "fallback-bg", "active-bg");

          // Set initial opacity to 0 for smooth transition
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

          // Force browser to process the new element before transition
          setTimeout(() => {
            bgElement.style.opacity = "1";
            isFirstLoad = false;
          }, 50);
        }
      }
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
        setTimeout(function () {
          waiting = false;
        }, limit);
      }
    };
  }

  // Ultra-smooth resize handler with minimal visual changes
  const handleResize = throttle(function () {
    if (!bgElement || isFirstLoad) return;

    // Mark that we're in a resize operation
    isResizing = true;

    // Calculate the optimal scale to cover the viewport
    const scale = calculateOptimalScale();

    // Apply the scale transformation very subtly
    bgElement.style.transform = `scale(${scale})`;

    // Clear any existing timeout
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }

    // Set a timeout to mark the end of resizing
    resizeTimeout = setTimeout(() => {
      isResizing = false;

      // Update the initial dimensions to the new viewport size
      // This helps prevent cumulative scaling issues
      initialWidth = window.innerWidth;
      initialHeight = window.innerHeight;

      // Reset the transform to identity after we've updated our reference dimensions
      // The transition will make this imperceptible
      bgElement.style.transform = "scale(1)";
    }, 200);
  }, 16); // Throttle to roughly 60fps

  // Handle orientation changes specially
  const handleOrientationChange = function () {
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

  // Clean up function to remove event listeners when page unloads
  const cleanup = function () {
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("orientationchange", handleOrientationChange);
  };

  // Add cleanup on page unload
  window.addEventListener("unload", cleanup);

  // Return cleanup function for potential manual cleanup
  return cleanup;
}
