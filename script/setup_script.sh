#!/bin/bash


# Update package lists
sudo apt-get update

# Upgrade installed packages
sudo apt-get upgrade -y

# Clean up
sudo apt-get clean

#creting user group
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225
sudo cp csye6225.service /etc/systemd/system

# Move webapp.zip and .env to /opt/
sudo mv /tmp/webapp.zip /opt/csye6225/webapp.zip

# Install unzip
sudo apt install -y unzip

# Change directory to /opt/
cd /opt/csye6225

# Install Node.js and npm
sudo apt install -y nodejs npm

# Purge Mariadb-server
sudo apt-get purge mariadb-server

# Update package lists
sudo apt update


# Unzip webapp.zip
sudo unzip webapp.zip

# Install Node.js dependencies
sudo npm install


sudo systemctl daemon-reload
sudo systemctl enable csye6225
sudo systemctl start csye6225
sudo systemctl restart csye6225
sudo systemctl stop csye6225