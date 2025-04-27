<?php
session_start();

if (!isset($_SESSION['username'])) {
    die("User not logged in.");
}

$username = $_SESSION['username'];

$servername = "localhost";
$db_username = "root"; 
$db_password = ""; 

$conn = new mysqli($servername, $db_username, $db_password);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sanitized_username = mysqli_real_escape_string($conn, $username);

$db_name = 'stocksphere_' . $sanitized_username;

$sql = "CREATE DATABASE IF NOT EXISTS `$db_name`";

if ($conn->query($sql) === TRUE) {
    echo "Database '$db_name' created successfully (if not already existing).<br>";
} else {
    echo "Error creating database: " . $conn->error . "<br>";
}

$conn->select_db($db_name);

$sql = "
-- Create 'invoice' table
CREATE TABLE `invoice` (
  `invoice_id` INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `invoice_date` VARCHAR(20) NOT NULL,
  `invoice_discount` INT(3) NOT NULL,
  `payment_type` VARCHAR(5) NOT NULL,
  `cash` FLOAT NOT NULL,
  `upi` FLOAT NOT NULL,
  `invoice_addition` FLOAT NOT NULL,
  `invoice_deduction` FLOAT NOT NULL,
  `invoice_total_amount` INT(10) NOT NULL,
  `customer_id` INT(5) NOT NULL,
  `card` FLOAT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create 'invoice_items' table
CREATE TABLE `invoice_items` (
  `invoice_item_id` INT(50) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `invoice_id` INT(20) NOT NULL,
  `product_id` INT(5) NOT NULL,
  `batch_id` VARCHAR(20) NOT NULL,
  `batch_no` VARCHAR(20) NOT NULL,
  `quantity` INT(7) NOT NULL,
  `rate` FLOAT NOT NULL,
  `discount` INT(3) NOT NULL,
  `amount` FLOAT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create 'products' table
CREATE TABLE `products` (
  `product_id` INT(5) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `product_name` VARCHAR(100) NOT NULL,
  `product_company` VARCHAR(70) NOT NULL,
  `product_classification` VARCHAR(25) NOT NULL,
  `product_rack` VARCHAR(20) NOT NULL,
  `product_comment` VARCHAR(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create 'product_list' table
CREATE TABLE `product_list` (
  `product_id` INT(5) NOT NULL,
  `batch_id` VARCHAR(20) NOT NULL,
  `batch_no` VARCHAR(20) NOT NULL,
  `expiry` DATE NOT NULL,
  `quantity` INT(5) NOT NULL,
  `price` FLOAT NOT NULL,
  `gst` INT(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create 'purchase' table
CREATE TABLE `purchase` (
  `purchase_id` INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `bill_no` VARCHAR(15) NOT NULL,
  `seller_id` INT(5) NOT NULL,
  `purchase_date` DATE NOT NULL,
  `purchase_discount` DECIMAL(5,0) NOT NULL,
  `purchase_amount` DECIMAL(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create 'purchase_items' table
CREATE TABLE `purchase_items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `purchase_id` INT(11) DEFAULT NULL,
  `product_id` INT(11) DEFAULT NULL,
  `batch_id` VARCHAR(10) DEFAULT NULL,
  `batch_no` VARCHAR(255) DEFAULT NULL,
  `prod_expDate` DATE DEFAULT NULL,
  `quantity` INT(11) DEFAULT NULL,
  `freeQuantity` INT(11) DEFAULT NULL,
  `gst` DECIMAL(10,2) DEFAULT NULL,
  `rate` DECIMAL(10,2) DEFAULT NULL,
  `prod_mrp` DECIMAL(10,2) DEFAULT NULL,
  `discount` DECIMAL(10,2) DEFAULT NULL,
  `amount` DECIMAL(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create 'seller' table
CREATE TABLE `seller` (
  `seller_id` INT(5) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `seller_name` VARCHAR(70) NOT NULL,
  `seller_address` VARCHAR(100) NOT NULL,
  `seller_phone_no` INT(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

";

if ($conn->multi_query($sql)) {
    echo "Tables created successfully.<br>";
    header("Location: invoice.html");

} else {
    echo "Error creating tables: " . $conn->error . "<br>";
}

$conn->close();
?>
