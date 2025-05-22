-- Create database
CREATE DATABASE IF NOT EXISTS sims;
USE sims;

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Spare_Part table
CREATE TABLE IF NOT EXISTS spare_part (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  quantity INT DEFAULT 0,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Stock_In table
CREATE TABLE IF NOT EXISTS stock_in (
  id INT AUTO_INCREMENT PRIMARY KEY,
  spare_part_id INT NOT NULL,
  stock_in_quantity INT NOT NULL,
  stock_in_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (spare_part_id) REFERENCES spare_part(id) ON DELETE CASCADE
);

-- Create Stock_Out table
CREATE TABLE IF NOT EXISTS stock_out (
  id INT AUTO_INCREMENT PRIMARY KEY,
  spare_part_id INT NOT NULL,
  stock_out_quantity INT NOT NULL,
  stock_out_unit_price DECIMAL(10, 2) NOT NULL,
  stock_out_total_price DECIMAL(10, 2) GENERATED ALWAYS AS (stock_out_quantity * stock_out_unit_price) STORED,
  stock_out_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (spare_part_id) REFERENCES spare_part(id) ON DELETE CASCADE
);

-- Create triggers to update spare_part quantity on stock_in
DELIMITER //
CREATE TRIGGER after_stock_in_insert
AFTER INSERT ON stock_in
FOR EACH ROW
BEGIN
  UPDATE spare_part
  SET quantity = quantity + NEW.stock_in_quantity
  WHERE id = NEW.spare_part_id;
END //
DELIMITER ;

-- Create triggers to update spare_part quantity on stock_out
DELIMITER //
CREATE TRIGGER after_stock_out_insert
AFTER INSERT ON stock_out
FOR EACH ROW
BEGIN
  UPDATE spare_part
  SET quantity = quantity - NEW.stock_out_quantity
  WHERE id = NEW.spare_part_id;
END //
DELIMITER ;

-- Create triggers to update spare_part quantity on stock_out update
DELIMITER //
CREATE TRIGGER after_stock_out_update
AFTER UPDATE ON stock_out
FOR EACH ROW
BEGIN
  UPDATE spare_part
  SET quantity = quantity + OLD.stock_out_quantity - NEW.stock_out_quantity
  WHERE id = NEW.spare_part_id;
END //
DELIMITER ;

-- Create triggers to update spare_part quantity on stock_out delete
DELIMITER //
CREATE TRIGGER after_stock_out_delete
AFTER DELETE ON stock_out
FOR EACH ROW
BEGIN
  UPDATE spare_part
  SET quantity = quantity + OLD.stock_out_quantity
  WHERE id = OLD.spare_part_id;
END //
DELIMITER ;
