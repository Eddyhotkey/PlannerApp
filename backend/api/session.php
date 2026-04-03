<?php

require_once __DIR__ . '/../helpers/json.php';

session_start();

jsonResponse([
  'success' => true,
  'isLoggedIn' => !empty($_SESSION['user_id']),
  'user_id' => $_SESSION['user_id'] ?? null,
]);