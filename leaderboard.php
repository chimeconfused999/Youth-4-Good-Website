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

    // Update the leaderboard with the new user data
    $updated = false;
    foreach ($leaderboard as &$line) {
        if (strpos($line, $name . ':') === 0) {
            $line = $name . ':' . $serviceminutes; // Update existing entry
            $updated = true;
            break;
        }
    }

    // If the username wasn't found, add a new entry
    if (!$updated) {
        $leaderboard[] = $name . ':' . $serviceminutes;
    }

    // Sort the leaderboard by service minutes in descending order
    usort($leaderboard, function($a, $b) {
        return (int)explode(':', $b)[1] <=> (int)explode(': ', $a)[1];
    });

    // Write the updated leaderboard back to the file without curly brackets
    if (file_put_contents($leaderboardFile, implode(PHP_EOL, $leaderboard))) {
        echo json_encode(['status' => 'success', 'message' => 'Leaderboard updated successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update leaderboard.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No data received.']);
}
?>
