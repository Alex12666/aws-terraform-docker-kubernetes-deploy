resource "aws_ecr_repository" "imagem-docker" {
  name                 = "imagem_docker"
  image_tag_mutability = "MUTABLE"


}

