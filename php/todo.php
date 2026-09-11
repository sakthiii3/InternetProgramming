<?php
require_once 'db.php';
$conn = getDbConnection();

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $conn->prepare("SELECT id, task, completed FROM todos ORDER BY id DESC");
    $stmt->execute();
    $result = $stmt->get_result();
    $todos = [];
    while ($row = $result->fetch_assoc()) {
        $todos[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $todos]);
    exit;
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['task']) || empty(trim($data['task']))) {
        jsonResponse(400, ["status" => "error", "message" => "Task cannot be empty."]);
    }
    $task = sanitizeInput($data['task']);
    $stmt = $conn->prepare("INSERT INTO todos (task, completed) VALUES (?, 0)");
    $stmt->bind_param("s", $task);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "id" => $conn->insert_id]);
    } else {
        jsonResponse(500, ["status" => "error", "message" => "Failed to add task."]);
    }
    exit;
} elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id']) || !isset($data['completed'])) {
        jsonResponse(400, ["status" => "error", "message" => "Invalid request."]);
    }
    $id = (int) $data['id'];
    $completed = (int) $data['completed'];
    $stmt = $conn->prepare("UPDATE todos SET completed = ? WHERE id = ?");
    $stmt->bind_param("ii", $completed, $id);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        jsonResponse(500, ["status" => "error", "message" => "Failed to update task."]);
    }
    exit;
} elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id'])) {
         jsonResponse(400, ["status" => "error", "message" => "Invalid request."]);
    }
    $id = (int) $data['id'];
    $stmt = $conn->prepare("DELETE FROM todos WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        jsonResponse(500, ["status" => "error", "message" => "Failed to delete task."]);
    }
    exit;
} else {
    jsonResponse(405, ["status" => "error", "message" => "Method not allowed."]);
}
?>
