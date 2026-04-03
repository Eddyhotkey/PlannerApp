<?php

session_start();

function requireAuth(): int
{
  if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
      'success' => false,
      'message' => 'Nicht eingeloggt',
    ]);
    exit;
  }

  return (int) $_SESSION['user_id'];
}