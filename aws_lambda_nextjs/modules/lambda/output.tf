output "function_url" {
  description = "Slack Event Subscriptions URL"
  value       = aws_lambda_function_url.this.function_url
}


output "cloudfront_distribution_url" {
  value       = "https://${aws_cloudfront_distribution.this.domain_name}"
  description = "The URL of the CloudFront distribution"
}