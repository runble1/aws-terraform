output "function_url" {
  value = module.lambda.function_url
}

output "endpoint_url" {
  value = module.api_gateway.endpoint_url
}

output "cloudfront_distribution_url" {
  value       = module.cloudfront.cloudfront_distribution_url
  description = "The URL of the CloudFront distribution"
}
