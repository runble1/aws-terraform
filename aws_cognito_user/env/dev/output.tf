output "function_url" {
  description = "Slack Event Subscriptions URL"
  value       = module.lambda.function_url
}
output "cognito_user_pool_id" {
  value = module.cognito.cognito_user_pool_id
}
