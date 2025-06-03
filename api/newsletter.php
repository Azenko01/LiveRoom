<?php
require_once '../includes/db.php';
require_once '../includes/utils.php';

header('Content-Type: application/json');

// Перевірка методу запиту
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Method not allowed']);
    http_response_code(405);
    exit;
}

$email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';

// Валідація
if (empty($email)) {
    echo json_encode(['error' => 'Email is required']);
    http_response_code(400);
    exit;
}

if (!validateEmail($email)) {
    echo json_encode(['error' => 'Invalid email format']);
    http_response_code(400);
    exit;
}

try {
    // Перевірка, чи існує таблиця
    $tableCheck = $pdo->query("SHOW TABLES LIKE 'newsletter_subscribers'");
    if ($tableCheck->rowCount() == 0) {
        // Створення таблиці, якщо вона не існує
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS newsletter_subscribers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                unsubscribed_at TIMESTAMP NULL,
                is_active BOOLEAN DEFAULT TRUE
            );
            CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
            CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active);
        ");
    }

    // Перевірка, чи email вже існує
    $stmt = $pdo->prepare("SELECT id FROM newsletter_subscribers WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(['error' => 'Email already subscribed']);
        http_response_code(409);
        exit;
    }

    // Додавання до розсилки
    $stmt = $pdo->prepare("INSERT INTO newsletter_subscribers (email) VALUES (?)");
    $stmt->execute([$email]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Successfully subscribed to newsletter!'
    ]);
    http_response_code(200);
    
} catch (PDOException $e) {
    // Запис помилки в лог
    error_log("Newsletter subscription error: " . $e->getMessage());
    
    echo json_encode(['error' => 'Subscription failed. Please try again later.']);
    http_response_code(500);
}
?>
