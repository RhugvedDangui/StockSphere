<?php
// db.php

$servername = "localhost"; // Usually 'localhost' for XAMPP
$username = "root"; // Default MySQL username in XAMPP
$password = ""; // Default password is empty for XAMPP
$dbname = "userdata"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
