/*
output "function_url" {
  description = "Slack Event Subscriptions URL"
  value       = module.lambda.function_url
}

output "cloudfront_distribution_url" {
  value       = module.lambda.cloudfront_distribution_url
  description = "The URL of the CloudFront distribution"
}*/

output "get_endpoint_url" {
  description = "The URL of the API endpoint"
  value       = module.api_gateway.get_endpoint_url
}

output "post_endpoint_url" {
  description = "The URL of the API endpoint"
  value       = module.api_gateway.post_endpoint_url
}