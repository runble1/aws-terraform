resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = var.log_group_name
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "kinesis_error" {
  name              = "/aws/kinesisfirehose/${var.function_name}-log-stream"
  retention_in_days = 30
}
