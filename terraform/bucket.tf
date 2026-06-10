resource "aws_s3_bucket" "my-bucket" {
  bucket = "my-alexandre-maia-devops"

  tags = {
    Name        = "mapa de salvamento"
    Environment = "Dev bucket salva inforaçao de alteraçao"
  }
}