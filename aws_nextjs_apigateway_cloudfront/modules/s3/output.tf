output "bucket_id" {
  value = aws_s3_bucket.origin_contents.id
}

output "bucket_arn" {
  value = aws_s3_bucket.origin_contents.arn
}

output "bucket_regional_domain_name" {
  value = aws_s3_bucket.origin_contents.bucket_regional_domain_name
}
