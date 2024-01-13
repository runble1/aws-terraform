output "kinesis_firehose_log_group" {
  value = aws_cloudwatch_log_group.kinesis_firehose_log_group.name
}

output "kinesis_firehose_log_stream" {
  value = aws_cloudwatch_log_stream.kinesis_firehose_log_stream.name
}

output "lambda_another_log_group" {
  value = aws_cloudwatch_log_group.lambda_another_log_group.name
}
