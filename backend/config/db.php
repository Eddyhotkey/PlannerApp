<?php

$host = 'w01bd6fb.kasserver.com';
$dbname = 'd046ab32';
$username = 'd046ab32';
$password = 'ABUXZObhxKo+bJ*pG#o2';

try {
  $pdo = new PDO(
    "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
    $username,
    $password,
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
  );
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'message' => 'Datenbankverbindung fehlgeschlagen',
  ]);
  exit;
}