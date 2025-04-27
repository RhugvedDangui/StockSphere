<?php
require_once 'databaseConn.php'; // Include your database connection file

// Get the purchase_id from AJAX request
$purchase_id = $_POST['purchase_id'];

// Query to fetch data from purchase_list based on purchase_id
$query = "SELECT * FROM purchase_items WHERE purchase_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $purchase_id); // Bind the purchase_id
$stmt->execute();
$result = $stmt->get_result();

// Check if there are any records in the purchase_list for the given purchase_id
if ($result->num_rows > 0) {
    // Loop through all the records from purchase_list
    while ($row = $result->fetch_assoc()) {
        // Get the values from the current row
        $product_id = $row['product_id'];
        $batch_id = $row['batch_id'];
        $batch_no = $row['batch_no'];
        $prod_expDate = $row['prod_expDate']; // Product expiry date
        $quantity = $row['quantity']; // Quantity
        $freeQuantity = $row['freeQuantity']; // Free quantity
        $gst = $row['gst']; // GST value
        $prod_mrp = $row['prod_mrp']; // Product MRP

        // Calculate total quantity as sum of quantity and freeQuantity
        $total_quantity = $quantity + $freeQuantity;

        // Check if the product with the same batch_id and batch_no exists in product_list
        $check_query = "SELECT * FROM product_list WHERE product_id = ? AND batch_id = ? AND batch_no = ?";
        $check_stmt = $conn->prepare($check_query);
        $check_stmt->bind_param("iis", $product_id, $batch_id, $batch_no);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();

        if ($check_result->num_rows > 0) {
            // If the product already exists in product_list, update the quantity
            $update_query = "UPDATE product_list SET quantity = quantity + ?, expiry = ?, price = ?, gst = ? WHERE product_id = ? AND batch_id = ? AND batch_no = ?";
            $update_stmt = $conn->prepare($update_query);
            $update_stmt->bind_param("iisdiis", $total_quantity, $prod_expDate, $prod_mrp, $gst, $product_id, $batch_id, $batch_no);
            
            if ($update_stmt->execute()) {
                echo "Product details updated successfully in product_list for Product ID: $product_id<br>";
            } else {
                echo "Error updating product details for Product ID: $product_id<br>";
            }
        } else {
            // If the product doesn't exist in product_list, insert a new record
            $insert_query = "INSERT INTO product_list (product_id, batch_id, batch_no, expiry, quantity, price, gst) 
                             VALUES (?, ?, ?, ?, ?, ?, ?)";
            $insert_stmt = $conn->prepare($insert_query);
            $insert_stmt->bind_param("iisdiis", $product_id, $batch_id, $batch_no, $prod_expDate, $total_quantity, $prod_mrp, $gst);
            
            if ($insert_stmt->execute()) {
                echo "Product details added successfully to product_list for Product ID: $product_id<br>";
            } else {
                echo "Error adding product details for Product ID: $product_id<br>";
            }
        }
    }
} else {
    echo "No records found in the purchase_list for Purchase ID: $purchase_id.";
}
?>
