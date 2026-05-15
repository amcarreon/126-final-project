CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE shops (
    shop_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    shop_name VARCHAR(255) NOT NULL,
    shop_desc TEXT,
    location VARCHAR(255),
    logo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP NULL DEFAULT NULL,

    FOREIGN KEY (owner_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE contact_info(
    contact_info_id INT AUTO_INCREMENT PRIMARY KEY,
    shop_id INT NOT NULL,
    contact_info TEXT,
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id)
        ON DELETE CASCADE
);

CREATE TABLE social_media(
    soc_med_id INT AUTO_INCREMENT PRIMARY KEY,
    shop_id INT NOT NULL,
    platform TEXT,
    link TEXT,
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id)
        ON DELETE CASCADE
);

CREATE TABLE laundry_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shop_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    service_description TEXT,
    service_specification VARCHAR(255),
    service_price DECIMAL(10,2),
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id)
        ON DELETE CASCADE
);

CREATE TABLE shop_photos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    shop_id INT NOT NULL,
    shop_photo VARCHAR(255) NOT NULL,
    FOREIGN KEY (shop_id) REFERENCES shops(shop_id)
        ON DELETE CASCADE
)