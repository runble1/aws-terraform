output "repository_url" {
  value = module.ecr.repository_url
}

output "function_url" {
  value = module.lambda.function_url
}

output "cloudfront_distribution_url" {
  value       = module.cloudfront.cloudfront_distribution_url
  description = "The URL of the CloudFront distribution"
}