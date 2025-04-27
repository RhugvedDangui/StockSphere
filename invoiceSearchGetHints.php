<?php
require_once 'databaseConn.php';
$key = $_POST['key'];
$response = array();
$result="";

$stmt = $conn->prepare('SELECT product_id as id, product_name as name FROM products WHERE product_name LIKE CONCAT(?, "%")');
$stmt->bind_param('s', $key);  // 's' specifies the variable type is string
$stmt->execute();
$result = $stmt->get_result();

if(mysqli_num_rows($result)){
    while($row=mysqli_fetch_assoc($result)){

        $newRow = array("id" => $row['id'], "name" => $row['name']);
        array_push($response, $newRow);
    }
}

// Convert the array to JSON format and send it as the response
header('Content-Type: application/json');
echo json_encode($response);
?>
