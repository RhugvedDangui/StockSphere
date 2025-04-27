<?php
require_once 'databaseConn.php';
$name=$_POST['name'];
$company=$_POST['company'];
$classification=$_POST['classification'];
$rack=$_POST['rack'];
$comment=$_POST['comment'];

$stmt = $conn->prepare('
    INSERT INTO `products`(`product_name`, `product_company`, `product_classification`, `product_rack`, `product_comment`) VALUES (?,?,?,?,?)'
);

$stmt->bind_param('sssss', $name, $company, $classification, $rack, $comment);

if($stmt->execute()){
    echo 'Success';
}
else{
    echo 'Failed';
}
?>
