-- Insert roles
INSERT INTO roles(name) VALUES('ROLE_USER') ON DUPLICATE KEY UPDATE name = name;
INSERT INTO roles(name) VALUES('ROLE_MANAGER') ON DUPLICATE KEY UPDATE name = name;
INSERT INTO roles(name) VALUES('ROLE_ADMIN') ON DUPLICATE KEY UPDATE name = name;

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, created_at, updated_at) 
VALUES ('admin', 'admin@invenpulse.com', '$2a$10$OMuKEWFHWaXBSgA9Ry9Cne.QYc1S0FS9hCmTVMFIUppWXpWCYGJMK', NOW(), NOW())
ON DUPLICATE KEY UPDATE username = username;

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN'
ON DUPLICATE KEY UPDATE user_id = user_id;

-- Insert sample categories
INSERT INTO categories (name, description, status, created_at, updated_at)
VALUES 
('Electronics', 'Electronic devices and components', 'ACTIVE', NOW(), NOW()),
('Office Supplies', 'Office stationery and supplies', 'ACTIVE', NOW(), NOW()),
('Furniture', 'Office and home furniture', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE name = name;

-- Insert sample suppliers
INSERT INTO suppliers (company_name, contact_person, email, phone, address, city, country, status, created_at, updated_at)
VALUES 
('Tech Solutions Inc.', 'John Smith', 'john@techsolutions.com', '+1-555-123-4567', '123 Tech St', 'San Francisco', 'USA', 'ACTIVE', NOW(), NOW()),
('Office World', 'Jane Doe', 'jane@officeworld.com', '+1-555-987-6543', '456 Office Ave', 'New York', 'USA', 'ACTIVE', NOW(), NOW()),
('Furniture Plus', 'Robert Johnson', 'robert@furnitureplus.com', '+1-555-456-7890', '789 Furniture Blvd', 'Chicago', 'USA', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE company_name = company_name;