<?php
require_once 'includes/auth.php';
requireAdmin();

// Get statistics
$stmt = $pdo->prepare("SELECT COUNT(*) as total_users FROM users");
$stmt->execute();
$totalUsers = $stmt->fetch()['total_users'];

$stmt = $pdo->prepare("SELECT COUNT(*) as total_messages FROM messages");
$stmt->execute();
$totalMessages = $stmt->fetch()['total_messages'];

$stmt = $pdo->prepare("SELECT COUNT(*) as total_rooms FROM rooms");
$stmt->execute();
$totalRooms = $stmt->fetch()['total_rooms'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LiveRoom - Admin Panel</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="admin-container">
        <header class="admin-header">
            <h1>🛠️ Admin Panel</h1>
            <div class="header-actions">
                <button id="themeToggle" class="btn btn-icon">🌙</button>
                <a href="chat.php" class="btn btn-secondary">Back to Chat</a>
                <a href="api/logout.php" class="btn btn-danger">Logout</a>
            </div>
        </header>
        
        <div class="admin-stats">
            <div class="stat-card">
                <h3><?php echo $totalUsers; ?></h3>
                <p>Total Users</p>
            </div>
            <div class="stat-card">
                <h3><?php echo $totalMessages; ?></h3>
                <p>Total Messages</p>
            </div>
            <div class="stat-card">
                <h3><?php echo $totalRooms; ?></h3>
                <p>Total Rooms</p>
            </div>
        </div>
        
        <div class="admin-tabs">
            <button class="tab-btn active" onclick="showTab('users')">Users</button>
            <button class="tab-btn" onclick="showTab('messages')">Messages</button>
            <button class="tab-btn" onclick="showTab('rooms')">Rooms</button>
        </div>
        
        <div id="usersTab" class="admin-tab active">
            <h2>User Management</h2>
            <div id="usersList" class="admin-list"></div>
        </div>
        
        <div id="messagesTab" class="admin-tab">
            <h2>Message Management</h2>
            <div id="messagesList" class="admin-list"></div>
        </div>
        
        <div id="roomsTab" class="admin-tab">
            <h2>Room Management</h2>
            <div id="roomsList" class="admin-list"></div>
            <button class="btn btn-primary" onclick="showCreateRoomForm()">Create New Room</button>
        </div>
    </div>
    
    <script src="js/admin.js"></script>
</body>
</html>
