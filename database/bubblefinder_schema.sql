CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shops (
    shop_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    shop_name VARCHAR(255) NOT NULL,
    shop_desc TEXT,
    location VARCHAR(255),
    logo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT 0,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deletion_reason TEXT NULL,
    is_reviewed BOOLEAN DEFAULT 0,
    reviewed_at TIMESTAMP NULL DEFAULT NULL,
    reviewed_by INT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES admins(admin_id) ON DELETE SET NULL,
    INDEX idx_is_deleted (is_deleted)
);

CREATE TABLE IF NOT EXISTS contact_info (
    contact_info_id INT AUTO_INCREMENT PRIMARY KEY,
    shop_id INT NOT NULL,
    contact_info TEXT,
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS social_media (
    soc_med_id INT AUTO_INCREMENT PRIMARY KEY,
    shop_id INT NOT NULL,
    platform TEXT,
    link TEXT,
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS laundry_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shop_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    service_description TEXT,
    service_specification VARCHAR(255),
    service_price DECIMAL(10,2),
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shop_photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shop_id INT NOT NULL,
    shop_photo VARCHAR(255) NOT NULL,
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE
);

INSERT INTO admins (email, password_hash) 
VALUES ('admin@email.com', '$2y$10$rqDbuVf1VGRxr9k3HaLeDu/3dQ6HqCu5EGv3RJstA0STzlVlF0nIy')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);