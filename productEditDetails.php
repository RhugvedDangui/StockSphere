<?php
require_once 'databaseConn.php';

$id=$_POST['id'];
$name=$_POST['name'];

$stmt = $conn->prepare('SELECT * FROM products WHERE product_id=? AND product_name=?');
$stmt->bind_param('is', $id,$name);  // 's' specifies the variable type is string
$stmt->execute();
$result = $stmt->get_result();

header('Content-Type: application/json');

if(mysqli_num_rows($result)){
    while($row=mysqli_fetch_assoc($result)){
        echo json_encode($row);
    }
}

?>