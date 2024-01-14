resource "aws_cloudwatch_log_subscription_filter" "this" {
  name            = "${var.service}_subscription_filter"
  log_group_name  = aws_cloudwatch_log_group.lambda_log_group.name
  filter_pattern  = "{ $.message = \"user_activity_log\" }"
  destination_arn = var.kinesis_firehose_arn
  role_arn        = aws_iam_role.cloudwatch_to_firehose_role.arn
}
