<?php

require_once 'databaseConn.php';
$company=$_POST['text'];

$response = array();
$result="";

$stmt = $conn->prepare('SELECT product_company FROM products WHERE product_company LIKE CONCAT(?, "%") UNION SELECT product_company FROM products WHERE product_company LIKE CONCAT(?, "%") ');
$stmt->bind_param('ss', $company,$company);  // 's' specifies the variable type is string
$stmt->execute();
$result = $stmt->get_result();

if(mysqli_num_rows($result)){
    while($row=mysqli_fetch_assoc($result)){

        $newRow = array("product_company" => $row['product_company']);
        array_push($response, $newRow);
    }
}

header('Content-Type: application/json');
echo json_encode($response);
?>