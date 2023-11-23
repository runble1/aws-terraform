output "cloudfront_distribution_url" {
  value       = "https://${aws_cloudfront_distribution.this.domain_name}"
  description = "The URL of the CloudFront distribution"
}