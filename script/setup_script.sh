#!/bin/bash


# Update package lists
sudo apt-get update

# Upgrade installed packages
sudo apt-get upgrade -y

# Clean up
sudo apt-get clean

sudo apt install -y nodejs npm unzip

#creting user group
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225
# Move webapp.zip and .env to /opt/
cd /tmp
sudo mv /tmp/webapp.zip /opt/csye6225/webapp.zip



# Change directory to /opt/
cd /opt/csye6225


# Purge Mariadb-server
# sudo apt-get purge mariadb-server

# Update package lists
sudo apt update


# Unzip webapp.zip
sudo unzip webapp.zip

sudo cp csye6225.service /etc/systemd/system
sudo chown -R csye6225:csye6225 /opt/csye6225
sudo chmod +x /opt/csye6225/index.js

sudo npm install
  
#cd /opt/aws/
#curl -O https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb 
sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
sudo touch /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent.json
sudo chmod 644 /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent.json 
sudo chown -R csye6225:csye6225 /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent.json

sudo sh -c 'echo "{
  \"agent\": {
    \"metrics_collection_interval\": 10,
    \"logfile\": \"/var/logs/amazon-cloudwatch-agent.log\"
  },
  \"logs\": {
    \"logs_collected\": {
      \"files\": {
        \"collect_list\": [
          {
            \"file_path\": \"/var/log/csye6225.log\",
            \"log_group_name\": \"csye6225\",
            \"log_stream_name\": \"webapp\"
          }
          {
            \"file_path\": \"/var/log/csye6225err.log\",
            \"log_group_name\": \"csye6225\",
            \"log_stream_name\": \"webapp\"
          }
        ]
      }
    },
    \"log_stream_name\": \"cloudwatch_log_stream\"
  },
  \"metrics\": {
    \"metrics_collected\": {
      \"statsd\": {
        \"service_address\": \":8125\",
        \"metrics_collection_interval\": 15,
        \"metrics_aggregation_interval\": 30
      }
    }
  }
}" > /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent.json'


sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent

sudo systemctl daemon-reload
sudo systemctl enable csye6225
sudo systemctl start csye6225
sudo systemctl restart csye6225
sudo systemctl stop csye6225

# Install Node.js dependencies
sudo npm install


