<?php
$uploadsDir = 'uploads/';

// Check if the uploads directory exists
if (is_dir($uploadsDir)) {
    // Get all files from the uploads directory
    $files = array_diff(scandir($uploadsDir), array('.', '..')); // Exclude . and ..

    // Create an array of file URLs
    $fileURLs = [];
    foreach ($files as $file) {
        if (is_file($uploadsDir . $file)) {
            $fileURLs[] = $uploadsDir . $file;
        }
    }

    // Return the list of file URLs as JSON
    echo json_encode($fileURLs);
} else {
    echo json_encode([]);
}
?>
