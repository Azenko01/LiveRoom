<?php
require_once '../includes/db.php';
require_once '../includes/utils.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$username = sanitizeInput($_POST['username'] ?? '');
$email = sanitizeInput($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';

// Validation
if (empty($username) || empty($email) || empty($password)) {
    jsonResponse(['error' => 'All fields are required'], 400);
}

if (!validateEmail($email)) {
    jsonResponse(['error' => 'Invalid email format'], 400);
}

if (strlen($password) < 6) {
    jsonResponse(['error' => 'Password must be at least 6 characters'], 400);
}

if ($password !== $confirmPassword) {
    jsonResponse(['error' => 'Passwords do not match'], 400);
}

// Check if username or email already exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
$stmt->execute([$username, $email]);
if ($stmt->fetch()) {
    jsonResponse(['error' => 'Username or email already exists'], 409);
}

// Create user
$passwordHash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");

try {
    $stmt->execute([$username, $email, $passwordHash]);
    jsonResponse([
        'success' => true,
        'message' => 'Registration successful! You can now login.'
    ]);
} catch (PDOException $e) {
    jsonResponse(['error' => 'Registration failed'], 500);
}
?>
