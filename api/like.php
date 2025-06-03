<?php
require_once '../includes/auth.php';
require_once '../includes/utils.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$messageId = intval($_POST['message_id'] ?? 0);

if ($messageId <= 0) {
    jsonResponse(['error' => 'Message ID is required'], 400);
}

// Check if message exists
$stmt = $pdo->prepare("SELECT id FROM messages WHERE id = ?");
$stmt->execute([$messageId]);
if (!$stmt->fetch()) {
    jsonResponse(['error' => 'Message not found'], 404);
}

// Check if user already liked this message
$stmt = $pdo->prepare("SELECT id FROM message_likes WHERE message_id = ? AND user_id = ?");
$stmt->execute([$messageId, $_SESSION['user_id']]);
$existingLike = $stmt->fetch();

try {
    if ($existingLike) {
        // Unlike
        $stmt = $pdo->prepare("DELETE FROM message_likes WHERE message_id = ? AND user_id = ?");
        $stmt->execute([$messageId, $_SESSION['user_id']]);
        $action = 'unliked';
    } else {
        // Like
        $stmt = $pdo->prepare("INSERT INTO message_likes (message_id, user_id) VALUES (?, ?)");
        $stmt->execute([$messageId, $_SESSION['user_id']]);
        $action = 'liked';
    }
    
    // Get updated like count
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM message_likes WHERE message_id = ?");
    $stmt->execute([$messageId]);
    $likeCount = $stmt->fetch()['count'];
    
    jsonResponse([
        'success' => true,
        'action' => $action,
        'likes_count' => intval($likeCount)
    ]);
} catch (PDOException $e) {
    jsonResponse(['error' => 'Failed to update like'], 500);
}
?>
