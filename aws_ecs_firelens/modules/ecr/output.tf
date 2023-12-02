output "app_repository_url" {
  value = aws_ecr_repository.this.repository_url
}

output "app_repository_name" {
  value = aws_ecr_repository.this.name
}

output "firelens_repository_url" {
  value = aws_ecr_repository.firelens.repository_url
}

output "firelens_repository_name" {
  value = aws_ecr_repository.firelens.name
}
