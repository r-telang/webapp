#!/bin/bash


# Update package lists
sudo apt-get update

# Upgrade installed packages
sudo apt-get upgrade -y

# Clean up
sudo apt-get clean

# Move webapp.zip and .env to /opt/
sudo mv /tmp/webapp.zip /opt/webapp.zip
sudo mv /tmp/.env /opt/.env

# Install unzip
sudo apt install -y unzip

# Change directory to /opt/
cd /opt

# Install Node.js and npm
sudo apt install -y nodejs npm

# Purge Mariadb-server
sudo apt-get purge mariadb-server

# Update package lists
sudo apt update

# Install Mariadb-server
sudo apt install -y mariadb-server

# Start and enable Mariadb service
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Access MySQL and execute SQL commands
sudo mysql -u root << EOF
CREATE USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
CREATE DATABASE $DB_NAME;
GRANT ALL PRIVILEGES ON *.* TO '$DB_USER'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF

# Unzip webapp.zip
sudo unzip webapp.zip

# Install Node.js dependencies
sudo npm install