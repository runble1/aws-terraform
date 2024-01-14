output "kinesis_firehose_arn" {
  value = aws_kinesis_firehose_delivery_stream.this.arn
}
