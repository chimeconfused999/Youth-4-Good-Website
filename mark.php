<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Retrieve the buttonId and filePat from the POST request
    $buttonId = isset($_POST['buttonId']) ? $_POST['buttonId'] : null;
    $filePat = isset($_POST['filePat']) ? $_POST['filePat'] : null;
    $buttonkid = isset($_POST['buttonkid']) ? $_POST['buttonkid'] : null;

    // Check if both values are present
    if (!$buttonId || !$filePat || !$buttonkid) {
        echo "Error: buttonId or filePat or time is missing!";
        exit;
    }

    // Define the file path to the text file
    $filePath = __DIR__ . "/" . $filePat . ".txt";

    // Check if the file exists
    if (!file_exists($filePath)) {
        echo "Error: File not found!";
        exit;
    }

    // Read the file contents into an array
    $fileContents = file($filePath, FILE_IGNORE_NEW_LINES);

    // Find and update the entry that matches buttonId
    $found = false;
    foreach ($fileContents as $index => $line) {
        if (trim($line) === $buttonId) {
            // Set the line to "joined" instead of the buttonId
            $fileContents[$index-1] = $buttonkid;
            $found = true;
            break;
        }
    }

    if ($found) {
        // Write the updated content back to the file
        if (file_put_contents($filePath, implode(PHP_EOL, $fileContents))) {
            echo "Button status updated to 'joined' successfully!";
        } else {
            echo "Error: Could not update the file.";
        }
    } else {
        echo "Error: Button ID not found in the file.";
    }
} else {
    echo "Invalid request.";
}
?>
