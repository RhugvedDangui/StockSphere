<?php
require_once 'databaseConn.php';

// Check if POST data is set
if (!isset($_POST['productId'])) {
    http_response_code(400);
    echo json_encode(["error" => "Product ID is required"]);
    exit;
}

$pid = $_POST['productId'];
$response = array();

// Prepare the SQL statement with a proper JOIN if necessary
$stmt = $conn->prepare('
    SELECT product_list.batch_id, product_list.batch_no, product_list.expiry, product_list.quantity, product_list.price, product_list.gst
    FROM product_list
    WHERE product_list.product_id = ?'
);
$stmt->bind_param('s', $pid);  // 's' specifies the variable type is string
$stmt->execute();
$result = $stmt->get_result();

// Check if there are any rows returned
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $newRow = array(
            "batch_id" => $row['batch_id'],
            // "product_name" => $row['product_name'],
            "batch_no" => $row['batch_no'],
            "expiry" => $row['expiry'],
            "quantity" => $row['quantity'],
            "price" => $row['price'],
            "gst" => $row['gst']
        );
        array_push($response, $newRow);
    }
} else {
    // Optionally handle case where no records are found
    $response = ["error" => "No data found for the given Product ID"];
}

// Convert the array to JSON format and send it as the response
header('Content-Type: application/json');
echo json_encode($response);
?>
