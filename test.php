<?php

require_once 'databaseConn.php';  // Make sure to include the database connection

// Check if the 'purchase_items' table exists
$result = $conn->query("SHOW TABLES LIKE 'purchase_items'");

if ($result->num_rows == 0) {
    die("Table 'purchase_items' does not exist.");
} else {
    echo "Table 'purchase_items' exists!";
}

?>
