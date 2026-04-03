<?php

require_once __DIR__ . '/../helpers/json.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/db.php';

//$userId = requireAuth();
$userId = 1;



$date = $_GET['date'] ?? null;

if (!$date) {
  jsonResponse([
    'success' => false,
    'message' => 'Datum fehlt',
  ], 422);
}

$stmt = $pdo->prepare("
    SELECT *
    FROM planner_entries
    WHERE user_id = :user_id
      AND entry_date = :entry_date
    ORDER BY entry_type ASC, sort_order ASC, start_time ASC, id ASC
");

$stmt->execute([
  'user_id' => $userId,
  'entry_date' => $date,
]);

$entries = $stmt->fetchAll();

jsonResponse([
  'success' => true,
  'entries' => $entries,
]);