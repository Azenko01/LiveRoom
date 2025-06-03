// Auto-scroll functionality for chat messages
class AutoScroll {
  constructor(container) {
    this.container = container
    this.isUserScrolling = false
    this.scrollTimeout = null

    this.init()
  }

  init() {
    if (!this.container) return

    // Detect user scrolling
    this.container.addEventListener("scroll", () => {
      this.handleScroll()
    })

    // Observe for new messages
    this.observer = new MutationObserver(() => {
      this.handleNewContent()
    })

    this.observer.observe(this.container, {
      childList: true,
      subtree: true,
    })
  }

  handleScroll() {
    // Clear existing timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout)
    }

    // Check if user is near bottom
    const { scrollTop, scrollHeight, clientHeight } = this.container
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100

    if (!isNearBottom) {
      this.isUserScrolling = true
    }

    // Reset user scrolling flag after a delay
    this.scrollTimeout = setTimeout(() => {
      this.isUserScrolling = false
    }, 1000)
  }

  handleNewContent() {
    // Only auto-scroll if user isn't manually scrolling
    if (!this.isUserScrolling) {
      this.scrollToBottom()
    }
  }

  scrollToBottom(smooth = true) {
    if (!this.container) return

    this.container.scrollTo({
      top: this.container.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    })
  }

  forceScrollToBottom() {
    this.isUserScrolling = false
    this.scrollToBottom()
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout)
    }
  }
}

// Initialize auto-scroll when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const messagesContainer = document.getElementById("messagesContainer")
  if (messagesContainer) {
    window.chatAutoScroll = new AutoScroll(messagesContainer)
  }
})

// Export for use in other scripts
window.AutoScroll = AutoScroll
