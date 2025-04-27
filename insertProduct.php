<?php
// Assuming you're using MySQL and have a connection file included
require_once 'databaseConn.php';  // Include your database connection

// Check if the POST request contains 'purchase_id' and 'productList'
if (isset($_POST['purchase_id']) && isset($_POST['productList'])) {
    $purchase_id = $_POST['purchase_id'];  // Get the purchase ID
    $productList = json_decode($_POST['productList'], true);  // Decode JSON to an associative array

    // Loop through each product and insert it into the database
    foreach ($productList as $product) {
        $prod_id = $product['prodId'];
        $prod_batch = $product['prodBatch'];
        $prod_exp_date = $product['prodExpDate'];
        $prod_gst = $product['prodGst'];
        $prod_p_rate = $product['prodPRate'];
        $prod_s_rate = $product['prodSRate'];
        $prod_discount = $product['prodDiscount'];
        $prod_qty = $product['prodQty'];
        $prod_free_qty = $product['prodFreeQty'];
        $prod_amount = $product['prodAmount'];

        // Insert each product record with its details along with the purchase_id
        $stmt = $conn->prepare("INSERT INTO purchase_items (purchase_id, product_id, batch_id, batch_no, prod_expDate, quantity, freeQuantity, gst, rate, prod_mrp, discount, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$purchase_id, $prod_id, $prod_batch, $prod_batch, $prod_exp_date, $prod_qty,   $prod_free_qty, $prod_gst, $prod_p_rate, $prod_s_rate, $prod_discount, $prod_amount]);
        // mysqli_query($conn, $stmt);
    }

    echo 'success';  // Return success message

} 
else {
}
?>

