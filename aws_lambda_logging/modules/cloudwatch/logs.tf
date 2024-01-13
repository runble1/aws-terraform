resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = var.log_group_name
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "lambda_another_log_group" {
  name              = "${var.log_group_name}-test"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "kinesis_firehose_log_group" {
  name              = "/aws/kinesisfirehose/${var.function_name}-log-group"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_stream" "kinesis_firehose_log_stream" {
  name           = "${var.function_name}-log-stream"
  log_group_name = aws_cloudwatch_log_group.kinesis_firehose_log_group.name
}
