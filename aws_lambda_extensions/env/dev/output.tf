output "function_url" {
  description = "Slack Event Subscriptions URL"
  value       = module.lambda_function.function_url
}
