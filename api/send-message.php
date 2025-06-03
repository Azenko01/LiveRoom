<?php
require_once '../includes/auth.php';
require_once '../includes/utils.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$roomId = intval($_POST['room_id'] ?? 0);
$message = sanitizeInput($_POST['message'] ?? '');

if ($roomId <= 0 || empty($message)) {
    jsonResponse(['error' => 'Room ID and message are required'], 400);
}

if (strlen($message) > 500) {
    jsonResponse(['error' => 'Message too long (max 500 characters)'], 400);
}

// Verify room exists
$stmt = $pdo->prepare("SELECT id FROM rooms WHERE id = ?");
$stmt->execute([$roomId]);
if (!$stmt->fetch()) {
    jsonResponse(['error' => 'Room not found'], 404);
}

// Insert message
$stmt = $pdo->prepare("INSERT INTO messages (user_id, room_id, message) VALUES (?, ?, ?)");
try {
    $stmt->execute([$_SESSION['user_id'], $roomId, $message]);
    jsonResponse([
        'success' => true,
        'message' => 'Message sent successfully'
    ]);
} catch (PDOException $e) {
    jsonResponse(['error' => 'Failed to send message'], 500);
}
?>
