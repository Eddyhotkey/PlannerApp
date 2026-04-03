<?php

$allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.0.198:5173',
  'https://planner.bairamov.de'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins, true)) {
  header("Access-Control-Allow-Origin: $origin");
}

header('Vary: Origin');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

function getJsonInput(): array
{
  $input = file_get_contents('php://input');
  return $input ? json_decode($input, true) ?? [] : [];
}

function jsonResponse(array $data, int $statusCode = 200): void
{
  http_response_code($statusCode);
  echo json_encode($data);
  exit;
}