CREATE USER IF NOT EXISTS 'tourconnect_user'@'localhost' IDENTIFIED BY 'Tour123@abc';
GRANT ALL PRIVILEGES ON tourconnect.* TO 'tourconnect_user'@'localhost';
FLUSH PRIVILEGES;
