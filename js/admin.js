// Admin panel JavaScript
document.addEventListener("DOMContentLoaded", () => {
  initializeAdmin()
  loadUsers()
})

function initializeAdmin() {
  // Theme toggle
  const themeToggle = document.getElementById("themeToggle")
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme)
    loadTheme()
  }

  // Load initial data
  loadUsers()
}

function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.classList.remove("active")
  })

  // Remove active class from all tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active")
  })

  // Show selected tab
  document.getElementById(tabName + "Tab").classList.add("active")
  event.target.classList.add("active")

  // Load data for the selected tab
  switch (tabName) {
    case "users":
      loadUsers()
      break
    case "messages":
      loadMessages()
      break
    case "rooms":
      loadRooms()
      break
  }
}

async function loadUsers() {
  try {
    const response = await fetch("api/admin/get-users.php")
    const data = await response.json()

    if (data.success) {
      displayUsers(data.users)
    }
  } catch (error) {
    console.error("Error loading users:", error)
  }
}

async function loadMessages() {
  try {
    const response = await fetch("api/admin/get-messages.php")
    const data = await response.json()

    if (data.success) {
      displayMessages(data.messages)
    }
  } catch (error) {
    console.error("Error loading messages:", error)
  }
}

async function loadRooms() {
  try {
    const response = await fetch("api/admin/get-rooms.php")
    const data = await response.json()

    if (data.success) {
      displayRooms(data.rooms)
    }
  } catch (error) {
    console.error("Error loading rooms:", error)
  }
}

function displayUsers(users) {
  const container = document.getElementById("usersList")
  container.innerHTML = ""

  users.forEach((user) => {
    const userEl = document.createElement("div")
    userEl.className = "list-item"
    userEl.innerHTML = `
            <div>
                <strong>${escapeHtml(user.username)}</strong>
                <br>
                <small>${escapeHtml(user.email)} • ${user.role} • Joined ${user.created_at}</small>
            </div>
            <div class="item-actions">
                <button class="btn btn-${user.is_blocked ? "success" : "warning"}" 
                        onclick="toggleUserBlock(${user.id}, ${user.is_blocked})">
                    ${user.is_blocked ? "Unblock" : "Block"}
                </button>
            </div>
        `
    container.appendChild(userEl)
  })
}

function displayMessages(messages) {
  const container = document.getElementById("messagesList")
  container.innerHTML = ""

  messages.forEach((message) => {
    const messageEl = document.createElement("div")
    messageEl.className = "list-item"
    messageEl.innerHTML = `
            <div>
                <strong>${escapeHtml(message.username)}</strong> in <em>${escapeHtml(message.room_name)}</em>
                <br>
                <span>${escapeHtml(message.message)}</span>
                <br>
                <small>${message.created_at} • ${message.likes_count} likes</small>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger" onclick="deleteMessage(${message.id})">
                    Delete
                </button>
            </div>
        `
    container.appendChild(messageEl)
  })
}

function displayRooms(rooms) {
  const container = document.getElementById("roomsList")
  container.innerHTML = ""

  rooms.forEach((room) => {
    const roomEl = document.createElement("div")
    roomEl.className = "list-item"
    roomEl.innerHTML = `
            <div>
                <strong>${escapeHtml(room.name)}</strong>
                <br>
                <span>${escapeHtml(room.description)}</span>
                <br>
                <small>Created ${room.created_at} • ${room.message_count} messages</small>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger" onclick="deleteRoom(${room.id})">
                    Delete
                </button>
            </div>
        `
    container.appendChild(roomEl)
  })
}

async function toggleUserBlock(userId, isBlocked) {
  try {
    const response = await fetch("api/admin/toggle-user-block.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `user_id=${userId}&action=${isBlocked ? "unblock" : "block"}`,
    })

    const data = await response.json()

    if (data.success) {
      loadUsers() // Reload users list
    } else {
      alert(data.error || "Failed to update user status")
    }
  } catch (error) {
    console.error("Error toggling user block:", error)
  }
}

async function deleteMessage(messageId) {
  if (!confirm("Are you sure you want to delete this message?")) {
    return
  }

  try {
    const response = await fetch("api/admin/delete-message.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `message_id=${messageId}`,
    })

    const data = await response.json()

    if (data.success) {
      loadMessages() // Reload messages list
    } else {
      alert(data.error || "Failed to delete message")
    }
  } catch (error) {
    console.error("Error deleting message:", error)
  }
}

async function deleteRoom(roomId) {
  if (!confirm("Are you sure you want to delete this room? All messages in this room will be deleted.")) {
    return
  }

  try {
    const response = await fetch("api/admin/delete-room.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `room_id=${roomId}`,
    })

    const data = await response.json()

    if (data.success) {
      loadRooms() // Reload rooms list
    } else {
      alert(data.error || "Failed to delete room")
    }
  } catch (error) {
    console.error("Error deleting room:", error)
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark")
  const isDark = document.body.classList.contains("dark")
  localStorage.setItem("theme", isDark ? "dark" : "light")

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

function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}
