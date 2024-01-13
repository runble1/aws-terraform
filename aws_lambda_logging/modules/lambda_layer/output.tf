output "layer_arn" {
  description = "Slack Event Subscriptions URL"
  value       = aws_lambda_layer_version.lambda_extension_layer.arn
}
