output "function_url" {
  description = "Slack Event Subscriptions URL"
  value       = module.lambda.function_url
}


output "cloudfront_distribution_url" {
  value       = module.lambda.cloudfront_distribution_url
  description = "The URL of the CloudFront distribution"
}