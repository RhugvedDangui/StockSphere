<?php

require_once 'databaseConn.php';
$name=$_POST['text'];

$response = array();
$result="";

$stmt = $conn->prepare('SELECT product_id,product_name FROM products WHERE product_name LIKE CONCAT(?, "%") UNION SELECT product_id, product_name FROM products WHERE product_name LIKE CONCAT(?, "%") ');
$stmt->bind_param('ss', $name,$name);  // 's' specifies the variable type is string
$stmt->execute();
$result = $stmt->get_result();

if(mysqli_num_rows($result)){
    while($row=mysqli_fetch_assoc($result)){

        $newRow = array("product_id" => $row['product_id'], "product_name" => $row['product_name']);
        array_push($response, $newRow);
    }
}

header('Content-Type: application/json');
echo json_encode($response);
?>