<?php
require_once 'includes/auth.php';
require_once 'includes/utils.php';
requireLogin();

$user = getCurrentUser();

// Get available rooms
$stmt = $pdo->prepare("SELECT * FROM rooms ORDER BY name");
$stmt->execute();
$rooms = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LiveRoom - Chat</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="chat-container">
        <!-- Header -->
        <header class="chat-header">
            <div class="header-left">
                <h1>💬 LiveRoom</h1>
                <span class="user-info">Welcome, <?php echo htmlspecialchars($user['username']); ?>!</span>
            </div>
            <div class="header-right">
                <button id="themeToggle" class="btn btn-icon">🌙</button>
                <?php if (isAdmin()): ?>
                    <a href="admin.php" class="btn btn-secondary">Admin</a>
                <?php endif; ?>
                <a href="api/logout.php" class="btn btn-danger">Logout</a>
            </div>
        </header>
        
        <div class="chat-main">
            <!-- Sidebar -->
            <aside class="chat-sidebar">
                <h3>Rooms</h3>
                <div class="rooms-list">
                    <?php foreach ($rooms as $room): ?>
                        <div class="room-item" data-room-id="<?php echo $room['id']; ?>" data-room-slug="<?php echo $room['slug']; ?>">
                            <span class="room-name"><?php echo htmlspecialchars($room['name']); ?></span>
                            <span class="room-description"><?php echo htmlspecialchars($room['description']); ?></span>
                        </div>
                    <?php endforeach; ?>
                </div>
            </aside>
            
            <!-- Chat Area -->
            <main class="chat-content">
                <div class="chat-room-header">
                    <h2 id="currentRoomName">Select a room to start chatting</h2>
                </div>
                
                <div id="messagesContainer" class="messages-container">
                    <div class="welcome-message">
                        <h3>Welcome to LiveRoom! 🎉</h3>
                        <p>Select a room from the sidebar to start chatting.</p>
                    </div>
                </div>
                
                <form id="messageForm" class="message-form hidden">
                    <input type="hidden" id="currentRoomId" value="">
                    <div class="message-input-container">
                        <input type="text" id="messageInput" placeholder="Type your message..." maxlength="500">
                        <button type="submit" class="btn btn-primary">Send</button>
                    </div>
                </form>
            </main>
        </div>
    </div>
    
    <script src="js/app.js"></script>
    <script src="js/autoscroll.js"></script>
</body>
</html>
