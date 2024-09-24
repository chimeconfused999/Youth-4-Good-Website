<?php
// Enable error reporting for debugging
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', 1);

// Define the file path for the JSON file
$filePath = 'data.json';

// Get the raw POST data from the input stream and decode it from JSON
$input = json_decode(file_get_contents('php://input'), true);

// Debug: Dump the input data (remove or comment this out after testing)
var_dump($input);

// Access the data from $input
$eventTitle = isset($input['eventTitle']) ? trim($input['eventTitle']) : null;
$newEventTitle = isset($input['newEventTitle']) ? trim($input['newEventTitle']) : null;
$eventDate = isset($input['eventDate']) ? trim($input['eventDate']) : null;
$eventDuration = isset($input['eventDuration']) ? trim($input['eventDuration']) : null;
$eventPlace = isset($input['eventPlace']) ? trim($input['eventPlace']) : null;
$eventDescription = isset($input['eventDescription']) ? trim($input['eventDescription']) : null;

// Check if the JSON file exists
if (!file_exists($filePath)) {
    echo json_encode([
        "status" => "error", 
        "message" => "JSON file not found."
    ]);
    exit;
}

// Read and decode the JSON file
$jsonData = file_get_contents($filePath);
$data = json_decode($jsonData, true);

// Check if decoding was successful
if ($data === null) {
    echo json_encode([
        "status" => "error", 
        "message" => "Error decoding JSON data."
    ]);
    exit;
}

$eventFound = false;

// If eventTitle is provided, handle renaming and updating
if (!empty($eventTitle)) {
    foreach ($data as $key => $event) {
        if (isset($event['title']) && strtolower($event['title']) == strtolower($eventTitle)) {

            // Check if a .txt file with the old event title exists
            $oldFileName = strtolower(trim($eventTitle)) . '.txt';
            $newFileName = strtolower(trim($newEventTitle)) . '.txt';

            if (file_exists($oldFileName)) {
                // Debug: check if the old file exists before renaming
                echo "Old file $oldFileName exists. Proceeding to rename.\n";

                // Read the file contents before renaming
                $fileContents = file_get_contents($oldFileName);

                // Search and replace the old event title in the file contents (if necessary)
                $updatedContents = str_replace($eventTitle, $newEventTitle, $fileContents);

                // Attempt to rename the file
                if (rename($oldFileName, $newFileName)) {
                    echo "File renamed from $oldFileName to $newFileName successfully.\n";

                    // Write the updated content to the renamed file
                    if (file_put_contents($newFileName, $updatedContents) !== false) {
                        echo "File contents updated in $newFileName successfully.\n";
                    } else {
                        echo "Error writing updated contents to $newFileName.\n";
                    }
                } else {
                    echo "Error renaming file $oldFileName to $newFileName.\n";
                }
            } else {
                echo "File $oldFileName does not exist, no renaming occurred.\n";
            }

            // Update the event details in the JSON data
            $data[$key] = [
                'title' => $newEventTitle,
                'data' => $eventDate, // Keep 'data' as intended
                'place' => $eventPlace,
                'duration' => $eventDuration,
                'description' => $eventDescription,
                'name' => isset($event['name']) ? $event['name'] : null // Preserve the 'name' field
            ];

            $eventFound = true;
            break;
        }
    }

    // Handle the case where no matching event was found
    if (!$eventFound) {
        echo json_encode([
            "status" => "error", 
            "message" => "Event not found."
        ]);
        exit;
    }

    // Reindex the array and save the updated JSON back to the file
    $newJsonData = json_encode(array_values($data), JSON_PRETTY_PRINT);
    if (file_put_contents($filePath, $newJsonData)) {
        echo json_encode([
            "status" => "success", 
            "message" => "Event updated successfully."
        ]);
    } else {
        echo json_encode([
            "status" => "error", 
            "message" => "Error writing to JSON file."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error", 
        "message" => "Event title not provided."
    ]);
}
?>
