<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataFile = __DIR__ . '/comments.json';

// GET: fetch all comments
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        echo file_get_contents($dataFile);
    } else {
        echo '[]';
    }
    exit;
}

// POST: add a new comment
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $name    = trim($input['name'] ?? '');
    $role    = trim($input['role'] ?? '');
    $company = trim($input['company'] ?? '');
    $message = trim($input['message'] ?? '');
    $rating  = min(5, max(1, intval($input['rating'] ?? 5)));

    if (!$name || !$message) {
        http_response_code(400);
        echo json_encode(['error' => 'Name and message are required']);
        exit;
    }

    $comments = [];
    if (file_exists($dataFile)) {
        $comments = json_decode(file_get_contents($dataFile), true) ?? [];
    }

    $new = [
        'id'       => uniqid(),
        'name'     => htmlspecialchars($name),
        'role'     => htmlspecialchars($role ?: 'Cliente'),
        'company'  => htmlspecialchars($company ?: ''),
        'message'  => htmlspecialchars($message),
        'rating'   => $rating,
        'initials' => strtoupper(substr($name, 0, 2)),
        'created'  => date('Y-m-d H:i:s'),
    ];

    $comments[] = $new;
    file_put_contents($dataFile, json_encode($comments, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    http_response_code(201);
    echo json_encode($new);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
