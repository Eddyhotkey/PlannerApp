<?php

require_once __DIR__ . '/../helpers/json.php';
require_once __DIR__ . '/../config/db.php';

$data = getJsonInput();
$id = (int) ($data['id'] ?? 0);

if ($id <= 0) {
  jsonResponse([
    'success' => false,
    'message' => 'Ungültige ID',
  ], 422);
}

$stmt = $pdo->prepare("DELETE FROM planner_entries WHERE id = :id");
$stmt->execute([
  'id' => $id,
]);

jsonResponse([
  'success' => true,
  'message' => 'Eintrag wurde gelöscht',
]);