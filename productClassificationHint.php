<?php

require_once 'databaseConn.php';
$classification=$_POST['text'];

$response = array();
$result="";

$stmt = $conn->prepare('SELECT product_classification FROM products WHERE product_classification LIKE CONCAT(?, "%") ');
$stmt->bind_param('s', $classification);  // 's' specifies the variable type is string
$stmt->execute();
$result = $stmt->get_result();

if(mysqli_num_rows($result)){
    while($row=mysqli_fetch_assoc($result)){

        $newRow = array("product_classification" => $row['product_classification']);
        array_push($response, $newRow);
    }
}

header('Content-Type: application/json');
echo json_encode($response);
?>