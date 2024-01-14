resource "aws_cloudwatch_log_group" "kinesis_log_group" {
  name              = "/aws/kinesisfirehose/${var.service}-log-stream"
  retention_in_days = 30
}
