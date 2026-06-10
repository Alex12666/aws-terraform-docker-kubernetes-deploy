# publica
resource "aws_instance" "my_public" {
  ami           = "ami-0b8b44ec9a8f90422" 
  instance_type = "t3.micro"

  key_name = "Devops-Automation"

  vpc_security_group_ids = [aws_security_group.allow_sg.id]

  subnet_id = aws_subnet.public.id
}

# Privada 
resource "aws_instance" "my_private" {
  ami           = "ami-0b8b44ec9a8f90422" 
  instance_type = "t3.micro"

  key_name = "Devops-Automation"

  vpc_security_group_ids = [aws_security_group.allow_sg.id]

  subnet_id = aws_subnet.private_subnet.id
}