output "app_repository_url" {
  value = module.ecr.app_repository_url
}

output "firelens_repository_url" {
  value = module.ecr.firelens_repository_url
}

output "public_dns" {
  value = module.alb.public_dns
}
