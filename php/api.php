<?php
/**
 * UNIT V: Web Services — a small REST-style JSON API
 * -----------------------------------------------------
 * GET /php/api.php?resource=students|courses|quiz_results
 * Demonstrates: PHP arrays, loops, functions, and returning structured JSON
 * from a MySQL-backed resource — the "web service" the syllabus refers to.
 */

require_once "db.php";
header("Access-Control-Allow-Origin: *");

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    jsonResponse(405, ["status" => "error", "message" => "Only GET requests are allowed."]);
}

$resource = isset($_GET["resource"]) ? sanitizeInput($_GET["resource"]) : "";

// UNIT III: PHP arrays — the set of resources this API is willing to serve
$allowedResources = ["students", "courses", "quiz_results"];

// UNIT III: if/else validation
if (!in_array($resource, $allowedResources, true)) {
    jsonResponse(400, [
        "status"  => "error",
        "message" => "Unknown resource. Allowed values: " . implode(", ", $allowedResources),
    ]);
}

$conn = getDbConnection();
$data = [];

// UNIT III: switch/if — branch behaviour per requested resource
if ($resource === "students") {
    $stmt = $conn->prepare("SELECT id, name, email, course, gender, created_at FROM students ORDER BY id DESC LIMIT 50");
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    $stmt->close();

} elseif ($resource === "quiz_results") {
    $stmt = $conn->prepare("SELECT id, student_name, score, total_questions, created_at FROM quiz_results ORDER BY id DESC LIMIT 50");
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        // UNIT III: operators — compute percentage on the fly
        $row["percentage"] = $row["total_questions"] > 0
            ? round(($row["score"] / $row["total_questions"]) * 100, 1)
            : 0;
        $data[] = $row;
    }
    $stmt->close();

} elseif ($resource === "courses") {
    // UNIT IV bridge: courses are authoritative in xml/courses.xml.
    // Here we parse that same XML server-side with PHP's DOM extension,
    // so the "web service" and the "XML feed" stay perfectly in sync.
    $xmlPath = __DIR__ . "/../xml/courses.xml";
    if (file_exists($xmlPath)) {
        $dom = new DOMDocument();
        $dom->load($xmlPath); // UNIT IV: PHP DOM parsing of XML
        foreach ($dom->getElementsByTagName("course") as $courseNode) {
            $data[] = [
                "id"         => $courseNode->getAttribute("id"),
                "level"      => $courseNode->getAttribute("level"),
                "title"      => $courseNode->getElementsByTagName("title")->item(0)->nodeValue ?? "",
                "duration"   => $courseNode->getElementsByTagName("duration")->item(0)->nodeValue ?? "",
                "instructor" => $courseNode->getElementsByTagName("instructor")->item(0)->nodeValue ?? "",
            ];
        }
    }
}

$conn->close();

jsonResponse(200, [
    "status"   => "success",
    "resource" => $resource,
    "count"    => count($data),
    "data"     => $data,
]);
