// Main chat application JavaScript
let currentRoomId = null
let lastMessageId = 0
let messagePollingInterval = null

document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  // Theme toggle
  const themeToggle = document.getElementById("themeToggle")
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme)
    loadTheme()
  }

  // Room selection
  const roomItems = document.querySelectorAll(".room-item")
  roomItems.forEach((item) => {
    item.addEventListener("click", () => selectRoom(item))
  })

  // Message form
  const messageForm = document.getElementById("messageForm")
  if (messageForm) {
    messageForm.addEventListener("submit", sendMessage)
  }

  // Auto-select first room if available
  if (roomItems.length > 0) {
    selectRoom(roomItems[0])
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark")
  const isDark = document.body.classList.contains("dark")
  localStorage.setItem("theme", isDark ? "dark" : "light")

  // Update theme toggle icon
  const themeToggle = document.getElementById("themeToggle")
  if (themeToggle) {
    themeToggle.textContent = isDark ? "☀️" : "🌙"
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark") {
    document.body.classList.add("dark")
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.textContent = "☀️"
    }
  }
}

function selectRoom(roomElement) {
  // Remove active class from all rooms
  document.querySelectorAll(".room-item").forEach((item) => {
    item.classList.remove("active")
  })

  // Add active class to selected room
  roomElement.classList.add("active")

  // Update current room
  currentRoomId = Number.parseInt(roomElement.dataset.roomId)
  const roomName = roomElement.querySelector(".room-name").textContent

  // Update UI
  document.getElementById("currentRoomName").textContent = roomName
  document.getElementById("currentRoomId").value = currentRoomId
  document.getElementById("messageForm").classList.remove("hidden")

  // Clear messages and reset
  document.getElementById("messagesContainer").innerHTML = ""
  lastMessageId = 0

  // Start polling for messages
  if (messagePollingInterval) {
    clearInterval(messagePollingInterval)
  }

  loadMessages()
  messagePollingInterval = setInterval(loadMessages, 2000) // Poll every 2 seconds
}

async function loadMessages() {
  if (!currentRoomId) return

  try {
    const response = await fetch(`api/get-messages.php?room_id=${currentRoomId}&last_id=${lastMessageId}`)
    const data = await response.json()

    if (data.success && data.messages.length > 0) {
      data.messages.forEach((message) => {
        displayMessage(message)
        lastMessageId = Math.max(lastMessageId, message.id)
      })

      // Auto-scroll to bottom
      scrollToBottom()
    }
  } catch (error) {
    console.error("Error loading messages:", error)
  }
}

function displayMessage(message) {
  const messagesContainer = document.getElementById("messagesContainer")

  const messageEl = document.createElement("div")
  messageEl.className = `message ${message.is_own ? "own" : ""}`
  messageEl.dataset.messageId = message.id

  messageEl.innerHTML = `
        <div class="message-header">
            <span class="message-username">${escapeHtml(message.username)}</span>
            <span class="message-time">${message.time_ago}</span>
        </div>
        <div class="message-content">${escapeHtml(message.message)}</div>
        <div class="message-actions">
            <button class="like-btn ${message.user_liked ? "liked" : ""}" onclick="toggleLike(${message.id}, this)">
                ❤️ ${message.likes_count}
            </button>
        </div>
    `

  messagesContainer.appendChild(messageEl)
}

async function sendMessage(e) {
  e.preventDefault()

  const messageInput = document.getElementById("messageInput")
  const message = messageInput.value.trim()

  if (!message || !currentRoomId) return

  try {
    const response = await fetch("api/send-message.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `room_id=${currentRoomId}&message=${encodeURIComponent(message)}`,
    })

    const data = await response.json()

    if (data.success) {
      messageInput.value = ""
      // Message will appear via polling
    } else {
      alert(data.error || "Failed to send message")
    }
  } catch (error) {
    console.error("Error sending message:", error)
    alert("Network error. Please try again.")
  }
}

async function toggleLike(messageId, buttonElement) {
  try {
    const response = await fetch("api/like.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `message_id=${messageId}`,
    })

    const data = await response.json()

    if (data.success) {
      buttonElement.textContent = `❤️ ${data.likes_count}`
      buttonElement.classList.toggle("liked", data.action === "liked")
    } else {
      alert(data.error || "Failed to update like")
    }
  } catch (error) {
    console.error("Error toggling like:", error)
  }
}

function scrollToBottom() {
  const messagesContainer = document.getElementById("messagesContainer")
  messagesContainer.scrollTop = messagesContainer.scrollHeight
}

function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (messagePollingInterval) {
    clearInterval(messagePollingInterval)
  }
})
