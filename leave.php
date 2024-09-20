<?php
// The name we want to remove
$json = file_get_contents('php://input');

// Decode the JSON data into a PHP array
$data = json_decode($json, true);

// Extract title and name from the data
$title = isset($data['title']) ? $data['title'] : null;
$name = isset($data['name']) ? $data['name'] : null;

// Define the file path
$filePath = __DIR__ . "/" . $title . ".txt";

// Read the file contents into an array of lines
if (file_exists($filePath)) {
    $fileContents = file($filePath, FILE_IGNORE_NEW_LINES); // Read file into array, ignoring new lines

    // Find the index of the name in the file
    $nameIndex = array_search($name, $fileContents);

    if ($nameIndex !== false) {
        // Calculate the starting point for removal (2 lines above the name)
        $startRemoveIndex = max(0, $nameIndex - 2); // Ensure we don't go below 0

        // Remove the name and the 2 lines above it
        for ($i = $startRemoveIndex; $i <= $nameIndex; $i++) {
            unset($fileContents[$i]);
        }

        // Reindex the array to avoid gaps
        $updatedContents = array_values($fileContents);

        // Write the updated contents back to the file
        file_put_contents($filePath, implode(PHP_EOL, $updatedContents) . PHP_EOL);

        echo json_encode(["status" => "success", "message" => "$name and the 2 lines above have been removed."]);
    } else {
        echo json_encode(["status" => "error", "message" => "$name not found."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "File does not exist."]);
}
?>
