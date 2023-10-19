packer {
  required_plugins {
    amazon = {
      version = " >= 0.0.2"
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
  default = "Rajas@281097"
}

variable "db_user" {
  type    = string
  default = "rajas"
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
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  name    = "packer-debian"
  sources = ["source.amazon-ebs.my-ami"]

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "file" {
    source      = ".env"
    destination = "/tmp/.env"
  }

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1",
      "DB_USER=${var.db_user}",
      "DB_NAME=${var.db_name}",
      "DB_PASSWORD=${var.db_password}"
    ]

    script = "./script/setup_script.sh"

  }
}