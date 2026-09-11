<?php
/**
 * UNIT V: AJAX / Web Services — Database-driven search
 * -------------------------------------------------------
 * Called from js/script.js via both XMLHttpRequest and fetch().
 * Accepts ?term=... over GET, searches the `students` table, returns JSON.
 */

require_once "db.php";
header("Access-Control-Allow-Origin: *");

// UNIT III: if/else — only accept GET
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    jsonResponse(405, ["status" => "error", "message" => "Only GET requests are allowed."]);
}

$term = isset($_GET["term"]) ? sanitizeInput($_GET["term"]) : "";

$conn = getDbConnection();

$results = []; // UNIT III: array to accumulate matched rows

if ($term === "") {
    // UNIT III: no filter — return every record (used by the "Show all records" button)
    $stmt = $conn->prepare("SELECT name, email, course, created_at FROM students ORDER BY created_at DESC");
    $stmt->execute();
} else {
    // UNIT III: prepared statement with LIKE wildcard search across three columns
    $likeTerm = "%" . $term . "%";
    $stmt = $conn->prepare(
        "SELECT name, email, course, created_at FROM students
         WHERE name LIKE ? OR email LIKE ? OR course LIKE ?
         ORDER BY created_at DESC"
    );
    $stmt->bind_param("sss", $likeTerm, $likeTerm, $likeTerm);
    $stmt->execute();
}

$result = $stmt->get_result();
while ($row = $result->fetch_assoc()) { // UNIT III: loop — while loop over result set
    $results[] = $row;
}

jsonResponse(200, [
    "status"  => "success",
    "term"    => $term,
    "count"   => count($results),
    "results" => $results,
]);

$stmt->close();
$conn->close();
