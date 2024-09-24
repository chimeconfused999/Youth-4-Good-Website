<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// File path to store tutor data
$tutorFile = 'tutors.txt';

// Get the raw POST data and decode it from JSON
$input = json_decode(file_get_contents('php://input'), true);

// Check if the necessary fields are present
if (isset($input['tutor']) && isset($input['reviews']) && isset($input['rating'])) {
    $tutor = trim($input['tutor']);
    $reviews = intval($input['reviews']);
    $rating = floatval($input['rating']);

    // Read the existing tutor data
    $tutors = [];
    if (file_exists($tutorFile)) {
        $tutors = file($tutorFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    }

    // Flag to track whether tutor was found and updated
    $updated = false;
    foreach ($tutors as $index => $line) {
        // Look for the tutor name in the current line
        if (trim($line) === $tutor) {
            // If the tutor is found, update the next two lines with new reviews and rating
            $tutors[$index + 1] = $reviews; // Update reviews (next line)
            $tutors[$index + 2] = $rating;  // Update rating (next line)
            $updated = true;
            break;
        }
    }

    // If tutor wasn't found, add a new entry
    if (!$updated) {
        $tutors[] = $tutor;
        $tutors[] = $reviews;
        $tutors[] = $rating;
    }

    // Write the updated tutor data back to the file
    if (file_put_contents($tutorFile, implode(PHP_EOL, $tutors))) {
        echo json_encode(['status' => 'success', 'message' => 'Tutor data updated successfully.']);
        
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update tutor data.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input data.']);
}
