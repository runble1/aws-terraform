output "cloudfront_distribution_url" {
  value       = module.cloudfront.cloudfront_distribution_url
  description = "The URL of the CloudFront distribution"
}
