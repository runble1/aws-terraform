output "sns_topic_arn" {
  description = "Slack Event Subscriptions URL"
  value       = aws_sns_topic.lambdas_errors.arn
}

output "cloudwatch_log_name" {
  value = aws_cloudwatch_log_group.lambda_log_group.name
}