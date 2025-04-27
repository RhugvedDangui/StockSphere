<?php
require_once 'databaseConn.php'; // Include your database connection

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['productList'])) {
    $productList = json_decode($_POST['productList'], true);

    try {
        // Start a transaction
        $conn->begin_transaction();

        foreach ($productList as $product) {
            $product_id = $product['product_id'];
            $batch_id = $product['batch_id'];
            $batch_no = $product['batch_no'];
            $quantity = $product['quantity'];

            // Check the current quantity in the product_list table
            $stmt = $conn->prepare("SELECT quantity FROM product_list WHERE product_id = ? AND batch_id = ? AND batch_no = ?");
            $stmt->bind_param("iis", $product_id, $batch_id, $batch_no);
            $stmt->execute();
            $stmt->bind_result($currentQty);
            $stmt->fetch();
            $stmt->close();

            // Ensure there is enough stock before subtracting
            if ($currentQty >= $quantity) {
                // Update the quantity in the product_list table
                $updateStmt = $conn->prepare("UPDATE product_list SET quantity = quantity - ? WHERE product_id = ? AND batch_id = ? AND batch_no = ?");
                $updateStmt->bind_param("iiis", $quantity, $product_id, $batch_id, $batch_no);
                $updateStmt->execute();
                $updateStmt->close();
            } else {
                // If not enough stock, throw an exception and rollback
                throw new Exception("Insufficient stock for product ID $product_id in batch $batch_no.");
            }
        }

        // Commit the transaction
        $conn->commit();
        echo 'success';

    } catch (Exception $e) {
        // Rollback in case of any error
        $conn->rollback();
        echo json_encode(['error' => $e->getMessage()]);
    }

} else {
    echo json_encode(['error' => 'Missing productList']);
}
?>
