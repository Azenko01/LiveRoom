<?php
require_once '../includes/auth.php';
require_once '../includes/utils.php';
requireLogin();

$roomId = intval($_GET['room_id'] ?? 0);
$lastMessageId = intval($_GET['last_id'] ?? 0);

if ($roomId <= 0) {
    jsonResponse(['error' => 'Room ID is required'], 400);
}

// Get messages newer than last_id
$sql = "SELECT m.*, u.username, 
               (SELECT COUNT(*) FROM message_likes ml WHERE ml.message_id = m.id) as likes_count,
               (SELECT COUNT(*) FROM message_likes ml WHERE ml.message_id = m.id AND ml.user_id = ?) as user_liked
        FROM messages m 
        JOIN users u ON m.user_id = u.id 
        WHERE m.room_id = ? AND m.id > ?
        ORDER BY m.created_at ASC 
        LIMIT 50";

$stmt = $pdo->prepare($sql);
$stmt->execute([$_SESSION['user_id'], $roomId, $lastMessageId]);
$messages = $stmt->fetchAll();

// Format messages
$formattedMessages = array_map(function($msg) {
    return [
        'id' => $msg['id'],
        'username' => $msg['username'],
        'message' => $msg['message'],
        'likes_count' => intval($msg['likes_count']),
        'user_liked' => intval($msg['user_liked']) > 0,
        'created_at' => $msg['created_at'],
        'time_ago' => timeAgo($msg['created_at']),
        'is_own' => $msg['user_id'] == $_SESSION['user_id']
    ];
}, $messages);

jsonResponse([
    'success' => true,
    'messages' => $formattedMessages
]);
?>
