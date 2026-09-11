<?php
/**
 * UNIT III: Server-Side Programming — Student Registration
 * ----------------------------------------------------------
 * Demonstrates: PHP variables/operators/if-else, form processing,
 * server-side validation with regular expressions, sessions, cookies,
 * and MySQL connectivity using PREPARED STATEMENTS.
 */

session_start(); // UNIT III: Sessions

require_once "db.php";

// Allow this endpoint to be called via fetch() from the same-origin front end
header("Access-Control-Allow-Origin: *");

// UNIT III: if/else — only accept POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    jsonResponse(405, ["status" => "error", "message" => "Only POST requests are allowed on this endpoint."]);
}

// ---------------------------------------------------------------------
// UNIT III: Form processing — reading submitted fields from $_POST
// ---------------------------------------------------------------------
$name     = isset($_POST["name"]) ? sanitizeInput($_POST["name"]) : "";
$email    = isset($_POST["email"]) ? sanitizeInput($_POST["email"]) : "";
$phone    = isset($_POST["phone"]) ? sanitizeInput($_POST["phone"]) : "";
$password = isset($_POST["password"]) ? $_POST["password"] : ""; // not sanitized before hashing on purpose
$age      = isset($_POST["age"]) ? (int) $_POST["age"] : null;   // UNIT III: type casting / operators
$dob      = isset($_POST["dob"]) ? sanitizeInput($_POST["dob"]) : "";
$gender   = isset($_POST["gender"]) ? sanitizeInput($_POST["gender"]) : "";
$course   = isset($_POST["course"]) ? sanitizeInput($_POST["course"]) : "";
$favcolor = isset($_POST["favcolor"]) ? sanitizeInput($_POST["favcolor"]) : "";
$notes    = isset($_POST["notes"]) ? sanitizeInput($_POST["notes"]) : "";

// UNIT III: Arrays — interests[] submitted as a PHP array automatically
$interests = isset($_POST["interests"]) && is_array($_POST["interests"])
    ? array_map("sanitizeInput", $_POST["interests"])
    : [];
$interestsString = implode(", ", $interests); // UNIT III: array function

// ---------------------------------------------------------------------
// UNIT III: Server-side validation using regular expressions (preg_match)
// ---------------------------------------------------------------------
$errors = []; // UNIT III: Arrays

if (strlen($name) < 3) {
    $errors[] = "Name must be at least 3 characters long.";
}
if (!preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/', $email)) {
    $errors[] = "Please provide a valid email address.";
}
if (!preg_match('/^\d{10}$/', $phone)) {
    $errors[] = "Phone number must be exactly 10 digits.";
}
if (strlen($password) < 8) {
    $errors[] = "Password must be at least 8 characters long.";
}
if (empty($dob)) {
    $errors[] = "Date of birth is required.";
}
if (!in_array($gender, ["Male", "Female", "Other"], true)) {
    $errors[] = "Please select a valid gender.";
}
if (empty($course)) {
    $errors[] = "Please select a course.";
}

// UNIT III: if/else branching on validation result
if (count($errors) > 0) {
    jsonResponse(422, [
        "status"  => "error",
        "message" => implode(" ", $errors),
        "errors"  => $errors,
    ]);
}

// ---------------------------------------------------------------------
// UNIT III: MySQL connectivity using a PREPARED STATEMENT (SQL injection safe)
// ---------------------------------------------------------------------
$conn = getDbConnection();

// Prevent duplicate email registrations — UNIT III: SELECT with prepared statement
$checkStmt = $conn->prepare("SELECT id FROM students WHERE email = ? LIMIT 1");
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    $checkStmt->close();
    $conn->close();
    jsonResponse(409, ["status" => "error", "message" => "This email is already registered."]);
}
$checkStmt->close();

// Hash the password before storing it — never store plain-text passwords
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$insertStmt = $conn->prepare(
    "INSERT INTO students (name, email, phone, password, age, course, gender, dob, interests, favcolor, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())"
);
$insertStmt->bind_param(
    "sssssssssss",
    $name,
    $email,
    $phone,
    $passwordHash,
    $age,
    $course,
    $gender,
    $dob,
    $interestsString,
    $favcolor,
    $notes
);

// UNIT III: try/catch style handling of the execute() result
if ($insertStmt->execute()) {
    $newId = $insertStmt->insert_id;

    // UNIT III: Sessions — remember the logged-in student for this server session
    $_SESSION["student_id"]   = $newId;
    $_SESSION["student_name"] = $name;

    // UNIT III: Cookies — a simple "remember me" cookie valid for 7 days
    setcookie("ip_portal_last_registered", $name, time() + (7 * 24 * 60 * 60), "/");

    jsonResponse(201, [
        "status"  => "success",
        "message" => "Registration successful! Welcome, {$name}. Your student ID is {$newId}.",
        "id"      => $newId,
    ]);
} else {
    jsonResponse(500, ["status" => "error", "message" => "Could not save registration. Please try again."]);
}

$insertStmt->close();
$conn->close();
