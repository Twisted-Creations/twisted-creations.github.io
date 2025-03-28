// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functions
  initMobileMenu();
  initBackToTop();
  initImageLightbox();
  initDevlogFilter();
  addCurrentYearToFooter();
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
