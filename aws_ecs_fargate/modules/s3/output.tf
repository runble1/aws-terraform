output "s3_alb_bucket_name" {
  value = aws_s3_bucket.alb.bucket
}

output "s3_app_bucket_arn" {
  value = aws_s3_bucket.app.arn
}

output "s3_vpc_bucket_arn" {
  value = aws_s3_bucket.vpc.arn
}
