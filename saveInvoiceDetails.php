<?php
require_once 'databaseConn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode($_POST['invoiceDetails'], true);
    
    
    $date = $data['invoice_date'];
    $discount = $data['invoice_discount'];
    $payment_type = $data['payment_type'];
    $cash = $data['cash'];
    $upi = $data['upi'];
    $addition = $data['imvoice_addition'];
    $deduction = $data['imvoice_deduction'];
    $total_amount = $data['invoice_total_amount'];
    $card = $data['card'];
    
    try {
        $stmt = $conn->prepare("INSERT INTO invoice (invoice_date, invoice_discount, payment_type, cash, upi, invoice_addition, invoice_deduction, invoice_total_amount, card) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$date, $discount, $payment_type, $cash, $upi, $addition, $deduction, $total_amount, $card]);


    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }

    $query = "SELECT MAX(invoice_id) AS id FROM invoice"; 
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo (int) $row['id']; 
    } else {
        echo json_encode(['error' => 'No purchase found']);
    }


    $conn->close();

} else {
    echo 'Invalid request method';
}
?>
