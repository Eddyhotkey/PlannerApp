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

$allowedFields = [
  'title',
  'category',
  'entry_date',
  'start_time',
  'end_time',
  'is_completed',
  'priority',
  'sort_order',
];

$setParts = [];
$params = ['id' => $id];

foreach ($allowedFields as $field) {
  if (array_key_exists($field, $data)) {
    $setParts[] = "$field = :$field";
    $params[$field] = $data[$field];
  }
}

if (empty($setParts)) {
  jsonResponse([
    'success' => false,
    'message' => 'Keine Daten zum Aktualisieren',
  ], 422);
}

$sql = "UPDATE planner_entries SET " . implode(', ', $setParts) . " WHERE id = :id";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

jsonResponse([
  'success' => true,
  'message' => 'Eintrag wurde aktualisiert',
]);