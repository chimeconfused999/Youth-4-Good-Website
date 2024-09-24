<?php
// Set timezone to Los Angeles
date_default_timezone_set('America/Los_Angeles');

// Directory where images will be saved
$targetDir = "uploads/";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the name from the POST request
    $name = isset($_POST['name']) ? $_POST['name'] : 'Unknown';

    if (isset($_FILES['imageFile']) && $_FILES['imageFile']['error'] == 0) {
        // Get the original file extension
        $fileInfo = pathinfo($_FILES['imageFile']['name']);
        $extension = strtolower($fileInfo['extension']);

        // Allowed extensions (for security, check for image types only)
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

        if (in_array($extension, $allowedExtensions)) {
            // Create a unique filename using the current date and time
            $newFileName = date("Ymd_His") . $name . '.' . $extension;
            $targetFile = $targetDir . $newFileName;

            // Create the upload directory if it doesn't exist
            if (!is_dir($targetDir)) {
                mkdir($targetDir, 0755, true);
            }

            // Check if the file is an actual image
            $check = getimagesize($_FILES['imageFile']['tmp_name']);
            if ($check !== false) {
                if (move_uploaded_file($_FILES['imageFile']['tmp_name'], $targetFile)) {
                    // Include the name in the response
                    echo json_encode(["message" => "Image uploaded successfully as $newFileName", "name" => $name]);
                } else {
                    echo json_encode(["message" => "Error uploading the image."]);
                }
            } else {
                echo json_encode(["message" => "File is not a valid image."]);
            }
        } else {
            echo json_encode(["message" => "Invalid file extension. Allowed types: jpg, jpeg, png, gif."]);
        }
    } else {
        echo json_encode(["message" => "No image uploaded or there was an error."]);
    }
}
?>
