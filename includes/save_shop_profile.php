<?php 
session_start(); 
if (!isset($_SESSION['user_id'])) { 
    die("User not logged in."); 
    } 
require_once '../config/database.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") { 
    $ownerId = $_SESSION['user_id']; 
    $shopName = $_POST["shopName"]; 
    $shopDesc = $_POST["shopDescription"]; 
    $location = $_POST["location"]; 
    $logoPath = null; 
    
    if (isset($_FILES["photoUpload"]) && $_FILES["photoUpload"]["error"] == 0) { 
        $uploadDir = "../uploads/logos/"; $fileName = time() . "_" . basename($_FILES["photoUpload"]["name"]); 
        $targetFile = $uploadDir . $fileName; 
        if (move_uploaded_file($_FILES["photoUpload"]["tmp_name"], $targetFile)) {
             $logoPath = "uploads/logos/" . $fileName; 
        } else { 
                die("Failed to upload logo."); 
        } 
    } 
    
    $stmt = $conn->prepare("INSERT INTO shops (owner_id, shop_name, shop_desc, location, logo) 
        VALUES (?, ?, ?, ?, ?)"); 

    $stmt->bind_param("issss",$ownerId, $shopName, $shopDesc, $location, $logoPath); 
    
    $stmt->execute();
    $stmt->close(); 
    
    $ownerId = $_SESSION['user_id']; 
    $platforms = $_POST['socialMediaPlatform'] ?? []; 
    $links = $_POST['socialMediaLink'] ?? []; 
    
    $stmt = $conn->prepare("SELECT shop_id FROM shops WHERE owner_id = ?"); 
    $stmt->bind_param("i", $ownerId); 
    $stmt->execute(); $result = $stmt->get_result(); 

    $row = $result->fetch_assoc(); 
    $shopId = $row['shop_id']; 
    
    $stmt->close(); 
    
    $stmt = $conn->prepare("INSERT INTO social_media (shop_id, platform, link) 
        VALUES (?, ?, ?)"); 
    for ($i = 0; $i < count($platforms); $i++) {
        $platform = $platforms[$i]; 
        $link = $links[$i]; 
        
        if (!empty($platform) && !empty($link)) { 
            $stmt->bind_param("iss", $shopId, $platform, $link); $stmt->execute(); 
            } 
        } 
        
    $stmt->close(); 
    
    $contactInfo = $_POST['contactInfo'] ?? []; 
    
    $stmt = $conn->prepare("INSERT INTO contact_info (shop_id, contact_info) VALUES (?, ?)"); 
    
    for ($i = 0; $i < count($contactInfo); $i++) { 
        $temp_info = $contactInfo[$i]; 
        $stmt->bind_param("is", $shopId, $temp_info); 
        $stmt->execute(); }
        
    $stmt->close(); 

    header("Location: ../views/seller/shop_profile_manager.html");
        
} 

$conn->close(); 
?>