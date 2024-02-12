output "public_dns" {
  value = module.alb.public_dns
}

/*
output "rds_endpoint" {
  value       = module.rds.rds_endpoint
}*/

output "cloudfront_distribution_url" {
  value       = module.cloudfront.cloudfront_distribution_url
  description = "The URL of the CloudFront distribution"
}
