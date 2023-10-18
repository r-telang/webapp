packer {
  required_plugins {
    amazon = {
      version = " >= 0.0.2 "
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"

}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "db_name" {
  type    = string
  default = "demo"
}

variable "db_password" {
  type    = string
  default = "demo"
}

variable "db_user" {
  type    = string
  default = "root"
}

locals { timestamp = regex_replace(timestamp(), "[- TZ:]", "") }

variable "subnet_id" {
  type    = string
  default = "subnet-0643faa40e74d140b"
}

source "amazon-ebs" "my-ami" {
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  instance_type   = "t2.micro"
  region          = "${var.aws_region}"
  ami_description = "AMI for CSYE 6225"
  subnet_id       = "${var.subnet_id}"
  ami_users       = ["028379396800", "197782923447"] //2nd demo 

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50

  }
  source_ami   = "${var.source_ami}"
  ssh_username = "${var.ssh_username}"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/cloud1"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.my-ami"]

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]

    inline = [
      "sudo apt-get update",
      "sudo apt-get upgrade -y",
      "sudo apt-get clean",
      "sudo mv /temp/webapp.zip /opt/webapp.zip",
      "sudo mv /temp/.env /opt/webapp.zip",
      "sudo apt install unzip",
      "cd /opt",
      "unzip webapp.zip",
      "sudo apt install nodejs npm",
      "sudo apt-get purge mariadb-server",
      "sudo apt update",
      "sudo apt install mariadb-server",
      "sudo systemctl start mariadb",
      "sudo systemctl enable mariadb",
      "sudo mysql_secure_installation",
      "mysql -u root -p",
      "CREATE DATABASE ${var.db_name}",
      "GRANT ALL PRIVILEGES ON ${var.db_name}.* TO '${var.db_user}'@'localhost' IDENTIFIED BY ${var.db_password}",
      "FLUSH PRIVILEGES",

    ]
  }
}