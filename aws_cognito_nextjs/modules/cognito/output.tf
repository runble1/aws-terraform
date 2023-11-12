output "identity_pool_id" {
  value = aws_cognito_identity_pool.this.id
}

output "user_pool_id" {
  value = aws_cognito_user_pool.this.id
}

output "client_secret" {
  value = aws_cognito_user_pool_client.this.client_secret
}

output "user_pool_arn" {
  value = aws_cognito_user_pool.this.arn
}

output "cognito_user_pool_client_id" {
  value       = aws_cognito_user_pool_client.this.id
}
