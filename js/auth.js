// Authentication JavaScript
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")
  const authMessage = document.getElementById("authMessage")

  // Handle login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("loginUsername").value
    const password = document.getElementById("loginPassword").value

    try {
      const response = await fetch("api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      })

      const data = await response.json()

      if (data.success) {
        showMessage("Login successful! Redirecting...", "success")
        setTimeout(() => {
          window.location.href = "chat.php"
        }, 1000)
      } else {
        showMessage(data.error, "error")
      }
    } catch (error) {
      showMessage("Network error. Please try again.", "error")
    }
  })

  // Handle registration
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("regUsername").value
    const email = document.getElementById("regEmail").value
    const password = document.getElementById("regPassword").value
    const confirmPassword = document.getElementById("regConfirmPassword").value

    if (password !== confirmPassword) {
      showMessage("Passwords do not match", "error")
      return
    }

    try {
      const response = await fetch("api/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&confirmPassword=${encodeURIComponent(confirmPassword)}`,
      })

      const data = await response.json()

      if (data.success) {
        showMessage(data.message, "success")
        setTimeout(() => {
          showLogin()
        }, 2000)
      } else {
        showMessage(data.error, "error")
      }
    } catch (error) {
      showMessage("Network error. Please try again.", "error")
    }
  })
})

function showLogin() {
  document.getElementById("loginForm").classList.remove("hidden")
  document.getElementById("registerForm").classList.add("hidden")
  document.querySelectorAll(".tab-btn")[0].classList.add("active")
  document.querySelectorAll(".tab-btn")[1].classList.remove("active")
  clearMessage()
}

function showRegister() {
  document.getElementById("loginForm").classList.add("hidden")
  document.getElementById("registerForm").classList.remove("hidden")
  document.querySelectorAll(".tab-btn")[0].classList.remove("active")
  document.querySelectorAll(".tab-btn")[1].classList.add("active")
  clearMessage()
}

function showMessage(message, type) {
  const messageEl = document.getElementById("authMessage")
  messageEl.textContent = message
  messageEl.className = `message ${type}`
}

function clearMessage() {
  document.getElementById("authMessage").textContent = ""
  document.getElementById("authMessage").className = "message"
}
