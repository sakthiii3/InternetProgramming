<?php
/**
 * UNIT III: PHP Database Connectivity
 * -----------------------------------
 * This file demonstrates: PHP variables, data types, and a reusable
 * MySQLi connection using error handling (try/catch around mysqli_report).
 * Every other PHP file in this project requires this file to get a $conn.
 */

// UNIT III: PHP variables and data types (string, int)
$DB_HOST = getenv('DB_HOST') ?: "localhost";   // string
$DB_USER = getenv('DB_USER') ?: "root";        // string  — change to your MySQL username
$DB_PASS = getenv('DB_PASS') !== false ? getenv('DB_PASS') : ""; // string  — change to your MySQL password
$DB_NAME = getenv('DB_NAME') ?: "ip_portal";   // string  — database created by database/database.sql
$DB_PORT = getenv('DB_PORT') ?: 3306;          // int

// Make mysqli throw exceptions instead of silent warnings, so we can try/catch below
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

/**
 * getDbConnection()
 * UNIT III: Functions — a reusable function that returns a ready mysqli connection.
 * UNIT II/III (shared concept): try/catch exception handling.
 */
function getDbConnection() {
    global $DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_PORT;
    try {
        $conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_PORT);
        $conn->set_charset("utf8mb4");
        return $conn;
    } catch (mysqli_sql_exception $e) {
        // Do not leak raw DB credentials/errors to the client — log conceptually, respond safely
        http_response_code(500);
        header("Content-Type: application/json");
        echo json_encode([
            "status"  => "error",
            "message" => "Database connection failed. Please verify MySQL is running and " .
                         "the 'ip_portal' database has been imported from database/database.sql.",
        ]);
        exit;
    }
}

/**
 * sanitizeInput()
 * UNIT III: Server-side validation / input sanitization helper used across all endpoints.
 */
function sanitizeInput($value) {
    $value = trim($value);
    $value = stripslashes($value);
    $value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    return $value;
}

/**
 * jsonResponse()
 * UNIT V: Small helper so every PHP endpoint returns consistent, well-formed JSON.
 */
function jsonResponse($statusCode, $payload) {
    http_response_code($statusCode);
    header("Content-Type: application/json");
    echo json_encode($payload);
    exit;
}
