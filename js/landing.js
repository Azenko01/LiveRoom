// Landing page JavaScript
document.addEventListener("DOMContentLoaded", () => {
  initializeLanding()
})

function initializeLanding() {
  // Theme toggle
  const themeToggle = document.getElementById("themeToggle")
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme)
    loadTheme()
  }

  // Mobile navigation
  setupMobileNavigation()

  // Smooth scrolling for navigation links
  setupSmoothScrolling()

  // Navbar scroll effects
  handleNavbarScroll()

  // Scroll to top button
  setupScrollToTop()

  // Chat preview animations
  animateChatPreview()

  // Intersection Observer for scroll animations
  setupScrollAnimations()

  // Newsletter form
  setupNewsletterForm()

  // Button click handlers
  setupButtonHandlers()

  // Video fallback
  setupVideoFallback()

  // Keyboard navigation
  setupKeyboardNavigation()
}

function toggleTheme() {
  document.body.classList.toggle("dark")
  const isDark = document.body.classList.contains("dark")
  localStorage.setItem("theme", isDark ? "dark" : "light")

  // Update theme toggle icon with animation
  const themeToggle = document.getElementById("themeToggle")
  if (themeToggle) {
    themeToggle.style.transform = "scale(0.8)"
    setTimeout(() => {
      themeToggle.textContent = isDark ? "☀️" : "🌙"
      themeToggle.style.transform = "scale(1)"
    }, 150)
  }

  // Announce theme change for screen readers
  announceToScreenReader(`Switched to ${isDark ? "dark" : "light"} theme`)
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.body.classList.add("dark")
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.textContent = "☀️"
    }
  }
}

function setupMobileNavigation() {
  const navToggle = document.getElementById("navToggle")
  const navMenu = document.getElementById("navMenu")

  if (!navToggle || !navMenu) return

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("active")

    navMenu.classList.toggle("active")
    navToggle.classList.toggle("active")

    // Update ARIA attributes
    navToggle.setAttribute("aria-expanded", isOpen ? "false" : "true")

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? "" : "hidden"

    // Focus management
    if (!isOpen) {
      setTimeout(() => {
        navMenu.querySelector("a")?.focus()
      }, 300) // Затримка для анімації
    }
  })

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (navMenu.classList.contains("active") && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove("active")
      navToggle.classList.remove("active")
      navToggle.setAttribute("aria-expanded", "false")
      document.body.style.overflow = ""
    }
  })

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active")
      navToggle.classList.remove("active")
      navToggle.setAttribute("aria-expanded", "false")
      document.body.style.overflow = ""
      navToggle.focus()
    }
  })
}

function setupSmoothScrolling() {
  // Enhanced smooth scrolling with proper offset calculation
  const navLinks = document.querySelectorAll('a[href^="#"]')

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      const targetId = link.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const navbar = document.querySelector(".navbar")
        const navbarHeight = navbar ? navbar.offsetHeight : 0
        const targetPosition = targetSection.offsetTop - navbarHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })

        // Close mobile menu if open
        const navMenu = document.getElementById("navMenu")
        const navToggle = document.getElementById("navToggle")
        if (navMenu && navMenu.classList.contains("active")) {
          navMenu.classList.remove("active")
          navToggle.classList.remove("active")
          navToggle.setAttribute("aria-expanded", "false")
          document.body.style.overflow = ""
        }

        // Update URL without triggering scroll
        history.pushState(null, null, targetId)
      }
    })
  })
}

function handleNavbarScroll() {
  const navbar = document.querySelector(".navbar")
  let lastScrollY = window.scrollY

  function updateNavbar() {
    const currentScrollY = window.scrollY

    // Add scrolled class for styling
    if (currentScrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }

    // Hide/show navbar on scroll (optional)
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      navbar.style.transform = "translateY(-100%)"
    } else {
      navbar.style.transform = "translateY(0)"
    }

    lastScrollY = currentScrollY
  }

  // Throttle scroll events for better performance
  let ticking = false
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNavbar()
        ticking = false
      })
      ticking = true
    }
  })
}

function setupScrollToTop() {
  const scrollButton = document.getElementById("scrollToTop")

  function toggleScrollButton() {
    if (window.scrollY > 500) {
      scrollButton.classList.add("visible")
    } else {
      scrollButton.classList.remove("visible")
    }
  }

  // Throttle scroll events
  let ticking = false
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        toggleScrollButton()
        ticking = false
      })
      ticking = true
    }
  })

  scrollButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })

    // Focus management
    document.querySelector("h1").focus()
  })
}

function animateChatPreview() {
  const messages = document.querySelectorAll(".message-preview")
  const typingIndicator = document.querySelector(".typing-indicator")

  // Перевірка наявності елементів перед анімацією
  if (messages.length === 0) return

  // Reset animations
  messages.forEach((msg) => {
    if (msg) {
      msg.style.opacity = "0"
      msg.style.transform = "translateX(-20px)"
    }
  })

  if (typingIndicator) {
    typingIndicator.style.opacity = "0"
  }

  // Animate messages with staggered timing
  messages.forEach((msg, index) => {
    if (!msg) return

    setTimeout(
      () => {
        msg.style.transition = "all 0.5s ease"
        msg.style.opacity = "1"
        msg.style.transform = "translateX(0)"
      },
      index * 800 + 500,
    )
  })

  // Show typing indicator
  if (typingIndicator) {
    setTimeout(
      () => {
        typingIndicator.style.transition = "opacity 0.3s ease"
        typingIndicator.style.opacity = "1"
      },
      messages.length * 800 + 1000,
    )
  }

  // Очистити попередній інтервал перед встановленням нового
  if (window.chatPreviewInterval) {
    clearTimeout(window.chatPreviewInterval)
  }

  // Restart animation cycle
  window.chatPreviewInterval = setTimeout(() => {
    animateChatPreview()
  }, 12000)
}

function setupScrollAnimations() {
  // Intersection Observer for scroll-triggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"

        // Add specific animations based on data attributes
        const animationType = entry.target.dataset.aos
        if (animationType) {
          entry.target.classList.add(`aos-${animationType}`)
        }
      }
    })
  }, observerOptions)

  // Observe elements with animation attributes
  const animatedElements = document.querySelectorAll("[data-aos]")
  animatedElements.forEach((element, index) => {
    // Set initial state
    element.style.opacity = "0"
    element.style.transform = getInitialTransform(element.dataset.aos)
    element.style.transition = `all 0.6s ease ${element.dataset.aosDelay || index * 100}ms`

    observer.observe(element)
  })
}

function getInitialTransform(animationType) {
  switch (animationType) {
    case "fade-up":
      return "translateY(30px)"
    case "slide-right":
      return "translateX(-30px)"
    case "slide-left":
      return "translateX(30px)"
    case "zoom-in":
      return "scale(0.8)"
    default:
      return "translateY(30px)"
  }
}

function setupNewsletterForm() {
  const form = document.getElementById("newsletterForm")

  if (!form) return

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(form)
    const email = formData.get("email")
    const submitButton = form.querySelector('button[type="submit"]')

    if (!submitButton) return

    const originalText = submitButton.textContent

    // Validate email
    if (!isValidEmail(email)) {
      showFormMessage("Please enter a valid email address", "error")
      return
    }

    // Update button state
    submitButton.textContent = "Subscribing..."
    submitButton.disabled = true

    try {
      // Спроба надіслати форму через fetch API
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          showFormMessage("Thank you for subscribing!", "success")
          form.reset()
        } else {
          showFormMessage(data.error || "Something went wrong", "error")
        }
      } else {
        showFormMessage("Server error. Please try again later.", "error")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      showFormMessage("Connection error. Please try again.", "error")
    } finally {
      submitButton.textContent = originalText
      submitButton.disabled = false
    }
  })
}

function setupButtonHandlers() {
  // Get Started buttons
  const getStartedButtons = document.querySelectorAll("#getStartedBtn, #launchBtn")

  getStartedButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      // Add click animation
      button.style.transform = "scale(0.95)"
      setTimeout(() => {
        button.style.transform = ""
      }, 150)

      // Navigate to login page
      // The href attribute handles the navigation
    })
  })

  // Demo links
  const demoLinks = document.querySelectorAll(".demo-link")
  demoLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // Add analytics tracking here if needed
      console.log(`Demo link clicked: ${link.textContent}`)
    })
  })
}

function setupVideoFallback() {
  const video = document.querySelector(".demo-preview")
  const fallback = document.getElementById("chatFallback")

  if (!video || !fallback) return

  // Показати fallback, якщо відео не завантажилось
  video.addEventListener("error", () => {
    console.log("Video failed to load, showing fallback")
    video.style.display = "none"
    fallback.style.display = "block"
    animateChatPreview()
  })

  // Перевірити, чи відео може відтворюватись
  video.addEventListener("loadeddata", () => {
    if (video.readyState >= 3) {
      // Достатньо даних для відтворення
      fallback.style.display = "none"
    } else {
      video.style.display = "none"
      fallback.style.display = "block"
      animateChatPreview()
    }
  })

  // Fallback, якщо відео не завантажилось протягом 3 секунд
  setTimeout(() => {
    if (video.readyState < 3) {
      video.style.display = "none"
      fallback.style.display = "block"
      animateChatPreview()
    }
  }, 3000)
}

function setupKeyboardNavigation() {
  // Enhanced keyboard navigation
  document.addEventListener("keydown", (e) => {
    // Skip to main content (accessibility)
    if (e.key === "Tab" && e.target === document.body) {
      const mainContent = document.querySelector("main") || document.querySelector(".hero")
      if (mainContent) {
        mainContent.focus()
      }
    }
  })
}

// Utility functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function showFormMessage(message, type) {
  // Знайти або створити елемент для повідомлення
  let messageEl = document.getElementById("formMessage")

  if (!messageEl) {
    messageEl = document.createElement("div")
    messageEl.id = "formMessage"
    messageEl.className = "form-message"

    const form = document.getElementById("newsletterForm")
    if (form) {
      const formNote = form.querySelector(".form-note")
      if (formNote) {
        form.insertBefore(messageEl, formNote)
      } else {
        form.appendChild(messageEl)
      }
    }
  }

  // Встановити текст і клас
  messageEl.textContent = message
  messageEl.className = `form-message ${type}`

  // Автоматично приховати через 5 секунд
  setTimeout(() => {
    if (messageEl && messageEl.parentNode) {
      messageEl.textContent = ""
      messageEl.className = "form-message"
    }
  }, 5000)
}

function announceToScreenReader(message) {
  // Create live region for screen reader announcements
  let liveRegion = document.getElementById("live-region")

  if (!liveRegion) {
    liveRegion = document.createElement("div")
    liveRegion.id = "live-region"
    liveRegion.setAttribute("aria-live", "polite")
    liveRegion.setAttribute("aria-atomic", "true")
    liveRegion.className = "visually-hidden"
    document.body.appendChild(liveRegion)
  }

  liveRegion.textContent = message
}

// Performance optimization: Lazy load images
function setupLazyLoading() {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove("lazy")
          imageObserver.unobserve(img)
        }
      })
    })

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img)
    })
  }
}

// Initialize lazy loading
setupLazyLoading()

// Service Worker registration (optional, for PWA features)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}

// Error handling for uncaught errors
window.addEventListener("error", (e) => {
  console.error("Uncaught error:", e.error)
  // You can add error reporting here
})

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason)
  // You can add error reporting here
})

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  // Clean up any intervals or observers
  if (window.chatPreviewInterval) {
    clearInterval(window.chatPreviewInterval)
  }
})

// Export functions for testing (optional)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    toggleTheme,
    isValidEmail,
    setupSmoothScrolling,
  }
}
