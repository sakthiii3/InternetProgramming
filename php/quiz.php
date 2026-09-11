<?php
/**
 * UNIT III / V: Quiz Result Storage
 * ----------------------------------
 * Receives a JSON payload from the front-end quiz (Activity 4), validates it,
 * and stores the score in the MySQL `quiz_results` table using a prepared statement.
 */

require_once "db.php";
header("Access-Control-Allow-Origin: *");

// UNIT III: if/else — only accept POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    jsonResponse(405, ["status" => "error", "message" => "Only POST requests are allowed."]);
}

// UNIT V: reading a raw JSON request body (the client sent JSON, not form-encoded data)
$rawBody = file_get_contents("php://input");
$data = json_decode($rawBody, true); // UNIT IV/V: JSON decoding in PHP

if (!is_array($data)) {
    jsonResponse(400, ["status" => "error", "message" => "Invalid or missing JSON body."]);
}

$studentName    = isset($data["student_name"]) ? sanitizeInput($data["student_name"]) : "";
$score          = isset($data["score"]) ? (int) $data["score"] : -1;
$totalQuestions = isset($data["total_questions"]) ? (int) $data["total_questions"] : 0;

// UNIT III: server-side validation
$errors = [];
if (strlen($studentName) < 2) {
    $errors[] = "Student name is required.";
}
if ($score < 0 || $totalQuestions <= 0 || $score > $totalQuestions) {
    $errors[] = "Score values are invalid.";
}

if (count($errors) > 0) {
    jsonResponse(422, ["status" => "error", "message" => implode(" ", $errors)]);
}

$conn = getDbConnection();

$stmt = $conn->prepare(
    "INSERT INTO quiz_results (student_name, score, total_questions, created_at) VALUES (?, ?, ?, NOW())"
);
$stmt->bind_param("sii", $studentName, $score, $totalQuestions);

if ($stmt->execute()) {
    $percentage = round(($score / $totalQuestions) * 100, 2); // UNIT III: operators (arithmetic)
    jsonResponse(201, [
        "status"     => "success",
        "message"    => "Quiz result saved.",
        "id"         => $stmt->insert_id,
        "percentage" => $percentage,
    ]);
} else {
    jsonResponse(500, ["status" => "error", "message" => "Could not save quiz result."]);
}

$stmt->close();
$conn->close();
