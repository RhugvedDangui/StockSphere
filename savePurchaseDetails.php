<?php
require_once 'databaseConn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode($_POST['purchaseDetails'], true);
    
    $bill_no = $data['bill_no'];
    $seller_id = $data['seller_id'];
    $date = $data['date'];
    $discount = $data['discount'];
    $amount = $data['amount'];
    
    try {
        $stmt = $conn->prepare("INSERT INTO purchase (bill_no, seller_id, purchase_date, purchase_discount, purchase_amount) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$bill_no, $seller_id, $date, $discount, $amount]);

        $query = "SELECT MAX(purchase_id) AS max_purchase_id FROM purchase"; 
        $result = $conn->query($query);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo (int) $row['max_purchase_id']; 
        } else {
            echo json_encode(['error' => 'No purchase found']);
        }

    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }

    $conn->close();

} else {
    echo 'Invalid request method';
}
?>
