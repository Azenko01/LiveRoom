<?php
require_once 'includes/auth.php';

// Redirect if already logged in
if (isLoggedIn()) {
    header('Location: chat.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LiveRoom - Real-Time Chat</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <h1>💬 LiveRoom</h1>
                <p>Real-time chat application</p>
            </div>
            
            <div class="auth-tabs">
                <button class="tab-btn active" onclick="showLogin()">Login</button>
                <button class="tab-btn" onclick="showRegister()">Register</button>
            </div>
            
            <!-- Login Form -->
            <form id="loginForm" class="auth-form">
                <div class="form-group">
                    <input type="text" id="loginUsername" placeholder="Username or Email" required>
                </div>
                <div class="form-group">
                    <input type="password" id="loginPassword" placeholder="Password" required>
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
            </form>
            
            <!-- Register Form -->
            <form id="registerForm" class="auth-form hidden">
                <div class="form-group">
                    <input type="text" id="regUsername" placeholder="Username" required>
                </div>
                <div class="form-group">
                    <input type="email" id="regEmail" placeholder="Email" required>
                </div>
                <div class="form-group">
                    <input type="password" id="regPassword" placeholder="Password" required>
                </div>
                <div class="form-group">
                    <input type="password" id="regConfirmPassword" placeholder="Confirm Password" required>
                </div>
                <button type="submit" class="btn btn-primary">Register</button>
            </form>
            
            <div id="authMessage" class="message"></div>
        </div>
    </div>
    
    <script src="js/auth.js"></script>
</body>
</html>
