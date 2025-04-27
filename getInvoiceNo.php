<?php
require_once 'databaseConn.php'; 

$query = "SELECT MAX(invoice_id) AS max_invoice_id FROM invoice"; 
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $max_invoice_id = $row['max_invoice_id'];

    if ($max_invoice_id === NULL) {
        $next_invoice_id = 1;
    } else {
        $next_invoice_id = $max_invoice_id + 1;
    }

    echo $next_invoice_id;
} else {
    echo "Error: Could not retrieve max invoice_id.";
}
?>
