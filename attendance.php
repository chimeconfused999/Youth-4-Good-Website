<?php
// Get the raw POST data
$json = file_get_contents('php://input');

// Decode the JSON data into a PHP array
$data = json_decode($json, true);

// Extract title and email from the data
$title = isset($data['title']) ? $data['title'] : null;
$email = isset($data['email']) ? $data['email'] : null;

// Validate the received data
if ($title && $email) {
    // Validate email address
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Define the file path
        $filePath = __DIR__ . "/" . $title . ".txt";

        // Read the existing content
        $existingData = file_exists($filePath) ? file_get_contents($filePath) : "";

        // Print the existing data (for debugging purposes)
        print_r($existingData);

        // Open the file for appending
        $myfile = fopen($filePath, "a"); // Use "a" mode for appending

        if ($myfile) {
            // Check if the file has existing content and if the email exists in it
            if (strpos($existingData, $email) !== false) {
                // Email already exists in the file
                error_log("Email '{$email}' already exists in the chat.");
                echo json_encode(["status" => "error", "message" => "Email already exists."]);
            } else {
                // Append the email to the file since it doesn't exist
                fwrite($myfile, "member\nnot arrived\n" . $email . "\n");
                fclose($myfile);

                // Respond with success
                echo json_encode(["status" => "success", "message" => "Data appended successfully.", "file" => $filePath]);
            }
        } else {
            // Respond with error if the file could not be opened
            echo json_encode(["status" => "error", "message" => "Could not open file for appending."]);
        }
    } else {
        // Respond with error if the email is invalid
        echo json_encode(["status" => "error", "message" => "Invalid email address."]);
    }
} else {
    // Respond with error if data is missing
    echo json_encode(["status" => "error", "message" => "Title or email is missing."]);
}
?>
