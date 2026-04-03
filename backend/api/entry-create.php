<?php

require_once __DIR__ . '/../helpers/json.php';
require_once __DIR__ . '/../config/db.php';

$data = getJsonInput();

$title = trim($data['title'] ?? '');
$entryType = $data['entry_type'] ?? '';
$category = $data['category'] ?? null;
$entryDate = $data['entry_date'] ?? '';
$startTime = $data['start_time'] ?? null;
$endTime = $data['end_time'] ?? null;
$isCompleted = (int) ($data['is_completed'] ?? 0);
$priority = $data['priority'] ?? 'medium';
$sortOrder = (int) ($data['sort_order'] ?? 0);

// Für den Start fest auf User 1
$userId = 1;

if ($title === '' || $entryType === '' || $entryDate === '') {
  jsonResponse([
    'success' => false,
    'message' => 'Pflichtfelder fehlen',
  ], 422);
}

$stmt = $pdo->prepare("
    INSERT INTO planner_entries (
        user_id,
        entry_type,
        title,
        category,
        entry_date,
        start_time,
        end_time,
        is_completed,
        priority,
        sort_order
    ) VALUES (
        :user_id,
        :entry_type,
        :title,
        :category,
        :entry_date,
        :start_time,
        :end_time,
        :is_completed,
        :priority,
        :sort_order
    )
");

$stmt->execute([
  'user_id' => $userId,
  'entry_type' => $entryType,
  'title' => $title,
  'category' => $category,
  'entry_date' => $entryDate,
  'start_time' => $startTime,
  'end_time' => $endTime,
  'is_completed' => $isCompleted,
  'priority' => $priority,
  'sort_order' => $sortOrder,
]);

jsonResponse([
  'success' => true,
  'id' => (int) $pdo->lastInsertId(),
  'message' => 'Eintrag wurde erstellt',
], 201);