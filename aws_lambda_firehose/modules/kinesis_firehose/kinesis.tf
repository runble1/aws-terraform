resource "aws_kinesis_firehose_delivery_stream" "this" {
  name        = "${var.service}-log-stream"
  destination = "extended_s3"

  extended_s3_configuration {
    role_arn   = aws_iam_role.firehose_role.arn
    bucket_arn = aws_s3_bucket.this.arn

    buffering_size     = 5
    buffering_interval = 300
    compression_format = "GZIP"
  }
}
