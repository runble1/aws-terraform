output "kinesis_firehose_name" {
  value = aws_kinesis_firehose_delivery_stream.this.name
}

output "s3_app_access_log" {
  value = aws_s3_bucket.this.id
}
