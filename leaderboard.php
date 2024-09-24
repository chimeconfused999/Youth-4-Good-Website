<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// File path to store the leaderboard data
$leaderboardFile = 'leaderboard.txt';

// Get the raw POST data and decode it from JSON
$input = json_decode(file_get_contents('php://input'), true);

// Add debugging output to see the raw data
file_put_contents('debug_log.txt', print_r($input, true)); // Log the raw input

// Check if the input contains the necessary fields
if (isset($input['username']) && isset($input['serviceminutes'])) {
    $name = trim($input['username']);
    $serviceminutes = intval(trim($input['serviceminutes'])); // Ensure the service minutes are an integer

    // Check for valid data
    if (empty($name) || $serviceminutes < 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid username or service minutes.']);
        exit;
    }

    // Read the existing leaderboard data
    $leaderboard = [];
    if (file_exists($leaderboardFile)) {
        $leaderboard = file($leaderboardFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    }

    // Flag to check if the user exists in the leaderboard
    $updated = false;

    // Update the leaderboard with the new user data
    for ($i = 0; $i < count($leaderboard); $i++) {
        // Check if the current line is the username
        if (trim($leaderboard[$i]) === $name) {
            // Replace the next line with the new score
            $leaderboard[$i + 1] = $serviceminutes;
            $updated = true; // Mark that the user was found and updated
            break;
        }
    }

    // If the username wasn't found, add a new entry
    if (!$updated) {
        $leaderboard[] = $name; // Add the username
        $leaderboard[] = $serviceminutes; // Add the score
    }

    // Sort the leaderboard by service minutes in descending order
    usort($leaderboard, function($a, $b) {
        return is_numeric($b) && is_numeric($a) ? (int)$b <=> (int)$a : 0;
    });

    // Write the updated leaderboard back to the file using newline separators
    if (file_put_contents($leaderboardFile, implode(PHP_EOL, $leaderboard))) {
        echo json_encode(['status' => 'success', 'message' => 'Leaderboard updated successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update leaderboard.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No data received.']);
}
?>
