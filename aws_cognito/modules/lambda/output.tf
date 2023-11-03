output "function_url" {
  description = "Slack Event Subscriptions URL"
  value       = aws_lambda_function_url.this.function_url
}
