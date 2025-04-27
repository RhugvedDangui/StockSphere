<?php
// Assuming you're using MySQL and have a connection file included
require_once 'databaseConn.php';  // Include your database connection

// Check if the POST request contains 'purchase_id' and 'productList'
if (isset($_POST['invoice_id']) && isset($_POST['productList'])) {
    $invoice_id = $_POST['invoice_id'];  // Get the purchase ID
    $productList = json_decode($_POST['productList'], true);  // Decode JSON to an associative array

    // Loop through each product and insert it into the database
    foreach ($productList as $product) {
        $product_id = $product['product_id'];
        $batch_id = $product['batch_id'];
        $batch_no = $product['batch_no'];
        $quantity = $product['quantity'];
        $rate = $product['price'];
        $discount = $product['discount'];
        $amount = $product['amount'];


        // Insert each product record with its details along with the purchase_id
        $stmt = $conn->prepare("INSERT INTO invoice_items (invoice_id, product_id, batch_id, batch_no, quantity, rate, discount, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$invoice_id, $product_id, $batch_id, $batch_no, $quantity, $rate, $discount, $amount]);
    }

    echo 'success';  

} 
else {
    echo json_encode(['error' => 'Missing invoice_id or productList']);
}
?>

