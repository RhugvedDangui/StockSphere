<?php
session_start(); // Ensure that the session is started

// Check if the user is logged in (i.e., session has the 'username' key)
if (!isset($_SESSION['username'])) {
    die("User not logged in.");
}

$server = "localhost";
$username = "root";
$password = "";

// Dynamically create the database name using the session's username
$dbname = "StockSphere_" . $_SESSION['username']; // For example, StockSphere_johnDoe

// Create a new MySQLi connection to the dynamically chosen database
$conn = new mysqli($server, $username, $password, $dbname);

// Check for any connection errors
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// You are now connected to the user's specific database
?>
