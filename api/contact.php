<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
    exit();
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    $data = $_POST;
}

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$subject = trim($data['subject'] ?? 'New Message from Portfolio');
$message = trim($data['message'] ?? '');

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please fill in all required fields (name, email, message).']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please provide a valid email address.']);
    exit();
}

$submission = [
    'id' => uniqid('msg_', true),
    'timestamp' => date('c'),
    'name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
    'email' => htmlspecialchars($email, ENT_QUOTES, 'UTF-8'),
    'subject' => htmlspecialchars($subject, ENT_QUOTES, 'UTF-8'),
    'message' => htmlspecialchars($message, ENT_QUOTES, 'UTF-8'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'
];

$dataFile = __DIR__ . '/../data/messages.json';
$existingMessages = [];

if (file_exists($dataFile)) {
    $fileContent = file_get_contents($dataFile);
    $decoded = json_decode($fileContent, true);
    if (is_array($decoded)) {
        $existingMessages = $decoded;
    }
}

array_unshift($existingMessages, $submission);

file_put_contents($dataFile, json_encode($existingMessages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode([
    'success' => true,
    'message' => "Thank you, {$name}! Your message has been received. Deepan will get back to you shortly."
]);
?>
