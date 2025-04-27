<?php
require_once 'databaseConn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode($_POST['invoiceDetails'], true);
    
    
    $name= $data['sellerName'];
    $phone= $data['sellerPhone'];
    $address= $data['sellerAddress'];
    
    try {
        $stmt = $conn->prepare("INSERT INTO seller (seller_name, seller_address, seller_phone_no) VALUES (?, ?, ?)");
        $stmt->execute([$name, $phone, $address]);


    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }

   
    $conn->close();
    echo "success";
} else {
    echo 'Invalid request method';
}
?>
