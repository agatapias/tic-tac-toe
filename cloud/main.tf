provider "aws" {
  region = "us-east-1"
}

# Create a vpc 
resource "aws_vpc" "tic_tac_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    name = "tic-tac-vpc"
  }
}

# Create an internet gateway
resource "aws_internet_gateway" "tic_tac_int_gateway" {
  vpc_id = aws_vpc.tic_tac_vpc.id
  tags = {
    name = "tic_tac_int_gateway"
  }
}


# Create subnet
resource "aws_subnet" "public_subnet" {
  vpc_id     = aws_vpc.tic_tac_vpc.id
  cidr_block = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone = "us-east-1a"
  tags = {
    Name = "public_subnet"
  }
}


# Create route table
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.tic_tac_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.tic_tac_int_gateway.id
  }

  tags = {
    Name = "public_route_table"
  }
}


# Create an association
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_route_table.id
}


# Create a security group to allow ingoing ports
resource "aws_security_group" "tic_tac_security" {
  name        = "tic_tac_security_group"
  description = "security group for the EC2 instance"
  vpc_id      = aws_vpc.tic_tac_vpc.id
  ingress = [
    {
      description      = "https traffic"
      from_port        = 443
      to_port          = 443
      protocol         = "tcp"
      cidr_blocks      = ["0.0.0.0/0", aws_vpc.tic_tac_vpc.cidr_block]
      ipv6_cidr_blocks  = []
      prefix_list_ids   = []
      security_groups   = []
      self              = false
    },
    {
      description      = "http traffic"
      from_port        = 80
      to_port          = 80
      protocol         = "tcp"
      cidr_blocks      = ["0.0.0.0/0", aws_vpc.tic_tac_vpc.cidr_block]
      ipv6_cidr_blocks  = []
      prefix_list_ids   = []
      security_groups   = []
      self              = false
    },
    {
      description      = "ssh"
      from_port        = 22
      to_port          = 22
      protocol         = "tcp"
      cidr_blocks      = ["0.0.0.0/0", aws_vpc.tic_tac_vpc.cidr_block]
      ipv6_cidr_blocks  = []
      prefix_list_ids   = []
      security_groups   = []
      self              = false
    },
    {
      description      = "http traffic"
      from_port        = 8081
      to_port          = 8081
      protocol         = "tcp"
      cidr_blocks      = ["0.0.0.0/0", aws_vpc.tic_tac_vpc.cidr_block]
      ipv6_cidr_blocks  = []
      prefix_list_ids   = []
      security_groups   = []
      self              = false
    },
    {
      description      = "http traffic"
      from_port        = 3000
      to_port          = 3000
      protocol         = "tcp"
      cidr_blocks      = ["0.0.0.0/0", aws_vpc.tic_tac_vpc.cidr_block]
      ipv6_cidr_blocks  = []
      prefix_list_ids   = []
      security_groups   = []
      self              = false
    }
  ]
  egress = [
    {
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = ["0.0.0.0/0"]
      description      = "Outbound traffic rule"
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      security_groups  = []
      self             = false
    }
  ]
  tags = {
    name = "web_security"
  }
}


# Create frontend and backend instances
resource "aws_instance" "frontend_instance" {
  ami           = "ami-080e1f13689e07408"
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public_subnet.id
  security_groups = [aws_security_group.tic_tac_security.id]
  user_data = file("${path.module}/front_user_data.sh")

  tags = {
    Name = "frontend_instance"
  }
}

resource "aws_instance" "backend_instance" {
  ami           = "ami-080e1f13689e07408"
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public_subnet.id
  security_groups = [aws_security_group.tic_tac_security.id]
  user_data = file("${path.module}/back_user_data.sh")

  tags = {
    Name = "backend_instance"
  }
}
